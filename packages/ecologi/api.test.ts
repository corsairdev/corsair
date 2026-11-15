import type { EcologiContext } from './context';
import { getTrees } from './endpoints/get';

console.warn(
	'Ecologi reporting calls are public. Skipping the live read in unit tests.',
);

const live = it.skip;

live('reads trees for a public username', async () => {
	const result = await getTrees({} as EcologiContext, { username: 'ecologi' });
	expect(typeof result.total.total).toBe('number');
});
