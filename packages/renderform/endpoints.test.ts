import { logEventFromContext } from 'corsair/core';
import { Organization, Render, Templates } from './endpoints';
import {
	FONTS,
	INCORRECT_KEY,
	PDF,
	RENDER_PENDING,
	RENDERED,
	RENDERED_CACHED,
	RESULT_DONE,
	RESULT_PENDING,
	RESULT_VIDEO_DONE,
	RESULTS,
	SCREENSHOT,
	TEMPLATE,
	TEMPLATE_CONTENT,
	TEMPLATES,
	USAGE,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('render', () => {
	it('renders a template with merge data', async () => {
		respond(fetchMock, RENDERED);

		const result = (await invoke(Render.render, {
			template: 'template_1234',
			data: { 'my-text.text': 'John' },
		})) as { requestId?: string; href?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v2/render');
		expect(request.method).toBe('POST');
		expect(request.bodyRecord).toMatchObject({
			template: 'template_1234',
			data: { 'my-text.text': 'John' },
		});
		expect(result.href).toBe('https://cdn.renderform.io/my-image.jpg');
	});

	it('keeps a cached answer distinct, since it costs no credits', async () => {
		respond(fetchMock, RENDERED_CACHED);

		const result = (await invoke(Render.render, {
			template: 't1',
		})) as { cached?: boolean };

		expect(result.cached).toBe(true);
	});

	it('keeps status pending for an asynchronous video render', async () => {
		respond(fetchMock, RENDER_PENDING, 202);

		const result = (await invoke(Render.render, {
			template: 't1',
			outputFormat: 'mp4',
		})) as { status?: string; href?: string };

		// href is not usable yet; the caller must poll results.get.
		expect(result.status).toBe('pending');
		expect(result.href).toBeDefined();
	});

	it('sends the cache flag, version and webhook', async () => {
		respond(fetchMock, RENDERED);

		await invoke(Render.render, {
			template: 't1',
			cache: false,
			version: 'my-cache-key',
			webhookUrl: 'https://my-webhook.com',
			fileName: 'my-file-name',
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			cache: false,
			version: 'my-cache-key',
			webhookUrl: 'https://my-webhook.com',
			fileName: 'my-file-name',
		});
	});

	it('sends fps as a string, the way the spec types it', async () => {
		respond(fetchMock, RENDER_PENDING, 202);

		await invoke(Render.render, {
			template: 't1',
			outputFormat: 'mp4',
			duration: 5000,
			fps: '30',
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			duration: 5000,
			fps: '30',
		});
	});

	it('rejects a waitTime over the documented 5000ms', async () => {
		await expect(
			invoke(Render.render, { template: 't1', waitTime: 5001 }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a video duration outside 1000-30000', async () => {
		await expect(
			invoke(Render.render, { template: 't1', duration: 500 }),
		).rejects.toThrow();
	});

	it('rejects an fps the spec does not allow', async () => {
		await expect(
			invoke(Render.render, { template: 't1', fps: '60' }),
		).rejects.toThrow();
	});

	it('rejects a render with no template', async () => {
		await expect(invoke(Render.render, {})).rejects.toThrow();
	});

	it('logs the request ID and whether it was cached, never the data', async () => {
		respond(fetchMock, RENDERED_CACHED);

		await invoke(Render.render, {
			template: 't1',
			data: { 'my-text.text': 'a secret name' },
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'renderform.render',
			{
				template: 't1',
				requestId: 'req-dc95beb3-8c56-40e9-b428-e6b4c68354a3',
				status: 'done',
				cached: true,
			},
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('a secret name');
	});

	it('surfaces a bad key, which arrives as a 400', async () => {
		respond(fetchMock, INCORRECT_KEY, 400);

		await expect(invoke(Render.render, { template: 't1' })).rejects.toThrow(
			'Incorrect API Key',
		);
	});
});

describe('results.list', () => {
	it('reads the Spring page, whose rows are in content', async () => {
		respond(fetchMock, RESULTS);

		const result = (await invoke(Render.results, {})) as {
			content?: { identifier?: string }[];
			totalElements?: number;
		};

		expect(lastRequest(fetchMock).path).toBe('/api/v2/results');
		expect(result.content).toHaveLength(1);
		expect(result.totalElements).toBe(1);
	});

	it('passes the template and batch filters', async () => {
		respond(fetchMock, RESULTS);

		await invoke(Render.results, { template: 'template_1234', batch: 'may' });

		expect(lastRequest(fetchMock).query).toMatchObject({
			template: 'template_1234',
			batch: 'may',
		});
	});

	it('passes the paging', async () => {
		respond(fetchMock, RESULTS);

		await invoke(Render.results, { page: 2, size: 50 });

		expect(lastRequest(fetchMock).query).toMatchObject({
			page: '2',
			size: '50',
		});
	});
});

describe('results.get', () => {
	it('reads a done result', async () => {
		respond(fetchMock, RESULT_DONE);

		const result = (await invoke(Render.result, {
			identifier: 'req-1',
		})) as { status?: string; type?: string };

		expect(lastRequest(fetchMock).path).toBe('/api/v2/results/req-1');
		expect(result.status).toBe('done');
		expect(result.type).toBe('image');
	});

	it('reports a video still pending', async () => {
		respond(fetchMock, RESULT_PENDING);

		const result = (await invoke(Render.result, { identifier: 'req-1' })) as {
			status?: string;
			href?: string | null;
		};

		expect(result.status).toBe('pending');
		// No file yet, which is what the status means.
		expect(result.href).toBeNull();
	});

	it('keeps a video poster frame', async () => {
		respond(fetchMock, RESULT_VIDEO_DONE);

		const result = (await invoke(Render.result, { identifier: 'req-1' })) as {
			thumbnailHref?: string;
		};

		expect(result.thumbnailHref).toContain('.jpg');
	});

	it('logs the status and type', async () => {
		respond(fetchMock, RESULT_DONE);

		await invoke(Render.result, { identifier: 'req-1' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'renderform.results.get',
			{ status: 'done', type: 'image' },
			'completed',
		);
	});
});

describe('results.delete', () => {
	it('deletes by identifier', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Render.deleteResult, { identifier: 'req-1' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/api/v2/results/req-1');
	});
});

describe('screenshot', () => {
	it('captures a URL at a size', async () => {
		respond(fetchMock, SCREENSHOT);

		const result = (await invoke(Render.screenshot, {
			url: 'https://renderform.io',
			width: 1920,
			height: 1080,
			waitTime: 1000,
		})) as { requestId?: string; href?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/screenshots');
		expect(request.bodyRecord).toMatchObject({
			url: 'https://renderform.io',
			width: 1920,
			height: 1080,
		});
		expect(result.href).toContain('.png');
	});

	it('rejects a width below the documented 32', async () => {
		await expect(
			invoke(Render.screenshot, {
				url: 'https://x.com',
				width: 31,
				height: 100,
			}),
		).rejects.toThrow();
	});

	it('rejects a height above the documented 5000', async () => {
		await expect(
			invoke(Render.screenshot, {
				url: 'https://x.com',
				width: 100,
				height: 5001,
			}),
		).rejects.toThrow();
	});
});

describe('pdf', () => {
	it('captures a URL as a PDF in a page format', async () => {
		respond(fetchMock, PDF);

		const result = (await invoke(Render.pdf, {
			url: 'https://renderform.io',
			format: 'A4',
			expires: 3600,
		})) as { href?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/api/v1/pdf');
		expect(request.bodyRecord).toMatchObject({
			format: 'A4',
			expires: 3600,
		});
		expect(result.href).toContain('.pdf');
	});

	it('rejects a page format the spec does not allow', async () => {
		await expect(
			invoke(Render.pdf, { url: 'https://x.com', format: 'A2' }),
		).rejects.toThrow();
	});

	it('rejects an expires over the documented 7 days', async () => {
		await expect(
			invoke(Render.pdf, { url: 'https://x.com', expires: 604801 }),
		).rejects.toThrow();
	});
});

describe('templates.list', () => {
	it('reads the bare array, not a page', async () => {
		respond(fetchMock, TEMPLATES);

		const result = (await invoke(Templates.list, {})) as {
			identifier?: string;
			name?: string;
		}[];

		expect(lastRequest(fetchMock).path).toBe('/api/v2/my-templates');
		expect(Array.isArray(result)).toBe(true);
		expect(result).toHaveLength(2);
		expect(result[0]?.identifier).toBe('template_1234');
	});

	it('passes the name and tag filters', async () => {
		respond(fetchMock, TEMPLATES);

		await invoke(Templates.list, {
			name: 'Instagram',
			tags: ['marketing', 'instagram'],
		});

		const request = lastRequest(fetchMock);
		expect(request.query.name).toBe('Instagram');
		expect(request.queryAll('tags')).toEqual(['marketing', 'instagram']);
	});
});

describe('templates.get', () => {
	it('reads one template with its editor and format', async () => {
		respond(fetchMock, TEMPLATE);

		const result = (await invoke(Templates.get, {
			templateId: 'template_1234',
		})) as { editor?: string; outputFormat?: string; width?: number };

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v2/my-templates/template_1234',
		);
		expect(result.editor).toBe('canvas-editor');
		expect(result.outputFormat).toBe('png');
		expect(result.width).toBe(1080);
	});
});

describe('templates.create', () => {
	it('creates a template with its size and editor', async () => {
		respond(fetchMock, TEMPLATE);

		const result = (await invoke(Templates.create, {
			name: 'Instagram post',
			width: 1080,
			height: 1080,
			editor: 'canvas-editor',
			tags: ['marketing'],
		})) as { identifier?: string };

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.bodyRecord).toMatchObject({
			name: 'Instagram post',
			width: 1080,
			height: 1080,
			editor: 'canvas-editor',
			tags: ['marketing'],
		});
		expect(result.identifier).toBe('template_1234');
	});

	it('carries the video settings for a canvas-html template', async () => {
		respond(fetchMock, TEMPLATE);

		await invoke(Templates.create, {
			name: 'Video',
			width: 1080,
			height: 1080,
			editor: 'canvas-html',
			outputFormat: 'mp4',
			recordDuration: 5000,
			fps: '30',
		});

		expect(lastRequest(fetchMock).bodyRecord).toMatchObject({
			outputFormat: 'mp4',
			recordDuration: 5000,
			fps: '30',
		});
	});

	it('rejects an editor the spec does not allow', async () => {
		await expect(
			invoke(Templates.create, {
				name: 'x',
				width: 100,
				height: 100,
				editor: 'rich-text',
			}),
		).rejects.toThrow();
	});

	it('rejects a create with no size', async () => {
		await expect(
			invoke(Templates.create, { name: 'x', editor: 'canvas-editor' }),
		).rejects.toThrow();
	});
});

describe('templates.update', () => {
	it('patches the metadata and replaces the tags wholesale', async () => {
		respond(fetchMock, TEMPLATE);

		await invoke(Templates.update, {
			templateId: 'template_1234',
			name: 'Renamed',
			tags: ['new-tag'],
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe('/api/v2/my-templates/template_1234');
		expect(request.bodyRecord).toEqual({ name: 'Renamed', tags: ['new-tag'] });
	});

	it('rejects an output format the spec does not allow', async () => {
		await expect(
			invoke(Templates.update, { templateId: 't1', outputFormat: 'gif' }),
		).rejects.toThrow();
	});
});

describe('templates.delete', () => {
	it('deletes by identifier', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await invoke(Templates.remove, { templateId: 'template_1234' });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/api/v2/my-templates/template_1234');
	});
});

describe('template content', () => {
	it('reads the html, css and sample data', async () => {
		respond(fetchMock, TEMPLATE_CONTENT);

		const result = (await invoke(Templates.content, {
			templateId: 'template_1234',
		})) as {
			html?: string;
			// unknown: sample values are whatever JSON the template was previewed with.
			sampleData?: Record<string, unknown>;
		};

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v2/my-templates/template_1234/html-editor',
		);
		expect(result.html).toContain('class="card"');
		// sampleData is what lists the merge fields a render should fill.
		expect(result.sampleData?.['my-text.text']).toBe('John');
	});

	it('replaces the content with a PUT', async () => {
		respond(fetchMock, TEMPLATE_CONTENT);

		await invoke(Templates.updateContent, {
			templateId: 'template_1234',
			html: '<div>new</div>',
			css: '.x{}',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.bodyRecord).toMatchObject({
			html: '<div>new</div>',
			css: '.x{}',
		});
	});

	it('rejects an update with no html, which the spec requires', async () => {
		await expect(
			invoke(Templates.updateContent, { templateId: 't1', css: '.x{}' }),
		).rejects.toThrow();
	});
});

describe('usage', () => {
	it('reads the credits, plan and renewal', async () => {
		respond(fetchMock, USAGE);

		const result = (await invoke(Organization.usage, {})) as {
			credits?: { used?: number; total?: number };
			plan?: { name?: string };
		};

		// Usage is on /api/v1 while templates are on /api/v2, which is the API's own
		// split rather than a mistake here.
		expect(lastRequest(fetchMock).path).toBe('/api/v1/usage');
		expect(result.credits?.used).toBe(120);
		expect(result.credits?.total).toBe(1000);
		expect(result.plan?.name).toBe('Pro');
	});

	it('logs the plan and credits', async () => {
		respond(fetchMock, USAGE);

		await invoke(Organization.usage, {});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'renderform.usage',
			{ plan: 'Pro', creditsUsed: 120, creditsTotal: 1000 },
			'completed',
		);
	});
});

describe('fonts', () => {
	it('lists the fonts with their source', async () => {
		respond(fetchMock, FONTS);

		const result = (await invoke(Organization.fonts, {})) as {
			family?: string;
			source?: string;
			variants?: string[];
		}[];

		expect(lastRequest(fetchMock).path).toBe('/api/v1/fonts');
		expect(result[0]?.family).toBe('Inter');
		expect(result[0]?.source).toBe('GOOGLE');
		expect(result[0]?.variants).toEqual(['regular', '700']);
	});
});
