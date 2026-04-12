/**
 * A2A Agent Card — served at GET /.well-known/agent.json
 *
 * Follows the Agent-to-Agent (A2A) protocol spec so this server can be
 * discovered and invoked by other agents (Gary, n8n workflows, Cursor, etc.)
 */

import { AGENT_CONTACT_URL, AGENT_SOURCE_URL } from "./constants.js";

export interface AgentCard {
  name: string;
  description: string;
  version: string;
  url: string;
  capabilities: {
    tools: AgentTool[];
  };
  contact: string;
  license: string;
  source: string;
}

interface AgentTool {
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}

export function buildAgentCard(baseUrl: string): AgentCard {
  return {
    name: "NAV Language Checker",
    description:
      "Real-time speciesist language detection for any MCP-compatible agent. " +
      "Checks text and files against 65+ no-animal-violence rules. " +
      "Pure regex engine — no LLM required. Sub-10ms response time.",
    version: "0.1.0",
    url: baseUrl,
    capabilities: {
      tools: [
        {
          name: "check_language",
          description:
            "Check a text string for animal-violence / speciesist language violations. " +
            "Returns line and column positions, matched text, severity, and suggested alternatives.",
          input_schema: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "Text to check (max 500 KB)",
              },
              severities: {
                type: "array",
                items: { type: "string", enum: ["ERROR", "WARNING", "INFO"] },
                description: "Filter results to these severities (optional)",
              },
            },
            required: ["text"],
          },
        },
        {
          name: "check_file",
          description:
            "Check file content for animal-violence / speciesist language violations. " +
            "Pass the file content as a string; optionally include the filename for clearer output.",
          input_schema: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "File content to check (max 500 KB)",
              },
              filename: {
                type: "string",
                description: "Optional filename for context in output",
              },
              severities: {
                type: "array",
                items: { type: "string", enum: ["ERROR", "WARNING", "INFO"] },
                description: "Filter results to these severities (optional)",
              },
            },
            required: ["content"],
          },
        },
        {
          name: "list_rules",
          description:
            "List all loaded NAV rules with their IDs, severities, and suggested alternatives.",
          input_schema: {
            type: "object",
            properties: {
              severity: {
                type: "string",
                enum: ["ERROR", "WARNING", "INFO"],
                description: "Filter rules by severity (optional)",
              },
            },
          },
        },
      ],
    },
    contact: AGENT_CONTACT_URL,
    license: "GPL-3.0-only",
    source: AGENT_SOURCE_URL,
  };
}
