/**
 * NAV rule engine — pure regex, no LLM.
 *
 * Compiles rules at startup. All checks run in memory. Target: sub-10ms per call.
 */

import { EMBEDDED_RULES, type NavRule, type Severity } from "./rules.js";

export interface Violation {
  ruleId: string;
  message: string;
  severity: Severity;
  alternative: string;
  line: number;
  column: number;
  matchedText: string;
}

export interface CheckResult {
  violations: Violation[];
  checkedRules: number;
  elapsedMs: number;
}

interface CompiledRule {
  rule: NavRule;
  regex: RegExp;
}

export class NavEngine {
  private readonly compiled: CompiledRule[];

  constructor(rules: NavRule[] = EMBEDDED_RULES) {
    this.compiled = rules.map((rule) => ({
      rule,
      regex: new RegExp(rule.pattern, "gi"),
    }));
  }

  check(text: string): CheckResult {
    const start = performance.now();
    const violations: Violation[] = [];

    // Pre-compute line offsets for O(1) position lookup
    const lineOffsets = buildLineOffsets(text);

    for (const { rule, regex } of this.compiled) {
      // Reset regex state — shared instance requires explicit reset between calls
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const { line, column } = offsetToPosition(match.index, lineOffsets);
        violations.push({
          ruleId: rule.id,
          message: rule.message,
          severity: rule.severity,
          alternative: rule.alternative,
          line,
          column,
          matchedText: match[0],
        });
      }
    }

    const elapsedMs = performance.now() - start;
    return { violations, checkedRules: this.compiled.length, elapsedMs };
  }

  listRules(): NavRule[] {
    return this.compiled.map((c) => c.rule);
  }

  get ruleCount(): number {
    return this.compiled.length;
  }
}

/** Build an array of character offsets where each line starts. */
function buildLineOffsets(text: string): number[] {
  const offsets: number[] = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "\n") {
      offsets.push(i + 1);
    }
  }
  return offsets;
}

/** Convert a character offset to 1-based line and column numbers. */
function offsetToPosition(
  offset: number,
  lineOffsets: number[]
): { line: number; column: number } {
  let low = 0;
  let high = lineOffsets.length - 1;

  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (lineOffsets[mid] <= offset) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return {
    line: low + 1,
    column: offset - lineOffsets[low] + 1,
  };
}
