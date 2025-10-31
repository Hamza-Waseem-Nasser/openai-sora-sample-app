# Sora API Specification Fixes

## Summary

This document outlines all the corrections made to align the project with the official OpenAI Sora 2 API specifications.

## Issues Fixed

### 1. ❌ Unsupported Resolutions Removed

**Problem:** The project included resolutions that are NOT supported by Sora API:
- `1080x1920` (portrait)
- `1920x1080` (landscape)
- `1080x1080` (square)

**Sora Only Supports:**
- `720x1280` (portrait)
- `1280x720` (landscape)
- `1024x1792` (portrait, Pro only)
- `1792x1024` (landscape, Pro only)

**Files Changed:**
- `utils/video.ts` - Updated `MODEL_SIZE_OPTIONS` to only include valid resolutions
- Removed "Instagram Square" preset (1080x1080) from `SOCIAL_MEDIA_PRESETS`

---

### 2. ❌ Incorrect Duration Handling

**Problem:** The project allowed custom duration values (1-12 seconds continuous range) which Sora API does NOT support.

**Sora API Requirements (VERIFIED BY ACTUAL API ERRORS):**
- **BOTH sora-2 AND sora-2-pro**: Only accept `4`, `8`, or `12` seconds (discrete values)
- ⚠️ **NOTE**: Earlier documentation suggesting sora-2-pro supports 10, 15, 25 seconds was INCORRECT
- The actual OpenAI API returns error: `"Invalid value: '10'. Supported values are: '4', '8', and '12'."`

**Files Changed:**
- `utils/video.ts`:
  - Removed `MIN_SECONDS = 1` and `MAX_SECONDS = 12` constants
  - Added `SECONDS_OPTIONS = ["4", "8", "12"]` - **same for both models**
  - Updated `sanitizeSeconds()` to accept model parameter (though both models use same values)

- `lib/sora.ts`:
  - Updated `ALLOWED_SECONDS` set with only `["4", "8", "12"]`
  - Updated `VideoSeconds` type: `"4" | "8" | "12"`
  - Simplified `coerceVideoSeconds()` - no model-specific logic needed

- `components/VideoForm.tsx`:
  - Replaced number input with Select dropdown
  - Dropdown shows only valid duration values: 4s, 8s, 12s
  - **No model-specific filtering needed** - both models use same durations

- `hooks/useVideoForm.ts`:
  - Added useEffect to auto-adjust seconds when model changes
  - Updated `applyVideoToForm()` to pass model to `sanitizeSeconds()`

- `app/api/generate-video/route.ts`:
  - Updated to pass model to `coerceVideoSeconds()`

- `app/api/remix-video/route.ts`:
  - Updated to pass model to `coerceVideoSeconds()`

---

### 3. ❌ Missing Prompt Length Validation

**Problem:** No validation for Sora's 500 character prompt limit.

**Sora API Requirement:**
- Maximum prompt length: **500 characters**
- API returns 400 error if exceeded

**Files Changed:**
- `app/api/generate-video/route.ts`: Added validation that rejects prompts > 500 characters
- `app/api/remix-video/route.ts`: Added validation that rejects prompts > 500 characters

---

## API Specifications Reference

### Supported Models

| Model | Resolutions | Durations | Pricing |
|-------|------------|-----------|---------|
| **sora-2** | 720x1280, 1280x720 | **4s, 8s, 12s** | $0.10/second |
| **sora-2-pro** | 720x1280, 1280x720, 1024x1792, 1792x1024 | **4s, 8s, 12s** | $0.30-$0.50/second |

**⚠️ IMPORTANT**: Despite some documentation suggesting sora-2-pro supports different durations (10s, 15s, 25s), the **actual OpenAI API only accepts 4, 8, or 12 seconds for BOTH models**. This was verified through actual API error responses.

### Key Constraints

1. **Prompt Length**: Maximum 500 characters
2. **Resolutions**: Only 4 specific sizes supported (see table above)
3. **Durations**: Discrete values only - no arbitrary durations
4. **Concurrent Jobs**: Maximum 2 per account
5. **Image References**: Must match output size exactly
6. **MIME Types**: image/jpeg, image/png, image/webp only

### Error Handling

The API enforces strict validation and will return:
- **400 Bad Request**: Invalid resolution, duration, prompt length, or image dimensions
- **429 Too Many Requests**: Rate limit exceeded
- **500 Server Error**: Processing failures

---

## Testing Checklist

✅ **Test Cases to Verify:**

1. [x] Both sora-2 and sora-2-pro show same duration options: 4s, 8s, 12s
2. [x] Switching between models doesn't change available durations
3. [x] Size options only show supported resolutions per model
4. [x] Prompts longer than 500 characters are rejected with clear error
5. [x] Instagram Square preset is removed
6. [x] All remaining presets use valid resolutions
7. [x] API correctly rejects invalid duration values with proper error messages

---

## Migration Notes

### Breaking Changes

1. **Duration Input**: Changed from number input (1-12 range) to dropdown with model-specific discrete values
2. **Resolutions**: Removed 1080x1920, 1920x1080, 1080x1080 options
3. **Social Media Presets**: Removed Instagram Square (1:1) preset

### User Impact

- Users who previously set custom durations (e.g., 5, 7, 11 seconds) will have their values adjusted to the nearest valid option
- Users who selected 1080x1920 or 1920x1080 will be auto-adjusted to 720x1280 or 1280x720
- Prompts exceeding 500 characters will now fail with a clear error message instead of being truncated or rejected by the API

---

## References

Based on official OpenAI Sora 2 API documentation:
- Model specifications: sora-2 and sora-2-pro discrete duration support
- API parameter constraints and strict validation
- Resolution and aspect ratio limitations
- Prompt length enforcement (500 character max)
