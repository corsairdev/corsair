import {
	wordpressEndpointMeta,
	wordpressEndpointSchemas,
} from './endpoints/catalog';
import {
	WordpressManifestSchema,
	wordpressDefinitions,
	wordpressManifest,
	wordpressOperations,
} from './endpoints/manifest';
import {
	getWordpressInputSchema,
	getWordpressOutputSchema,
	wordpressInputFields,
} from './endpoints/openapi-schema';
import { WORDPRESS_OPERATION_IDS } from './endpoints/operation-types';

const ids = wordpressOperations.map((operation) => operation.id);

function operation(id: string) {
	const found = wordpressOperations.find((o) => o.id === id);
	if (!found) throw new Error(`no operation ${id}`);
	return found;
}

describe('wordpress-manifest.json', () => {
	it('matches the manifest schema', () => {
		expect(
			WordpressManifestSchema.safeParse(wordpressManifest).error?.issues ?? [],
		).toEqual([]);
	});

	it('has 209 operations, one per id and route', () => {
		expect(ids).toHaveLength(209);
		expect(new Set(ids).size).toBe(209);
		expect([...WORDPRESS_OPERATION_IDS].sort()).toEqual([...ids].sort());
		// rest.get and rest.send share the any-route path.
		const routes = new Set(
			wordpressOperations.map((o) => `${o.method} ${o.path}`),
		);
		expect(routes.size).toBe(209);
		expect(wordpressManifest.version).toBe('7.1.5');
	});

	it('covers the core REST groups', () => {
		for (const id of [
			'posts.list',
			'posts.create',
			'posts.revisions.list',
			'pages.update',
			'media.create',
			'users.me',
			'users.applicationPasswords.create',
			'comments.create',
			'categories.list',
			'tags.create',
			'taxonomies.list',
			'types.list',
			'settings.update',
			'plugins.install',
			'themes.list',
			'blockTypes.list',
			'templates.list',
			'templateParts.list',
			'globalStyles.get',
			'navigation.create',
			'menus.create',
			'menuItems.create',
			'menuLocations.list',
			'widgets.list',
			'sidebars.list',
			'search.query',
			'fontFamilies.list',
			'siteHealth.httpsStatus',
			'abilities.list',
			'batch.run',
			'site.index',
			'rest.get',
			'rest.send',
		]) {
			expect(ids).toContain(id);
		}
		expect(operation('posts.revisions.list').path).toBe(
			'/wp/v2/posts/{parent}/revisions',
		);
		expect(operation('users.applicationPasswords.get').path).toBe(
			'/wp/v2/users/{user_id}/application-passwords/{uuid}',
		);
	});

	it('references only definitions it has', () => {
		const text = JSON.stringify(wordpressOperations);
		for (const [, name] of text.matchAll(/"\$ref":"([^"]+)"/g)) {
			expect(wordpressDefinitions[name as string]).toBeDefined();
		}
	});
});

describe('schemas', () => {
	it('builds every input and output schema', () => {
		const failed: string[] = [];
		for (const id of ids) {
			try {
				getWordpressInputSchema(id);
				getWordpressOutputSchema(id);
			} catch {
				failed.push(id);
			}
		}
		expect(failed).toEqual([]);
	});

	it('has meta and schema entries for every operation', () => {
		expect(Object.keys(wordpressEndpointMeta).sort()).toEqual([...ids].sort());
		expect(Object.keys(wordpressEndpointSchemas).sort()).toEqual(
			[...ids].sort(),
		);
	});

	it('requires path values and refuses unknown fields on bodiless routes', () => {
		const get = getWordpressInputSchema('posts.get');
		expect(get.safeParse({}).success).toBe(false);
		expect(get.safeParse({ id: 12 }).success).toBe(true);
		expect(get.safeParse({ id: 12, nope: 1 }).success).toBe(false);
		// A body route keeps unknown keys (a field a plugin registers).
		expect(
			getWordpressInputSchema('posts.create').safeParse({
				title: 'x',
				acf: { color: 'red' },
			}).success,
		).toBe(true);
	});

	it('checks enums on input and keeps responses lenient', () => {
		const list = getWordpressInputSchema('posts.list');
		expect(list.safeParse({ orderby: 'date' }).success).toBe(true);
		expect(list.safeParse({ orderby: 'nonsense' }).success).toBe(false);
		expect(list.safeParse({ per_page: 101 }).success).toBe(false);
		const out = getWordpressOutputSchema('posts.get');
		const parsed = out.safeParse({
			id: 12,
			title: { rendered: 'Hi' },
			status: 'a-status-added-later',
			extra: true,
		});
		expect(parsed.success).toBe(true);
		expect(parsed.data).toMatchObject({ id: 12, extra: true });
		expect(out.safeParse({ id: 'twelve' }).success).toBe(false);
	});

	it('wraps paged lists and object maps', () => {
		const page = getWordpressOutputSchema('posts.list');
		expect(page.safeParse({ items: [{ id: 1 }], next_page: 2 }).success).toBe(
			true,
		);
		expect(page.safeParse([{ id: 1 }]).success).toBe(false);
		const types = getWordpressOutputSchema('types.list');
		expect(
			types.safeParse({ post: { slug: 'post', name: 'Posts' } }).success,
		).toBe(true);
		expect(getWordpressOutputSchema('themes.list').safeParse([]).success).toBe(
			true,
		);
	});

	it('takes media.create as a file or a url, not neither', () => {
		const schema = getWordpressInputSchema('media.create');
		expect(schema.safeParse({}).success).toBe(false);
		expect(schema.safeParse({ url: 'https://example.com/a.png' }).success).toBe(
			true,
		);
		expect(
			schema.safeParse({ file: { base64: 'aGk=', filename: 'a.txt' } }).success,
		).toBe(true);
	});

	it('routes fields to path, query and body', () => {
		const where = (id: string) =>
			Object.fromEntries(wordpressInputFields(id).map((f) => [f.name, f.in]));
		expect(where('posts.update')).toMatchObject({ id: 'path', title: 'body' });
		expect(where('posts.list')).toMatchObject({ search: 'query' });
		expect(where('media.create')).toMatchObject({
			title: 'query',
			file: 'body',
		});
		expect(where('rest.send')).toEqual({
			route: 'path',
			method: 'method',
			query: 'query-object',
			body: 'body-object',
		});
		const plugin = wordpressInputFields('plugins.get').find(
			(f) => f.name === 'plugin',
		);
		expect(plugin?.slashes).toBe(true);
	});
});

describe('risk levels', () => {
	it('marks deletes, plugin installs and minted passwords destructive', () => {
		const risk = (id: string) =>
			wordpressEndpointMeta[id as keyof typeof wordpressEndpointMeta].riskLevel;
		for (const id of ids.filter((i) => operation(i).method === 'DELETE')) {
			expect(risk(id)).toBe('destructive');
		}
		expect(risk('plugins.install')).toBe('destructive');
		expect(risk('plugins.update')).toBe('destructive');
		expect(risk('users.applicationPasswords.create')).toBe('destructive');
		expect(risk('batch.run')).toBe('destructive');
		expect(risk('rest.send')).toBe('destructive');
		expect(risk('rest.get')).toBe('read');
		expect(risk('posts.create')).toBe('write');
		expect(risk('blockRenderer.render')).toBe('read');
		expect(risk('posts.list')).toBe('read');
	});
});
