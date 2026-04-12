/**
 * NAV Language Checker MCP Server
 *
 * Three tools: check_language, check_file, list_rules
 * A2A Agent Card at GET /.well-known/agent.json
 *
 * Architecture:
 *   - Pure regex engine (no LLM). Sub-10ms per check.
 *   - Rules loaded from embedded set at startup; upstream YAML merged async.
 *   - Transport: stdio (default) or HTTP (PORT env var).
 *   - Three-adversary security model: no sensitive data retained or logged.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "node:http";
import { NavEngine } from "./engine.js";
import { loadRules } from "./rule-loader.js";
import { buildAgentCard } from "./agent-card.js";
import {
  CheckLanguageInput,
  CheckFileInput,
  ListRulesInput,
  runCheckLanguage,
  runCheckFile,
  runListRules,
} from "./tools.js";

async function main(): Promise<void> {
  // Load rules: embedded set + optional upstream merge
  const rules = await loadRules();
  const engine = new NavEngine(rules);
  console.error(`[nav] Engine ready with ${engine.ruleCount} rules.`);

  // Create MCP server
  const server = new McpServer({
    name: "nav-language-checker",
    version: "0.1.0",
  });

  // Tool: check_language
  server.tool(
    "check_language",
    "Check a text string for animal-violence / speciesist language violations. " +
      "Returns violation details including line, column, matched text, severity, and suggested alternatives.",
    CheckLanguageInput.shape,
    async (input) => {
      const result = runCheckLanguage(engine, input);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // Tool: check_file
  server.tool(
    "check_file",
    "Check file content for animal-violence / speciesist language violations. " +
      "Pass file content as a string with an optional filename for context.",
    CheckFileInput.shape,
    async (input) => {
      const result = runCheckFile(engine, input);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // Tool: list_rules
  server.tool(
    "list_rules",
    "List all loaded NAV rules. Optionally filter by severity (ERROR, WARNING, INFO).",
    ListRulesInput.shape,
    async (input) => {
      const result = runListRules(engine, input);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  const port = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : null;

  if (port) {
    // HTTP mode: serve A2A Agent Card + handle MCP over HTTP
    await startHttpMode(server, engine, port);
  } else {
    // Default: stdio transport (used by Claude Desktop, Cursor, etc.)
    await startStdioMode(server);
  }
}

async function startStdioMode(server: McpServer): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[nav] MCP server running on stdio.");
}

async function startHttpMode(
  _server: McpServer,
  engine: NavEngine,
  port: number
): Promise<void> {
  const baseUrl = `http://localhost:${port}`;
  const agentCard = buildAgentCard(baseUrl);

  const httpServer = createServer((req, res) => {
    // A2A Agent Card endpoint
    if (req.method === "GET" && req.url === "/.well-known/agent.json") {
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      });
      res.end(JSON.stringify(agentCard, null, 2));
      return;
    }

    // Health check
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", rules: engine.ruleCount }));
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  });

  httpServer.listen(port, () => {
    console.error(`[nav] HTTP server listening on port ${port}`);
    console.error(`[nav] Agent Card: ${baseUrl}/.well-known/agent.json`);
    console.error(`[nav] Health: ${baseUrl}/health`);
  });

  // Keep process alive
  await new Promise<void>((resolve) => {
    process.on("SIGTERM", () => {
      console.error("[nav] SIGTERM received. Stopping.");
      httpServer.close(() => resolve());
    });
    process.on("SIGINT", () => {
      console.error("[nav] SIGINT received. Stopping.");
      httpServer.close(() => resolve());
    });
  });
}

main().catch((err) => {
  console.error("[nav] Fatal error:", err);
  process.exit(1);
});
