export const MARKETPLACE_POLICIES=[
  {
    id: "SEC-1.1",
    section: "Section 1.1 - Truthful Pricing",
    title: "Price Formatting & Accuracy",
    description: "Price must be a valid positive number up to 2 decimal places. Negative, zero, or hidden placeholder values are prohibited.",
    severity: "critical"
  },
  {
    id: "SEC-2.1",
    section: "Section 2.1 - Unverifiable & Superlative Claims",
    title: "Superlative Claims Without Substantiation",
    description: "Phrases like '100% Best', 'World's #1', 'Miracle' are prohibited without verified third-party laboratory certification.",
    severity: "critical"
  },
  {
    id: "SEC-2.2",
    section: "Section 2.2 - Prohibited Items & Medical Claims",
    title: "Unauthorized Health & Medical Promises",
    description: "Listings must not claim to cure, treat, or prevent medical disorders without regulatory drug licensing.",
    severity: "critical"
  },
  {
    id: "SEC-3.1",
    section: "Section 3.1 - Brand Guide & Clarity",
    title: "Title Readability & Casing",
    description: "Titles must be 10-120 chars. Full UPPERCASE text is prohibited. Use Title Case or Sentence Case.",
    severity: "warning"
  },
  {
    id: "SEC-3.2",
    section: "Section 3.2 - Description Completeness",
    title: "Minimum Specification Threshold",
    description: "Descriptions must be at least 40 characters long and detail dimensions, materials, or technical specifications.",
    severity: "warning"
  },
  {
    id: "SEC-4.1",
    section: "Section 4.1 - Supported Categories",
    title: "Taxonomy Compliance",
    description: "Category must belong to approved marketplace taxonomy.",
    severity: "critical"
  }
];

export const SUPPORTED_CATEGORIES=[
  "Electronics",
  "Home & Kitchen",
  "Fashion & Apparel",
  "Beauty & Personal Care",
  "Books & Stationery",
  "Sports & Fitness"
];