import { logEventFromContext } from 'corsair/core';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpoints } from '../index';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './types';

export const mcaAnalysis: DocsumoEndpoints['analyticsMcaAnalysis'] = async (
	ctx,
	input,
) => {
	const {
		doc_ids,
		mca_list_db_table,
		non_mca_list_db_table,
		allow_partial,
		webhook,
	} = DocsumoEndpointInputSchemas.analyticsMcaAnalysis.parse(input);

	const response = DocsumoEndpointOutputSchemas.analyticsMcaAnalysis.parse(
		await makeDocsumoRequest(
			'/api/v1/skitty/analytics/account-summary/',
			ctx.key,
			{
				method: 'POST',
				body: {
					doc_ids,
					...(mca_list_db_table !== undefined ? { mca_list_db_table } : {}),
					...(non_mca_list_db_table !== undefined
						? { non_mca_list_db_table }
						: {}),
				},
				query: {
					...(allow_partial !== undefined ? { allow_partial } : {}),
					...(webhook !== undefined ? { webhook } : {}),
				},
			},
		),
	);

	await logEventFromContext(
		ctx,
		'docsumo.analytics.mcaAnalysis',
		{ docCount: doc_ids.length },
		'completed',
	);

	return response;
};
