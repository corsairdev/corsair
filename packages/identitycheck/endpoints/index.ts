import type { BinaryResponse } from 'corsair/http';
import { toFileOutput } from 'corsair/http';
import type { IdentityCheckEndpoints } from '..';
import { makeIdentityCheckRequest } from '../client';
import {
	CreateInputSchema,
	GetInputSchema,
	ImageInputSchema,
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
// The image is the captured file itself: read it as bytes so a JPEG or PDF
// survives instead of being decoded as text.
export const image: IdentityCheckEndpoints['image'] = async (ctx, input) => {
	const { verificationId, imageId } = ImageInputSchema.parse(input);
	const { bytes, contentType } = (await makeIdentityCheckRequest(
		'GET',
		`/api/v1/verification/image/${encodeURIComponent(verificationId)}/${encodeURIComponent(imageId)}`,
		ctx.key,
		undefined,
		'binary',
	)) as BinaryResponse;
	return toFileOutput(bytes, contentType);
};
