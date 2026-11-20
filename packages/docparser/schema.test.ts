import { DocparserSchema } from './schema';
import { DocparserParserEntity } from './schema/database';

describe('Docparser schema', () => {
	it('declares ping, parsers, models, and results', () => {
		expect(DocparserSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(DocparserSchema.entities).sort()).toEqual([
			'models',
			'parsers',
			'pings',
			'results',
		]);
	});

	it('rejects a parser with no id', () => {
		expect(DocparserParserEntity.safeParse({ label: 'Invoices' }).success).toBe(
			false,
		);
	});
});
