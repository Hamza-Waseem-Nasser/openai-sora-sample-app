# Multiple Images Support for Sora Video Generation

## Overview

This feature allows users to upload multiple images (up to 9) that will be automatically composed into a single composite image for the Sora video generation API. The Sora API only accepts a single `input_reference` image, so we've implemented an intelligent image composition system that combines multiple images into a grid layout.

## How It Works

### 1. **User Upload**
- Users can now select multiple images (up to 9) through the file input dialog
- Images can be added all at once or incrementally
- Each image is displayed as a thumbnail with a remove button
- A visual indicator shows when the maximum of 9 images has been reached

### 2. **Image Composition**
- When multiple images are selected, they are automatically arranged in a grid layout:
  - **1 image**: No composition, just cropped to target size
  - **2 images**: 2 columns × 1 row
  - **3-4 images**: 2 columns × 2 rows
  - **5-6 images**: 3 columns × 2 rows
  - **7-9 images**: 3 columns × 3 rows
- Each image is cropped to cover its grid cell (center-cropped to maintain aspect ratio)
- The final composite matches the exact dimensions required by Sora (e.g., 1280×720)

### 3. **API Integration**
- The composite image is created automatically before video generation
- The API receives a single PNG image that represents all uploaded images
- The filename includes metadata: `composite-{count}-images-{width}x{height}.png`

## Technical Implementation

### Files Modified

#### 1. **utils/image.ts**
Added `composeMultipleImages()` function that:
- Takes an array of image files and target dimensions
- Determines optimal grid layout based on image count
- Loads all images asynchronously
- Renders them onto a canvas in a grid pattern
- Returns a single composite File object

#### 2. **hooks/useVideoForm.ts**
Updated to support multiple images:
- Changed from `imageFile` to `imageFiles` array
- Added `ImageFileWithPreview` interface for tracking preview URLs
- Added `compositeImageFile` state for the final composite
- Implemented `handleRemoveImage()` for removing individual images
- Updated `handleImageSelect()` to accept multiple files
- Added automatic composition via `useEffect` when images change
- Proper cleanup of preview URLs to prevent memory leaks

#### 3. **components/VideoForm.tsx**
UI updates for multiple images:
- Added `ImageFileWithPreview` interface import
- Updated props to include `imageFiles` array and `onRemoveImage` callback
- Added `multiple` attribute to file input
- Replaced single image preview with grid of thumbnails
- Each thumbnail has a hover-activated remove button
- Shows "+ Add" button when fewer than 9 images
- Updated info text to show image count and composite dimensions
- Adjusted textarea padding to accommodate multiple image rows

#### 4. **components/App.tsx**
Integration updates:
- Replaced `imageFile` with `compositeImageFile` for API calls
- Added `imageFiles` and `handleRemoveImage` from useVideoForm hook
- Passed new props to VideoForm component
- Updated dependency arrays in useCallbacks

## User Experience

### Adding Images
1. Click "Add images" button
2. Select one or multiple images from file dialog (Ctrl/Cmd + click for multiple)
3. Images appear as thumbnails above the prompt textarea
4. Can add more images later (up to 9 total)

### Removing Images
1. Hover over any image thumbnail
2. Click the red X button in the top-right corner
3. Image is removed and composite is regenerated

### Viewing Composite
- The info text below the prompt shows:
  - Number of images selected
  - Final composite dimensions
  - Example: "3 images • Composite: 1280x720"

### Video Generation
- When you click "Generate Video", the system:
  1. Automatically creates a composite image from all selected images
  2. Sends the composite to the Sora API as a single reference image
  3. Sora uses this composite to guide video generation

## Benefits

### For Users
- **Context-Rich Prompts**: Provide multiple visual references for complex scenes
- **Scene Composition**: Combine different elements (character, background, objects) in separate images
- **Style References**: Mix multiple style references for unique results
- **Easy Management**: Simple UI to add/remove images

### For Developers
- **Clean API Integration**: Maintains compatibility with Sora's single-image constraint
- **Automatic Processing**: Composition happens transparently
- **Memory Efficient**: Proper cleanup of preview URLs
- **Type-Safe**: Full TypeScript support with proper interfaces

## Example Use Cases

1. **Character + Background**
   - Upload 1 image of a character
   - Upload 1 image of a background/setting
   - Sora creates video using both references

2. **Multi-Object Scene**
   - Upload images of different objects
   - Sora combines them in the generated video

3. **Style Transfer**
   - Upload multiple style reference images
   - Sora blends the styles in the output

4. **Storyboard**
   - Upload up to 9 key frame images
   - Sora creates video connecting the scenes

## Limitations

1. **Maximum 9 Images**: To maintain composition quality and prevent overly complex grids
2. **Automatic Layout**: Grid layout is determined algorithmically, not customizable by user
3. **Equal Cell Sizes**: All images get equal space in the grid
4. **Center Cropping**: Images are center-cropped to fit grid cells

## Future Enhancements (Potential)

- Custom grid layouts
- Drag-and-drop reordering
- Per-image weights or importance
- Preview of composite before generation
- Save/load image sets
- Batch processing with different image combinations

## Technical Notes

### Memory Management
- All preview URLs are properly revoked when:
  - Images are removed
  - New images are added
  - Component unmounts
  - Form is cleared

### Performance
- Image composition is async and non-blocking
- Uses Canvas API for efficient rendering
- Only recomposes when image array changes

### Compatibility
- Works with PNG, JPEG, and WebP formats
- Output composite is always PNG for maximum quality
- Maintains Sora API size requirements (720×1280, 1280×720, etc.)

## Testing Recommendations

1. **Single Image**: Verify no composition occurs
2. **Multiple Images**: Test 2, 4, 6, 9 images to verify grid layouts
3. **Add/Remove**: Test adding and removing images dynamically
4. **Memory**: Check for memory leaks in browser dev tools
5. **Generation**: Verify video generation works with composite image
6. **Edge Cases**: Test with very large/small images, different aspect ratios

---

**Implementation Date**: November 2, 2025
**Feature Status**: ✅ Complete and Ready for Testing
