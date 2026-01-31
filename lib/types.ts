/**
 * Trust Frontend TypeScript Types
 * Aligned with backend schemas and Nuclei output format
 */

// Severity levels (5 levels from Nuclei)
export type Severity = "critical" | "high" | "medium" | "low" | "info";

// Scan modes
export type ScanMode = "tech" | "quick" | "full" | "critical";

// Scan status
export type ScanStatus = "pending" | "processing" | "completed" | "failed";

// Vulnerability category from AI analysis
export type VulnerabilityCategory =
  | "api_leak"
  | "exposure"
  | "misconfig"
  | "cve"
  | "privacy_risk";

// Fix complexity from AI analysis
export type FixComplexity = "simple" | "moderate" | "complex";

// Summary of vulnerabilities by severity
export interface VulnerabilitySummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

// Base vulnerability from Nuclei scan
export interface NucleiVulnerability {
  id: string;
  template_id: string;
  name: string;
  severity: Severity;
  matched_at: string;
  extracted_results: string[];
  ai_analyzed: boolean;
}

// Vulnerability with AI analysis
export interface VulnerabilityWithAnalysis extends NucleiVulnerability {
  category?: VulnerabilityCategory;
  description?: string;
  impact?: string;
  before_code?: string;
  after_code?: string;
  fix_steps?: string[];
  fix_complexity?: FixComplexity;
  reference_urls?: string[];
}

// Scan result from API
export interface ScanResult {
  scan_id: string;
  status: ScanStatus;
  target_url: string;
  progress?: number;
  current_stage?: string;
  score?: number;
  grade?: string;
  summary?: VulnerabilitySummary;
  vulnerabilities: NucleiVulnerability[];
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}

// API Request types
export interface ScanRequest {
  target_url: string;
  scan_mode?: ScanMode;
}

export interface AnalyzeRequest {
  scan_id: string;
  vulnerability_ids?: string[];
}

// API Response types
export interface ScanStartResponse {
  scan_id: string;
  status: ScanStatus;
  target_url: string;
  created_at: string;
}

export interface AnalyzeResponse {
  analyzed_count: number;
  vulnerabilities: VulnerabilityWithAnalysis[];
}

// UI Helper types
export interface SeverityConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const SEVERITY_CONFIGS: Record<Severity, SeverityConfig> = {
  critical: {
    label: "Critical",
    color: "#D42626",
    bgColor: "#D42626/20",
    borderColor: "#D42626/30",
  },
  high: {
    label: "High",
    color: "#D42626",
    bgColor: "#D42626/20",
    borderColor: "#D42626/30",
  },
  medium: {
    label: "Medium",
    color: "#FB9302",
    bgColor: "#FB9302/20",
    borderColor: "#FB9302/30",
  },
  low: {
    label: "Low",
    color: "text-blue-400",
    bgColor: "bg-blue-400/20",
    borderColor: "border-blue-400/30",
  },
  info: {
    label: "Info",
    color: "#D2DF48",
    bgColor: "#D2DF48/20",
    borderColor: "#D2DF48/30",
  },
};

// Grade configurations
export interface GradeConfig {
  color: string;
  textColor: string;
  description: string;
}

export const GRADE_CONFIGS: Record<string, GradeConfig> = {
  A: {
    color: "text-green-400",
    textColor: "text-green-400",
    description: "Excellent security posture",
  },
  "B+": {
    color: "text-green-300",
    textColor: "text-green-300",
    description: "Good security with minor issues",
  },
  B: {
    color: "text-yellow-400",
    textColor: "text-yellow-400",
    description: "Adequate security, improvements needed",
  },
  "B-": {
    color: "text-yellow-500",
    textColor: "text-yellow-500",
    description: "Below average, several issues found",
  },
  C: {
    color: "text-orange-400",
    textColor: "text-orange-400",
    description: "Poor security, action required",
  },
  D: {
    color: "text-red-400",
    textColor: "text-red-400",
    description: "Critical issues detected",
  },
  F: {
    color: "text-red-500",
    textColor: "text-red-500",
    description: "Severe vulnerabilities present",
  },
};
