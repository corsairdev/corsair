// Mocked transport coverage intentionally runs in Corsair's normal CI lane.
import { getInfo } from './endpoints/account';
import { askQuestion, extractFields } from './endpoints/ai';
import {
	getHtml,
	getSelectedHtml,
	getSelectedMultiple,
	getText,
} from './endpoints/scraping';

const fetchMock = jest.spyOn(globalThis, 'fetch');
const ctx = {
	key: 'webscraping-test-key',
	options: {},
	$getAccountId: async () => 'test-account',
} as never;

describe('WebScraping.AI API operations', () => {
	beforeEach(() => {
		fetchMock.mockReset();
		fetchMock.mockImplementation(async (input) => {
			const url = String(input);
			if (url.includes('/ai/question'))
				return new Response('Example Domain is a documentation page.', {
					headers: { 'Content-Type': 'text/plain' },
				});
			if (url.includes('/ai/fields'))
				return new Response(JSON.stringify({ title: 'Example Domain' }), {
					headers: { 'Content-Type': 'application/json' },
				});
			if (url.includes('/account'))
				return new Response(
					JSON.stringify({
						email: 'dev@example.com',
						remaining_total_credits: 2000,
					}),
					{ headers: { 'Content-Type': 'application/json' } },
				);
			if (url.includes('/text'))
				return new Response(
					JSON.stringify({
						title: 'Example Domain',
						content: 'Example content',
					}),
					{ headers: { 'Content-Type': 'application/json' } },
				);
			return new Response('<h1>Example Domain</h1>', {
				headers: { 'Content-Type': 'text/html' },
			});
		});
	});
	afterAll(() => fetchMock.mockRestore());

	it('calls and validates all seven catalog operations', async () => {
		const question = await askQuestion(ctx, {
			url: 'https://example.com',
			question: 'What is this page?',
		});
		const fields = await extractFields(ctx, {
			url: 'https://example.com',
			fields: { title: 'Page title' },
		});
		await getHtml(ctx, { url: 'https://example.com', js: false });
		await getSelectedHtml(ctx, { url: 'https://example.com', selector: 'h1' });
		await getSelectedMultiple(ctx, {
			url: 'https://example.com',
			selectors: ['h1', 'p'],
		});
		const text = await getText(ctx, {
			url: 'https://example.com',
			text_format: 'json',
		});
		const account = await getInfo(ctx, {});

		expect(question).toContain('documentation page');
		expect(fields.title).toBe('Example Domain');
		expect(text).toMatchObject({ title: 'Example Domain' });
		expect(account.remaining_total_credits).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(7);
		const calls = fetchMock.mock.calls.map(([input]) => String(input));
		expect(calls[0]).toContain('/ai/question?');
		expect(calls[1]).toContain('fields%5Btitle%5D=Page%20title');
		expect(calls[2]).toContain('/html?');
		expect(calls[3]).toContain('/selected?');
		expect(calls[4]).toContain('/selected-multiple?');
		expect(calls[4]).toContain('selectors%5B%5D=h1');
		expect(calls[5]).toContain('/text?');
		expect(calls[6]).toContain('/account?api_key=webscraping-test-key');
		for (const url of calls)
			expect(url).toContain('api_key=webscraping-test-key');
	});
});
