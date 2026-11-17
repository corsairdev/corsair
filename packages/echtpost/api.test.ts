import type { EchtpostContext } from './context';
import { listTemplates } from './endpoints/list';
import * as Ops from './endpoints/ops';

/**
 * Live run. It needs `ECHTPOST_API_KEY` set to a sandbox key (`ep_test_`):
 * sandbox records are never printed or billed. It never creates or cancels
 * a card.
 */
const apiKey = process.env.ECHTPOST_API_KEY;
const sandbox = apiKey?.startsWith('ep_test_') === true;
if (!sandbox) {
	console.warn(
		'ECHTPOST_API_KEY is not a sandbox (ep_test_) key. Skipping live Echtpost calls.',
	);
}

const live = sandbox ? it : it.skip;

// unknown: the endpoints read only `key` here; event logging needs no db.
const ctx = {
	key: apiKey,
	$getAccountId: async () => 'live',
} as unknown as EchtpostContext;

live('lists templates', async () => {
	const result = await listTemplates(ctx, {});
	expect(Array.isArray(result.templates)).toBe(true);
});

live('reads the account, motives and credits', async () => {
	expect((await Ops.accountCredits(ctx, {})).currency).toBeDefined();
	const motives = await Ops.motivesList(ctx, { per_page: 1 });
	expect(Array.isArray(motives.motives)).toBe(true);
	const fit = await Ops.cardsPreviewFit(ctx, { content: 'Hallo' });
	expect(typeof fit.fits).toBe('boolean');
});

live('creates, updates and deletes a sandbox group and contact', async () => {
	const group = await Ops.groupsCreate(ctx, { name: 'corsair-plugin-test' });
	try {
		const contact = await Ops.contactsCreate(ctx, {
			last_name: 'Plugintest',
			street: 'Teststrasse 1',
			zip: '10115',
			city: 'Berlin',
			country_code: 'DE',
			group_ids: [group.id],
		});
		const updated = await Ops.contactsUpdate(ctx, {
			id: contact.id,
			city: 'Hamburg',
		});
		expect(updated.city).toBe('Hamburg');
		await Ops.contactsDelete(ctx, { id: contact.id });
	} finally {
		await Ops.groupsDelete(ctx, { id: group.id });
	}
});
