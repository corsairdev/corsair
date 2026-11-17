import type { EcologiContext } from './context';
import { getTrees } from './endpoints/get';

// Reporting reads are public, so the live check runs only when asked for.
// Purchases are never run live: they spend money.
const runLive = process.env.ECOLOGI_LIVE === '1';
if (!runLive) {
	console.warn('ECOLOGI_LIVE is not set to 1. Skipping the live Ecologi read.');
}

const live = runLive ? it : it.skip;

live('reads trees for a public username', async () => {
	const result = await getTrees({} as EcologiContext, { username: 'ecologi' });
	expect(typeof result.total.total).toBe('number');
});
