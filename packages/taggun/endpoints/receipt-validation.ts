import type { TaggunEndpoints } from '..';
import { call, compact } from './call';
import {
	InlineValidationRulesSchema,
	TaggunEndpointInputSchemas as Inputs,
	TaggunEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The inline rules travel as a JSON string beside the file, because a multipart
 * field cannot carry nested objects. `validation` is already an object here, so
 * it is serialised once with every `undefined` dropped.
 */
export const file: TaggunEndpoints['receiptValidateFile'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'receiptValidation.file',
			input: Inputs.receiptValidateFile,
			output: Outputs.receiptValidateFile,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/validation/v1/receipt-validation/file',
			formData: compact({
				file: parsed.file,
				validation: JSON.stringify(compact(parsed.validation)),
				additionalExtractionFields: parsed.additionalExtractionFields
					? JSON.stringify(parsed.additionalExtractionFields)
					: undefined,
				containerId: parsed.containerId,
				incognito: parsed.incognito,
				ipAddress: parsed.ipAddress,
				near: parsed.near,
				referenceId: parsed.referenceId,
				userId: parsed.userId,
				subAccountId: parsed.subAccountId,
				language: parsed.language,
			}),
		}),
		{
			log: (_parsed, result) => ({
				trackingId: result.trackingId,
				successful: result.successful,
			}),
		},
	);

export const url: TaggunEndpoints['receiptValidateUrl'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'receiptValidation.url',
			input: Inputs.receiptValidateUrl,
			output: Outputs.receiptValidateUrl,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/validation/v1/receipt-validation/url',
			body: compact({
				url: parsed.url,
				headers: parsed.headers,
				validation: compact(parsed.validation),
				additionalExtractionFields: parsed.additionalExtractionFields,
				containerId: parsed.containerId,
				incognito: parsed.incognito,
				ipAddress: parsed.ipAddress,
				near: parsed.near,
				referenceId: parsed.referenceId,
				userId: parsed.userId,
				subAccountId: parsed.subAccountId,
				language: parsed.language,
			}),
		}),
		{
			log: (_parsed, result) => ({
				trackingId: result.trackingId,
				successful: result.successful,
			}),
		},
	);

export { InlineValidationRulesSchema };
