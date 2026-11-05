import type { EsputnikContext } from './index';
import { esputnik } from './index';

// Runs the wrapped plugin endpoints over the real HTTP client with a stubbed
// fetch, so the response parsing and the output schemas are both exercised.
const context = { key: 'test-api-key' } as unknown as EsputnikContext;
const plugin = esputnik();
if (!plugin.endpoints) throw new Error('eSputnik endpoints are missing');
const endpoints = plugin.endpoints;

function respondWith(
	body: string | null,
	contentType: string | null,
	status = 200,
) {
	const headers: Record<string, string> = contentType
		? { 'Content-Type': contentType }
		: {};
	return jest
		.spyOn(global, 'fetch')
		.mockResolvedValue(new Response(body, { status, headers }));
}

describe('eSputnik mutations with empty or text responses', () => {
	beforeEach(() => {
		// The shared client logs the JSON parse error of an empty JSON body.
		jest.spyOn(console, 'error').mockImplementation(() => undefined);
	});
	afterEach(() => jest.restoreAllMocks());

	it.each([
		// What the live API sent for contact deletes on 2026-11-05.
		['no body and no Content-Type', null, null],
		['an empty JSON body', '', 'application/json; charset=UTF-8'],
		['an empty text body', '', 'text/plain'],
		['a JSON string', '"OK"', 'application/json; charset=UTF-8'],
		// What the live API sent for deleteEmail and other acknowledgements.
		[
			'a sentence labelled as JSON',
			"Email with id='4768507' has been deleted",
			'application/json;charset=UTF-8',
		],
	] as const)(
		'deleteContactByExternalCustomerId succeeds on %s',
		async (_label, body, type) => {
			const fetchSpy = respondWith(body, type);

			await expect(
				endpoints.contacts.deleteContactByExternalCustomerId(context, {
					externalCustomerId: 'AB12770',
				}),
			).resolves.not.toThrow();

			const [url, init] = fetchSpy.mock.calls[0] ?? [];
			expect(String(url)).toBe(
				'https://esputnik.com/api/v1/contact?externalCustomerId=AB12770',
			);
			expect(init?.method).toBe('DELETE');
		},
	);

	const emptyBodies = [
		['JSON', 'application/json; charset=UTF-8'],
		['text', 'text/plain'],
	] as const;
	const mutations = [
		['contacts.deleteContactById', { id: 1 }],
		['emails.deleteEmail', { id: 1 }],
		['contacts.addToUnsubscribed', { emails: ['person@example.com'] }],
		['events.registerEvent', { eventTypeKey: 'cart_abandoned' }],
		['events.removeHistoryEvents', { from: '2026-01-01', to: '2026-01-02' }],
	] as const;

	it.each(
		mutations.flatMap(([operation, input]) =>
			emptyBodies.map(
				([label, type]) => [operation, label, input, type] as const,
			),
		),
	)('%s accepts an empty %s body', async (operation, _label, input, type) => {
		respondWith('', type);
		const [group, name] = operation.split('.') as [string, string];
		const handler = (
			endpoints as unknown as Record<
				string,
				Record<
					string,
					(ctx: EsputnikContext, input: unknown) => Promise<unknown>
				>
			>
		)[group]?.[name];
		if (!handler) throw new Error(`Missing endpoint ${operation}`);

		await expect(handler(context, input)).resolves.not.toThrow();
	});

	it('still reports provider errors', async () => {
		respondWith('{"message":"Contact not found"}', 'application/json', 404);

		await expect(
			endpoints.contacts.deleteContactByExternalCustomerId(context, {
				externalCustomerId: 'missing',
			}),
		).rejects.toMatchObject({ name: 'EsputnikAPIError', status: 404 });
	});
});
