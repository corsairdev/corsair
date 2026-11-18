import { makeLapostaRequest } from '../client';
import type { GetReportInput, GetReportOutput } from './types';
import { GetReportOutputSchema } from './types';

export const reports = {
	get: async (
		input: GetReportInput,
		apiKey?: string,
	): Promise<GetReportOutput> => {
		const raw = await makeLapostaRequest<unknown>(
			`/report/${encodeURIComponent(input.campaign_id)}`,
			apiKey,
			{ method: 'GET' },
		);
		return GetReportOutputSchema.parse(raw);
	},
};
