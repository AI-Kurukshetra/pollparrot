"use client";

import { Star, Quote } from "lucide-react";
import { Card, Avatar } from "@/components/ui";

const testimonials = [
  {
    quote:
      "PollParrot transformed how we collect customer feedback. The real-time analytics helped us identify issues 50% faster than before.",
    author: "Sarah Chen",
    role: "Head of Customer Success",
    company: "TechFlow Inc.",
    avatar: null,
    rating: 5,
  },
  {
    quote:
      "We switched from our old survey tool and never looked back. The interface is so intuitive that our whole team was onboarded in minutes.",
    author: "Marcus Johnson",
    role: "HR Director",
    company: "Global Dynamics",
    avatar: null,
    rating: 5,
  },
  {
    quote:
      "The templates saved us hours of work. We launched our first employee survey in under 5 minutes and got incredible response rates.",
    author: "Emily Rodriguez",
    role: "Operations Manager",
    company: "StartupHub",
    avatar: null,
    rating: 5,
  },
];

const companyLogos = [
  "TechFlow",
  "Global Dynamics",
  "StartupHub",
  "DataCorp",
  "CloudFirst",
  "InnovateLabs",
];

export function Testimonials() {
  return (
    <section className="w-full py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            Loved by Teams
            <span className="text-gradient"> Worldwide</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
            Join thousands of satisfied users who trust PollParrot for their
            survey needs.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.author}
              padding="lg"
              className="relative group hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-warning fill-warning"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-text-primary text-lg leading-relaxed mb-8">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <Avatar
                  name={testimonial.author}
                  size="md"
                />
                <div>
                  <div className="font-semibold text-text-primary">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-text-muted">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-primary">{testimonial.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Company logos */}
        <div className="mt-20">
          <p className="text-center text-text-muted mb-8">
            Trusted by innovative companies around the world
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {companyLogos.map((company) => (
              <div
                key={company}
                className="text-text-muted/50 font-bold text-xl hover:text-text-muted transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
