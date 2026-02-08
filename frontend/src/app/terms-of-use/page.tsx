"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, UserCheck, Book, Edit, Mail } from 'lucide-react';

const TermsOfUse = () => {
  const termsSections = [
    {
      icon: <UserCheck className="h-6 w-6 text-blue-500" />,
      title: "Acceptance of Terms",
      content: "By accessing this website, you accept these terms and conditions in full. If you disagree with any part of these terms, you must not use our website."
    },
    {
      icon: <UserCheck className="h-6 w-6 text-green-500" />,
      title: "User Responsibilities",
      content: "Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account."
    },
    {
      icon: <Book className="h-6 w-6 text-yellow-500" />,
      title: "Selling Books",
      content: "When selling books on BookKart, you agree to provide accurate and complete information about the books you are listing."
    },
    {
      icon: <Edit className="h-6 w-6 text-red-500" />,
      title: "Changes to Terms",
      content: "We may revise these terms from time to time. The revised terms will apply to the use of our website from the date of publication."
    },
    {
      icon: <Mail className="h-6 w-6 text-purple-500" />,
      title: "Contact Us",
      content: "If you have any questions about these terms, please contact us at support@bookkart.com."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold flex items-center justify-center text-white">
              <FileText className="h-10 w-10 mr-4 text-white" />
              Terms of Use
            </CardTitle>
            <p className="text-sm text-white/80 mt-2">Last Updated: July 18, 2025</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <p className="text-center text-white/90">
              Welcome to BookKart! These terms and conditions outline the rules and regulations for the use of our website.
            </p>
            {termsSections.map((section, index) => (
              <PolicySection key={index} icon={section.icon} title={section.title}>
                {section.content}
              </PolicySection>
            ))}
            <div className="pt-8">
              <h2 className="text-2xl font-semibold text-center mb-4 text-white">Leave a Comment</h2>
              <form className="max-w-lg mx-auto">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-white font-semibold mb-2">Email Address</label>
                  <input type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 placeholder-gray-500 text-gray-800" placeholder="you@example.com" />
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-white font-semibold mb-2">Comment</label>
                  <textarea id="comment" rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 placeholder-gray-500 text-gray-800" placeholder="Your comment..."></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Submit
                  </button>
                </div>
              </form>
            </div>
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

export default TermsOfUse;