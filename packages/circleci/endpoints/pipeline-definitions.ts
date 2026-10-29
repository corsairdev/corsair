import { logEventFromContext } from 'corsair/core';
import type { CircleCIEndpoints } from '../index';
import { CircleCIPipelineDefinitionEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { circleCICall } from './shared';
import type { CircleCIEndpointOutputs } from './types';

const LABEL = 'pipeline definition';

/** Retrieves a pipeline definition. */
export const get: CircleCIEndpoints['pipelineDefinitionsGet'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<
		CircleCIEndpointOutputs['pipelineDefinitionsGet']
	>(
		ctx,
		`projects/${input.projectId}/pipeline-definitions/${input.pipelineDefinitionId}`,
	);

	await cacheEntity(
		ctx.db.pipelineDefinitions,
		CircleCIPipelineDefinitionEntity,
		result,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'circleci.pipelineDefinitions.get',
		auditPayload(input, ['projectId', 'pipelineDefinitionId']),
		'completed',
	);
	return result;
};

/** Lists a project's pipeline definitions. */
export const list: CircleCIEndpoints['pipelineDefinitionsList'] = async (
	ctx,
	input,
) => {
	const result = await circleCICall<{
		items: CircleCIEndpointOutputs['pipelineDefinitionsList'];
	}>(ctx, `projects/${input.projectId}/pipeline-definitions`);

	await cacheEntities(
		ctx.db.pipelineDefinitions,
		CircleCIPipelineDefinitionEntity,
		result.items,
		{ label: LABEL },
	);

	await logEventFromContext(
		ctx,
		'circleci.pipelineDefinitions.list',
		{ ...auditPayload(input, ['projectId']), returned: result.items.length },
		'completed',
	);
	return result.items;
};
