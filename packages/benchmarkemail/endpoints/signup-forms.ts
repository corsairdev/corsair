/**
 * Benchmark Email signupForms endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Signup Form folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const copySignupForm: BenchmarkEmailEndpoints['signupFormsCopySignupForm'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsCopySignupForm']
		>(`SignupForm/${encodeURIComponent(input.id)}/Copy`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.copySignupForm',
			{ ...input },
			'completed',
		);
		return response;
	};

export const createSignupForm: BenchmarkEmailEndpoints['signupFormsCreateSignupForm'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsCreateSignupForm']
		>(`SignupForm/`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.createSignupForm',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getHTMLSignupForm: BenchmarkEmailEndpoints['signupFormsGetHTMLSignupForm'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetHTMLSignupForm']
		>(
			`Integration/Tumbler/${encodeURIComponent(input.listBuilderID)}`,
			ctx.key,
			{ method: 'POST', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getHTMLSignupForm',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getMagentoHTMLSelected: BenchmarkEmailEndpoints['signupFormsGetMagentoHTMLSelected'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetMagentoHTMLSelected']
		>(
			`Integration/Magento/${encodeURIComponent(input.listBuilderID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getMagentoHTMLSelected',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getMagentoHTMLDropdown: BenchmarkEmailEndpoints['signupFormsGetMagentoHTMLDropdown'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetMagentoHTMLDropdown']
		>(`Integration/Magento`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getMagentoHTMLDropdown',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormButtonCode: BenchmarkEmailEndpoints['signupFormsGetSignupFormButtonCode'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormButtonCode']
		>(`SignupForm/${encodeURIComponent(input.id)}/Code/Button`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormButtonCode',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormContactFields: BenchmarkEmailEndpoints['signupFormsGetSignupFormContactFields'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormContactFields']
		>(`SignupForm/${encodeURIComponent(input.id)}/ContactFields`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormContactFields',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormDetails: BenchmarkEmailEndpoints['signupFormsGetSignupFormDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormDetails']
		>(`SignupForm/${encodeURIComponent(input.id)}`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormLink: BenchmarkEmailEndpoints['signupFormsGetSignupFormLink'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormLink']
		>(`SignupForm/${encodeURIComponent(input.id)}/Link`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormLink',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormList: BenchmarkEmailEndpoints['signupFormsGetSignupFormList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormList']
		>(`SignupForm/`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormsForContactList: BenchmarkEmailEndpoints['signupFormsGetSignupFormsForContactList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormsForContactList']
		>(`Contact/${encodeURIComponent(input.listID)}/ListbuilderLists`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormsForContactList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormForUnbounce: BenchmarkEmailEndpoints['signupFormsGetSignupFormForUnbounce'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormForUnbounce']
		>(`Client/Integrations/SignupForm/Unbounce`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormForUnbounce',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormTumbler: BenchmarkEmailEndpoints['signupFormsGetSignupFormTumbler'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormTumbler']
		>(`Client/Integrations/SignupForm/Tumbler`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormTumbler',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSignupFormForMagento: BenchmarkEmailEndpoints['signupFormsGetSignupFormForMagento'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetSignupFormForMagento']
		>(`Client/Integrations/SignupForm/Magento`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getSignupFormForMagento',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getTemplatesForSignupFormClassic: BenchmarkEmailEndpoints['signupFormsGetTemplatesForSignupFormClassic'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetTemplatesForSignupFormClassic']
		>(`SignupForm/Template`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getTemplatesForSignupFormClassic',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getTumblerLists: BenchmarkEmailEndpoints['signupFormsGetTumblerLists'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsGetTumblerLists']
		>(`Integration/Tumbler`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.getTumblerLists',
			{ ...input },
			'completed',
		);
		return response;
	};

export const sendTestEmailForSignupForm: BenchmarkEmailEndpoints['signupFormsSendTestEmailForSignupForm'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['signupFormsSendTestEmailForSignupForm']
		>(`SignupForm/${encodeURIComponent(input.id)}/Test`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.signupForms.sendTestEmailForSignupForm',
			{ ...input },
			'completed',
		);
		return response;
	};
