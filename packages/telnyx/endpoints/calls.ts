import type { TelnyxEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	CallActionResponseSchema,
	CallControlApplicationsCreateInputSchema,
	CallControlApplicationsCreateResponseSchema,
	CallControlApplicationsGetInputSchema,
	CallControlApplicationsGetResponseSchema,
	CallControlApplicationsListInputSchema,
	CallControlApplicationsListResponseSchema,
	CallControlApplicationsRemoveInputSchema,
	CallControlApplicationsRemoveResponseSchema,
	CallControlApplicationsUpdateInputSchema,
	CallControlApplicationsUpdateResponseSchema,
	CallsCreateInputSchema,
	CallsCreateResponseSchema,
	CallsGetInputSchema,
	CallsGetResponseSchema,
	CallsHangupInputSchema,
	CallsSpeakInputSchema,
} from './types';

export const callsCreate: TelnyxEndpoints['callsCreate'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'calls.create',
			input: CallsCreateInputSchema,
			output: CallsCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/calls',
			body: parsed,
		}),
	);
};

export const callsGet: TelnyxEndpoints['callsGet'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'calls.get',
			input: CallsGetInputSchema,
			output: CallsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/calls/${segment(parsed.callControlId)}`,
		}),
	);
};

export const callsHangup: TelnyxEndpoints['callsHangup'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'calls.hangup',
			input: CallsHangupInputSchema,
			output: CallActionResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/calls/${segment(parsed.callControlId)}/actions/hangup`,
		}),
	);
};

export const callsSpeak: TelnyxEndpoints['callsSpeak'] = async (ctx, input) => {
	return call(
		ctx,
		{
			event: 'calls.speak',
			input: CallsSpeakInputSchema,
			output: CallActionResponseSchema,
		},
		input,
		(parsed) => {
			const { callControlId, ...body } = parsed;
			return {
				method: 'POST',
				path: `/calls/${segment(callControlId)}/actions/speak`,
				body,
			};
		},
	);
};

export const applicationsList: TelnyxEndpoints['callControlApplicationsList'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'callControlApplications.list',
				input: CallControlApplicationsListInputSchema,
				output: CallControlApplicationsListResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: '/call_control_applications',
				query: {
					'page[number]': parsed.pageNumber,
					'page[size]': parsed.pageSize,
				},
			}),
		);
	};

export const applicationsGet: TelnyxEndpoints['callControlApplicationsGet'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'callControlApplications.get',
				input: CallControlApplicationsGetInputSchema,
				output: CallControlApplicationsGetResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `/call_control_applications/${segment(parsed.applicationId)}`,
			}),
		);
	};

export const applicationsCreate: TelnyxEndpoints['callControlApplicationsCreate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'callControlApplications.create',
				input: CallControlApplicationsCreateInputSchema,
				output: CallControlApplicationsCreateResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/call_control_applications',
				body: parsed,
			}),
		);
	};

export const applicationsUpdate: TelnyxEndpoints['callControlApplicationsUpdate'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'callControlApplications.update',
				input: CallControlApplicationsUpdateInputSchema,
				output: CallControlApplicationsUpdateResponseSchema,
			},
			input,
			(parsed) => {
				const { applicationId, ...body } = parsed;
				return {
					method: 'PATCH',
					path: `/call_control_applications/${segment(applicationId)}`,
					body,
				};
			},
		);
	};

export const applicationsRemove: TelnyxEndpoints['callControlApplicationsRemove'] =
	async (ctx, input) => {
		return call(
			ctx,
			{
				event: 'callControlApplications.remove',
				input: CallControlApplicationsRemoveInputSchema,
				output: CallControlApplicationsRemoveResponseSchema,
			},
			input,
			(parsed) => ({
				method: 'DELETE',
				path: `/call_control_applications/${segment(parsed.applicationId)}`,
			}),
		);
	};
