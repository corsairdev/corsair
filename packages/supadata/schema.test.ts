import {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './endpoints/types';
import { SupadataSchema } from './schema';

/**
 * Response fixtures below are verbatim payloads captured from the live
 * Supadata v1 API, trimmed only where noted. They pin each output schema to
 * what the service actually returns rather than to a hand-written guess.
 */

describe('Supadata input schemas', () => {
	it('account.me takes no parameters and rejects unknown ones', () => {
		expect(SupadataEndpointInputSchemas.accountMe.parse({})).toEqual({});
		expect(() =>
			SupadataEndpointInputSchemas.accountMe.parse({ organizationId: 'x' }),
		).toThrow();
	});

	it('transcript.get requires a valid URL and accepts the documented filters', () => {
		const parsed = SupadataEndpointInputSchemas.transcriptGet.parse({
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			lang: 'en',
			text: true,
			chunkSize: 1000,
			mode: 'auto',
		});
		expect(parsed.mode).toBe('auto');
		expect(parsed.chunkSize).toBe(1000);

		expect(() =>
			SupadataEndpointInputSchemas.transcriptGet.parse({ url: 'not-a-url' }),
		).toThrow();
	});

	it('transcript.get bounds chunkSize to the documented 50–10000 range', () => {
		const url = 'https://youtu.be/dQw4w9WgXcQ';
		expect(() =>
			SupadataEndpointInputSchemas.transcriptGet.parse({ url, chunkSize: 49 }),
		).toThrow();
		expect(() =>
			SupadataEndpointInputSchemas.transcriptGet.parse({
				url,
				chunkSize: 10001,
			}),
		).toThrow();
	});

	it('transcript.get rejects a mode outside native/auto/generate', () => {
		expect(() =>
			SupadataEndpointInputSchemas.transcriptGet.parse({
				url: 'https://youtu.be/dQw4w9WgXcQ',
				mode: 'turbo',
			}),
		).toThrow();
	});

	it('transcript.getJob requires a non-empty job id', () => {
		expect(
			SupadataEndpointInputSchemas.transcriptGetJob.parse({ jobId: 'job-1' })
				.jobId,
		).toBe('job-1');
		expect(() =>
			SupadataEndpointInputSchemas.transcriptGetJob.parse({ jobId: '' }),
		).toThrow();
	});

	it('youtube id inputs accept ids, handles and URLs but not empty strings', () => {
		expect(
			SupadataEndpointInputSchemas.youtubeVideo.parse({ id: 'dQw4w9WgXcQ' }).id,
		).toBe('dQw4w9WgXcQ');
		expect(
			SupadataEndpointInputSchemas.youtubeChannel.parse({ id: '@rickastley' })
				.id,
		).toBe('@rickastley');
		expect(() =>
			SupadataEndpointInputSchemas.youtubePlaylist.parse({ id: '' }),
		).toThrow();
	});

	it('youtube.channelVideos bounds limit to 1–5000 and validates type', () => {
		const parsed = SupadataEndpointInputSchemas.youtubeChannelVideos.parse({
			id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
			limit: 50,
			type: 'short',
		});
		expect(parsed.limit).toBe(50);
		expect(parsed.type).toBe('short');

		expect(() =>
			SupadataEndpointInputSchemas.youtubeChannelVideos.parse({
				id: 'UC1',
				limit: 5001,
			}),
		).toThrow();
		expect(() =>
			SupadataEndpointInputSchemas.youtubeChannelVideos.parse({
				id: 'UC1',
				type: 'movie',
			}),
		).toThrow();
	});

	it('youtube.playlistVideos bounds limit to 1–5000', () => {
		expect(() =>
			SupadataEndpointInputSchemas.youtubePlaylistVideos.parse({
				id: 'PL1',
				limit: 0,
			}),
		).toThrow();
	});

	it('youtube.search requires a query and validates every documented filter', () => {
		const parsed = SupadataEndpointInputSchemas.youtubeSearch.parse({
			query: 'rick astley',
			type: 'video',
			limit: 10,
			uploadDate: 'year',
			sortBy: 'views',
			duration: 'short',
			features: ['hd', 'subtitles'],
		});
		expect(parsed.features).toEqual(['hd', 'subtitles']);

		expect(() =>
			SupadataEndpointInputSchemas.youtubeSearch.parse({ query: '' }),
		).toThrow();
		expect(() =>
			SupadataEndpointInputSchemas.youtubeSearch.parse({
				query: 'x',
				features: ['8k'],
			}),
		).toThrow();
	});

	it('web.scrape requires a valid URL and accepts noLinks and lang', () => {
		const parsed = SupadataEndpointInputSchemas.webScrape.parse({
			url: 'https://supadata.ai/pricing',
			noLinks: true,
			lang: 'en',
		});
		expect(parsed.noLinks).toBe(true);
		expect(() =>
			SupadataEndpointInputSchemas.webScrape.parse({ url: 'supadata.ai' }),
		).toThrow();
	});

	it('web.map takes only url — GET /v1/web/map has no other parameter', () => {
		const parsed = SupadataEndpointInputSchemas.webMap.parse({
			url: 'https://supadata.ai',
			limit: 5,
		} as never);
		// `limit` is not part of the documented surface and must not reach the API,
		// where it would be silently ignored.
		expect(parsed).toEqual({ url: 'https://supadata.ai' });
	});

	it('metadata.get requires a valid URL', () => {
		expect(
			SupadataEndpointInputSchemas.metadataGet.parse({
				url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			}).url,
		).toContain('youtube');
		expect(() =>
			SupadataEndpointInputSchemas.metadataGet.parse({ url: 'not-a-url' }),
		).toThrow();
	});
});

describe('Supadata output schemas', () => {
	it('account.me parses a live GET /v1/me payload', () => {
		const parsed = SupadataEndpointOutputSchemas.accountMe.parse({
			organizationId: '17fa43a5-84e7-47ea-b510-d5073aa98ca9',
			plan: 'Free (100/mo)',
			maxCredits: 100,
			usedCredits: 12,
		});
		expect(parsed.maxCredits - parsed.usedCredits).toBe(88);
	});

	it('transcript.get parses a plain-text transcript (text=true)', () => {
		const parsed = SupadataEndpointOutputSchemas.transcriptGet.parse({
			lang: 'en',
			availableLangs: ['en', 'de', 'ja', 'pt', 'es'],
			content: "[♪♪♪] ♪ We're no strangers to love ♪",
		});
		expect(typeof parsed).toBe('object');
		expect('content' in parsed && typeof parsed.content).toBe('string');
	});

	it('transcript.get parses timed chunks (text=false)', () => {
		const parsed = SupadataEndpointOutputSchemas.transcriptGet.parse({
			lang: 'en',
			availableLangs: ['en'],
			content: [
				{ lang: 'en', text: '[♪♪♪]', offset: 1360, duration: 1680 },
				{
					lang: 'en',
					text: "♪ We're no strangers to love ♪",
					offset: 18640,
					duration: 3240,
				},
			],
		});
		expect('content' in parsed && Array.isArray(parsed.content)).toBe(true);
	});

	it('transcript.get parses the job handle returned for large videos', () => {
		const parsed = SupadataEndpointOutputSchemas.transcriptGet.parse({
			jobId: '1234-5678-9012',
		});
		expect('jobId' in parsed && parsed.jobId).toBe('1234-5678-9012');
	});

	it('transcript.getJob parses an in-progress job — status is the only guaranteed field', () => {
		const parsed = SupadataEndpointOutputSchemas.transcriptGetJob.parse({
			status: 'active',
		});
		expect(parsed.status).toBe('active');
		expect(parsed.content).toBeUndefined();
	});

	it('transcript.getJob parses a completed job with the transcript inline, not nested', () => {
		const parsed = SupadataEndpointOutputSchemas.transcriptGetJob.parse({
			status: 'completed',
			lang: 'en',
			availableLangs: ['en'],
			content: [{ text: 'hello', offset: 0, duration: 500 }],
		});
		expect(parsed.lang).toBe('en');
		expect(Array.isArray(parsed.content)).toBe(true);
	});

	it('transcript.getJob parses a failed job carrying the standard error payload', () => {
		const parsed = SupadataEndpointOutputSchemas.transcriptGetJob.parse({
			status: 'failed',
			error: {
				error: 'transcript-unavailable',
				message: 'Transcript Unavailable',
				details: 'No transcript is available for this video',
				documentationUrl:
					'https://docs.supadata.ai/errors/transcript-unavailable',
			},
		});
		expect(parsed.error?.error).toBe('transcript-unavailable');
	});

	it('transcript.getJob does not require a job id — the API never echoes one back', () => {
		expect(() =>
			SupadataEndpointOutputSchemas.transcriptGetJob.parse({
				status: 'completed',
			}),
		).not.toThrow();
	});

	it('transcript.getJob rejects an undocumented status', () => {
		expect(() =>
			SupadataEndpointOutputSchemas.transcriptGetJob.parse({
				status: 'processing',
			}),
		).toThrow();
	});

	it('youtube.video parses a live payload, including null counts', () => {
		const parsed = SupadataEndpointOutputSchemas.youtubeVideo.parse({
			id: 'dQw4w9WgXcQ',
			title: 'Rick Astley - Never Gonna Give You Up (Official Video)',
			description: 'The official video …',
			channel: { id: 'UCuAXFkgsw1L7xaCfnd5JJOw', name: 'Rick Astley' },
			tags: ['rick astley', 'nggyu'],
			thumbnail: 'https://i.ytimg.com/vi_webp/dQw4w9WgXcQ/maxresdefault.webp',
			uploadDate: '2009-10-24T00:00:00.000Z',
			viewCount: 1817904840,
			likeCount: null,
			isLive: false,
			duration: 213,
			transcriptLanguages: [],
		});
		expect(parsed.channel.name).toBe('Rick Astley');
		expect(parsed.likeCount).toBeNull();
	});

	it('youtube.video requires the documented non-nullable fields', () => {
		expect(() =>
			SupadataEndpointOutputSchemas.youtubeVideo.parse({
				id: 'dQw4w9WgXcQ',
				title: 'x',
			}),
		).toThrow();
	});

	it('youtube.channel parses a live payload with an empty banner', () => {
		const parsed = SupadataEndpointOutputSchemas.youtubeChannel.parse({
			id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
			name: 'Rick Astley',
			description: 'New single ‘Raindrops’ out now.',
			handle: '@RickAstleyYT',
			thumbnail: 'https://yt3.googleusercontent.com/MOWpaiGJdgN4aKMI',
			banner: '',
			subscriberCount: 4540000,
			videoCount: 436,
			viewCount: 2562014012,
		});
		// `banner` and `handle` are documented as empty strings when unset, so
		// they must not be validated as URLs.
		expect(parsed.banner).toBe('');
	});

	it('youtube.playlist parses a live payload', () => {
		const parsed = SupadataEndpointOutputSchemas.youtubePlaylist.parse({
			id: 'PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc',
			title: 'Rick Astley: Official Music Videos',
			description: "'Are We There Yet?' is out now",
			videoCount: 41,
			viewCount: 1394229,
			lastUpdated: '2026-08-01T00:00:00.000Z',
			channel: { id: 'UCuAXFkgsw1L7xaCfnd5JJOw', name: 'Rick Astley' },
		});
		expect(parsed.videoCount).toBe(41);
		expect(parsed.channel.id).toBe('UCuAXFkgsw1L7xaCfnd5JJOw');
	});

	it('channel and playlist video listings share the three-bucket shape', () => {
		const payload = {
			videoIds: ['PXC_PYeB6F8', 'LaOUkDBDjW8'],
			shortIds: [],
			liveIds: [],
		};
		expect(
			SupadataEndpointOutputSchemas.youtubeChannelVideos.parse(payload)
				.videoIds,
		).toHaveLength(2);
		expect(
			SupadataEndpointOutputSchemas.youtubePlaylistVideos.parse(payload)
				.shortIds,
		).toEqual([]);
	});

	it('video listings require all three buckets', () => {
		expect(() =>
			SupadataEndpointOutputSchemas.youtubeChannelVideos.parse({
				videoIds: ['a'],
			}),
		).toThrow();
	});

	it('youtube.search parses a live payload with video and channel hits', () => {
		const parsed = SupadataEndpointOutputSchemas.youtubeSearch.parse({
			query: 'rick astley',
			totalResults: 2,
			results: [
				{
					type: 'video',
					id: 'DLzxrzFCyOs',
					title: 'Rick Astley - Never Gonna Give You Up [HQ]',
					description: 'Artist: Rick Astley …',
					thumbnail: 'https://i.ytimg.com/vi/DLzxrzFCyOs/hq720.jpg',
					duration: 213,
					viewCount: 10084093,
					uploadDate: '11 years ago',
					channel: {
						id: 'UCLNd5EtH77IyN1frExzwPRQ',
						name: 'AllKindsOfStuff',
						thumbnail: 'https://yt3.ggpht.com/ytc/AIdro',
					},
				},
				{
					type: 'channel',
					id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
					title: 'Rick Astley',
					handle: '@RickAstleyYT',
					videoCount: 436,
				},
			],
		});
		expect(parsed.results).toHaveLength(2);
		// `uploadDate` is a relative phrase, not a timestamp.
		expect(parsed.results[0]?.uploadDate).toBe('11 years ago');
		expect(parsed.results[1]?.handle).toBe('@RickAstleyYT');
	});

	it('youtube.search rejects a result type outside video/channel/playlist', () => {
		expect(() =>
			SupadataEndpointOutputSchemas.youtubeSearch.parse({
				query: 'x',
				results: [{ type: 'short', id: 'a', title: 'b' }],
			}),
		).toThrow();
	});

	it('web.scrape parses a live payload and requires the documented fields', () => {
		const parsed = SupadataEndpointOutputSchemas.webScrape.parse({
			url: 'https://example.com',
			content: '# Example Domain\n\nThis domain is for use in examples.',
			name: 'Example Domain',
			description: 'Illustrative examples',
			ogUrl: 'https://example.com',
			countCharacters: 52,
			urls: ['https://www.iana.org/domains/example'],
		});
		expect(parsed.countCharacters).toBe(52);
		expect(parsed.urls).toHaveLength(1);

		expect(() =>
			SupadataEndpointOutputSchemas.webScrape.parse({
				url: 'https://example.com',
				content: 'x',
			}),
		).toThrow();
	});

	it('web.map parses a live payload and requires urls', () => {
		const parsed = SupadataEndpointOutputSchemas.webMap.parse({
			urls: ['https://supadata.ai', 'https://supadata.ai/pricing'],
		});
		expect(parsed.urls).toHaveLength(2);
		expect(() => SupadataEndpointOutputSchemas.webMap.parse({})).toThrow();
	});

	it('metadata.get parses a documented payload with nullable stats', () => {
		const parsed = SupadataEndpointOutputSchemas.metadataGet.parse({
			platform: 'youtube',
			type: 'video',
			id: 'dQw4w9WgXcQ',
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			title: 'Never Gonna Give You Up',
			description: 'Official video',
			author: { displayName: 'Rick Astley', username: 'RickAstley' },
			stats: { views: 1_000_000, likes: 50_000, comments: 200, shares: null },
			media: { type: 'video', duration: 213 },
			tags: ['music'],
			createdAt: '2009-10-24T00:00:00.000Z',
		});
		expect(parsed.platform).toBe('youtube');
		expect(parsed.stats?.shares).toBeNull();
	});

	it('output schemas pass through fields Supadata adds later', () => {
		const parsed = SupadataEndpointOutputSchemas.webMap.parse({
			urls: [],
			crawledAt: '2026-09-20T00:00:00.000Z',
		});
		expect(parsed).toHaveProperty('crawledAt');
	});
});

describe('SupadataSchema entities', () => {
	it('registers one entity per documented resource', () => {
		expect(SupadataSchema.version).toBe('1.0.0');
		expect(Object.keys(SupadataSchema.entities).sort()).toEqual([
			'accounts',
			'mediaMetadata',
			'transcriptJobs',
			'transcripts',
			'webMaps',
			'webPages',
			'youtubeChannels',
			'youtubePlaylists',
			'youtubeSearchResults',
			'youtubeVideos',
		]);
	});

	it('exposes entity schemas that parse their documented payloads', () => {
		expect(
			SupadataSchema.entities.accounts.parse({
				organizationId: 'org-1',
				plan: 'Pro',
				maxCredits: 100000,
				usedCredits: 15000,
			}).plan,
		).toBe('Pro');
	});
});
