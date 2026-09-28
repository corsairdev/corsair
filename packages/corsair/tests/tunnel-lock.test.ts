import type { LockIo, LockRecord } from '../hub/tunnel/tunnel-lock';
import {
	reapStaleTunnel,
	releaseTunnelLock,
	tunnelLockPath,
	writeTunnelLock,
} from '../hub/tunnel/tunnel-lock';

/** In-memory LockIo so the reap logic is tested without real files or processes. */
function fakeIo(overrides: Partial<LockIo> = {}): LockIo & {
	files: Map<string, LockRecord>;
	procs: Map<number, { frpc: boolean; start: string }>;
	killed: Array<[number, NodeJS.Signals]>;
} {
	const files = new Map<string, LockRecord>();
	const procs = new Map<number, { frpc: boolean; start: string }>();
	const killed: Array<[number, NodeJS.Signals]> = [];
	return {
		files,
		procs,
		killed,
		read: (p) => files.get(p) ?? null,
		write: (p, rec) => {
			files.set(p, { ...rec });
		},
		remove: (p) => {
			files.delete(p);
		},
		inspect: (pid) => {
			const pr = procs.get(pid);
			return pr
				? { alive: true, frpc: pr.frpc, start: pr.start, identified: true }
				: { alive: false, frpc: false, start: null, identified: true };
		},
		kill: (pid, sig) => killed.push([pid, sig]),
		sleep: () => Promise.resolve(),
		...overrides,
	};
}

describe('tunnelLockPath', () => {
	it('is stable per slug and differs across slugs', () => {
		expect(tunnelLockPath('drunken-mutiny-2980')).toBe(
			tunnelLockPath('drunken-mutiny-2980'),
		);
		expect(tunnelLockPath('drunken-mutiny-2980')).not.toBe(
			tunnelLockPath('crimson-cove-6408'),
		);
	});
});

describe('reapStaleTunnel', () => {
	it('reports the slot free when there is no lockfile', async () => {
		const io = fakeIo();
		expect(await reapStaleTunnel('/lock', io)).toBe(true);
		expect(io.killed).toHaveLength(0);
	});

	it('clears a stale lock whose process is already dead, and reports free', async () => {
		const io = fakeIo();
		io.files.set('/lock', { pid: 4242, start: 'S1' }); // no matching proc
		expect(await reapStaleTunnel('/lock', io)).toBe(true);
		expect(io.killed).toHaveLength(0);
		expect(io.files.has('/lock')).toBe(false);
	});

	it('SIGTERMs a live orphan whose identity matches, then releases the lock', async () => {
		const io = fakeIo({
			kill: (pid, sig) => {
				(io.killed as Array<[number, NodeJS.Signals]>).push([pid, sig]);
				io.procs.delete(pid); // dies on SIGTERM
			},
		});
		io.files.set('/lock', { pid: 100, start: 'S1' });
		io.procs.set(100, { frpc: true, start: 'S1' });
		expect(await reapStaleTunnel('/lock', io)).toBe(true);
		expect(io.killed).toEqual([[100, 'SIGTERM']]);
		expect(io.files.has('/lock')).toBe(false);
	});

	it('escalates to SIGKILL when the orphan survives SIGTERM, then releases once dead', async () => {
		let sigkilled = false;
		const io = fakeIo({
			kill: (pid, sig) => {
				(io.killed as Array<[number, NodeJS.Signals]>).push([pid, sig]);
				if (sig === 'SIGKILL') {
					sigkilled = true;
					io.procs.delete(pid);
				}
			},
		});
		io.files.set('/lock', { pid: 100, start: 'S1' });
		io.procs.set(100, { frpc: true, start: 'S1' });
		expect(await reapStaleTunnel('/lock', io, { pollMs: 1, polls: 2 })).toBe(
			true,
		);
		expect(io.killed).toEqual([
			[100, 'SIGTERM'],
			[100, 'SIGKILL'],
		]);
		expect(sigkilled).toBe(true);
		expect(io.files.has('/lock')).toBe(false); // cleared once confirmed dead
	});

	it('blocks (keeps the lock) when the orphan cannot be killed (stays alive)', async () => {
		const io = fakeIo(); // default kill never removes the proc → survives both signals
		io.files.set('/lock', { pid: 100, start: 'S1' });
		io.procs.set(100, { frpc: true, start: 'S1' });
		expect(await reapStaleTunnel('/lock', io, { pollMs: 1, polls: 2 })).toBe(
			false,
		);
		expect(io.killed).toEqual([
			[100, 'SIGTERM'],
			[100, 'SIGKILL'],
		]);
		expect(io.files.get('/lock')).toEqual({ pid: 100, start: 'S1' }); // still tracked
	});

	it('blocks (keeps the lock) when the process state is unknown', async () => {
		const io = fakeIo({
			// Alive (kill 0 didn't say ESRCH) but the identity probe failed.
			inspect: () => ({
				alive: true,
				frpc: false,
				start: null,
				identified: false,
			}),
		});
		io.files.set('/lock', { pid: 100, start: 'S1' });
		expect(await reapStaleTunnel('/lock', io)).toBe(false);
		expect(io.killed).toHaveLength(0);
		expect(io.files.get('/lock')).toEqual({ pid: 100, start: 'S1' }); // not dropped
	});

	it('reports free without killing when a reused PID has a different start time', async () => {
		const io = fakeIo();
		io.files.set('/lock', { pid: 100, start: 'OLD' });
		io.procs.set(100, { frpc: true, start: 'NEW' }); // reused by a different frpc
		expect(await reapStaleTunnel('/lock', io)).toBe(true);
		expect(io.killed).toHaveLength(0);
		expect(io.files.has('/lock')).toBe(false); // stale entry cleared
	});

	it('reports free without killing when the reused PID is not frpc', async () => {
		const io = fakeIo();
		io.files.set('/lock', { pid: 100, start: 'S1' });
		io.procs.set(100, { frpc: false, start: 'S1' });
		expect(await reapStaleTunnel('/lock', io)).toBe(true);
		expect(io.killed).toHaveLength(0);
		expect(io.files.has('/lock')).toBe(false);
	});

	it('reports free when our PID is reused by a different process mid-termination', async () => {
		let slept = false;
		const io = fakeIo({
			sleep: () => {
				if (!slept) {
					slept = true;
					// Our frpc dies during the poll; its PID is reused by a different
					// live process (frpc-named but a new start time).
					io.procs.set(100, { frpc: true, start: 'DIFFERENT' });
				}
				return Promise.resolve();
			},
		});
		io.files.set('/lock', { pid: 100, start: 'S1' });
		io.procs.set(100, { frpc: true, start: 'S1' });
		// Free (our holder is gone) — must not block startup on the unrelated process.
		expect(await reapStaleTunnel('/lock', io, { pollMs: 1, polls: 5 })).toBe(
			true,
		);
		expect(io.files.has('/lock')).toBe(false);
	});

	it('preserves a newer owner written while the reaper polls', async () => {
		let slept = false;
		const io = fakeIo({
			sleep: () => {
				if (!slept) {
					slept = true;
					io.files.set('/lock', { pid: 200, start: 'S2' }); // newest-wins takeover
					io.procs.delete(100); // our old orphan finally dies
				}
				return Promise.resolve();
			},
		});
		io.files.set('/lock', { pid: 100, start: 'S1' });
		io.procs.set(100, { frpc: true, start: 'S1' });
		await reapStaleTunnel('/lock', io, { pollMs: 1, polls: 5 });
		expect(io.files.get('/lock')).toEqual({ pid: 200, start: 'S2' });
	});
});

describe('releaseTunnelLock', () => {
	it('removes the lock only when it holds our exact record', () => {
		const io = fakeIo();
		io.files.set('/lock', { pid: 100, start: 'S1' });
		releaseTunnelLock('/lock', { pid: 100, start: 'S1' }, io);
		expect(io.files.has('/lock')).toBe(false);
	});

	it('leaves a handed-over lock (different PID) intact', () => {
		const io = fakeIo();
		io.files.set('/lock', { pid: 200, start: 'S2' });
		releaseTunnelLock('/lock', { pid: 100, start: 'S1' }, io);
		expect(io.files.get('/lock')).toEqual({ pid: 200, start: 'S2' });
	});

	it('leaves a successor that reused our PID (start differs) intact', () => {
		const io = fakeIo();
		io.files.set('/lock', { pid: 100, start: 'NEW' }); // successor reused PID 100
		releaseTunnelLock('/lock', { pid: 100, start: 'OLD' }, io);
		expect(io.files.get('/lock')).toEqual({ pid: 100, start: 'NEW' });
	});
});

describe('writeTunnelLock', () => {
	it('records our PID and its start-time identity, and returns the record', () => {
		const io = fakeIo();
		io.procs.set(100, { frpc: true, start: 'S1' });
		const record = writeTunnelLock('/lock', 100, io);
		expect(record).toEqual({ pid: 100, start: 'S1' });
		expect(io.files.get('/lock')).toEqual({ pid: 100, start: 'S1' });
	});
});
