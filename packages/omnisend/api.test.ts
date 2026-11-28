import { writeFileSync } from 'node:fs';
import { omnisendEndpointsNested as api } from './endpoints/catalog';
import type { OmnisendContext } from './index';

/**
 * Live run against an Omnisend store. Skipped unless OMNISEND_API_KEY is set
 * (CI never runs files named api.test.ts).
 *
 *   OMNISEND_API_KEY=... npx jest api.test.ts
 *   (OMNISEND_LIVE_REPORT=<file> writes one line per step)
 *
 * Use a test store: Omnisend has no sandbox. The key needs every read and
 * write scope. The run reads every list, then creates and deletes its own
 * category, product, email template, universal layout, segment, image and
 * draft campaign, and tags one contact: OMNISEND_LIVE_EMAIL (our own test
 * inbox). The only mail it sends is campaigns.sendTestEmail to that inbox.
 *
 * Never run here: campaigns.send, the A/B test sends, automations.enable,
 * automations.sendBlockTestEmail and events.send (they message real
 * contacts or start flows), and brands.connect (meant for platform apps).
 * Routes the store's plan or setup refuses (402, 403, 409, 422) are recorded
 * as expected errors, not failures.
 */
const key = process.env.OMNISEND_API_KEY;
const inbox = process.env.OMNISEND_LIVE_EMAIL ?? 'corsair-tests@inkboxmail.com';
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Omnisend live run: set OMNISEND_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
// `unknown` because the walk goes through nested groups of endpoints.
type AnyEndpoint = (ctx: OmnisendContext, input: unknown) => Promise<unknown>;

const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('live'),
	key,
	options: {},
	keys: {},
	db: {},
	// `unknown` because the live context fills only the fields the endpoints read.
} as unknown as OmnisendContext;

function endpoint(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = api;
	for (const part of id.split('.')) node = (node as Json)[part];
	return node as AnyEndpoint;
}

const RUN = `corsair-live-${Date.now()}`;
const EXPECTED = new Set([402, 403, 404, 409, 422]);
const report: string[] = [];
const ids: Record<string, string | undefined> = {};

async function step(
	id: string,
	// `unknown` because the args are the operation's own input.
	args: unknown,
	keep?: (out: Json) => void,
): Promise<Json | undefined> {
	try {
		const out = (await endpoint(id)(ctx, args)) as Json;
		keep?.(out ?? {});
		report.push(`ok       ${id}`);
		return out;
	} catch (error) {
		const status = (error as { status?: number }).status;
		const line = `${status && EXPECTED.has(status) ? 'expected' : 'FAILED  '} ${id} ${String((error as Error).message).slice(0, 160)}`;
		report.push(line);
		if (!status || !EXPECTED.has(status)) throw error;
		return undefined;
	}
}

describeIfKey('Omnisend live run', () => {
	afterAll(async () => {
		// Clean up whatever the run made, even when a step failed.
		const cleanup: [string, Json][] = [
			['campaigns.delete', { id: ids.campaign }],
			['segments.delete', { segmentID: ids.segment }],
			['templates.delete', { id: ids.template }],
			['templates.delete', { id: ids.importedTemplate }],
			['universalLayouts.delete', { id: ids.layout }],
			['images.delete', { id: ids.image }],
			['products.delete', { productID: ids.product }],
			['categories.delete', { categoryID: ids.category }],
		];
		for (const [id, args] of cleanup) {
			if (Object.values(args).some((v) => !v)) continue;
			await step(id, args).catch(() => undefined);
		}
		if (process.env.OMNISEND_LIVE_REPORT) {
			writeFileSync(process.env.OMNISEND_LIVE_REPORT, `${report.join('\n')}\n`);
		}
		console.log(report.join('\n'));
	});

	it('reads every list and the brand', async () => {
		await step('brands.getCurrent', {});
		for (const id of [
			'contacts.list',
			'campaigns.list',
			'segments.list',
			'templates.list',
			'universalLayouts.list',
			'images.list',
			'automations.list',
			'forms.list',
			'formAbSetups.list',
			'formTemplates.list',
			'products.list',
			'categories.list',
		]) {
			await step(id, { limit: 2 });
		}
		await step('batches.list', { endpoint: 'contacts' });
		await step('contentTranslations.listLanguages', {});
		await step('events.queryMetadata', { category: 'events' });
	});

	it('tags its own contact', async () => {
		await step(
			'contacts.upsert',
			{
				identifiers: [
					{
						type: 'email',
						id: inbox,
						channels: { email: { status: 'nonSubscribed' } },
					},
				],
				firstName: 'Corsair',
				lastName: 'Live',
				tags: [RUN],
			},
			(out) => {
				ids.contact = String(out.id ?? out.contactID ?? '');
			},
		);
		if (ids.contact) {
			await step('contacts.get', { id: ids.contact });
			await step('contacts.update', { id: ids.contact, lastName: 'Live run' });
		}
		await step('contacts.addTags', { emails: [inbox], tags: [`${RUN}-b`] });
		await step('contacts.removeTags', { emails: [inbox], tags: [`${RUN}-b`] });
	});

	it('creates, reads and deletes catalog entries', async () => {
		const categoryID = `${RUN}-cat`;
		await step(
			'categories.create',
			{ categoryID, title: 'Corsair live' },
			() => {
				ids.category = categoryID;
			},
		);
		await step('categories.get', { categoryID });
		await step('categories.update', { categoryID, title: 'Corsair live 2' });
		const productID = `${RUN}-prod`;
		await step(
			'products.create',
			{
				id: productID,
				title: 'Corsair live product',
				status: 'inStock',
				currency: 'USD',
				url: 'https://corsair.dev/live-product',
				categoryIDs: [categoryID],
				variants: [
					{
						id: `${productID}-v1`,
						title: 'Default',
						price: 9.99,
						status: 'inStock',
						url: 'https://corsair.dev/live-product',
					},
				],
			},
			() => {
				ids.product = productID;
			},
		);
		await step('products.get', { productID });
	});

	it('works with email templates, layouts and images', async () => {
		await step(
			'templates.importFromHtml',
			{
				name: `${RUN} import`,
				html: '<html><body><p>Corsair live run</p></body></html>',
			},
			(out) => {
				ids.importedTemplate = String(out.id ?? out.templateID ?? '');
			},
		);
		await step('templates.create', { name: `${RUN} template` }, (out) => {
			ids.template = String(out.id ?? out.templateID ?? '');
		});
		if (ids.template) {
			await step('templates.get', { id: ids.template });
			await step('templates.render', { id: ids.template });
		}
		await step('universalLayouts.create', { name: `${RUN} layout` }, (out) => {
			ids.layout = String(out.id ?? '');
		});
		if (ids.layout) await step('universalLayouts.get', { id: ids.layout });
		await step(
			'images.uploadFromUrl',
			{ url: 'https://corsair.dev/favicon.ico', name: `${RUN}.ico` },
			(out) => {
				ids.image = String(out.id ?? out.imageID ?? '');
			},
		);
		if (ids.image) await step('images.get', { id: ids.image });
	});

	it('builds a segment and a draft campaign', async () => {
		await step(
			'segments.create',
			{
				name: `${RUN} segment`,
				conditionGroups: [
					{
						conditions: [
							{
								entity: 'contact',
								junction: 'and',
								filters: [
									{ operator: 'anyOf', property: 'tags', value: [RUN] },
								],
							},
						],
					},
				],
			},
			(out) => {
				ids.segment = String(out.segmentID ?? '');
			},
		);
		if (ids.segment) {
			await step('segments.get', { segmentID: ids.segment });
			await step('segments.getStatistics', { segmentID: ids.segment });
		}
		await step(
			'campaigns.create',
			{
				name: `${RUN} campaign`,
				type: 'regular',
				channel: 'email',
				content: {
					email: {
						subject: 'Corsair live run',
						templateID: ids.importedTemplate,
					},
				},
				audience: ids.segment
					? { includedSegmentIDs: [ids.segment] }
					: undefined,
			},
			(out) => {
				ids.campaign = String(out.id ?? out.campaignID ?? '');
			},
		);
		if (ids.campaign) {
			await step('campaigns.get', { id: ids.campaign });
			await step('campaigns.getUtm', { id: ids.campaign });
			// The one send of the run: a test email to our own inbox.
			await step('campaigns.sendTestEmail', {
				id: ids.campaign,
				recipients: [inbox],
			});
		}
	});
});
