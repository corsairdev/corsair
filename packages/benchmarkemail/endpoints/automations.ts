/**
 * Benchmark Email automations endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Automation folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const addEmailInAutomation: BenchmarkEmailEndpoints['automationsAddEmailInAutomation'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsAddEmailInAutomation']
		>(`Automation/${encodeURIComponent(input.automationID)}/Emails`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.addEmailInAutomation',
			{ ...input },
			'completed',
		);
		return response;
	};

export const copyEmailInAutomation: BenchmarkEmailEndpoints['automationsCopyEmailInAutomation'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsCopyEmailInAutomation']
		>(
			`Automation/${encodeURIComponent(input.automationID)}/Emails/${encodeURIComponent(input.automationDetailID)}`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.copyEmailInAutomation',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createAutomationCopy: BenchmarkEmailEndpoints['automationsCreateAutomationCopy'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsCreateAutomationCopy']
		>(`Automation/${encodeURIComponent(input.automationID)}/Copy`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.createAutomationCopy',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteAutomation: BenchmarkEmailEndpoints['automationsDeleteAutomation'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsDeleteAutomation']
		>(`Automation/${encodeURIComponent(input.automationID)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.deleteAutomation',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteAutomationEmail: BenchmarkEmailEndpoints['automationsDeleteAutomationEmail'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsDeleteAutomationEmail']
		>(
			`Automation/${encodeURIComponent(input.automationID)}/Emails/${encodeURIComponent(input.automationDetailID)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.deleteAutomationEmail',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAutomationEmailDetails: BenchmarkEmailEndpoints['automationsGetAutomationEmailDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsGetAutomationEmailDetails']
		>(
			`Automation/${encodeURIComponent(input.automationID)}/Emails/${encodeURIComponent(input.automationDetailID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.getAutomationEmailDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAutomationDetails: BenchmarkEmailEndpoints['automationsGetAutomationDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsGetAutomationDetails']
		>(`Automation/${encodeURIComponent(input.automationID)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.getAutomationDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAutomationSummaryReport: BenchmarkEmailEndpoints['automationsGetAutomationSummaryReport'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsGetAutomationSummaryReport']
		>(`Automation/${encodeURIComponent(input.automationID)}/Report`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.getAutomationSummaryReport',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateEmailContentForAutomation: BenchmarkEmailEndpoints['automationsUpdateEmailContentForAutomation'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['automationsUpdateEmailContentForAutomation']
		>(
			`Automation/${encodeURIComponent(input.automationID)}/Emails/${encodeURIComponent(input.automationDetailID)}/Content`,
			ctx.key,
			{ method: 'PATCH', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.automations.updateEmailContentForAutomation',
			{ ...input },
			'completed',
		);
		return response;
	};
