import fs from "fs/promises";
import path from "path";
import { WORKSPACE_DIR } from "./config.js";

// ─────────────────────────────────────────────────────────────────────────────
// Plugin catalog — every plugin Corsair supports.
// To add a new plugin, add an entry here. The UI will pick it up automatically.
// ─────────────────────────────────────────────────────────────────────────────

export type AuthType = "oauth" | "api_key" | "bot_token";
export type PermissionMode = "open" | "cautious" | "strict" | "readonly";

export type PluginDef = {
  id: string;
  label: string;
  package: string;
  description: string;
  authType: AuthType;
};

export const PLUGIN_CATALOG: PluginDef[] = [
  { id: "gmail",          label: "Gmail",           package: "@corsair-dev/gmail",          description: "Send and read emails",               authType: "oauth"     },
  { id: "googlecalendar", label: "Google Calendar", package: "@corsair-dev/googlecalendar", description: "Manage calendar events",             authType: "oauth"     },
  { id: "googledrive",    label: "Google Drive",    package: "@corsair-dev/googledrive",    description: "Read and write files",               authType: "oauth"     },
  { id: "googlesheets",   label: "Google Sheets",   package: "@corsair-dev/googlesheets",   description: "Read and write spreadsheets",        authType: "oauth"     },
  { id: "slack",          label: "Slack",           package: "@corsair-dev/slack",          description: "Send messages and read channels",    authType: "bot_token" },
  { id: "github",         label: "GitHub",          package: "@corsair-dev/github",         description: "Manage repos, PRs, and issues",      authType: "api_key"   },
  { id: "notion",         label: "Notion",          package: "@corsair-dev/notion",         description: "Read and write pages and databases", authType: "api_key"   },
  { id: "linear",         label: "Linear",          package: "@corsair-dev/linear",         description: "Manage issues and projects",         authType: "api_key"   },
  { id: "asana",          label: "Asana",           package: "@corsair-dev/asana",          description: "Manage tasks and projects",          authType: "api_key"   },
  { id: "jira",           label: "Jira",            package: "@corsair-dev/jira",           description: "Manage tickets and sprints",         authType: "api_key"   },
  { id: "hubspot",        label: "HubSpot",         package: "@corsair-dev/hubspot",        description: "CRM — contacts, deals, companies",   authType: "api_key"   },
  { id: "airtable",       label: "Airtable",        package: "@corsair-dev/airtable",       description: "Read and write bases and tables",    authType: "api_key"   },
  { id: "stripe",         label: "Stripe",          package: "@corsair-dev/stripe",         description: "Payments, customers, and invoices",  authType: "api_key"   },
  { id: "resend",         label: "Resend",          package: "@corsair-dev/resend",         description: "Send transactional emails",          authType: "api_key"   },
  { id: "discord",        label: "Discord",         package: "@corsair-dev/discord",        description: "Send messages to channels",          authType: "bot_token" },
  { id: "twitter",        label: "Twitter / X",     package: "@corsair-dev/twitter",        description: "Post tweets and read timelines",     authType: "oauth"     },
  { id: "spotify",        label: "Spotify",         package: "@corsair-dev/spotify",        description: "Control playback and search music",  authType: "oauth"     },
  { id: "exa",            label: "Exa",             package: "@corsair-dev/exa",            description: "AI-powered web search",              authType: "api_key"   },
  { id: "tavily",         label: "Tavily",          package: "@corsair-dev/tavily",         description: "Web search for AI agents",           authType: "api_key"   },
  { id: "firecrawl",      label: "Firecrawl",       package: "@corsair-dev/firecrawl",      description: "Scrape and crawl websites",          authType: "api_key"   },
];

export const CATALOG_BY_ID = Object.fromEntries(PLUGIN_CATALOG.map(p => [p.id, p]));

// ─────────────────────────────────────────────────────────────────────────────
// plugins.json — tracks installed plugins and their permission modes.
// Stored on the Fly volume so it persists across restarts.
// ─────────────────────────────────────────────────────────────────────────────

export type PluginsConfig = Record<string, { mode: PermissionMode }>;

const PLUGINS_FILE = () => path.join(WORKSPACE_DIR, "plugins.json");

export async function readPluginsConfig(): Promise<PluginsConfig> {
  try {
    const raw = await fs.readFile(PLUGINS_FILE(), "utf-8");
    return JSON.parse(raw) as PluginsConfig;
  } catch {
    return {};
  }
}

export async function writePluginsConfig(config: PluginsConfig): Promise<void> {
  await fs.writeFile(PLUGINS_FILE(), JSON.stringify(config, null, 2), "utf-8");
}

// ─────────────────────────────────────────────────────────────────────────────
// Corsair.ts code generation
// ─────────────────────────────────────────────────────────────────────────────

export function buildCorsairFile(plugins: PluginsConfig): string {
  const ids = Object.keys(plugins);

  const imports = ids.length
    ? ids.map(id => `import { ${id} } from "${CATALOG_BY_ID[id]?.package ?? `@corsair-dev/${id}`}";`).join("\n")
    : "";

  const pluginLines = ids.map(id =>
    `    ${id}({ permissions: { mode: "${plugins[id]!.mode}" } }),`
  ).join("\n");

  return `import "dotenv/config";
${imports}${imports ? "\n" : ""}import { createCorsair } from "corsair";
import { pool } from "./db.js";

// Auto-generated by the Corsair control server — edit via the Plugins page.

const PUBLIC_URL = process.env.PUBLIC_URL ?? "http://localhost:8080";

export const corsair = createCorsair({
  multiTenancy: false,
  database: pool,
  kek: process.env.CORSAIR_KEK || "",
  approval: {
    timeout: "1h",
    onTimeout: "deny",
    mode: "asynchronous",
    formatAsyncMessage: ({ token }: { token: string; id: string; plugin: string; endpoint: string; args: unknown }) =>
      \`Approval required. Visit \${PUBLIC_URL}/approve/\${token} to approve or deny, then retry.\`,
  },
  plugins: [
${pluginLines}
  ],
});
`;
}

export async function writeCorsairFile(plugins: PluginsConfig): Promise<void> {
  const dest = path.join(WORKSPACE_DIR, "src/corsair.ts");
  await fs.writeFile(dest, buildCorsairFile(plugins), "utf-8");
}
