import { logEventFromContext } from 'corsair/core';
import type { DigicertEndpoints } from '..';
import { makeDigicertRequest } from '../client';
import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './types';

export const trustLifecycleVersion: DigicertEndpoints['trustLifecycle']['version'] =
	async (ctx, input) => {
		DigicertEndpointInputSchemas.trustLifecycleVersion.parse(input);
		const response = await makeDigicertRequest(
			'trustLifecycle',
			'/mpki/api/v1/version',
			undefined,
			{
				method: 'GET',
				public: true,
				digicertOneRegion: ctx.options.digicertOneRegion,
			},
		);
		const parsed =
			DigicertEndpointOutputSchemas.trustLifecycleVersion.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.trustLifecycle.version',
			{},
			'completed',
		);
		return parsed;
	};

export const contentTrustInfoV0: DigicertEndpoints['contentTrust']['infoV0'] =
	async (ctx, input) => {
		const parsedInput =
			DigicertEndpointInputSchemas.contentTrustInfoV0.parse(input);
		const response = await makeDigicertRequest(
			'contentTrust',
			'/csc/v0/info',
			undefined,
			{
				method: 'POST',
				body: parsedInput,
				public: true,
				digicertOneRegion: ctx.options.digicertOneRegion,
			},
		);
		const parsed =
			DigicertEndpointOutputSchemas.contentTrustInfoV0.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.contentTrust.infoV0',
			{},
			'completed',
		);
		return parsed;
	};

export const contentTrustInfoV1: DigicertEndpoints['contentTrust']['infoV1'] =
	async (ctx, input) => {
		const parsedInput =
			DigicertEndpointInputSchemas.contentTrustInfoV1.parse(input);
		const response = await makeDigicertRequest(
			'contentTrust',
			'/csc/v1/info',
			undefined,
			{
				method: 'POST',
				body: parsedInput,
				public: true,
				digicertOneRegion: ctx.options.digicertOneRegion,
			},
		);
		const parsed =
			DigicertEndpointOutputSchemas.contentTrustInfoV1.parse(response);
		await logEventFromContext(
			ctx,
			'digicert.contentTrust.infoV1',
			{},
			'completed',
		);
		return parsed;
	};
