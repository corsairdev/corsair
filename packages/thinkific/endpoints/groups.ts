import type { ThinkificOperationContext } from './request';
import { runThinkificOperation } from './request';
import {
	ThinkificOperationInputSchemas,
	ThinkificOperationOutputSchemas,
} from './schemas';
import type {
	ThinkificOperationInputs,
	ThinkificOperationOutputs,
} from './types';

export const list = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groups_list'],
): Promise<ThinkificOperationOutputs['groups_list']> => {
	const parsedInput = ThinkificOperationInputSchemas.groups_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groups.list',
		method: 'GET',
		path: `groups`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.groups_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groups_create'],
): Promise<ThinkificOperationOutputs['groups_create']> => {
	const parsedInput = ThinkificOperationInputSchemas.groups_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groups.create',
		method: 'POST',
		path: `groups`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.groups_create,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groups_get'],
): Promise<ThinkificOperationOutputs['groups_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.groups_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groups.get',
		method: 'GET',
		path: `groups/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.groups_get,
	});
};

export const remove = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groups_remove'],
): Promise<ThinkificOperationOutputs['groups_remove']> => {
	const parsedInput = ThinkificOperationInputSchemas.groups_remove.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groups.remove',
		method: 'DELETE',
		path: `groups/${encodeURIComponent(String(parsedInput.path['id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.groups_remove,
	});
};

export const listAnalysts = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groups_listAnalysts'],
): Promise<ThinkificOperationOutputs['groups_listAnalysts']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.groups_listAnalysts.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groups.listAnalysts',
		method: 'GET',
		path: `groups/${encodeURIComponent(String(parsedInput.path['group_id']))}/analysts`,
		outputSchema: ThinkificOperationOutputSchemas.groups_listAnalysts,
	});
};

export const assignAnalysts = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groups_assignAnalysts'],
): Promise<ThinkificOperationOutputs['groups_assignAnalysts']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.groups_assignAnalysts.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groups.assignAnalysts',
		method: 'POST',
		path: `groups/${encodeURIComponent(String(parsedInput.path['group_id']))}/analysts`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.groups_assignAnalysts,
	});
};

export const removeAnalyst = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['groups_removeAnalyst'],
): Promise<ThinkificOperationOutputs['groups_removeAnalyst']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.groups_removeAnalyst.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'groups.removeAnalyst',
		method: 'DELETE',
		path: `groups/${encodeURIComponent(String(parsedInput.path['group_id']))}/analysts/${encodeURIComponent(String(parsedInput.path['user_id']))}`,
		outputSchema: ThinkificOperationOutputSchemas.groups_removeAnalyst,
	});
};
