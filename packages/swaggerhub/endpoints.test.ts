import {
	apiEntry,
	apisJson,
	capabilities,
	closableComment,
	comment,
	comparison,
	definition,
	integration,
	lifecycle,
	project,
	projectsJson,
	specsPage,
	templateWrapper,
	validationResult,
	visibility,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	fetchCount,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	pathname,
	queryParam,
	rawBody,
	restoreFetchMock,
	sentBody,
	sentHeader,
	TEST_AUTH,
	textResponse,
} from './test-helpers';

const ctx = makeCtx();

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('swaggerhub specs', () => {
	it('lists specs with only the filters that were set', async () => {
		mockFetch(jsonResponse(specsPage));
		const result = await endpoints.specs.list(ctx, {
			specType: 'API',
			owner: 'admin',
			limit: 50,
		});

		expect(lastCall().url).toBe(
			`${BASE}/specs?specType=API&owner=admin&limit=50`,
		);
		expect(sentHeader('Authorization')).toBe(TEST_AUTH);
		expect(result.items).toHaveLength(1);
		expect(result.totalCount).toBe(1);
	});

	it('sends the key with no bearer prefix', async () => {
		mockFetch(jsonResponse(specsPage));
		await endpoints.specs.list(ctx, {});

		// Documented as the bare key, so a prefixed value would be rejected.
		expect(sentHeader('Authorization')).toBe('test-api-key');
	});

	it('never sends an unset filter as an empty value', async () => {
		mockFetch(jsonResponse(specsPage));
		await endpoints.specs.list(ctx, {});

		expect([...new URL(lastCall().url).searchParams.keys()]).toEqual([]);
	});

	it('validates a definition without saving it', async () => {
		mockFetch(jsonResponse(validationResult));
		const result = await endpoints.specs.validate(ctx, {
			definition,
			maxProblems: 10,
		});

		expect(pathname()).toBe('/specs/validate');
		expect(lastCall().init.method).toBe('POST');
		expect(queryParam('maxProblems')).toBe('10');
		expect(sentBody()).toEqual({ definition });
		expect(result.valid).toBe(false);
		expect(result.summary?.errors).toBe(1);
	});

	it('rejects an empty definition before sending', async () => {
		await expect(
			endpoints.specs.validate(ctx, { definition: '' }),
		).rejects.toThrow();
		expect(fetchCount()).toBe(0);
	});
});

describe('swaggerhub apis', () => {
	it('lists the APIs under an owner', async () => {
		mockFetch(jsonResponse(apisJson));
		const result = await endpoints.apis.list(ctx, {
			owner: 'admin',
			sort: 'UPDATED',
			order: 'DESC',
		});

		expect(pathname()).toBe('/apis/admin');
		expect(queryParam('sort')).toBe('UPDATED');
		expect(result.apis[0]?.name).toBe('example');
	});

	it('lists every version of one API', async () => {
		mockFetch(jsonResponse(apisJson));
		const result = await endpoints.apis.listVersions(ctx, {
			owner: 'admin',
			api: 'example',
		});

		expect(pathname()).toBe('/apis/admin/example');
		expect(result.defaultVersion).toBe('1.0.0');
	});

	it('reads a definition as text', async () => {
		mockFetch(textResponse(definition));
		const result = await endpoints.apis.getDefinition(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			resolved: true,
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0');
		expect(queryParam('resolved')).toBe('true');
		expect(result.definition).toBe(definition);
	});

	it('serializes a JSON definition response into the same string shape', async () => {
		// A JSON definition comes back parsed, so the plugin re-serializes it to
		// keep the output one type.
		mockFetch(jsonResponse({ openapi: '3.0.0', paths: {} }));
		const result = await endpoints.apis.getDefinition(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
		});

		expect(typeof result.definition).toBe('string');
		expect(JSON.parse(result.definition)).toEqual({
			openapi: '3.0.0',
			paths: {},
		});
	});

	it('sends the definition itself as the body on save', async () => {
		mockFetch(new Response(null, { status: 201 }));
		const result = await endpoints.apis.save(ctx, {
			owner: 'admin',
			api: 'example',
			definition,
		});

		expect(pathname()).toBe('/apis/admin/example');
		expect(lastCall().init.method).toBe('POST');
		// The definition is the body, not a wrapper around it.
		expect(rawBody()).toBe(definition);
		expect(sentHeader('Content-Type')).toContain('application/yaml');
		expect(result).toEqual({
			owner: 'admin',
			api: 'example',
			version: null,
			created: true,
			saved: true,
		});
	});

	it('sends a JSON definition with the JSON media type', async () => {
		mockFetch(new Response(null, { status: 200 }));
		await endpoints.apis.save(ctx, {
			owner: 'admin',
			api: 'example',
			definition: '{"openapi":"3.0.0"}',
			format: 'json',
			version: '2.0.0',
		});

		expect(sentHeader('Content-Type')).toContain('application/json');
		expect(queryParam('version')).toBe('2.0.0');
	});

	it('reports a forced save as an update rather than a create', async () => {
		mockFetch(new Response(null, { status: 200 }));
		const result = await endpoints.apis.save(ctx, {
			owner: 'admin',
			api: 'example',
			definition,
			force: true,
			version: '1.0.0',
		});

		expect(queryParam('force')).toBe('true');
		expect(result.created).toBe(false);
	});

	it('deletes an API and one version of it', async () => {
		mockFetch(jsonResponse({}));
		await expect(
			endpoints.apis.delete(ctx, { owner: 'admin', api: 'example' }),
		).resolves.toEqual({
			owner: 'admin',
			api: 'example',
			deleted: true,
		});
		expect(lastCall().init.method).toBe('DELETE');

		mockFetch(jsonResponse({}));
		await expect(
			endpoints.apis.deleteVersion(ctx, {
				owner: 'admin',
				api: 'example',
				version: '1.0.0',
			}),
		).resolves.toEqual({
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			deleted: true,
		});
		expect(pathname()).toBe('/apis/admin/example/1.0.0');
	});

	it('clones a version through the version path', async () => {
		mockFetch(new Response(null, { status: 201 }));
		const result = await endpoints.apis.cloneVersion(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			newVersion: '1.0.1',
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0/clone');
		expect(sentBody()).toEqual({ version: '1.0.1' });
		expect(result).toEqual({
			owner: 'admin',
			api: 'example',
			sourceVersion: '1.0.0',
			version: '1.0.1',
			created: true,
		});
	});

	it('forks a version into another owner under a new name', async () => {
		mockFetch(new Response(null, { status: 201 }));
		const result = await endpoints.apis.forkVersion(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			targetOwner: 'other',
			targetName: 'copy',
			targetVersion: '2.0.0',
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0/fork');
		expect(sentBody()).toEqual({
			owner: 'other',
			name: 'copy',
			version: '2.0.0',
		});
		expect(result.targetName).toBe('copy');
		expect(result.forked).toBe(true);
	});

	it('refuses a target name shorter than the documented minimum', async () => {
		await expect(
			endpoints.apis.forkVersion(ctx, {
				owner: 'admin',
				api: 'example',
				version: '1.0.0',
				targetOwner: 'other',
				targetName: 'ab',
				targetVersion: '1',
			}),
		).rejects.toThrow();
		expect(fetchCount()).toBe(0);
	});

	it('compares a definition and reads a bare array of changes', async () => {
		mockFetch(jsonResponse(comparison));
		const result = await endpoints.apis.compare(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			definition,
			method: 'previous',
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0/compare');
		expect(queryParam('method')).toBe('previous');
		expect(rawBody()).toBe(definition);
		expect(result.changes).toHaveLength(2);
	});

	it('reads capabilities', async () => {
		mockFetch(jsonResponse(capabilities));
		const result = await endpoints.apis.getCapabilities(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0/capabilities');
		expect(result.canViewStandardizationErrors).toBe(true);
	});

	it('reads and sets the default version', async () => {
		mockFetch(jsonResponse({ version: '1.0.0' }));
		const read = await endpoints.apis.getDefaultVersion(ctx, {
			owner: 'admin',
			api: 'example',
		});
		expect(pathname()).toBe('/apis/admin/example/settings/default');
		expect(read.version).toBe('1.0.0');

		mockFetch(jsonResponse({}));
		const set = await endpoints.apis.setDefaultVersion(ctx, {
			owner: 'admin',
			api: 'example',
			version: '2.0.0',
		});
		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({ version: '2.0.0' });
		expect(set.version).toBe('2.0.0');
	});

	it('reads a null default version when the API has none', async () => {
		mockFetch(jsonResponse({}));
		const result = await endpoints.apis.getDefaultVersion(ctx, {
			owner: 'admin',
			api: 'example',
		});

		expect(result.version).toBeNull();
	});

	it('renames an API through the query parameter', async () => {
		mockFetch(new Response(null, { status: 200 }));
		await endpoints.apis.rename(ctx, {
			owner: 'admin',
			api: 'example',
			newName: 'renamed',
		});

		expect(pathname()).toBe('/apis/admin/example/rename');
		expect(queryParam('newName')).toBe('renamed');
		// The route takes no body.
		expect(lastCall().init.body).toBeUndefined();
	});

	it('reads, sets and disables notifications', async () => {
		mockFetch(jsonResponse({ enabled: ['self'] }));
		const read = await endpoints.apis.getNotifications(ctx, {
			owner: 'admin',
			api: 'example',
			scope: 'self',
		});
		expect(queryParam('scope')).toBe('self');
		expect(read.enabled).toEqual(['self']);

		mockFetch(jsonResponse({ enabled: ['self', 'team'] }));
		await endpoints.apis.setNotifications(ctx, {
			owner: 'admin',
			api: 'example',
			enabled: ['self', 'team'],
		});
		// The body is the bare list of scopes, with no wrapper object.
		expect(sentBody()).toEqual(['self', 'team']);

		mockFetch(new Response(null, { status: 200 }));
		await endpoints.apis.disableNotifications(ctx, {
			owner: 'admin',
			api: 'example',
		});
		expect(lastCall().init.method).toBe('DELETE');
		expect(pathname()).toBe('/apis/admin/example/.notifications');
	});
});

describe('swaggerhub api settings', () => {
	it('reads and changes the lifecycle', async () => {
		mockFetch(jsonResponse(lifecycle));
		const read = await endpoints.apiSettings.getLifecycle(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
		});
		expect(pathname()).toBe('/apis/admin/example/1.0.0/settings/lifecycle');
		expect(read.published).toBe(false);

		mockFetch(jsonResponse({ published: true }));
		const set = await endpoints.apiSettings.setLifecycle(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			published: true,
		});
		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({ published: true });
		expect(set.published).toBe(true);
	});

	it('reads and changes the visibility', async () => {
		mockFetch(jsonResponse(visibility));
		const read = await endpoints.apiSettings.getVisibility(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
		});
		expect(pathname()).toBe('/apis/admin/example/1.0.0/settings/private');
		expect(read.private).toBe(false);

		mockFetch(jsonResponse({ private: true }));
		await endpoints.apiSettings.setVisibility(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			private: true,
		});
		expect(sentBody()).toEqual({ private: true });
	});
});

describe('swaggerhub comments', () => {
	it('reads a bare array of comments', async () => {
		mockFetch(jsonResponse([closableComment]));
		const result = await endpoints.comments.list(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0/comments');
		expect(result.comments).toHaveLength(1);
		expect(result.empty).toBe(false);
	});

	it('reads a 204 as no comments rather than a failure', async () => {
		mockFetch(new Response(null, { status: 204 }));
		const result = await endpoints.comments.list(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
		});

		expect(result.comments).toEqual([]);
		expect(result.empty).toBe(true);
	});

	it('creates a comment with the required replies array', async () => {
		mockFetch(jsonResponse(closableComment, { status: 201 }));
		const result = await endpoints.comments.create(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			body: 'This operation needs a summary',
		});

		expect(sentBody()).toEqual({
			body: 'This operation needs a summary',
			replies: [],
		});
		expect(result.id).toBe('c1');
	});

	it('updates and deletes a comment', async () => {
		mockFetch(jsonResponse(closableComment));
		const updated = await endpoints.comments.update(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			comment: 'c1',
			body: 'Reworded',
		});
		expect(lastCall().init.method).toBe('PATCH');
		expect(pathname()).toBe('/apis/admin/example/1.0.0/comments/c1');
		expect(sentBody()).toEqual({ body: 'Reworded' });
		expect(updated.id).toBe('c1');

		mockFetch(new Response(null, { status: 200 }));
		await expect(
			endpoints.comments.delete(ctx, {
				owner: 'admin',
				api: 'example',
				version: '1.0.0',
				comment: 'c1',
			}),
		).resolves.toEqual({
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			comment: 'c1',
			deleted: true,
		});
	});

	it('adds a reply under the comment', async () => {
		mockFetch(jsonResponse(comment, { status: 201 }));
		const result = await endpoints.comments.reply(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			comment: 'c1',
			body: 'Fixed in 1.0.1',
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0/comments/c1/replies');
		expect(sentBody()).toEqual({ body: 'Fixed in 1.0.1' });
		expect(result.id).toBe('c1');
	});
});

describe('swaggerhub domains', () => {
	it('lists domains and their versions', async () => {
		mockFetch(jsonResponse(apisJson));
		const listed = await endpoints.domains.list(ctx, { owner: 'admin' });
		expect(pathname()).toBe('/domains/admin');
		expect(listed.apis).toHaveLength(1);

		mockFetch(jsonResponse(apisJson));
		await endpoints.domains.getVersions(ctx, {
			owner: 'admin',
			domain: 'example',
		});
		expect(pathname()).toBe('/domains/admin/example');
	});

	it('reads and saves a domain definition', async () => {
		mockFetch(textResponse(definition));
		const read = await endpoints.domains.getDefinition(ctx, {
			owner: 'admin',
			domain: 'example',
			version: '1.0.0',
		});
		expect(pathname()).toBe('/domains/admin/example/1.0.0');
		expect(read.definition).toBe(definition);

		mockFetch(new Response(null, { status: 201 }));
		await endpoints.domains.save(ctx, {
			owner: 'admin',
			domain: 'example',
			definition,
		});
		expect(rawBody()).toBe(definition);
	});

	it('deletes a domain and one version', async () => {
		mockFetch(jsonResponse({}));
		await expect(
			endpoints.domains.delete(ctx, { owner: 'admin', domain: 'example' }),
		).resolves.toEqual({
			owner: 'admin',
			domain: 'example',
			deleted: true,
		});

		mockFetch(jsonResponse({}));
		await expect(
			endpoints.domains.deleteVersion(ctx, {
				owner: 'admin',
				domain: 'example',
				version: '1.0.0',
			}),
		).resolves.toEqual({
			owner: 'admin',
			domain: 'example',
			version: '1.0.0',
			deleted: true,
		});
	});
});

describe('swaggerhub templates', () => {
	it('reads a bare array of templates', async () => {
		mockFetch(jsonResponse([templateWrapper]));
		const result = await endpoints.templates.list(ctx, {});

		expect(pathname()).toBe('/templates');
		expect(result.templates).toHaveLength(1);
	});

	it('reads, saves and deletes a template', async () => {
		mockFetch(textResponse(definition));
		const read = await endpoints.templates.get(ctx, {
			owner: 'admin',
			templateId: 'template-1',
			version: '1.0.0',
			builtin: true,
		});
		expect(pathname()).toBe('/templates/admin/template-1/1.0.0');
		expect(queryParam('builtin')).toBe('true');
		expect(read.definition).toBe(definition);

		mockFetch(new Response(null, { status: 201 }));
		await endpoints.templates.save(ctx, {
			owner: 'admin',
			templateId: 'template-1',
			definition,
		});
		expect(pathname()).toBe('/templates/admin/template-1');
		expect(rawBody()).toBe(definition);

		mockFetch(new Response(null, { status: 204 }));
		await expect(
			endpoints.templates.delete(ctx, {
				owner: 'admin',
				templateId: 'template-1',
				version: '1.0.0',
			}),
		).resolves.toEqual({
			owner: 'admin',
			templateId: 'template-1',
			version: '1.0.0',
			deleted: true,
		});
	});
});

describe('swaggerhub projects', () => {
	it('lists projects', async () => {
		mockFetch(jsonResponse(projectsJson));
		const result = await endpoints.projects.list(ctx, { owner: 'admin' });

		expect(pathname()).toBe('/projects/admin');
		expect(result.projects[0]?.name).toBe('API Project');
	});

	it('refuses a list body with no projects array', async () => {
		mockFetch(jsonResponse({ offset: 0 }));
		await expect(
			endpoints.projects.list(ctx, { owner: 'admin' }),
		).rejects.toThrow(/no projects array/);
	});

	it('reads one project', async () => {
		mockFetch(jsonResponse(project));
		const result = await endpoints.projects.get(ctx, {
			owner: 'admin',
			projectId: 'p1',
		});

		expect(pathname()).toBe('/projects/admin/p1');
		expect(result.apis).toEqual(['example']);
	});

	it('creates a project with all three collections, even when empty', async () => {
		mockFetch(jsonResponse(project, { status: 201 }));
		await endpoints.projects.create(ctx, {
			owner: 'admin',
			name: 'API Project',
			apis: ['example'],
		});

		expect(sentBody()).toEqual({
			name: 'API Project',
			apis: ['example'],
			domains: [],
			templates: [],
		});
	});

	it('updates a project with PUT', async () => {
		mockFetch(jsonResponse(project));
		await endpoints.projects.update(ctx, {
			owner: 'admin',
			projectId: 'p1',
			name: 'Renamed',
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(pathname()).toBe('/projects/admin/p1');
		expect(sentBody()).toEqual({
			name: 'Renamed',
			apis: [],
			domains: [],
			templates: [],
		});
	});

	it('deletes a project', async () => {
		mockFetch(new Response(null, { status: 204 }));
		await expect(
			endpoints.projects.delete(ctx, { owner: 'admin', projectId: 'p1' }),
		).resolves.toEqual({
			owner: 'admin',
			projectId: 'p1',
			deleted: true,
		});
	});
});

describe('swaggerhub integrations', () => {
	it('lists integrations on one API version', async () => {
		mockFetch(jsonResponse({ integrations: [integration] }));
		const result = await endpoints.integrations.list(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
		});

		expect(pathname()).toBe('/apis/admin/example/1.0.0/integrations');
		expect(result.integrations).toHaveLength(1);
	});

	it('runs one integration', async () => {
		mockFetch(new Response(null, { status: 200 }));
		const result = await endpoints.integrations.execute(ctx, {
			owner: 'admin',
			api: 'example',
			version: '1.0.0',
			integrationId: 'i1',
			commitMessage: 'Sync',
		});

		expect(pathname()).toBe(
			'/apis/admin/example/1.0.0/integrations/i1/execute',
		);
		expect(queryParam('commitMessage')).toBe('Sync');
		expect(result.executed).toBe(true);
	});
});

describe('swaggerhub encoding', () => {
	it('encodes each path segment so a version with a slash survives', async () => {
		mockFetch(textResponse(definition));
		await endpoints.apis.getDefinition(ctx, {
			owner: 'admin',
			api: 'example',
			version: 'feature/branch',
		});

		expect(pathname()).toBe('/apis/admin/example/feature%2Fbranch');
	});

	it('keeps the owner case, which SwaggerHub treats as significant', async () => {
		mockFetch(jsonResponse(apisJson));
		await endpoints.apis.list(ctx, { owner: 'AdminOrg' });

		expect(pathname()).toBe('/apis/AdminOrg');
	});
});

describe('swaggerhub base', () => {
	it('always calls the registry host', async () => {
		mockFetch(jsonResponse(specsPage));
		await endpoints.specs.list(ctx, {});

		expect(new URL(lastCall().url).host).toBe('api.swaggerhub.com');
	});

	it('leaves the fixture api entry shape intact', () => {
		expect(apiEntry.properties[0]?.type).toBe('Swagger');
	});
});
