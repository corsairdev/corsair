import { search } from './records';

let capturedUrl = '';

beforeEach(() => {
	global.fetch = (async (url: unknown) => {
		capturedUrl = String(url);
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => ({ records: [] }),
			text: async () => JSON.stringify({ records: [] }),
		};
	}) as unknown as typeof global.fetch;
});

it('encodes fields and sort the way the Airtable list records API expects', async () => {
	await search({ key: 'key', db: {} } as never, {
		baseId: 'appBase',
		tableIdOrName: 'tblTable',
		fields: ['Name', 'Status'],
		sort: [
			{ field: 'Name', direction: 'asc' },
			{ field: 'Status', direction: 'desc' },
		],
	});

	const params = new URL(capturedUrl).searchParams;
	expect(params.getAll('fields[]')).toEqual(['Name', 'Status']);
	expect(params.get('fields')).toBeNull();
	expect(params.get('sort[0][field]')).toBe('Name');
	expect(params.get('sort[0][direction]')).toBe('asc');
	expect(params.get('sort[1][field]')).toBe('Status');
	expect(params.get('sort[1][direction]')).toBe('desc');
});
