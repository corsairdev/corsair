#!/usr/bin/env node

async function main() {
  const command = process.argv[2];

  if (
    !command ||
    !["generate", "check", "migrate", "watch"].includes(command)
  ) {
    console.log("Corsair CLI - Database migration tool\n");
    console.log("Usage:");
    console.log("  corsair generate  - Generate migrations from schema");
    console.log("  corsair check     - Test migrations in a transaction");
    console.log("  corsair migrate   - Apply migrations to database");
    console.log(
      "  corsair watch     - Watch for changes and generate API routes\n"
    );
    process.exit(1);
  }

  switch (command) {
    case "generate": {
      const { generate } = await import("./generate.js");
      await generate();
      break;
    }
    case "check": {
      const { check } = await import("./check.js");
      await check();
      break;
    }
    case "migrate": {
      const { migrate } = await import("./migrate.js");
      await migrate();
      break;
    }
    case "watch": {
      const { watch } = await import("./watch/index.js");
      await watch();
      break;
    }
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
