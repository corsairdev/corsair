import { z } from 'zod';
import { SpotlightrEndpointOutputSchemas } from './endpoints/types';
import {
	accessRecord,
	createdVideoUrl,
	domain,
	group,
	groupList,
	video,
	videoList,
	videoMetrics,
	videosPage,
	viewsPage,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses the metrics body exactly as the API sends it', () => {
		const parsed =
			SpotlightrEndpointOutputSchemas.getVideoMetrics.parse(videoMetrics);
		expect(parsed.loads).toBe(16);
		// Spotlightr spells it "completition"; the schema must not correct it.
		expect(parsed.completitionRate).toBe(0);
		expect(parsed).not.toHaveProperty('completionRate');
	});

	it('parses the paged video list the live API returns', () => {
		const parsed = SpotlightrEndpointOutputSchemas.listVideos.parse(
			videosPage(),
		);
		expect(parsed.videos.data).toHaveLength(2);
		expect(parsed.videos.data[0]?.name).toBe('Product tour');
		expect(parsed.videos.data[0]?.videoGroup).toBe(42);
		expect(parsed.videos.per_page).toBe(1000);
	});

	it('rejects a bare array for the video list, which the API never sends', () => {
		expect(() =>
			SpotlightrEndpointOutputSchemas.listVideos.parse(videoList),
		).toThrow();
	});

	it('parses a video whose id arrived as a string', () => {
		const parsed = SpotlightrEndpointOutputSchemas.listVideos.parse(
			videosPage([{ ...video, id: '1357835' }]),
		);
		expect(parsed.videos.data[0]?.id).toBe('1357835');
	});

	it('parses a project list', () => {
		const parsed = SpotlightrEndpointOutputSchemas.listGroups.parse(groupList);
		expect(parsed[0]?.name).toBe('Marketing');
	});

	it('parses the paged view list with percentWatched and summary', () => {
		const parsed = SpotlightrEndpointOutputSchemas.listViews.parse(viewsPage);
		expect(parsed.data[0]?.percentWatched).toBe(62);
		expect(parsed.data[1]?.percentWatched).toBe(4);
		expect(parsed.summary?.totalTime).toBe(0);
	});

	it('accepts the bare id projects.create returns', () => {
		expect(SpotlightrEndpointOutputSchemas.createGroup.parse(71898)).toBe(
			71898,
		);
	});

	it('parses the top videos list with the same video schema', () => {
		const parsed =
			SpotlightrEndpointOutputSchemas.listTopVideos.parse(videoList);
		expect(parsed).toHaveLength(2);
	});

	it('parses the bare-string domain list the live API returns', () => {
		const parsed = SpotlightrEndpointOutputSchemas.listDomains.parse([
			'corsair-plugin-test.corsair.dev',
		]);
		expect(parsed).toEqual(['corsair-plugin-test.corsair.dev']);
	});

	it('parses a domain list', () => {
		const parsed = SpotlightrEndpointOutputSchemas.listDomains.parse([
			domain,
			{ domain: 'staging.acme.com' },
		]);
		expect(parsed).toHaveLength(2);
	});

	it('accepts the watch URL a create returns as a bare string', () => {
		expect(
			SpotlightrEndpointOutputSchemas.createVideo.parse(createdVideoUrl),
		).toBe(createdVideoUrl);
	});

	it('accepts an object answer for the writes that return one', () => {
		expect(
			SpotlightrEndpointOutputSchemas.createGroup.parse(group),
		).toMatchObject(group);
	});

	it('accepts an array answer, which some writes return', () => {
		expect(
			SpotlightrEndpointOutputSchemas.deleteVideos.parse([{ id: 1 }]),
		).toHaveLength(1);
	});

	it('parses an access record array and a bare object', () => {
		expect(
			SpotlightrEndpointOutputSchemas.getAccess.parse([accessRecord]),
		).toHaveLength(1);
		expect(
			SpotlightrEndpointOutputSchemas.getAccess.parse(accessRecord),
		).toMatchObject({ id: 555 });
	});

	it('parses a search answer that is a bare array', () => {
		expect(
			SpotlightrEndpointOutputSchemas.search.parse([{ id: 1, name: 'x' }]),
		).toHaveLength(1);
	});

	it('parses a search answer that is an object of grouped results', () => {
		const parsed = SpotlightrEndpointOutputSchemas.search.parse({
			videos: [{ id: 1 }],
			total: 1,
		});
		expect(parsed).toMatchObject({ total: 1 });
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a video list that is an object, not an array', () => {
		expect(() =>
			SpotlightrEndpointOutputSchemas.listVideos.parse({ videos: [] }),
		).toThrow(z.ZodError);
	});

	it('rejects metrics with a missing field', () => {
		const { loads, ...withoutLoads } = videoMetrics;
		void loads;
		expect(() =>
			SpotlightrEndpointOutputSchemas.getVideoMetrics.parse(withoutLoads),
		).toThrow(z.ZodError);
	});

	it('rejects metrics whose counts arrived as strings', () => {
		expect(() =>
			SpotlightrEndpointOutputSchemas.getVideoMetrics.parse({
				...videoMetrics,
				loads: '16',
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a write answer that is a boolean', () => {
		expect(() =>
			SpotlightrEndpointOutputSchemas.createVideo.parse(true),
		).toThrow(z.ZodError);
	});

	it('rejects a view list whose element is a string', () => {
		expect(() =>
			SpotlightrEndpointOutputSchemas.listViews.parse(['view']),
		).toThrow(z.ZodError);
	});

	it('rejects a domain list whose element lost its field type', () => {
		expect(() =>
			SpotlightrEndpointOutputSchemas.listDomains.parse([{ domain: 5 }]),
		).toThrow(z.ZodError);
	});
});
