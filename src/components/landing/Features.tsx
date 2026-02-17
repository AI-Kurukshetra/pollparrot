"use client";

import {
  MousePointerClick,
  ListChecks,
  BarChart3,
  Share2,
  LayoutTemplate,
  Users,
} from "lucide-react";
import { Card, CardBody } from "@/components/ui";

const features = [
  {
    icon: MousePointerClick,
    title: "Easy Survey Builder",
    description:
      "Intuitive drag-and-drop interface. Build professional surveys in minutes without any coding knowledge.",
  },
  {
    icon: ListChecks,
    title: "11 Question Types",
    description:
      "Multiple choice, rating scales, file uploads, rankings, and more. Every question type you need.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Watch responses roll in live. Visualize data with beautiful charts and export detailed reports.",
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description:
      "Distribute via link, QR code, email, or embed directly on your website. Reach respondents everywhere.",
  },
  {
    icon: LayoutTemplate,
    title: "Templates Gallery",
    description:
      "Start fast with pre-built templates for customer feedback, employee surveys, events, and more.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Work together seamlessly. Share surveys, assign roles, and analyze results as a team.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full py-24 bg-background-medium">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            Everything You Need to
            <span className="text-gradient"> Succeed</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
            Powerful features designed to help you create, distribute, and
            analyze surveys more effectively than ever before.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              hoverable
              padding="lg"
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                {/* Icon */}
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>

                <CardBody className="p-0">
                  <h3 className="text-xl font-semibold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </CardBody>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-text-muted">
            And many more features to explore.{" "}
            <a
              href="/signup"
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              Get started for free →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
