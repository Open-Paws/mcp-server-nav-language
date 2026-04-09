import { describe, it, expect } from "vitest";
import { NavEngine } from "../engine.js";
import { EMBEDDED_RULES } from "../rules.js";
import {
  runCheckLanguage,
  runCheckFile,
  runListRules,
} from "../tools.js";

const engine = new NavEngine(EMBEDDED_RULES);

describe("runCheckLanguage()", () => {
  it("returns clean=true for clean text", () => {
    const result = runCheckLanguage(engine, { text: "This code is well-structured." });
    expect(result.clean).toBe(true);
    expect(result.violation_count).toBe(0);
  });

  it("returns violations with rule metadata", () => {
    const result = runCheckLanguage(engine, {
      text: "Add this to the whitelist.",
    });
    expect(result.violation_count).toBeGreaterThanOrEqual(1);
    expect(result.clean).toBe(false);
    const v = result.violations[0];
    expect(v).toHaveProperty("rule_id");
    expect(v).toHaveProperty("severity");
    expect(v).toHaveProperty("suggestion");
    expect(v).toHaveProperty("line");
    expect(v).toHaveProperty("column");
    expect(v).toHaveProperty("matched_text");
  });

  it("filters by severity when provided", () => {
    const text = "Add this to the whitelist and the master database.";
    const allResult = runCheckLanguage(engine, { text });
    const errorOnlyResult = runCheckLanguage(engine, {
      text,
      severities: ["ERROR"],
    });
    // ERROR-only should have fewer or equal violations
    expect(errorOnlyResult.violation_count).toBeLessThanOrEqual(
      allResult.violation_count
    );
    for (const v of errorOnlyResult.violations) {
      expect(v.severity).toBe("ERROR");
    }
  });

  it("reports checked_rules count", () => {
    const result = runCheckLanguage(engine, { text: "Clean text." });
    expect(result.checked_rules).toBeGreaterThan(0);
  });

  it("reports elapsed_ms as a number", () => {
    const result = runCheckLanguage(engine, { text: "guinea pig test" });
    expect(typeof result.elapsed_ms).toBe("number");
    expect(result.elapsed_ms).toBeGreaterThanOrEqual(0);
  });
});

describe("runCheckFile()", () => {
  it("includes the filename in output when provided", () => {
    const result = runCheckFile(engine, {
      content: "Clean content.",
      filename: "README.md",
    });
    expect(result.file).toBe("README.md");
  });

  it("uses (unnamed) when filename is not provided", () => {
    const result = runCheckFile(engine, { content: "Clean." });
    expect(result.file).toBe("(unnamed)");
  });

  it("includes file in each violation when filename is set", () => {
    const result = runCheckFile(engine, {
      content: "Use the whitelist for approved IPs.",
      filename: "config.ts",
    });
    expect(result.violation_count).toBeGreaterThanOrEqual(1);
    for (const v of result.violations) {
      expect(v).toHaveProperty("file", "config.ts");
    }
  });

  it("returns clean=true for clean file content", () => {
    const result = runCheckFile(engine, {
      content: "const allowlist = ['127.0.0.1'];\n",
      filename: "config.ts",
    });
    expect(result.clean).toBe(true);
  });
});

describe("runListRules()", () => {
  it("returns all rules when no severity filter", () => {
    const result = runListRules(engine, {});
    expect(result.total).toBeGreaterThanOrEqual(EMBEDDED_RULES.length);
  });

  it("filters correctly by ERROR severity", () => {
    const result = runListRules(engine, { severity: "ERROR" });
    for (const rule of result.rules) {
      expect(rule.severity).toBe("ERROR");
    }
    expect(result.total).toBe(result.rules.length);
  });

  it("each rule has id, severity, alternative, and message", () => {
    const result = runListRules(engine, {});
    for (const rule of result.rules) {
      expect(typeof rule.id).toBe("string");
      expect(typeof rule.severity).toBe("string");
      expect(typeof rule.alternative).toBe("string");
      expect(typeof rule.message).toBe("string");
    }
  });
});
