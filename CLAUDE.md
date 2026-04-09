# NAV Language Checker MCP Server

**Server 1 of 3** in the Open Paws MCP infrastructure. Pure regex engine that checks text and files for speciesist/animal-violence language violations in real time — no LLM, zero cost to run.

## Architecture

Single-stage pipeline: compile NAV rules at startup → run regex against input → return violations with line/column positions.

- **Rule loading** (`src/rule-loader.ts`) — starts with 65+ embedded rules from `src/rules.ts`, then attempts a 3-second upstream fetch from `semgrep-rules-no-animal-violence` YAML to merge any new rules. Failure is non-fatal; embedded set always available.
- **Engine** (`src/engine.ts`) — `NavEngine` compiles each rule into a `RegExp` at startup. Pre-computes line offsets for O(1) position lookup. Target: sub-10ms per check.
- **Transport** — stdio by default (Claude Desktop, Cursor, etc.). HTTP mode when `PORT` is set (serves A2A Agent Card at `/.well-known/agent.json` and `/health`).

## Tools

| Tool | File | Purpose |
|------|------|---------|
| `check_language` | `src/tools.ts` | Check a text string for NAV violations. Returns violations with line, column, matched text, severity, and alternative. |
| `check_file` | `src/tools.ts` | Check file content (passed as string). Optional `filename` for clearer output. |
| `list_rules` | `src/tools.ts` | List all loaded rules. Optional `severity` filter (ERROR / WARNING / INFO). |

All three tools accept an optional `severities` array to filter output. Input capped at 500 KB.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | MCP server entry point — tool registration, stdio/HTTP transport, SIGTERM/SIGINT handling |
| `src/engine.ts` | `NavEngine` class — regex compilation, `check()`, `listRules()`, `ruleCount` |
| `src/tools.ts` | Zod input schemas + `runCheckLanguage`, `runCheckFile`, `runListRules` implementations |
| `src/rules.ts` | Embedded 65+ NAV rules (sourced from `semgrep-rules-no-animal-violence`) |
| `src/rule-loader.ts` | Upstream YAML fetch + merge logic, 3-second timeout, graceful fallback |
| `src/agent-card.ts` | A2A Agent Card builder (`buildAgentCard(baseUrl)`) |
| `Dockerfile` | Alpine + Node 22, non-root `USER node`, exposes 3000 |

## Environment Variables

| Var | Required | Default | Purpose |
|-----|----------|---------|---------|
| `PORT` | no | — | HTTP mode when set; stdio transport if unset |
| `BEARER_TOKEN` | no | — | Bearer token for authenticated HTTP endpoints (recommended in production) |

No API keys required — this server makes no external LLM calls.

## Security

- **No sensitive data logged** — violations are returned to caller only, never persisted
- **Non-root Docker** — `USER node` in Dockerfile
- **Three-adversary model** — no telemetry, no retained inputs; safe for use with investigation and coalition data
- **Bearer token** — set `BEARER_TOKEN` in production HTTP deployments
- **Zero external dependencies at runtime** — upstream rule fetch is best-effort with 3-second timeout; server is fully functional without network access

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # vitest run (29 tests, no network calls)
npm run build       # tsc → dist/
npm start           # node dist/index.js
npm run dev         # node --watch dist/index.js (requires prior build)
```

Tests live in `src/__tests__/` (engine and tools coverage). No live network calls in CI — rule-loader tests mock the upstream fetch.

## Quality Gates

- `desloppify scan --path src/` strict score ≥ 85 before merge
- `tsc --noEmit` clean — run before every push
- All 29 tests pass
- `semgrep --config semgrep-no-animal-violence.yaml` on all `.ts` edits (ironic but necessary — the server itself must not use the patterns it detects)

## Strategic Context

**Role:** Server 1 of 3 in the Open Paws MCP infrastructure (NAV → AHA → KB). Provides the deterministic language-checking layer that all other servers and constraint middleware depend on.

**Live as of:** 2026-04-09

**Consumers:**

| Consumer | How it uses this server |
|----------|------------------------|
| `mcp-server-aha-evaluation` | Stage 1 of the AHA scoring pipeline — runs NAV check before any LLM call |
| `lbr8-mcp-constraints` | `NAVMcpConstraintSource` — wraps any MCP handler with NAV guardrails; `StaticConstraintSource` bundles 12 offline NAV patterns as fallback |
| `gary` (autonomous agent) | Phase 3 MCP hub — Gary connects to this server for real-time language enforcement on generated content |

**Strategy reference:** `Open-Paws/open-paws-strategy` → `ecosystem/repos.md` → "Server 1: NAV Language Checker"

## Seven Concerns Applied

1. **Testing** — 29 tests across engine and tools. Engine tests cover regex correctness, line/column accuracy, multi-match rules. Tools tests cover severity filtering and output shape. Every test must fail if the covered behavior breaks.
2. **Security** — No inputs retained or logged. Non-root Docker. Three-adversary threat model: safe for use with investigation context. No telemetry.
3. **Privacy** — No user data touches this server. Text content passed for checking is processed in memory and discarded. No persistence layer.
4. **Cost optimization** — Zero LLM cost. Pure regex at runtime. Upstream rule fetch on startup only (3-second timeout, non-blocking). This is the cheapest server in the MCP stack.
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
