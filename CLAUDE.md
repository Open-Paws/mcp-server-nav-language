# mcp-server-nav-language — Agent Instructions

**Package:** `@open-paws/mcp-server-nav-language`
**License:** GPL-3.0
**Status: LIVE as of 2026-04-09 — 29 tests passing**
**Purpose:** NAV Language Checker MCP server. Pure regex engine — no LLM, zero cost to run. Server 1 of 3 in the Open Paws MCP infrastructure.

## What This Repo Does

A standalone MCP server that checks text and files for speciesist/animal-violence language violations in real time using a pure regex engine. Loads 65+ rules from embedded `src/rules.ts` at startup and attempts a 3-second upstream merge from `semgrep-rules-no-animal-violence` YAML (non-fatal on failure). Exposes three tools: `check_language`, `check_file`, `list_rules`. Sub-10ms response time. No LLM calls, no API keys required, zero runtime cost. Runs over stdio (default) or HTTP when `PORT` is set. A2A Agent Card at `/.well-known/agent.json` in HTTP mode. Node 22 LTS, TypeScript, Docker with non-root user.

## Architecture

Single-stage pipeline: compile NAV rules at startup → run regex against input → return violations with line/column positions.

- **Rule loading** (`src/rule-loader.ts`) — starts with 65+ embedded rules from `src/rules.ts`, then attempts a 3-second upstream fetch from `semgrep-rules-no-animal-violence` YAML to merge any new rules. Failure is non-fatal; embedded set always available.
- **Engine** (`src/engine.ts`) — `NavEngine` compiles each rule into a `RegExp` at startup. Pre-computes line offsets for O(1) position lookup. Target: sub-10ms per check.
- **Transport** — stdio by default (Claude Desktop, Cursor, etc.). HTTP mode when `PORT` is set (serves A2A Agent Card at `/.well-known/agent.json` and `/health`).

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | MCP server entry point — tool registration, stdio/HTTP transport, SIGTERM/SIGINT handling |
| `src/engine.ts` | `NavEngine` class — regex compilation, `check()`, `listRules()`, `ruleCount` |
| `src/tools.ts` | Zod input schemas + `runCheckLanguage`, `runCheckFile`, `runListRules` implementations |
| `src/rules.ts` | Embedded 65+ NAV rules (sourced from `semgrep-rules-no-animal-violence`) |
| `src/rule-loader.ts` | Upstream YAML fetch + merge logic, 3-second timeout, graceful fallback |
| `src/agent-card.ts` | A2A Agent Card builder (`buildAgentCard(baseUrl)`) |
| `src/__tests__/engine.test.ts` | Engine tests: regex correctness, line/column accuracy, multi-match |
| `src/__tests__/tools.test.ts` | Tools tests: severity filtering, output shape |
| `Dockerfile` | Alpine + Node 22, non-root `USER node`, exposes port 3000 |

## Tools

| Tool | Purpose |
|------|---------|
| `check_language` | Check a text string for NAV violations. Returns violations with line, column, matched text, severity, and alternative. |
| `check_file` | Check file content (passed as string). Optional `filename` for clearer output. |
| `list_rules` | List all loaded rules. Optional `severity` filter (ERROR / WARNING / INFO). |

All three tools accept an optional `severities` array to filter output. Input capped at 500 KB.

## Environment Variables

| Var | Required | Default | Purpose |
|-----|----------|---------|---------|
| `PORT` | no | — | HTTP mode when set; stdio transport if unset |
| `BEARER_TOKEN` | no | — | Bearer token for authenticated HTTP endpoints (recommended in production) |

No API keys required — this server makes no external LLM calls.

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit — run before every push
npm test            # vitest run — 29 tests, no network calls
npm run build       # tsc → dist/
npm start           # node dist/index.js
npm run dev         # node --watch dist/index.js (requires prior build)
```

Tests live in `src/__tests__/`. No live network calls in CI — rule-loader tests mock the upstream fetch.

## Docker

```bash
docker build -t mcp-server-nav-language .
docker run -p 3000:3000 -e PORT=3000 -e BEARER_TOKEN=<token> mcp-server-nav-language
```

Non-root (`USER node`), Alpine base, exposes port 3000.

## Quality Gates

- `desloppify scan --path src/` strict score ≥ 85 before merge
- `tsc --noEmit` clean — run before every push
- All 29 tests pass
- `semgrep --config semgrep-no-animal-violence.yaml` on all `.ts` edits (the server itself must not use the patterns it detects)

## Strategic Context

**Role:** Server 1 of 3 in the Open Paws MCP infrastructure (NAV → AHA → KB). Provides the deterministic language-checking layer that all other servers and constraint middleware depend on.

**Live as of:** 2026-04-09

**Consumers:**

| Consumer | How it uses this server |
|----------|------------------------|
| `mcp-server-aha-evaluation` | Stage 1 of the AHA scoring pipeline — runs NAV check before any LLM call |
| `lbr8-mcp-constraints` (`NAVMcpConstraintSource`) | Wraps any MCP handler with full 65+ rule NAV guardrails; `StaticConstraintSource` bundles 12 offline patterns as fallback |
| `gary` (autonomous agent, Phase 3 MCP hub) | Connects to this server for real-time language enforcement on generated content |

**Strategy references:**
- `Open-Paws/open-paws-strategy` → `ecosystem/repos.md` → "Server 1: NAV Language Checker"
- `Open-Paws/open-paws-strategy` → `roadmap/gary-mcp-hub-architecture.md`

This is infrastructure. Changes to tool schemas (`check_language`, `check_file`, `list_rules` input/output shape) or violation output format require coordinating with all consumers listed above before merging.

## Active Decisions

**#38 (2026-04-11) — External-repo agent hard gate:** No agent may invoke Claude Code against any repository outside the Open-Paws GitHub org until the PCC hooks pre-flight (Level 2, Wave 0 of `roadmap/agent-swarm-execution.md`) is built and confirmed active. This repo is inside the Open-Paws org — normal agent work proceeds. The gate applies only when an agent would actually submit work to a non-Open-Paws target repo.

**#37 (2026-04-11) — Audit-to-dispatch routing:** Tier 0/1 audit findings (code quality fixes, NAV violations in this repo's own source files, documentation updates) dispatch immediately as agent tasks — no human queue. Tier 2 findings queue for human review. Tier 3 require explicit authorization. "Owner: Leadership" is not a human gate. NAV violations in this repo's TypeScript source files are ironic but real — semgrep must still run, and any findings are Tier 0/1 agent tasks.

**#11 (2026-04-09) — Agent autonomy policy settled; Gary MCP hub deployment unblocked:** §1–3 principles settled (relational trust boundary, affected-party reversibility, agent identity disclosure). Gary MCP hub Phase 1 implementation started immediately after validation. This server is consumed by Gary Phase 3 — the decision that unblocked Gary's MCP hub deployment is the same decision that unblocked production use of this server.

## Security

- **No sensitive data logged** — violations are returned to caller only, never persisted
- **Non-root Docker** — `USER node` in Dockerfile
- **Three-adversary model** — no telemetry, no retained inputs; safe for use with investigation and coalition data
- **Bearer token** — set `BEARER_TOKEN` in production HTTP deployments
- **Zero external dependencies at runtime** — upstream rule fetch is best-effort with 3-second timeout; server is fully functional without network access

## Seven Concerns

1. **Testing** — 29 tests across engine and tools. Engine tests cover regex correctness, line/column accuracy, multi-match rules. Tools tests cover severity filtering and output shape. Every test must fail if the covered behavior breaks.
2. **Security** — No inputs retained or logged. Non-root Docker. Three-adversary threat model: safe for use with investigation context. No telemetry.
3. **Privacy** — No user data touches this server. Text content passed for checking is processed in memory and discarded. No persistence layer.
4. **Cost optimization** — Zero LLM cost. Pure regex at runtime. Upstream rule fetch on startup only (3-second timeout, non-blocking). Cheapest server in the MCP stack.
5. **Advocacy domain** — This server enforces the no-animal-violence vocabulary that is foundational to all Open Paws software. The embedded rules ARE the ubiquitous language ruleset in executable form.
6. **Accessibility** — Sub-10ms response enables use in real-time editor integrations and CI gates without degrading developer experience. HTTP + stdio transports support diverse integration contexts.
7. **Emotional safety** — No graphic content passes through this server. It checks language patterns only — no image, video, or testimony processing.

## Every Session

Before making changes, check current priorities and decisions:

```bash
gh api repos/Open-Paws/open-paws-strategy/contents/priorities.md --jq '.content' | base64 -d
gh api repos/Open-Paws/open-paws-strategy/contents/closed-decisions.md --jq '.content' | base64 -d
```

This server is infrastructure — changes here affect every consumer listed above. Coordinate before breaking changes to tool schemas or violation output format.

## Decisions Reviewed

- **2026-04-11 — #38 (external-repo agent gate):** This repo is within the Open-Paws org — no restriction on agent work here. Gate applies only to non-Open-Paws target repos.
- **2026-04-11 — #37 (audit-to-dispatch routing):** NAV violation findings in this repo's source files are Tier 0/1 — agent-executable, dispatched immediately on discovery. No human queue.
- **2026-04-09 — #11 (agent autonomy policy, Gary MCP hub unblocked):** Gary MCP hub deployment was unblocked by this decision. This server is a direct dependency of Gary Phase 3 and was live before the decision was formalized.
