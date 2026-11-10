import { createCorsair } from 'corsair/core';
import { nutshell, nutshellEndpointMeta } from './index';

const corsair = createCorsair({
	plugins: [nutshell({ key: 'owner@example.com:api-key' })],
});
const api = corsair.nutshell.api;

describe('Nutshell request guards', () => {
	let fetchSpy: jest.SpyInstance;

	beforeEach(() => {
		// No test in this file may reach the network: a 204 stands in for the
		// provider, and each case asserts whether a request was attempted.
		fetchSpy = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => new Response(null, { status: 204 }));
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each(['.', '..'])(
		'refuses the path value %p instead of requesting another route',
		async (id) => {
			// fetch would normalise /rest/accounts/.. to /rest/, a different route.
			await expect(api.accounts.delete({ id })).rejects.toThrow(
				/invalid path parameter: id/,
			);
			await expect(
				api.leads.status({ id, body: { outcomeId: '1-outcomes' } }),
			).rejects.toThrow(/invalid path parameter: id/);
			expect(fetchSpy).not.toHaveBeenCalled();
		},
	);

	it('still encodes ordinary path values', async () => {
		await api.contacts.delete({ id: '7-contacts/../x' });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(
			'https://app.nutshell.com/rest/contacts/7-contacts%2F..%2Fx',
		);
	});

	it('rejects a JSON Patch item without op or path before sending it', async () => {
		await expect(
			api.accounts.update({
				id: '3-accounts',
				// @ts-expect-error op and path are required on every patch item
				body: [{}],
			}),
		).rejects.toThrow();
		await expect(
			api.tasks.update({
				id: '3-tasks',
				// @ts-expect-error path is required on every patch item
				body: [{ op: 'replace', value: 'x' }],
			}),
		).rejects.toThrow();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('sends a remove patch, which has no value', async () => {
		await api.accounts.update({
			id: '3-accounts',
			body: [{ op: 'remove', path: '/accounts/0/links/contacts/1-contacts' }],
		});
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		const init = fetchSpy.mock.calls[0]?.[1] as RequestInit;
		expect(init.method).toBe('PATCH');
		expect(JSON.parse(String(init.body))).toEqual([
			{ op: 'remove', path: '/accounts/0/links/contacts/1-contacts' },
		]);
	});

	it('rates replacing a lead installment schedule as destructive', () => {
		expect(nutshellEndpointMeta['leads.updateInstallments'].riskLevel).toBe(
			'destructive',
		);
	});

	it('sends todos.list multi-value filters comma-separated, as documented', async () => {
		fetchSpy.mockImplementation(
			async () =>
				new Response(
					JSON.stringify({
						todos: [],
						meta: {
							count: 0,
							facets: { past: 0, today: 0, tomorrow: 0, future: 0 },
							page: { startIndex: 0, endIndex: 0 },
						},
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
		);
		await api.todos.list({
			'filter[type]': ['tasks', 'steps'],
			'filter[stagesets]': ['1-stagesets', '2-stagesets'],
		});
		const url = new URL(String(fetchSpy.mock.calls[0]?.[0]));
		expect(url.searchParams.getAll('filter[type]')).toEqual(['tasks,steps']);
		expect(url.searchParams.getAll('filter[stagesets]')).toEqual([
			'1-stagesets,2-stagesets',
		]);
	});

	it('does not ask for JSON when the answer is a CSV or HTML document', async () => {
		fetchSpy.mockImplementation(
			async () =>
				new Response('lead,stage\n', {
					status: 200,
					headers: { 'content-type': 'text/csv' },
				}),
		);
		const accept = (call: number) =>
			new Headers((fetchSpy.mock.calls[call]?.[1] as RequestInit).headers).get(
				'accept',
			);

		await api.stageSets.export({ id: '1-stagesets' });
		expect(accept(0)).toBe('*/*');
		await api.leads.report({ format: 'csv' });
		expect(accept(1)).toBe('*/*');
	});

	it('asks for JSON on JSON routes', async () => {
		await api.contacts.delete({ id: '7-contacts' });
		expect(
			new Headers((fetchSpy.mock.calls[0]?.[1] as RequestInit).headers).get(
				'accept',
			),
		).toBe('application/json');
	});
});
