import type { ExcelEndpoints } from '../index';
import { sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import { FunctionsCalculateInputSchema, functionResultSchema } from './types';

export const calculate: ExcelEndpoints['functionsCalculate'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.functions.calculate',
		FunctionsCalculateInputSchema,
		functionResultSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/functions/${encodeURIComponent(body.name)}`,
			headers: sessionHeaders(body.sessionId),
			body: body.args ?? {},
		}),
		(body, response) => ({
			name: body.name,
			error: response.error ?? null,
		}),
	);
};
