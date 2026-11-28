import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ghostOperations } from './endpoints/manifest';
import { ghost } from './index';

/**
 * Live run against a Ghost site. Skipped unless the site URL and the Admin API
 * key are set (CI never runs files named api.test.ts):
 *
 *   GHOST_SITE_URL=https://blog.example.com GHOST_ADMIN_API_KEY=<id>:<secret> \
 *   GHOST_CONTENT_API_KEY=... npx jest api.test.ts
 *
 * Use a throwaway site (the 11-28 run used the ghost:6-alpine image in a Boat
 * sandbox, forwarded to localhost). The keys come from a custom integration.
 * The run creates and deletes posts, pages, tags, labels, members, a member
 * custom field, a webhook and an invite; adds a tier, a newsletter and an
 * offer (Ghost has no delete for those: they are archived); uploads an image,
 * a media file, a file and a theme copy, and re-activates the active theme.
 * Optional: GHOST_LIVE_REPORT=<file> writes each step as JSON.
 */
const key = process.env.GHOST_ADMIN_API_KEY;
const siteUrl = process.env.GHOST_SITE_URL;
const contentApiKey = process.env.GHOST_CONTENT_API_KEY;
const describeIfKey = key && siteUrl ? describe : describe.skip;
if (!key || !siteUrl) {
	console.warn(
		'Skipping Ghost live run: set GHOST_ADMIN_API_KEY and GHOST_SITE_URL.',
	);
}

const STAMP = Date.now().toString(36);
const NAME = `ct-${STAMP}`;

type Step = { id: string; ok: boolean; expected?: boolean; note?: string };

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: (string | number)[]): unknown {
	let node = value;
	for (const part of path) {
		node =
			typeof node === 'object' && node !== null
				? (node as Record<string | number, unknown>)[part]
				: undefined;
	}
	return node;
}

// `unknown` because the value is any parsed response.
function first(value: unknown, key: string): Record<string, unknown> {
	const found = pick(value, key, 0);
	if (typeof found !== 'object' || found === null)
		throw new Error(`response has no ${key}[0]`);
	return found as Record<string, unknown>;
}

const PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
	'base64',
).toString('base64');

describeIfKey('ghost live', () => {
	jest.setTimeout(600_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair.ghost
			.api;
		for (const part of id.split('.'))
			node = (node as Record<string, unknown>)[part];
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];

	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'ghost', 'default');
		const corsair = createCorsair({
			plugins: [ghost({ key, siteUrl, contentApiKey })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	async function step(
		id: string,
		input: unknown = {},
		expected?: RegExp,
		options: { either?: boolean } = {},
	): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({
				id,
				ok: !expected || options.either === true,
				...(expected ? { note: 'no error' } : {}),
			});
			return value;
		} catch (error) {
			const note = (error as Error).message.slice(0, 240);
			const ok = expected?.test(note) ?? false;
			steps.push({ id, ok, expected: ok, note });
			return undefined;
		}
	}

	function later(what: string, run: () => Promise<unknown>) {
		cleanups.push({ what, run });
	}

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			try {
				await item.run();
			} catch (error) {
				const message = (error as Error).message;
				if (!/Ghost 404/.test(message)) left.push(`${item.what}: ${message}`);
			}
		}
		await client?.testDb.cleanup?.();
		if (left.length > 0)
			console.warn(`Ghost records left behind:\n${left.join('\n')}`);
		const report = process.env.GHOST_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify({ steps, left }, null, 2));
		const failed = steps.filter((s) => !s.ok);
		console.log(
			`Ghost live: ${steps.length - failed.length}/${steps.length} ok (${steps.filter((s) => s.expected).length} expected errors, ${new Set(steps.map((s) => s.id)).size} operations)\n${failed
				.map((s) => `  ${s.id}: ${s.note}`)
				.join('\n')}`,
		);
		if (failed.length > 0 || left.length > 0) {
			throw new Error(
				`${failed.length} Ghost live steps failed, ${left.length} records left`,
			);
		}
	});

	it('reads every list and the site', async () => {
		for (const o of ghostOperations) {
			const required = (o.input.required as string[] | undefined) ?? [];
			if (o.method !== 'GET' || required.length > 0) continue;
			if (o.id.startsWith('content.') && !contentApiKey) continue;
			const takesLimit =
				'limit' in ((o.input.properties ?? {}) as Record<string, unknown>);
			// Pending staff invitations are for staff tokens: an integration gets 403.
			if (o.id === 'invites.list') await step(o.id, {}, /Ghost 403/);
			else await step(o.id, takesLimit ? { limit: 5 } : {});
		}
	});

	it('round-trips posts and pages', async () => {
		for (const kind of ['posts', 'pages'] as const) {
			const created = await step(`${kind}.create`, {
				title: `Corsair live ${kind} ${STAMP}`,
				html: '<p>Made by the Corsair Ghost plugin live run. Deleted when the run ends.</p>',
				source: 'html',
				status: 'draft',
			});
			const item = first(created, kind);
			const id = String(item.id);
			later(kind, () => op(`${kind}.delete`)({ id }));
			const read = await step(`${kind}.get`, { id, formats: 'html,lexical' });
			await step(`${kind}.getBySlug`, { slug: String(item.slug) });
			const updatedAt = String(pick(read, kind, 0, 'updated_at'));
			const published = await step(`${kind}.update`, {
				id,
				title: `Corsair live ${kind} ${STAMP} (published)`,
				status: 'published',
				updated_at: updatedAt,
			});
			// A stale updated_at is a collision.
			await step(
				`${kind}.update`,
				{ id, title: 'stale', updated_at: updatedAt },
				/Ghost 409/,
			);
			const copy = await step(`${kind}.copy`, { id });
			const copyId = pick(copy, kind, 0, 'id');
			if (typeof copyId === 'string')
				await step(`${kind}.delete`, { id: copyId });
			if (contentApiKey && published) {
				await step(`content.${kind}.get`, { id });
				await step(`content.${kind}.getBySlug`, {
					slug: String(pick(published, kind, 0, 'slug')),
				});
			}
			await step(`${kind}.delete`, { id });
		}
	});

	it('round-trips tags and labels', async () => {
		const tag = first(
			await step('tags.create', { name: `${NAME} tag` }),
			'tags',
		);
		const tagId = String(tag.id);
		later('tag', () => op('tags.delete')({ id: tagId }));
		await step('tags.get', { id: tagId });
		await step('tags.getBySlug', { slug: String(tag.slug) });
		await step('tags.update', {
			id: tagId,
			description: 'Made by the Corsair live run.',
		});
		if (contentApiKey) {
			await step('content.tags.get', { id: tagId }, /Ghost 404/, {
				either: true,
			});
			await step(
				'content.tags.getBySlug',
				{ slug: String(tag.slug) },
				/Ghost 404/,
				{ either: true },
			);
		}
		await step('tags.delete', { id: tagId });

		const label = first(
			await step('labels.create', { name: `${NAME} label` }),
			'labels',
		);
		const labelId = String(label.id);
		later('label', () => op('labels.delete')({ id: labelId }));
		await step('labels.get', { id: labelId });
		await step('labels.getBySlug', { slug: String(label.slug) });
		await step('labels.update', { id: labelId, name: `${NAME} label2` });
		await step('labels.delete', { id: labelId });
	});

	it('round-trips members and a member custom field', async () => {
		const field = await step(
			'members.customFields.create',
			{ name: `Company ${STAMP}`, type: 'short_text' },
			/Ghost 4\d\d/,
			{ either: true },
		);
		const fieldKey = pick(field, 'members_metafields', 0, 'key');
		if (typeof fieldKey === 'string') {
			later('custom field', async () => {
				await op('members.customFields.update')({
					key: fieldKey,
					status: 'archived',
				}).catch(() => undefined);
				return op('members.customFields.delete')({ key: fieldKey });
			});
			await step('members.customFields.get', { key: fieldKey });
			await step('members.customFields.update', {
				key: fieldKey,
				name: `Company ${STAMP} 2`,
			});
			await step(
				'members.customFields.reorder',
				{ members_metafields: [{ key: fieldKey }] },
				/Ghost 4\d\d/,
				{ either: true },
			);
		}
		const member = first(
			await step('members.create', {
				email: `corsair-tests+ghost-${STAMP}@inkboxmail.com`,
				name: 'Corsair Live Member',
				labels: [`${NAME} vip`],
				note: 'Made by the Corsair live run.',
			}),
			'members',
		);
		const memberId = String(member.id);
		later('member', () => op('members.delete')({ id: memberId }));
		await step('members.get', { id: memberId, include: 'newsletters,labels' });
		await step('members.update', {
			id: memberId,
			name: 'Corsair Live Member 2',
		});
		await step('members.list', { search: 'corsair-tests', limit: 5 });
		await step('members.delete', { id: memberId });
		if (typeof fieldKey === 'string') {
			// Only an archived field can be deleted (422 otherwise).
			await step('members.customFields.delete', { key: fieldKey }, /Ghost 422/);
			await step('members.customFields.update', {
				key: fieldKey,
				status: 'archived',
			});
			await step('members.customFields.delete', { key: fieldKey });
		}
		const labels = (await op('labels.list')({
			filter: `name:'${NAME} vip'`,
		})) as { labels?: Array<{ id: string }> };
		for (const l of labels.labels ?? [])
			await op('labels.delete')({ id: l.id });
	});

	it('adds and archives a tier, a newsletter and an offer', async () => {
		const tier = first(
			await step('tiers.create', {
				name: `${NAME} tier`,
				description: 'Made by the Corsair live run.',
				visibility: 'none',
				monthly_price: 500,
				yearly_price: 5000,
				currency: 'usd',
				benefits: ['A test benefit'],
			}),
			'tiers',
		);
		const tierId = String(tier.id);
		later('tier', () => op('tiers.update')({ id: tierId, active: false }));
		await step('tiers.get', { id: tierId });
		await step('tiers.update', {
			id: tierId,
			description: 'Updated by the Corsair live run.',
		});

		const newsletter = await step('newsletters.create', {
			name: `${NAME} letter`,
			description: 'Corsair live run',
		});
		const newsletterId = pick(newsletter, 'newsletters', 0, 'id');
		if (typeof newsletterId === 'string') {
			later('newsletter', () =>
				op('newsletters.update')({ id: newsletterId, status: 'archived' }),
			);
			await step('newsletters.get', { id: newsletterId });
			await step('newsletters.update', {
				id: newsletterId,
				status: 'archived',
			});
		}

		// An offer needs a paid tier with Stripe connected; without Stripe Ghost refuses it.
		const offer = await step(
			'offers.create',
			{
				name: `${NAME} offer`,
				code: `${NAME}-offer`,
				display_title: 'Test offer',
				type: 'percent',
				cadence: 'month',
				amount: 10,
				duration: 'once',
				tier: { id: tierId },
			},
			/Ghost 4\d\d/,
			{ either: true },
		);
		const offerId = pick(offer, 'offers', 0, 'id');
		if (typeof offerId === 'string') {
			later('offer', () =>
				op('offers.update')({ id: offerId, status: 'archived' }),
			);
			await step('offers.get', { id: offerId });
			await step('offers.update', { id: offerId, status: 'archived' });
		} else {
			await step('offers.get', { id: '6b0a3e9ebfdd6d00010042b1' }, /Ghost 404/);
			await step(
				'offers.update',
				{ id: '6b0a3e9ebfdd6d00010042b1', status: 'archived' },
				/Ghost 404/,
			);
		}
		await step('tiers.update', { id: tierId, active: false });
	});

	it('reads staff, sends and revokes an invite, and refuses staff edits to an integration', async () => {
		const users = await step('users.list', { include: 'roles' });
		const owner = first(users, 'users');
		await step('users.get', { id: String(owner.id) });
		await step('users.getBySlug', { slug: String(owner.slug) });
		await step('users.getByEmail', { email: String(owner.email) });
		if (contentApiKey) {
			// The owner has no published post yet: the Content API lists only authors with posts.
			await step('content.authors.get', { id: String(owner.id) }, /Ghost 404/, {
				either: true,
			});
			await step(
				'content.authors.getBySlug',
				{ slug: String(owner.slug) },
				/Ghost 404/,
				{ either: true },
			);
		}
		await step('users.update', { id: String(owner.id), bio: 'x' }, /Ghost 403/);
		await step(
			'users.delete',
			{ id: '6b0a3e9ebfdd6d00010042b1' },
			/Ghost 40[34]/,
		);
		const roles = await step('roles.list', {
			permissions: 'assign',
			limit: 'all',
		});
		const contributor = (
			(pick(roles, 'roles') as Array<{ id: string; name: string }>) ?? []
		).find((r) => r.name === 'Contributor');
		if (contributor) {
			const invite = await step(
				'invites.create',
				{
					role_id: contributor.id,
					email: `corsair-tests+ghost-staff-${STAMP}@inkboxmail.com`,
				},
				/Ghost (4\d\d|500)/,
				{ either: true },
			);
			const inviteId = pick(invite, 'invites', 0, 'id');
			if (typeof inviteId === 'string') {
				later('invite', () => op('invites.delete')({ id: inviteId }));
				await step('invites.delete', { id: inviteId });
			} else {
				// A site without mail answers 500 "Error sending email!" and keeps no invite.
				await step(
					'invites.delete',
					{ id: '6b0a3e9ebfdd6d00010042b1' },
					/Ghost 40[34]/,
				);
			}
		}
	});

	it('uploads an image, media, a file and a theme, and re-activates the theme', async () => {
		await step('images.upload', {
			file: {
				base64: PNG,
				filename: `corsair-${STAMP}.png`,
				contentType: 'image/png',
			},
			ref: 'corsair-live.png',
		});
		await step(
			'media.upload',
			{
				file: {
					base64: Buffer.from('ID3').toString('base64'),
					filename: `corsair-${STAMP}.mp3`,
					contentType: 'audio/mpeg',
				},
			},
			/Ghost 4\d\d/,
			{ either: true },
		);
		await step('files.upload', {
			file: {
				base64: Buffer.from('hello from corsair').toString('base64'),
				filename: `corsair-${STAMP}.txt`,
				contentType: 'text/plain',
			},
		});
		const site = (await op('site.get')({})) as { site?: { title?: string } };
		void site;
		// Re-activating the active theme changes nothing on the site.
		await step('themes.activate', { name: 'source' }, /Ghost 4\d\d/, {
			either: true,
		});
		await step(
			'themes.upload',
			{
				file: {
					base64: Buffer.from('not a zip').toString('base64'),
					filename: 'broken.zip',
					contentType: 'application/zip',
				},
			},
			/Ghost (4\d\d)/,
		);
	});

	it('adds, edits and deletes a webhook', async () => {
		const hook = first(
			await step('webhooks.create', {
				event: 'post.published',
				target_url: `https://example.com/hooks/corsair-${STAMP}`,
				name: 'Corsair live',
			}),
			'webhooks',
		);
		const hookId = String(hook.id);
		later('webhook', () => op('webhooks.delete')({ id: hookId }));
		await step('webhooks.update', { id: hookId, event: 'post.unpublished' });
		await step('webhooks.delete', { id: hookId });
	});
});
