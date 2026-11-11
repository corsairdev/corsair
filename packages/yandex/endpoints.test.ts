import { logEventFromContext } from 'corsair/core';
import { YandexAPIError } from './client';
import { Translate } from './endpoints';
import {
	detected,
	languages,
	translated,
	translatedHtml,
	translatedMany,
	unknownKey,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('translate', () => {
	it('translates passages and returns the detected source', async () => {
		respond(fetchMock, translated);

		const result = await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['Hello'],
		});

		expect(result).toEqual(translated);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/translate/v2/translate');
		expect(sent.body).toMatchObject({
			targetLanguageCode: 'ru',
			texts: ['Hello'],
		});
	});

	it('omits sourceLanguageCode rather than sending an empty one', async () => {
		respond(fetchMock, translated);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['Hello'],
		});

		// An empty string would be an unknown language code; omitting it asks for
		// detection instead.
		expect(lastRequest(fetchMock).body).not.toHaveProperty(
			'sourceLanguageCode',
		);
	});

	it('sends an explicit source when given', async () => {
		respond(fetchMock, translated);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['Hello'],
			sourceLanguageCode: 'en',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({
			sourceLanguageCode: 'en',
		});
	});

	it('translates several passages separately', async () => {
		respond(fetchMock, translatedMany);

		const result = (await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['Hello', 'World'],
		})) as { translations?: unknown[] };

		expect(result.translations).toHaveLength(2);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'yandex.translate',
			expect.objectContaining({ translations: 2 }),
			'completed',
		);
	});

	it('preserves HTML when the format asks for it', async () => {
		respond(fetchMock, translatedHtml);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['<p>Hello</p>'],
			format: 'HTML',
		});

		expect(lastRequest(fetchMock).body).toMatchObject({ format: 'HTML' });
	});

	it('never logs the text being translated', async () => {
		respond(fetchMock, translated);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['a confidential sentence'],
		});

		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(JSON.stringify(logged)).not.toContain('confidential');
		// Only the size and the languages.
		expect(logged.characters).toBe('a confidential sentence'.length);
	});

	it('rejects more than 10,000 characters in one call', async () => {
		await expect(
			invoke(Translate.translate, {
				targetLanguageCode: 'ru',
				texts: ['x'.repeat(10_001)],
			}),
		).rejects.toThrow('at most 10,000');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('accepts exactly 10,000 characters', async () => {
		respond(fetchMock, translated);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['x'.repeat(10_000)],
		});

		expect(fetchMock).toHaveBeenCalled();
	});

	it('rejects more than 1,000 passages', async () => {
		await expect(
			invoke(Translate.translate, {
				targetLanguageCode: 'ru',
				texts: Array.from({ length: 1001 }, () => 'a'),
			}),
		).rejects.toThrow();
	});

	it('requires a target language', async () => {
		await expect(
			invoke(Translate.translate, { texts: ['hi'] }),
		).rejects.toThrow();
	});

	it('sends the folder header when one is given', async () => {
		respond(fetchMock, translated);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['Hello'],
			folderId: 'b1gabcdef',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.headers['x-folder-id']).toBe('b1gabcdef');
		// The folder is a header, not a body field.
		expect(sent.body).not.toHaveProperty('folderId');
	});
});

describe('detect', () => {
	it('detects one language per passage, in order', async () => {
		respond(fetchMock, detected);

		const result = (await invoke(Translate.detect, {
			texts: ['Hello', 'Guten Tag'],
		})) as { detections?: { languageCode?: string }[] };

		expect(result.detections?.[0]?.languageCode).toBe('en');
		expect(result.detections?.[1]?.languageCode).toBe('de');
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/translate/v2/detect');
		expect(sent.body).toEqual({ texts: ['Hello', 'Guten Tag'] });
	});

	it('never logs the passages', async () => {
		respond(fetchMock, detected);

		await invoke(Translate.detect, { texts: ['secret phrase', 'another'] });

		const logged = mockLog.mock.calls.at(-1)?.[2] as Record<string, unknown>;
		expect(JSON.stringify(logged)).not.toContain('secret');
		expect(logged.passages).toBe(2);
	});

	it('rejects an empty list', async () => {
		await expect(invoke(Translate.detect, { texts: [] })).rejects.toThrow();
	});
});

describe('languages', () => {
	it('lists the supported languages', async () => {
		respond(fetchMock, languages);

		const result = (await invoke(Translate.languages, {})) as {
			languages?: unknown[];
		};

		expect(result.languages).toHaveLength(3);
		expect(lastRequest(fetchMock).path).toBe('/translate/v2/languages');
	});

	it('asks for display names in a given language', async () => {
		respond(fetchMock, languages);

		await invoke(Translate.languages, { ui: 'ru' });

		expect(lastRequest(fetchMock).body).toMatchObject({ ui: 'ru' });
	});

	it('sends language hints', async () => {
		respond(fetchMock, languages);

		await invoke(Translate.languages, { hints: ['eo'] });

		expect(lastRequest(fetchMock).body).toMatchObject({ hints: ['eo'] });
	});
});

describe('error surface', () => {
	it('surfaces a bad key as a YandexAPIError with its gRPC code', async () => {
		respond(fetchMock, unknownKey, 401);

		const error = (await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['hi'],
		}).catch((thrown: unknown) => thrown)) as YandexAPIError;

		expect(error).toBeInstanceOf(YandexAPIError);
		expect(error.grpcCode).toBe(16);
		expect(error.isAuthError).toBe(true);
	});
});
