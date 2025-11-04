import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import usePersistedState from "./usePersistedState";
import {
  DEFAULT_SIZE,
  MODEL_OPTIONS,
  SECONDS_OPTIONS,
  getModelSizeOptions,
  sanitizeModel,
  sanitizeSizeForModel,
  ensurePrompt,
  parseSize,
  sanitizeSeconds,
  type SoraModel,
  type SizeOptionGroups,
  type VideoItem,
  type SoraSeconds,
} from "../utils/video";
import { cropImageToCover, dataUrlToFile, fetchImageAsFile, composeMultipleImages } from "../utils/image";

export interface ImagePreviewMeta {
  name: string;
  width: number;
  height: number;
}

export interface ImageFileWithPreview {
  file: File;
  previewUrl: string;
  id: string;
}

export interface UseVideoFormResult {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  model: SoraModel;
  setModel: Dispatch<SetStateAction<SoraModel>>;
  size: string;
  setSize: Dispatch<SetStateAction<string>>;
  seconds: SoraSeconds;
  setSeconds: Dispatch<SetStateAction<SoraSeconds>>;
  versionsCount: number;
  setVersionsCount: Dispatch<SetStateAction<number>>;
  remixId: string;
  setRemixId: Dispatch<SetStateAction<string>>;
  imageFiles: ImageFileWithPreview[];
  compositeImageFile: File | null;
  imagePreviewUrl: string | null;
  imagePreviewMeta: ImagePreviewMeta | null;
  handleImageSelect: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveImage: (id: string) => void;
  applyImageFile: (file: File | null, currentSize?: string) => Promise<void>;
  handleGeneratedImageDataUrl: (dataUrl: string, filename?: string, currentSize?: string) => Promise<void>;
  handleGeneratedImageUrl: (url: string, filename?: string, currentSize?: string) => Promise<void>;
  clearForm: () => void;
  applyVideoToForm: (item: Partial<VideoItem> | null, currentPrompt?: string) => void;
  sizeOptionGroups: SizeOptionGroups;
}

const useVideoForm = (): UseVideoFormResult => {
  const [prompt, setPrompt] = useState<string>("");
  const [model, setModel] = usePersistedState<SoraModel>("sora.model", MODEL_OPTIONS[0]);
  const [size, setSize] = usePersistedState<string>("sora.size", DEFAULT_SIZE);
  const [seconds, setSeconds] = usePersistedState<SoraSeconds>("sora.seconds", "4");
  const [versionsCount, setVersionsCount] = usePersistedState<number>("sora.versions", 1);
  const [imageFiles, setImageFiles] = useState<ImageFileWithPreview[]>([]);
  const [compositeImageFile, setCompositeImageFile] = useState<File | null>(null);
  const [remixId, setRemixId] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imagePreviewMeta, setImagePreviewMeta] = useState<ImagePreviewMeta | null>(null);

  const resolvedModel = sanitizeModel(model);
  useEffect(() => {
    if (model !== resolvedModel) {
      setModel(resolvedModel);
    }
  }, [model, resolvedModel, setModel]);

  const resolvedSize = sanitizeSizeForModel(size, resolvedModel);
  useEffect(() => {
    if (size !== resolvedSize) {
      setSize(resolvedSize);
    }
  }, [size, resolvedSize, setSize]);
  
  // Auto-adjust seconds when model changes
  useEffect(() => {
    const validatedSeconds = sanitizeSeconds(seconds, resolvedModel) as SoraSeconds;
    if (seconds !== validatedSeconds) {
      setSeconds(validatedSeconds);
    }
  }, [resolvedModel, seconds, setSeconds]);

  const sizeOptionGroups = useMemo<SizeOptionGroups>(
    () => getModelSizeOptions(resolvedModel),
    [resolvedModel],
  );

  const clearImagePreview = useCallback(() => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl(null);
    setImagePreviewMeta(null);
  }, [imagePreviewUrl]);

  useEffect(() => () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    // Clean up all image preview URLs
    imageFiles.forEach(({ previewUrl }) => {
      URL.revokeObjectURL(previewUrl);
    });
  }, [imagePreviewUrl, imageFiles]);

  // Create composite image when image files change
  useEffect(() => {
    if (imageFiles.length === 0) {
      setCompositeImageFile(null);
      clearImagePreview();
      return;
    }

    const { width, height } = parseSize(resolvedSize);
    const files = imageFiles.map(({ file }) => file);
    
    composeMultipleImages(files, width, height)
      .then((composite) => {
        setCompositeImageFile(composite);
        setImagePreviewMeta({
          name: composite.name,
          width,
          height,
        });
        const nextUrl = URL.createObjectURL(composite);
        setImagePreviewUrl((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          return nextUrl;
        });
      })
      .catch((error) => {
        console.error("Failed to compose images:", error);
        setCompositeImageFile(null);
        clearImagePreview();
      });
  }, [imageFiles, resolvedSize, clearImagePreview]);

  const handleImageSelect = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target?.files;
    if (!files || files.length === 0) {
      return;
    }

    const newImages: ImageFileWithPreview[] = [];
    
    for (let i = 0; i < Math.min(files.length, 9); i++) {
      const file = files[i];
      const previewUrl = URL.createObjectURL(file);
      const id = `${file.name}-${file.lastModified}-${Date.now()}-${i}`;
      
      newImages.push({
        file,
        previewUrl,
        id,
      });
    }

    setImageFiles((prev) => {
      // Clean up old preview URLs
      prev.forEach(({ previewUrl }) => {
        URL.revokeObjectURL(previewUrl);
      });
      return newImages;
    });

    // Reset the file input
    event.target.value = "";
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImageFiles((prev) => {
      const imageToRemove = prev.find((img) => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  const applyImageFile = useCallback(async (file: File | null, currentSize = resolvedSize) => {
    if (!file) {
      setImageFiles([]);
      setCompositeImageFile(null);
      clearImagePreview();
      return;
    }
    
    const previewUrl = URL.createObjectURL(file);
    const id = `${file.name}-${file.lastModified}-${Date.now()}`;
    
    setImageFiles([{
      file,
      previewUrl,
      id,
    }]);
  }, [clearImagePreview, resolvedSize]);

  const handleGeneratedImageDataUrl = useCallback(async (dataUrl: string, filename = "generated.png", currentSize = resolvedSize) => {
    const file = await dataUrlToFile(dataUrl, filename);
    await applyImageFile(file, currentSize);
  }, [applyImageFile, resolvedSize]);

  const handleGeneratedImageUrl = useCallback(async (url: string, filename = "generated.png", currentSize = resolvedSize) => {
    const file = await fetchImageAsFile(url, filename);
    await applyImageFile(file, currentSize);
  }, [applyImageFile, resolvedSize]);

  const resetImage = useCallback(() => {
    imageFiles.forEach(({ previewUrl }) => {
      URL.revokeObjectURL(previewUrl);
    });
    setImageFiles([]);
    setCompositeImageFile(null);
    clearImagePreview();
  }, [clearImagePreview, imageFiles]);

  const clearForm = useCallback(() => {
    setPrompt("");
    resetImage();
    setRemixId("");
  }, [resetImage]);

  const applyVideoToForm = useCallback((item: Partial<VideoItem> | null, currentPrompt?: string) => {
    if (!item) return;
    const nextPrompt = ensurePrompt(item as VideoItem, currentPrompt ?? prompt);
    setPrompt(nextPrompt);
    const sanitizedModel = sanitizeModel((item.model as string | undefined) ?? MODEL_OPTIONS[0]);
    setModel(sanitizedModel);
    setSize(sanitizeSizeForModel((item.size as string | undefined) ?? DEFAULT_SIZE, sanitizedModel));
    setSeconds(sanitizeSeconds((item.seconds as string | number | null | undefined) ?? SECONDS_OPTIONS[0], sanitizedModel) as SoraSeconds);
    resetImage();
  }, [prompt, resetImage, setModel, setSeconds, setSize]);

  return {
    prompt,
    setPrompt,
    model: resolvedModel,
    setModel,
    size: resolvedSize,
    setSize,
    seconds,
    setSeconds,
    versionsCount,
    setVersionsCount,
    remixId,
    setRemixId,
    imageFiles,
    compositeImageFile,
    imagePreviewUrl,
    imagePreviewMeta,
    handleImageSelect,
    handleRemoveImage,
    applyImageFile,
    handleGeneratedImageDataUrl,
    handleGeneratedImageUrl,
    clearForm,
    applyVideoToForm,
    sizeOptionGroups,
  };
};

export default useVideoForm;
