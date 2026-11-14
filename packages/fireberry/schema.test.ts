import { fireberryEndpointSchemas } from './index';

describe('Fireberry endpoint schemas', () => {
	it('validates every registered operation input and rejects callback residue', () => {
		const inputs = [
			[
				fireberryEndpointSchemas['records.list'].input,
				{ object: 'account', pageSize: 50, pageNumber: 1 },
			],
			[
				fireberryEndpointSchemas['records.get'].input,
				{ object: 'account', id: 'record-id' },
			],
			[
				fireberryEndpointSchemas['records.create'].input,
				{ object: 'account', data: { accountname: 'Example' } },
			],
			[
				fireberryEndpointSchemas['records.update'].input,
				{
					object: 'account',
					id: 'record-id',
					data: { accountname: 'Changed' },
				},
			],
			[
				fireberryEndpointSchemas['records.delete'].input,
				{ object: 'account', id: 'record-id' },
			],
			[
				fireberryEndpointSchemas['records.query'].input,
				{ objectType: 1, fields: [{ name: 'accountname' }] },
			],
			[
				fireberryEndpointSchemas['records.legacyQuery'].input,
				{ objecttype: 1, fields: 'accountname', page_size: 50, page_number: 1 },
			],
			[
				fireberryEndpointSchemas['records.related'].input,
				{ objectType: 1, id: 'record-id', relatedObjectType: 2, pageSize: 10 },
			],
			[
				fireberryEndpointSchemas['records.items'].input,
				{ itemType: 'order', id: 'record-id' },
			],
			[fireberryEndpointSchemas['metadata.objects'].input, {}],
			[fireberryEndpointSchemas['metadata.object'].input, { id: 1 }],
			[fireberryEndpointSchemas['metadata.fields'].input, { id: 1 }],
			[
				fireberryEndpointSchemas['metadata.field'].input,
				{ id: 1, fieldName: 'accountname' },
			],
			[
				fireberryEndpointSchemas['metadata.picklist'].input,
				{ id: 1, fieldName: 'industrycode' },
			],
			[
				fireberryEndpointSchemas['customFields.create'].input,
				{
					objectType: 1,
					fieldType: 'text',
					data: { fieldName: 'pcfdisplay', label: 'Display' },
				},
			],
			[
				fireberryEndpointSchemas['customFields.update'].input,
				{
					objectType: 1,
					fieldType: 'text',
					fieldName: 'pcfdisplay',
					data: { label: 'Display name' },
				},
			],
			[
				fireberryEndpointSchemas['customFields.delete'].input,
				{ objectType: 1, fieldType: 'text', fieldName: 'pcfdisplay' },
			],
			[
				fireberryEndpointSchemas['customObjects.create'].input,
				{ name: 'Asset', collectionname: 'Assets' },
			],
			[
				fireberryEndpointSchemas['customObjects.update'].input,
				{ id: 'object-id', name: 'Asset' },
			],
			[
				fireberryEndpointSchemas['customObjects.delete'].input,
				{ id: 'object-id' },
			],
			[
				fireberryEndpointSchemas['files.create'].input,
				{
					objectId: '1',
					recordId: 'record-id',
					fileName: 'readme.txt',
					fileBase64: 'SGVsbG8=',
				},
			],
			[
				fireberryEndpointSchemas['batch.create'].input,
				{ objectCode: '1', data: [{ accountname: 'Example' }] },
			],
			[
				fireberryEndpointSchemas['batch.update'].input,
				{
					objectCode: '1',
					data: [{ id: 'record-id', record: { accountname: 'Changed' } }],
				},
			],
			[
				fireberryEndpointSchemas['batch.delete'].input,
				{ objectCode: 'account', ids: ['record-id'] },
			],
		] as const;
		for (const [schema, input] of inputs)
			expect(schema.safeParse(input).success).toBe(true);
		expect(
			fireberryEndpointSchemas['records.get'].input.safeParse({
				object: 'account',
				id: 'id',
				webhookUrl: 'https://example.test',
			}).success,
		).toBe(false);
	});

	it('enforces Fireberry pagination and batch size limits', () => {
		expect(
			fireberryEndpointSchemas['records.list'].input.safeParse({
				object: 'account',
				pageSize: 51,
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['records.list'].input.safeParse({
				object: 'account',
				pageNumber: 11,
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['records.query'].input.safeParse({
				objectType: 1,
				fields: [{ name: 'accountname' }],
				pageSize: 501,
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['batch.delete'].input.safeParse({
				objectCode: 'account',
				ids: Array.from({ length: 21 }, (_, index) => `record-${index}`),
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['batch.create'].input.safeParse({
				objectCode: 'account',
				data: Array.from({ length: 20 }, () => ({ accountname: 'Example' })),
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['batch.create'].input.safeParse({
				objectCode: 'account',
				data: Array.from({ length: 21 }, () => ({ accountname: 'Example' })),
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['batch.update'].input.safeParse({
				objectCode: 'account',
				data: Array.from({ length: 20 }, (_, index) => ({
					id: `record-${index}`,
					record: { accountname: 'Example' },
				})),
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['batch.update'].input.safeParse({
				objectCode: 'account',
				data: Array.from({ length: 21 }, (_, index) => ({
					id: `record-${index}`,
					record: { accountname: 'Example' },
				})),
			}).success,
		).toBe(false);
	});

	it('requires exactly two values for between and any count for eq-in', () => {
		const querySchema = fireberryEndpointSchemas['records.query'].input;
		const withValue = (operator: string, value: Array<number>) => ({
			objectType: 1,
			fields: [{ name: 'revenue' }],
			filter: [
				{
					type: 'AND',
					conditions: [{ fieldName: 'revenue', operator, value }],
				},
			],
		});
		for (const value of [[], [100], [1, 2, 3]]) {
			expect(querySchema.safeParse(withValue('between', value)).success).toBe(
				false,
			);
		}
		expect(querySchema.safeParse(withValue('between', [1, 2])).success).toBe(
			true,
		);
		expect(querySchema.safeParse(withValue('eq-in', [1, 2, 3])).success).toBe(
			true,
		);
	});

	it('enforces Query v3 aggregation and filter operator dependencies', () => {
		const querySchema = fireberryEndpointSchemas['records.query'].input;
		expect(
			querySchema.safeParse({
				objectType: 1,
				fields: [{ name: 'revenue', alias: 'sum' }],
			}).success,
		).toBe(false);
		expect(
			querySchema.safeParse({
				objectType: 1,
				fields: [{ name: 'revenue', aggrFunc: 'SUM' }],
			}).success,
		).toBe(false);
		expect(
			querySchema.safeParse({
				objectType: 1,
				fields: [{ name: 'industrycode' }],
				filter: [
					{
						type: 'AND',
						conditions: [
							{ fieldName: 'statuscode', operator: 'is-null', value: 1 },
						],
					},
				],
			}).success,
		).toBe(false);
		expect(
			querySchema.safeParse({
				objectType: 1,
				fields: [{ name: 'accountname' }],
				filter: [
					{
						type: 'AND',
						conditions: [{ fieldName: 'accountname', operator: 'eq' }],
					},
				],
			}).success,
		).toBe(false);
		expect(
			querySchema.safeParse({
				objectType: 1,
				fields: [{ name: 'accountname' }, { name: 'total', aggrFunc: 'COUNT' }],
				groupBy: [{ name: 'accountname' }],
			}).success,
		).toBe(true);
	});

	it('validates system record and batch fields against their resource-specific OpenAPI schemas', () => {
		expect(
			fireberryEndpointSchemas['records.create'].input.safeParse({
				object: 'account',
				data: { accountname: 42 },
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['records.create'].input.safeParse({
				object: 'account',
				data: { accountname: 'Example', pcfcustomfield: { nested: ['ok', 1] } },
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['records.create'].input.safeParse({
				object: 'account',
				data: { accountname: 'Example', undocumentedField: 'rejected' },
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['records.update'].input.safeParse({
				object: 'account',
				id: 'record-id',
				data: { description: 'Only the changed field' },
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['records.update'].input.safeParse({
				object: 'account',
				id: 'record-id',
				data: { accountname: 42 },
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['records.update'].input.safeParse({
				object: 'note',
				id: 'record-id',
				data: { notetext: 'Updated' },
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['customFields.update'].input.safeParse({
				objectType: 1,
				fieldType: 'datetime',
				fieldName: 'pcfdatefield',
				data: { label: 'Date field' },
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['files.create'].input.safeParse({
				objectId: '1',
				recordId: 'record-id',
				fileName: 'bad.txt',
				fileBase64: 'not-base64',
			}).success,
		).toBe(false);
		expect(
			fireberryEndpointSchemas['batch.create'].input.safeParse({
				objectCode: 'account',
				data: [{ accountname: 'Example' }],
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['batch.create'].input.safeParse({
				objectCode: 'account',
				data: [{ accountname: 8 }],
			}).success,
		).toBe(false);
	});

	it('validates documented response envelopes and query v3 paging fields', () => {
		expect(
			fireberryEndpointSchemas['records.list'].output.safeParse({
				success: true,
				data: {
					PrimaryKey: 'accountid',
					PrimaryField: 'accountname',
					Total_Records: 1,
					Page_Size: 50,
					Page_Number: 1,
					Records: [{ accountname: 'Example' }],
				},
				message: '',
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['records.query'].output.safeParse({
				success: true,
				data: [{ _id: 'record-id', accountname: 'Example' }],
				message: '',
				pageNumber: 1,
				pageSize: 25,
				isLastPage: true,
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['metadata.field'].output.safeParse({
				success: true,
				data: {
					label: 'Account Name',
					fieldName: 'accountname',
					systemFieldTypeId: 'string',
					fieldObjectType: 'account',
					systemName: 'accountname',
				},
				message: '',
			}).success,
		).toBe(true);
		expect(
			fireberryEndpointSchemas['batch.delete'].output.safeParse({}).success,
		).toBe(true);
	});
});
