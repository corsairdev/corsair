import {
	mistralAiAuthConfig,
	mistralAiEndpointMeta,
	mistralAiEndpointSchemas,
	mistralai,
} from './index';

type Leaf = (...args: never[]) => unknown;

/** Dot paths of every function in the endpoint tree. */
function endpointPaths(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		return value && typeof value === 'object' ? endpointPaths(value, path) : [];
	});
}

const plugin = mistralai();
const meta = mistralAiEndpointMeta;
const paths = endpointPaths(plugin.endpoints ?? {}).sort();

describe('Mistral AI plugin definition', () => {
	it('has metadata and schemas for every endpoint, and nothing else', () => {
		expect(paths).toHaveLength(52);
		expect(Object.keys(meta).sort()).toEqual(paths);
		expect(Object.keys(mistralAiEndpointSchemas).sort()).toEqual(paths);
		for (const { input, output } of Object.values(mistralAiEndpointSchemas)) {
			expect(input).toBeDefined();
			expect(output).toBeDefined();
		}
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
	});

	it('classifies operations as the API inventory does', () => {
		const by = (level: string) =>
			Object.entries(meta)
				.filter(([, entry]) => entry.riskLevel === level)
				.map(([op]) => op);
		expect(by('read')).toHaveLength(19);
		expect(by('write')).toHaveLength(25);
		expect(by('destructive').sort()).toEqual([
			'agents.delete',
			'agents.deleteAlias',
			'audioAgents.delete',
			'batch.cancel',
			'batch.delete',
			'files.delete',
			'models.delete',
			'voices.delete',
		]);
	});

	it('marks irreversible only destructive operations with no restore', () => {
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => 'irreversible' in entry && entry.irreversible)
			.map(([op]) => op)
			.sort();
		expect(irreversible).toEqual([
			'agents.delete',
			'audioAgents.delete',
			'batch.cancel',
			'batch.delete',
			'files.delete',
			'models.delete',
			'voices.delete',
		]);
		// archive has unarchive, an alias can be recreated.
		expect(meta['models.archive'].riskLevel).toBe('write');
		expect(meta['models.unarchive'].riskLevel).toBe('write');
		expect('irreversible' in meta['agents.deleteAlias']).toBe(false);
	});

	it('says which operations spend Mistral credits', () => {
		for (const op of [
			'chat.complete',
			'fim.complete',
			'agents.complete',
			'embeddings.create',
			'ocr.process',
			'audio.speech',
			'audio.transcribe',
			'batch.create',
			'responses.create',
		] as const) {
			expect(meta[op].description).toContain('spends Mistral credits');
		}
	});

	// An account field nobody sets leaves the API-key setup reported as
	// "partial" with that field missing; the plugin has no webhooks and reads none.
	it('needs nothing but the API key', () => {
		expect(mistralAiAuthConfig.api_key.account).toEqual([]);
		expect(plugin.authConfig).toBe(mistralAiAuthConfig);
		expect(plugin.endpointMeta).toBe(mistralAiEndpointMeta);
	});

	it('keeps DEFAULT the last error handler whatever the caller adds', () => {
		const custom = mistralai({
			errorHandlers: {
				NOT_FOUND_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names).toContain('NOT_FOUND_ERROR');
		expect(names.indexOf('RATE_LIMIT_ERROR')).toBe(0);
	});

	it('lets the caller replace DEFAULT itself', () => {
		const DEFAULT = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const custom = mistralai({ errorHandlers: { DEFAULT } });
		expect(custom.errorHandlers?.DEFAULT).toBe(DEFAULT);
	});

	it('exposes only functions at the leaves', () => {
		const leaves: Leaf[] = [];
		const walk = (node: object) => {
			for (const value of Object.values(node)) {
				if (typeof value === 'function') leaves.push(value);
				else if (value && typeof value === 'object') walk(value);
			}
		};
		walk(plugin.endpoints ?? {});
		expect(leaves).toHaveLength(52);
	});
});
