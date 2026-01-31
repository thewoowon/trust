"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Key,
  Eye,
  ChevronDown,
  ChevronUp,
  Check,
  Award,
  Bot,
  ArrowRight,
  Sparkles,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppState } from "@/app/page";
import type {
  ScanResult,
  NucleiVulnerability,
  VulnerabilityWithAnalysis,
  Severity,
} from "@/lib/types";
import { SEVERITY_CONFIGS, GRADE_CONFIGS } from "@/lib/types";
import {
  analyzeVulnerabilities,
  generateBadge,
  type BadgeResponse,
} from "@/lib/api";
import { BotIcon, BugIcon, LogoFullIcon, LogoIcon } from "../svg";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";

interface DashboardViewProps {
  scanResult: ScanResult | null;
  onNavigate: (state: AppState) => void;
  onNewScan: () => void;
}

// Extended vulnerability type for UI state
interface UIVulnerability extends NucleiVulnerability {
  description?: string;
  before_code?: string;
  after_code?: string;
  fix_steps?: string[];
  fixed?: boolean;
}

export function DashboardView({
  scanResult,
  onNavigate,
  onNewScan,
}: DashboardViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [vulns, setVulns] = useState<UIVulnerability[]>(
    scanResult?.vulnerabilities?.map((v) => ({ ...v, fixed: false })) || []
  );
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [badge, setBadge] = useState<BadgeResponse | null>(null);
  const [isGeneratingBadge, setIsGeneratingBadge] = useState(false);
  const [copiedAfterCode, setCopiedAfterCode] = useState<string | null>(null);

  const score = scanResult?.score ?? 68;
  const grade = scanResult?.grade ?? "B-";
  const summary = scanResult?.summary;

  // Calculate summary cards from actual data
  const summaryCards = [
    {
      icon: AlertTriangle,
      title: "Critical Issues",
      count: (summary?.critical || 0) + (summary?.high || 0),
      color: COLORS.text.critical,
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20",
    },
    {
      icon: Key,
      title: "Medium Risk",
      count: summary?.medium || 0,
      color: COLORS.text.medium,
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
    },
    {
      icon: Eye,
      title: "Info Items",
      count: (summary?.low || 0) + (summary?.info || 0),
      color: COLORS.text.yellow,
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
  ];

  const handleApplyFix = (id: string) => {
    setVulns((prev) =>
      prev.map((v) => (v.id === id ? { ...v, fixed: true } : v))
    );
  };

  const handleGenerateBadge = async () => {
    if (!scanResult?.scan_id) return;

    setIsGeneratingBadge(true);
    try {
      const response = await generateBadge(scanResult.scan_id);
      setBadge(response);
    } catch (error) {
      console.error("Failed to generate badge:", error);
    } finally {
      setIsGeneratingBadge(false);
    }
  };

  const handleCopyAfterCode = async (vulnId: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedAfterCode(vulnId);
      setTimeout(() => setCopiedAfterCode(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleAnalyzeVulnerability = async (vulnId: string) => {
    if (!scanResult?.scan_id) return;

    setAnalyzingIds((prev) => new Set([...prev, vulnId]));

    try {
      const response = await analyzeVulnerabilities(scanResult.scan_id, [
        vulnId,
      ]);

      if (response.vulnerabilities.length > 0) {
        const analyzed = response.vulnerabilities[0];
        setVulns((prev) =>
          prev.map((v) =>
            v.id === vulnId
              ? {
                  ...v,
                  ai_analyzed: true,
                  description: analyzed.description,
                  before_code: analyzed.before_code,
                  after_code: analyzed.after_code,
                  fix_steps: analyzed.fix_steps,
                }
              : v
          )
        );
      }
    } catch (error) {
      console.error("Failed to analyze vulnerability:", error);
    } finally {
      setAnalyzingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(vulnId);
        return newSet;
      });
    }
  };

  const handleAnalyzeAll = async () => {
    if (!scanResult?.scan_id) return;

    setIsAnalyzingAll(true);

    try {
      const unanalyzedIds = vulns
        .filter((v) => !v.ai_analyzed)
        .map((v) => v.id);

      if (unanalyzedIds.length === 0) return;

      const response = await analyzeVulnerabilities(
        scanResult.scan_id,
        unanalyzedIds
      );

      // Update all analyzed vulnerabilities
      const analyzedMap = new Map(
        response.vulnerabilities.map((v) => [v.id, v])
      );

      setVulns((prev) =>
        prev.map((v) => {
          const analyzed = analyzedMap.get(v.id);
          if (analyzed) {
            return {
              ...v,
              ai_analyzed: true,
              description: analyzed.description,
              before_code: analyzed.before_code,
              after_code: analyzed.after_code,
              fix_steps: analyzed.fix_steps,
            };
          }
          return v;
        })
      );
    } catch (error) {
      console.error("Failed to analyze vulnerabilities:", error);
    } finally {
      setIsAnalyzingAll(false);
    }
  };

  const getSeverityConfig = (severity: Severity | string) => {
    const severityLower = severity.toLowerCase() as Severity;
    return SEVERITY_CONFIGS[severityLower] || SEVERITY_CONFIGS.info;
  };

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const gradeConfig = GRADE_CONFIGS[grade] || GRADE_CONFIGS["B"];

  // Check if there are unanalyzed vulnerabilities
  const hasUnanalyzed = vulns.some((v) => !v.ai_analyzed);

  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
          onClick={() => onNavigate("landing")}
          style={{ cursor: "pointer" }}
        >
          <LogoFullIcon width={92} />
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={() => onNavigate("mcp")}
            style={{ ...TYPOGRAPHY.h3.semiBold }}
            className={`flex flex-row items-center px-6 py-3 text-white hover:bg-white/10 transition-colors border border-white gap-2.5`}
          >
            <BotIcon />
            MCP Agent
          </button>
        </motion.nav>
      </header>

      <div className="py-8">
        {/* Score Section */}
        <div className="mb-23 flex flex-row justify-center items-center relative">
          {/* Score Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "260px",
              height: "242px",
              border: `1px solid ${COLORS.grayscale[1000]}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="relative height">
              <div
                style={{
                  fontFamily: "var(--font-pixelify-sans)",
                  fontSize: "100px",
                  lineHeight: 1.1,
                  color: "white",
                }}
                className="flex flex-col items-center justify-center"
              >
                {score}
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.h2.bold,
                  color: "white",
                  fontSize: "32px",
                }}
                className="text-center"
              >
                Grade: {grade}
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.h3.regular,
                  color: COLORS.primary[500],
                }}
                className="text-center"
              >
                Security Score
              </div>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div
            className="flex-1 flex flex-col"
            style={{
              maxWidth: "1300px",
            }}
          >
            {summaryCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className={`flex items-center justify-between gap-4`}
                style={{
                  padding: "24.5px 40px",
                  border: `1px solid ${COLORS.grayscale[1000]}`,
                }}
              >
                <div className={`flex items-center gap-4`}>
                  <BugIcon fill={card.color} />
                  <p style={{ ...TYPOGRAPHY.h3.regular, color: card.color }}>
                    {card.title}
                  </p>
                </div>
                <p style={{ ...TYPOGRAPHY.h3.regular, color: card.color }}>
                  {card.count}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vulnerability List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            maxWidth: "1560px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto",
          }}
        >
          <div className="w-full flex items-center justify-between mb-9.5">
            <div
              style={{
                ...TYPOGRAPHY.h3.regular,
                color: "white",
              }}
            >
              Detected Vulnerabilities ({vulns.length})
            </div>
            {hasUnanalyzed && (
              <button
                disabled={isAnalyzingAll}
                onClick={handleAnalyzeAll}
                type="submit"
                style={{
                  ...TYPOGRAPHY.h3.semiBold,
                  color: COLORS.grayscale["800"],
                  gap: 10,
                  cursor: isAnalyzingAll ? "not-allowed" : "pointer",
                }}
                className={`bg-white flex flex-row items-center px-[24] py-[12] disabled:bg-transparent disabled:cursor-not-allowed`}
              >
                {isAnalyzingAll ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogoIcon width={32} height={32} fill="rgba(89, 89, 89, 1)" />
                )}
                {isAnalyzingAll ? "Analyzing..." : "Get AI Insights"}
              </button>
            )}
          </div>

          <div className="w-full">
            {vulns.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px",
                  border: " 1px solid rgba(255, 255, 255, 0.1)",
                  height: "300px",
                }}
              >
                <div
                  style={{
                    ...TYPOGRAPHY.h3.semiBold,
                    color: "white",
                    marginBottom: "8px",
                  }}
                >
                  No Vulnerabilities Found
                </div>
                <p style={{ ...TYPOGRAPHY.body1.regular, color: "white" }}>
                  Great job! Your application passed all security checks.
                </p>
              </div>
            ) : (
              vulns.map((vuln, index) => {
                const severityConfig = getSeverityConfig(vuln.severity);
                const isAnalyzing = analyzingIds.has(vuln.id);

                return (
                  <motion.div
                    key={vuln.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                    className={`border border-[#262626] -overflow-hidden transition-all duration-300 ${
                      vuln.fixed ? "opacity-60" : ""
                    }`}
                  >
                    {/* Header */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expandedId === vuln.id ? null : vuln.id)
                      }
                      className="w-full flex items-center justify-between px-7.5 py-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        {/* Actions */}
                        <button
                          onClick={() => handleApplyFix(vuln.id)}
                          disabled={vuln.fixed}
                          style={{
                            cursor: vuln.fixed ? "not-allowed" : "pointer",
                            border: `1px solid ${
                              vuln.fixed ? "white" : COLORS.grayscale[900]
                            }`,
                            width: "24px",
                            height: "24px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {vuln.fixed ? (
                            <Check className="w-4 h-4" color="white" />
                          ) : null}
                        </button>
                        <BugIcon
                          fill={
                            vuln.fixed
                              ? COLORS.grayscale[800]
                              : severityConfig.color
                          }
                        />
                        <span
                          style={{
                            ...TYPOGRAPHY.h4.regular,
                            color: vuln.fixed ? COLORS.grayscale[800] : "white",
                          }}
                          className={`${vuln.fixed ? "line-through" : ""}`}
                        >
                          {vuln.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        {vuln.ai_analyzed && !vuln.fixed && (
                          <div
                            style={{
                              ...TYPOGRAPHY.body1.regular,
                              color: COLORS.grayscale[700],
                            }}
                          >
                            AI Analyzed
                          </div>
                        )}
                        {vuln.fixed && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              ...TYPOGRAPHY.body1.regular,
                              color: COLORS.primary[500],
                            }}
                          >
                            <Check
                              className="w-4 h-4"
                              color={COLORS.primary[500]}
                            />
                            Fixed
                          </div>
                        )}
                        {expandedId === vuln.id ? (
                          <ChevronUp className="w-6 h-6 text-white" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-white" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedId === vuln.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4">
                            {/* Description */}
                            <div
                              style={{
                                backgroundColor: COLORS.grayscale[1100],
                                padding: "24px 30px",
                              }}
                            >
                              <div
                                style={{
                                  ...TYPOGRAPHY.body1.semiBold,
                                  color: COLORS.grayscale[700],
                                }}
                                className="mb-2"
                              >
                                {"What went wrong?"}
                              </div>
                              {false ? (
                                <p
                                  style={{
                                    ...TYPOGRAPHY.body2.regular,
                                    color: "white",
                                  }}
                                >
                                  {vuln.description}
                                </p>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  <p
                                    className="mb-2"
                                    style={{
                                      ...TYPOGRAPHY.body2.regular,
                                      color: "white",
                                    }}
                                  >
                                    Detected at: <code>{vuln.matched_at}</code>
                                  </p>
                                  {!vuln.ai_analyzed && (
                                    <Button
                                      onClick={() =>
                                        handleAnalyzeVulnerability(vuln.id)
                                      }
                                      disabled={isAnalyzing}
                                      size="sm"
                                      variant="outline"
                                      className="mt-2 border-[#00f3ff]/30 text-[#00f3ff] hover:bg-[#00f3ff]/10"
                                    >
                                      {isAnalyzing ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      ) : (
                                        <Sparkles className="w-4 h-4 mr-2" />
                                      )}
                                      {isAnalyzing
                                        ? "Analyzing..."
                                        : "Get AI Analysis"}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Code Diff (only show if AI analyzed) */}
                            {vuln.ai_analyzed &&
                              vuln.before_code &&
                              vuln.after_code && (
                                <div className="flex flex-row w-full px-9 pb-4 gap-10">
                                  {/* Before */}
                                  <div className="flex-1 overflow-hidden">
                                    <div
                                      style={{
                                        ...TYPOGRAPHY.body1.regular,
                                        color: severityConfig.color,
                                        borderBottom: `1px solid ${severityConfig.color}`,
                                        paddingBottom: "10px",
                                        marginBottom: "16px",
                                      }}
                                    >
                                      Before (Vulnerable)
                                    </div>
                                    <pre
                                      style={{
                                        ...TYPOGRAPHY.body1.regular,
                                        color: severityConfig.color,
                                      }}
                                    >
                                      <code>{vuln.before_code}</code>
                                    </pre>
                                  </div>

                                  {/* After */}
                                  <div className="flex-1 overflow-hidden">
                                    <div
                                      style={{
                                        ...TYPOGRAPHY.body1.regular,
                                        color: COLORS.primary[500],
                                        borderBottom: `1px solid ${COLORS.primary[500]}`,
                                        paddingBottom: "6px",
                                        marginBottom: "16px",
                                      }}
                                      className="flex items-center justify-between"
                                    >
                                      <div>After (AI-Secured)</div>
                                      <button
                                        onClick={() =>
                                          handleCopyAfterCode(
                                            vuln.id,
                                            vuln.after_code || ""
                                          )
                                        }
                                        className="p-1.5 rounded-md text-green-400/60 hover:text-green-400 hover:bg-green-400/10 transition-colors"
                                        title={
                                          copiedAfterCode === vuln.id
                                            ? "Copied!"
                                            : "Copy to clipboard"
                                        }
                                      >
                                        {copiedAfterCode === vuln.id ? (
                                          <Check className="w-4 h-4" />
                                        ) : (
                                          <Copy
                                            className="w-4 h-4"
                                            color={COLORS.primary[500]}
                                          />
                                        )}
                                      </button>
                                    </div>
                                    <pre
                                      style={{
                                        ...TYPOGRAPHY.body1.regular,
                                        color: COLORS.primary[500],
                                      }}
                                      className="overflow-x-auto"
                                    >
                                      <code>{vuln.after_code}</code>
                                    </pre>
                                  </div>
                                </div>
                              )}

                            {/* Fix Steps */}
                            {vuln.ai_analyzed &&
                              vuln.fix_steps &&
                              vuln.fix_steps.length > 0 && (
                                <div
                                  style={{
                                    backgroundColor: COLORS.grayscale[1100],
                                    padding: "24px 30px",
                                  }}
                                >
                                  <div
                                    style={{
                                      ...TYPOGRAPHY.body1.semiBold,
                                      color: COLORS.grayscale[700],
                                    }}
                                    className="mb-2"
                                  >
                                    How to Fix
                                  </div>
                                  <ol
                                    style={{
                                      ...TYPOGRAPHY.body2.regular,
                                      color: "white",
                                    }}
                                  >
                                    {vuln.fix_steps.map((step, i) => (
                                      <li key={i}>{step}</li>
                                    ))}
                                  </ol>
                                </div>
                              )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Trust Badge Section */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Your Trust Badge
                </h2>
              </div>

              {/* Badge Preview */}
              <div className="flex flex-col items-center justify-center glass-strong rounded-xl p-8">
                <p className="text-sm text-muted-foreground mb-4">Preview</p>
                <img
                  src={badge.badge_url}
                  alt={`Trust Score: ${grade}`}
                  className="h-8"
                />
                <a
                  href={badge.badge_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs text-[#00f3ff] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open in new tab
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Generate Badge Button (if no vulnerabilities or all fixed) */}
        {!badge && vulns.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8"
            style={{
              maxWidth: "1560px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                border: " 1px solid rgba(255, 255, 255, 0.1)",
                height: "300px",
                gap: "10px",
              }}
            >
              <div
                style={{
                  ...TYPOGRAPHY.h3.semiBold,
                  color: "white",
                  marginBottom: "8px",
                }}
              >
                Celebrate Your Security!
              </div>
              <p style={{ ...TYPOGRAPHY.body1.regular, color: "white" }}>
                Show off your perfect score with a Trust Badge on your README.
              </p>
              <Button
                onClick={handleGenerateBadge}
                disabled={isGeneratingBadge}
                style={{
                  cursor: "pointer",
                }}
              >
                {isGeneratingBadge ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Award className="w-4 h-4 mr-2" />
                )}
                Generate Trust Badge
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
