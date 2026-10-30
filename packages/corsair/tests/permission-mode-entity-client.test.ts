import type { ZodTypeAny } from 'zod';
import { z } from 'zod';
import { buildCorsairClient } from '../core/client';
import { PermissionRequiredError, runWithMode } from '../core/permissions';
import type { CorsairPlugin, PluginEntityClient } from '../core/plugins';

// No database, so every method resolves a stub value. A refusal is therefore
// the guard and nothing else. CorsairPlugin's generics come from a real
// plugin's definition, which is what the cast stands in for.
const plugin = {
	id: 'demo',
	endpoints: {},
	schema: { version: '1', entities: { channels: z.object({}) } },
} as unknown as CorsairPlugin;

function channels(): PluginEntityClient<ZodTypeAny> {
	const client = buildCorsairClient([plugin], {
		database: undefined,
		tenantId: undefined,
		kek: 'test-kek',
	});
	// Same reason as the plugin above: the client's shape is derived from
	// generics this fixture does not carry.
	const plugins = client as unknown as Record<
		string,
		{ db: Record<string, PluginEntityClient<ZodTypeAny>> }
	>;
	return plugins.demo!.db.channels!;
}

describe('the entity client a consumer holds', () => {
	it('is ungated with no scope open', async () => {
		await expect(channels().deleteById('x')).resolves.toBe(false);
	});

	it('refuses a destructive call under strict', async () => {
		const db = channels();
		await runWithMode('strict', async () => {
			await expect(db.deleteById('x')).rejects.toThrow(PermissionRequiredError);
		});
	});

	it('refuses a destructive call under cautious', async () => {
		const db = channels();
		await runWithMode('cautious', async () => {
			await expect(db.deleteById('x')).rejects.toThrow(PermissionRequiredError);
		});
	});

	it('allows a write under cautious and refuses it under readonly', async () => {
		const db = channels();
		await runWithMode('cautious', async () => {
			await expect(db.upsertByEntityId('x', {})).rejects.toThrow(
				'Database not configured',
			);
		});
		await runWithMode('readonly', async () => {
			await expect(db.upsertByEntityId('x', {})).rejects.toThrow(
				/forbidden in readonly mode/,
			);
		});
	});

	it('serves a read under every mode', async () => {
		const db = channels();
		for (const mode of ['open', 'cautious', 'strict', 'readonly'] as const) {
			await runWithMode(mode, async () => {
				await expect(db.list()).resolves.toEqual([]);
			});
		}
	});
});
