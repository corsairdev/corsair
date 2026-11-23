import type { DownloadDeps } from 'corsair/http';
import type { Designs } from './endpoints';
import { Assets, DesignAnalytics } from './endpoints';
import { exportDownloadDeps } from './endpoints/exports';
import { CanvaEndpointInputSchemas } from './endpoints/types';
import { canva } from './index';

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
					status: 200,
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

describe('request shapes', () => {
	it('encodes ids placed in a path', async () => {
		reply({ design: { id: 'x' } });
		await api.designs.getDataset(ctx, { designId: '../exports/abc?x=1' });
		expect(calls[0]?.url).toContain(
			'/v1/designs/..%2Fexports%2Fabc%3Fx%3D1/dataset',
		);
	});

	it('creates a copy of a design', async () => {
		reply({ design: { id: 'D2' } });
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
		reply({ design: { id: 'D2' } });
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

	it('keeps exporting a read', () => {
		expect(meta['exports.create']?.riskLevel).toBe('read');
		expect(meta['exports.download']?.riskLevel).toBe('read');
	});
});
