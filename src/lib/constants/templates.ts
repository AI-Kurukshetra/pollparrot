// Template categories - IDs must match settings.templateCategory in seed data
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates" },
  { id: "customer_feedback", label: "Customer Feedback" },
  { id: "employee", label: "Employee" },
  { id: "events", label: "Events" },
  { id: "product", label: "Product" },
  { id: "education", label: "Education" },
  { id: "market_research", label: "Market Research" },
];

// Helper to get category label by ID
export function getCategoryLabel(categoryId: string): string {
  const category = TEMPLATE_CATEGORIES.find(c => c.id === categoryId);
  return category?.label || categoryId;
}
