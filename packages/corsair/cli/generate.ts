import "dotenv/config";

import { spawn } from "child_process";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  copyFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  loadConfig,
  loadEnv,
  checkDatabaseUrl,
  getSchemaPath,
} from "./config.js";

// Get the path to corsair's drizzle-kit
function getCorsairDrizzleKitPath(): string {
  // This file is in dist/cli/generate.js, so we go up to the package root
  const currentFilePath = fileURLToPath(import.meta.url);
  const packageRoot = resolve(dirname(currentFilePath), "../..");
  return join(packageRoot, "node_modules/.bin/drizzle-kit");
}

async function runDrizzleCommand(
  command: "pull" | "generate",
  config: { schema?: string; out?: string; configPath?: string }
): Promise<boolean> {
  return new Promise((resolve) => {
    const drizzleKitPath = getCorsairDrizzleKitPath();
    const args: string[] = [command];

    if (config.configPath) {
      args.push("--config", config.configPath);
    } else {
      if (command === "generate" && config.schema && config.out) {
        args.push("--schema", config.schema);
        args.push("--out", config.out);
      }
    }

    const child = spawn(drizzleKitPath, args, {
      stdio: "inherit",
      shell: true,
      cwd: process.cwd(),
      env: process.env,
    });

    child.on("close", (code) => {
      resolve(code === 0);
    });
  });
}

export async function generate() {
  console.log("🔧 Generating migrations...\n");

  const cfg = loadConfig();
  loadEnv(cfg.envFile);
  checkDatabaseUrl();

  const schemaPath = getSchemaPath(cfg);
  const outPath = resolve(process.cwd(), cfg.out);

  // Create temporary drizzle config for the user's project
  const tempConfigPath = resolve(process.cwd(), ".drizzle.config.tmp.js");
  const drizzleConfig = `
export default {
  out: "${outPath.replace(/\\/g, "/")}",
  schema: "${schemaPath.replace(/\\/g, "/")}",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  casing: "snake_case",
};
`;

  writeFileSync(tempConfigPath, drizzleConfig);

  // Create drizzle output directory for snapshot.json
  if (!existsSync(outPath)) {
    mkdirSync(outPath, { recursive: true });
  }

  try {
    // Pull current schema from database
    console.log("📥 Pulling current schema from database...\n");
    const pullSuccess = await runDrizzleCommand("pull", {
      configPath: tempConfigPath,
    });

    if (!pullSuccess) {
      console.error("❌ Failed to pull schema from database");
      rmSync(tempConfigPath, { force: true });
      rmSync(outPath, { recursive: true, force: true });
      process.exit(1);
    }

    // Generate migration
    console.log("\n📝 Generating migration files...\n");
    const generateSuccess = await runDrizzleCommand("generate", {
      configPath: tempConfigPath,
    });

    if (!generateSuccess) {
      console.error("❌ Failed to generate migrations");
      rmSync(tempConfigPath, { force: true });
      rmSync(outPath, { recursive: true, force: true });
      process.exit(1);
    }

    // Copy SQL files to ./lib/corsair/sql directory
    const sqlDir = resolve(process.cwd(), "lib/corsair/sql");

    if (!existsSync(sqlDir)) {
      mkdirSync(sqlDir, { recursive: true });
    }

    if (existsSync(outPath)) {
      const files = readdirSync(outPath);
      const sqlFiles = files.filter((file) => file.endsWith(".sql"));

      for (const file of sqlFiles) {
        const srcPath = join(outPath, file);
        const destPath = join(sqlDir, file);
        copyFileSync(srcPath, destPath);
      }

      console.log(`\n✅ Migration files saved to ${sqlDir}/`);
    }

    // Clean up drizzle folder (including snapshot.json and meta)
    // TEMPORARILY DISABLED FOR DEBUGGING
    // if (existsSync(outPath)) {
    //   rmSync(outPath, { recursive: true, force: true });
    // }

    // Clean up temp config
    // TEMPORARILY DISABLED FOR DEBUGGING
    // rmSync(tempConfigPath, { force: true });

    console.log("\n🔍 Checking for conflicts...\n");

    // Run check
    const { check } = await import("./check.js");
    await check();
  } catch (error) {
    // Clean up temp config and drizzle folder on error
    if (existsSync(tempConfigPath)) {
      rmSync(tempConfigPath, { force: true });
    }
    if (existsSync(outPath)) {
      rmSync(outPath, { recursive: true, force: true });
    }
    throw error;
  }
}
