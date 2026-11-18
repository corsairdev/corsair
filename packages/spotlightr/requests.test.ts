import {
	AccessEndpoints,
	AssetsEndpoints,
	DomainsEndpoints,
	ProjectsEndpoints,
	SearchEndpoints,
	StudentsEndpoints,
	VideosEndpoints,
} from './endpoints';
import {
	accessRecord,
	createdVideoUrl,
	domain,
	domainList,
	group,
	groupList,
	video,
	videoList,
	videoMetrics,
	videosPage,
	viewsPage,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: a FormData body or a JSON string, depending on the route.
		body: init.body,
	};
}

function formField(name: string): string | null {
	const body = lastRequest().body;
	return body instanceof FormData ? (body.get(name)?.toString() ?? null) : null;
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.spotlightr.com');
	expect(sent.query.vooKey).toBe('sl-test-key');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('videos', () => {
	it('videos.list GETs api/videos with no filter', async () => {
		respond(videosPage());

		const result = (await invoke(VideosEndpoints.list, {})) as {
			videos: { data: unknown[] };
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/videos',
			method: 'GET',
		});
		expect(result.videos.data).toHaveLength(2);
	});

	it('videos.list sends the numeric videoID, videoGroup and page', async () => {
		respond(videosPage([video]));

		await invoke(VideosEndpoints.list, {
			video_id: 1357835,
			video_group: 42,
			page: 2,
		});

		expect(lastRequest().query).toEqual({
			videoID: '1357835',
			videoGroup: '42',
			page: '2',
			vooKey: 'sl-test-key',
		});
	});

	it('videos.list rejects a base64 watch-URL id, which matches no video', async () => {
		await expect(
			invoke(VideosEndpoints.list, { video_id: 'MTM1NzgzNQ==' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('masks the vooKey the page URLs echo back', async () => {
		respond(
			videosPage(
				[video],
				'https://api.spotlightr.com/api/videos?vooKey=sl-test-key&page=2',
			),
		);

		const result = await invoke(VideosEndpoints.list, {});

		expect(JSON.stringify(result)).not.toContain('sl-test-key');
		expect(JSON.stringify(result)).toContain('vooKey=[REDACTED]&page=2');
	});

	it('videos.create posts a multipart body with the link', async () => {
		respond(createdVideoUrl);

		const result = await invoke(VideosEndpoints.create, {
			name: 'Product tour',
			url: 'https://youtu.be/abc',
			video_group: 42,
			hls: true,
			create: true,
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/createVideo');
		expect(lastRequest().method).toBe('POST');
		expect(formField('name')).toBe('Product tour');
		expect(formField('URL')).toBe('https://youtu.be/abc');
		expect(formField('videoGroup')).toBe('42');
		// The reference documents 1 or 0, not the strings "true"/"false", which
		// is what FormData would otherwise carry.
		expect(formField('hls')).toBe('1');
		expect(formField('create')).toBe('1');
		expect(result).toBe(createdVideoUrl);
	});

	it('videos.create rejects a call with neither url nor file', async () => {
		const error = await captureError(
			invoke(VideosEndpoints.create, { name: 'Product tour' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('videos.create accepts a file instead of a url', async () => {
		respond(createdVideoUrl);
		const file = new Blob(['video bytes'], { type: 'video/mp4' });

		await invoke(VideosEndpoints.create, { name: 'Clip', file });

		expect(lastRequest().body).toBeInstanceOf(FormData);
		expect((lastRequest().body as FormData).get('file')).toBeInstanceOf(Blob);
	});

	it('videos.updateSource GETs api/videoSource with the id and new URL', async () => {
		respond('ok');

		await invoke(VideosEndpoints.updateSource, {
			video_id: '1357835',
			url: 'https://cdn.example.com/new.mp4',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/videoSource',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			id: '1357835',
			URL: 'https://cdn.example.com/new.mp4',
			vooKey: 'sl-test-key',
		});
	});

	it('videos.delete posts the ids as a comma-separated list', async () => {
		respond('ok');

		await invoke(VideosEndpoints.delete, { video_ids: [1234, 5678] });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/deleteVideo');
		expect(lastRequest().method).toBe('POST');
		// A comma-separated IDs field answered an HTML 500 live (11-16); repeated
		// `IDs[]` fields are what the API accepts.
		const body = lastRequest().body as FormData;
		expect(body.getAll('IDs[]')).toEqual(['1234', '5678']);
		expect(body.get('IDs')).toBeNull();
	});

	it('videos.delete rejects an empty id list', async () => {
		const error = await captureError(
			invoke(VideosEndpoints.delete, { video_ids: [] }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('videos.listTop GETs getTopVideos with the window', async () => {
		respond(videoList);

		await invoke(VideosEndpoints.listTop, { days: 7, total: 5 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/getTopVideos',
			method: 'GET',
		});
		expect(lastRequest().query).toEqual({
			days: '7',
			total: '5',
			vooKey: 'sl-test-key',
		});
	});

	it('videos.metrics GETs the documented metrics route', async () => {
		respond(videoMetrics);

		const result = (await invoke(VideosEndpoints.metrics, {
			video_id: '1357835',
		})) as typeof videoMetrics;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/video/metrics');
		expect(lastRequest().query).toEqual({
			videoID: '1357835',
			vooKey: 'sl-test-key',
		});
		expect(result.loads).toBe(16);
		expect(result.completitionRate).toBe(0);
	});

	it('videos.views GETs getViews with the viewer filter', async () => {
		respond(viewsPage);

		const result = (
			(await invoke(VideosEndpoints.views, {
				video_id: '1357835',
				custom_viewer_id: 'jane@acme.com',
				only_watched: true,
				all_views: false,
			})) as { data: unknown[] }
		).data;

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/views/getViews');
		expect(lastRequest().query).toEqual({
			videoID: '1357835',
			customViewerID: 'jane@acme.com',
			onlyWatched: '1',
			allViews: '0',
			vooKey: 'sl-test-key',
		});
		expect(result).toHaveLength(2);
	});

	it('videos.updateSettings POSTs the settings object as JSON', async () => {
		respond('ok');

		await invoke(VideosEndpoints.updateSettings, {
			video_id: '1357835',
			settings: { autoplay: true, volume: 50 },
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/video/updateSettings');
		expect(JSON.parse(String(lastRequest().body))).toEqual({
			id: '1357835',
			settings: { autoplay: true, volume: 50 },
		});
	});
});

describe('projects', () => {
	it('projects.list GETs groups', async () => {
		respond(groupList);

		const result = (await invoke(ProjectsEndpoints.list, {})) as unknown[];

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/groups', method: 'GET' });
		expect(result).toHaveLength(1);
	});

	it('projects.create POSTs the name as a form field', async () => {
		respond(group);

		await invoke(ProjectsEndpoints.create, { name: 'Marketing' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/groups', method: 'POST' });
		expect(formField('name')).toBe('Marketing');
	});
});

describe('domains', () => {
	it('domains.list GETs api/user/domain', async () => {
		respond(domainList);

		expect(await invoke(DomainsEndpoints.list, {})).toHaveLength(1);

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/user/domain',
			method: 'GET',
		});
	});

	it('domains.add POSTs the domain', async () => {
		respond(domain);

		await invoke(DomainsEndpoints.add, { domain: 'acme.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/user/domain',
			method: 'POST',
		});
		expect(formField('domain')).toBe('acme.com');
	});
});

describe('students and access', () => {
	it('students.create POSTs every documented field', async () => {
		respond('ok');

		await invoke(StudentsEndpoints.create, {
			email: 'jane@acme.com',
			password: 'hunter2hunter2',
			course_id: 42,
			never: true,
			unlocks: 3,
			time: 0,
			expires: '0000-00-00',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/spotlight/students');
		expect(formField('email')).toBe('jane@acme.com');
		expect(formField('id')).toBe('42');
		expect(formField('never')).toBe('1');
		expect(formField('unlocks')).toBe('3');
		expect(formField('time')).toBe('0');
		expect(formField('expires')).toBe('0000-00-00');
		// The password must travel but must never be logged.
		expect(formField('password')).toBe('hunter2hunter2');
	});

	it('students.create rejects a date instead of the documented string', async () => {
		const error = await captureError(
			invoke(StudentsEndpoints.create, {
				email: 'jane@acme.com',
				password: 'x',
				course_id: 42,
				never: false,
				unlocks: 0,
				time: 0,
				expires: '2026-13-45',
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('access.get GETs the record with the course id', async () => {
		respond([accessRecord]);

		await invoke(AccessEndpoints.get, {
			email: 'jane@acme.com',
			course_id: 42,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/access', method: 'GET' });
		// The reference names this query parameter "Course ID", with a space.
		expect(lastRequest().query).toEqual({
			email: 'jane@acme.com',
			'Course ID': '42',
			vooKey: 'sl-test-key',
		});
	});

	it('access.update POSTs the expire flag', async () => {
		respond('ok');

		await invoke(AccessEndpoints.update, { access_id: 555, expire: true });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/access', method: 'POST' });
		expect(formField('id')).toBe('555');
		expect(formField('expire')).toBe('1');
	});

	it('access.updateCode POSTs to the spotlight/updateCode path', async () => {
		respond('ok');

		await invoke(AccessEndpoints.updateCode, { code_id: 7, expires: true });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/spotlight/updateCode');
		expect(formField('id')).toBe('7');
		expect(formField('expires')).toBe('1');
	});
});

describe('search and assets', () => {
	it('search.search POSTs the term to search/global', async () => {
		respond([{ id: 1, name: 'Product tour' }]);

		await invoke(SearchEndpoints.search, { query: 'tour' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/search/global',
			method: 'POST',
		});
		expect(JSON.parse(String(lastRequest().body))).toEqual({ query: 'tour' });
	});

	it('assets.upload posts the file as multipart', async () => {
		respond('https://cdn.spotlightr.com/asset.png');
		const file = new Blob(['png bytes'], { type: 'image/png' });

		await invoke(AssetsEndpoints.upload, { file });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/assets', method: 'POST' });
		expect((lastRequest().body as FormData).get('file')).toBeInstanceOf(Blob);
	});

	it('assets.upload rejects a missing file before sending', async () => {
		const error = await captureError(invoke(AssetsEndpoints.upload, {}));

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
