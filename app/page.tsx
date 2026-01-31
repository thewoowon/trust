"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LandingView } from "@/components/trust/landing-view";
import { ScanningView } from "@/components/trust/scanning-view";
import { DashboardView } from "@/components/trust/dashboard-view";
import { MCPView } from "@/components/trust/mcp-view";
import type { ScanResult } from "@/lib/types";
import { startScan } from "@/lib/api";

export type AppState = "landing" | "scanning" | "dashboard" | "mcp";

export default function TrustApp() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [scanTarget, setScanTarget] = useState("");
  const [scanId, setScanId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleStartScan = async (target: string) => {
    setScanTarget(target);
    setScanError(null);
    setAppState("scanning");

    try {
      // Start the scan via API
      const response = await startScan(target, "quick");
      setScanId(response.scan_id);
    } catch (error) {
      console.error("Failed to start scan:", error);
      setScanError(
        error instanceof Error ? error.message : "Failed to start scan"
      );
      // Still show scanning view - it will handle the error state
    }
  };

  const handleScanComplete = (result: ScanResult) => {
    setScanResult(result);
    setAppState("dashboard");
  };

  const handleScanError = (error: string) => {
    setScanError(error);
    // Stay on scanning view to show error
  };

  const handleNavigate = (state: AppState) => {
    setAppState(state);
  };

  const handleNewScan = () => {
    // Reset state for new scan
    setScanId(null);
    setScanResult(null);
    setScanError(null);
    setAppState("landing");
  };

  return (
    <main className="min-h-screen bg-[#060606] overflow-hidden relative scroll-smooth">
      <AnimatePresence mode="wait">
        {appState === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <LandingView
              onStartScan={handleStartScan}
              onNavigateToMcp={() => setAppState("mcp")}
            />
          </motion.div>
        )}

        {appState === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <ScanningView
              target={scanTarget}
              scanId={scanId}
              onComplete={handleScanComplete}
              onError={handleScanError}
              initialError={scanError}
              onGoHome={handleNewScan}
            />
          </motion.div>
        )}

        {appState === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <DashboardView
              scanResult={scanResult}
              onNavigate={handleNavigate}
              onNewScan={handleNewScan}
            />
          </motion.div>
        )}

        {appState === "mcp" && (
          <motion.div
            key="mcp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <MCPView onNavigate={handleNavigate} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
