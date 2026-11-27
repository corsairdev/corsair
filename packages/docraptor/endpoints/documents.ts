import { z } from 'zod';
import type { DocRaptorEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	DOCRAPTOR_DEFAULT_PER_PAGE,
	DocRaptorEndpointInputSchemas as Inputs,
	DocRaptorEndpointOutputSchemas as Outputs,
} from './types';

// POST /docs (synchronous) and GET /download/{id} are deliberately not
// exposed: both answer with the raw document bytes, which the corsair client
// reads as body text and would return garbled. The async creates below are
// the plugin path for documents; callers fetch the `download_url` from
// documents.status themselves (it allows only a few fetches, so it is not
// a signed URL to store).

export const createAsync: DocRaptorEndpoints['documentsCreateAsync'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.createAsync',
			input: Inputs.documentsCreateAsync,
			output: Outputs.documentsCreateAsync,
		},
		input,
		(body) => ({ method: 'POST', path: '/async_docs', body }),
		{
			log: ({ type, test }, result) => ({
				statusId: result.status_id,
				type,
				test: test ?? true,
			}),
		},
	);

export const createHostedAsync: DocRaptorEndpoints['documentsCreateHostedAsync'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'documents.createHostedAsync',
				input: Inputs.documentsCreateHostedAsync,
				output: Outputs.documentsCreateHostedAsync,
			},
			input,
			(body) => ({ method: 'POST', path: '/hosted_async_docs', body }),
			{
				log: ({ type, test }, result) => ({
					statusId: result.status_id,
					type,
					test: test ?? true,
				}),
			},
		);

export const createHosted: DocRaptorEndpoints['documentsCreateHosted'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'documents.createHosted',
			input: Inputs.documentsCreateHosted,
			output: Outputs.documentsCreateHosted,
		},
		input,
		(body) => ({ method: 'POST', path: '/hosted_docs', body }),
		{
			log: ({ type, test }, result) => ({
				downloadId: result.download_id,
				type,
				test: test ?? true,
			}),
		},
	);

export const status: DocRaptorEndpoints['documentsStatus'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.status',
			input: Inputs.documentsStatus,
			output: Outputs.documentsStatus,
		},
		input,
		({ statusId }) => ({
			method: 'GET',
			path: `/status/${segment(statusId)}`,
		}),
		{
			log: ({ statusId }, result) => ({ statusId, status: result.status }),
		},
	);

export const list: DocRaptorEndpoints['documentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.list',
			input: Inputs.documentsList,
			output: Outputs.documentsList,
		},
		input,
		({ page = 1, per_page }) => ({
			method: 'GET',
			path: '/docs.json',
			query: { page, per_page },
		}),
		{
			shape: (raw, { page = 1, per_page }) => {
				const pageSize = per_page ?? DOCRAPTOR_DEFAULT_PER_PAGE;
				// A bare array is the documented shape; anything else must fail
				// rather than become an empty page.
				const documents = z.array(z.record(z.string(), z.unknown())).parse(raw);
				return {
					documents,
					page,
					per_page: pageSize,
					next_page: documents.length >= pageSize ? page + 1 : null,
				};
			},
			log: ({ page = 1 }, result) => ({
				page,
				count: result.documents.length,
			}),
		},
	);

// The docs' path is /expire/{download_id}.json; the OpenAPI spec's
// /expire/{id} omits the .json suffix, and the probes only covered the
// documented form.
export const expire: DocRaptorEndpoints['documentsExpire'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'documents.expire',
			input: Inputs.documentsExpire,
			output: Outputs.documentsExpire,
		},
		input,
		({ downloadId }) => ({
			method: 'PATCH',
			path: `/expire/${segment(downloadId)}.json`,
		}),
		{
			// Success is an empty 200; the status code is the evidence.
			shape: () => ({ success: true as const }),
			log: ({ downloadId }) => ({ downloadId }),
		},
	);
