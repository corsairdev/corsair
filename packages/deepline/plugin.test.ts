import type { KeyBuilderContext } from 'corsair/core';
import { AuthMissingError, createCorsair } from 'corsair/core';
import type { DeeplinePluginOptions, InternalDeeplinePlugin } from './index';
import { deepline } from './index';

const originalFetch = global.fetch;
const fetchMock = jest.fn();
beforeEach(() => {
	fetchMock.mockReset();
	global.fetch = fetchMock;
});
afterAll(() => {
	global.fetch = originalFetch;
});

describe('Deepline through the Corsair binder', () => {
	it('reads using the configured workspace key', async () => {
		const corsair = createCorsair({
			plugins: [deepline({ key: 'configured-key' })],
		});
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ tools: [] }), {
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		expect(await corsair.deepline.api.tools.list({})).toEqual({ tools: [] });
		expect(
			new Headers(fetchMock.mock.calls[0][1].headers).get('Authorization'),
		).toBe('Bearer configured-key');
	});
	it.each(['cautious', 'strict', 'readonly'] as const)(
		'blocks billable dispatch in %s mode before HTTP',
		async (mode) => {
			const corsair = createCorsair({
				plugins: [deepline({ key: 'configured-key', permissions: { mode } })],
			});
			await expect(
				corsair.deepline.api.tools.execute({ toolId: 'lookup', payload: {} }),
			).rejects.toThrow();
			await expect(
				corsair.deepline.api.plays.run({ name: 'prebuilt/demo' }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
	it('loads a stored account key and prompts for connection when it is missing', async () => {
		const plugin: InternalDeeplinePlugin = deepline();
		const stored = {
			keys: { get_api_key: async () => 'stored-key' },
		} as KeyBuilderContext<DeeplinePluginOptions>;
		expect(await plugin.keyBuilder?.(stored, 'endpoint')).toBe('stored-key');
		const missing = {
			keys: { get_api_key: async () => null },
		} as KeyBuilderContext<DeeplinePluginOptions>;
		await expect(
			plugin.keyBuilder?.(missing, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
