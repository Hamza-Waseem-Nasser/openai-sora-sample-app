import { Buffer } from "node:buffer";
import {
  coerceVideoModel,
  coerceVideoSeconds,
  coerceVideoSize,
  describeError,
  isRecord,
  normalizeVideoResponse,
  resolveErrorStatus,
  VideoRequestPayload,
} from "@/lib/sora";

type VideoCreateParams = {
  prompt: string;
  model: string;
  size: string;
  seconds: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    const message = "OPENAI_API_KEY is not configured";
    return Response.json({ error: { message } }, { status: 500 });
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return Response.json(
      { error: { message: "Invalid JSON payload" } },
      { status: 400 }
    );
  }

  const payload = isRecord(rawPayload) ? rawPayload : {};

  const prompt =
    typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  if (!prompt) {
    return Response.json(
      { error: { message: "Prompt is required" } },
      { status: 400 }
    );
  }

  // Sora API enforces a 4000 character limit on prompts
  if (prompt.length > 4000) {
    return Response.json(
      { error: { message: `Prompt exceeds maximum length of 4000 characters (current: ${prompt.length})` } },
      { status: 400 }
    );
  }

  const model = coerceVideoModel(
    typeof payload.model === "string" ? payload.model : null
  );
  const size = coerceVideoSize(
    typeof payload.size === "string" ? payload.size : null
  );
  const seconds = coerceVideoSeconds(
    payload.seconds != null ? String(payload.seconds) : null,
    model
  );

  const imageData = isRecord(payload.image) ? payload.image : null;

  const videoPayload: VideoRequestPayload = {
    prompt,
    model,
    size,
    seconds,
  };

  try {
    const endpointBase =
      process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1";
    const endpoint = `${endpointBase.replace(/\/$/, "")}/videos`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
    };

    const organization = process.env.OPENAI_ORG_ID?.trim();
    if (organization) {
      headers["OpenAI-Organization"] = organization;
    }
    const project = process.env.OPENAI_PROJECT_ID?.trim();
    if (project) {
      headers["OpenAI-Project"] = project;
    }

    let response: Response;
    if (imageData?.data != null) {
      const formData = new FormData();
      formData.set("prompt", prompt);
      formData.set("model", model);
      formData.set("size", size);
      formData.set("seconds", seconds);

      const buffer = Buffer.from(String(imageData.data), "base64");
      const mimeType =
        typeof imageData.mimeType === "string" && imageData.mimeType.trim()
          ? imageData.mimeType
          : "image/png";
      const filename =
        typeof imageData.name === "string" && imageData.name.trim()
          ? imageData.name.trim()
          : "input-reference";
      const blob = new Blob([buffer], { type: mimeType });
      formData.append("input_reference", blob, filename);

      response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: formData,
      });
    } else {
      headers["Content-Type"] = "application/json";
      const payload: VideoCreateParams = {
        prompt,
        model,
        size,
        seconds,
      };
      
      console.log("🚀 SENDING TO OPENAI API:", {
        endpoint,
        payload,
        note: "This is EXACTLY what we're sending - no modifications"
      });
      
      response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      
      console.log("📥 RECEIVED FROM OPENAI:", {
        status: response.status,
        statusText: response.statusText,
        note: "This response is from OpenAI's servers, not our code"
      });
    }

    const result = await response.json().catch(() => null);
    if (!response.ok || !result) {
      // Log detailed error information
      console.error("OpenAI API Error:", {
        status: response.status,
        statusText: response.statusText,
        result,
        endpoint,
        videoPayload,
      });
      
      const message = describeError(result, "Failed to create video");
      const derivedStatus = result ? resolveErrorStatus(result) : undefined;
      const status =
        typeof derivedStatus === "number" && derivedStatus > 0
          ? derivedStatus
          : response.status || 500;
      return Response.json({ error: { message } }, { status });
    }

    const normalized = normalizeVideoResponse(result, videoPayload);
    return Response.json(normalized);
  } catch (error) {
    console.error("generate-video error (full details):", {
      error,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    const message = describeError(error, "Failed to create video");
    const status = resolveErrorStatus(error);
    return Response.json({ error: { message } }, { status });
  }
}
