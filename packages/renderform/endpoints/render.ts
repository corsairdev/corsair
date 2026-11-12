import type { RenderformEndpoints } from '..';
import { call } from './call';
import {
	RenderformEndpointInputSchemas as Inputs,
	RenderformEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Renders a template.
 *
 * An image render is synchronous and answers with `href` ready. A video render
 * answers `202` with `status: "pending"`, and `href` is not usable until
 * `results.get` reports `done` or `failed`; the output model keeps `status` for
 * exactly that reason.
 *
 * A render costs credits unless it is served from the cache. `cache: false` forces
 * a fresh render and the cost; a `requestId` and `version` are the same key, so
 * reusing one is how a caller asks for the cached file.
 */
export const render: RenderformEndpoints['render'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'render',
			input: Inputs.render,
			output: Outputs.render,
		},
		input,
		({
			template,
			data,
			fileName,
			webhookUrl,
			version,
			metadata,
			batchName,
			cache,
			width,
			height,
			waitTime,
			outputFormat,
			duration,
			fps,
		}) => ({
			method: 'POST',
			path: '/api/v2/render',
			body: {
				template,
				data,
				fileName,
				webhookUrl,
				version,
				metadata,
				batchName,
				cache,
				width,
				height,
				waitTime,
				outputFormat,
				duration,
				fps,
			},
			// A fresh render spends a credit. The API de-duplicates by cache, but a
			// caller who set cache: false asked for a new file, so a replay is not
			// assumed harmless.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				template: parsed.template,
				requestId: result.requestId ?? undefined,
				status: result.status ?? 'done',
				cached: result.cached ?? false,
			}),
		},
	);

/** A page of render history, optionally filtered to one template or batch. */
export const results: RenderformEndpoints['resultsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'results.list',
			input: Inputs.resultsList,
			output: Outputs.resultsList,
		},
		input,
		({ template, batch, page, size }) => ({
			method: 'GET',
			path: '/api/v2/results',
			query: { template, batch, page, size },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.content?.length ?? 0,
				total: result.totalElements ?? undefined,
			}),
		},
	);

/**
 * One render's detail, which is how a video render is polled: `pending` until the
 * file exists, then `done` or `failed`.
 */
export const result: RenderformEndpoints['resultsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'results.get',
			input: Inputs.resultsGet,
			output: Outputs.resultsGet,
		},
		input,
		({ identifier }) => ({
			method: 'GET',
			path: `/api/v2/results/${encodeURIComponent(identifier)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				type: result.type ?? undefined,
			}),
		},
	);

export const deleteResult: RenderformEndpoints['resultsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'results.delete',
			input: Inputs.resultsDelete,
			output: Outputs.resultsDelete,
		},
		input,
		({ identifier }) => ({
			method: 'DELETE',
			path: `/api/v2/results/${encodeURIComponent(identifier)}`,
			// A second delete finds nothing; the result is already gone.
			replayable: false,
		}),
		{
			shape: () => ({}),
			log: (parsed) => ({ identifier: parsed.identifier }),
		},
	);

/** Captures a screenshot of a URL. */
export const screenshot: RenderformEndpoints['screenshot'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'screenshot',
			input: Inputs.screenshot,
			output: Outputs.screenshot,
		},
		input,
		({ url, width, height, waitTime }) => ({
			method: 'POST',
			path: '/api/v1/screenshots',
			body: { url, width, height, waitTime },
			// Each capture spends a credit and returns a new file.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				requestId: result.requestId ?? undefined,
				captured: result.href !== undefined && result.href !== null,
			}),
		},
	);

/** Captures a URL as a PDF, optionally self-deleting after a while. */
export const pdf: RenderformEndpoints['pdf'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'pdf',
			input: Inputs.pdf,
			output: Outputs.pdf,
		},
		input,
		({ url, format, expires, waitTime }) => ({
			method: 'POST',
			path: '/api/v1/pdf',
			body: { url, format, expires, waitTime },
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				format: parsed.format ?? 'A4',
				requestId: result.requestId ?? undefined,
			}),
		},
	);
