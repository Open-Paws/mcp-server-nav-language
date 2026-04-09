import { describe, it, expect } from "vitest";
import { NavEngine } from "../engine.js";
import { EMBEDDED_RULES } from "../rules.js";

describe("NavEngine", () => {
  const engine = new NavEngine(EMBEDDED_RULES);

  describe("check()", () => {
    it("returns no violations for clean text", () => {
      const result = engine.check("The code review went smoothly.");
      expect(result.violations).toHaveLength(0);
      expect(result.clean).toBe(undefined); // engine.check returns raw result
    });

    it("detects a single ERROR-severity violation", () => {
      const result = engine.check(
        "We accomplished two things at once — we kill two birds with one stone every time."
      );
      const errors = result.violations.filter((v) => v.ruleId === "animal-violence.kill-two-birds-with-one-stone");
      expect(errors.length).toBeGreaterThanOrEqual(1);
      expect(errors[0].severity).toBe("ERROR");
      expect(errors[0].alternative).toBe("accomplish two things at once");
    });

    it("detects whitelist / blacklist violations", () => {
      const result = engine.check("Add the IP to the whitelist.");
      const violations = result.violations.filter((v) =>
        v.ruleId === "animal-violence.whitelist-blacklist"
      );
      expect(violations.length).toBeGreaterThanOrEqual(1);
    });

    it("detects master/slave violation", () => {
      const result = engine.check("Configure the master database node.");
      const violations = result.violations.filter((v) =>
        v.ruleId === "animal-violence.master-slave"
      );
      expect(violations.length).toBeGreaterThanOrEqual(1);
    });

    it("detects guinea pig violation", () => {
      const result = engine.check("We used the team as guinea pigs for the new deploy.");
      const violations = result.violations.filter((v) =>
        v.ruleId === "animal-violence.guinea-pig"
      );
      expect(violations.length).toBeGreaterThanOrEqual(1);
      expect(violations[0].alternative).toBe("test subject");
    });

    it("reports correct line numbers for multi-line text", () => {
      const text = "Line one is fine.\nLine two has guinea pig usage.\nLine three is clean.";
      const result = engine.check(text);
      const violation = result.violations.find((v) =>
        v.ruleId === "animal-violence.guinea-pig"
      );
      expect(violation).toBeDefined();
      expect(violation!.line).toBe(2);
    });

    it("reports correct column for violation on same line", () => {
      const text = "Start: guinea pig usage here.";
      const result = engine.check(text);
      const violation = result.violations.find((v) =>
        v.ruleId === "animal-violence.guinea-pig"
      );
      expect(violation).toBeDefined();
      // "guinea pig" starts at position 8 (1-based column 8)
      expect(violation!.column).toBe(8);
    });

    it("includes matched text in violation", () => {
      const result = engine.check("She beat a dead horse about the release deadline.");
      const violation = result.violations.find((v) =>
        v.ruleId === "animal-violence.beat-a-dead-horse"
      );
      expect(violation).toBeDefined();
      expect(violation!.matchedText.toLowerCase()).toContain("dead horse");
    });

    it("detects multiple violations in one text", () => {
      const text =
        "The whitelist should use the master config, and don't guinea pig the users.";
      const result = engine.check(text);
      expect(result.violations.length).toBeGreaterThanOrEqual(3);
    });

    it("is case-insensitive", () => {
      const result = engine.check("GUINEA PIG usage here.");
      const violations = result.violations.filter((v) =>
        v.ruleId === "animal-violence.guinea-pig"
      );
      expect(violations.length).toBeGreaterThanOrEqual(1);
    });

    it("reports elapsed time under 10ms for typical inputs", () => {
      const text = "Review this config: the master replica should be on the allowlist.";
      const result = engine.check(text);
      expect(result.elapsedMs).toBeLessThan(10);
    });

    it("handles empty string gracefully", () => {
      // Engine accepts any string; empty means no violations
      const result = engine.check(" ");
      expect(result.violations).toHaveLength(0);
    });

    it("detects cattle-vs-pets violation", () => {
      const result = engine.check("We treat servers as cattle vs pets.");
      const violations = result.violations.filter((v) =>
        v.ruleId === "animal-violence.cattle-vs-pets"
      );
      expect(violations.length).toBeGreaterThanOrEqual(1);
    });

    it("detects livestock violation", () => {
      const result = engine.check("The livestock industry produces methane.");
      const violations = result.violations.filter((v) =>
        v.ruleId === "animal-violence.livestock"
      );
      expect(violations.length).toBeGreaterThanOrEqual(1);
      expect(violations[0].alternative).toBe("farmed animals");
    });
  });

  describe("listRules()", () => {
    it("returns all embedded rules", () => {
      const rules = engine.listRules();
      expect(rules.length).toBeGreaterThanOrEqual(EMBEDDED_RULES.length);
    });

    it("every rule has an id, pattern, severity, and alternative", () => {
      const rules = engine.listRules();
      for (const rule of rules) {
        expect(rule.id).toBeTruthy();
        expect(rule.pattern).toBeTruthy();
        expect(["ERROR", "WARNING", "INFO"]).toContain(rule.severity);
        expect(typeof rule.alternative).toBe("string");
      }
    });
  });

  describe("ruleCount", () => {
    it("matches the number of compiled rules", () => {
      expect(engine.ruleCount).toBe(EMBEDDED_RULES.length);
    });
  });
});
