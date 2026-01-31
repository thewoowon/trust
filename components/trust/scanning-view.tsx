"use client";

import { useEffect, useState, useCallback, useRef, memo } from "react";
import { motion } from "framer-motion";
import { Shield, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Galaxy from "@/components/ui/Galaxy";
import type { ScanResult, NucleiVulnerability } from "@/lib/types";
import { getScanStatus } from "@/lib/api";
import { BatteryCellIcon, BatteryIcon, JointIcon, LogoIcon } from "../svg";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import Image from "next/image";

// Memoized Galaxy background to prevent re-renders
const MemoizedGalaxy = memo(function MemoizedGalaxy() {
  return (
    <Galaxy
      density={0.8}
      speed={0.3}
      starSpeed={0.3}
      hueShift={200}
      glowIntensity={0.4}
      saturation={0.3}
      twinkleIntensity={0.5}
      rotationSpeed={0.02}
      mouseRepulsion={true}
      repulsionStrength={1.5}
      transparent={false}
    />
  );
});

interface ScanningViewProps {
  target: string;
  scanId: string | null;
  onComplete: (result: ScanResult) => void;
  onError: (error: string) => void;
  initialError?: string | null;
  onGoHome?: () => void;
}

// Category to template/tag mapping for vulnerability classification
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "API Security": [
    "exposure",
    "api",
    "token",
    "key",
    "secret",
    "credential",
    "leak",
    "env",
  ],
  Authentication: [
    "auth",
    "login",
    "session",
    "jwt",
    "oauth",
    "password",
    "cookie",
  ],
  "Data Protection": [
    "misconfig",
    "headers",
    "ssl",
    "tls",
    "csrf",
    "cors",
    "security-headers",
    "hsts",
  ],
  Dependencies: [
    "cve",
    "eol",
    "outdated",
    "version",
    "php-eol",
    "nginx-eol",
    "apache-eol",
  ],
};

// Security categories list
const SECURITY_CATEGORIES = [
  "API Security",
  "Authentication",
  "Data Protection",
  "Dependencies",
];

// Category status type
interface CategoryStatus {
  hasIssue: boolean;
  maxSeverity: string | null;
}

// Classify vulnerabilities into categories
function categorizeVulnerabilities(
  vulnerabilities: NucleiVulnerability[]
): Record<string, CategoryStatus> {
  const categories: Record<string, CategoryStatus> = {
    "API Security": { hasIssue: false, maxSeverity: null },
    Authentication: { hasIssue: false, maxSeverity: null },
    "Data Protection": { hasIssue: false, maxSeverity: null },
    Dependencies: { hasIssue: false, maxSeverity: null },
  };

  const severityOrder: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
    info: 0,
  };

  for (const vuln of vulnerabilities) {
    const templateId = vuln.template_id?.toLowerCase() || "";
    const name = vuln.name?.toLowerCase() || "";
    const severity = vuln.severity?.toLowerCase() || "info";

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const matches = keywords.some(
        (k) => templateId.includes(k) || name.includes(k)
      );

      if (matches) {
        categories[category].hasIssue = true;
        // Update max severity
        const currentMax = categories[category].maxSeverity;
        if (
          !currentMax ||
          severityOrder[severity] > severityOrder[currentMax]
        ) {
          categories[category].maxSeverity = severity;
        }
      }
    }
  }

  return categories;
}

// Get color class based on category status
function getCategoryColorClass(
  category: string,
  progress: number,
  index: number,
  categoryStatus: Record<string, CategoryStatus> | null
): string {
  // Still scanning this category
  if (progress <= (index + 1) * 25) {
    return "bg-[#00f3ff]"; // Cyan: in progress
  }

  // Check if we have status info
  if (!categoryStatus || !categoryStatus[category]) {
    return "bg-green-400"; // Default to green if no data
  }

  const status = categoryStatus[category];

  // No issues found
  if (!status.hasIssue) {
    return "bg-green-400"; // Green: passed
  }

  // Has issues - color based on severity
  const severity = status.maxSeverity;
  if (severity === "critical" || severity === "high" || severity === "medium") {
    return "bg-orange-400"; // Orange: warning (medium+)
  }

  return "bg-yellow-400"; // Yellow: caution (info/low)
}

// Simulated log messages that match the scan stages
const scanStageMessages: Record<string, { prefix: string; message: string }[]> =
  {
    initializing: [
      { prefix: "[Trust]", message: "Initializing security scanner..." },
      { prefix: "[Nuclei]", message: "Loading vulnerability templates..." },
    ],
    parsing: [{ prefix: "[Trust]", message: "Parsing scan results..." }],
    complete: [
      { prefix: "[Trust]", message: "Scan complete. Generating dashboard..." },
    ],
  };

// Continuous scanning log messages for active scanning effect
const continuousScanMessages: { prefix: string; message: string }[] = [
  { prefix: "[Nuclei]", message: "Scanning for API Key leaks..." },
  { prefix: "[Trust AI]", message: "Analyzing OAuth flow patterns..." },
  { prefix: "[Security]", message: "Checking CSRF & CORS configurations..." },
  { prefix: "[Nuclei]", message: "Detecting exposed environment variables..." },
  { prefix: "[Trust AI]", message: "Analyzing authentication endpoints..." },
  { prefix: "[Security]", message: "Scanning for SQL injection vectors..." },
  { prefix: "[Trust AI]", message: "Evaluating input sanitization..." },
  { prefix: "[Nuclei]", message: "Checking for XSS vulnerabilities..." },
  { prefix: "[Trust AI]", message: "Analyzing session management..." },
  { prefix: "[Security]", message: "Scanning dependency vulnerabilities..." },
  { prefix: "[Nuclei]", message: "Testing for open redirects..." },
  { prefix: "[Trust AI]", message: "Checking JWT token validation..." },
  { prefix: "[Security]", message: "Scanning for SSRF vulnerabilities..." },
  { prefix: "[Nuclei]", message: "Detecting misconfigured headers..." },
  { prefix: "[Trust AI]", message: "Analyzing rate limiting policies..." },
  { prefix: "[Security]", message: "Checking for directory traversal..." },
  { prefix: "[Nuclei]", message: "Scanning for information disclosure..." },
  { prefix: "[Trust AI]", message: "Evaluating error handling patterns..." },
  { prefix: "[Security]", message: "Testing for IDOR vulnerabilities..." },
  { prefix: "[Nuclei]", message: "Checking SSL/TLS configurations..." },
  { prefix: "[Trust AI]", message: "Analyzing cookie security flags..." },
  { prefix: "[Security]", message: "Scanning for XXE injection..." },
  { prefix: "[Nuclei]", message: "Detecting exposed admin panels..." },
  { prefix: "[Trust AI]", message: "Checking Content-Security-Policy..." },
  { prefix: "[Security]", message: "Testing for command injection..." },
  { prefix: "[Nuclei]", message: "Scanning for prototype pollution..." },
  { prefix: "[Trust AI]", message: "Analyzing CORS misconfiguration..." },
  { prefix: "[Security]", message: "Checking for clickjacking vectors..." },
  { prefix: "[Nuclei]", message: "Detecting exposed .git directories..." },
  { prefix: "[Trust AI]", message: "Evaluating authentication bypass..." },
];

export function ScanningView({
  target,
  scanId,
  onComplete,
  onError,
  initialError,
  onGoHome,
}: ScanningViewProps) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("initializing");
  const [visibleLogs, setVisibleLogs] = useState<
    { prefix: string; message: string }[]
  >([]);
  const [error, setError] = useState<string | null>(initialError || null);
  const [retrying, setRetrying] = useState(false);
  const [categoryStatus, setCategoryStatus] = useState<Record<
    string,
    CategoryStatus
  > | null>(null);

  // Ref for auto-scrolling log container
  const logContainerRef = useRef<HTMLDivElement>(null);
  const logIndexRef = useRef(0);

  // Add log message
  const addLog = useCallback((log: { prefix: string; message: string }) => {
    setVisibleLogs((prev) => [...prev, log]);
  }, []);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  // Continuous log generation during scanning
  useEffect(() => {
    if (error || currentStage === "complete" || currentStage === "parsing")
      return;

    const interval = setInterval(() => {
      const message =
        continuousScanMessages[
          logIndexRef.current % continuousScanMessages.length
        ];
      addLog(message);
      logIndexRef.current++;
    }, 1500); // Add new log every 1.5 seconds

    return () => clearInterval(interval);
  }, [error, currentStage, addLog]);

  // Poll scan status
  useEffect(() => {
    if (!scanId || error) return;

    let isMounted = true;
    let pollInterval: NodeJS.Timeout;

    // Add initial logs
    scanStageMessages.initializing.forEach((log, i) => {
      setTimeout(() => {
        if (isMounted) addLog(log);
      }, i * 300);
    });

    const pollStatus = async () => {
      try {
        const result = await getScanStatus(scanId);

        if (!isMounted) return;

        // Update progress
        setProgress(result.progress || 0);
        setCurrentStage(result.current_stage || "scanning");

        // Add parsing stage log
        if (result.current_stage === "parsing") {
          scanStageMessages.parsing.forEach((log) => addLog(log));
        }

        // Update category status in real-time as vulnerabilities are found
        if (result.vulnerabilities && result.vulnerabilities.length > 0) {
          const status = categorizeVulnerabilities(result.vulnerabilities);
          setCategoryStatus(status);
        }

        // Check completion
        if (result.status === "completed") {
          setCurrentStage("complete");
          scanStageMessages.complete.forEach((log) => addLog(log));

          // Smooth progress animation to 100%
          const startProgress = result.progress || 90;
          const duration = 800; // ms
          const startTime = Date.now();

          const animateProgress = () => {
            const elapsed = Date.now() - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - t, 3);
            const currentProgress = Math.round(
              startProgress + (100 - startProgress) * eased
            );

            setProgress(currentProgress);

            if (t < 1) {
              requestAnimationFrame(animateProgress);
            } else {
              setTimeout(() => {
                if (isMounted) onComplete(result);
              }, 700);
            }
          };

          requestAnimationFrame(animateProgress);
          return; // Stop polling
        }

        if (result.status === "failed") {
          setError(result.error_message || "Scan failed");
          onError(result.error_message || "Scan failed");
          return; // Stop polling
        }

        // Continue polling
        pollInterval = setTimeout(pollStatus, 2000);
      } catch (err) {
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Connection error";
          setError(errorMessage);
          onError(errorMessage);
        }
      }
    };

    // Start polling after a short delay
    const startDelay = setTimeout(() => {
      pollStatus();
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(startDelay);
      clearTimeout(pollInterval);
    };
  }, [scanId, error, onComplete, onError, addLog]);

  const handleRetry = () => {
    setRetrying(true);
    setError(null);
    setProgress(0);
    setVisibleLogs([]);
    // Parent component will handle retry via onError callback
    window.location.reload();
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 relative">
      {/* Galaxy Background */}
      <div className="fixed inset-0 z-0">
        <MemoizedGalaxy />
      </div>
      <div className="fixed inset-0 z-20 overflow-hidden opacity-30">
        <Image
          src={"/assets/images/beautiful_shot_starry_night_sky.png"}
          fill
          alt="noise"
        />
      </div>
      <div className="w-full mx-auto relative z-30">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={onGoHome}
            className="flex items-center justify-center gap-3 mb-4 hover:opacity-80 transition-opacity cursor-pointer mx-auto"
          >
            <LogoIcon width={175} height={175} fill="white" />
          </button>
          <p
            style={{
              ...TYPOGRAPHY.h3.regular,
              color: COLORS.primary["500"],
            }}
          >
            Scanning: <span className="text-[white] font-mono">{target}</span>
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 glass rounded-2xl border border-red-400/30"
          >
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <AlertCircle className="w-6 h-6" />
              <span className="font-semibold">Scan Error</span>
            </div>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button
              onClick={handleRetry}
              disabled={retrying}
              className="bg-[#00f3ff] text-background hover:bg-[#00f3ff]/90"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${retrying ? "animate-spin" : ""}`}
              />
              {retrying ? "Retrying..." : "Try Again"}
            </Button>
          </motion.div>
        )}

        {/* Progress Ring */}
        {!error && (
          <div
            style={{
              height: "654px",
              backgroundColor: COLORS.grayscale[1400],
            }}
            className="flex w-full flex-row items-center justify-evenly mb-12"
          >
            <div
              style={{
                flex: 1,
                position: "relative",
                height: "100%",
                borderRightWidth: 1,
                borderRightColor: "rgba(253, 253, 253, 0.15)",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                }}
              >
                <JointIcon />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
              style={{
                position: "relative",
                minWidth: "522px",
                width: "522px",
                minHeight: "654px",
                height: "654px",
                paddingLeft: 38,
                paddingRight: 38,
                flexDirection: "column",
                display: "flex",
                borderRightWidth: 1,
                borderRightColor: "rgba(253, 253, 253, 0.15)",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                }}
              >
                <JointIcon />
              </div>
              <div className="w-full h-22.5 flex items-end justify-start pb-2.5 pl-3">
                <div
                  style={{
                    ...TYPOGRAPHY.h3.regular,
                    color: COLORS.primary[500],
                  }}
                >
                  Analyzing
                </div>
              </div>
              {/* Center content */}
              <div className="flex-1 flex flex-row items-start justify-start">
                <motion.span
                  key={progress}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  style={{
                    fontFamily: "var(--font-pixelify-sans)",
                    fontSize: 100,
                    lineHeight: 1.4,
                  }}
                  className="text-white"
                >
                  {progress}%
                </motion.span>
              </div>
              {/* Scanning indicators */}
              {!error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-start gap-4.5 px-5 pb-19"
                >
                  {SECURITY_CATEGORIES.map((item, index) => {
                    const colorClass = getCategoryColorClass(
                      item,
                      progress,
                      index,
                      categoryStatus
                    );
                    const isComplete = progress > (index + 1) * 25;

                    return (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className="relative">
                          <BatteryIcon width={156} height={30} />
                          <div
                            className="absolute left-2 flex"
                            style={{
                              gap: "1.9px",
                              top: "6.5px",
                            }}
                          >
                            {/* 각 카테고리별 progress에 따라 15개 셀 채움 */}
                            {Array.from({ length: 12 }).map((_, cellIndex) => {
                              // 각 카테고리는 25%씩 담당 (index 0: 0-25%, index 1: 25-50%, etc.)
                              const categoryStart = index * 25;
                              // 현재 카테고리 내에서의 progress (0-25 범위)
                              const categoryProgress = Math.max(
                                0,
                                Math.min(25, progress - categoryStart)
                              );
                              // 25% 구간을 12개 셀로 나눔 (각 셀은 약 1.67%)
                              const cellThreshold = ((cellIndex + 1) / 12) * 25;
                              const isFilled =
                                categoryProgress >= cellThreshold;

                              return isFilled ? (
                                <BatteryCellIcon
                                  key={cellIndex}
                                  width={10}
                                  height={18.2}
                                />
                              ) : null;
                            })}
                          </div>
                        </div>
                        <span>{item}</span>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>

            {/* Terminal Logs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
              style={{
                position: "relative",
                minWidth: "522px",
                width: "522px",
                minHeight: "654px",
                height: "654px",
                paddingLeft: 38,
                paddingRight: 38,
                flexDirection: "column",
                display: "flex",
                borderRightWidth: 1,
                borderRightColor: "rgba(253, 253, 253, 0.15)",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                }}
              >
                <JointIcon />
              </div>
              <div className="w-full h-22.5 flex items-end justify-start pb-2.5 pl-2">
                <div
                  style={{
                    ...TYPOGRAPHY.h3.regular,
                    color: COLORS.primary[500],
                  }}
                >
                  Scanner log
                </div>
              </div>
              <div
                ref={logContainerRef}
                className="font-mono text-sm space-y-2 overflow-y-auto h-91 scroll-smooth mt-6.25"
              >
                {visibleLogs.map((log, index) => (
                  <motion.div
                    key={`log-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-2"
                  >
                    <span
                      style={{
                        ...TYPOGRAPHY.body1.regular,
                      }}
                      className={`shrink-0 ${
                        log.prefix === "[Trust AI]"
                          ? "text-[#00f3ff]"
                          : log.prefix === "[Nuclei]"
                          ? "text-green-400"
                          : log.prefix === "[Security]"
                          ? "text-yellow-400"
                          : "text-purple-400"
                      }`}
                    >
                      {log.prefix}
                    </span>
                    <span
                      style={{
                        ...TYPOGRAPHY.body1.regular,
                        color: COLORS.grayscale[700],
                      }}
                    >
                      {log.message}
                    </span>
                  </motion.div>
                ))}
                {/* Blinking cursor */}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="inline-block w-2 h-4 bg-[#00f3ff]"
                />
              </div>
            </motion.div>
            <div
              style={{
                flex: 1,
                height: "100%",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
