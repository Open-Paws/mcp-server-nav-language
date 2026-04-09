/**
 * MCP tool definitions — three tools:
 *   check_language  — check a text string for NAV violations
 *   check_file      — check a file's content (content passed as string)
 *   list_rules      — list all loaded rules with metadata
 */

import { z } from "zod";
import type { NavEngine } from "./engine.js";
import type { Violation } from "./engine.js";

// ---------------------------------------------------------------------------
// Zod schemas for input validation
// ---------------------------------------------------------------------------

export const CheckLanguageInput = z.object({
  text: z
    .string()
    .min(1, "text must not be empty")
    .max(500_000, "text exceeds 500 KB limit"),
  severities: z
    .array(z.enum(["ERROR", "WARNING", "INFO"]))
    .optional()
    .describe(
      "Filter to only these severities. Omit to return all violations."
    ),
});

export const CheckFileInput = z.object({
  content: z
    .string()
    .min(1, "content must not be empty")
    .max(500_000, "content exceeds 500 KB limit"),
  filename: z
    .string()
    .optional()
    .describe("Optional filename for context in output"),
  severities: z
    .array(z.enum(["ERROR", "WARNING", "INFO"]))
    .optional()
    .describe(
      "Filter to only these severities. Omit to return all violations."
    ),
});

export const ListRulesInput = z.object({
  severity: z
    .enum(["ERROR", "WARNING", "INFO"])
    .optional()
    .describe("Filter rules by severity. Omit to list all."),
});

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

function filterBySeverity(
  violations: Violation[],
  severities: string[] | undefined
): Violation[] {
  if (!severities || severities.length === 0) return violations;
  const set = new Set(severities);
  return violations.filter((v) => set.has(v.severity));
}

function formatViolation(v: Violation, filename?: string): Record<string, unknown> {
  return {
    rule_id: v.ruleId,
    severity: v.severity,
    line: v.line,
    column: v.column,
    matched_text: v.matchedText,
    message: v.message,
    suggestion: v.alternative,
    ...(filename ? { file: filename } : {}),
  };
}

export function runCheckLanguage(
  engine: NavEngine,
  input: z.infer<typeof CheckLanguageInput>
) {
  const result = engine.check(input.text);
  const filtered = filterBySeverity(result.violations, input.severities);

  return {
    violation_count: filtered.length,
    checked_rules: result.checkedRules,
    elapsed_ms: Math.round(result.elapsedMs * 100) / 100,
    violations: filtered.map((v) => formatViolation(v)),
    clean: filtered.length === 0,
  };
}

export function runCheckFile(
  engine: NavEngine,
  input: z.infer<typeof CheckFileInput>
) {
  const result = engine.check(input.content);
  const filtered = filterBySeverity(result.violations, input.severities);

  return {
    file: input.filename ?? "(unnamed)",
    violation_count: filtered.length,
    checked_rules: result.checkedRules,
    elapsed_ms: Math.round(result.elapsedMs * 100) / 100,
    violations: filtered.map((v) => formatViolation(v, input.filename)),
    clean: filtered.length === 0,
  };
}

export function runListRules(
  engine: NavEngine,
  input: z.infer<typeof ListRulesInput>
) {
  const rules = engine.listRules();
  const filtered = input.severity
    ? rules.filter((r) => r.severity === input.severity)
    : rules;

  return {
    total: filtered.length,
    rules: filtered.map((r) => ({
      id: r.id,
      severity: r.severity,
      alternative: r.alternative,
      message: r.message,
    })),
  };
}
