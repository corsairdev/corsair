import {
	AnswerInputSchema,
	AnswerResponseSchema,
	BroadSearchInputSchema,
	BroadSearchResponseSchema,
	BusinessSearchInputSchema,
	BusinessSearchResponseSchema,
	EmbeddingInputSchema,
	EmbeddingResponseSchema,
	ExtractInputSchema,
	ExtractResponseSchema,
	GroundedGenerationCreateInputSchema,
	GroundedGenerationCreateResponseSchema,
	GroundedGenerationGetInputSchema,
	GroundedGenerationGetResponseSchema,
	ImageSearchInputSchema,
	ImageSearchResponseSchema,
	NewsSearchInputSchema,
	NewsSearchResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
	VideoGenerationCreateInputSchema,
	VideoGenerationCreateResponseSchema,
	VideoGenerationGetInputSchema,
	VideoGenerationGetResponseSchema,
	VideoSearchInputSchema,
	VideoSearchResponseSchema,
	VLEmbeddingInputSchema,
	VLEmbeddingResponseSchema,
} from './endpoints/types';
import { OctenSchema } from './schema';

describe('Octen schema', () => {
	it('declares a semver version', () => {
		expect(OctenSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof OctenSchema.entities).toBe('object');
		expect(Object.keys(OctenSchema.entities)).toEqual([]);
	});
});

describe('SearchInputSchema', () => {
	it('accepts a query with search options', () => {
		const parsed = SearchInputSchema.parse({
			query: 'openai gpt-6',
			count: 10,
			include_domains: ['octen.ai'],
			language: ['en'],
			highlight: { enable: true, max_tokens: 512 },
		});
		expect(parsed.query).toBe('openai gpt-6');
		expect(parsed.count).toBe(10);
	});

	it('rejects a missing query', () => {
		expect(() => SearchInputSchema.parse({})).toThrow();
	});

	it('rejects a count above the documented maximum', () => {
		expect(() => SearchInputSchema.parse({ query: 'x', count: 101 })).toThrow();
	});
});

describe('SearchResponseSchema', () => {
	it('accepts a result list and keeps unknown fields', () => {
		const parsed = SearchResponseSchema.parse({
			query: 'openai',
			results: [
				{
					title: 'Octen',
					url: 'https://octen.ai',
					highlight: 'a search api',
					future_field: 'kept',
				},
			],
		});
		expect(parsed.results?.[0]?.future_field).toBe('kept');
	});

	it('rejects a non-array results field', () => {
		expect(() => SearchResponseSchema.parse({ results: 'nope' })).toThrow();
	});
});

describe('BroadSearchInputSchema', () => {
	it('accepts a query with search options', () => {
		const parsed = BroadSearchInputSchema.parse({
			query: 'ai agents',
			max_queries: 5,
			search_options: { count: 3 },
		});
		expect(parsed.max_queries).toBe(5);
	});

	it('rejects max_queries below one', () => {
		expect(() =>
			BroadSearchInputSchema.parse({ query: 'ai', max_queries: 0 }),
		).toThrow();
	});
});

describe('BroadSearchResponseSchema', () => {
	it('accepts expanded queries and grouped results', () => {
		const parsed = BroadSearchResponseSchema.parse({
			query: 'ai agents',
			queries: ['ai agents', 'ai agent frameworks'],
			search_results: [{ query: 'ai agents', results: [], latency: 12 }],
		});
		expect(parsed.queries).toHaveLength(2);
	});

	it('rejects non-string queries', () => {
		expect(() => BroadSearchResponseSchema.parse({ queries: [1] })).toThrow();
	});
});

describe('NewsSearchInputSchema', () => {
	it('accepts subject grouping options', () => {
		const parsed = NewsSearchInputSchema.parse({
			query: 'fusion energy',
			count: 20,
			time_range: 'week',
			subjects: { enable: true, count: 3, max_sub_news: 5 },
		});
		expect(parsed.subjects?.enable).toBe(true);
	});

	it('rejects a count above the documented maximum', () => {
		expect(() =>
			NewsSearchInputSchema.parse({ query: 'x', count: 101 }),
		).toThrow();
	});
});

describe('NewsSearchResponseSchema', () => {
	it('accepts articles and subject clusters', () => {
		const parsed = NewsSearchResponseSchema.parse({
			query: 'fusion energy',
			results: [{ title: 'Breakthrough', summary: 'A summary' }],
			subjects: [{ name: 'Fusion', sub_news: [] }],
		});
		expect(parsed.subjects?.[0]?.name).toBe('Fusion');
	});

	it('rejects a non-string article title', () => {
		expect(() =>
			NewsSearchResponseSchema.parse({ results: [{ title: 5 }] }),
		).toThrow();
	});
});

describe('BusinessSearchInputSchema', () => {
	it('accepts entity options', () => {
		const parsed = BusinessSearchInputSchema.parse({
			query: 'acme',
			entities: { enable: true, count: 10, max_news: 5 },
		});
		expect(parsed.entities?.count).toBe(10);
	});

	it('rejects an empty query', () => {
		expect(() => BusinessSearchInputSchema.parse({ query: '' })).toThrow();
	});
});

describe('BusinessSearchResponseSchema', () => {
	it('accepts company and people cards', () => {
		const parsed = BusinessSearchResponseSchema.parse({
			query: 'acme',
			results: [],
			entities: [{ type: 'company', name: 'Acme Corp' }],
		});
		expect(parsed.entities?.[0]?.type).toBe('company');
	});

	it('rejects an unknown entity type', () => {
		expect(() =>
			BusinessSearchResponseSchema.parse({ entities: [{ type: 'org' }] }),
		).toThrow();
	});
});

describe('ImageSearchInputSchema', () => {
	it('accepts a single text input', () => {
		const parsed = ImageSearchInputSchema.parse({
			inputs: [{ type: 'text', data: 'red panda' }],
			count: 5,
			safesearch: 'strict',
		});
		expect(parsed.inputs).toHaveLength(1);
	});

	it('rejects more than one input', () => {
		expect(() =>
			ImageSearchInputSchema.parse({
				inputs: [
					{ type: 'text', data: 'a' },
					{ type: 'image', url: 'https://octen.ai/a.png' },
				],
			}),
		).toThrow();
	});
});

describe('ImageSearchResponseSchema', () => {
	it('accepts image results', () => {
		const parsed = ImageSearchResponseSchema.parse({
			results: [{ title: 'Panda', width: 800, height: 600 }],
		});
		expect(parsed.results?.[0]?.width).toBe(800);
	});

	it('rejects a non-numeric width', () => {
		expect(() =>
			ImageSearchResponseSchema.parse({ results: [{ width: 'wide' }] }),
		).toThrow();
	});
});

describe('VideoSearchInputSchema', () => {
	it('accepts a text input', () => {
		const parsed = VideoSearchInputSchema.parse({
			inputs: [{ type: 'text', data: 'guitar solo' }],
			time_range: 'month',
		});
		expect(parsed.time_range).toBe('month');
	});

	it('rejects an unsupported input type', () => {
		expect(() =>
			VideoSearchInputSchema.parse({
				inputs: [{ type: 'image', data: 'x' }],
			}),
		).toThrow();
	});
});

describe('VideoSearchResponseSchema', () => {
	it('accepts video results', () => {
		const parsed = VideoSearchResponseSchema.parse({
			results: [{ title: 'Solo', duration_seconds: 120 }],
		});
		expect(parsed.results?.[0]?.duration_seconds).toBe(120);
	});

	it('rejects a non-array results field', () => {
		expect(() => VideoSearchResponseSchema.parse({ results: 'x' })).toThrow();
	});
});

describe('ExtractInputSchema', () => {
	it('accepts URLs with extraction options', () => {
		const parsed = ExtractInputSchema.parse({
			urls: ['https://octen.ai/pricing'],
			mode: 'auto',
			include_links: { scope: 'prefer_internal', max_links: 10 },
		});
		expect(parsed.urls).toHaveLength(1);
	});

	it('rejects an empty URL list', () => {
		expect(() => ExtractInputSchema.parse({ urls: [] })).toThrow();
	});
});

describe('ExtractResponseSchema', () => {
	it('accepts a successful page and a per-URL failure', () => {
		const parsed = ExtractResponseSchema.parse({
			results: [
				{
					url: 'https://octen.ai/pricing',
					status: 'success',
					title: 'Pricing',
					links: [{ url: 'https://octen.ai/docs', is_external: false }],
				},
				{
					url: 'https://octen.ai/gone',
					status: 'failed',
					error_message: 'page not found',
				},
			],
		});
		expect(parsed.results?.[1]?.status).toBe('failed');
	});

	it('rejects an unknown per-URL status', () => {
		expect(() =>
			ExtractResponseSchema.parse({ results: [{ status: 'partial' }] }),
		).toThrow();
	});
});

describe('EmbeddingInputSchema', () => {
	it('accepts text inputs and a model choice', () => {
		const parsed = EmbeddingInputSchema.parse({
			input: ['hello world', 'second document'],
			model: 'octen-embedding-4b',
			input_type: 'document',
		});
		expect(parsed.input).toHaveLength(2);
	});

	it('rejects an unknown model', () => {
		expect(() =>
			EmbeddingInputSchema.parse({
				input: ['hello'],
				model: 'text-embedding-3',
			}),
		).toThrow();
	});
});

describe('EmbeddingResponseSchema', () => {
	it('accepts vectors', () => {
		const parsed = EmbeddingResponseSchema.parse({
			results: [{ index: 0, embedding: [0.1, 0.2, 0.3] }],
			model: 'octen-embedding-4b',
		});
		expect(parsed.results?.[0]?.embedding).toHaveLength(3);
	});

	it('rejects non-numeric vector entries', () => {
		expect(() =>
			EmbeddingResponseSchema.parse({ results: [{ embedding: ['a'] }] }),
		).toThrow();
	});
});

describe('VLEmbeddingInputSchema', () => {
	it('accepts multimodal content', () => {
		const parsed = VLEmbeddingInputSchema.parse({
			model: 'octen-vl-embedding-large',
			input: {
				contents: [{ text: 'a cat' }, { image: 'https://octen.ai/c.png' }],
			},
			enable_fusion: true,
		});
		expect(parsed.input.contents).toHaveLength(2);
	});

	it('rejects a missing input payload', () => {
		expect(() =>
			VLEmbeddingInputSchema.parse({ model: 'octen-vl-embedding' }),
		).toThrow();
	});
});

describe('VLEmbeddingResponseSchema', () => {
	it('accepts vector results', () => {
		const parsed = VLEmbeddingResponseSchema.parse({
			results: [{ index: 0, embedding: [0.5], type: 'vl' }],
		});
		expect(parsed.results?.[0]?.type).toBe('vl');
	});

	it('rejects an unknown result type', () => {
		expect(() =>
			VLEmbeddingResponseSchema.parse({ results: [{ type: 'image' }] }),
		).toThrow();
	});
});

describe('AnswerInputSchema', () => {
	it('accepts chat messages and synthesis options', () => {
		const parsed = AnswerInputSchema.parse({
			messages: [{ role: 'user', content: 'What is Octen?' }],
			mode: 'full',
			max_queries: 3,
		});
		expect(parsed.messages).toHaveLength(1);
	});

	it('rejects an empty message list', () => {
		expect(() => AnswerInputSchema.parse({ messages: [] })).toThrow();
	});
});

describe('AnswerResponseSchema', () => {
	it('accepts a chat completion with search metadata', () => {
		const parsed = AnswerResponseSchema.parse({
			request_id: 'req_1',
			object: 'chat.completion',
			created: 1,
			model: 'anthropic/claude-sonnet-4.6',
			choices: [
				{
					index: 0,
					finish_reason: 'stop',
					message: { role: 'assistant', content: 'Octen is a search API.' },
				},
			],
			queries: ['what is octen'],
			meta: {
				usage: {
					num_search_queries: 1,
					prompt_tokens: 10,
					completion_tokens: 5,
					total_tokens: 15,
				},
			},
		});
		expect(parsed.choices).toHaveLength(1);
	});

	it('rejects a response missing required choices', () => {
		expect(() =>
			AnswerResponseSchema.parse({
				request_id: 'req_1',
				object: 'chat.completion',
				created: 1,
				model: 'm',
			}),
		).toThrow();
	});
});

describe('VideoGenerationCreateInputSchema', () => {
	it('accepts a model and prompt', () => {
		const parsed = VideoGenerationCreateInputSchema.parse({
			model: 'google/veo-3.1',
			prompt: 'a drone shot over a canyon',
			resolution: '1080p',
			extra_params: { seed_mode: 'random' },
		});
		expect(parsed.model).toBe('google/veo-3.1');
	});

	it('rejects an unknown model', () => {
		expect(() =>
			VideoGenerationCreateInputSchema.parse({ model: 'nope', prompt: 'x' }),
		).toThrow();
	});
});

describe('VideoGenerationCreateResponseSchema', () => {
	it('accepts a queued task', () => {
		const parsed = VideoGenerationCreateResponseSchema.parse({
			id: 'vid_1',
			model: 'google/veo-3.1',
			status: 'queued',
			created: 1,
		});
		expect(parsed.status).toBe('queued');
	});

	it('rejects a create response that is already running', () => {
		expect(() =>
			VideoGenerationCreateResponseSchema.parse({
				id: 'vid_1',
				model: 'google/veo-3.1',
				status: 'in_progress',
				created: 1,
			}),
		).toThrow();
	});
});

describe('VideoGenerationGetInputSchema', () => {
	it('accepts a task id', () => {
		expect(VideoGenerationGetInputSchema.parse({ id: 'vid_1' }).id).toBe(
			'vid_1',
		);
	});

	it('rejects an empty task id', () => {
		expect(() => VideoGenerationGetInputSchema.parse({ id: '' })).toThrow();
	});
});

describe('VideoGenerationGetResponseSchema', () => {
	it('accepts a completed task with a video URL', () => {
		const parsed = VideoGenerationGetResponseSchema.parse({
			id: 'vid_1',
			model: 'google/veo-3.1',
			status: 'completed',
			created: 1,
			video_url: 'https://octen.ai/videos/vid_1.mp4',
			usage: { video_seconds: 5 },
		});
		expect(parsed.video_url).toContain('vid_1.mp4');
	});

	it('rejects an unknown task status', () => {
		expect(() =>
			VideoGenerationGetResponseSchema.parse({
				id: 'vid_1',
				model: 'google/veo-3.1',
				status: 'unknown',
				created: 1,
			}),
		).toThrow();
	});
});

describe('GroundedGenerationCreateInputSchema', () => {
	it('accepts an image request with a model', () => {
		const parsed = GroundedGenerationCreateInputSchema.parse({
			modality: 'image',
			prompt: 'a red panda in space',
			model: 'google/gemini-3-pro-image',
			aspect_ratio: '16:9',
		});
		expect(parsed.modality).toBe('image');
	});

	it('rejects an unsupported modality', () => {
		expect(() =>
			GroundedGenerationCreateInputSchema.parse({
				modality: 'audio',
				prompt: 'x',
			}),
		).toThrow();
	});
});

describe('GroundedGenerationCreateResponseSchema', () => {
	it('accepts a queued generation', () => {
		const parsed = GroundedGenerationCreateResponseSchema.parse({
			request_id: 'req_1',
			generation_id: 'gen_1',
			modality: 'image',
			status: 'queued',
			created_at: 1,
		});
		expect(parsed.generation_id).toBe('gen_1');
	});

	it('rejects a create response that is already succeeded', () => {
		expect(() =>
			GroundedGenerationCreateResponseSchema.parse({
				generation_id: 'gen_1',
				modality: 'image',
				status: 'succeeded',
				created_at: 1,
			}),
		).toThrow();
	});
});

describe('GroundedGenerationGetInputSchema', () => {
	it('accepts a generation id', () => {
		expect(
			GroundedGenerationGetInputSchema.parse({ generation_id: 'gen_1' })
				.generation_id,
		).toBe('gen_1');
	});

	it('rejects an empty generation id', () => {
		expect(() =>
			GroundedGenerationGetInputSchema.parse({ generation_id: '' }),
		).toThrow();
	});
});

describe('GroundedGenerationGetResponseSchema', () => {
	it('accepts a succeeded generation with references', () => {
		const parsed = GroundedGenerationGetResponseSchema.parse({
			generation_id: 'gen_1',
			modality: 'image',
			status: 'succeeded',
			output_url: 'https://octen.ai/out/gen_1.png',
			references: [{ url: 'https://octen.ai/ref/1' }],
			created_at: 1,
			updated_at: 2,
		});
		expect(parsed.output_url).toContain('gen_1.png');
	});

	it('rejects a response missing required timestamps', () => {
		expect(() =>
			GroundedGenerationGetResponseSchema.parse({
				generation_id: 'gen_1',
				modality: 'image',
				status: 'queued',
				created_at: 1,
			}),
		).toThrow();
	});
});
