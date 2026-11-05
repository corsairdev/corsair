import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withOpportunityPath = (opportunityId: string, suffix: string): string =>
	leverPathParameter(
		`/opportunities/{opportunityId}`,
		'opportunityId',
		opportunityId,
	) + suffix;

export const listOpportunities: LeverEndpoints['listOpportunities'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listOpportunities']
	>(ctx, '/opportunities', {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'lever.opportunities.list',
		input,
		'completed',
	);
	return response;
};

export const retrieveOpportunity: LeverEndpoints['retrieveOpportunity'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveOpportunity']
		>(
			ctx,
			leverPathParameter(
				'/opportunities/{opportunityId}',
				'opportunityId',
				input.opportunityId,
			),
			{
				method: 'GET',
				query: { include: input.include, expand: input.expand },
			},
		);
		await logEventFromContext(
			ctx,
			'lever.opportunities.retrieve',
			input,
			'completed',
		);
		return response;
	};

export const listDeletedOpportunities: LeverEndpoints['listDeletedOpportunities'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listDeletedOpportunities']
		>(ctx, '/opportunities/deleted', {
			method: 'GET',
			query: input,
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.listDeleted',
			input,
			'completed',
		);
		return response;
	};

export const listOpportunityFileActions: LeverEndpoints['listOpportunityFileActions'] =
	async (ctx, input) => {
		const { opportunityId, ...query } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listOpportunityFileActions']
		>(ctx, withOpportunityPath(opportunityId, '/file_actions'), {
			method: 'GET',
			query,
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.listFileActions',
			input,
			'completed',
		);
		return response;
	};

export const createOpportunity: LeverEndpoints['createOpportunity'] = async (
	ctx,
	input,
) => {
	const { perform_as, parse, perform_as_posting_owner, ...body } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['createOpportunity']
	>(ctx, '/opportunities', {
		method: 'POST',
		body,
		query: { perform_as, parse, perform_as_posting_owner },
	});
	await logEventFromContext(
		ctx,
		'lever.opportunities.create',
		input,
		'completed',
	);
	return response;
};

export const updateOpportunityStage: LeverEndpoints['updateOpportunityStage'] =
	async (ctx, input) => {
		const { opportunityId, stage, perform_as } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['updateOpportunityStage']
		>(ctx, withOpportunityPath(opportunityId, '/stage'), {
			method: 'PUT',
			body: { stage },
			query: { perform_as },
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.updateStage',
			input,
			'completed',
		);
		return response;
	};

export const updateOpportunityArchivedState: LeverEndpoints['updateOpportunityArchivedState'] =
	async (ctx, input) => {
		const { opportunityId, perform_as, ...body } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['updateOpportunityArchivedState']
		>(ctx, withOpportunityPath(opportunityId, '/archived'), {
			method: 'PUT',
			body,
			query: { perform_as },
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.updateArchivedState',
			input,
			'completed',
		);
		return response;
	};

export const addOpportunityLinks: LeverEndpoints['addOpportunityLinks'] =
	async (ctx, input) => {
		const { opportunityId, links, perform_as } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['addOpportunityLinks']
		>(ctx, withOpportunityPath(opportunityId, '/addLinks'), {
			method: 'POST',
			body: { links },
			query: { perform_as },
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.addLinks',
			input,
			'completed',
		);
		return response;
	};

export const removeOpportunityLinks: LeverEndpoints['removeOpportunityLinks'] =
	async (ctx, input) => {
		const { opportunityId, links, perform_as } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['removeOpportunityLinks']
		>(ctx, withOpportunityPath(opportunityId, '/removeLinks'), {
			method: 'POST',
			body: { links },
			query: { perform_as },
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.removeLinks',
			input,
			'completed',
		);
		return response;
	};

export const addOpportunityTags: LeverEndpoints['addOpportunityTags'] = async (
	ctx,
	input,
) => {
	const { opportunityId, tags, perform_as } = input;
	const response = await makeLeverRequest<
		LeverEndpointOutputs['addOpportunityTags']
	>(ctx, withOpportunityPath(opportunityId, '/addTags'), {
		method: 'POST',
		body: { tags },
		query: { perform_as },
	});
	await logEventFromContext(
		ctx,
		'lever.opportunities.addTags',
		input,
		'completed',
	);
	return response;
};

export const removeOpportunityTags: LeverEndpoints['removeOpportunityTags'] =
	async (ctx, input) => {
		const { opportunityId, tags, perform_as } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['removeOpportunityTags']
		>(ctx, withOpportunityPath(opportunityId, '/removeTags'), {
			method: 'POST',
			body: { tags },
			query: { perform_as },
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.removeTags',
			input,
			'completed',
		);
		return response;
	};

export const addOpportunitySources: LeverEndpoints['addOpportunitySources'] =
	async (ctx, input) => {
		const { opportunityId, sources, perform_as } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['addOpportunitySources']
		>(ctx, withOpportunityPath(opportunityId, '/addSources'), {
			method: 'POST',
			body: { sources },
			query: { perform_as },
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.addSources',
			input,
			'completed',
		);
		return response;
	};

export const removeOpportunitySources: LeverEndpoints['removeOpportunitySources'] =
	async (ctx, input) => {
		const { opportunityId, sources, perform_as } = input;
		const response = await makeLeverRequest<
			LeverEndpointOutputs['removeOpportunitySources']
		>(ctx, withOpportunityPath(opportunityId, '/removeSources'), {
			method: 'POST',
			body: { sources },
			query: { perform_as },
		});
		await logEventFromContext(
			ctx,
			'lever.opportunities.removeSources',
			input,
			'completed',
		);
		return response;
	};
