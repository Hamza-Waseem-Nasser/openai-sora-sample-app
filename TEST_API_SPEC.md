# OpenAI Sora API Testing & Verification

## Test Results

### ✅ Confirmed by Actual API Errors:

**Both sora-2 and sora-2-pro ONLY support:**
- `"4"` seconds
- `"8"` seconds  
- `"12"` seconds

### ❌ Rejected Values (Proven by API):

When we sent:
- `seconds: "10"` → **Error:** "Invalid value: '10'. Supported values are: '4', '8', and '12'."
- `seconds: "15"` → **Error:** "Invalid value: '15'. Supported values are: '4', '8', and '12'."
- `seconds: "25"` → **Error:** "Invalid value: '25'. Supported values are: '4', '8', and '12'."

### API Request We Send:

```json
POST https://api.openai.com/v1/videos
Content-Type: application/json

{
  "prompt": "Your prompt text",
  "model": "sora-2-pro",
  "size": "1792x1024",
  "seconds": "15"
}
```

### API Response (Error):

```json
{
  "error": {
    "message": "Invalid value: '15'. Supported values are: '4', '8', and '12'.",
    "type": "invalid_request_error",
    "param": "seconds",
    "code": "invalid_value"
  }
}
```

## Why This Proves It's OpenAI's Validation:

1. **Error structure** - Standard OpenAI format with `type`, `param`, `code`
2. **Error message** - Written by OpenAI ("Supported values are...")
3. **HTTP 400** - Coming from OpenAI's servers
4. **Our code doesn't validate** - We pass values directly to API
5. **Consistent errors** - Same format for all invalid values

## Conclusion:

The documentation suggesting sora-2-pro supports 10/15/25 seconds was **INCORRECT**.

The **actual OpenAI API** only accepts 4, 8, or 12 seconds for both models.
