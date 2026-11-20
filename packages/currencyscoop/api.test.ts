import type { CurrencyScoopContext } from './context';
import { latestQuotes } from './endpoints/read';

const apiKey = process.env.CURRENCYSCOOP_API_KEY;
if (!apiKey) {
	console.warn(
		'CURRENCYSCOOP_API_KEY is not set. Skipping live CurrencyScoop calls.',
	);
}
const live = apiKey ? it : it.skip;

live('reads latest quotes', async () => {
	const result = await latestQuotes({ key: apiKey } as CurrencyScoopContext, {
		base: 'USD',
		symbols: 'EUR',
	});
	expect(Array.isArray(result.quotes)).toBe(true);
});
