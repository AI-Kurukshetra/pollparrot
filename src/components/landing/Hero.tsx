"use client";

import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 overflow-x-clip">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary/40 rounded-full animate-float" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-primary/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-primary/50 rounded-full animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fadeIn">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Trusted by 10,000+ survey creators
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-text-primary tracking-tight animate-slideUp">
            Create Surveys That
            <span className="block mt-2 text-gradient bg-gradient-to-r from-primary via-primary-light to-primary">
              Get Results
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-lg sm:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed animate-slideUp" style={{ animationDelay: "0.1s" }}>
            Build beautiful, engaging surveys in minutes. Collect feedback,
            understand your audience, and make data-driven decisions with powerful analytics.
          </p>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <Link href="/signup">
              <Button size="lg" className="glow-peach text-lg px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-text-muted animate-fadeIn" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free plan includes 3 surveys</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Setup in under 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="mt-20 relative animate-slideUp" style={{ animationDelay: "0.4s" }}>
          <div className="relative mx-auto max-w-5xl">
            {/* Browser mockup */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-2xl">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-b border-gray-200">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-white text-gray-500 text-sm">
                    pollparrot.com/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard preview */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total Surveys", value: "12" },
                    { label: "Responses", value: "2,847" },
                    { label: "Completion Rate", value: "94%" },
                    { label: "Active", value: "4" },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Customer Satisfaction Q4", status: "Active", responses: 89 },
                    { title: "Employee Feedback 2024", status: "Active", responses: 156 },
                    { title: "Product Research Survey", status: "Draft", responses: 0 },
                  ].map((survey) => (
                    <div key={survey.title} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#FFF5F0] flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{survey.title}</p>
                          <p className="text-sm text-gray-500">{survey.responses} responses</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        survey.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {survey.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating stats cards */}
            <div className="absolute left-4 xl:-left-4 top-1/4 hidden lg:block animate-float">
              <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Response Rate</p>
                    <p className="font-bold text-green-600">+24%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute right-4 xl:-right-4 bottom-1/3 hidden lg:block animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FFF5F0] flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">New Responses</p>
                    <p className="font-bold text-[#FF6B35]">+156</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
