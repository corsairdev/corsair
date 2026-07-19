import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getProspect: WorkdayEndpoints['getProspect'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getProspect']
	>('v1/prospect/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.prospect.getProspect',
		input ?? {},
		'completed',
	);
	return response;
};

export const getProspectEducations: WorkdayEndpoints['getProspectEducations'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getProspectEducations']
		>('v1/prospect/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.prospect.getProspectEducations',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getProspectExperiences: WorkdayEndpoints['getProspectExperiences'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getProspectExperiences']
		>('v1/prospect/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.prospect.getProspectExperiences',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getProspectResumeAttachments: WorkdayEndpoints['getProspectResumeAttachments'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getProspectResumeAttachments']
		>('v1/prospect/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.prospect.getProspectResumeAttachments',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getProspectSkills: WorkdayEndpoints['getProspectSkills'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getProspectSkills']
	>('v1/prospect/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.prospect.getProspectSkills',
		input ?? {},
		'completed',
	);
	return response;
};
