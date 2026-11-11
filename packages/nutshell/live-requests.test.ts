import { createCorsair } from 'corsair/core';
import { nutshell } from './index';

// Requests a Nutshell trial account refused on 2026-11-10, sent the way it
// accepts them now.
const corsair = createCorsair({
	plugins: [nutshell({ key: 'owner@example.com:api-key' })],
});
const api = corsair.nutshell.api;

const meta = { instanceId: '390528', siteId: '' };

describe('Nutshell requests the live API refused', () => {
	let fetchSpy: jest.SpyInstance;

	beforeEach(() => {
		fetchSpy = jest
			.spyOn(global, 'fetch')
			.mockImplementation(async () => new Response(null, { status: 204 }));
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const contentType = (call: number) =>
		new Headers((fetchSpy.mock.calls[call]?.[1] as RequestInit).headers).get(
			'content-type',
		);

	// Nutshell answers 415 to a PATCH sent as application/json on every route.
	it.each([
		[
			'tasks',
			() =>
				api.tasks.update({
					id: '1-tasks',
					body: [{ op: 'replace', path: '/tasks/0/title', value: 'x' }],
				}),
		],
		[
			'productMaps',
			() =>
				api.productMaps.update({
					id: '1-productMaps',
					body: [{ op: 'replace', path: '/productMaps/0/quantity', value: 3 }],
				}),
		],
		[
			'competitorMaps',
			() =>
				api.competitorMaps.update({
					id: '1-competitorMaps',
					body: [
						{ op: 'replace', path: '/competitorMaps/0/notes', value: 'x' },
					],
				}),
		],
	] as const)(
		'%s.update sends application/json-patch+json',
		async (_g, call) => {
			await call();
			expect(contentType(0)).toBe('application/json-patch+json');
		},
	);

	// A flat body gets 400 "You may only create one tasks resource per request".
	it('tasks.create sends the task inside a tasks array', async () => {
		fetchSpy.mockImplementation(
			async () =>
				new Response(
					JSON.stringify({
						meta,
						links: {},
						tasks: [
							{ id: '1-tasks', type: 'tasks', title: 'corsair-plugin-test' },
						],
					}),
					{
						status: 201,
						headers: { 'content-type': 'application/json' },
					},
				),
		);
		await api.tasks.create({
			body: { tasks: [{ title: 'corsair-plugin-test' }] },
		});
		const sent = JSON.parse(
			String((fetchSpy.mock.calls[0]?.[1] as RequestInit).body),
		);
		expect(sent).toEqual({ tasks: [{ title: 'corsair-plugin-test' }] });
	});
});
