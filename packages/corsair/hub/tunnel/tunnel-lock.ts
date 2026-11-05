import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * frps serves one owner per `corsair-<slug>` subdomain, so a frpc orphaned by an
 * abrupt parent death (SIGKILL, `next dev` HMR) keeps holding the slug and every
 * new frpc is rejected with "proxy already exists". A per-slug lockfile lets the
 * next start reap that orphan (newest-wins) instead of retrying forever.
 *
 * The record pins identity to the process start time, not just the PID: a dead
 * frpc's PID can be reused by an unrelated process — or another dev tunnel — so
 * we only ever signal a PID whose start time still matches what we recorded.
 */
export interface LockRecord {
	pid: number;
	/** OS process start time; '' when the platform couldn't report it. */
	start: string;
}

export interface ProcessInfo {
	/** False ONLY on confirmed absence (ESRCH); a query we couldn't run stays alive. */
	alive: boolean;
	frpc: boolean;
	/** OS start time, or null when unavailable. */
	start: string | null;
	/** Whether the name/start-time probe actually succeeded (vs an unknown state). */
	identified: boolean;
}

export interface LockIo {
	read(path: string): LockRecord | null;
	write(path: string, record: LockRecord): void;
	remove(path: string): void;
	inspect(pid: number): ProcessInfo;
	kill(pid: number, signal: NodeJS.Signals): void;
	sleep(ms: number): Promise<void>;
}

// Static PowerShell probe (Windows). A constant literal — not generated code:
// the PID is supplied via $env:CORSAIR_REAP_PID, never interpolated in.
const WIN_PROBE =
	'$p=Get-CimInstance Win32_Process -Filter "ProcessId=$($env:CORSAIR_REAP_PID)"; if($p){"$($p.Name)|$($p.CreationDate.ToFileTimeUtc())"}';

/** Lockfile keyed by the (non-secret) tunnel slug — the exact identity frps
 *  collides on. The slug is validated `^[a-z0-9-]+$` upstream, so it's a safe
 *  filename and no secret ever lands on disk. */
export function tunnelLockPath(slug: string): string {
	return join(homedir(), '.cache', 'corsair', 'tunnel', `${slug}.pid`);
}

/** One process is "ours" only if it's alive, looks like frpc, and — when we
 *  captured a start time — started at the same instant we recorded. Without a
 *  recorded start time (older lock / platform gap) we fall back to name-only. */
function isOwnedBy(info: ProcessInfo, record: LockRecord): boolean {
	if (!info.alive || !info.frpc) return false;
	return record.start ? info.start === record.start : true;
}

export const defaultLockIo: LockIo = {
	read: (path) => {
		try {
			const [pidLine = '', start = ''] = readFileSync(path, 'utf8').split('\n');
			const pid = Number.parseInt(pidLine.trim(), 10);
			return Number.isInteger(pid) && pid > 0
				? { pid, start: start.trim() }
				: null;
		} catch {
			return null;
		}
	},
	write: (path, record) => {
		mkdirSync(dirname(path), { recursive: true });
		writeFileSync(path, `${record.pid}\n${record.start}`, { mode: 0o600 });
	},
	remove: (path) => {
		// Best-effort: a lock is advisory, so a failed removal must never break the
		// tunnel lifecycle (rmSync with force already ignores a missing file).
		try {
			rmSync(path, { force: true });
		} catch {}
	},
	inspect: (pid) => {
		// Existence first, via signal 0: ESRCH is the only *confirmed* absence.
		// EPERM (another user's process) or any other error means it's still there —
		// we just can't manage it, which is an unknown state, not a dead one.
		try {
			process.kill(pid, 0);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === 'ESRCH') {
				return { alive: false, frpc: false, start: null, identified: true };
			}
		}
		// Alive — probe identity (name + start time). A probe failure leaves the
		// state unknown (identified: false), never silently "dead".
		try {
			if (process.platform === 'win32') {
				// Win32_Process gives the image name and a stable creation time, so
				// Windows gets the same PID-reuse-proof identity as posix. The command
				// is a fixed literal (no generated code); the PID is passed through the
				// environment and read via $env, never interpolated into the script.
				const out = execFileSync(
					'powershell',
					['-NoProfile', '-Command', WIN_PROBE],
					{
						encoding: 'utf8',
						env: { ...process.env, CORSAIR_REAP_PID: String(pid) },
					},
				).trim();
				if (!out)
					return { alive: true, frpc: false, start: null, identified: false };
				const [name = '', start = ''] = out.split('|');
				return {
					alive: true,
					frpc: /frpc/i.test(name),
					start: start || null,
					identified: true,
				};
			}
			const comm = execFileSync('ps', ['-p', String(pid), '-o', 'comm='], {
				encoding: 'utf8',
			}).trim();
			if (!comm)
				return { alive: true, frpc: false, start: null, identified: false };
			const start = execFileSync('ps', ['-p', String(pid), '-o', 'lstart='], {
				encoding: 'utf8',
			}).trim();
			return {
				alive: true,
				frpc: /frpc/i.test(comm),
				start: start || null,
				identified: true,
			};
		} catch {
			// Probe tool failed — alive (kill 0 didn't say ESRCH) but identity unknown.
			return { alive: true, frpc: false, start: null, identified: false };
		}
	},
	kill: (pid, signal) => {
		try {
			process.kill(pid, signal);
		} catch {
			// Already gone between inspect and here — nothing to do.
		}
	},
	sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

/**
 * Try to free this slug's slot by reaping the frpc recorded in the lockfile
 * (SIGTERM, then SIGKILL after a grace). Returns `true` when the slot is free to
 * take — no prior lock, the recorded process is confirmed gone, we killed it, or
 * the PID now demonstrably belongs to something else. Returns `false` when a
 * process that might still hold the slug is alive and could not be safely reaped
 * (couldn't signal it, or its identity is unknown): the caller must NOT spawn a
 * replacement, or it would overwrite the holder's lock and orphan it untracked.
 * Never signals a PID whose identity no longer matches the record.
 */
export async function reapStaleTunnel(
	path: string,
	io: LockIo = defaultLockIo,
	opts: { pollMs?: number; polls?: number } = {},
): Promise<boolean> {
	const record = io.read(path);
	if (record === null) return true;

	let info = io.inspect(record.pid);

	// If it's our live orphan, try to kill it (SIGTERM, then SIGKILL after a grace).
	if (isOwnedBy(info, record)) {
		io.kill(record.pid, 'SIGTERM');
		const pollMs = opts.pollMs ?? 100;
		const polls = opts.polls ?? 30;
		for (let i = 0; i < polls && isOwnedBy(info, record); i++) {
			await io.sleep(pollMs);
			info = io.inspect(record.pid);
		}
		if (isOwnedBy(info, record)) {
			io.kill(record.pid, 'SIGKILL');
			info = io.inspect(record.pid);
		}
	}

	// The slot is free when the recorded holder is confirmed gone or the PID now
	// demonstrably belongs to a different process — evaluated the same way whether
	// or not we just killed it, so a PID reused mid-termination isn't mistaken for
	// a still-live holder. An alive-but-unidentified process stays blocked.
	if (isSlotFree(info, record)) {
		clearIfOurs(io, path, record);
		return true;
	}
	return false;
}

/** Whether the recorded holder no longer occupies the slot: confirmed absent, or
 *  positively a different process (identified as not-frpc, or a different start). */
function isSlotFree(info: ProcessInfo, record: LockRecord): boolean {
	if (!info.alive) return true;
	return (
		info.identified &&
		(!info.frpc || (record.start !== '' && info.start !== record.start))
	);
}

/** Compare-and-delete: remove the lock only if it still names the exact record we
 *  reaped — a concurrent start may have written a newer owner while we polled. */
function clearIfOurs(io: LockIo, path: string, record: LockRecord): void {
	const current = io.read(path);
	if (current && current.pid === record.pid && current.start === record.start) {
		io.remove(path);
	}
}

/** Record the frpc child we spawned (with its start-time identity) so the next
 *  start can reap it if we die abruptly. Returns the record for release to match. */
export function writeTunnelLock(
	path: string,
	pid: number,
	io: LockIo = defaultLockIo,
): LockRecord {
	const record: LockRecord = { pid, start: io.inspect(pid).start ?? '' };
	io.write(path, record);
	return record;
}

/** Release our lock — but only if it still holds the exact record we wrote (pid
 *  AND start). Matching on PID alone would let us delete a successor that reused
 *  our PID; the process is dead by now, so we compare the recorded start, not a
 *  fresh inspect. */
export function releaseTunnelLock(
	path: string,
	record: LockRecord,
	io: LockIo = defaultLockIo,
): void {
	const current = io.read(path);
	if (current && current.pid === record.pid && current.start === record.start) {
		io.remove(path);
	}
}
