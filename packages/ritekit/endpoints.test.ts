import { logEventFromContext } from 'corsair/core';
import {
	Companies,
	Emojis,
	Hashtags,
	Images,
	Links,
	Person,
	Texts,
} from './endpoints';
import {
	ANIMATED_IMAGE,
	ARTICLE,
	AUTO_EMOJIFY,
	BAD_REQUEST,
	BANNED_HASHTAGS,
	BRAND_COLORS,
	COMPANY_LOGO,
	DISPOSABLE,
	EMAIL_TYPO,
	EMOJI_SUGGESTIONS,
	FREEMAIL,
	HASHTAGS_AUTO,
	HASHTAGS_FOR_IMAGE,
	HASHTAGS_FOR_URL,
	HASHTAGS_STATS,
	HASHTAGS_SUGGESTIONS,
	HASHTAGS_TRENDING,
	LINK_PREVIEW,
	NAME_FROM_EMAIL,
	NAME_TO_DOMAIN,
	QUOTE_IMAGE,
	SHORT_LINK,
	TOP_IMAGE,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('hashtags.stats', () => {
	it('joins the tags into one comma-separated value', async () => {
		respond(fetchMock, HASHTAGS_STATS);

		await invoke(Hashtags.stats, { tags: ['jobs', 'Chello'] });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/stats/multiple-hashtags');
		expect(request.query.tags).toBe('jobs,Chello');
	});

	it('parses the stats and the color legend', async () => {
		respond(fetchMock, HASHTAGS_STATS);

		const result = (await invoke(Hashtags.stats, { tags: ['jobs'] })) as {
			stats?: { tweets?: number; exposure?: number }[];
			color?: string[];
		};

		expect(result.stats?.[0]?.tweets).toBe(642);
		expect(result.stats?.[0]?.exposure).toBe(1984429);
		expect(result.color?.[3]).toBe('Great');
	});

	it('keeps the fractional image, link and mention shares', async () => {
		respond(fetchMock, HASHTAGS_STATS);

		const result = (await invoke(Hashtags.stats, { tags: ['jobs'] })) as {
			stats?: { images?: number }[];
		};

		expect(result.stats?.[0]?.images).toBeCloseTo(0.3504673);
	});

	it('rejects more than the documented 100 hashtags', async () => {
		const tags = Array.from({ length: 101 }, (_, index) => `tag${index}`);

		await expect(invoke(Hashtags.stats, { tags })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts exactly 100 hashtags', async () => {
		respond(fetchMock, HASHTAGS_STATS);
		const tags = Array.from({ length: 100 }, (_, index) => `tag${index}`);

		await invoke(Hashtags.stats, { tags });

		expect(lastRequest(fetchMock).query.tags?.split(',')).toHaveLength(100);
	});

	it('rejects an empty list', async () => {
		await expect(invoke(Hashtags.stats, { tags: [] })).rejects.toThrow();
	});

	it('logs the counts', async () => {
		respond(fetchMock, HASHTAGS_STATS);

		await invoke(Hashtags.stats, { tags: ['jobs', 'Chello'] });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ritekit.hashtags.stats',
			{ requested: 2, returned: 2 },
			'completed',
		);
	});
});

describe('hashtags.auto', () => {
	it('returns the post with hashtags added', async () => {
		respond(fetchMock, HASHTAGS_AUTO);

		const result = (await invoke(Hashtags.auto, {
			post: 'Is artificial intelligence the future of customer service?',
			maxHashtags: 2,
			hashtagPosition: 'auto',
		})) as { post?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/stats/auto-hashtag');
		expect(request.query).toMatchObject({
			maxHashtags: '2',
			hashtagPosition: 'auto',
		});
		expect(result.post).toContain('#science');
	});

	it('rejects a position RiteKit does not document', async () => {
		await expect(
			invoke(Hashtags.auto, { post: 'hello', hashtagPosition: 'start' }),
		).rejects.toThrow();
	});

	it('rejects more than the documented 20 hashtags', async () => {
		await expect(
			invoke(Hashtags.auto, { post: 'hello', maxHashtags: 21 }),
		).rejects.toThrow();
	});
});

describe('hashtags.suggestions', () => {
	it('suggests hashtags for a block of text', async () => {
		respond(fetchMock, HASHTAGS_SUGGESTIONS);

		const result = (await invoke(Hashtags.suggestions, {
			text: 'When you give Alaskans a universal basic income.',
		})) as { data?: { hashtag?: string }[] };

		expect(lastRequest(fetchMock).path).toBe('/v1/stats/hashtag-suggestions');
		expect(result.data?.[0]?.hashtag).toBe('seo');
	});

	it('rejects empty text', async () => {
		await expect(invoke(Hashtags.suggestions, { text: '' })).rejects.toThrow();
	});
});

describe('hashtags.forUrl', () => {
	it('reads the `hashtags` key this route uses instead of `data`', async () => {
		respond(fetchMock, HASHTAGS_FOR_URL);

		const result = (await invoke(Hashtags.forUrl, {
			url: 'https://ritekit.com/api-demo/extract-article',
		})) as { hashtags?: { hashtag?: string }[]; result?: boolean };

		expect(lastRequest(fetchMock).path).toBe('/v2/stats/hashtags-for-url');
		expect(result.result).toBe(true);
		expect(result.hashtags?.[0]?.hashtag).toBe('socialmedia');
	});

	it('accepts an answer without a code, which this route omits', async () => {
		respond(fetchMock, { result: true, message: 'ok', hashtags: [] });

		await expect(
			invoke(Hashtags.forUrl, { url: 'https://example.com' }),
		).resolves.toBeDefined();
	});
});

describe('hashtags.forImage', () => {
	it('keeps mediaCount, which only this route sends', async () => {
		respond(fetchMock, HASHTAGS_FOR_IMAGE);

		const result = (await invoke(Hashtags.forImage, {
			image: 'https://jpeg.org/images/jpeg-home.jpg',
		})) as { data?: { mediaCount?: number }[] };

		expect(lastRequest(fetchMock).path).toBe(
			'/v1/stats/hashtag-suggestions-image',
		);
		expect(result.data?.[0]?.mediaCount).toBe(71793843);
	});
});

describe('hashtags.trending', () => {
	it('sends the flags as 1 and 0, the form the API reads', async () => {
		respond(fetchMock, HASHTAGS_TRENDING);

		await invoke(Hashtags.trending, { green: true, latin: false });

		expect(lastRequest(fetchMock).query).toMatchObject({
			green: '1',
			latin: '0',
		});
	});

	it('omits a flag the caller does not set', async () => {
		respond(fetchMock, HASHTAGS_TRENDING);

		await invoke(Hashtags.trending, {});

		const query = lastRequest(fetchMock).query;
		expect(query.green).toBeUndefined();
		expect(query.latin).toBeUndefined();
	});

	it('reads the `photos` share this route uses instead of `images`', async () => {
		respond(fetchMock, HASHTAGS_TRENDING);

		const result = (await invoke(Hashtags.trending, {})) as {
			tags?: { tag?: string; photos?: number }[];
		};

		expect(result.tags?.[0]?.tag).toBe('pahamipidanakerumunan');
		expect(result.tags?.[0]?.photos).toBeCloseTo(0.290452);
	});
});

describe('hashtags.cleanInstagram', () => {
	it('returns the cleaned post and what was removed', async () => {
		respond(fetchMock, BANNED_HASHTAGS);

		const result = (await invoke(Hashtags.cleanInstagram, {
			post: '#instaphotography #girlsofinstagram',
		})) as { post?: string; bannedHashtags?: string[] };

		expect(lastRequest(fetchMock).path).toBe('/v2/instagram/hashtags-cleaner');
		expect(result.post).not.toContain('#girlsofinstagram');
		// The removed tags keep their leading #.
		expect(result.bannedHashtags).toEqual(['#girlsofinstagram']);
	});

	it('logs how many were removed', async () => {
		respond(fetchMock, BANNED_HASHTAGS);

		await invoke(Hashtags.cleanInstagram, { post: '#a #girlsofinstagram' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ritekit.hashtags.cleanInstagram',
			{ removed: 1 },
			'completed',
		);
	});
});

describe('emojis', () => {
	it('suggests emoji for a block of text', async () => {
		respond(fetchMock, EMOJI_SUGGESTIONS);

		const result = (await invoke(Emojis.suggestions, {
			text: 'Why robots may soon steal all manufacturing jobs',
		})) as { emojis?: string[] };

		expect(lastRequest(fetchMock).path).toBe('/v1/emoji/suggestions');
		expect(result.emojis).toEqual(['🤖', '🗞', '❓']);
	});

	it('returns the text with emoji added', async () => {
		respond(fetchMock, AUTO_EMOJIFY);

		const result = (await invoke(Emojis.auto, {
			text: 'Why robots may soon steal all manufacturing jobs',
		})) as { text?: string };

		expect(lastRequest(fetchMock).path).toBe('/v1/emoji/auto-emojify');
		expect(result.text).toContain('🤖');
	});
});

describe('images', () => {
	it('renders a quote with the style parameters', async () => {
		respond(fetchMock, QUOTE_IMAGE);

		const result = (await invoke(Images.quote, {
			text: 'If you love life, do not waste time',
			author: 'Bruce Lee',
			width: 400,
			height: 400,
			textFont: 'Lora',
			textColor: '#000000',
			backgroundColor1: '#8686bd',
			backgroundColor2: '#1ddad6',
		})) as { url?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/image/quote');
		expect(request.query).toMatchObject({
			text: 'If you love life, do not waste time',
			author: 'Bruce Lee',
			width: '400',
			height: '400',
			textFont: 'Lora',
		});
		// The # of a color survives encoding.
		expect(request.query.textColor).toBe('#000000');
		expect(result.url).toBe('https://cdn.ritekit.com/quote/abc123.jpg');
	});

	it('rejects a quote with no author', async () => {
		await expect(invoke(Images.quote, { text: 'hello' })).rejects.toThrow();
	});

	it('animates a still image', async () => {
		respond(fetchMock, ANIMATED_IMAGE);

		const result = (await invoke(Images.animate, {
			url: 'https://jpeg.org/images/jpeg-home.jpg',
			type: 'glint',
		})) as { url?: string };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/images/animate');
		expect(request.query.type).toBe('glint');
		expect(result.url).toContain('.gif');
	});

	it('rejects an animation type RiteKit does not document', async () => {
		await expect(
			invoke(Images.animate, {
				url: 'https://example.com/a.jpg',
				type: 'spin',
			}),
		).rejects.toThrow();
	});

	it('extracts the top image from a page', async () => {
		respond(fetchMock, TOP_IMAGE);

		const result = (await invoke(Images.extractTopImage, {
			url: 'https://fedoramagazine.org/secure-ntp-with-nts/',
		})) as { top_image?: string };

		expect(lastRequest(fetchMock).path).toBe('/v2/image/extract-image');
		// The field is snake_case, as RiteKit sends it.
		expect(result.top_image).toContain('secure-ntp-with-nts.jpg');
	});
});

describe('links.shorten', () => {
	it('creates a short link with a Link Ad', async () => {
		respond(fetchMock, SHORT_LINK);

		const result = (await invoke(Links.shorten, {
			url: 'https://ritekit.com',
			cta: '6530',
		})) as { url?: string; limit?: { remaining?: number } };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/link/short-link');
		expect(request.query).toMatchObject({
			url: 'https://ritekit.com',
			cta: '6530',
		});
		expect(result.url).toBe('http://rite.ly/jr6e');
		expect(result.limit?.remaining).toBe(5000);
	});

	it('omits the Link Ad when the caller does not set one', async () => {
		respond(fetchMock, SHORT_LINK);

		await invoke(Links.shorten, { url: 'https://ritekit.com' });

		expect(lastRequest(fetchMock).query.cta).toBeUndefined();
	});
});

describe('person insights', () => {
	it('detects a freemail address', async () => {
		respond(fetchMock, FREEMAIL);

		const result = (await invoke(Person.freemail, {
			domain: 'john.doe@gmail.com',
		})) as { freemail?: boolean };

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/person-insights/freemail-detection');
		// The parameter is named domain but carries a full address.
		expect(request.query.domain).toBe('john.doe@gmail.com');
		expect(result.freemail).toBe(true);
	});

	it('detects a disposable address', async () => {
		respond(fetchMock, DISPOSABLE);

		const result = (await invoke(Person.disposable, {
			email: 'john.doe@gmail.com',
		})) as { disposable?: boolean };

		expect(lastRequest(fetchMock).path).toBe(
			'/v2/person-insights/disposable-email-detection',
		);
		expect(result.disposable).toBe(false);
	});

	it('suggests corrections for a mistyped domain', async () => {
		respond(fetchMock, EMAIL_TYPO);

		const result = (await invoke(Person.emailTypo, {
			email: 'john.doe@gml.com',
		})) as { suggestions?: string[] };

		expect(lastRequest(fetchMock).path).toBe('/v2/person-insights/email-typo');
		expect(result.suggestions).toContain('john.doe@gmail.com');
	});

	it('derives the name from an address', async () => {
		respond(fetchMock, NAME_FROM_EMAIL);

		const result = (await invoke(Person.nameFromEmail, {
			email: 'john.doe@test.com',
		})) as { info?: { givenName?: string; surname?: string } };

		expect(lastRequest(fetchMock).path).toBe(
			'/v2/person-insights/name-from-email-address',
		);
		expect(result.info?.givenName).toBe('john');
		expect(result.info?.surname).toBe('doe');
	});
});

describe('companies', () => {
	it('returns a logo with its brand colors and a permanent URL', async () => {
		respond(fetchMock, COMPANY_LOGO);

		const result = (await invoke(Companies.logo, {
			domain: 'evernote.com',
			squareLogoSize: 256,
			squareLogoBackground: 'original',
		})) as {
			isGenerated?: boolean;
			brandColors?: string[];
			permanentUrl?: string;
		};

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v2/company-insights/logo');
		expect(request.query).toMatchObject({
			domain: 'evernote.com',
			squareLogoSize: '256',
			squareLogoBackground: 'original',
		});
		expect(result.isGenerated).toBe(false);
		expect(result.brandColors?.[0]).toBe('#2dbe60');
		// The stable URL is the one a caller should store.
		expect(result.permanentUrl).toContain('/api/v2/image/logo/');
	});

	it('sends generateFallbackLogo as 1 and 0', async () => {
		respond(fetchMock, COMPANY_LOGO);

		await invoke(Companies.logo, {
			domain: 'evernote.com',
			generateFallbackLogo: true,
		});

		expect(lastRequest(fetchMock).query.generateFallbackLogo).toBe('1');
	});

	it('keeps both the original and square variants', async () => {
		respond(fetchMock, COMPANY_LOGO);

		const result = (await invoke(Companies.logo, {
			domain: 'evernote.com',
		})) as {
			originalLogo?: { url?: { svg?: string } };
			squareLogo?: { size?: number; url?: { png?: string } };
		};

		expect(result.originalLogo?.url?.svg).toBeDefined();
		expect(result.squareLogo?.size).toBe(256);
		expect(result.squareLogo?.url?.png).toBeDefined();
	});

	it('rejects a square logo size over the documented 512', async () => {
		await expect(
			invoke(Companies.logo, { domain: 'evernote.com', squareLogoSize: 513 }),
		).rejects.toThrow();
	});

	it('rejects a background RiteKit does not document', async () => {
		await expect(
			invoke(Companies.logo, {
				domain: 'evernote.com',
				squareLogoBackground: 'blur',
			}),
		).rejects.toThrow();
	});

	it('resolves a company name to its likely domains', async () => {
		respond(fetchMock, NAME_TO_DOMAIN);

		const result = (await invoke(Companies.nameToDomain, {
			name: 'Google',
		})) as {
			domains?: string[];
		};

		expect(lastRequest(fetchMock).path).toBe(
			'/v2/company-insights/name-to-domain',
		);
		expect(result.domains?.[0]).toBe('google.com');
	});

	it('reads a brand palette', async () => {
		respond(fetchMock, BRAND_COLORS);

		const result = (await invoke(Companies.brandColors, {
			name: 'producthunt.com',
		})) as { data?: string[] };

		expect(lastRequest(fetchMock).query.name).toBe('producthunt.com');
		expect(result.data).toHaveLength(4);
		expect(result.data?.[0]).toBe('#da552f');
	});
});

describe('texts', () => {
	it("extracts an article's title and body", async () => {
		respond(fetchMock, ARTICLE);

		const result = (await invoke(Texts.extractArticle, {
			url: 'https://ritekit.com/api-demo/extract-article',
		})) as { title?: string; text?: string };

		expect(lastRequest(fetchMock).path).toBe('/v2/text/extract-article');
		expect(result.title).toBe('Extract article from URL API');
		expect(result.text).toContain('Improve ROI');
	});

	it('returns a link preview with its image', async () => {
		respond(fetchMock, LINK_PREVIEW);

		const result = (await invoke(Texts.linkPreview, {
			url: 'https://ritekit.com/api-demo/extract-article',
		})) as { title?: string; image?: string };

		expect(lastRequest(fetchMock).path).toBe('/v2/text/link-preview');
		expect(result.title).toBe('Extract article from URL API');
		expect(result.image).toContain('ritekit-bg.png');
	});
});

describe('error propagation', () => {
	it('turns a 400 into a validation error the caller can read', async () => {
		respond(fetchMock, BAD_REQUEST, 400);

		await expect(
			invoke(Hashtags.forUrl, { url: 'https://example.com' }),
		).rejects.toThrow('not a valid URL');
	});

	it('surfaces the info hint on an auth failure', async () => {
		respond(
			fetchMock,
			{ result: false, message: 'Verification failed', code: 401 },
			401,
		);

		// unknown: the rejection is narrowed by the assertions below.
		const error = (await invoke(Texts.linkPreview, {
			url: 'https://example.com',
		}).catch((e: unknown) => e)) as { status?: number; message?: string };

		expect(error.status).toBe(401);
		expect(error.message).toContain('Verification failed');
	});
});
