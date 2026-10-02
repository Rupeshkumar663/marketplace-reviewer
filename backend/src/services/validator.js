import { SUPPORTED_CATEGORIES } from "../data/policies.js";

export function runDeterministicValidation(listing, existingTitles=[]){
  const issues=[];

  if(!listing.title||listing.title.trim()===""){
    issues.push({
      field: "title",
      policySection: "Section 3.1 - Brand Guide & Clarity",
      ruleTitle: "Missing Title",
      severity: "critical",
      message: "Listing title is strictly required.",
      isDeterministic: true
    });
  }

  if(!listing.description||listing.description.trim()===""){
    issues.push({
      field: "description",
      policySection: "Section 3.2 - Description Completeness",
      ruleTitle: "Missing Description",
      severity: "critical",
      message: "Listing description cannot be empty.",
      isDeterministic: true
    });
  }

  if(!listing.seller||listing.seller.trim()===""){
    issues.push({
      field: "seller",
      policySection: "Section 1.1 - Truthful Pricing",
      ruleTitle: "Missing Seller Identity",
      severity: "critical",
      message: "Seller identity is required.",
      isDeterministic: true
    });
  }

  if(listing.title&&(listing.title.length<10||listing.title.length>120)){
    issues.push({
      field: "title",
      policySection: "Section 3.1 - Brand Guide & Clarity",
      ruleTitle: "Title Length Out of Range",
      severity: "warning",
      message: `Title length (${listing.title.length}) is outside the permitted 10-120 character limit.`,
      isDeterministic: true
    });
  }

  if(listing.title&&listing.title.length>=10&&listing.title===listing.title.toUpperCase()){
    issues.push({
      field: "title",
      policySection: "Section 3.1 - Brand Guide & Clarity",
      ruleTitle: "Excessive Capitalization",
      severity: "warning",
      message: "Title contains full uppercase text.",
      suggestedFix: listing.title.toLowerCase().replace(/\b\w/g, c=>c.toUpperCase()),
      isDeterministic: true
    });
  }

  if(listing.description&&listing.description.length<40){
    issues.push({
      field: "description",
      policySection: "Section 3.2 - Description Completeness",
      ruleTitle: "Description Too Brief",
      severity: "warning",
      message: "Description must be at least 40 characters detailing features or specs.",
      isDeterministic: true
    });
  }

  const numericPrice=Number(listing.price);
  if(isNaN(numericPrice)||numericPrice<=0){
    issues.push({
      field: "price",
      policySection: "Section 1.1 - Truthful Pricing",
      ruleTitle: "Invalid Price Format",
      severity: "critical",
      message: "Price must be a valid positive number.",
      suggestedFix: "9.99",
      isDeterministic: true
    });
  }

  if(!SUPPORTED_CATEGORIES.includes(listing.category)){
    issues.push({
      field: "category",
      policySection: "Section 4.1 - Supported Categories",
      ruleTitle: "Unsupported Category",
      severity: "critical",
      message: `Category '${listing.category}' is unsupported. Choose from supported taxonomy.`,
      suggestedFix: SUPPORTED_CATEGORIES[0],
      isDeterministic: true
    });
  }

  const normalizedTitle=listing.title?.trim().toLowerCase();
  if(normalizedTitle&&existingTitles.some(t=>t.trim().toLowerCase()===normalizedTitle)){
    issues.push({
      field: "title",
      policySection: "Section 1.1 - Truthful Pricing",
      ruleTitle: "Duplicate Listing Detected",
      severity: "critical",
      message: "An identical title already exists in the marketplace.",
      isDeterministic: true
    });
  }

  return issues;
}