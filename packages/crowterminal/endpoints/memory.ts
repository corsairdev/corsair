import type { CrowterminalContext } from '..';
import { pathSegment } from '../client';
import { callCrowterminal } from './shared';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './types';
import {
	BulkMemoryInputSchema,
	BulkMemoryResponseSchema,
	CompareMdInputSchema,
	CompareMdResponseSchema,
	EngagementAnalysisInputSchema,
	EngagementAnalysisResponseSchema,
	GetChangelogInputSchema,
	GetChangelogResponseSchema,
	GetMemoryInputSchema,
	GetMemoryResponseSchema,
	GetPatternInputSchema,
	GetPatternResponseSchema,
	ValidateChangesInputSchema,
	ValidateChangesResponseSchema,
} from './types';

const memoryPath = (clientId: string, suffix = '') =>
	`/api/agent/memory/${pathSegment(clientId)}${suffix}`;

export const get = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['memoryGet'],
): Promise<CrowterminalEndpointOutputs['memoryGet']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.memory.get',
			inputSchema: GetMemoryInputSchema,
			outputSchema: GetMemoryResponseSchema,
			path: (i) => memoryPath(i.clientId),
		},
		input,
	);

/** Reads up to 50 clients in one call. */
export const getBulk = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['memoryGetBulk'],
): Promise<CrowterminalEndpointOutputs['memoryGetBulk']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.memory.get_bulk',
			method: 'POST',
			inputSchema: BulkMemoryInputSchema,
			outputSchema: BulkMemoryResponseSchema,
			path: () => '/api/agent/memory/bulk',
			body: (i) => ({ clientIds: i.clientIds }),
		},
		input,
	);

export const getChangelog = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['memoryGetChangelog'],
): Promise<CrowterminalEndpointOutputs['memoryGetChangelog']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.memory.get_changelog',
			inputSchema: GetChangelogInputSchema,
			outputSchema: GetChangelogResponseSchema,
			path: (i) => memoryPath(i.clientId, '/changelog'),
		},
		input,
	);

/** Trends one skill field across versions; the API requires `field`. */
export const getPattern = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['memoryGetPattern'],
): Promise<CrowterminalEndpointOutputs['memoryGetPattern']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.memory.get_pattern',
			inputSchema: GetPatternInputSchema,
			outputSchema: GetPatternResponseSchema,
			path: (i) => memoryPath(i.clientId, '/pattern'),
			query: (i) => ({ field: i.field }),
		},
		input,
	);

export const engagementAnalysis = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['memoryEngagementAnalysis'],
): Promise<CrowterminalEndpointOutputs['memoryEngagementAnalysis']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.memory.engagement_analysis',
			method: 'POST',
			inputSchema: EngagementAnalysisInputSchema,
			outputSchema: EngagementAnalysisResponseSchema,
			path: (i) => memoryPath(i.clientId, '/engagement-analysis'),
			body: (i) => ({ agentMd: i.agentMd }),
		},
		input,
	);

export const compareMd = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['memoryCompareMd'],
): Promise<CrowterminalEndpointOutputs['memoryCompareMd']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.memory.compare_md',
			method: 'POST',
			inputSchema: CompareMdInputSchema,
			outputSchema: CompareMdResponseSchema,
			path: (i) => memoryPath(i.clientId, '/compare-md'),
			body: (i) => ({ agentMd: i.agentMd }),
		},
		input,
	);

/** Checks proposed edits against stored history before they are applied. */
export const validateChanges = (
	ctx: CrowterminalContext,
	input: CrowterminalEndpointInputs['memoryValidateChanges'],
): Promise<CrowterminalEndpointOutputs['memoryValidateChanges']> =>
	callCrowterminal(
		ctx,
		{
			event: 'crowterminal.memory.validate_changes',
			method: 'POST',
			inputSchema: ValidateChangesInputSchema,
			outputSchema: ValidateChangesResponseSchema,
			path: (i) => memoryPath(i.clientId, '/validate'),
			body: (i) => ({ proposedChanges: i.proposedChanges }),
		},
		input,
	);
