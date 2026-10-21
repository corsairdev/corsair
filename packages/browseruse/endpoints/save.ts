import type { BrowserUseContext } from '..';
import type { BrowserUseBrowser, BrowserUseRun } from '../schema';

// Stored rows are open records. A missing key keeps the previous value.
function mergeDefined<T extends Record<string, unknown>>(
	previous: T | undefined,
	next: Record<string, unknown>,
): T {
	const merged: Record<string, unknown> = { ...(previous ?? {}) };
	for (const [key, value] of Object.entries(next)) {
		if (value !== undefined) merged[key] = value;
	}
	// The caller named T. The merge only copies that row's own keys.
	return merged as T;
}

const saveChains = new Map<string, Promise<void>>();

function enqueueSave(key: string, work: () => Promise<void>): Promise<void> {
	const previous = saveChains.get(key) ?? Promise.resolve();
	const run = previous.then(work, work);
	const settled = run.finally(() => {
		if (saveChains.get(key) === settled) saveChains.delete(key);
	});
	saveChains.set(key, settled);
	return run;
}

export async function saveBrowser(
	ctx: BrowserUseContext,
	browser: BrowserUseBrowser,
): Promise<void> {
	// The entity client exists even when no database is configured.
	if (!ctx.database) return;
	await enqueueSave(`browser:${browser.id}`, async () => {
		try {
			const existing = await ctx.db.browsers.findByEntityId(browser.id);
			await ctx.db.browsers.upsertByEntityId(
				browser.id,
				mergeDefined(existing?.data, browser),
			);
		} catch (error) {
			console.warn('Failed to save Browser Use browser to database:', error);
		}
	});
}

export async function saveRun(
	ctx: BrowserUseContext,
	run: Partial<BrowserUseRun> & { id: string },
): Promise<void> {
	if (!ctx.database) return;
	await enqueueSave(`run:${run.id}`, async () => {
		try {
			// Re-read inside the chain so a status poll cannot overwrite a
			// full get that landed while this save was waiting.
			const existing = await ctx.db.runs.findByEntityId(run.id);
			await ctx.db.runs.upsertByEntityId(
				run.id,
				mergeDefined(existing?.data, run),
			);
		} catch (error) {
			console.warn('Failed to save Browser Use run to database:', error);
		}
	});
}
