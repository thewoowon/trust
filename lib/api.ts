/**
 * Trust Frontend API Client
 * Functions for communicating with the Trust backend API
 */

import type {
  ScanRequest,
  ScanStartResponse,
  ScanResult,
  AnalyzeRequest,
  AnalyzeResponse,
} from "./types";

// API base URL - uses environment variable or defaults to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Ignore JSON parse errors
    }
    throw new APIError(errorMessage, response.status);
  }

  return response.json();
}

/**
 * Start a new security scan
 *
 * @param targetUrl - URL to scan
 * @param mode - Scan mode (default: "quick")
 * @returns Scan start response with scan_id
 */
export async function startScan(
  targetUrl: string,
  mode: ScanRequest["scan_mode"] = "quick"
): Promise<ScanStartResponse> {
  return apiFetch<ScanStartResponse>("/api/scan", {
    method: "POST",
    body: JSON.stringify({
      target_url: targetUrl,
      scan_mode: mode,
    }),
  });
}

/**
 * Get scan status and results
 *
 * @param scanId - UUID of the scan
 * @returns Current scan status and results
 */
export async function getScanStatus(scanId: string): Promise<ScanResult> {
  return apiFetch<ScanResult>(`/api/scan/${scanId}`);
}

/**
 * Analyze vulnerabilities with AI
 *
 * @param scanId - UUID of the scan
 * @param vulnerabilityIds - Optional specific vulnerability IDs to analyze
 * @returns Analysis results
 */
export async function analyzeVulnerabilities(
  scanId: string,
  vulnerabilityIds?: string[]
): Promise<AnalyzeResponse> {
  return apiFetch<AnalyzeResponse>("/api/analyze", {
    method: "POST",
    body: JSON.stringify({
      scan_id: scanId,
      vulnerability_ids: vulnerabilityIds,
    }),
  });
}

/**
 * Poll scan status until completion
 *
 * @param scanId - UUID of the scan
 * @param onUpdate - Callback for status updates
 * @param intervalMs - Polling interval in milliseconds
 * @param timeoutMs - Maximum time to wait
 * @returns Final scan result
 */
export async function pollScanStatus(
  scanId: string,
  onUpdate?: (result: ScanResult) => void,
  intervalMs: number = 2000,
  timeoutMs: number = 600000 // 10 minutes
): Promise<ScanResult> {
  const startTime = Date.now();

  while (true) {
    const result = await getScanStatus(scanId);

    // Notify callback
    if (onUpdate) {
      onUpdate(result);
    }

    // Check if scan is complete
    if (result.status === "completed" || result.status === "failed") {
      return result;
    }

    // Check timeout
    if (Date.now() - startTime > timeoutMs) {
      throw new APIError("Scan timeout", 408);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

/**
 * Health check for the API
 *
 * @returns true if API is healthy
 */
export async function healthCheck(): Promise<boolean> {
  try {
    await apiFetch<{ status: string }>("/health");
    return true;
  } catch {
    return false;
  }
}

/**
 * Badge response from API
 */
export interface BadgeResponse {
  scan_id: string;
  badge_url: string;
  embed_code: string;
  markdown: string;
  html: string;
}

/**
 * Generate a trust badge for a scan
 *
 * @param scanId - UUID of the scan
 * @returns Badge URLs and embed codes
 */
export async function generateBadge(scanId: string): Promise<BadgeResponse> {
  return apiFetch<BadgeResponse>(`/api/badge/${scanId}`, {
    method: "POST",
  });
}

/**
 * Get existing badge for a scan
 *
 * @param scanId - UUID of the scan
 * @returns Badge URLs and embed codes
 */
export async function getBadge(scanId: string): Promise<BadgeResponse> {
  return apiFetch<BadgeResponse>(`/api/badge/${scanId}`);
}
