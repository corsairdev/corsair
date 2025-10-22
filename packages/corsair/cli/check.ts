import { Pool } from "pg";
import { existsSync, readdirSync, readFileSync } from "fs";
import { resolve, join } from "path";
import { loadConfig, loadEnv, checkDatabaseUrl } from "./config.js";

export async function check() {
  const cfg = loadConfig();
  loadEnv(cfg.envFile);
  checkDatabaseUrl();

  console.log("🔍 Testing migration in a transaction (will rollback)...\n");

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const sqlPath = resolve(process.cwd(), "lib/corsair/sql");

    if (!existsSync(sqlPath)) {
      console.log(`❌ No migration files found in ${sqlPath}`);
      await client.query("ROLLBACK");
      client.release();
      await pool.end();
      process.exit(1);
    }

    const files = readdirSync(sqlPath);
    const sqlFiles = files
      .filter((file) => file.endsWith(".sql"))
      .sort()
      .map((file) => join(sqlPath, file));

    if (sqlFiles.length === 0) {
      console.log(`❌ No migration files found in ${sqlPath}`);
      await client.query("ROLLBACK");
      client.release();
      await pool.end();
      process.exit(1);
    }

    for (const file of sqlFiles) {
      const migrationSQL = readFileSync(file, "utf-8");
      const fileName = file.split("/").pop();

      try {
        await client.query(migrationSQL);
        console.log(`✅ ${fileName} - No errors detected\n`);
      } catch (error: any) {
        console.log(`❌ ${fileName} - ERROR DETECTED:\n`);
        console.error(`   ${error.message}\n`);
        await client.query("ROLLBACK");
        console.log("🚨 Migration test failed!");
        console.log("   Fix the errors above before running the migration.\n");
        client.release();
        await pool.end();
        process.exit(1);
      }
    }

    await client.query("ROLLBACK");
    console.log("✨ Migration test passed!");
    console.log("   No errors detected. Safe to apply.\n");

    client.release();
    await pool.end();
  } catch (error: any) {
    console.error("❌ Unexpected error:", error.message);
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      // Ignore rollback errors
    }
    client.release();
    await pool.end();
    process.exit(1);
  }
}
