import { logEventFromContext } from 'corsair/core';
import { makePhantomBusterRequest } from '../client';
import type { PhantomBusterContext } from '../index';
import type {
	ExportAgentUsageInput,
	ExportAgentUsageResponse,
	ExportContainerUsageInput,
	ExportContainerUsageResponse,
	FetchAgentGroupsInput,
	FetchAgentGroupsResponse,
	FetchOrgInput,
	FetchOrgResourcesInput,
	FetchOrgResourcesResponse,
	FetchOrgResponse,
	FetchRunningContainersInput,
	FetchRunningContainersResponse,
	SaveAgentGroupsInput,
	SaveAgentGroupsResponse,
} from './types';

export const fetch = async (
	ctx: PhantomBusterContext,
	input: FetchOrgInput,
): Promise<FetchOrgResponse> => {
	const response = await makePhantomBusterRequest<FetchOrgResponse>(
		'/orgs/fetch',
		ctx.key,
		{
			method: 'GET',
			query: {
				withGlobalObject: input.withGlobalObject,
				withProxies: input.withProxies,
				withCrmIntegrations: input.withCrmIntegrations,
				withCustomPrompts: input.withCustomPrompts,
			},
		},
	);

	await logEventFromContext(ctx, 'phantombuster.orgs.fetch', {}, 'completed');

	return response;
};

export const fetchResources = async (
	ctx: PhantomBusterContext,
	_input: FetchOrgResourcesInput,
): Promise<FetchOrgResourcesResponse> => {
	const response = await makePhantomBusterRequest<FetchOrgResourcesResponse>(
		'/orgs/fetch-resources',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.orgs.fetchResources',
		{},
		'completed',
	);

	return response;
};

export const exportAgentUsage = async (
	ctx: PhantomBusterContext,
	input: ExportAgentUsageInput,
): Promise<ExportAgentUsageResponse> => {
	const response = await makePhantomBusterRequest<ExportAgentUsageResponse>(
		'/orgs/export-agent-usage',
		ctx.key,
		{
			method: 'GET',
			query: { days: input.days },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.orgs.exportAgentUsage',
		{},
		'completed',
	);

	return response;
};

export const exportContainerUsage = async (
	ctx: PhantomBusterContext,
	input: ExportContainerUsageInput,
): Promise<ExportContainerUsageResponse> => {
	const response = await makePhantomBusterRequest<ExportContainerUsageResponse>(
		'/orgs/export-container-usage',
		ctx.key,
		{
			method: 'GET',
			query: { days: input.days, agentId: input.agentId },
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.orgs.exportContainerUsage',
		{},
		'completed',
	);

	return response;
};

export const fetchAgentGroups = async (
	ctx: PhantomBusterContext,
	_input: FetchAgentGroupsInput,
): Promise<FetchAgentGroupsResponse> => {
	const response = await makePhantomBusterRequest<FetchAgentGroupsResponse>(
		'/orgs/fetch-agent-groups',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'phantombuster.orgs.fetchAgentGroups',
		{},
		'completed',
	);

	return response;
};

export const saveAgentGroups = async (
	ctx: PhantomBusterContext,
	input: SaveAgentGroupsInput,
): Promise<SaveAgentGroupsResponse> => {
	const response = await makePhantomBusterRequest<SaveAgentGroupsResponse>(
		'/orgs/save-agent-groups',
		ctx.key,
		{
			method: 'POST',
			body: {
				agentGroups: input.agentGroups.map((group) =>
					typeof group === 'string' ? group : { ...group },
				),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'phantombuster.orgs.saveAgentGroups',
		{},
		'completed',
	);

	return response;
};

export const fetchRunningContainers = async (
	ctx: PhantomBusterContext,
	_input: FetchRunningContainersInput,
): Promise<FetchRunningContainersResponse> => {
	const response =
		await makePhantomBusterRequest<FetchRunningContainersResponse>(
			'/orgs/fetch-running-containers',
			ctx.key,
			{ method: 'GET' },
		);

	await logEventFromContext(
		ctx,
		'phantombuster.orgs.fetchRunningContainers',
		{},
		'completed',
	);

	return response;
};
