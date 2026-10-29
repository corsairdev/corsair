import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

export const create: ExtractaaiEndpoints['classificationCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['classificationCreate']
	>('documentClassification/createClassification', ctx.key, {
		method: 'POST',
		body: { classificationDetails: input.classificationDetails },
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.classificationCreate.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai classification.create response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};

export const view: ExtractaaiEndpoints['classificationView'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['classificationView']
	>('documentClassification/viewClassification', ctx.key, {
		method: 'POST',
		body: { classificationId: input.classificationId },
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.classificationView.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai classification.view response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};

export const update: ExtractaaiEndpoints['classificationUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['classificationUpdate']
	>('documentClassification/updateClassification', ctx.key, {
		method: 'PATCH',
		body: {
			classificationId: input.classificationId,
			classificationDetails: input.classificationDetails,
		},
	});

	const parsed =
		ExtractaaiEndpointOutputSchemas.classificationUpdate.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai classification.update response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};

export const deleteClassification: ExtractaaiEndpoints['classificationDelete'] =
	async (ctx, input) => {
		const response = await makeExtractaaiRequest<
			ExtractaaiEndpointOutputs['classificationDelete']
		>('documentClassification/deleteClassification', ctx.key, {
			method: 'DELETE',
			body: { classificationId: input.classificationId },
		});

		const parsed =
			ExtractaaiEndpointOutputSchemas.classificationDelete.safeParse(response);
		if (parsed.success === false) {
			throw new Error(
				`Extracta.ai classification.delete response failed schema validation: ${parsed.error.message}`,
			);
		}
		return parsed.data;
	};
