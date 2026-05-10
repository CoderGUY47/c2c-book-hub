"use client";
import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/store/api";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Mail,
  Shield,
  Loader2,
  RefreshCw,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HandoverQRProps {
  orderId: string;
  handoverCode?: string;
  size?: number;
}

const HandoverQR: React.FC<HandoverQRProps> = ({
  orderId,
  handoverCode,
  size = 160,
}) => {
  const code = handoverCode || orderId.slice(-7).toUpperCase();
  const qrValue = JSON.stringify({ orderId, code });

  const [otpStep, setOtpStep] = useState<"idle" | "sent" | "verified">("idle");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isCounting, setIsCounting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const handleSendOtp = async () => {
    try {
      const result = await sendOtp().unwrap();
      toast.success("OTP sent to your EDU email! Check your inbox.");
      setOtpStep("sent");
      setIsCounting(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsCounting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send OTP.");
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    try {
      const result = await verifyOtp(otp).unwrap();
      setOtpStep("verified");
      toast.success("✅ Identity verified!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid OTP. Try again.");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtpDigits(text.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  if (otpStep === "verified") {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-indigo-900/80 to-violet-900/80 border border-indigo-500/30 rounded-2xl text-center">
        {/* Animated checkmark */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
            <CheckCircle2 className="size-14 text-white" />
          </div>
          <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
        </div>
        <div>
          <h3 className="text-white font-black text-xl uppercase tracking-wider">
            Identity Verified!
          </h3>
          <p className="text-indigo-200 text-sm mt-1 font-medium">
            ✅ Thank you for using <span className="text-indigo-300 font-black">OxPecker BookHub</span>
          </p>
          <p className="text-indigo-300/70 text-xs mt-2">
            Show the QR code below to the seller to complete your campus handover.
          </p>
        </div>
        {/* QR still shown after verification */}
        <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-indigo-500/30 border-4 border-indigo-500/40">
          <QRCodeCanvas
            value={qrValue}
            size={size}
            level="H"
            imageSettings={{
              src: "/images/oxpecker.png",
              height: Math.round(size * 0.24),
              width: Math.round(size * 0.24),
              excavate: true,
            }}
            fgColor="#3730a3"
            bgColor="#ffffff"
          />
        </div>
        <div className="bg-indigo-800/60 px-4 py-2 rounded-xl border border-indigo-500/30 w-full">
          <p className="text-indigo-300 text-[10px] uppercase font-bold tracking-[0.2em]">Handover Code</p>
          <p className="text-white text-2xl font-mono font-black tracking-[0.3em] mt-1">
            #{code}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 p-5 bg-gradient-to-br from-indigo-900/60 to-violet-900/60 border border-indigo-500/30 rounded-2xl">
      {/* Themed QR with logo */}
      <div className="relative">
        <div className="bg-white p-3 rounded-2xl shadow-2xl shadow-indigo-500/20 border-4 border-indigo-500/30">
          <QRCodeCanvas
            value={qrValue}
            size={size}
            level="H"
            imageSettings={{
              src: "/images/oxpecker.png",
              height: Math.round(size * 0.24),
              width: Math.round(size * 0.24),
              excavate: true,
            }}
            fgColor="#3730a3"
            bgColor="#ffffff"
          />
        </div>
        {/* Glow ring */}
        <div className="absolute -inset-1 rounded-2xl bg-indigo-500/20 blur-sm -z-10" />
      </div>

      {/* Handover Code */}
      <div className="text-center w-full">
        <p className="text-indigo-300 text-[10px] uppercase font-black tracking-[0.2em]">Handover Code</p>
        <p className="text-white text-2xl font-mono font-black tracking-[0.3em] mt-1">#{code}</p>
        <p className="text-indigo-300/70 text-[10px] mt-1">Show this to the seller to confirm handover</p>
      </div>

      {/* OTP Section */}
      <div className="w-full border-t border-indigo-500/20 pt-4">
        {otpStep === "idle" && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-200">
              <Shield className="size-4" />
              <p className="text-xs font-bold">Verify your identity with OTP</p>
            </div>
            <p className="text-indigo-300/70 text-[11px] text-center leading-relaxed">
              We'll send a 6-digit code to your <strong className="text-indigo-200">EDU email</strong> for extra security.
            </p>
            <Button
              onClick={handleSendOtp}
              disabled={isSending}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black uppercase tracking-wider text-xs h-10 rounded-xl px-6 w-full shadow-lg shadow-indigo-500/30"
            >
              {isSending ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Sending OTP...</>
              ) : (
                <><Mail className="mr-2 size-4" /> Send OTP to My EDU Email</>
              )}
            </Button>
          </div>
        )}

        {otpStep === "sent" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <Mail className="size-4" />
              <p className="text-xs font-bold">OTP sent! Check your inbox.</p>
            </div>
            {/* 6-digit OTP input boxes */}
            <div className="flex gap-2" onPaste={handlePaste}>
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-10 h-12 text-center text-xl font-black text-indigo-900 bg-white rounded-xl border-2 border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 shadow-lg transition-all"
                />
              ))}
            </div>
            <Button
              onClick={handleVerifyOtp}
              disabled={isVerifying || otpDigits.join("").length !== 6}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black uppercase tracking-wider text-xs h-10 rounded-xl px-6 w-full shadow-lg"
            >
              {isVerifying ? (
                <><Loader2 className="mr-2 size-4 animate-spin" /> Verifying...</>
              ) : (
                <><Lock className="mr-2 size-4" /> Verify OTP</>
              )}
            </Button>
            <button
              onClick={handleSendOtp}
              disabled={isCounting || isSending}
              className="text-indigo-300 text-[11px] flex items-center gap-1 hover:text-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="size-3" />
              {isCounting ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandoverQR;
