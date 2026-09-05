import { BenzingaEndpointInputSchemas } from './endpoints/types';
import { benzingaEndpointSchemas } from './index';
import { BenzingaSchema } from './schema';

describe('Benzinga schema', () => {
	it('declares a semver version', () => {
		expect(BenzingaSchema.version).toBeDefined();
		expect(BenzingaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BenzingaSchema.entities).toBe('object');
		expect(BenzingaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BenzingaSchema.entities))).toBe(true);
		for (const entity of Object.values(BenzingaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('Benzinga endpoint registry', () => {
	it('registers all nine endpoints with input and output schemas', () => {
		const keys = Object.keys(benzingaEndpointSchemas);
		expect(keys).toHaveLength(9);
		expect(keys).toContain('news.get');
		expect(keys).toContain('news.listChannels');
		expect(keys).toContain('calendar.listEarnings');
		expect(keys).toContain('calendar.listDividends');
		expect(keys).toContain('calendar.listRatings');
		expect(keys).toContain('calendar.listGuidance');
		expect(keys).toContain('calendar.listIpos');
		expect(keys).toContain('calendar.listSplits');
		expect(keys).toContain('calendar.listEconomics');
		for (const key of keys) {
			const entry =
				benzingaEndpointSchemas[key as keyof typeof benzingaEndpointSchemas];
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('exposes matching input schemas for every registered endpoint', () => {
		expect(benzingaEndpointSchemas['news.get'].input).toBe(
			BenzingaEndpointInputSchemas.getNews,
		);
		expect(benzingaEndpointSchemas['calendar.listEarnings'].input).toBe(
			BenzingaEndpointInputSchemas.listEarnings,
		);
		expect(benzingaEndpointSchemas['calendar.listDividends'].input).toBe(
			BenzingaEndpointInputSchemas.listDividends,
		);
		expect(benzingaEndpointSchemas['calendar.listRatings'].input).toBe(
			BenzingaEndpointInputSchemas.listRatings,
		);
		expect(benzingaEndpointSchemas['calendar.listEconomics'].input).toBe(
			BenzingaEndpointInputSchemas.listEconomics,
		);
	});
});
