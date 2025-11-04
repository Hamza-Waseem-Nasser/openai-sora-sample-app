export const cropImageToCover = (
  file: File,
  targetWidth: number,
  targetHeight: number,
): Promise<File> => new Promise((resolve, reject) => {
  const img = new Image();
  const url = URL.createObjectURL(file);

  img.onload = () => {
    URL.revokeObjectURL(url);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas context unavailable"));
      return;
    }

    const sourceRatio = img.width / img.height;
    const targetRatio = targetWidth / targetHeight;
    let sx: number;
    let sy: number;
    let sWidth: number;
    let sHeight: number;

    if (sourceRatio > targetRatio) {
      sHeight = img.height;
      sWidth = targetRatio * sHeight;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.width;
      sHeight = sWidth / targetRatio;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

    const outputType = file.type || "image/png";
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to process image"));
        return;
      }

      const ext = outputType.split("/")[1] || "png";
      const baseName = file.name.replace(/\.[^.]+$/, "");
      const croppedFile = new File(
        [blob],
        `${baseName}-${targetWidth}x${targetHeight}.${ext}`,
        { type: outputType },
      );
      resolve(croppedFile);
    }, outputType);
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error("Unable to load image"));
  };

  img.src = url;
});

export const dataUrlToFile = async (
  dataUrl: string,
  filename = "generated.png",
): Promise<File> => {
  if (!dataUrl) throw new Error("Missing data URL");
  const response = await fetch(dataUrl);
  if (!response.ok) {
    throw new Error("Failed to convert data URL");
  }
  const blob = await response.blob();
  const type = blob.type || "image/png";
  return new File([blob], filename, { type });
};

export const fetchImageAsFile = async (
  url: string,
  filename = "generated.png",
): Promise<File> => {
  if (!url) throw new Error("Missing image URL");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch image");
  }
  const blob = await response.blob();
  const type = blob.type || "image/png";
  return new File([blob], filename, { type });
};

/**
 * Compose multiple images into a single composite image
 * Images are arranged in a grid layout (2 columns for 2-4 images, 3 columns for 5-9 images)
 */
export const composeMultipleImages = (
  files: File[],
  targetWidth: number,
  targetHeight: number,
): Promise<File> => new Promise((resolve, reject) => {
  if (!files.length) {
    reject(new Error("No images to compose"));
    return;
  }

  if (files.length === 1) {
    // If only one image, just crop it normally
    cropImageToCover(files[0], targetWidth, targetHeight)
      .then(resolve)
      .catch(reject);
    return;
  }

  // Determine grid layout based on number of images
  let cols: number;
  let rows: number;
  
  if (files.length <= 2) {
    cols = 2;
    rows = 1;
  } else if (files.length <= 4) {
    cols = 2;
    rows = 2;
  } else if (files.length <= 6) {
    cols = 3;
    rows = 2;
  } else if (files.length <= 9) {
    cols = 3;
    rows = 3;
  } else {
    // Limit to 9 images max
    cols = 3;
    rows = 3;
  }

  const imagesToUse = files.slice(0, cols * rows);
  const cellWidth = targetWidth / cols;
  const cellHeight = targetHeight / rows;

  // Load all images
  const imageElements: HTMLImageElement[] = [];
  let loadedCount = 0;

  const checkAllLoaded = () => {
    if (loadedCount === imagesToUse.length) {
      // Create composite canvas
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      // Fill background with black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Draw each image in grid
      imageElements.forEach((img, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * cellWidth;
        const y = row * cellHeight;

        // Calculate scaling to cover the cell
        const imgRatio = img.width / img.height;
        const cellRatio = cellWidth / cellHeight;
        
        let sx: number, sy: number, sWidth: number, sHeight: number;
        
        if (imgRatio > cellRatio) {
          sHeight = img.height;
          sWidth = cellRatio * sHeight;
          sx = (img.width - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = img.width;
          sHeight = sWidth / cellRatio;
          sx = 0;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, cellWidth, cellHeight);
      });

      // Convert to file
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create composite image"));
          return;
        }

        const compositeFile = new File(
          [blob],
          `composite-${imagesToUse.length}-images-${targetWidth}x${targetHeight}.png`,
          { type: "image/png" }
        );
        resolve(compositeFile);
      }, "image/png");
    }
  };

  imagesToUse.forEach((file) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      imageElements.push(img);
      loadedCount++;
      checkAllLoaded();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
});
