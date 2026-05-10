"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSaveInstitutionInfoMutation, useSendInstitutionOtpMutation, useVerifyAuthMutation } from "@/store/api";
import { toast } from "react-toastify";
import { Building2, GraduationCap, Briefcase, ArrowRight, Loader2, MapPin, Mail, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const InstitutionInfoPage = () => {
  const router = useRouter();
  const [saveInstitutionInfo, { isLoading: isSaving }] = useSaveInstitutionInfoMutation();
  const [sendInstitutionOtp, { isLoading: isSendingOtp }] = useSendInstitutionOtpMutation();
  const [verifyAuth] = useVerifyAuthMutation();

  const [formData, setFormData] = useState({
    institution: "",
    institutionType: "university",
    department: "",
    educationalEmail: "",
    institutionRole: "student",
    studentId: "",
  });

  const [userData, setUserData] = useState<any>(null);
  
  // OTP State
  const [otpStep, setOtpStep] = useState<"idle" | "sent">("idle");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isCounting, setIsCounting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyAuth().unwrap();
        setUserData(res.data);
        if (res.data?.hasCompletedProfile) {
          router.push("/"); // Already completed
        }
      } catch (err) {
        router.push("/"); // Not logged in
      }
    };
    checkAuth();
  }, [verifyAuth, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.educationalEmail) {
      toast.error("Please enter your academic or professional email.");
      return;
    }

    try {
      await sendInstitutionOtp(formData.educationalEmail).unwrap();
      toast.success("OTP sent! Please check your institutional email.");
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

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtpDigits(text.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution || !formData.educationalEmail) {
      toast.error("Please enter your institution name and educational email.");
      return;
    }

    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }

    try {
      await saveInstitutionInfo({ ...formData, otp }).unwrap();
      toast.success("Profile completed successfully! Welcome to OxPecker BookHub! 🎉");
      router.push("/");
      window.location.href = "/"; // Force full reload to update app state
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a]">
        <Loader2 className="size-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Branding/Welcome */}
        <div className="w-full lg:w-2/5 bg-gradient-to-br from-indigo-600 to-violet-800 p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6 border border-white/20">
              <GraduationCap className="size-8 text-white" />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
              Welcome to <br />
              <span className="text-indigo-200">BookHub</span>
            </h1>
            <p className="mt-4 text-indigo-100/80 text-sm font-medium leading-relaxed">
              We noticed you logged in with a personal email. To unlock full campus exchange features and maintain a trusted community, please verify your academic or professional identity.
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <div className="flex items-center gap-3">
              {userData.profilePicture ? (
                <Image src={userData.profilePicture} alt="Profile" width={40} height={40} className="rounded-full border-2 border-white/20" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
                  {userData.name?.[0] || "U"}
                </div>
              )}
              <div>
                <p className="font-bold text-sm">{userData.name}</p>
                <p className="text-xs text-indigo-200">{userData.email}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-indigo-200/60 font-medium">
              * Your professional/academic email will remain hidden from other users.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-3/5 p-8 relative z-10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="text-indigo-500" /> Verify Identity
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Institution Name */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Institution Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  placeholder="e.g. Daffodil International University"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Type & Role Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Type *
                </label>
                <select
                  name="institutionType"
                  value={formData.institutionType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm appearance-none"
                  required
                >
                  <option value="university">University</option>
                  <option value="college">College</option>
                  <option value="govt_organization">Govt. Organization</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Your Role *
                </label>
                <select
                  name="institutionRole"
                  value={formData.institutionRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm appearance-none"
                  required
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="staff">Staff</option>
                  <option value="alumni">Alumni</option>
                  <option value="employee">Employee</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Institutional Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                Educational / Professional Email *
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full border border-indigo-500/30">HIDDEN</span>
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="educationalEmail"
                    value={formData.educationalEmail}
                    onChange={handleChange}
                    placeholder="e.g. name@diu.edu.bd"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                    required
                    disabled={otpStep === "sent"}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || isCounting || !formData.educationalEmail}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl px-4"
                >
                  {isSendingOtp ? <Loader2 className="animate-spin size-4" /> : isCounting ? `Resend (${countdown}s)` : "Send OTP"}
                </Button>
              </div>
            </div>

            {/* OTP Verification */}
            {otpStep === "sent" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
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
                      className="w-12 h-14 text-center text-xl font-black text-white bg-gray-900 rounded-xl border border-indigo-500/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 shadow-inner transition-all"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Department & Student ID Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Department (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. CSE"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Student ID (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="e.g. 211-15-14"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving || otpStep !== "sent" || otpDigits.join("").length !== 6}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <><Loader2 className="animate-spin size-5" /> Verifying & Saving...</>
              ) : (
                <><ShieldCheck className="size-5" /> Verify & Complete Profile <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstitutionInfoPage;
