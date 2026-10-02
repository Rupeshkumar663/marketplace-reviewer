import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { runDeterministicValidation } from "../src/services/validator.js";

describe("Compliance Deterministic Validation Suite", () => {
  test("Rejects listings with missing mandatory title or description", () => {
    const input = { title: "", description: "", price: "12.00", category: "Electronics", seller: "Store" };
    const issues = runDeterministicValidation(input);
    assert.ok(issues.some(i => i.ruleTitle === "Missing Title"));
    assert.ok(issues.some(i => i.ruleTitle === "Missing Description"));
  });

  test("Catches non-positive pricing formats", () => {
    const input = { title: "Valid Title Long Enough", description: "This is a detailed compliant product description.", price: "-5.00", category: "Electronics", seller: "Store" };
    const issues = runDeterministicValidation(input);
    assert.ok(issues.some(i => i.field === "price" && i.severity === "critical"));
  });

  test("Flags full uppercase title violations and produces Title Case", () => {
    const input = { title: "ALL CAPITAL LETTERS TITLE HERE", description: "This is a detailed compliant product description.", price: "15.00", category: "Electronics", seller: "Store" };
    const issues = runDeterministicValidation(input);
    const casingIssue = issues.find(i => i.ruleTitle === "Excessive Capitalization");
    assert.ok(casingIssue);
    assert.strictEqual(casingIssue.suggestedFix, "All Capital Letters Title Here");
  });

  test("Detects duplicate title collisions against current catalogue", () => {
    const inventory = ["Wireless Earbuds Model X"];
    const input = { title: "Wireless Earbuds Model X", description: "This is a detailed compliant product description.", price: "29.99", category: "Electronics", seller: "Store" };
    const issues = runDeterministicValidation(input, inventory);
    assert.ok(issues.some(i => i.ruleTitle === "Duplicate Listing Detected"));
  });

  test("Passes fully compliant listing without findings", () => {
    const input = { title: "Ergonomic Office Chair Cushion", description: "High density foam seat cushion engineered for lower back support.", price: "34.50", category: "Home & Kitchen", seller: "ComfortWorks" };
    const issues = runDeterministicValidation(input);
    assert.strictEqual(issues.length, 0);
  });
});