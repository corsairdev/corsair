import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withPanelPath = (opportunityId: string, panelId?: string): string => {
	const base = leverPathParameter(
		'/opportunities/{opportunityId}/panels',
		'opportunityId',
		opportunityId,
	);
	return panelId === undefined
		? base
		: leverPathParameter(`${base}/{panelId}`, 'panelId', panelId);
};

export const listPanels: LeverEndpoints['listPanels'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listPanels']>(
		ctx,
		withPanelPath(input.opportunityId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.panels.list', input, 'completed');
	return response;
};

export const retrievePanel: LeverEndpoints['retrievePanel'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrievePanel']
	>(ctx, withPanelPath(input.opportunityId, input.panelId), { method: 'GET' });
	await logEventFromContext(ctx, 'lever.panels.retrieve', input, 'completed');
	return response;
};

export const createPanel: LeverEndpoints['createPanel'] = async (
	ctx,
	input,
) => {
	const { opportunityId, perform_as, ...body } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['createPanel']>(
		ctx,
		withPanelPath(opportunityId),
		{ method: 'POST', body, query: { perform_as } },
	);
	await logEventFromContext(ctx, 'lever.panels.create', input, 'completed');
	return response;
};

export const updatePanel: LeverEndpoints['updatePanel'] = async (
	ctx,
	input,
) => {
	const { opportunityId, panelId, perform_as, ...body } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['updatePanel']>(
		ctx,
		withPanelPath(opportunityId, panelId),
		{ method: 'PUT', body, query: { perform_as } },
	);
	await logEventFromContext(ctx, 'lever.panels.update', input, 'completed');
	return response;
};

export const deletePanel: LeverEndpoints['deletePanel'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['deletePanel']>(
		ctx,
		withPanelPath(input.opportunityId, input.panelId),
		{ method: 'DELETE', query: { perform_as: input.perform_as } },
	);
	await logEventFromContext(ctx, 'lever.panels.delete', input, 'completed');
	return response;
};
