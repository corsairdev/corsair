import type { AhrefsEndpoints } from '../index';
import { callAhrefs } from './request';
import type { BatchAnalysisAnalyzeResponse } from './types';

export const analyze: AhrefsEndpoints['batchAnalysisAnalyze'] = (ctx, input) =>
	callAhrefs<BatchAnalysisAnalyzeResponse>(
		ctx,
		{
			method: 'POST',
			path: '/batch-analysis/batch-analysis',
			event: 'ahrefs.batchAnalysis.analyze',
			bodyKeys: [
				'select',
				'order_by',
				'targets',
				'volume_mode',
				'country',
				'top_countries',
				'output',
			],
			logKeys: ['country'],
		},
		input,
	);
