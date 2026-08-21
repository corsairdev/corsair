import { makeStudioByAI21LabsRequest } from '../client';
import type { StudioByAI21LabsEndpoints } from '../index';

export const listModels: StudioByAI21LabsEndpoints['listModels'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		'models',
		input,
	);
	return response as any;
};

export const listAvailableModels: StudioByAI21LabsEndpoints['listAvailableModels'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			'models/available',
			input,
		);
		return response as any;
	};

export const listWorkspaceModels: StudioByAI21LabsEndpoints['listWorkspaceModels'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			'workspace/models',
			input,
		);
		return response as any;
	};
