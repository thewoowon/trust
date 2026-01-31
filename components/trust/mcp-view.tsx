"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  FileCode,
  Check,
  Book,
  ChevronLeft,
  Bot,
  Sparkles,
  Copy,
  Terminal,
  Settings,
  Monitor,
  Code2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AppState } from "@/app/page";
import { JointIcon, LogoFullIcon, TagIcon } from "../svg";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";

interface MCPViewProps {
  onNavigate: (state: AppState) => void;
}

const MCP_URL = "https://trust-mcp-knnd76vaqq-du.a.run.app/mcp";

const mcpConfigs = {
  claudeDesktop: {
    name: "Claude Desktop",
    icon: Monitor,
    path: "~/Library/Application Support/Claude/claude_desktop_config.json",
    pathWindows: "%APPDATA%\\Claude\\claude_desktop_config.json",
    config: `{
  "mcpServers": {
    "trust-security": {
      "type": "http",
      "url": "${MCP_URL}"
    }
  }
}`,
  },
  claudeCode: {
    name: "Claude Code",
    icon: Terminal,
    path: "Terminal (one-liner)",
    config: `claude mcp add --transport http trust-security "${MCP_URL}"`,
  },
  cursor: {
    name: "Cursor IDE",
    icon: Code2,
    path: "Settings > MCP",
    config: `{
  "trust-security": {
    "type": "http",
    "url": "${MCP_URL}"
  }
}`,
  },
};

const tools_primary = [
  {
    name: "scan_url",
    description: "Scan a website for security vulnerabilities",
    example: '"Scan https://my-app.com for vulnerabilities"',
  },
  {
    name: "check_secrets",
    description: "Find exposed API keys and credentials in code",
    example: '"Check this code for exposed secrets"',
  },
];

const tools_secondary = [
  {
    name: "analyze_code_security",
    description: "Detect SQL injection, XSS, and other issues",
    example: '"Is this code vulnerable to SQL injection?"',
  },
  {
    name: "get_fix_suggestion",
    description: "Get AI-powered fix suggestions",
    example: '"How do I fix this XSS vulnerability?"',
  },
];

export function MCPView({ onNavigate }: MCPViewProps) {
  const [selectedConfig, setSelectedConfig] =
    useState<keyof typeof mcpConfigs>("claudeDesktop");
  const [copiedConfig, setCopiedConfig] = useState(false);

  const copyConfig = async () => {
    await navigator.clipboard.writeText(mcpConfigs[selectedConfig].config);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const currentConfig = mcpConfigs[selectedConfig];

  return (
    <div className="min-h-screen flex flex-col">
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
      </header>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-auto my-46"
      >
        <div className="mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-8 mb-4">
              <div
                style={{
                  ...TYPOGRAPHY.h1.regular,
                  color: "white",
                  fontSize: "116px",
                }}
              >
                Trust
              </div>
              <svg
                width="237"
                height="85"
                viewBox="0 0 237 85"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 84.8802V0.00121338L12.012 0.0021875V0.00419922H25.212V12.0162H37.356V35.9082H47.916V12.0162H60.06V0.00419922H73.392V0.000393066L85.272 0V84.8802H72.072V13.3362H61.38V37.0962H49.236V73.0002H36.036V37.0962H23.892V13.3362H13.332V84.8802H0Z"
                  fill="white"
                />
                <path
                  d="M111.283 84.8802V73.0002H99.2715V12.0162H111.283V0.00421143H148.507V12.0162H160.651V37.0962H147.187V13.3362H112.603V71.6802H147.187V47.6562H160.651V73.0002H148.507V84.8802H111.283Z"
                  fill="white"
                />
                <path
                  d="M174.652 84.8802V12.0162H186.664V0.00421143H223.888V12.0162H236.032V48.9762H223.888V60.9882H187.984V84.8802H174.652ZM187.984 47.6562H222.568V13.3362H187.984V47.6562Z"
                  fill="white"
                />
              </svg>
              <div
                style={{
                  ...TYPOGRAPHY.h1.regular,
                  color: "white",
                  fontSize: "116px",
                }}
              >
                Server
              </div>
            </div>
            <p
              style={{ ...TYPOGRAPHY.h1.medium }}
              className="bg-clip-text text-transparent bg-linear-to-l from-[#3368A2] to-[rgba(250,250,250,0.7)] mt-4"
            >
              Real-time security feedback while you code
            </p>
          </div>
          {/* One-Line Install Notice */}
          <div className="flex flex-row">
            <div
              style={{
                flex: 1,
                position: "relative",
                height: "205px",
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
            <div
              style={{
                position: "relative",
                minWidth: 522,
                width: 522,
                padding: "32px 36px",
                borderRightWidth: 1,
                borderRightColor: "rgba(253, 253, 253, 0.15)",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
              className="flex flex-col items-start justify-start gap-5"
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
              <div
                style={{
                  ...TYPOGRAPHY.h2.bold,
                  color: "white",
                }}
              >
                Works with your tools
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.h3.regular,
                  color: "white",
                }}
              >
                Claude Desktop · Claude Code · Cursor <br />
                and any MCP-compatible tool
              </div>
            </div>
            <div
              style={{
                position: "relative",
                minWidth: 522,
                width: 522,
                padding: "32px 36px",
                borderRightWidth: 1,
                borderRightColor: "rgba(253, 253, 253, 0.15)",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
              className="flex flex-col items-start justify-start gap-5"
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
              <div
                style={{
                  ...TYPOGRAPHY.h2.bold,
                  color: "white",
                }}
              >
                No installation required
              </div>
              <div
                style={{
                  ...TYPOGRAPHY.h3.regular,
                  color: "white",
                }}
              >
                HTTP transport — just add the URL <br />
                to your config
              </div>
            </div>
            <div
              style={{
                flex: 1,
                position: "relative",
                height: "205px",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
            ></div>
          </div>

          {/* Configuration */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "1040px",
              margin: "40px auto",
              backgroundColor: COLORS.grayscale[1100],
              border: `1px solid ${COLORS.grayscale[1000]}`,
              gap: 20,
              padding: "23px 30px",
              minHeight: "395px",
            }}
            className="mb-8"
          >
            <div style={{ ...TYPOGRAPHY.h2.bold, color: "white" }}>
              Add to Your Environment
            </div>

            {/* Environment Selector */}
            <div className="flex gap-2">
              {(Object.keys(mcpConfigs) as Array<keyof typeof mcpConfigs>).map(
                (key) => {
                  const config = mcpConfigs[key];
                  const Icon = config.icon;
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedConfig(key)}
                      className={`flex items-center gap-2 pb-2.5 transition-all ${
                        selectedConfig === key
                          ? "text-[#7FB3EA]"
                          : "text-[#8C8C8C]"
                      }`}
                      style={{
                        ...TYPOGRAPHY.body1.regular,
                        borderBottomWidth: 1,
                        borderBottomColor:
                          selectedConfig === key ? "#7FB3EA" : "transparent",
                        cursor: "pointer",
                      }}
                    >
                      {config.name}
                    </div>
                  );
                }
              )}
            </div>

            {/* Config Display */}

            <div
              style={{
                padding: "20px 30px",
                backgroundColor: COLORS.grayscale[1400],
                color: COLORS.grayscale[700],
                ...TYPOGRAPHY.body2.regular,
              }}
              className="flex items-center gap-2"
            >
              <TagIcon />
              <span className="font-mono">{currentConfig.path}</span>
              {selectedConfig === "claudeDesktop" && (
                <span>
                  (Windows: <code>{mcpConfigs.claudeDesktop.pathWindows}</code>)
                </span>
              )}
            </div>
            <div className="relative group pl-7.5">
              <pre
                style={{
                  color: "white",
                  ...TYPOGRAPHY.body2.regular,
                }}
              >
                <code>{currentConfig.config}</code>
              </pre>
              <button
                onClick={copyConfig}
                className="absolute top-0 right-7.5 p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-white/10 transition-colors"
                title={copiedConfig ? "Copied!" : "Copy to clipboard"}
              >
                {copiedConfig ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" color={COLORS.primary[400]} />
                )}
              </button>
            </div>
          </div>

          {/* Available Tools */}
          <div className="mb-8">
            <div className="flex flex-row">
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: "205px",
                  borderRightWidth: 1,
                  borderRightColor: "rgba(253, 253, 253, 0.15)",
                  borderTopWidth: 1,
                  borderTopColor: "rgba(253, 253, 253, 0.15)",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(253, 253, 253, 0.15)",
                }}
              ></div>
              {tools_primary.map((tool) => (
                <div
                  key={tool.name}
                  style={{
                    position: "relative",
                    minWidth: 522,
                    width: 522,
                    height: "205px",
                    padding: "32px 36px",
                    borderRightWidth: 1,
                    borderRightColor: "rgba(253, 253, 253, 0.15)",
                    borderTopWidth: 1,
                    borderTopColor: "rgba(253, 253, 253, 0.15)",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(253, 253, 253, 0.15)",
                  }}
                  className="flex flex-col items-start justify-start gap-5"
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "24px",
                      fontFamily: "var(--font-pixelify-sans)",
                      lineHeight: 1.4,
                      color: COLORS.primary[400],
                    }}
                  >
                    {tool.name}
                  </div>
                  <div>
                    <p
                      style={{
                        ...TYPOGRAPHY.h3.regular,
                        color: "white",
                      }}
                    >
                      {tool.description}
                    </p>
                    <div
                      style={{
                        ...TYPOGRAPHY.h3.regular,
                        color: COLORS.primary[500],
                      }}
                    >
                      {tool.example}
                    </div>
                  </div>
                </div>
              ))}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: "205px",
                  borderRightWidth: 1,
                  borderRightColor: "rgba(253, 253, 253, 0.15)",
                  borderTopWidth: 1,
                  borderTopColor: "rgba(253, 253, 253, 0.15)",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(253, 253, 253, 0.15)",
                }}
              ></div>
            </div>
            <div className="flex flex-row">
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: "205px",
                  borderRightWidth: 1,
                  borderRightColor: "rgba(253, 253, 253, 0.15)",
                  borderTopWidth: 1,
                  borderTopColor: "rgba(253, 253, 253, 0.15)",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(253, 253, 253, 0.15)",
                }}
              ></div>
              {tools_secondary.map((tool) => (
                <div
                  key={tool.name}
                  style={{
                    position: "relative",
                    minWidth: 522,
                    width: 522,
                    height: "205px",
                    padding: "32px 36px",
                    borderRightWidth: 1,
                    borderRightColor: "rgba(253, 253, 253, 0.15)",
                    borderTopWidth: 1,
                    borderTopColor: "rgba(253, 253, 253, 0.15)",
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(253, 253, 253, 0.15)",
                  }}
                  className="flex flex-col items-start justify-start gap-5"
                >
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: "24px",
                      fontFamily: "var(--font-pixelify-sans)",
                      lineHeight: 1.4,
                      color: COLORS.primary[400],
                    }}
                  >
                    {tool.name}
                  </h3>
                  <div>
                    <p
                      style={{
                        ...TYPOGRAPHY.h3.regular,
                        color: "white",
                      }}
                    >
                      {tool.description}
                    </p>
                    <div
                      style={{
                        ...TYPOGRAPHY.h3.regular,
                        color: COLORS.primary[500],
                      }}
                    >
                      {tool.example}
                    </div>
                  </div>
                </div>
              ))}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  height: "205px",
                  borderRightWidth: 1,
                  borderRightColor: "rgba(253, 253, 253, 0.15)",
                  borderTopWidth: 1,
                  borderTopColor: "rgba(253, 253, 253, 0.15)",
                  borderBottomWidth: 1,
                  borderBottomColor: "rgba(253, 253, 253, 0.15)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
