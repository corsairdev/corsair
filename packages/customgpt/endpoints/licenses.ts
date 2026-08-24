import { logEventFromContext } from 'corsair/core';
import type { CustomGPTContext, CustomGPTEndpoints } from '..';
import { makeCustomGPTRequest } from '../client';
import { cacheEntity } from './shared';
import type { CustomGPTEndpointOutputs } from './types';

/**
 * Mirrors a license into the `licenses` entity cache, keyed by its `key`
 * field — the list response exposes no separate numeric identifier.
 */
async function cacheLicense(
	ctx: CustomGPTContext,
	license: { key?: string } & Record<string, unknown>,
): Promise<void> {
	if (!license?.key || !ctx.db.licenses) return;
	await cacheEntity('license', () =>
		ctx.db.licenses.upsertByEntityId(license.key as string, {
			...license,
			key: license.key as string,
			syncedAt: new Date(),
		}),
	);
}

export const listProjectLicenses: CustomGPTEndpoints['listProjectLicenses'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['listProjectLicenses']
		>(`projects/${input.projectId}/licenses`, ctx.key, { method: 'GET' });

		for (const license of response.data ?? []) {
			await cacheLicense(ctx, license);
		}

		await logEventFromContext(
			ctx,
			'customgpt.licenses.list',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getProjectLicense: CustomGPTEndpoints['getProjectLicense'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['getProjectLicense']
		>(`projects/${input.projectId}/licenses/${input.licenseId}`, ctx.key, {
			method: 'GET',
		});

		await cacheLicense(ctx, response.license);

		await logEventFromContext(
			ctx,
			'customgpt.licenses.get',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateProjectLicense: CustomGPTEndpoints['updateProjectLicense'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['updateProjectLicense']
		>(`projects/${input.projectId}/licenses/${input.licenseId}`, ctx.key, {
			method: 'PUT',
			body: { name: input.name },
		});

		await cacheLicense(ctx, response.license);

		await logEventFromContext(
			ctx,
			'customgpt.licenses.update',
			{ projectId: input.projectId, licenseId: input.licenseId },
			'completed',
		);
		return response;
	};

export const deleteProjectLicense: CustomGPTEndpoints['deleteProjectLicense'] =
	async (ctx, input) => {
		const response = await makeCustomGPTRequest<
			CustomGPTEndpointOutputs['deleteProjectLicense']
		>(`projects/${input.projectId}/licenses/${input.licenseId}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'customgpt.licenses.delete',
			{ ...input },
			'completed',
		);
		return response;
	};
