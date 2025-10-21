import chokidar from "chokidar";

const DIR = "/Users/devjain/Projects/corsair/main/corsair/demo/nextjs";

const buildFilePath = (filePath: string) => filePath.split(DIR)[1];

// Initialize watcher with options
const watcher = chokidar.watch(DIR, {
  ignored: [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/.next/**",
  ],
  persistent: true,
  ignoreInitial: true,
  usePolling: true,
});

// Event: File changed
watcher.on("change", async (filePath: string) => {
  console.log(
    `[${new Date().toLocaleTimeString()}] File changed: ${buildFilePath(
      filePath
    )}`
  );
});

// Event: Ready (initial scan complete)
watcher.on("ready", () => {
  console.log("👀 Watching...");
});

// Event: Error
watcher.on("error", (error) => {
  console.error("Watcher error:", error);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nClosing watcher...");
  await watcher.close();
  console.log("Watcher closed.");
  process.exit(0);
});

console.log("Watching for file changes...");
