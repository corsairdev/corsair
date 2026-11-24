import { logEventFromContext } from 'corsair/core';
import type { DownloadDeps } from 'corsair/http';
import { ApiError } from 'corsair/http';
import type { Designs } from './endpoints';
import { Assets, DesignAnalytics } from './endpoints';
import { exportDownloadDeps } from './endpoints/exports';
import {
	CanvaEndpointInputSchemas,
	CanvaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { canva } from './index';

// The event logger is captured so tests can check what reaches event payloads.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => null),
}));

type Call = { method: string; url: string; body?: unknown; headers: Headers };

const plugin = canva();
const api = (() => {
	if (!plugin.endpoints) throw new Error('canva() returned no endpoints');
	return plugin.endpoints;
})();

type TransportResponse = Awaited<
	ReturnType<NonNullable<DownloadDeps['transport']>>
>;
const calls: Call[] = [];
let replies: unknown[] = [];
let replyStatus = 200;

// Each endpoint is called with the smallest context it needs: a token, no
// local tables, and an account lookup that the event logger may call.
const ctx = {
	key: 'test-token',
	db: {},
	$getAccountId: async () => 'acc_test',
} as unknown as Parameters<typeof Designs.get>[0];

function reply(...bodies: unknown[]) {
	replies = bodies;
}

beforeEach(() => {
	calls.length = 0;
	replies = [];
	replyStatus = 200;
	jest.spyOn(console, 'warn').mockImplementation(() => {});
	jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(
			async (input: string | URL | Request, init?: RequestInit) => {
				const url = String(input instanceof Request ? input.url : input);
				let body: unknown = init?.body;
				if (typeof body === 'string') {
					try {
						body = JSON.parse(body);
					} catch {
						// leave as text
					}
				}
				calls.push({
					method: init?.method ?? 'GET',
					url,
					body,
					headers: new Headers(init?.headers),
				});
				const next = replies.length > 1 ? replies.shift() : replies[0];
				return new Response(JSON.stringify(next ?? {}), {
					status: replyStatus,
					headers: { 'content-type': 'application/json' },
				});
			},
		);
});

afterEach(() => {
	jest.restoreAllMocks();
	exportDownloadDeps.current = {};
});

const job = (extra: Record<string, unknown> = {}) => ({
	job: { id: 'job_1', status: 'in_progress', ...extra },
});

// Smallest replies that satisfy the output schemas, now that every operation
// checks its response.
const design = (id = 'D1') => ({
	id,
	owner: { user_id: 'U1', team_id: 'T1' },
	urls: { edit_url: 'https://canva.test/e', view_url: 'https://canva.test/v' },
	created_at: 1,
	updated_at: 2,
});
const asset = {
	type: 'image',
	id: 'A1',
	name: 'n',
	tags: [],
	created_at: 1,
	updated_at: 2,
};
const folder = { id: 'F1', name: 'f', created_at: 1, updated_at: 2 };

describe('request shapes', () => {
	it('encodes ids placed in a path', async () => {
		reply({ design: { id: 'x' } });
		await api.designs.getDataset(ctx, { designId: '../exports/abc?x=1' });
		expect(calls[0]?.url).toContain(
			'/v1/designs/..%2Fexports%2Fabc%3Fx%3D1/dataset',
		);
	});

	it('creates a copy of a design', async () => {
		reply({ design: design('D2') });
		await api.designs.create(ctx, {
			type: 'design',
			design_id: 'D1',
			page_numbers: [1, 3],
		});
		expect(calls[0]).toMatchObject({
			method: 'POST',
			body: { type: 'design', design_id: 'D1', page_numbers: [1, 3] },
		});
	});

	it('defaults designs.create to type_and_asset', async () => {
		reply({ design: design('D2') });
		await api.designs.create(ctx, {
			design_type: { type: 'preset', name: 'presentation' },
			title: 'Deck',
		});
		expect(calls[0]?.body).toEqual({
			type: 'type_and_asset',
			design_type: { type: 'preset', name: 'presentation' },
			title: 'Deck',
		});
	});

	it('refuses a design copy without design_id', async () => {
		await expect(api.designs.create(ctx, { type: 'design' })).rejects.toThrow(
			'design_id is required',
		);
		expect(calls).toHaveLength(0);
	});

	it('sends analytics filters as query and page views as a body', async () => {
		reply({ items: [] });
		await DesignAnalytics.listViewers(ctx, {
			designId: 'D1',
			limit: 10,
			first_viewed_after: 1700000000,
		});
		const viewers = new URL(calls[0]?.url ?? '');
		expect(viewers.pathname).toBe('/rest/v1/designs/D1/analytics/viewers');
		expect(viewers.searchParams.get('limit')).toBe('10');
		expect(viewers.searchParams.get('first_viewed_after')).toBe('1700000000');

		await api.analytics.listPageViews(ctx, {
			designId: 'D1',
			page_ids: ['p1', 'p2'],
			filter: { type: 'for_editor' },
		});
		expect(calls[1]).toMatchObject({
			method: 'POST',
			body: { page_ids: ['p1', 'p2'], filter: { type: 'for_editor' } },
		});
	});

	it('wraps the generation design type and outline as Canva expects', async () => {
		reply(job());
		await api.generations.create(ctx, {
			brief: 'Quarterly results for the board',
			design_type: 'presentation',
			outline: [{ title: 'Revenue', points: ['Up 20%'] }],
		});
		expect(calls[0]?.body).toEqual({
			brief: 'Quarterly results for the board',
			design_type: { type: 'preset', name: 'presentation' },
			outline: { sections: [{ title: 'Revenue', points: ['Up 20%'] }] },
		});
	});

	it('gives every image generation an idempotency key', async () => {
		reply(job());
		await api.imageGenerations.create(ctx, {
			prompt: 'A lighthouse at dusk',
			save_to_uploads: true,
			asset_name: 'Lighthouse',
		});
		const body = calls[0]?.body as Record<string, unknown>;
		expect(body.idempotency_key).toMatch(/^[0-9a-f-]{36}$/);
		expect(body.asset_upload).toEqual({
			type: 'upload',
			asset_name: 'Lighthouse',
		});
	});

	it('sends autofill update_design without a title', async () => {
		reply(job());
		await api.autofills.create(ctx, {
			type: 'update_design',
			design_id: 'D1',
			title: 'ignored',
			data: { headline: { type: 'text', text: 'Hello' } },
		});
		expect(calls[0]?.body).toEqual({
			type: 'update_design',
			design_id: 'D1',
			data: { headline: { type: 'text', text: 'Hello' } },
		});
	});

	it('keeps the old brand-template autofill call working', async () => {
		reply(job());
		await api.autofills.create(ctx, {
			brand_template_id: 'BT1',
			data: { name: { type: 'text', text: 'Ada' } },
		});
		expect(calls[0]?.body).toEqual({
			type: 'create_from_brand_template',
			brand_template_id: 'BT1',
			data: { name: { type: 'text', text: 'Ada' } },
		});
	});

	it('requires a title to merge into a new design', async () => {
		await expect(
			api.merges.create(ctx, {
				type: 'create_new_design',
				operations: [
					{ type: 'insert_pages', source: { type: 'design', design_id: 'D1' } },
				],
			}),
		).rejects.toThrow('title is required');
	});

	it('imports an image as a design', async () => {
		reply(job());
		await api.imports.createFromImage(ctx, { asset_id: 'A1', title: 'Flyer' });
		expect(calls[0]).toMatchObject({
			method: 'POST',
			body: { image: { asset_id: 'A1' }, title: 'Flyer' },
		});
		expect(calls[0]?.url).toMatch(/\/v1\/image-to-design-imports$/);
	});

	it('uploads an asset from a file input', async () => {
		reply(job());
		await api.assetUploads.create(ctx, {
			name: 'Logo',
			file: { base64: Buffer.from('png-bytes').toString('base64') },
		});
		const sent = calls[0];
		expect(sent?.method).toBe('POST');
		expect(sent?.headers.get('Asset-Upload-Metadata')).toBe(
			JSON.stringify({ name_base64: Buffer.from('Logo').toString('base64') }),
		);
		expect(
			Buffer.from(await (sent?.body as Blob).arrayBuffer()).toString(),
		).toBe('png-bytes');
	});

	it('refuses an upload with both file and contentBase64', async () => {
		await expect(
			api.assetUploads.create(ctx, {
				name: 'Logo',
				file: { base64: 'cG5n' },
				contentBase64: 'cG5n',
			}),
		).rejects.toThrow('exactly one');
	});

	it('publishes a brand template', async () => {
		reply({ brand_template: { id: 'BT9', title: 'Q4' } });
		const result = await api.brandTemplates.publish(ctx, { design_id: 'D1' });
		expect(calls[0]).toMatchObject({
			method: 'POST',
			body: { design_id: 'D1' },
		});
		expect(result.brand_template.id).toBe('BT9');
	});

	it('reads the webhook signing keys and app keys', async () => {
		reply({ keys: [] });
		await api.keys.list(ctx, {});
		await api.apps.getJwks(ctx, { appId: 'AAF1' });
		expect(calls.map((c) => new URL(c.url).pathname)).toEqual([
			'/rest/v1/connect/keys',
			'/rest/v1/apps/AAF1/jwks',
		]);
		// Canva answers 500 to the public JWKS route when a token is sent.
		expect(calls[0]?.headers.get('authorization')).toBe('Bearer test-token');
		expect(calls[1]?.headers.get('authorization')).toBeNull();
	});

	it("lets core's ApiError through with Canva's reason on its body", async () => {
		replyStatus = 403;
		const reason = {
			code: 'permission_denied',
			message:
				'Not allowed to access getDesignAnalytics, requires one of capabilities [analytics].',
		};
		reply(reason);
		const error = await api.analytics
			.get(ctx, { designId: 'D1' })
			.catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 403, body: reason });
	});

	it('still deletes assets the old way', async () => {
		reply({});
		await expect(Assets.delete(ctx, { assetId: 'A1' })).resolves.toEqual({
			success: true,
		});
	});
});

describe('exports.download', () => {
	const pngBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 1, 2, 3]);

	function fakeDownloads(seen: string[]) {
		exportDownloadDeps.current = {
			resolve: async () => ['93.184.216.34'],
			transport: async (url: URL): Promise<TransportResponse> => {
				seen.push(url.toString());
				return {
					status: 200,
					headers: { 'content-type': 'image/png' },
					body: (async function* () {
						yield pngBytes;
					})(),
				};
			},
		};
	}

	it('downloads the page asked for, without the Canva token', async () => {
		const seen: string[] = [];
		fakeDownloads(seen);
		reply(
			job({
				status: 'success',
				urls: [
					'https://export-download.canva.com/a/0001-x.png?sig=1',
					'https://export-download.canva.com/a/0002-x.png?sig=2',
				],
			}),
		);
		const file = await api.exports.download(ctx, { exportId: 'E1', index: 1 });
		expect(seen).toEqual([
			'https://export-download.canva.com/a/0002-x.png?sig=2',
		]);
		expect(calls).toHaveLength(1);
		expect(file).toMatchObject({
			exportId: 'E1',
			index: 1,
			count: 2,
			filename: '0002-x.png',
			contentType: 'image/png',
			byteLength: pngBytes.byteLength,
			contentBase64: Buffer.from(pngBytes).toString('base64'),
		});
	});

	it('says when the export is still running', async () => {
		reply(job());
		await expect(api.exports.download(ctx, { exportId: 'E1' })).rejects.toThrow(
			'still in progress',
		);
	});

	it('names the error of a failed export', async () => {
		reply(
			job({
				status: 'failed',
				error: { code: 'license_required', message: 'Pro element' },
			}),
		);
		await expect(api.exports.download(ctx, { exportId: 'E1' })).rejects.toThrow(
			'license_required',
		);
	});

	it('refuses an index past the last file', async () => {
		reply(
			job({
				status: 'success',
				urls: ['https://export-download.canva.com/a.pdf'],
			}),
		);
		await expect(
			api.exports.download(ctx, { exportId: 'E1', index: 3 }),
		).rejects.toThrow('has 1 file(s)');
	});
});

describe('plugin metadata', () => {
	const meta = plugin.endpointMeta as Record<
		string,
		{
			riskLevel: string;
			job?: { idPath: string; status: { op: string; idArg: string } };
		}
	>;
	const schemas = plugin.endpointSchemas as Record<
		string,
		{ input: { shape?: Record<string, unknown> } }
	>;

	it('describes every operation', () => {
		expect(Object.keys(meta)).toHaveLength(62);
		expect(Object.keys(schemas).sort()).toEqual(Object.keys(meta).sort());
	});

	it('points every job at a real status operation and argument', () => {
		const jobs = Object.entries(meta).filter(([, m]) => m.job);
		expect(jobs.length).toBe(13);
		for (const [, m] of jobs) {
			const statusOp = m.job?.status.op ?? '';
			expect(meta[statusOp]).toBeDefined();
			const input = CanvaEndpointInputSchemas[
				statusOp.replace(/\.(\w)/, (_, c: string) =>
					c.toUpperCase(),
				) as keyof typeof CanvaEndpointInputSchemas
			] as unknown as { shape: Record<string, unknown> };
			expect(Object.keys(input.shape)).toContain(m.job?.status.idArg);
			expect(m.job?.idPath).toBe('job.id');
		}
	});

	it('signs in with PKCE, as Canva requires', () => {
		expect(plugin.oauthConfig).toMatchObject({
			pkce: true,
			tokenAuthMethod: 'basic',
			authParams: { code_challenge_method: 's256' },
		});
	});

	it('keeps exporting a read', () => {
		expect(meta['exports.create']?.riskLevel).toBe('read');
		expect(meta['exports.download']?.riskLevel).toBe('read');
	});
});

describe('every operation', () => {
	const J = job();
	const ok = { success: true };
	// [operation, input, method, path, reply]
	const cases: [string, Record<string, unknown>, string, string, unknown][] = [
		[
			'users.getMe',
			{},
			'GET',
			'/v1/users/me',
			{ team_user: { user_id: 'U', team_id: 'T' } },
		],
		[
			'users.getProfile',
			{},
			'GET',
			'/v1/users/me/profile',
			{ profile: { display_name: 'P' } },
		],
		[
			'users.getCapabilities',
			{},
			'GET',
			'/v1/users/me/capabilities',
			{ capabilities: ['resize'] },
		],
		[
			'designs.list',
			{ query: 'deck', limit: 5 },
			'GET',
			'/v1/designs',
			{ items: [design()] },
		],
		[
			'designs.get',
			{ designId: 'D1' },
			'GET',
			'/v1/designs/D1',
			{ design: design() },
		],
		[
			'designs.create',
			{ design_type: { type: 'preset', name: 'doc' } },
			'POST',
			'/v1/designs',
			{ design: design() },
		],
		[
			'designs.getPages',
			{ designId: 'D1', limit: 2 },
			'GET',
			'/v1/designs/D1/pages',
			{ items: [{ page_number: 1 }] },
		],
		[
			'designs.getExportFormats',
			{ designId: 'D1' },
			'GET',
			'/v1/designs/D1/export-formats',
			{ formats: { pdf: {} } },
		],
		[
			'designs.getDataset',
			{ designId: 'D1' },
			'GET',
			'/v1/designs/D1/dataset',
			{ dataset: { title: { type: 'text' } } },
		],
		[
			'analytics.get',
			{ designId: 'D1' },
			'GET',
			'/v1/designs/D1/analytics',
			{ total_view_count: 3, unique_view_count: 2 },
		],
		[
			'analytics.listViewers',
			{ designId: 'D1' },
			'GET',
			'/v1/designs/D1/analytics/viewers',
			{ items: [] },
		],
		[
			'analytics.listViewsOverTime',
			{ designId: 'D1' },
			'GET',
			'/v1/designs/D1/analytics/views-over-time',
			{ items: [{ count: 1, bucket_start_at: 0 }] },
		],
		[
			'analytics.listPageViews',
			{ designId: 'D1', page_ids: ['P1'] },
			'POST',
			'/v1/designs/D1/analytics/page-views',
			{ items: [] },
		],
		[
			'analytics.listLinks',
			{ designId: 'D1' },
			'GET',
			'/v1/designs/D1/analytics/links',
			{ items: [] },
		],
		['assets.get', { assetId: 'A1' }, 'GET', '/v1/assets/A1', { asset }],
		[
			'assets.update',
			{ assetId: 'A1', name: 'n' },
			'PATCH',
			'/v1/assets/A1',
			{ asset },
		],
		['assets.delete', { assetId: 'A1' }, 'DELETE', '/v1/assets/A1', {}],
		[
			'folders.create',
			{ name: 'f', parent_folder_id: 'root' },
			'POST',
			'/v1/folders',
			{ folder },
		],
		['folders.get', { folderId: 'F1' }, 'GET', '/v1/folders/F1', { folder }],
		[
			'folders.update',
			{ folderId: 'F1', name: 'g' },
			'PATCH',
			'/v1/folders/F1',
			{ folder },
		],
		['folders.delete', { folderId: 'F1' }, 'DELETE', '/v1/folders/F1', {}],
		[
			'folders.listItems',
			{ folderId: 'F1' },
			'GET',
			'/v1/folders/F1/items',
			{ items: [{ type: 'folder', folder }] },
		],
		[
			'folders.moveItem',
			{ to_folder_id: 'F1', item_id: 'D1' },
			'POST',
			'/v1/folders/move',
			{},
		],
		[
			'exports.create',
			{ design_id: 'D1', format: { type: 'pdf' } },
			'POST',
			'/v1/exports',
			J,
		],
		['exports.get', { exportId: 'E1' }, 'GET', '/v1/exports/E1', J],
		[
			'brandTemplates.list',
			{},
			'GET',
			'/v1/brand-templates',
			{ items: [{ id: 'B1' }] },
		],
		[
			'brandTemplates.get',
			{ brandTemplateId: 'B1' },
			'GET',
			'/v1/brand-templates/B1',
			{ brand_template: { id: 'B1' } },
		],
		[
			'brandTemplates.getDataset',
			{ brandTemplateId: 'B1' },
			'GET',
			'/v1/brand-templates/B1/dataset',
			{},
		],
		[
			'brandTemplates.publish',
			{ design_id: 'D1' },
			'POST',
			'/v1/brand-templates',
			{ brand_template: { id: 'B1' } },
		],
		[
			'assetUploads.create',
			{ name: 'n', contentBase64: 'aGk=' },
			'POST',
			'/v1/asset-uploads',
			J,
		],
		['assetUploads.get', { jobId: 'J1' }, 'GET', '/v1/asset-uploads/J1', J],
		[
			'assetUploads.createFromUrl',
			{ name: 'n', url: 'https://files.test/a.png' },
			'POST',
			'/v1/url-asset-uploads',
			J,
		],
		[
			'assetUploads.getFromUrl',
			{ jobId: 'J1' },
			'GET',
			'/v1/url-asset-uploads/J1',
			J,
		],
		[
			'imports.create',
			{ title: 't', contentBase64: 'aGk=' },
			'POST',
			'/v1/imports',
			J,
		],
		['imports.get', { jobId: 'J1' }, 'GET', '/v1/imports/J1', J],
		[
			'imports.createFromUrl',
			{ title: 't', url: 'https://files.test/a.pdf' },
			'POST',
			'/v1/url-imports',
			J,
		],
		['imports.getFromUrl', { jobId: 'J1' }, 'GET', '/v1/url-imports/J1', J],
		[
			'imports.createFromImage',
			{ asset_id: 'A1' },
			'POST',
			'/v1/image-to-design-imports',
			J,
		],
		[
			'imports.getFromImage',
			{ jobId: 'J1' },
			'GET',
			'/v1/image-to-design-imports/J1',
			J,
		],
		[
			'resizes.create',
			{
				design_id: 'D1',
				design_type: { type: 'custom', width: 100, height: 100 },
			},
			'POST',
			'/v1/resizes',
			J,
		],
		['resizes.get', { jobId: 'J1' }, 'GET', '/v1/resizes/J1', J],
		[
			'autofills.create',
			{ brand_template_id: 'B1', data: { t: { type: 'text', text: 'x' } } },
			'POST',
			'/v1/autofills',
			J,
		],
		['autofills.get', { jobId: 'J1' }, 'GET', '/v1/autofills/J1', J],
		[
			'generations.create',
			{ brief: 'A deck', design_type: 'presentation' },
			'POST',
			'/v1/generations',
			J,
		],
		['generations.get', { jobId: 'J1' }, 'GET', '/v1/generations/J1', J],
		[
			'imageGenerations.create',
			{ prompt: 'a ship' },
			'POST',
			'/v1/image-generations',
			J,
		],
		[
			'imageGenerations.get',
			{ jobId: 'J1' },
			'GET',
			'/v1/image-generations/J1',
			J,
		],
		[
			'imageTransformations.create',
			{ asset_id: 'A1', transformations: [{ type: 'background_removal' }] },
			'POST',
			'/v1/image-transformations',
			J,
		],
		[
			'imageTransformations.get',
			{ jobId: 'J1' },
			'GET',
			'/v1/image-transformations/J1',
			J,
		],
		[
			'merges.create',
			{
				type: 'modify_existing_design',
				design_id: 'D1',
				operations: [{ type: 'delete_pages', page_numbers: [2] }],
			},
			'POST',
			'/v1/merges',
			J,
		],
		['merges.get', { jobId: 'J1' }, 'GET', '/v1/merges/J1', J],
		[
			'printPartner.createDesign',
			{
				design_source: { type: 'partner_product_id', partner_product_id: 'P1' },
			},
			'POST',
			'/v1/print-partner/designs',
			{ design: design() },
		],
		[
			'printPartner.getDesign',
			{ designId: 'D1', bleed: 10 },
			'GET',
			'/v1/print-partner/designs/D1',
			{ design: design() },
		],
		[
			'printPartner.createExport',
			{ design_id: 'D1', format: { type: 'pdf', cmyk: true } },
			'POST',
			'/v1/print-partner/exports',
			J,
		],
		[
			'comments.createThread',
			{ designId: 'D1', message_plaintext: 'hi' },
			'POST',
			'/v1/designs/D1/comments',
			{ thread: { id: 'T1' } },
		],
		[
			'comments.getThread',
			{ designId: 'D1', threadId: 'T1' },
			'GET',
			'/v1/designs/D1/comments/T1',
			{ thread: { id: 'T1' } },
		],
		[
			'comments.createReply',
			{ designId: 'D1', threadId: 'T1', message_plaintext: 'ok' },
			'POST',
			'/v1/designs/D1/comments/T1/replies',
			{ reply: { id: 'R1' } },
		],
		[
			'comments.listReplies',
			{ designId: 'D1', threadId: 'T1' },
			'GET',
			'/v1/designs/D1/comments/T1/replies',
			{ items: [{ id: 'R1' }] },
		],
		[
			'comments.getReply',
			{ designId: 'D1', threadId: 'T1', replyId: 'R1' },
			'GET',
			'/v1/designs/D1/comments/T1/replies/R1',
			{ reply: { id: 'R1' } },
		],
		[
			'keys.list',
			{},
			'GET',
			'/v1/connect/keys',
			{ keys: [{ kid: 'k', kty: 'OKP', crv: 'Ed25519', x: 'x' }] },
		],
		[
			'apps.getJwks',
			{ appId: 'AP1' },
			'GET',
			'/v1/apps/AP1/jwks',
			{ keys: [{ kid: 'k', kty: 'RSA', n: 'n', e: 'AQAB' }] },
		],
	];

	it('covers every operation but exports.download, tested above', () => {
		const covered = new Set(cases.map(([op]) => op));
		const all = Object.keys(plugin.endpointMeta ?? {}).filter(
			(op) => op !== 'exports.download',
		);
		expect(all.filter((op) => !covered.has(op))).toEqual([]);
	});

	it.each(cases)(
		'%s sends %s and returns a checked reply',
		async (op, input, method, path, body) => {
			reply(body);
			const [group, name] = op.split('.') as [string, string];
			// unknown: the table drives 61 operations with different input types.
			const call = (
				api as unknown as Record<
					string,
					Record<string, (c: unknown, i: unknown) => Promise<unknown>>
				>
			)[group]?.[name];
			await expect(call?.(ctx, input)).resolves.toBeDefined();
			expect(calls).toHaveLength(1);
			expect(calls[0]?.method).toBe(method);
			expect(new URL(calls[0]?.url ?? '').pathname).toBe(`/rest${path}`);
		},
	);

	it('refuses an input outside its schema before any request', async () => {
		await expect(
			api.imageTransformations.create(ctx, {
				asset_id: 'A1',
				transformations: [],
			}),
		).rejects.toThrow();
		await expect(api.designs.list(ctx, { limit: 500 })).rejects.toThrow();
		expect(calls).toHaveLength(0);
	});

	it('refuses a reply that does not match its schema', async () => {
		reply({ design: { id: 'D1' } });
		await expect(api.designs.get(ctx, { designId: 'D1' })).rejects.toThrow();
	});

	it('logs ids and options, never customer text, files or URLs', async () => {
		jest.mocked(logEventFromContext).mockClear();
		reply(job());
		await api.assetUploads.create(ctx, {
			name: 'Q3 salaries',
			file: 'data:image/png;base64,aGk=',
		});
		reply(job());
		await api.assetUploads.createFromUrl(ctx, {
			name: 'n',
			url: 'https://files.test/acme/payroll.png?X-Amz-Signature=secret',
		});
		reply(job());
		await api.imports.createFromImage(ctx, {
			asset_id: 'A1',
			title: 'Acme board deck',
		});
		reply({ thread: { id: 'T1' } });
		await api.comments.createThread(ctx, {
			designId: 'D1',
			message_plaintext: 'Move the launch to May',
		});
		const payloads = jest
			.mocked(logEventFromContext)
			.mock.calls.map((c) => c[2]);
		const logged = JSON.stringify(payloads);
		for (const leak of [
			'Q3 salaries',
			'aGk=',
			'acme',
			'Signature',
			'Acme board deck',
			'May',
		]) {
			expect(logged).not.toContain(leak);
		}
		expect(payloads).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ file: '[file]', name: '[omitted]' }),
				expect.objectContaining({ url: '[url]' }),
				expect.objectContaining({ asset_id: 'A1', title: '[omitted]' }),
				expect.objectContaining({
					designId: 'D1',
					message_plaintext: '[omitted]',
				}),
			]),
		);
		// Canva itself still gets the real values.
		expect(calls[1]?.body).toMatchObject({
			url: 'https://files.test/acme/payroll.png?X-Amz-Signature=secret',
		});
		expect(calls[2]?.body).toMatchObject({ title: 'Acme board deck' });
		expect(calls[3]?.body).toMatchObject({
			message_plaintext: 'Move the launch to May',
		});
	});

	it("follows Canva's documented shapes", () => {
		expect(
			CanvaEndpointOutputSchemas.brandTemplatesPublish.parse({
				brand_template: { id: 'B1', thumbnail: null },
			}).brand_template.thumbnail,
		).toBeNull();
		const resize = (width: number, height: number) =>
			CanvaEndpointInputSchemas.resizesCreate.safeParse({
				design_id: 'D1',
				design_type: { type: 'custom', width, height },
			}).success;
		expect(resize(8000, 3125)).toBe(true);
		expect(resize(8000, 3126)).toBe(false);
		expect(
			CanvaEndpointOutputSchemas.analyticsListViewers.parse({
				items: [],
				next_field: 1,
			}),
		).toEqual({ items: [], next_field: 1 });
		const fill = (rows: unknown[]) =>
			CanvaEndpointInputSchemas.autofillsCreate.safeParse({
				brand_template_id: 'B1',
				data: { chart: { type: 'chart', chart_data: { rows } } },
			}).success;
		expect(fill([{}])).toBe(false);
		expect(
			fill([
				{
					cells: [
						{ type: 'string', value: 'EU' },
						{ type: 'number', value: 3 },
					],
				},
			]),
		).toBe(true);
	});

	it("checks autofill tables the way Canva's autofill does", () => {
		const fill = (field: Record<string, unknown>) =>
			CanvaEndpointInputSchemas.autofillsCreate.safeParse({
				brand_template_id: 'B1',
				data: { table: field },
			}).success;
		const chart = (chart_data: unknown) => fill({ type: 'chart', chart_data });
		const sheet = (sheet_data: unknown) => fill({ type: 'sheet', sheet_data });
		const cells = (n: number) =>
			Array.from({ length: n }, (_, i) => ({ type: 'number', value: i }));
		expect(chart({ rows: [{ cells: cells(2) }, { cells: cells(2) }] })).toBe(
			true,
		);
		expect(chart({ rows: [{ cells: cells(1) }, { cells: cells(2) }] })).toBe(
			false,
		);
		expect(
			chart({
				column_configs: [{ type: 'number' }],
				rows: [{ cells: cells(2) }],
			}),
		).toBe(false);
		expect(
			sheet({
				column_configs: [{ type: 'variant' }],
				rows: [
					{ cells: [{ type: 'string', value: 'N/A' }] },
					{ cells: [{ type: 'number', value: 3 }] },
				],
			}),
		).toBe(true);
		expect(
			chart({
				rows: Array.from({ length: 100 }, () => ({ cells: cells(20) })),
			}),
		).toBe(true);
		expect(
			chart({ rows: Array.from({ length: 101 }, () => ({ cells: cells(1) })) }),
		).toBe(false);
		expect(chart({ rows: [{ cells: cells(21) }] })).toBe(false);
		expect(
			sheet({ rows: Array.from({ length: 101 }, () => ({ cells: cells(1) })) }),
		).toBe(true);
		expect(
			chart({
				rows: [
					{
						cells: [
							{ type: 'number', value: 1, metadata: { formatting: '0.00' } },
						],
					},
				],
			}),
		).toBe(false);
		expect(chart({ rows: [{ cells: [{ type: 'media', value: [] }] }] })).toBe(
			false,
		);
		expect(sheet({ rows: [{ cells: [{ type: 'media', value: [] }] }] })).toBe(
			true,
		);
	});

	it('logs an autofill without its title or data', async () => {
		jest.mocked(logEventFromContext).mockClear();
		reply(job());
		await api.autofills.create(ctx, {
			brand_template_id: 'B1',
			title: 'Acme offer letter',
			data: { name: { type: 'text', text: 'Ada Lovelace' } },
		});
		const logged = JSON.stringify(
			jest.mocked(logEventFromContext).mock.calls.map((c) => c[2]),
		);
		expect(logged).not.toContain('Acme offer letter');
		expect(logged).not.toContain('Ada Lovelace');
		expect(logged).toContain('"fields":["name"]');
	});

	it('refuses an empty base64 upload before any request', async () => {
		await expect(
			api.assetUploads.create(ctx, { name: 'n', contentBase64: '' }),
		).rejects.toThrow();
		expect(calls).toHaveLength(0);
	});

	it("fills in a stored design from a job's summary without wiping known fields", async () => {
		const upsertByEntityId = jest.fn(async () => undefined);
		const stored = {
			...ctx,
			db: {
				designs: {
					findByEntityId: async () => ({
						data: { id: 'D9', title: 'Kept', owner_user_id: 'U1' },
					}),
					upsertByEntityId,
				},
			},
		} as unknown as typeof ctx; // unknown: only the designs table matters to this test
		reply(
			job({
				status: 'success',
				result: { design: { id: 'D9', page_count: 4 } },
			}),
		);
		await api.merges.get(stored, { jobId: 'J1' });
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'D9',
			expect.objectContaining({
				id: 'D9',
				title: 'Kept',
				owner_user_id: 'U1',
				page_count: 4,
			}),
		);
	});
});

describe('error handlers', () => {
	const apiError = (status: number, method = 'POST', body: unknown = {}) =>
		new ApiError(
			{ method, url: '/v1/x' } as ConstructorParameters<typeof ApiError>[0],
			{
				url: 'https://api.canva.com/rest/v1/x',
				ok: false,
				status,
				statusText: '',
				body,
			},
			'x',
		);
	const handle = async (error: Error, operation: string) => {
		const entry = Object.values(errorHandlers).find((h) => h.match(error));
		return entry?.handler(error, { operation, pluginId: 'canva' } as never);
	};

	it('leaves 429 retries to core', async () => {
		expect(await handle(apiError(429), 'designs.list')).toMatchObject({
			maxRetries: 0,
		});
	});

	it('retries a 5xx or a network error only for reads', async () => {
		expect(await handle(apiError(502, 'GET'), 'designs.list')).toMatchObject({
			maxRetries: 2,
		});
		expect(await handle(apiError(502), 'designs.create')).toEqual({
			maxRetries: 0,
		});
		expect(await handle(new Error('fetch failed'), 'designs.get')).toEqual({
			maxRetries: 3,
		});
		expect(
			await handle(new Error('fetch failed'), 'assetUploads.create'),
		).toEqual({ maxRetries: 0 });
	});

	it("doesn't retry a refusal, a missing item or a dead token", async () => {
		for (const status of [401, 403, 404]) {
			expect(await handle(apiError(status, 'GET'), 'designs.get')).toEqual({
				maxRetries: 0,
			});
		}
	});
});
