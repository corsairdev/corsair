import { existsSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

export interface CorsairConfig {
  schema: string;
  out: string;
  envFile: string;
}

export function loadConfig(): CorsairConfig {
  const configPath = resolve(process.cwd(), "corsair.config.ts");
  const configJsPath = resolve(process.cwd(), "corsair.config.js");

  // Default config for Next.js projects
  const defaultConfig: CorsairConfig = {
    schema: "./lib/corsair/schema.ts",
    out: "./lib/corsair/drizzle",
    envFile: ".env.local",
  };

  // TODO: Add support for loading custom config files
  if (existsSync(configPath) || existsSync(configJsPath)) {
    console.log("📋 Custom corsair.config found (not yet implemented)");
    console.log("   Using default config for now\n");
  }

  return defaultConfig;
}

export function loadEnv(envFile: string): void {
  const possibleEnvFiles = [envFile, ".env.local", ".env"];

  for (const file of possibleEnvFiles) {
    const envPath = resolve(process.cwd(), file);
    if (existsSync(envPath)) {
      config({ path: envPath });
      console.log(`📄 Loaded environment from ${file}\n`);
      return;
    }
  }

  console.log("⚠️  No .env file found, using existing environment variables\n");
}

export function checkDatabaseUrl(): void {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment");
    console.error("   Please set DATABASE_URL in your .env file\n");
    process.exit(1);
  }
}

export function getSchemaPath(cfg: CorsairConfig): string {
  const schemaPath = resolve(process.cwd(), cfg.schema);

  if (!existsSync(schemaPath)) {
    console.error(`❌ Schema file not found at: ${schemaPath}`);
    console.error(`   Please create a schema file or configure it in corsair.config.ts\n`);
    process.exit(1);
  }

  return schemaPath;
}
