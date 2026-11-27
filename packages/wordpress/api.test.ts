import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { wordpressOperations } from './endpoints/manifest';
import { wordpress } from './index';

/**
 * Live run against a throwaway WordPress (the REST index this plugin is
 * generated from came from the same image):
 *
 *   docker network create wp && docker run -d --name wp-db --network wp \
 *     -e MARIADB_DATABASE=wp -e MARIADB_USER=wp -e MARIADB_PASSWORD=wp \
 *     -e MARIADB_RANDOM_ROOT_PASSWORD=1 mariadb:11
 *   docker run -d --name wp --network wp -p 8093:80 -e WORDPRESS_DB_HOST=wp-db \
 *     -e WORDPRESS_DB_USER=wp -e WORDPRESS_DB_PASSWORD=wp -e WORDPRESS_DB_NAME=wp \
 *     -e WORDPRESS_CONFIG_EXTRA="define('WP_ENVIRONMENT_TYPE','local');" wordpress:latest
 *   wp core install ... && wp rewrite structure '/%postname%/' --hard
 *   wp user application-password create <admin> live --porcelain
 *
 *   WORDPRESS_SITE_URL=http://localhost:8093 WORDPRESS_USERNAME=<admin> \
 *     WORDPRESS_APP_PASSWORD=... npx jest api.test.ts
 *
 * Skipped unless the three are set (CI never runs files named api.test.ts).
 * The user must be an Administrator: the run creates and deletes posts,
 * pages, media, terms, menus, templates, fonts, widgets and a second user,
 * activates and deactivates the bundled Hello Dolly plugin and installs and
 * deletes one plugin from WordPress.org. Only point it at a site you can
 * throw away. WORDPRESS_LIVE_REPORT=<file> writes every operation's result.
 */
const siteUrl = process.env.WORDPRESS_SITE_URL;
const username = process.env.WORDPRESS_USERNAME;
const password = process.env.WORDPRESS_APP_PASSWORD;
const ready = Boolean(siteUrl && username && password);
const describeIfLive = ready ? describe : describe.skip;
if (!ready) {
	console.warn(
		'Skipping WordPress live run: set WORDPRESS_SITE_URL, WORDPRESS_USERNAME and WORDPRESS_APP_PASSWORD (a throwaway site).',
	);
}

const STAMP = Date.now().toString(36);
/** An id no record has: used where the site made nothing to read back (no revision yet). */
const MISSING = 987654321;
const NOT_FOUND =
	/404|rest_post_invalid|_invalid_id|no_autosave|rest_.*not_found/;
// `unknown` because ids come back from responses of any operation.
const numeric = (value: unknown) =>
	typeof value === 'number' ? value : MISSING;
const PNG =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

type Result = { ok: boolean; expected?: string; error?: string };
// `any` because the live run walks responses of 209 operations by field name.
type Json = any;

async function client(key: string, user: string) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'wordpress', 'default');
	const corsair = createCorsair({
		plugins: [wordpress({ key, siteUrl, username: user })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfLive('wordpress live', () => {
	jest.setTimeout(600_000);
	const results: Record<string, Result> = {};
	const cleanups: Array<() => Promise<unknown>> = [];

	function fn(api: Json, id: string): (input: object) => Promise<Json> {
		let node = api;
		for (const part of id.split('.')) node = node?.[part];
		if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
		return node;
	}

	/** Runs one operation; `expected` names an error the site is meant to answer (recorded, not a failure). */
	async function run(
		api: Json,
		id: string,
		input: object,
		expected?: RegExp,
	): Promise<Json> {
		try {
			const out = await fn(api, id)(input);
			results[id] = { ok: true };
			return out;
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (expected?.test(message)) {
				results[id] = { ok: true, expected: message.slice(0, 160) };
			} else if (!results[id]?.ok) {
				results[id] = { ok: false, error: message.slice(0, 300) };
			}
			return undefined;
		}
	}

	it('runs every operation against the site', async () => {
		const admin = await client(password as string, username as string);
		const api = admin.corsair.wordpress.api;
		const r = (id: string, input: object = {}, expected?: RegExp) =>
			run(api, id, input, expected);

		// Site, settings, types.
		await r('site.index');
		const me = await r('users.me', { context: 'edit' });
		await r('settings.get');
		const settings = await r('settings.get');
		await r('settings.update', { description: `Corsair live ${STAMP}` });
		await r('types.list');
		await r('types.get', { type: 'post' });
		await r('statuses.list');
		await r('statuses.get', { status: 'publish' });
		await r('taxonomies.list');
		await r('taxonomies.get', { taxonomy: 'category' });
		await r('viewConfig.get', { kind: 'postType', name: 'post' });

		// Terms.
		const cat = await r('categories.create', { name: `Releases ${STAMP}` });
		await r('categories.get', { id: cat?.id });
		await r('categories.list', { search: STAMP });
		await r('categories.update', { id: cat?.id, description: 'Release notes' });
		const tag = await r('tags.create', { name: `changelog-${STAMP}` });
		await r('tags.get', { id: tag?.id });
		await r('tags.list', { per_page: 5 });
		await r('tags.update', { id: tag?.id, description: 'Changes' });
		const pcat = await r('patternCategories.create', {
			name: `Heroes ${STAMP}`,
		});
		await r('patternCategories.get', { id: pcat?.id });
		await r('patternCategories.list');
		await r('patternCategories.update', {
			id: pcat?.id,
			description: 'Hero sections',
		});

		// Posts, pages, synced patterns, navigation: CRUD, revisions, autosaves.
		const content = (kind: string) => ({
			title: `Live ${kind} ${STAMP}`,
			content: `<!-- wp:paragraph --><p>Written by the ${kind} live run.</p><!-- /wp:paragraph -->`,
			// Private, not draft: WordPress folds an author's autosave of their own
			// draft into the post itself instead of saving an autosave revision.
			status:
				kind === 'navigation' || kind === 'blocks' ? 'publish' : 'private',
		});
		const records: Record<string, Json> = {};
		for (const kind of ['posts', 'pages', 'blocks', 'navigation']) {
			const extra =
				kind === 'posts' ? { categories: [cat?.id], tags: [tag?.id] } : {};
			const made = await r(`${kind}.create`, { ...content(kind), ...extra });
			records[kind] = made;
			await r(`${kind}.get`, { id: made?.id, context: 'edit' });
			await r(`${kind}.list`, { per_page: 2 });
			await r(`${kind}.update`, {
				id: made?.id,
				title: `Live ${kind} ${STAMP} v2`,
			});
			const revisions = await r(`${kind}.revisions.list`, { parent: made?.id });
			const list = revisions?.items ?? revisions ?? [];
			// The oldest revision: WordPress refuses to delete the newest one.
			const revision = list[list.length - 1];
			await r(
				`${kind}.revisions.get`,
				{ parent: made?.id, id: revision?.id ?? MISSING },
				NOT_FOUND,
			);
			const autosave = await r(`${kind}.autosaves.create`, {
				id: made?.id,
				title: 'Autosaved title',
				content: '<p>Autosaved</p>',
			});
			await r(`${kind}.autosaves.list`, { id: made?.id });
			await r(
				`${kind}.autosaves.get`,
				{ parent: made?.id, id: numeric(autosave?.id) },
				NOT_FOUND,
			);
			await r(
				`${kind}.revisions.delete`,
				{ parent: made?.id, id: revision?.id ?? MISSING, force: true },
				/rest_cannot_delete|404/,
			);
		}
		const post = records.posts;

		// Media.
		const media = await r('media.create', {
			file: {
				base64: PNG,
				filename: `live-${STAMP}.png`,
				contentType: 'image/png',
			},
			title: `Live image ${STAMP}`,
			alt_text: 'A one-pixel test image',
			post: post?.id,
		});
		await r('media.get', { id: media?.id });
		await r('media.list', { media_type: ['image'], per_page: 5 });
		await r('media.update', { id: media?.id, caption: 'Updated caption' });
		const edited = await r('media.edit', {
			id: media?.id,
			src: media?.source_url,
			modifiers: [{ type: 'rotate', args: { angle: 90 } }],
		});
		await r(
			'media.postProcess',
			{ id: media?.id, action: 'create-image-subsizes' },
			/rest_|400|500/,
		);
		await r(
			'media.sideload',
			{
				id: media?.id,
				image_size: 'thumbnail',
				file: {
					base64: PNG,
					filename: `live-${STAMP}-150x150.png`,
					contentType: 'image/png',
				},
			},
			/rest_|400|403|500/,
		);
		await r('media.finalize', { id: media?.id }, /rest_|400|403|500/);
		const fromUrl = await r(
			'media.create',
			{
				url: 'https://s.w.org/style/images/about/WordPress-logotype-wmark.png',
			},
			/rest_|400|500|upload/,
		);

		// Comments.
		const comment = await r('comments.create', {
			post: post?.id,
			content: 'Nice post',
		});
		await r('comments.get', { id: comment?.id });
		await r('comments.list', { post: [post?.id] });
		await r('comments.update', {
			id: comment?.id,
			content: 'Nice post, edited',
		});
		await r('comments.delete', { id: comment?.id, force: true });

		// Users and application passwords.
		const grace = await r('users.create', {
			username: `grace-${STAMP}`,
			email: `grace-${STAMP}@example.com`,
			password: `pw-${STAMP}-Correct-Horse-9`,
			roles: ['administrator'],
		});
		await r('users.get', { id: grace?.id, context: 'edit' });
		await r('users.list', { search: STAMP, context: 'edit' });
		await r('users.update', { id: grace?.id, description: 'Live run user' });
		await r('users.updateMe', { description: `Admin, live ${STAMP}` });
		const pass = await r('users.applicationPasswords.create', {
			user_id: grace?.id,
			name: `live-${STAMP}`,
		});
		await r('users.applicationPasswords.list', { user_id: grace?.id });
		await r('users.applicationPasswords.get', {
			user_id: grace?.id,
			uuid: pass?.uuid,
		});
		await r('users.applicationPasswords.update', {
			user_id: grace?.id,
			uuid: pass?.uuid,
			name: `live-${STAMP}-renamed`,
		});
		await r('users.applicationPasswords.introspect', { user_id: 'me' });
		// A second password for grace, used to delete grace's own account.
		const pass2 = await r('users.applicationPasswords.create', {
			user_id: grace?.id,
			name: `live-${STAMP}-self`,
		});
		await r('users.applicationPasswords.delete', {
			user_id: grace?.id,
			uuid: pass?.uuid,
		});

		// Menus (classic) and menu items.
		const menu = await r('menus.create', { name: `Live menu ${STAMP}` });
		await r('menus.get', { id: menu?.id });
		await r('menus.list');
		await r('menus.update', { id: menu?.id, description: 'Footer links' });
		const item = await r('menuItems.create', {
			title: 'Docs',
			url: 'https://example.com/docs',
			type: 'custom',
			status: 'publish',
			menus: menu?.id,
		});
		await r('menuItems.get', { id: item?.id });
		await r('menuItems.list', { menus: [menu?.id] });
		await r('menuItems.update', { id: item?.id, title: 'Docs (new)' });
		const itemSave = await r('menuItems.autosaves.create', {
			id: item?.id,
			title: 'Docs draft',
		});
		await r('menuItems.autosaves.list', { id: item?.id });
		await r(
			'menuItems.autosaves.get',
			{ parent: item?.id, id: numeric(itemSave?.id) },
			NOT_FOUND,
		);
		await r('menuLocations.list');
		await r(
			'menuLocations.get',
			{ location: 'primary' },
			/rest_menu_location_invalid|404/,
		);

		// Block templates and template parts.
		for (const kind of ['templates', 'templateParts']) {
			const list = await r(`${kind}.list`);
			const first = list?.[0];
			await r(`${kind}.get`, { id: first?.id });
			await r(
				`${kind}.lookup`,
				{
					slug: kind === 'templates' ? 'front-page' : 'header',
				},
				/rest_|404/,
			);
			const made = await r(`${kind}.create`, {
				slug: `live-${STAMP}`,
				title: `Live ${STAMP}`,
				content:
					'<!-- wp:paragraph --><p>Live template</p><!-- /wp:paragraph -->',
				...(kind === 'templateParts' ? { area: 'uncategorized' } : {}),
			});
			// Two edits, so the template has a revision to read back.
			await r(`${kind}.update`, {
				id: made?.id,
				content: '<!-- wp:paragraph --><p>v2</p><!-- /wp:paragraph -->',
			});
			await r(`${kind}.update`, {
				id: made?.id,
				content: '<!-- wp:paragraph --><p>v3</p><!-- /wp:paragraph -->',
			});
			const revs = await r(`${kind}.revisions.list`, { parent: made?.id });
			const rev = revs?.[revs.length - 1];
			await r(
				`${kind}.revisions.get`,
				{ parent: made?.id, id: rev?.id ?? MISSING },
				NOT_FOUND,
			);
			const save = await r(`${kind}.autosaves.create`, {
				id: made?.id,
				content: '<p>draft</p>',
			});
			await r(`${kind}.autosaves.list`, { id: made?.id });
			await r(
				`${kind}.autosaves.get`,
				{ parent: made?.id, id: numeric(save?.id) },
				NOT_FOUND,
			);
			await r(
				`${kind}.revisions.delete`,
				{ parent: made?.id, id: rev?.id ?? MISSING, force: true },
				/rest_cannot_delete|404/,
			);
			await r(`${kind}.delete`, { id: made?.id, force: true });
		}

		// Themes and global styles.
		const themes = await r('themes.list', { status: ['active'] });
		const theme = themes?.[0];
		await r('themes.get', { stylesheet: theme?.stylesheet });
		await r('globalStyles.theme', { stylesheet: theme?.stylesheet });
		await r('globalStyles.themeVariations', { stylesheet: theme?.stylesheet });
		const stylesLink: string | undefined =
			theme?._links?.['wp:user-global-styles']?.[0]?.href;
		const stylesId = stylesLink?.split('/').pop();
		await r('globalStyles.get', { id: stylesId });
		for (const text of ['#111111', '#222222']) {
			await r('globalStyles.update', {
				id: stylesId,
				styles: { color: { text } },
				settings: {},
			});
		}
		const styleRevs = await r('globalStyles.revisions.list', {
			parent: Number(stylesId),
		});
		await r(
			'globalStyles.revisions.get',
			{ parent: Number(stylesId), id: styleRevs?.[0]?.id ?? MISSING },
			NOT_FOUND,
		);

		// Fonts.
		const family = await r('fontFamilies.create', {
			font_family_settings: JSON.stringify({
				name: `Live ${STAMP}`,
				slug: `live-${STAMP}`,
				fontFamily: `Live${STAMP}, sans-serif`,
			}),
		});
		await r('fontFamilies.get', { id: family?.id });
		await r('fontFamilies.list');
		await r('fontFamilies.update', {
			id: family?.id,
			font_family_settings: JSON.stringify({ name: `Live ${STAMP} v2` }),
		});
		const face = await r('fontFamilies.fontFaces.create', {
			font_family_id: family?.id,
			font_face_settings: JSON.stringify({
				fontFamily: `Live${STAMP}`,
				fontStyle: 'normal',
				fontWeight: '400',
				src: 'https://example.com/fonts/live.woff2',
			}),
		});
		await r('fontFamilies.fontFaces.get', {
			font_family_id: family?.id,
			id: face?.id,
		});
		await r('fontFamilies.fontFaces.list', { font_family_id: family?.id });
		await r('fontFamilies.fontFaces.delete', {
			font_family_id: family?.id,
			id: face?.id,
			force: true,
		});
		await r('fontFamilies.delete', { id: family?.id, force: true });
		const collections = await r('fontCollections.list');
		await r(
			'fontCollections.get',
			{ slug: collections?.[0]?.slug ?? 'google-fonts' },
			/rest_|404|500/,
		);

		// Plugins.
		await r('plugins.list');
		await r('plugins.get', { plugin: 'hello' });
		await r('plugins.update', { plugin: 'hello', status: 'active' });
		await r('plugins.update', { plugin: 'hello', status: 'inactive' });
		const installed = await r(
			'plugins.install',
			{ slug: 'classic-editor', status: 'inactive' },
			/rest_|folder_exists|500/,
		);
		if (installed?.plugin) {
			await r('plugins.delete', { plugin: installed.plugin });
		}

		// Blocks, patterns, widgets.
		await r('blockTypes.list', { namespace: 'core' });
		await r('blockTypes.listByNamespace', { namespace: 'core' });
		await r('blockTypes.get', { namespace: 'core', name: 'paragraph' });
		await r('blockRenderer.render', {
			name: 'core/archives',
			context: 'edit',
			attributes: {},
		});
		await r('blockPatterns.list');
		await r('blockPatterns.categories');
		await r(
			'blockDirectory.search',
			{ term: 'calendar', per_page: 2 },
			/rest_|500/,
		);
		await r(
			'patternDirectory.search',
			{ search: 'hero', per_page: 2 },
			/rest_|500/,
		);
		const sidebars = await r('sidebars.list');
		const sidebar = sidebars?.[0]?.id ?? 'wp_inactive_widgets';
		await r('sidebars.get', { id: sidebar });
		await r('widgetTypes.list');
		await r('widgetTypes.get', { id: 'block' }, /rest_|404/);
		await r(
			'widgetTypes.encode',
			{ id: 'text', instance: {} },
			/rest_|400|404/,
		);
		await r(
			'widgetTypes.render',
			{ id: 'text', instance: {} },
			/rest_|400|404/,
		);
		const widget = await r('widgets.create', {
			sidebar: 'wp_inactive_widgets',
			id_base: 'block',
			instance: {
				raw: {
					content:
						'<!-- wp:paragraph --><p>Live widget</p><!-- /wp:paragraph -->',
				},
			},
		});
		await r('widgets.get', { id: widget?.id });
		await r('widgets.list', { sidebar: 'wp_inactive_widgets' });
		await r('widgets.update', {
			id: widget?.id,
			instance: {
				raw: {
					content: '<!-- wp:paragraph --><p>v2</p><!-- /wp:paragraph -->',
				},
			},
		});
		await r('sidebars.update', {
			id: 'wp_inactive_widgets',
			widgets: [widget?.id].filter(Boolean),
		});
		await r('widgets.delete', { id: widget?.id, force: true });

		// Search, oEmbed, Site Health, editor helpers, icons.
		await r('search.query', { search: 'Live', per_page: 5 });
		const published = await r('posts.create', {
			title: `oEmbed ${STAMP}`,
			status: 'publish',
		});
		await r('oembed.embed', { url: published?.link });
		if (published?.id)
			cleanups.push(() =>
				fn(api, 'posts.delete')({ id: published.id, force: true }),
			);
		await r(
			'oembed.proxy',
			{ url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' },
			/rest_|oembed|404/,
		);
		for (const id of [
			'siteHealth.backgroundUpdates',
			'siteHealth.loopbackRequests',
			'siteHealth.httpsStatus',
			'siteHealth.dotorgCommunication',
			'siteHealth.authorizationHeader',
			'siteHealth.pageCache',
			'siteHealth.directorySizes',
		]) {
			await r(id, {}, /rest_|500/);
		}
		await r(
			'blockEditor.urlDetails',
			{ url: 'https://wordpress.org/' },
			/rest_|404|500/,
		);
		await r('blockEditor.export');
		await r('blockEditor.navigationFallback');
		const icons = await r('icons.list');
		const collectionsOfIcons = await r('iconCollections.list');
		const iconCollection = collectionsOfIcons?.[0]?.slug ?? 'core';
		await r('iconCollections.get', { slug: iconCollection });
		await r('icons.listByCollection', { collection: iconCollection });
		await r(
			'icons.get',
			{ name: icons?.[0]?.name ?? 'core/arrow-left' },
			/rest_|404/,
		);

		// Abilities API.
		await r('abilities.list');
		await r('abilities.get', { name: 'core/get-site-info' });
		await r('abilities.categories.list');
		await r('abilities.categories.get', { slug: 'site' }, /rest_|404/);
		await r('abilities.runReadonly', { name: 'core/get-site-info' });
		// Core registers only readonly abilities; WooCommerce (active on the
		// test site) adds a write one and a destructive one.
		const abilities = await fn(
			api,
			'abilities.list',
		)({ per_page: 100 }).catch(() => []);
		const names = (abilities?.items ?? abilities ?? []).map(
			(a: Json) => a?.name,
		);
		if (names.includes('woocommerce/product-create')) {
			const made = await r('abilities.run', {
				name: 'woocommerce/product-create',
				input: { name: `Ability product ${STAMP}`, regular_price: '9.99' },
			});
			const productId = made?.id ?? made?.product?.id;
			await r('abilities.runDestructive', {
				name: 'woocommerce/product-delete',
				input: { id: productId, force: true },
			});
		} else {
			await r(
				'abilities.run',
				{ name: 'core/get-site-info' },
				/rest_ability_invalid_method|405/,
			);
			await r(
				'abilities.runDestructive',
				{ name: 'core/get-site-info' },
				/rest_ability_invalid_method|405/,
			);
		}

		// Batch and any-route access.
		const batch = await r('batch.run', {
			requests: [
				{
					method: 'POST',
					path: '/wp/v2/posts',
					body: { title: `Batch A ${STAMP}`, status: 'draft' },
				},
				{
					method: 'POST',
					path: '/wp/v2/posts',
					body: { title: `Batch B ${STAMP}`, status: 'draft' },
				},
			],
		});
		for (const response of batch?.responses ?? []) {
			const id = response?.body?.id;
			if (id) cleanups.push(() => fn(api, 'posts.delete')({ id, force: true }));
		}
		await r('rest.get', { route: 'wp/v2/posts', query: { per_page: 1 } });
		await r('rest.send', {
			route: `wp/v2/posts/${post?.id}`,
			method: 'PATCH',
			body: { excerpt: 'Set through rest.send' },
		});

		// Cleanup through the delete operations.
		for (const kind of ['posts', 'pages', 'blocks', 'navigation']) {
			await r(`${kind}.delete`, { id: records[kind]?.id, force: true });
		}
		await r('media.delete', { id: media?.id, force: true });
		if (edited?.id)
			await fn(
				api,
				'media.delete',
			)({ id: edited.id, force: true }).catch(() => undefined);
		if (fromUrl?.id)
			await fn(
				api,
				'media.delete',
			)({ id: fromUrl.id, force: true }).catch(() => undefined);
		await r('menuItems.delete', { id: item?.id, force: true });
		await r('menus.delete', { id: menu?.id, force: true });
		await r('categories.delete', { id: cat?.id, force: true });
		await r('tags.delete', { id: tag?.id, force: true });
		await r('patternCategories.delete', { id: pcat?.id, force: true });
		for (const cleanup of cleanups) await cleanup().catch(() => undefined);

		// Grace deletes her own account with her own password, then the
		// admin revokes passwords of a throwaway second user and deletes it.
		if (pass2?.password && grace?.username) {
			const self = await client(pass2.password, grace.username);
			await run(self.corsair.wordpress.api, 'users.deleteMe', {
				force: true,
				reassign: me?.id ?? 1,
			});
			await self.testDb.cleanup?.();
		}
		const temp = await r('users.create', {
			username: `temp-${STAMP}`,
			email: `temp-${STAMP}@example.com`,
			password: `pw-${STAMP}-Temp-Horse-9`,
		});
		await r('users.applicationPasswords.create', {
			user_id: temp?.id,
			name: 'x',
		});
		await r('users.applicationPasswords.deleteAll', { user_id: temp?.id });
		await r('users.delete', {
			id: temp?.id,
			force: true,
			reassign: me?.id ?? 1,
		});
		await r('settings.update', { description: settings?.description ?? '' });
		await admin.testDb.cleanup?.();

		const missing = wordpressOperations
			.map((o) => o.id)
			.filter((id) => !(id in results));
		const failed = Object.entries(results).filter(([, v]) => !v.ok);
		const report = {
			site: siteUrl,
			operations: wordpressOperations.length,
			ran: Object.keys(results).length,
			ok: Object.values(results).filter((v) => v.ok && !v.expected).length,
			expected: Object.values(results).filter((v) => v.expected).length,
			failed: failed.length,
			missing,
			results,
		};
		if (process.env.WORDPRESS_LIVE_REPORT) {
			writeFileSync(
				process.env.WORDPRESS_LIVE_REPORT,
				JSON.stringify(report, null, 2),
			);
		}
		console.log(
			`WordPress live: ${report.ok} ok, ${report.expected} expected errors, ${report.failed} failed, ${missing.length} not run`,
		);
		expect(failed.map(([id, v]) => `${id}: ${v.error}`)).toEqual([]);
	});
});
