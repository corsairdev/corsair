import { makeLapostaRequest } from '../client';
import type { LapostaPluginContext } from '../index';
import type {
	GetReportInput,
	GetReportOutput,
	GetReportsInput,
	GetReportsOutput,
} from './types';
import {
	GetReportOutputSchema,
	GetReportsOutputSchema,
	LapostaEndpointInputSchemas,
} from './types';

export const reports = {
	list: async (
		ctx: LapostaPluginContext,
		input: GetReportsInput,
	): Promise<GetReportsOutput> => {
		const parsedInput =
			LapostaEndpointInputSchemas['reports.list'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>('/report', ctx.key, {
			method: 'GET',
			query: parsedInput,
		});
		return GetReportsOutputSchema.parse(raw);
	},

	get: async (
		ctx: LapostaPluginContext,
		input: GetReportInput,
	): Promise<GetReportOutput> => {
		const parsedInput = LapostaEndpointInputSchemas['reports.get'].parse(input);
		// unknown because raw API response is unvalidated before Zod parsing.
		const raw = await makeLapostaRequest<unknown>(
			`/report/${encodeURIComponent(parsedInput.campaign_id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		return GetReportOutputSchema.parse(raw);
	},
};
