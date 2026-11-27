import {
	defillamaEndpointMeta,
	defillamaEndpointSchemas,
} from './endpoints/catalog';
import {
	DefillamaManifestSchema,
	defillamaManifest,
	defillamaOperations,
} from './endpoints/manifest';
import {
	defillamaInputFields,
	getDefillamaInputSchema,
	getDefillamaOutputSchema,
} from './endpoints/openapi-schema';
import { DEFILLAMA_OPERATION_IDS } from './endpoints/operation-types';

const ids = defillamaOperations.map((operation) => operation.id);
const risk = (id: string) =>
	defillamaEndpointMeta[id as keyof typeof defillamaEndpointMeta].riskLevel;

describe('defillama-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			DefillamaManifestSchema.safeParse(defillamaManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 136 operations, 73 of them free without a key', () => {
		expect(ids).toHaveLength(136);
		expect(new Set(ids).size).toBe(136);
		expect([...DEFILLAMA_OPERATION_IDS].sort()).toEqual([...ids].sort());
		expect(defillamaOperations.filter((o) => o.free)).toHaveLength(73);
		for (const o of defillamaOperations) {
			expect(o.path.includes('{api_key}')).toBe(true);
		}
	});
});

describe('schemas', () => {
	it('builds every input, output and webhook schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getDefillamaInputSchema(id);
				getDefillamaOutputSchema(id);
			} catch {
				failed.push(id);
			}
		}
		expect(failed).toEqual([]);
		expect(Object.keys(defillamaEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(defillamaEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('checks inputs and keeps outputs lenient', () => {
		const protocol = getDefillamaInputSchema('tvl.protocol');
		expect(protocol.safeParse({}).success).toBe(false);
		expect(protocol.safeParse({ protocol: 'aave' }).success).toBe(true);
		expect(protocol.safeParse({ protocol: 'aave', x: 1 }).success).toBe(false);
		const protocols = getDefillamaOutputSchema('tvl.protocols');
		expect(protocols.safeParse([{ name: 'Aave', extra: 1 }]).success).toBe(
			true,
		);
		expect(protocols.safeParse({ name: 'Aave' }).success).toBe(false);
	});

	it('routes path and query fields', () => {
		const where = (id: string) =>
			Object.fromEntries(
				defillamaInputFields(id).map((f) => [f.name, `${f.in}:${f.wire}`]),
			);
		expect(where('tvl.protocol')).toMatchObject({ protocol: 'path:protocol' });
		expect(where('coins.chart')).toMatchObject({ coins: 'path:coins' });
	});
});

describe('risk levels', () => {
	it('marks every operation read', () => {
		for (const id of ids) expect(risk(id)).toBe('read');
	});
});
