import type { CrowterminalContext } from '..';
import { callCrowterminal } from './shared';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './types';
import {
	BulkIngestInputSchema,
	BulkIngestResponseSchema,
	GetDataTypesInputSchema,
	GetDataTypesResponseSchema,
	IngestDataInputSchema,
	IngestDataResponseSchema,
} from './types';

export const ingest = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['dataIngest'],
): Promise<CrowterminalEndpointOutputs['dataIngest']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.data.ingest',
			method: 'POST',
			inputSchema: IngestDataInputSchema,
			outputSchema: IngestDataResponseSchema,
			path: () => '/api/agent/data/ingest',
			body: (i) => ({ ...i }),
		},
		input,
	);

/** Up to 50 points per call. The API names the array `items`. */
export const ingestBulk = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['dataIngestBulk'],
): Promise<CrowterminalEndpointOutputs['dataIngestBulk']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.data.ingest_bulk',
			method: 'POST',
			inputSchema: BulkIngestInputSchema,
			outputSchema: BulkIngestResponseSchema,
			path: () => '/api/agent/data/ingest/bulk',
			body: (i) => ({ items: i.items }),
		},
		input,
	);

/** Data types accepted per platform; the valid set differs by platform. */
export const getTypes = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['dataGetTypes'],
): Promise<CrowterminalEndpointOutputs['dataGetTypes']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.data.get_types',
			inputSchema: GetDataTypesInputSchema,
			outputSchema: GetDataTypesResponseSchema,
			path: () => '/api/agent/data/types',
		},
		input,
	);
