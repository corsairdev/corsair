import { Collections, Fonts, Media, Templates } from './endpoints';
import {
	collection,
	collectionList,
	font,
	fontList,
	mediaUploaded,
	template,
	templateList,
} from './test-fixtures';

let fetchMock: jest.SpyInstance;

// unknown: a stand-in for the real plugin context, which would need a database,
// a KEK and an issued DEK. Only `key` and `hooks` are read here.
type Context = Parameters<typeof Templates.list>[0];

function contextFor(key = 'placid-test-key'): Context {
	return {
		key,
		hooks: {},
		options: {},
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
		// First call fetches the file, second posts it to Placid.
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1, 2, 3]), {
				status: 200,
				headers: { 'Content-Type': 'image/jpeg' },
			}),
		);
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
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1]), {
				status: 200,
				headers: { 'Content-Type': 'image/png' },
			}),
		);
		respond(mediaUploaded);

		await Media.upload(contextFor(), {
			file_url: 'https://example.com/avatar.png',
			file_key: 'avatar',
		});

		const form = lastCall()[1].body as FormData;
		expect(form.get('avatar')).toBeInstanceOf(File);
	});

	it('fails clearly when the file is not reachable', async () => {
		fetchMock.mockResolvedValueOnce(new Response('nope', { status: 403 }));

		await expect(
			Media.upload(contextFor(), {
				file_url: 'https://example.com/private.jpg',
			}),
		).rejects.toThrow(/publicly reachable/);
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

	it('uploads a font with the required terms acceptance', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1, 2]), {
				status: 200,
				headers: { 'Content-Type': 'font/ttf' },
			}),
		);
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
