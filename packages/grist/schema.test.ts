import {
	AccessSchema,
	ColumnsAddInputSchema,
	ColumnsListInputSchema,
	DocSchema,
	DocsCreateInputSchema,
	DocsGetInputSchema,
	GristEndpointInputSchemas,
	GristEndpointOutputSchemas,
	OrgSchema,
	OrgsGetInputSchema,
	OrgsListInputSchema,
	RecordsAddInputSchema,
	RecordsListInputSchema,
	RecordsListOutputSchema,
	RecordsReplaceInputSchema,
	SqlQueryInputSchema,
	SqlQueryOutputSchema,
	TablesCreateInputSchema,
	TablesListInputSchema,
	UserSchema,
	WorkspaceSchema,
	WorkspacesCreateInputSchema,
	WorkspacesGetInputSchema,
} from './endpoints/types';
import { gristEndpointSchemas } from './index';
import { GristSchema } from './schema';
import { gristEntities } from './schema/database';

describe('Grist schema declaration', () => {
	it('declares semver version and empty database entities', () => {
		expect(GristSchema.version).toBe('1.0.0');
		expect(GristSchema.entities).toBe(gristEntities);
		expect(GristSchema.entities).toEqual({});
	});

	it('has complete coverage across endpoint schemas map', () => {
		const inputKeys = Object.keys(GristEndpointInputSchemas).sort();
		const outputKeys = Object.keys(GristEndpointOutputSchemas).sort();
		const registryKeys = Object.keys(gristEndpointSchemas).sort();

		expect(inputKeys).toEqual(outputKeys);
		expect(inputKeys).toEqual(registryKeys);
		expect(registryKeys.length).toBe(75);
	});
});

describe('Grist core models', () => {
	it('validates UserSchema', () => {
		expect(
			UserSchema.safeParse({ id: 1, name: 'Helga', picture: null }).success,
		).toBe(true);
		expect(UserSchema.safeParse({ id: 'invalid', name: 'Helga' }).success).toBe(
			false,
		);
	});

	it('validates AccessSchema', () => {
		expect(AccessSchema.safeParse('owners').success).toBe(true);
		expect(AccessSchema.safeParse('editors').success).toBe(true);
		expect(AccessSchema.safeParse('viewers').success).toBe(true);
		expect(AccessSchema.safeParse('invalid').success).toBe(false);
	});

	it('validates OrgSchema', () => {
		const org = {
			id: 42,
			name: 'Grist Labs',
			domain: 'gristlabs',
			access: 'owners',
		};
		expect(OrgSchema.safeParse(org).success).toBe(true);
	});

	it('validates WorkspaceSchema and DocSchema', () => {
		expect(
			WorkspaceSchema.safeParse({ id: 97, name: 'Secret Plans' }).success,
		).toBe(true);
		expect(
			DocSchema.safeParse({ id: 'doc123', name: 'Project Lollipop' }).success,
		).toBe(true);
	});
});

describe('Grist endpoint input and output schemas', () => {
	it('validates orgs inputs and strictness', () => {
		expect(OrgsListInputSchema.safeParse({}).success).toBe(true);
		// strict rejects unknown properties
		expect(OrgsListInputSchema.safeParse({ extra: 123 }).success).toBe(false);

		expect(OrgsGetInputSchema.safeParse({ orgId: 'current' }).success).toBe(
			true,
		);
		expect(OrgsGetInputSchema.safeParse({ orgId: 42 }).success).toBe(true);
		expect(OrgsGetInputSchema.safeParse({}).success).toBe(false);
	});

	it('validates workspaces inputs', () => {
		expect(
			WorkspacesCreateInputSchema.safeParse({
				orgId: 'current',
				name: 'Projects',
			}).success,
		).toBe(true);
		expect(
			WorkspacesCreateInputSchema.safeParse({ orgId: 'current' }).success,
		).toBe(false);

		expect(
			WorkspacesGetInputSchema.safeParse({ workspaceId: 97 }).success,
		).toBe(true);
		expect(WorkspacesGetInputSchema.safeParse({}).success).toBe(false);
	});

	it('validates docs inputs', () => {
		expect(
			DocsCreateInputSchema.safeParse({ documentName: 'New Document' }).success,
		).toBe(true);
		expect(DocsGetInputSchema.safeParse({ docId: 'doc_abc123' }).success).toBe(
			true,
		);
		expect(DocsGetInputSchema.safeParse({}).success).toBe(false);
	});

	it('validates tables inputs', () => {
		expect(TablesListInputSchema.safeParse({ docId: 'doc123' }).success).toBe(
			true,
		);
		expect(
			TablesCreateInputSchema.safeParse({
				docId: 'doc123',
				tables: [
					{
						id: 'People',
						columns: [{ id: 'name', fields: { label: 'Full Name' } }],
					},
				],
			}).success,
		).toBe(true);
	});

	it('validates records input and output schemas', () => {
		expect(
			RecordsListInputSchema.safeParse({
				docId: 'doc123',
				tableId: 'People',
				limit: 10,
				cellFormat: 'raw',
			}).success,
		).toBe(true);

		expect(
			RecordsAddInputSchema.safeParse({
				docId: 'doc123',
				tableId: 'People',
				records: [{ fields: { pet: 'cat', popularity: 67 } }],
			}).success,
		).toBe(true);

		expect(
			RecordsReplaceInputSchema.safeParse({
				docId: 'doc123',
				tableId: 'People',
				onmany: 'first',
				records: [
					{
						require: { pet: 'cat' },
						fields: { pet: 'cat', popularity: 70 },
					},
				],
			}).success,
		).toBe(true);

		const validRecordsOutput = {
			records: [
				{ id: 1, fields: { pet: 'cat', popularity: 67 } },
				{
					id: 2,
					fields: { pet: 'dog', popularity: 95 },
					errors: { formula: 'DIV0' },
				},
			],
		};
		expect(RecordsListOutputSchema.safeParse(validRecordsOutput).success).toBe(
			true,
		);
	});

	it('validates columns inputs', () => {
		expect(
			ColumnsListInputSchema.safeParse({
				docId: 'doc123',
				tableId: 'People',
			}).success,
		).toBe(true);

		expect(
			ColumnsAddInputSchema.safeParse({
				docId: 'doc123',
				tableId: 'People',
				columns: [{ id: 'col1', fields: { label: 'Age', type: 'Int' } }],
			}).success,
		).toBe(true);
	});

	it('validates SQL input and output schemas', () => {
		expect(
			SqlQueryInputSchema.safeParse({
				docId: 'doc123',
				sql: 'SELECT * FROM People WHERE popularity >= ?',
				args: [50],
				timeout: 1000,
			}).success,
		).toBe(true);

		const sqlOutput = {
			statement: 'SELECT * FROM People',
			records: [{ fields: { id: 1, pet: 'cat' } }],
		};
		expect(SqlQueryOutputSchema.safeParse(sqlOutput).success).toBe(true);
	});
});
