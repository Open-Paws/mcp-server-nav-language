/**
 * Rule loader — attempts to fetch the upstream YAML rule set at startup,
 * then merges any rules not already in the embedded set.
 *
 * Failure is non-fatal: the embedded set is always available.
 */

import { parse as parseYaml } from "yaml";
import { EMBEDDED_RULES, type NavRule, type Severity } from "./rules.js";
import { UPSTREAM_RULES_URL } from "./constants.js";

interface SemgrepRule {
  id: string;
  "pattern-regex": string;
  message: string;
  severity: string;
  metadata?: {
    alternative?: string;
  };
}

interface SemgrepRuleset {
  rules: SemgrepRule[];
}

function normalizeSeverity(raw: string): Severity {
  const upper = raw.toUpperCase();
  if (upper === "ERROR" || upper === "WARNING" || upper === "INFO") {
    return upper as Severity;
  }
  return "WARNING";
}

function parseSemgrepRules(yaml: string): NavRule[] {
  const parsed = parseYaml(yaml) as SemgrepRuleset;
  if (!parsed?.rules || !Array.isArray(parsed.rules)) {
    return [];
  }

  return parsed.rules
    .filter(
      (r) =>
        typeof r.id === "string" &&
        typeof r["pattern-regex"] === "string" &&
        typeof r.message === "string"
    )
    .map((r) => ({
      id: r.id,
      pattern: r["pattern-regex"],
      message: r.message,
      severity: normalizeSeverity(r.severity ?? "WARNING"),
      alternative: r.metadata?.alternative ?? "",
    }));
}

/**
 * Load rules: start with embedded set, optionally extend with upstream YAML.
 *
 * Uses a 3-second timeout to keep startup fast. If the fetch fails or times
 * out, returns the embedded set unchanged.
 */
export async function loadRules(): Promise<NavRule[]> {
  const embeddedIds = new Set(EMBEDDED_RULES.map((r) => r.id));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(UPSTREAM_RULES_URL, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(
        `[nav] Upstream rule fetch returned ${response.status}. Using embedded rules only.`
      );
      return [...EMBEDDED_RULES];
    }

    const yaml = await response.text();
    const upstreamRules = parseSemgrepRules(yaml);

    // Merge: add upstream rules not already covered by id
    const newRules = upstreamRules.filter((r) => !embeddedIds.has(r.id));
    if (newRules.length > 0) {
      console.error(
        `[nav] Loaded ${upstreamRules.length} upstream rules, merged ${newRules.length} new.`
      );
    } else {
      console.error(
        `[nav] Upstream rules fetched. ${EMBEDDED_RULES.length} embedded rules are current.`
      );
    }

    return [...EMBEDDED_RULES, ...newRules];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[nav] Could not fetch upstream rules (${message}). Using embedded rules only.`
    );
    return [...EMBEDDED_RULES];
  }
}
