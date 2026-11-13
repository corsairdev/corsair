import { logEventFromContext } from 'corsair/core';
import { makeRequest } from '../client';
import type { MakeContext } from '../index';
import * as schemas from './types';

export async function list(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.listInput>,
) {
	const input = schemas.listInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios`,
		query: {
			teamId: input['teamId'],
			organizationId: input['organizationId'],
			'id[]': input['id[]'],
			folderId: input['folderId'],
			includeSubfolders: input['includeSubfolders'],
			'labelIds[]': input['labelIds[]'],
			isActive: input['isActive'],
			concept: input['concept'],
			type: input['type'],
			deleted: input['deleted'],
			name: input['name'],
			search: input['search'],
			isinvalid: input['isinvalid'],
			islocked: input['islocked'],
			createdByUserName: input['createdByUserName'],
			updatedByUserName: input['updatedByUserName'],
			dlqCount: input['dlqCount'],
			'cols[]': input['cols[]'],
			'pg[offset]': input['pg[offset]'],
			'pg[limit]': input['pg[limit]'],
			'pg[sortBy]': input['pg[sortBy]'],
			'pg[sortDir]': input['pg[sortDir]'],
		},
	});
	const result = schemas.listOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.list', {}, 'completed');
	return result;
}
export async function create(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.createInput>,
) {
	const input = schemas.createInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios`,
		query: { 'cols[]': input['cols[]'], confirmed: input['confirmed'] },
		body: input.body,
	});
	const result = schemas.createOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.create', {}, 'completed');
	return result;
}
export async function countTrash(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.countTrashInput>,
) {
	const input = schemas.countTrashInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/trash/count`,
		query: { teamId: input['teamId'] },
	});
	const result = schemas.countTrashOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.countTrash', {}, 'completed');
	return result;
}
export async function moveToTrash(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.moveToTrashInput>,
) {
	const input = schemas.moveToTrashInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/move-to-trash`,
		query: {},
		body: input.body,
	});
	const result = schemas.moveToTrashOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.moveToTrash', {}, 'completed');
	return result;
}
export async function get(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.getInput>,
) {
	const input = schemas.getInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}`,
		query: { 'cols[]': input['cols[]'] },
	});
	const result = schemas.getOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.get', {}, 'completed');
	return result;
}
export async function deleteScenario(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.deleteInput>,
) {
	const input = schemas.deleteInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'DELETE',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}`,
		query: {},
	});
	const result = schemas.deleteOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.delete', {}, 'completed');
	return result;
}
export async function update(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.updateInput>,
) {
	const input = schemas.updateInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'PATCH',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}`,
		query: { 'cols[]': input['cols[]'], confirmed: input['confirmed'] },
		body: input.body,
	});
	const result = schemas.updateOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.update', {}, 'completed');
	return result;
}
export async function getTriggers(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.getTriggersInput>,
) {
	const input = schemas.getTriggersInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/triggers`,
		query: {},
	});
	const result = schemas.getTriggersOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.getTriggers', {}, 'completed');
	return result;
}
export async function clone(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.cloneInput>,
) {
	const input = schemas.cloneInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/clone`,
		query: {
			organizationId: input['organizationId'],
			'cols[]': input['cols[]'],
			confirmed: input['confirmed'],
			notAnalyze: input['notAnalyze'],
		},
		body: input.body,
	});
	const result = schemas.cloneOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.clone', {}, 'completed');
	return result;
}
export async function restore(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.restoreInput>,
) {
	const input = schemas.restoreInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/restore`,
		query: {},
	});
	const result = schemas.restoreOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.restore', {}, 'completed');
	return result;
}
export async function getModuleData(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.getModuleDataInput>,
) {
	const input = schemas.getModuleDataInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/data/${encodeURIComponent(String(input.moduleId))}`,
		query: {},
	});
	const result = schemas.getModuleDataOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.getModuleData',
		{},
		'completed',
	);
	return result;
}
export async function activate(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.activateInput>,
) {
	const input = schemas.activateInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/start`,
		query: {},
	});
	const result = schemas.activateOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.activate', {}, 'completed');
	return result;
}
export async function deactivate(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.deactivateInput>,
) {
	const input = schemas.deactivateInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/stop`,
		query: {},
	});
	const result = schemas.deactivateOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.deactivate', {}, 'completed');
	return result;
}
export async function run(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.runInput>,
) {
	const input = schemas.runInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/run`,
		query: {},
		body: input.body,
	});
	const result = schemas.runOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.run', {}, 'completed');
	return result;
}
export async function replay(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.replayInput>,
) {
	const input = schemas.replayInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/replay`,
		query: {},
		body: input.body,
	});
	const result = schemas.replayOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.replay', {}, 'completed');
	return result;
}
export async function getInterface(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.getInterfaceInput>,
) {
	const input = schemas.getInterfaceInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/interface`,
		query: {},
	});
	const result = schemas.getInterfaceOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.getInterface',
		{},
		'completed',
	);
	return result;
}
export async function updateInterface(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.updateInterfaceInput>,
) {
	const input = schemas.updateInterfaceInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'PATCH',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/interface`,
		query: {},
		body: input.body,
	});
	const result = schemas.updateInterfaceOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.updateInterface',
		{},
		'completed',
	);
	return result;
}
export async function getUsage(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.getUsageInput>,
) {
	const input = schemas.getUsageInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/usage`,
		query: { organizationTimezone: input['organizationTimezone'] },
	});
	const result = schemas.getUsageOutput.parse(response);
	await logEventFromContext(ctx, 'make.scenarios.getUsage', {}, 'completed');
	return result;
}
export async function listBuildVariables(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.listBuildVariablesInput>,
) {
	const input = schemas.listBuildVariablesInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/build-variables`,
		query: {},
	});
	const result = schemas.listBuildVariablesOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.listBuildVariables',
		{},
		'completed',
	);
	return result;
}
export async function addBuildVariables(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.addBuildVariablesInput>,
) {
	const input = schemas.addBuildVariablesInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/build-variables`,
		query: {},
		body: input.body,
	});
	const result = schemas.addBuildVariablesOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.addBuildVariables',
		{},
		'completed',
	);
	return result;
}
export async function updateBuildVariables(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.updateBuildVariablesInput>,
) {
	const input = schemas.updateBuildVariablesInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'PUT',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/build-variables`,
		query: {},
		body: input.body,
	});
	const result = schemas.updateBuildVariablesOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.updateBuildVariables',
		{},
		'completed',
	);
	return result;
}
export async function deleteBuildVariable(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.deleteBuildVariableInput>,
) {
	const input = schemas.deleteBuildVariableInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'DELETE',
		path: `/scenarios/${encodeURIComponent(String(input.scenarioId))}/build-variables`,
		query: { value: input['value'] },
	});
	const result = schemas.deleteBuildVariableOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.deleteBuildVariable',
		{},
		'completed',
	);
	return result;
}
export async function listAiAgents(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.listAiAgentsInput>,
) {
	const input = schemas.listAiAgentsInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'GET',
		path: `/scenarios/ai-agents`,
		query: {
			teamId: input['teamId'],
			'pg[offset]': input['pg[offset]'],
			'pg[limit]': input['pg[limit]'],
		},
	});
	const result = schemas.listAiAgentsOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.listAiAgents',
		{},
		'completed',
	);
	return result;
}
export async function getAiAgentModules(
	ctx: MakeContext,
	raw: import('zod').z.infer<typeof schemas.getAiAgentModulesInput>,
) {
	const input = schemas.getAiAgentModulesInput.parse(raw);
	const response = await makeRequest(ctx, {
		method: 'POST',
		path: `/scenarios/ai-agents/modules`,
		query: {
			teamId: input['teamId'],
			'pg[offset]': input['pg[offset]'],
			'pg[limit]': input['pg[limit]'],
		},
		body: input.body,
	});
	const result = schemas.getAiAgentModulesOutput.parse(response);
	await logEventFromContext(
		ctx,
		'make.scenarios.getAiAgentModules',
		{},
		'completed',
	);
	return result;
}
