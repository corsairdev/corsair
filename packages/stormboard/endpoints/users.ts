import type { StormboardEndpoints } from '..';
import { call } from './call';
import {
	StormboardEndpointInputSchemas as Inputs,
	StormboardEndpointOutputSchemas as Outputs,
} from './types';

// POST /users is the public signup route; called with an API key it still
// works and returns the new account's API key, which makes it a write.
export const create: StormboardEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.create',
			input: Inputs.usersCreate,
			output: Outputs.usersCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/users',
			body,
		}),
		{
			log: () => ({ created: true }),
		},
	);

export const verify: StormboardEndpoints['usersVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.verify',
			input: Inputs.usersVerify,
			output: Outputs.usersVerify,
		},
		input,
		({ code }) => ({
			method: 'PUT',
			path: '/users/verify',
			body: { code },
		}),
	);

export const updateProfile: StormboardEndpoints['usersUpdateProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.updateProfile',
			input: Inputs.usersUpdateProfile,
			output: Outputs.usersUpdateProfile,
		},
		input,
		(body) => ({
			method: 'PUT',
			path: '/users/profile',
			body,
		}),
	);

export const getProfile: StormboardEndpoints['usersGetProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.getProfile',
			input: Inputs.usersGetProfile,
			output: Outputs.usersGetProfile,
		},
		input,
		() => ({
			method: 'GET',
			path: '/users/profile',
		}),
		{
			log: (_, result) => ({ userId: result.profile.id ?? undefined }),
		},
	);

export const getAuth: StormboardEndpoints['usersGetAuth'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.getAuth',
			input: Inputs.usersGetAuth,
			output: Outputs.usersGetAuth,
		},
		input,
		() => ({
			method: 'GET',
			path: '/users/auth',
		}),
		{
			log: (_, result) => ({ count: result.auth.length }),
		},
	);

export const test: StormboardEndpoints['usersTest'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.test',
			input: Inputs.usersTest,
			output: Outputs.usersTest,
		},
		input,
		() => ({
			method: 'GET',
			path: '/users/test',
		}),
	);

export const updateNotifications: StormboardEndpoints['usersUpdateNotifications'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'users.updateNotifications',
				input: Inputs.usersUpdateNotifications,
				output: Outputs.usersUpdateNotifications,
			},
			input,
			(body) => ({
				method: 'PUT',
				path: '/users/notifications',
				body,
			}),
		);
