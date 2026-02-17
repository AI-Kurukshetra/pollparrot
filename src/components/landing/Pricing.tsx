"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { Button, Card } from "@/components/ui";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    period: "forever",
    features: [
      "Up to 3 surveys",
      "100 responses per survey",
      "Basic analytics",
      "Email support",
      "Survey templates",
      "Standard question types",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For growing teams & businesses",
    price: "$19",
    period: "per month",
    features: [
      "Unlimited surveys",
      "1,000 responses per survey",
      "Advanced analytics & charts",
      "Priority email support",
      "All templates",
      "All 11 question types",
      "Export to CSV/Excel",
      "Custom branding",
      "Remove PollParrot branding",
    ],
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    description: "For large organizations",
    price: "$49",
    period: "per month",
    features: [
      "Everything in Pro",
      "Unlimited responses",
      "Team collaboration",
      "Role-based access control",
      "Priority phone support",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "HIPAA compliance",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="w-full py-24 bg-background-medium">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary">
            Simple, Transparent
            <span className="text-gradient"> Pricing</span>
          </h2>
          <p className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto">
            Start for free, upgrade when you need more. No hidden fees, no
            surprises.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-4 items-start">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              padding="none"
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.highlighted
                  ? "lg:-mt-4 lg:mb-4 border-primary shadow-xl shadow-primary/10 ring-2 ring-primary"
                  : "border-border hover:border-border-light"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan header */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-text-primary">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    <span className="text-text-muted">/{plan.period}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link href="/signup">
                  <Button
                    fullWidth
                    variant={plan.highlighted ? "primary" : "outline"}
                    size="lg"
                    className={plan.highlighted ? "glow-peach" : ""}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                {/* Features list */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          plan.highlighted
                            ? "bg-primary/20 text-primary"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-text-secondary text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <p className="text-text-muted">
            Have questions?{" "}
            <a
              href="#"
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              Check our FAQ
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
