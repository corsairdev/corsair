import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getOrganizationAssignmentBusinessUnits: WorkdayEndpoints['getOrganizationAssignmentBusinessUnits'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getOrganizationAssignmentBusinessUnits']
		>('v1/organization/getOrganizationAssignmentBusinessUnits', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.organization.getOrganizationAssignmentBusinessUnits',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getOrganizationAssignmentCustoms: WorkdayEndpoints['getOrganizationAssignmentCustoms'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getOrganizationAssignmentCustoms']
		>('v1/organization/getOrganizationAssignmentCustoms', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.organization.getOrganizationAssignmentCustoms',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getOrganizationAssignmentFunds: WorkdayEndpoints['getOrganizationAssignmentFunds'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getOrganizationAssignmentFunds']
		>('v1/organization/getOrganizationAssignmentFunds', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.organization.getOrganizationAssignmentFunds',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getOrganizationAssignmentRegions: WorkdayEndpoints['getOrganizationAssignmentRegions'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getOrganizationAssignmentRegions']
		>('v1/organization/getOrganizationAssignmentRegions', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.organization.getOrganizationAssignmentRegions',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getOrganizationAssignmentWorkers: WorkdayEndpoints['getOrganizationAssignmentWorkers'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getOrganizationAssignmentWorkers']
		>('v1/organization/getOrganizationAssignmentWorkers', ctx.key, {
			method: 'GET',
			// Justification: The makeWorkdayRequest client expects a generic string/number/boolean query record.
			query: input as { [key: string]: string | number | boolean | undefined },
		});
		await logEventFromContext(
			ctx,
			'workday.organization.getOrganizationAssignmentWorkers',
			input ?? {},
			'completed',
		);
		return response;
	};
