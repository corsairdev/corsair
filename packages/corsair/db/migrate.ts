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

export async function runMigration() {
  const client = await connect();

  try {
    console.log(
      "🔍 Running migration in a transaction (will rollback on error)...\n"
    );

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

    // Run each migration file
    for (const file of sqlFiles) {
      const migrationSQL = readFileSync(file, "utf-8");
      const fileName = path.basename(file);

      try {
        await client.query(migrationSQL);
        console.log(`✅ ${fileName} - Done\n`);
      } catch (error: any) {
        console.log(`❌ ${fileName} - ERROR:\n`);
        console.error(`   ${error.message}\n`);

        // Always rollback
        await client.query("ROLLBACK");

        console.log("🚨 Migration failed!");
        return false;
      }
    }

    // Commit transaction
    await client.query("COMMIT");

    console.log("✨ Migration completed!");
    return true;
  } catch (error: any) {
    console.error("❌ Unexpected error:", error);
    try {
      await client.query("ROLLBACK");
    } catch (error) {
      // Ignore rollback errors
    }
    return false;
  } finally {
    client.release();
  }
}
