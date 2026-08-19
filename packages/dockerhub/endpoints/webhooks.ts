import { logEventFromContext } from 'corsair/core';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

export const list: DockerHubEndpoints['webhooksList'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/webhook_pipeline/`,
		{ method: 'GET', query: pageQuery(input) },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.webhooks.list',
		summarize(input),
		'completed',
	);
	return response;
};

export const get: DockerHubEndpoints['webhooksGet'] = async (ctx, input) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/webhook_pipeline/${encodeURIComponent(String(input.webhookId))}/`,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.webhooks.get',
		summarize(input),
		'completed',
	);
	return response;
};

/**
 * Two-step create: register webhook name, then attach hook URL.
 * If the hook-URL step fails, delete the orphaned webhook pipeline entry.
 */
export const create: DockerHubEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const base = `/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/webhook_pipeline/`;
	const created = await req<{ id?: string | number; name?: string }>(
		ctx,
		base,
		{
			method: 'POST',
			body: { name: input.webhookName },
		},
	);
	const id = created.id;
	// Without an id we cannot attach hookUrl — do not log a false "completed"
	if (id === undefined || id === null) {
		await logEventFromContext(
			ctx,
			'dockerhub.webhooks.create',
			summarize(input),
			'failed',
		);
		throw new Error(
			'Docker Hub webhook pipeline create returned no id; hookUrl was not registered',
		);
	}
	try {
		const withHook = await req(
			ctx,
			`${base}${encodeURIComponent(String(id))}/hooks/`,
			{
				method: 'POST',
				body: { hook_url: input.hookUrl },
			},
		);
		const response = { webhook: created, hook: withHook };
		await logEventFromContext(
			ctx,
			'dockerhub.webhooks.create',
			summarize(input),
			'completed',
		);
		return response;
	} catch (error) {
		// Rollback orphaned pipeline if attaching the hook URL fails
		try {
			await req(ctx, `${base}${encodeURIComponent(String(id))}/`, {
				method: 'DELETE',
				okOn404: true,
			});
		} catch {
			// best-effort cleanup — surface the original hook error
		}
		await logEventFromContext(
			ctx,
			'dockerhub.webhooks.create',
			summarize(input),
			'failed',
		);
		throw error;
	}
};

export const deleteWebhook: DockerHubEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const response = await req(
		ctx,
		`/repositories/${encodeURIComponent(input.namespace)}/${encodeURIComponent(input.name)}/webhook_pipeline/${encodeURIComponent(String(input.webhookId))}/`,
		{ method: 'DELETE', okOn404: true },
	);
	await logEventFromContext(
		ctx,
		'dockerhub.webhooks.delete',
		summarize(input),
		'completed',
	);
	return response;
};
