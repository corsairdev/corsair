import { BoldsignSchema } from './schema';
import {
	BoldsignBrand,
	BoldsignCustomField,
	BoldsignDocument,
} from './schema/database';

describe('Boldsign schema', () => {
	it('declares a semver version', () => {
		expect(BoldsignSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares core entities for docs and metadata', () => {
		expect(BoldsignSchema.entities.documents).toBeDefined();
		expect(BoldsignSchema.entities.brands).toBeDefined();
		expect(BoldsignSchema.entities.custom_fields).toBeDefined();
	});

	it('parses document records with optional metadata', () => {
		const parsed = BoldsignDocument.parse({
			id: 'doc_1',
			title: 'NDA',
			status: 'Sent',
			next_cursor: 1689815402493,
		});
		expect(parsed.id).toBe('doc_1');
		expect(parsed.next_cursor).toBe(1689815402493);
	});

	it('parses brand and custom field records', () => {
		const brand = BoldsignBrand.parse({ id: 'br_1', name: 'Acme' });
		const field = BoldsignCustomField.parse({
			id: 'cf_1',
			name: 'Company',
			brand_id: 'br_1',
		});
		expect(brand.name).toBe('Acme');
		expect(field.brand_id).toBe('br_1');
	});
});
