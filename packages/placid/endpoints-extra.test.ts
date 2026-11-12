import { EventEmitter } from 'node:events';
import { Collections, Fonts, Media, Templates } from './endpoints';
import {
	collection,
	collectionList,
	collectionPageLive,
	font,
	fontList,
	mediaUploaded,
	template,
	templateList,
} from './test-fixtures';

// Uploads resolve the host before connecting, so the lookup is replaced with a
// public address. Without this the suite would need live DNS and fail offline.
jest.mock('node:dns/promises', () => ({
	lookup: jest.fn(async () => [{ address: '93.184.216.34', family: 4 }]),
}));

// The upload transport is node:https rather than fetch, so it is mocked here:
// no socket is opened and the download body is supplied per test.
type FakeDownload = {
	status: number;
	headers: Record<string, string>;
	chunks: Uint8Array[];
};

let nextDownload: FakeDownload;

jest.mock('node:https', () => ({
	// unknown: jest.replace calls this with node's real request signature; only
	// the response callback is used, so the options are left untyped here.
	request: (
		_options: unknown,
		// unknown: node hands this a real IncomingMessage; the fake only needs
		// the shape the assertion reads, so it is left untyped.
		onResponse: (response: unknown) => void,
	) => {
		const request = new EventEmitter() as EventEmitter & { end: () => void };
		request.end = () => {
			const response = Object.assign(
				(async function* () {
					for (const chunk of nextDownload.chunks) yield chunk;
				})(),
				{
					statusCode: nextDownload.status,
					headers: nextDownload.headers,
					// IncomingMessage has destroy(); the download calls it on
					// responses it does not read.
					destroy: () => {},
				},
			);
			// Deliver on the next tick so the listener is attached first.
			setImmediate(() => onResponse(response));
		};
		return request;
	},
}));

function mockDownload(download: Partial<FakeDownload> = {}) {
	nextDownload = {
		status: 200,
		headers: { 'content-type': 'image/jpeg' },
		chunks: [new Uint8Array([1, 2, 3])],
		...download,
	};
}

let fetchMock: jest.SpyInstance;

// unknown: a stand-in for the real plugin context, which would need a database,
// a KEK and an issued DEK. Only `key` and `hooks` are read here.
type Context = Parameters<typeof Templates.list>[0];

function contextFor(key = 'placid-test-key'): Context {
	return {
		key,
		hooks: {},
		options: {},
		// unknown: only `key` and `hooks` are read here; the real context needs
		// a database, a KEK and an issued DEK to build.
	} as unknown as Context;
}

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastCall() {
	return fetchMock.mock.calls[fetchMock.mock.calls.length - 1] as [
		string,
		RequestInit,
	];
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('templates', () => {
	it('lists templates and keeps the paging links', async () => {
		respond(templateList);

		const result = await Templates.list(contextFor(), {
			tag: 'social',
			order_by: 'title-asc',
		});

		expect(result.data).toHaveLength(1);
		expect(result.data[0]?.uuid).toBe('ospo24ysn');
		expect(result.meta?.per_page).toBe(20);
		const [url] = lastCall();
		expect(url).toContain('/templates?');
		expect(url).toContain('tag=social');
		expect(url).toContain('order_by=title-asc');
	});

	it('requests the next page from a whole links.next URL', async () => {
		respond(templateList);

		await Templates.list(contextFor(), {
			cursor: 'https://api.placid.app/api/rest/templates?cursor=abc123',
		});

		const [url] = lastCall();
		// Only the token travels; the URL is not nested inside a query value.
		expect(url).toBe('https://api.placid.app/api/rest/templates?cursor=abc123');
	});

	it('accepts a bare cursor token', async () => {
		respond(templateList);

		await Templates.list(contextFor(), { cursor: 'abc123' });

		expect(lastCall()[0]).toBe(
			'https://api.placid.app/api/rest/templates?cursor=abc123',
		);
	});

	it('omits the cursor on a first page', async () => {
		respond(templateList);

		await Templates.list(contextFor(), {});

		expect(lastCall()[0]).toBe('https://api.placid.app/api/rest/templates');
	});

	it('reads the dynamic layers of a template', async () => {
		respond(template);

		const result = await Templates.get(contextFor(), {
			template_uuid: 'ospo24ysn',
		});

		expect(result.layers?.map((layer) => layer.name)).toEqual([
			'title',
			'img',
			'box',
			'site',
		]);
		expect(lastCall()[0]).toBe(
			'https://api.placid.app/api/rest/templates/ospo24ysn',
		);
	});

	it('creates a template and sends only the fields given', async () => {
		respond(template);

		await Templates.create(contextFor(), {
			title: 'Employee of the month',
			width: 1080,
			height: 1080,
			tags: ['social'],
		});

		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/templates');
		expect(JSON.parse(String(init.body))).toEqual({
			title: 'Employee of the month',
			width: 1080,
			height: 1080,
			tags: ['social'],
		});
	});

	it('duplicates a template through from_template', async () => {
		respond(template);

		await Templates.create(contextFor(), {
			title: 'Copy',
			from_template: 'ospo24ysn',
		});

		expect(JSON.parse(String(lastCall()[1].body)).from_template).toBe(
			'ospo24ysn',
		);
	});

	it('updates the title without sending the uuid in the body', async () => {
		respond(template);

		await Templates.update(contextFor(), {
			template_uuid: 'ospo24ysn',
			title: 'Renamed',
		});

		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/templates/ospo24ysn');
		expect(init.method).toBe('PATCH');
		// A body field with the same name as the path parameter would make the
		// value impossible to change.
		expect(JSON.parse(String(init.body))).toEqual({ title: 'Renamed' });
	});

	it('deletes a template', async () => {
		respond({}, 200);

		await expect(
			Templates.remove(contextFor(), { template_uuid: 'ospo24ysn' }),
		).resolves.toEqual({ success: true, template_uuid: 'ospo24ysn' });
		expect(lastCall()[1].method).toBe('DELETE');
	});

	it('rejects a title over the tag limit before calling', async () => {
		await expect(
			Templates.create(contextFor(), {
				title: 'Too many tags',
				tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('collections', () => {
	it('lists collections with a page size', async () => {
		respond(collectionList);

		const result = await Collections.list(contextFor(), { per_page: 20 });

		expect(result.data[0]?.id).toBe('col_1234');
		expect(lastCall()[0]).toContain('per_page=20');
	});

	it('reads the per_page Placid echoes back as a string', async () => {
		respond(collectionPageLive);

		const result = await Collections.list(contextFor(), { per_page: 1 });

		expect(result.meta?.per_page).toBe(1);
		expect(result.links?.next).toContain('cursor=');
	});

	it('pages collections by cursor', async () => {
		respond(collectionList);

		await Collections.list(contextFor(), {
			cursor: 'https://api.placid.app/api/rest/collections?cursor=xyz',
		});

		expect(lastCall()[0]).toBe(
			'https://api.placid.app/api/rest/collections?cursor=xyz',
		);
	});

	it('creates a collection with its templates', async () => {
		respond(collection);

		await Collections.create(contextFor(), {
			title: 'Acme onboarding',
			template_uuids: ['ospo24ysn', 'jxac36kja'],
		});

		expect(JSON.parse(String(lastCall()[1].body))).toEqual({
			title: 'Acme onboarding',
			template_uuids: ['ospo24ysn', 'jxac36kja'],
		});
	});

	it('adds and removes templates in one update', async () => {
		respond(collection);

		await Collections.update(contextFor(), {
			collection_id: 'col_1234',
			add_template_uuids: ['new_one'],
			remove_template_uuids: ['old_one'],
		});

		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/collections/col_1234');
		expect(JSON.parse(String(init.body))).toEqual({
			add_template_uuids: ['new_one'],
			remove_template_uuids: ['old_one'],
		});
	});

	it('deletes a collection', async () => {
		respondEmpty(204);

		await expect(
			Collections.remove(contextFor(), { collection_id: 'col_1234' }),
		).resolves.toEqual({ success: true, collection_id: 'col_1234' });
	});

	it('reads one collection by id with GET', async () => {
		respond(collection);

		const result = await Collections.get(contextFor(), {
			collection_id: 'col_1234',
		});

		expect(result.id).toBe('col_1234');
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/collections/col_1234');
		expect(init.method).toBe('GET');
	});

	it('rejects more than 500 templates in a collection', async () => {
		await expect(
			Collections.create(contextFor(), {
				title: 'Huge',
				template_uuids: Array.from({ length: 501 }, (_, i) => `t${i}`),
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('media', () => {
	it('downloads the file and forwards it as multipart', async () => {
		mockDownload({ headers: { 'content-type': 'image/jpeg' } });
		respond(mediaUploaded);

		const result = await Media.upload(contextFor(), {
			file_url: 'https://example.com/assets/logo.jpg',
		});

		expect(result.media[0]?.file_id).toContain('storage.placid.app');
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/media');
		const form = init.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect((form.get('file') as File).name).toBe('logo.jpg');
	});

	it('files the upload under a custom key', async () => {
		mockDownload({ headers: { 'content-type': 'image/png' } });
		respond(mediaUploaded);

		await Media.upload(contextFor(), {
			file_url: 'https://example.com/avatar.png',
			file_key: 'avatar',
		});

		const form = lastCall()[1].body as FormData;
		expect(form.get('avatar')).toBeInstanceOf(File);
	});

	it('fails clearly when the file is not reachable', async () => {
		mockDownload({ status: 403, headers: {}, chunks: [] });

		await expect(
			Media.upload(contextFor(), {
				file_url: 'https://example.com/private.jpg',
			}),
		).rejects.toThrow(/publicly reachable/);
	});

	it('refuses the cloud metadata address before any fetch', async () => {
		await expect(
			Media.upload(contextFor(), {
				file_url: 'http://169.254.169.254/latest/meta-data/',
			}),
		).rejects.toThrow(/private or reserved/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a loopback address before any fetch', async () => {
		await expect(
			Media.upload(contextFor(), { file_url: 'http://127.0.0.1/x.jpg' }),
		).rejects.toThrow(/private or reserved/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('fonts', () => {
	it('lists fonts and passes include_legacy through', async () => {
		respond(fontList);

		const result = await Fonts.list(contextFor(), { include_legacy: true });

		expect(result.data[0]?.uuid).toBe('f1abc123def456');
		expect(lastCall()[0]).toContain('include_legacy=1');
	});

	it('omits include_legacy when it is not asked for', async () => {
		respond(fontList);

		await Fonts.list(contextFor(), {});

		expect(lastCall()[0]).toBe('https://api.placid.app/api/rest/fonts');
	});

	it('reads one font by its uuid', async () => {
		respond(font);

		const result = await Fonts.get(contextFor(), {
			uuid: 'f1abc123def456',
		});

		expect(result.uuid).toBe('f1abc123def456');
		expect(result.title).toBe('Helvetica Neue');
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/fonts/f1abc123def456');
		expect(init.method).toBe('GET');
	});

	it('uploads a font with the required terms acceptance', async () => {
		mockDownload({ headers: { 'content-type': 'font/ttf' } });
		respond(font);

		const result = await Fonts.create(contextFor(), {
			file_url: 'https://example.com/HelveticaNeue-Regular.ttf',
			title: 'Helvetica Neue',
			terms_accepted: true,
		});

		expect(result.uuid).toBe('f1abc123def456');
		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/fonts');
		const form = init.body as FormData;
		expect((form.get('file') as File).name).toBe('HelveticaNeue-Regular.ttf');
		expect(form.get('title')).toBe('Helvetica Neue');
		// Placid rejects the upload without a truthy value here.
		expect(form.get('terms_accepted')).toBe('1');
	});

	it('requires terms_accepted before any call', async () => {
		await expect(
			Fonts.create(contextFor(), {
				file_url: 'https://example.com/font.ttf',
			} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('renames a font', async () => {
		respond(font);

		await Fonts.update(contextFor(), {
			uuid: 'f1abc123def456',
			title: 'Helvetica Neue Bold',
		});

		const [url, init] = lastCall();
		expect(url).toBe('https://api.placid.app/api/rest/fonts/f1abc123def456');
		expect(init.method).toBe('PATCH');
		expect(JSON.parse(String(init.body))).toEqual({
			title: 'Helvetica Neue Bold',
		});
	});

	it('passes force when deleting a font that is still in use', async () => {
		respondEmpty(204);

		await Fonts.remove(contextFor(), {
			uuid: 'f1abc123def456',
			force: true,
		});

		expect(lastCall()[0]).toContain('force=1');
	});
});
