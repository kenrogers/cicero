/**
 * Video Timestamp Utilities
 * 
 * Generates timestamp URLs for Cablecast VOD videos using HTML5 Media Fragments.
 * W3C Media Fragments spec: https://www.w3.org/TR/media-frags/
 * 
 * Format: videoUrl#t=<seconds> (e.g., vod.mp4#t=3600 jumps to 1:00:00)
 */

/**
 * Format seconds as human-readable timestamp (H:MM:SS or M:SS)
 */
export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Parse timestamp string (H:MM:SS or M:SS) to seconds
 */
export function parseTimestamp(timestamp: string): number {
  const parts = timestamp.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return parts[0] || 0;
}

/**
 * Generate a video URL with timestamp using HTML5 Media Fragments
 * 
 * @param videoUrl - Base video URL (e.g., https://reflect-vod-fcgov.cablecast.tv/.../vod.mp4)
 * @param seconds - Timestamp in seconds to jump to
 * @returns Video URL with timestamp fragment (e.g., vod.mp4#t=3600)
 * 
 * Note: Media Fragments (#t=seconds) work when:
 * 1. Video server supports byte-range requests (Accept-Ranges: bytes)
 * 2. Browser opens the URL directly (not embedded via custom player)
 * 
 * For embedded players, JavaScript must handle the timestamp separately.
 */
export function generateTimestampUrl(videoUrl: string, seconds: number): string {
  // Remove any existing fragment
  const baseUrl = videoUrl.split("#")[0];
  return `${baseUrl}#t=${Math.floor(seconds)}`;
}

/**
 * Check if a video URL is likely to support Media Fragments
 * (Based on known video hosting patterns)
 */
export function supportsMediaFragments(videoUrl: string): boolean {
  // Cablecast VOD URLs (reflect-vod-*.cablecast.tv) serve MP4 files
  // with byte-range support, so Media Fragments work
  if (videoUrl.includes("cablecast.tv") && videoUrl.endsWith(".mp4")) {
    return true;
  }
  
  // Generic MP4 files typically support it
  if (videoUrl.endsWith(".mp4")) {
    return true;
  }
  
  // Streaming platforms may not support it
  return false;
}
