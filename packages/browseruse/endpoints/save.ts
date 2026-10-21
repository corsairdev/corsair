import type { BrowserUseContext } from '..';
import type { BrowserUseBrowser, BrowserUseRun } from '../schema';

// A missing key keeps the stored value. An explicit null still clears it.
function mergeDefined<T extends Record<string, unknown>>(
	previous: T | undefined,
	next: Record<string, unknown>,
): T {
	const merged: Record<string, unknown> = { ...(previous ?? {}) };
	for (const [key, value] of Object.entries(next)) {
		if (value !== undefined) merged[key] = value;
	}
	return merged as T;
}

export async function saveBrowser(
	ctx: BrowserUseContext,
	browser: BrowserUseBrowser,
): Promise<void> {
	// The entity client exists even when no database is configured.
	if (!ctx.database) return;
	try {
		const existing = await ctx.db.browsers.findByEntityId(browser.id);
		await ctx.db.browsers.upsertByEntityId(
			browser.id,
			mergeDefined(existing?.data, browser),
		);
	} catch (error) {
		console.warn('Failed to save Browser Use browser to database:', error);
	}
}

export async function saveRun(
	ctx: BrowserUseContext,
	run: Partial<BrowserUseRun> & { id: string },
): Promise<void> {
	if (!ctx.database) return;
	try {
		const existing = await ctx.db.runs.findByEntityId(run.id);
		await ctx.db.runs.upsertByEntityId(
			run.id,
			mergeDefined(existing?.data, run),
		);
	} catch (error) {
		console.warn('Failed to save Browser Use run to database:', error);
	}
}
