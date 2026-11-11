import type { YandexEndpoints } from '..';
import { call } from './call';
import {
	YandexEndpointInputSchemas as Inputs,
	YandexEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Translates the passages. `sourceLanguageCode` is omitted from the body when
 * it is not set, rather than sent empty — an empty value would be a language
 * code Yandex does not know, while omitting it asks for detection.
 */
export const translate: YandexEndpoints['translate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'translate',
			input: Inputs.translate,
			output: Outputs.translate,
		},
		input,
		({ folderId: _folderId, ...body }) => ({
			method: 'POST',
			path: '/translate/v2/translate',
			body: {
				targetLanguageCode: body.targetLanguageCode,
				texts: body.texts,
				sourceLanguageCode: body.sourceLanguageCode,
				format: body.format,
				speller: body.speller,
			},
		}),
		{
			folderId: (parsed) => parsed.folderId,
			log: (parsed, result) => ({
				// The character count and languages, never the text.
				characters: parsed.texts.reduce((sum, text) => sum + text.length, 0),
				target: parsed.targetLanguageCode,
				source: parsed.sourceLanguageCode ?? 'detected',
				translations: result.translations?.length ?? 0,
			}),
		},
	);

/**
 * Detects the language of each passage, one result per input, in order.
 *
 * The provider's `/detect` route takes a single `text` and answers one
 * `{ languageCode }`, so a passage is one request. They run in sequence rather
 * than in parallel, which keeps the provider's per-second limit comfortable and
 * the results in the order they were sent.
 */
export const detect: YandexEndpoints['detectLanguages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'detectLanguages',
			input: Inputs.detectLanguages,
			output: Outputs.detectLanguages,
		},
		input,
		({ texts }) => ({ method: 'POST', path: '/translate/v2/detect', body: {} }),
		{
			folderId: (parsed) => parsed.folderId,
			// One request per passage; the shape callback collects the answers into
			// the single ordered result the output schema describes.
			detectEach: true,
			shape: (raw, parsed) => {
				const single = raw as { languageCode?: unknown };
				return {
					detections: [
						{
							languageCode:
								typeof single?.languageCode === 'string'
									? single.languageCode
									: 'und',
						},
					],
				};
			},
			log: (parsed, result) => ({
				passages: parsed.texts.length,
				detections: result.detections.length,
			}),
		},
	);

/** Lists the supported languages, with their display names. */
export const languages: YandexEndpoints['listLanguages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'listLanguages',
			input: Inputs.listLanguages,
			output: Outputs.listLanguages,
		},
		input,
		// The route takes only folderId, which travels as a header.
		() => ({ method: 'POST', path: '/translate/v2/languages', body: {} }),
		{
			folderId: (parsed) => parsed.folderId,
			log: (_, result) => ({ count: result.languages?.length ?? 0 }),
		},
	);
