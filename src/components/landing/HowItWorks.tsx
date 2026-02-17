"use client";

import { PenTool, Send, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: PenTool,
    title: "Create",
    description:
      "Build your survey in minutes using our intuitive builder. Choose from 11 question types and customize every detail.",
    color: "from-primary to-primary-light",
  },
  {
    number: "02",
    icon: Send,
    title: "Share",
    description:
      "Distribute your survey via shareable link, QR code, email invitation, or embed it directly on your website.",
    color: "from-success to-success-light",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Analyze",
    description:
      "View real-time responses with beautiful visualizations. Export data and make informed decisions.",
    color: "from-warning to-warning-light",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            Three Simple Steps to
            <span className="text-gradient"> Better Feedback</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
            Getting started is easy. Create your first survey in under 2 minutes
            and start collecting valuable insights.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[16.67%] right-[16.67%] h-1 bg-gradient-to-r from-primary via-success to-warning transform -translate-y-1/2 opacity-20" />

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="relative group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step card */}
                <div className="relative bg-background-medium rounded-2xl p-8 border border-border group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/5">
                  {/* Step number badge */}
                  <div className="absolute -top-6 left-8">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-background-light flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow indicator - desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 transform -translate-y-1/2 translate-x-full z-10">
                      <svg
                        className="w-8 h-8 text-border"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Mobile arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-6">
                    <svg
                      className="w-8 h-8 text-border transform rotate-90"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border">
          {[
            { value: "10K+", label: "Survey Creators" },
            { value: "50K+", label: "Surveys Created" },
            { value: "2M+", label: "Responses Collected" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
