import { makeStudioByAI21LabsRequest } from '../client';
import type { StudioByAI21LabsEndpoints } from '../index';

export const createAssistant: StudioByAI21LabsEndpoints['createAssistant'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'assistants',
			input,
		);
		return response as any;
	};

export const createAssistantPlan: StudioByAI21LabsEndpoints['createAssistantPlan'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'assistant-plans',
			input,
		);
		return response as any;
	};

export const createAssistantRoute: StudioByAI21LabsEndpoints['createAssistantRoute'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'assistant-routes',
			input,
		);
		return response as any;
	};

export const deleteAssistant: StudioByAI21LabsEndpoints['deleteAssistant'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'DELETE',
			`assistants/${input.id}`,
			input,
		);
		return response as any;
	};

export const deleteAssistantRoute: StudioByAI21LabsEndpoints['deleteAssistantRoute'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'DELETE',
			`assistant-routes/${input.id}`,
			input,
		);
		return response as any;
	};

export const getAssistant: StudioByAI21LabsEndpoints['getAssistant'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		`assistants/${input.id}`,
	);
	return response as any;
};

export const getAssistantRoute: StudioByAI21LabsEndpoints['getAssistantRoute'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			`assistant-routes/${input.id}`,
		);
		return response as any;
	};

export const getAssistantsByMcp: StudioByAI21LabsEndpoints['getAssistantsByMcp'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			'assistants/mcp',
			{ mcpId: input.mcpId },
		);
		return response as any;
	};

export const getPlan: StudioByAI21LabsEndpoints['getPlan'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		`assistant-plans/${input.id}`,
	);
	return response as any;
};

export const listAssistants: StudioByAI21LabsEndpoints['listAssistants'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			'assistants',
			input,
		);
		return response as any;
	};

export const listPlans: StudioByAI21LabsEndpoints['listPlans'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		'assistant-plans',
		input,
	);
	return response as any;
};

export const modifyAssistant: StudioByAI21LabsEndpoints['modifyAssistant'] =
	async (ctx, input) => {
		const { id, ...body } = input;
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'PUT',
			`assistants/${id}`,
			body,
		);
		return response as any;
	};

export const modifyAssistantPlan: StudioByAI21LabsEndpoints['modifyAssistantPlan'] =
	async (ctx, input) => {
		const { id, ...body } = input;
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'PUT',
			`assistant-plans/${id}`,
			body,
		);
		return response as any;
	};

export const modifyAssistantRoute: StudioByAI21LabsEndpoints['modifyAssistantRoute'] =
	async (ctx, input) => {
		const { id, ...body } = input;
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'PUT',
			`assistant-routes/${id}`,
			body,
		);
		return response as any;
	};

export const runAssistant: StudioByAI21LabsEndpoints['runAssistant'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'POST',
		`assistants/${id}/run`,
		body,
	);
	return response as any;
};

export const validatePlan: StudioByAI21LabsEndpoints['validatePlan'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'POST',
		'assistant-plans/validate',
		input,
	);
	return response as any;
};
