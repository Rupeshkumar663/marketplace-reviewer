import { MARKETPLACE_POLICIES } from "../data/policies.js";

function runLocalSemanticCheck(listing) {
  const issues = [];
  let revisedTitle = listing.title || "";
  let revisedDesc = listing.description || "";

  if (revisedTitle && revisedTitle === revisedTitle.toUpperCase() && revisedTitle.length >= 10) {
    revisedTitle = revisedTitle.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const claimRegex = /\b(100% unbeatable|world's best|guaranteed #1|permanent fix)\b/gi;
  if (claimRegex.test(listing.title) || claimRegex.test(listing.description)) {
    issues.push({
      field: "description",
      policySection: "Section 2.1 - Unverifiable & Superlative Claims",
      ruleTitle: "Unverifiable Claim Detected",
      severity: "critical",
      message: "Unsubstantiated claims and superlatives found without certification.",
      suggestedFix: "Replace absolute guarantees with factual, verified specifications.",
      isDeterministic: false
    });
    revisedTitle = revisedTitle.replace(claimRegex, "High Durability");
    revisedDesc = revisedDesc.replace(claimRegex, "high-grade impact absorption");
  }

  const medicalRegex = /\b(miracle cure|cure for|anti-aging miracle|covid prevention)\b/gi;
  if (medicalRegex.test(listing.description)) {
    issues.push({
      field: "description",
      policySection: "Section 2.2 - Prohibited Items & Medical Claims",
      ruleTitle: "Prohibited Medical Claim",
      severity: "critical",
      message: "Unauthorized medical cure or health guarantee detected.",
      suggestedFix: "Remove treatment claims and focus on physical item properties.",
      isDeterministic: false
    });
    revisedDesc = revisedDesc.replace(medicalRegex, "reliable drop defense");
  }

  return {
    issues,
    revised: {
      ...listing,
      title: revisedTitle,
      description: revisedDesc
    },
    source: "deterministic-fallback"
  };
}

export async function analyzeListingWithAI(listing) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return runLocalSemanticCheck(listing);
  }

  const prompt = `You are a Marketplace Quality Compliance Officer.
Review this product listing against these policies:
${JSON.stringify(MARKETPLACE_POLICIES)}

Listing Input:
${JSON.stringify(listing)}

Respond ONLY with a valid JSON object matching this schema:
{
  "issues": [
    {
      "field": "title",
      "policySection": "Section 2.1 - Unverifiable & Superlative Claims",
      "ruleTitle": "Superlative Claim",
      "severity": "critical",
      "message": "Explanation of issue",
      "suggestedFix": "Clean replacement"
    }
  ],
  "revised": {
    "title": "Compliant Title",
    "description": "Compliant Description",
    "category": "${listing.category}",
    "price": "${listing.price}",
    "seller": "${listing.seller}"
  }
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You must return valid raw JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Groq API returned ${res.status}:`, errBody);
      return runLocalSemanticCheck(listing);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return {
      issues: (parsed.issues || []).map((i) => ({ ...i, isDeterministic: false })),
      revised: { ...listing, ...parsed.revised },
      source: "llama-3.3-70b-versatile"
    };
  } catch (err) {
    console.error("AI service error:", err.message);
    return runLocalSemanticCheck(listing);
  }
}