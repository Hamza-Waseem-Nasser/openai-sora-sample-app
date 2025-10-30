import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { ImageIcon, Loader2, Sparkles, Wand2, X, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "../ui";
import TemplatesSection from "@/components/TemplatesSection";
import SocialMediaPresets from "@/components/SocialMediaPresets";
import {
  MIN_SECONDS,
  MAX_SECONDS,
  type SizeOptionGroups,
  type SoraModel,
  type SoraSeconds,
} from "../utils/video";
import type { ImagePreviewMeta } from "../hooks/useVideoForm";
import type { GeneratedImageSuggestion } from "@/types/generated";
import type { MarketingTemplate } from "@/utils/marketingTemplates";

type AsyncMaybe = void | Promise<unknown>;

const VERSION_OPTIONS = [1, 2, 3, 4];

type OrientationId = "portrait" | "landscape" | "square";

const formatSizeKey = (orientation: OrientationId, sizeValue: string) =>
  `${orientation}|${sizeValue}`;

const parseSizeKey = (
  key: string
): { orientation: OrientationId; size: string } => {
  const [rawOrientation, rawSize] = key.split("|", 2);
  let orientation: OrientationId = "landscape";
  if (rawOrientation === "portrait") orientation = "portrait";
  else if (rawOrientation === "square") orientation = "square";
  return { orientation, size: rawSize ?? key };
};

const deriveSizeKey = (
  sizeValue: string,
  groups: SizeOptionGroups,
  preferredOrientation?: OrientationId
) => {
  const matches = (orientation: OrientationId) => {
    const options = groups[orientation] ?? [];
    return options.includes(sizeValue)
      ? formatSizeKey(orientation, sizeValue)
      : null;
  };

  if (preferredOrientation) {
    const preferred = matches(preferredOrientation);
    if (preferred) return preferred;
  }

  return (
    matches("portrait") ||
    matches("square") ||
    matches("landscape") ||
    formatSizeKey("landscape", sizeValue)
  );
};

const CONTROL_TRIGGER_CLASS =
  "flex h-9 items-center gap-2 rounded-full border border-border/60 bg-card px-3 text-sm text-foreground/90 shadow-none transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 data-[state=open]:bg-card/90";

const CONTROL_TRIGGER_CONTENT_CLASS = "flex w-full items-center gap-3";

const CONTROL_TRIGGER_LABEL_CLASS =
  "mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground";

const CONTROL_TRIGGER_VALUE_CLASS = "flex-1 truncate text-foreground";

const CONTROL_CONTENT_CLASS =
  "rounded-xl border border-border/60 bg-card/95 p-0 shadow-none";

export interface BatchProgressState {
  total: number;
  current: number;
}

export interface VideoFormProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  model: SoraModel;
  onModelChange: (value: SoraModel) => void;
  modelOptions: readonly SoraModel[];
  size: string;
  onSizeChange: (value: string) => void;
  sizeOptionGroups: SizeOptionGroups;
  seconds: SoraSeconds;
  onSecondsChange: (value: SoraSeconds) => void;
  versionsCount: number;
  onVersionsCountChange: (value: number) => void;
  remixId: string;
  onRemixIdChange: (value: string) => void;
  onImageSelect: (event: ChangeEvent<HTMLInputElement>) => AsyncMaybe;
  imagePreviewUrl: string | null;
  imagePreviewMeta: ImagePreviewMeta | null;
  onGenerateImages: () => AsyncMaybe;
  generatingImages: boolean;
  generatedImages: GeneratedImageSuggestion[];
  onSelectGeneratedImage: (image: GeneratedImageSuggestion) => AsyncMaybe;
  onClearGeneratedImages: () => void;
  selectedGeneratedImageId: string | null;
  generatedImageError: string;
  onSubmit: () => AsyncMaybe;
  onClear: () => void;
  onGeneratePrompt?: () => AsyncMaybe;
  generatingPrompt?: boolean;
  submitting: boolean;
  canSubmit: boolean;
  generatingTitle: boolean;
  currentTitle: string;
  batchProgress: BatchProgressState | null;
  remixDisabled: boolean;
}

const VideoForm = ({
  prompt,
  onPromptChange,
  model,
  onModelChange,
  modelOptions,
  size,
  onSizeChange,
  sizeOptionGroups,
  seconds,
  onSecondsChange,
  versionsCount,
  onVersionsCountChange,
  remixId,
  onRemixIdChange,
  onImageSelect,
  imagePreviewUrl,
  imagePreviewMeta,
  onGenerateImages,
  generatingImages,
  generatedImages = [],
  onSelectGeneratedImage,
  onClearGeneratedImages,
  selectedGeneratedImageId,
  generatedImageError,
  onSubmit,
  onClear,
  onGeneratePrompt,
  generatingPrompt = false,
  submitting,
  canSubmit,
  generatingTitle,
  currentTitle,
  batchProgress,
  remixDisabled,
}: VideoFormProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const versionValue = useMemo(() => {
    const parsed = Number(versionsCount) || 1;
    const normalized = Math.min(4, Math.max(1, parsed));
    return String(normalized);
  }, [versionsCount]);

  const sizeSections = useMemo(
    () =>
      (
        [
          {
            id: "portrait" as OrientationId,
            label: "Portrait",
            options: sizeOptionGroups.portrait,
          },
          {
            id: "landscape" as OrientationId,
            label: "Landscape",
            options: sizeOptionGroups.landscape,
          },
        ] as const
      ).filter((section) => section.options.length > 0),
    [sizeOptionGroups]
  );

  const [sizeSelectionKey, setSizeSelectionKey] = useState(() =>
    deriveSizeKey(size, sizeOptionGroups)
  );
  const [selectedPresetKey, setSelectedPresetKey] = useState<string | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<GeneratedImageSuggestion | null>(null);

  useEffect(() => {
    setSizeSelectionKey((previous) => {
      const { orientation } = parseSizeKey(previous);
      const next = deriveSizeKey(size, sizeOptionGroups, orientation);
      return previous === next ? previous : next;
    });
  }, [size, sizeOptionGroups]);

  const hasPrompt = prompt.trim().length > 0;
  const promptTooltip = hasPrompt
    ? "Uses your current prompt to guide the result."
    : "Add a prompt to enable this action.";

  const handleGeneratePromptClick = () => {
    if (!hasPrompt || !onGeneratePrompt) return;
    void onGeneratePrompt();
  };

  const handleVersionChange = (value: string) => {
    const parsed = Number(value);
    onVersionsCountChange(Number.isFinite(parsed) ? parsed : 1);
  };

  const handleSizeSelect = (value: string) => {
    const { orientation, size: nextSize } = parseSizeKey(value);
    setSizeSelectionKey(formatSizeKey(orientation, nextSize));
    onSizeChange(nextSize);
    setSelectedPresetKey(undefined); // Clear preset selection when manually changing size
  };

  const triggerFileDialog = () => {
    if (remixDisabled) return;
    fileInputRef.current?.click();
  };

  const handleSelectTemplate = (template: MarketingTemplate) => {
    onPromptChange(template.prompt);
    onModelChange(template.suggestedModel);
    onSizeChange(template.suggestedSize);
    onSecondsChange(template.suggestedSeconds);
  };

  const handleDownloadImage = (image: GeneratedImageSuggestion, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the image when clicking download
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `generated-image-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const promptHasImage = Boolean(imagePreviewUrl);

  return (
    <Card className="flex h-full flex-col overflow-hidden border-none  shadow-none">
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-y-auto space-y-6 px-0">
        <section className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-none backdrop-blur-sm">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <label
                htmlFor="remix-id"
                className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
              >
                Remix from video ID
              </label>
              <Input
                id="remix-id"
                value={remixId}
                onChange={(event) => onRemixIdChange(event.target.value)}
                placeholder="video_..."
                className="h-9 w-full max-w-xs rounded-none border-0 border-b border-border/70 bg-transparent px-0 text-sm text-foreground shadow-none transition focus-visible:border-border focus-visible:outline-none focus-visible:ring-0"
              />
            </div>

            <div className="relative">
              <InputGroup
                className={cn(
                  "flex gap-0 rounded-xl bg-muted/40 focus-within:ring-0 focus-within:ring-offset-0",
                  remixDisabled ? "opacity-80" : ""
                )}
              >
                <div className="relative w-full">
                  {promptHasImage ? (
                    <div className="absolute left-5 top-5 flex gap-3">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-border/50 bg-card/40">
                        {imagePreviewUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imagePreviewUrl}
                            alt="Prompt reference"
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <InputGroupTextarea
                    value={prompt}
                    onChange={(event) => onPromptChange(event.target.value)}
                    placeholder="Describe the scene you want Sora to create..."
                    className={cn(
                      "min-h-[220px] w-full resize-none border-0 bg-transparent px-6 pb-16 pt-6 text-base leading-relaxed text-foreground",
                      promptHasImage ? "pl-[7.5rem]" : ""
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onClear}
                    className="absolute right-5 top-5 h-8 w-8 rounded-full border border-border/60 bg-card/85 text-muted-foreground hover:text-foreground"
                    aria-label="Clear form"
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {imagePreviewMeta ? (
                    <p className="text-xs text-muted-foreground pb-2 pl-2">
                      {imagePreviewMeta.name} • {imagePreviewMeta.width}x
                      {imagePreviewMeta.height}
                    </p>
                  ) : null}
                </div>

                <InputGroupAddon
                  align="block-end"
                  className="flex w-full flex-col gap-2 px-4 pb-4 pt-3 text-sm bg-transparent rounded-xl text-muted-foreground"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={remixDisabled}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      void onImageSelect(event);
                    }}
                  />
                  <div className="flex w-full items-center gap-3 overflow-x-auto pb-1">
                    <InputGroupButton
                      size="sm"
                      variant="ghost"
                      onClick={triggerFileDialog}
                      disabled={remixDisabled}
                      className="whitespace-nowrap bg-card rounded-full py-1 border border-dashed border-border/70 px-3 text-sm text-muted-foreground hover:border-border hover:bg-muted/60"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Add image
                    </InputGroupButton>

                    <div className="flex min-w-max items-center gap-2">
                      <Select
                        value={model}
                        onValueChange={(value: string) =>
                          onModelChange(value as SoraModel)
                        }
                        disabled={remixDisabled}
                      >
                        <SelectTrigger className={CONTROL_TRIGGER_CLASS}>
                          <div className={CONTROL_TRIGGER_CONTENT_CLASS}>
                            <span className={CONTROL_TRIGGER_LABEL_CLASS}>
                              Model
                            </span>
                            <div className={CONTROL_TRIGGER_VALUE_CLASS}>
                              <SelectValue placeholder="Model" />
                            </div>
                          </div>
                        </SelectTrigger>
                        <SelectContent className={CONTROL_CONTENT_CLASS}>
                          <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                            Model
                          </div>
                          {modelOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={sizeSelectionKey}
                        onValueChange={handleSizeSelect}
                        disabled={remixDisabled}
                      >
                        <SelectTrigger className={CONTROL_TRIGGER_CLASS}>
                          <div className={CONTROL_TRIGGER_CONTENT_CLASS}>
                            <span className={CONTROL_TRIGGER_LABEL_CLASS}>
                              Size
                            </span>
                            <div className={CONTROL_TRIGGER_VALUE_CLASS}>
                              <SelectValue placeholder="Size" />
                            </div>
                          </div>
                        </SelectTrigger>
                        <SelectContent className={CONTROL_CONTENT_CLASS}>
                          {sizeSections.map((section) => (
                            <Fragment key={section.label}>
                              <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                                {section.label}
                              </div>
                              {section.options.map((option) => (
                                <SelectItem
                                  key={`${section.id}-${option}`}
                                  value={formatSizeKey(section.id, option)}
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </Fragment>
                          ))}
                        </SelectContent>
                      </Select>

                      <div className={CONTROL_TRIGGER_CLASS}>
                        <div className={CONTROL_TRIGGER_CONTENT_CLASS}>
                          <span className={CONTROL_TRIGGER_LABEL_CLASS}>
                            Seconds
                          </span>
                          <Input
                            type="number"
                            min={MIN_SECONDS}
                            max={MAX_SECONDS}
                            value={seconds}
                            onChange={(e) => {
                              const value = e.target.value;
                              const numValue = parseInt(value, 10);
                              if (value === '' || (numValue >= MIN_SECONDS && numValue <= MAX_SECONDS)) {
                                onSecondsChange(value as SoraSeconds);
                              }
                            }}
                            disabled={remixDisabled}
                            className="h-7 w-16 rounded border border-border/60 bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50"
                            placeholder="1-12"
                          />
                        </div>
                      </div>

                      <Select
                        value={versionValue}
                        onValueChange={handleVersionChange}
                      >
                        <SelectTrigger className={CONTROL_TRIGGER_CLASS}>
                          <div className={CONTROL_TRIGGER_CONTENT_CLASS}>
                            <span className={CONTROL_TRIGGER_LABEL_CLASS}>
                              Versions
                            </span>
                            <div className={CONTROL_TRIGGER_VALUE_CLASS}>
                              <SelectValue placeholder="Versions" />
                            </div>
                          </div>
                        </SelectTrigger>
                        <SelectContent className={CONTROL_CONTENT_CLASS}>
                          <div className="px-3 py-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                            Versions
                          </div>
                          {VERSION_OPTIONS.map((option) => {
                            const value = String(option);
                            return (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>

            {/* Social Media Presets */}
            <div className="px-4 pb-4">
              <SocialMediaPresets
                currentSize={size}
                selectedPresetKey={selectedPresetKey}
                onSelectPreset={(size, label, presetKey) => {
                  onSizeChange(size);
                  setSelectedPresetKey(presetKey);
                }}
              />
            </div>

            <TooltipProvider delayDuration={150}>
              <div className="flex flex-col md:flex-row md:items-center justify-end gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={handleGeneratePromptClick}
                        disabled={
                          !hasPrompt || generatingPrompt || !onGeneratePrompt
                        }
                        className="w-full rounded-full bg-muted/60 px-5 text-xs text-foreground hover:bg-muted/70 disabled:opacity-50 md:w-auto md:text-sm"
                      >
                        {generatingPrompt ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Generate prompt
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-md border border-border bg-card/95 px-3 py-1.5 text-xs text-muted-foreground shadow-none">
                    Generate reference images using DALL-E to use as input for your video
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        disabled={
                          !hasPrompt || remixDisabled || generatingImages
                        }
                        onClick={() => {
                          if (!hasPrompt) return;
                          void onGenerateImages();
                        }}
                        className="w-full rounded-full bg-muted/60 px-5 text-xs text-foreground hover:bg-muted/70 disabled:opacity-50 md:w-auto md:text-sm"
                      >
                        {generatingImages ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                        Generate image
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-md border border-border bg-card/95 px-3 py-1.5 text-xs text-muted-foreground shadow-none">
                    {promptTooltip}
                  </TooltipContent>
                </Tooltip>

                <Button
                  onClick={() => {
                    void onSubmit();
                  }}
                  disabled={submitting || !canSubmit}
                  size="lg"
                  className="rounded-full px-6 text-xs font-semibold md:text-sm"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  Generate video
                </Button>
              </div>
            </TooltipProvider>
          </div>
        </section>

        <div className="space-y-4">
          {generatingTitle ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating title...</span>
            </div>
          ) : null}

          {!generatingTitle && currentTitle ? (
            <div className="rounded-lg border border-border bg-card/80 px-4 py-6 text-sm text-foreground">
              <span className="font-medium">Generated title:</span>{" "}
              {currentTitle}
            </div>
          ) : null}

          {generatedImageError ? (
            <p className="text-xs text-destructive">{generatedImageError}</p>
          ) : null}

          {generatedImages.length > 0 ? (
            <section className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-none">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Generated suggestions
                  </p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {generatedImages.length}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClearGeneratedImages}
                  className="h-6 gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear all
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {generatedImages.map((image) => {
                  const isSelected = selectedGeneratedImageId === image.id;
                  return (
                    <div key={image.id} className="relative group">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewImage(image)}
                        className={cn(
                          "relative flex h-auto w-full overflow-hidden rounded-lg border bg-card p-0 cursor-pointer",
                          isSelected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="relative h-24 w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image.url}
                            alt={image.description || "Generated option"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {isSelected ? (
                          <span className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">
                              Selected
                            </span>
                          </span>
                        ) : null}
                      </Button>
                      {/* Download button */}
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        onClick={(e) => handleDownloadImage(image, e)}
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        title="Download image"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>

        <TemplatesSection onSelectTemplate={handleSelectTemplate} />

        <div className="space-y-4">
          {batchProgress && batchProgress.total > 1 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                Generating version {batchProgress.current} of{" "}
                {batchProgress.total}...
              </span>
            </div>
          ) : null}
        </div>
      </CardContent>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] flex flex-col bg-background rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Image Preview</h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setPreviewImage(null)}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Image */}
            <div className="flex-1 overflow-auto p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewImage.url}
                alt={previewImage.description || "Preview"}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-border px-4 py-3 gap-3">
              <p className="text-xs text-muted-foreground">
                {previewImage.description || "Generated image"}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    handleDownloadImage(previewImage, e);
                  }}
                  className="gap-2"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    void onSelectGeneratedImage(previewImage);
                    setPreviewImage(null);
                  }}
                  className="gap-2"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  Use for Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default VideoForm;

export type { GeneratedImageSuggestion } from "@/types/generated";
