import { AuthMissingError } from 'corsair/core';
import type { LogoDevContext } from '../context';
import { LogoDevBrandEntity } from '../schema/database';

export function requireKey(ctx: LogoDevContext): string {
	if (!ctx.key) {
		throw new AuthMissingError('logodev', 'api_key');
	}
	return ctx.key;
}

/**
 * Saves a brand under its domain, merged over the saved row. A search result
 * carries `logoUrl` and a lookup carries `brandId`, so replacing the row would
 * drop whichever field the other call wrote.
 */
export async function saveBrand(
	ctx: LogoDevContext,
	fields: Partial<LogoDevBrandEntity>,
): Promise<void> {
	if (!ctx.db?.brands || !fields.domain) return;
	try {
		const existing = await ctx.db.brands.findByEntityId(fields.domain);
		const defined = Object.fromEntries(
			Object.entries(fields).filter(([, value]) => value !== undefined),
		);
		const row = LogoDevBrandEntity.safeParse({ ...existing?.data, ...defined });
		if (!row.success) return;
		await ctx.db.brands.upsertByEntityId(row.data.domain, row.data);
	} catch {
		console.warn('Failed to save Logo.dev brand');
	}
}
