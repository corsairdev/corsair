import type { IdentityCheckEndpoints } from '..';
import { makeIdentityCheckRequest } from '../client';
import {
	CreateInputSchema,
	GetInputSchema,
	VerificationObjectSchema,
} from './types';

export const create: IdentityCheckEndpoints['create'] = async (ctx, input) =>
	VerificationObjectSchema.parse(
		await makeIdentityCheckRequest(
			'POST',
			'/api/v1/verification/create',
			ctx.key,
			CreateInputSchema.parse(input).body,
		),
	);
export const sms: IdentityCheckEndpoints['sms'] = async (ctx, input) =>
	VerificationObjectSchema.parse(
		await makeIdentityCheckRequest(
			'POST',
			'/api/v1/verification/sms',
			ctx.key,
			CreateInputSchema.parse(input).body,
		),
	);
export const kyb: IdentityCheckEndpoints['kyb'] = async (ctx, input) =>
	VerificationObjectSchema.parse(
		await makeIdentityCheckRequest(
			'POST',
			'/api/v1/verification/namescan/kyb',
			ctx.key,
			CreateInputSchema.parse(input).body,
		),
	);
export const tranche2: IdentityCheckEndpoints['tranche2'] = async (
	ctx,
	input,
) =>
	VerificationObjectSchema.parse(
		await makeIdentityCheckRequest(
			'POST',
			'/api/v1/verification/tranche2',
			ctx.key,
			CreateInputSchema.parse(input).body,
		),
	);
export const get: IdentityCheckEndpoints['get'] = async (ctx, input) =>
	VerificationObjectSchema.parse(
		await makeIdentityCheckRequest(
			'GET',
			`/api/v1/verification/info/${encodeURIComponent(GetInputSchema.parse(input).id)}`,
			ctx.key,
		),
	);
