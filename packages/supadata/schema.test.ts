import {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './endpoints/types';

describe('Supadata schemas', () => {
	it('validates transcript input schema', () => {
		const valid = SupadataEndpointInputSchemas.transcriptGet.parse({
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
			lang: 'en',
			mode: 'auto',
		});
		expect(valid.url).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
	});

	it('validates transcript direct output schema', () => {
		const valid = SupadataEndpointOutputSchemas.transcriptGet.parse({
			lang: 'en',
			availableLangs: ['en'],
			content: [{ text: 'Never gonna give you up', offset: 0, duration: 2000 }],
		});
		expect(valid).toBeDefined();
	});

	it('validates transcript job output schema', () => {
		const valid = SupadataEndpointOutputSchemas.transcriptGet.parse({
			jobId: 'job_12345',
			status: 'queued',
		});
		expect('jobId' in valid).toBe(true);
	});

	it('validates transcript job status input & output schema', () => {
		const validInput = SupadataEndpointInputSchemas.transcriptGetJob.parse({
			jobId: 'job_12345',
		});
		expect(validInput.jobId).toBe('job_12345');

		const validOutput = SupadataEndpointOutputSchemas.transcriptGetJob.parse({
			jobId: 'job_12345',
			status: 'completed',
			result: {
				lang: 'en',
				content: 'Full text transcript',
			},
		});
		expect(validOutput.status).toBe('completed');

		// 'active' is a valid in-progress status per the Supadata API
		const validActive = SupadataEndpointOutputSchemas.transcriptGetJob.parse({
			jobId: 'job_12345',
			status: 'active',
		});
		expect(validActive.status).toBe('active');
	});

	it('validates metadata input & output schema with string or object author', () => {
		const validInput = SupadataEndpointInputSchemas.metadataGet.parse({
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		});
		expect(validInput.url).toBeDefined();

		const validStringAuthor = SupadataEndpointOutputSchemas.metadataGet.parse({
			id: 'dQw4w9WgXcQ',
			title: 'Rick Astley - Never Gonna Give You Up',
			author: 'Rick Astley',
			viewsCount: 1000000,
		});
		expect(validStringAuthor.author).toBe('Rick Astley');

		const validObjectAuthor = SupadataEndpointOutputSchemas.metadataGet.parse({
			id: 'dQw4w9WgXcQ',
			type: 'video',
			title: 'Rick Astley - Never Gonna Give You Up',
			author: {
				name: 'Rick Astley',
				username: 'RickAstleyVEVO',
			},
			createdAt: '2021-01-01T00:00:00Z',
			viewsCount: 1000000,
			stats: {
				views: 1000000,
				likes: 50000,
			},
			media: {
				thumbnail: 'https://example.com/thumb.jpg',
				images: ['https://example.com/img.jpg'],
			},
			tags: ['music', 'pop'],
			additionalData: { customField: 'value' },
		});
		expect(typeof validObjectAuthor.author).toBe('object');
		expect(validObjectAuthor.type).toBe('video');
		expect(validObjectAuthor.stats?.views).toBe(1000000);
		expect(validObjectAuthor.tags).toContain('music');
	});

	it('validates web scrape input & output schema', () => {
		const validInput = SupadataEndpointInputSchemas.webScrape.parse({
			url: 'https://example.com',
			noLinks: true,
			lang: 'en',
		});
		expect(validInput.noLinks).toBe(true);
		expect(validInput.lang).toBe('en');

		// Full response shape with all documented fields
		const validOutput = SupadataEndpointOutputSchemas.webScrape.parse({
			url: 'https://example.com',
			name: 'Example Domain',
			description: 'A test page',
			ogUrl: 'https://example.com',
			content: 'Scraped Content',
			markdown: '# Scraped Content',
			countCharacters: 15,
			urls: ['https://example.com/page1'],
		});
		expect(validOutput.content).toBe('Scraped Content');
		expect(validOutput.countCharacters).toBe(15);
		expect(validOutput.urls).toHaveLength(1);
	});

	it('validates web map input & output schema', () => {
		const validInput = SupadataEndpointInputSchemas.webMap.parse({
			url: 'https://example.com',
			limit: 10,
		});
		expect(validInput.limit).toBe(10);

		const validOutput = SupadataEndpointOutputSchemas.webMap.parse({
			url: 'https://example.com',
			links: ['https://example.com/about', 'https://example.com/contact'],
		});
		expect(validOutput.links).toHaveLength(2);
	});

	it('validates youtube search input & output schema', () => {
		// Basic input
		const validInput = SupadataEndpointInputSchemas.youtubeSearch.parse({
			query: 'Rick Astley',
			type: 'video',
		});
		expect(validInput.query).toBe('Rick Astley');

		// Extended input with all new parameters
		const extendedInput = SupadataEndpointInputSchemas.youtubeSearch.parse({
			query: 'programming tutorials',
			type: 'video',
			uploadDate: 'month',
			sortBy: 'views',
			duration: 'long',
			features: ['hd', 'subtitles'],
			limit: 20,
			nextPageToken: 'EgIQAQ==',
		});
		expect(extendedInput.sortBy).toBe('views');
		expect(extendedInput.features).toEqual(['hd', 'subtitles']);
		expect(extendedInput.uploadDate).toBe('month');

		// Output with nested channel and totalResults
		const validOutput = SupadataEndpointOutputSchemas.youtubeSearch.parse({
			query: 'Rick Astley',
			totalResults: 1000,
			nextPageToken: 'EgIQAQ==',
			results: [
				{
					type: 'video',
					id: 'dQw4w9WgXcQ',
					title: 'Rick Astley - Never Gonna Give You Up',
					viewsCount: 1500000000,
					uploadDate: '2009-10-25',
					channel: {
						id: 'UCuAXFkgsw1L7xaCfnd5JJOw',
						name: 'Rick Astley',
					},
				},
			],
		});
		expect(validOutput.results).toHaveLength(1);
		expect(validOutput.totalResults).toBe(1000);
		expect(validOutput.results[0]?.uploadDate).toBe('2009-10-25');
	});
});
