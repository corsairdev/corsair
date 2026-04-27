import { spawn, type ChildProcess } from "child_process";
import path from "path";
import { RUNTIME_PORT, WORKSPACE_DIR } from "./config.js";

export type RuntimeStatus = "stopped" | "starting" | "running" | "crashed" | "restarting";

let proc: ChildProcess | null = null;
let status: RuntimeStatus = "stopped";
let lastError: string | null = null;
let startedAt: Date | null = null;

export function getRuntimeStatus() {
  return { status, pid: proc?.pid ?? null, startedAt, lastError };
}

export async function startRuntime(): Promise<void> {
  if (proc) await stopRuntime();

  status = "starting";
  lastError = null;
  startedAt = new Date();

  proc = spawn("tsx", [path.join(WORKSPACE_DIR, "src/index.ts")], {
    cwd: WORKSPACE_DIR,
    env: { ...process.env, RUNTIME_PORT: String(RUNTIME_PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  console.log(`[runtime] starting (pid ${proc.pid})`);

  function pipeLines(stream: NodeJS.ReadableStream, write: (line: string) => void) {
    let buf = "";
    stream.on("data", (chunk: Buffer) => {
      buf += chunk.toString();
      const lines = buf.split("\n");
      buf = lines.pop()!;
      for (const line of lines) write(line);
      if (status === "starting") status = "running";
    });
    stream.on("end", () => { if (buf) write(buf); });
  }

  pipeLines(proc.stdout!, line => process.stdout.write(`[runtime] ${line}\n`));
  pipeLines(proc.stderr!, line => process.stderr.write(`[runtime] ${line}\n`));

  proc.on("exit", (code, signal) => {
    if (signal === "SIGTERM" || signal === "SIGKILL") {
      status = "stopped";
      console.log(`[runtime] stopped (signal ${signal})`);
    } else {
      status = "crashed";
      lastError = `Exited with code ${code}`;
      console.error(`[runtime] CRASHED — exit code ${code}`);
    }
    proc = null;
  });

  proc.on("error", (err) => {
    status = "crashed";
    lastError = err.message;
    proc = null;
    console.error(`[runtime] spawn error: ${err.message}`);
  });
}

export async function stopRuntime(): Promise<void> {
  if (!proc) return;
  return new Promise((resolve) => {
    const p = proc!;
    const force = setTimeout(() => p.kill("SIGKILL"), 5_000);
    p.once("exit", () => { clearTimeout(force); resolve(); });
    p.kill("SIGTERM");
  });
}

export async function restartRuntime(): Promise<void> {
  status = "restarting";
  await startRuntime();
}
