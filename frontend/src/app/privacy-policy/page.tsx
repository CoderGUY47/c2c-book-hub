"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Info, Share2, Lock, Bell, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const policySections = [
    {
      icon: <Info className="h-6 w-6 text-blue-500" />,
      title: "Information We Collect",
      content: "We collect information from you when you register on our site or place an order. This includes your name, email address, mailing address, phone number, and payment information."
    },
    {
      icon: <Info className="h-6 w-6 text-green-500" />,
      title: "How We Use Your Information",
      content: "We use the information we collect to process transactions, improve our website, and send periodic emails regarding your order or other products and services."
    },
    {
      icon: <Share2 className="h-6 w-6 text-yellow-500" />,
      title: "Sharing Your Information",
      content: "We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent."
    },
    {
      icon: <Lock className="h-6 w-6 text-red-500" />,
      title: "Security of Your Information",
      content: "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information."
    },
    {
      icon: <Bell className="h-6 w-6 text-purple-500" />,
      title: "Changes to Our Privacy Policy",
      content: "We may update this privacy policy periodically. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account or by placing a prominent notice on our site."
    },
    {
      icon: <Mail className="h-6 w-6 text-teal-500" />,
      title: "Contact Us",
      content: "If you have any questions about this privacy policy or our practices regarding your personal information, please contact us at support@bookshop.com."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-sky-500 to-purple-500 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold flex items-center justify-center text-white">
              <Shield className="h-10 w-10 mr-4 text-white" />
              Privacy Policy
            </CardTitle>
            <p className="text-sm text-white/80 mt-2">Last Updated: July 18, 2025</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-center text-white/90">
              At Book-Shop, we are committed to protecting your privacy. This privacy policy explains how we collect, use, and disclose your information.
            </p>
            {policySections.map((section, index) => (
              <PolicySection key={index} icon={section.icon} title={section.title}>
                {section.content}
              </PolicySection>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface PolicySectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const PolicySection = ({ icon, title, children }: PolicySectionProps) => (
  <div className="bg-white/80 p-6 rounded-xl shadow-md text-gray-800">
    <div>
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      <p className="text-gray-600 mt-2 pl-10">{children}</p>
    </div>
  </div>
);

export default PrivacyPolicy;