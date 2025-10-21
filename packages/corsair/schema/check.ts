import "dotenv/config";
import { Pool, PoolClient } from "pg";
import { readFileSync, readdirSync } from "fs";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function connect(): Promise<PoolClient> {
  return await pool.connect();
}

export async function checkMigration() {
  const client = await connect();

  try {
    console.log("🔍 Testing migration in a transaction (will rollback)...\n");

    // Start transaction
    await client.query("BEGIN");

    // Find project root and drizzle folder
    const currentDir = process.cwd();
    const sqlPath = path.join(currentDir, "sql");

    // Find all SQL files in the drizzle folder
    const files = readdirSync(sqlPath);
    const sqlFiles = files
      .filter((file) => file.endsWith(".sql"))
      .sort()
      .map((file) => path.join(sqlPath, file));

    if (sqlFiles.length === 0) {
      console.log(`❌ No migration files found in ${sqlPath}`);
      await client.query("ROLLBACK");
      return false;
    }

    // Run each migration file
    for (const file of sqlFiles) {
      const migrationSQL = readFileSync(file, "utf-8");
      const fileName = path.basename(file);

      try {
        await client.query(migrationSQL);
        console.log(`✅ ${fileName} - No errors detected\n`);
      } catch (error: any) {
        console.log(`❌ ${fileName} - ERROR DETECTED:\n`);
        console.error(`   ${error.message}\n`);

        // Always rollback
        await client.query("ROLLBACK");

        console.log("🚨 Migration test failed!");
        console.log("   Fix the errors above before running the migration.\n");
        return false;
      }
    }

    // Always rollback, even on success
    await client.query("ROLLBACK");

    console.log("✨ Migration test passed!");
    console.log("   No errors detected. Safe to apply.\n");
    return true;
  } catch (error: any) {
    console.error("❌ Unexpected error:", error.message);
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      // Ignore rollback errors
    }
    return false;
  } finally {
    client.release();
  }
}
