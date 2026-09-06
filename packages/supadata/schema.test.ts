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
			title: 'Rick Astley - Never Gonna Give You Up',
			author: {
				name: 'Rick Astley',
				username: 'RickAstleyVEVO',
			},
			viewsCount: 1000000,
		});
		expect(typeof validObjectAuthor.author).toBe('object');
	});

	it('validates web scrape input & output schema', () => {
		const validInput = SupadataEndpointInputSchemas.webScrape.parse({
			url: 'https://example.com',
			noLinks: true,
		});
		expect(validInput.noLinks).toBe(true);

		const validOutput = SupadataEndpointOutputSchemas.webScrape.parse({
			url: 'https://example.com',
			content: 'Scraped Content',
			markdown: '# Scraped Content',
		});
		expect(validOutput.content).toBe('Scraped Content');
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
		const validInput = SupadataEndpointInputSchemas.youtubeSearch.parse({
			query: 'Rick Astley',
			type: 'video',
		});
		expect(validInput.query).toBe('Rick Astley');

		const validOutput = SupadataEndpointOutputSchemas.youtubeSearch.parse({
			query: 'Rick Astley',
			results: [
				{
					type: 'video',
					id: 'dQw4w9WgXcQ',
					title: 'Rick Astley - Never Gonna Give You Up',
				},
			],
		});
		expect(validOutput.results).toHaveLength(1);
	});
});
