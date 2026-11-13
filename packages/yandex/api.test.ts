/**
 * Live smoke tests. CI skips this file by name, and it skips itself without a key.
 * Every read goes through its operation's output schema, so a wrong field type
 * fails here rather than in a caller's code.
 *
 * Run with `YANDEX_API_KEY=... YANDEX_FOLDER_ID=... \
 *   pnpm --filter @corsair-dev/yandex test:live`.
 *
 * A Yandex Translate key is a service-account `Api-Key`, and the folder it belongs
 * to is required when the service account spans several. Only four calls are made,
 * since translate is billed per character.
 */
import * as Translate from './endpoints/translate';
import type { YandexContext } from './index';

const apiKey = process.env.YANDEX_API_KEY;
const folderId = process.env.YANDEX_FOLDER_ID;

const describeIfKey = apiKey ? describe : describe.skip;

if (!apiKey || !folderId) {
	// A skipped run must not read as a green one.
	console.warn(
		[apiKey ? null : 'YANDEX_API_KEY', folderId ? null : 'YANDEX_FOLDER_ID']
			.filter(Boolean)
			.join(' and ') +
			' not set: the live Yandex suite is skipped, not passing.',
	);
}

function liveContext(): YandexContext {
	// unknown: a real context also carries the database, hooks and key manager;
	// the endpoints read only `key`, so the fixture is cast at this boundary.
	return { key: apiKey } as unknown as YandexContext;
}

describeIfKey('live Yandex Translate API', () => {
	it('translates a passage and returns the text', async () => {
		const result = await Translate.translate(
			liveContext() as never,
			{
				targetLanguageCode: 'ru',
				texts: ['Hello'],
				folderId,
			} as never,
		);

		// `text` is required in the schema, so a translation with no text fails here.
		expect(result.translations).toHaveLength(1);
		expect(typeof result.translations[0]?.text).toBe('string');
		expect(result.translations[0]?.text?.length).toBeGreaterThan(0);
	});

	it('reports the detected source language', async () => {
		const result = await Translate.translate(
			liveContext() as never,
			{
				targetLanguageCode: 'ru',
				texts: ['Hello there'],
				folderId,
			} as never,
		);

		expect(result.translations[0]?.detectedLanguageCode).toBeTruthy();
	});

	it('detects the language of a passage, one request per passage', async () => {
		const result = await Translate.detect(
			liveContext() as never,
			{
				texts: ['Hello', 'Guten Tag'],
				folderId,
			} as never,
		);

		// Two passages, so two requests and two ordered results.
		expect(result.detections).toHaveLength(2);
		expect(result.detections[0]?.languageCode).toBe('en');
		expect(result.detections[1]?.languageCode).toBe('de');
	});

	it('lists the supported languages', async () => {
		const result = await Translate.languages(
			liveContext() as never,
			{
				folderId,
			} as never,
		);

		expect(Array.isArray(result.languages)).toBe(true);
		const codes = (result.languages ?? []).map((entry) => entry.code);
		expect(codes).toContain('en');
	});

	it('never exposes the API key in a returned object', async () => {
		const result = await Translate.languages(
			liveContext() as never,
			{
				folderId,
			} as never,
		);

		expect(JSON.stringify(result)).not.toContain(apiKey as string);
	});
});
