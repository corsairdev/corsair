import { logEventFromContext } from 'corsair/core';
import { YandexAPIError } from './client';
import { Translate } from './endpoints';
import {
	badArgument,
	detected,
	detectedGerman,
	languages,
	resourceExhausted,
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
	requestAt,
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
			// unknown: only the length is asserted; the row shape is validated by the
			// output schema in the cases that read fields.
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

		// unknown: the logged payload is open; only its keys are asserted here.
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

	it('sends folderId in the body when one is given', async () => {
		respond(fetchMock, translated);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['Hello'],
			folderId: 'b1gabcdef',
		});

		// TranslateRequest documents folder_id as a body field (JSON `folderId`).
		const sent = lastRequest(fetchMock);
		expect(sent.body).toMatchObject({ folderId: 'b1gabcdef' });
	});

	it('leaves folderId out of the body when none is given', async () => {
		respond(fetchMock, translated);

		await invoke(Translate.translate, {
			targetLanguageCode: 'ru',
			texts: ['Hello'],
		});

		expect(lastRequest(fetchMock).body).not.toHaveProperty('folderId');
	});
});

describe('detect', () => {
	it('detects one language per passage, in order, with one request each', async () => {
		// One answer per passage, in the order the requests go out.
		respond(fetchMock, detected);
		respond(fetchMock, detectedGerman);

		const result = (await invoke(Translate.detect, {
			texts: ['Hello', 'Guten Tag'],
		})) as { detections?: { languageCode?: string }[] };

		expect(result.detections?.[0]?.languageCode).toBe('en');
		expect(result.detections?.[1]?.languageCode).toBe('de');
		// Two passages mean two requests, each carrying a single `text`.
		expect(fetchMock).toHaveBeenCalledTimes(2);
		const first = requestAt(fetchMock, 0);
		const second = requestAt(fetchMock, 1);
		expect(first.path).toBe('/translate/v2/detect');
		expect(first.body).toEqual({ text: 'Hello' });
		expect(second.path).toBe('/translate/v2/detect');
		expect(second.body).toEqual({ text: 'Guten Tag' });
	});

	it('retries a rate-limited passage in place instead of restarting the batch', async () => {
		respond(fetchMock, detected);
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(resourceExhausted), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '0' },
			}),
		);
		respond(fetchMock, detectedGerman);

		const result = (await invoke(Translate.detect, {
			texts: ['Hello', 'Guten Tag'],
		})) as { detections?: { languageCode?: string }[] };

		expect(result.detections?.map((d) => d.languageCode)).toEqual(['en', 'de']);
		// 'Hello' went out once; only the refused passage was sent again.
		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(requestAt(fetchMock, 0).body).toEqual({ text: 'Hello' });
		expect(requestAt(fetchMock, 1).body).toEqual({ text: 'Guten Tag' });
		expect(requestAt(fetchMock, 2).body).toEqual({ text: 'Guten Tag' });
	});

	it('does not retry a passage the API refused as invalid', async () => {
		respond(fetchMock, detected);
		respond(fetchMock, badArgument, 400);

		await expect(
			invoke(Translate.detect, { texts: ['Hello', 'Guten Tag'] }),
		).rejects.toBeInstanceOf(YandexAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('sends folderId in each detect body when one is given', async () => {
		respond(fetchMock, detected);

		await invoke(Translate.detect, { texts: ['Hello'], folderId: 'b1g' });

		// DetectLanguageRequest documents folder_id as a body field.
		expect(lastRequest(fetchMock).body).toEqual({
			text: 'Hello',
			folderId: 'b1g',
		});
	});

	it('never logs the passages', async () => {
		respond(fetchMock, detected);
		respond(fetchMock, detectedGerman);

		await invoke(Translate.detect, { texts: ['secret phrase', 'another'] });

		// unknown: the logged payload is open; only its keys are asserted here.
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

		// unknown: only the length is asserted; the output schema checks the rows.
		const result = (await invoke(Translate.languages, {})) as {
			languages?: unknown[];
		};

		expect(result.languages).toHaveLength(3);
		expect(lastRequest(fetchMock).path).toBe('/translate/v2/languages');
	});

	it('sends no display-language or hint fields, which the route does not take', async () => {
		respond(fetchMock, languages);

		await invoke(Translate.languages, { folderId: 'b1g' });

		// ListLanguagesRequest's only field is folder_id, sent in the body.
		const sent = lastRequest(fetchMock);
		expect(sent.body).toEqual({ folderId: 'b1g' });
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
