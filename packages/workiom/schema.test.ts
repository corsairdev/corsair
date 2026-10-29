import {
	WorkiomApp,
	WorkiomField,
	WorkiomFilter,
	WorkiomList,
	WorkiomRecord,
	WorkiomRecordPage,
	WorkiomSchema,
	WorkiomView,
} from './schema';

describe('Workiom schema', () => {
	it('declares a semver version', () => {
		expect(WorkiomSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official API guide entities', () => {
		expect(WorkiomSchema.entities.apps).toBe(WorkiomApp);
		expect(WorkiomSchema.entities.lists).toBe(WorkiomList);
		expect(WorkiomSchema.entities.fields).toBe(WorkiomField);
		expect(WorkiomSchema.entities.views).toBe(WorkiomView);
		expect(WorkiomSchema.entities.filters).toBe(WorkiomFilter);
		expect(WorkiomSchema.entities.records).toBe(WorkiomRecord);
		expect(WorkiomSchema.entities.recordPages).toBe(WorkiomRecordPage);
	});

	it('parses Apps/GetAll items', () => {
		expect(WorkiomApp.parse({ id: 'app-1', name: 'CRM' }).id).toBe('app-1');
	});

	it('parses official Lists/Get field and list shapes', () => {
		const list = WorkiomList.parse({
			appId: 'app-1',
			id: 'list-1',
			name: 'Contacts',
			description: '',
			fields: [{ id: 0, name: 'Email', description: '', dataType: 8 }],
		});
		expect(list.fields?.[0]?.dataType).toBe(8);
	});

	it('parses official Data/All filter and page envelopes', () => {
		const page = WorkiomRecordPage.parse({
			summary: { additionalProp1: 0 },
			totalCount: 1,
			items: [{ _id: 'r1', '1425': 'Ahmad Masa' }],
		});
		expect(page.items[0]?.['1425']).toBe('Ahmad Masa');
		expect(
			WorkiomFilter.parse({ fieldId: 1425, operator: 1, value: 'Ahmad Masa' })
				.operator,
		).toBe(1);
		expect(WorkiomFilter.parse({ fieldId: 1, operator: 13 }).operator).toBe(13);
		expect(() => WorkiomFilter.parse({ fieldId: 1, operator: 0 })).toThrow();
		expect(() => WorkiomFilter.parse({ fieldId: 1, operator: 14 })).toThrow();
	});

	it('parses official create-record field payloads', () => {
		const record = WorkiomRecord.parse({
			'1186': '2018-11-13T00:00:00.000+00:00',
			'1251': 'user@example.com',
			'1425': 'Ahmad Lam',
			'1532': 132,
			'1563': { id: '14372839', label: 'static list item' },
			'1421': [{ _id: 'r29jrg8hgg48g33nig', label: 'linked record' }],
		});
		expect(record['1532']).toBe(132);
	});
});
