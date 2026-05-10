"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSaveInstitutionInfoMutation, useVerifyAuthMutation } from "@/store/api";
import { toast } from "react-toastify";
import { Building2, GraduationCap, Briefcase, ArrowRight, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const InstitutionInfoPage = () => {
  const router = useRouter();
  const [saveInstitutionInfo, { isLoading }] = useSaveInstitutionInfoMutation();
  const [verifyAuth] = useVerifyAuthMutation();

  const [formData, setFormData] = useState({
    institution: "",
    institutionType: "university",
    department: "",
    institutionRole: "student",
    studentId: "",
  });

  const [userData, setUserData] = useState<any>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution) {
      toast.error("Please enter your institution name");
      return;
    }

    try {
      await saveInstitutionInfo(formData).unwrap();
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
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
      </div>

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Branding/Welcome */}
        <div className="w-full md:w-2/5 bg-gradient-to-br from-indigo-600 to-violet-800 p-8 flex flex-col justify-between text-white relative overflow-hidden">
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
              We noticed you logged in with a personal email. Please tell us about your institution to unlock full campus exchange features.
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
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-3/5 p-8 relative z-10">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="text-indigo-500" /> Institution Details
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

            {/* Department */}
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
                  placeholder="e.g. Computer Science"
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Student ID */}
            {formData.institutionRole === 'student' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
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
                    placeholder="e.g. 211-15-14... (Helps with verification)"
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all group"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin size-5" /> Saving...</>
              ) : (
                <>Complete Profile <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InstitutionInfoPage;
