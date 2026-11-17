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
	input: ThinkificOperationInputs['users_list'],
): Promise<ThinkificOperationOutputs['users_list']> => {
	const parsedInput = ThinkificOperationInputSchemas.users_list.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'users.list',
		method: 'GET',
		path: `users`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.users_list,
	});
};

export const create = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['users_create'],
): Promise<ThinkificOperationOutputs['users_create']> => {
	const parsedInput = ThinkificOperationInputSchemas.users_create.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'users.create',
		method: 'POST',
		path: `users`,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.users_create,
	});
};

export const get = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['users_get'],
): Promise<ThinkificOperationOutputs['users_get']> => {
	const parsedInput = ThinkificOperationInputSchemas.users_get.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'users.get',
		method: 'GET',
		path: `users/${encodeURIComponent(String(parsedInput.path['id']))}`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.users_get,
	});
};

export const update = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['users_update'],
): Promise<ThinkificOperationOutputs['users_update']> => {
	const parsedInput = ThinkificOperationInputSchemas.users_update.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'users.update',
		method: 'PUT',
		path: `users/${encodeURIComponent(String(parsedInput.path['id']))}`,
		query: parsedInput.query,
		body: parsedInput.body,
		outputSchema: ThinkificOperationOutputSchemas.users_update,
	});
};

export const remove = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['users_remove'],
): Promise<ThinkificOperationOutputs['users_remove']> => {
	const parsedInput = ThinkificOperationInputSchemas.users_remove.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'users.remove',
		method: 'DELETE',
		path: `users/${encodeURIComponent(String(parsedInput.path['id']))}`,
		query: parsedInput.query,
		outputSchema: ThinkificOperationOutputSchemas.users_remove,
	});
};

export const getAuthentication = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['users_getAuthentication'],
): Promise<ThinkificOperationOutputs['users_getAuthentication']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.users_getAuthentication.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'users.getAuthentication',
		method: 'GET',
		path: `users/${encodeURIComponent(String(parsedInput.path['id']))}/authentications/${encodeURIComponent(String(parsedInput.path['provider']))}`,
		outputSchema: ThinkificOperationOutputSchemas.users_getAuthentication,
	});
};

export const createExpressSignInLink = async (
	ctx: ThinkificOperationContext,
	input: ThinkificOperationInputs['users_createExpressSignInLink'],
): Promise<ThinkificOperationOutputs['users_createExpressSignInLink']> => {
	const parsedInput =
		ThinkificOperationInputSchemas.users_createExpressSignInLink.parse(input);
	return runThinkificOperation(ctx, {
		operation: 'users.createExpressSignInLink',
		method: 'POST',
		path: `users/${encodeURIComponent(String(parsedInput.path['id']))}/express_sign_in_link`,
		outputSchema: ThinkificOperationOutputSchemas.users_createExpressSignInLink,
	});
};
