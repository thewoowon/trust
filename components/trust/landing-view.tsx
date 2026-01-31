"use client";

import React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Globe, Sparkles, Lock, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TitleIcon from "../svg/TitleIcon";
import { TYPOGRAPHY } from "@/styles/typography";
import { COLORS } from "@/styles/color";
import styled from "@emotion/styled";
import {
  BlurLogoIcon,
  BotIcon,
  GithubIcon,
  GloveIcon,
  JointIcon,
  LogoFullIcon,
  LogoIcon,
} from "../svg";
import Image from "next/image";
import ColorBends from "../ColorBends";

interface LandingViewProps {
  onStartScan: (target: string) => void | Promise<void>;
  onNavigateToMcp?: () => void;
}

export function LandingView({
  onStartScan,
  onNavigateToMcp,
}: LandingViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onStartScan(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden min-w-480">
      {/* ColorBends Background */}
      {/* <div className="fixed inset-0 z-0">
        <ColorBends
          rotation={45}
          speed={0.2}
          colors={["#5227FF", "#FF9FFC", "#7cff67"]}
          transparent
          autoRotate={0}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.1}
        />
      </div> */}
      <div className="absolute -top-1/5 -right-200 z-10">
        <BlurLogoIcon />
      </div>
      <div className="absolute top-1/8 -left-100 z-10">
        <BlurLogoIcon />
      </div>
      <div className="fixed inset-0 z-20 overflow-hidden pointer-events-none">
        <Image src={"/assets/images/noise_background.png"} fill alt="noise" />
      </div>
      <div className="flex-1 flex flex-col z-30 relative pb-16">
        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
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
              onClick={onNavigateToMcp}
              style={{ ...TYPOGRAPHY.h3.semiBold }}
              className={`flex flex-row items-center px-6 py-3 text-white hover:bg-white/10 transition-colors border border-white gap-2.5`}
            >
              <BotIcon />
              MCP Agent
            </button>
          </motion.nav>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-center items-center max-w-5xl mx-auto"
          >
            <TitleIcon />
            <div
              style={{
                ...TYPOGRAPHY.h1.regular,
                fontSize: 116,
                lineHeight: 1.1,
                textAlign: "center",
              }}
              className="text-transparent bg-clip-text bg-[linear-gradient(90deg,#b4b4b4_0%,#b4b4b4_30%,#FFFFFF_40%,#FFFFFF_50%,#FFFFFF_60%,#b4b4b4_70%,#b4b4b4_100%)] bg-size-[300%_100%] animate-ultra-shine"
            >
              AI-Native Security <br />
              for Indie Devs
            </div>
            <p
              style={{ ...TYPOGRAPHY.h1.medium }}
              className="bg-clip-text text-transparent bg-linear-to-l from-[#3368A2] to-[rgba(250,250,250,0.7)] mt-4"
            >
              Scan for security issues and get AI fixes instantly
            </p>
            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-220.75 mx-auto mt-27"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-px bg-linear-to-l from-[#c5dffb]/10 to-[white]/60"
              >
                <div
                  className={`flex items-center relative bg-[#141414] pl-6 pr-4 transition-all duration-300 h-22 border border-[#3368A2]`}
                >
                  <div className="flex-1 flex items-center gap-5">
                    <div
                      style={{
                        ...TYPOGRAPHY.body1.regular,
                        color: COLORS.grayscale["900"],
                      }}
                      className="flex items-center gap-2"
                    >
                      <GloveIcon />
                      <span className="hidden sm:inline text-sm">or</span>
                      <GithubIcon />
                    </div>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Enter URL or GitHub Repository"
                      className="flex-1 bg-transparent border-none outline-none placeholder:text-[#434343] py-3"
                      style={{
                        ...TYPOGRAPHY.h3.regular,
                        color: COLORS.primary["500"],
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      style={{
                        ...TYPOGRAPHY.h3.semiBold,
                        color: COLORS.grayscale["800"],
                        gap: 10,
                        cursor: inputValue.trim() ? "pointer" : "not-allowed",
                      }}
                      className={`bg-white flex flex-row items-center px-[24] py-[12] disabled:bg-transparent disabled:cursor-not-allowed`}
                    >
                      <LogoIcon
                        width={32}
                        height={32}
                        fill="rgba(89, 89, 89, 1)"
                      />
                      Scan Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </form>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-row items-center justify-evenly mt-50 w-full"
            style={{
              backgroundColor: COLORS.grayscale[1400],
            }}
          >
            <div
              style={{
                flex: 1,
                position: "relative",
                height: "408px",
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
            {[
              {
                title: "Vulnerability Scanning",
                description:
                  "Scan your codebase for security vulnerabilities with AI-powered detection",
              },
              {
                title: "API Key Detection",
                description:
                  "Detect exposed API keys, secrets, and credentials in your code",
              },
              {
                title: "AI Fix Assistant",
                description:
                  "Get AI-generated fixes with clear explanations for each security issue",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="min-w-87.5 w-87.5 h-102 p-10 hover:bg-white/4 transition-colors group"
                style={{
                  position: "relative",
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
                <h3
                  style={{ ...TYPOGRAPHY.h1.regular, color: "white" }}
                  className="mb-2"
                >
                  {feature.title}
                </h3>
                <p style={{ ...TYPOGRAPHY.h3.regular, color: "white" }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
            <div
              style={{
                flex: 1,
                position: "relative",
                height: "408px",
                borderRightWidth: 1,
                borderRightColor: "rgba(253, 253, 253, 0.15)",
                borderTopWidth: 1,
                borderTopColor: "rgba(253, 253, 253, 0.15)",
                borderBottomWidth: 1,
                borderBottomColor: "rgba(253, 253, 253, 0.15)",
              }}
            ></div>
          </motion.div>
        </div>
        <div
          style={{ ...TYPOGRAPHY.body1.regular }}
          className="text-center text-muted-foreground mt-auto"
        >
          Built by stones-lab, people who believe potential exists in everyone
        </div>
      </div>
    </div>
  );
}
