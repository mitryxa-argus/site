/**
 * Browser fingerprinting utility for anti-abuse protection.
 * Generates a SHA-256 hash from canvas, WebGL, screen, timezone, language, and platform data.
 * Zero cost, no external API.
 */

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";

    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Mitryxa fp", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Mitryxa fp", 4, 17);

    return canvas.toDataURL();
  } catch {
    return "canvas-error";
  }
}

function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "no-webgl";

    const glCtx = gl as WebGLRenderingContext;
    const debugInfo = glCtx.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "no-debug-info";

    const vendor = glCtx.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
    const renderer =
      glCtx.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
    return `${vendor}~${renderer}`;
  } catch {
    return "webgl-error";
  }
}

function getScreenFingerprint(): string {
  return `${screen.width}x${screen.height}x${screen.colorDepth}x${window.devicePixelRatio || 1}`;
}

/**
 * Generate a browser fingerprint hash.
 * The result is deterministic for the same browser on the same device.
 */
export async function generateFingerprint(): Promise<string> {
  const components = [
    getCanvasFingerprint(),
    getWebGLFingerprint(),
    getScreenFingerprint(),
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    navigator.language || "",
    navigator.platform || "",
    navigator.hardwareConcurrency?.toString() || "",
    (navigator as any).deviceMemory?.toString() || "",
  ];

  return sha256(components.join("|"));
}
