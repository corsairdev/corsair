import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheProject, evictEntity } from './persist';
import { accountPath, mailtrapCall } from './shared';
import type { MailtrapProject } from './types';

/** Lists projects and their sandbox inboxes the token can access. */
export const list: MailtrapEndpoints['projectsList'] = async (ctx) => {
	const path = await accountPath(ctx, '/projects');
	const result = await mailtrapCall<MailtrapProject[]>(ctx, path);

	await Promise.all(
		(result ?? []).map((project) => cacheProject(ctx.db?.projects, project)),
	);

	await logEventFromContext(ctx, 'mailtrap.projects.list', {}, 'completed');
	return result ?? [];
};

/** Gets a project and its inboxes by id. */
export const get: MailtrapEndpoints['projectsGet'] = async (ctx, input) => {
	const path = await accountPath(ctx, `/projects/${input.project_id}`);
	const result = await mailtrapCall<MailtrapProject>(ctx, path);

	await cacheProject(ctx.db?.projects, result);

	await logEventFromContext(
		ctx,
		'mailtrap.projects.get',
		auditPayload(input, ['project_id']),
		'completed',
	);
	return result;
};

/**
 * Renames a project.
 *
 * Wrapped under a top-level `project` key — confirmed live, matching
 * `mailtrap@4.8.0`'s `ProjectsApi.update`.
 */
export const update: MailtrapEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/projects/${input.project_id}`);
	const result = await mailtrapCall<MailtrapProject>(ctx, path, {
		method: 'PATCH',
		body: { project: { name: input.name } },
	});

	await cacheProject(ctx.db?.projects, result);

	await logEventFromContext(
		ctx,
		'mailtrap.projects.update',
		auditPayload(input, ['project_id']),
		'completed',
	);
	return result;
};

/**
 * Permanently deletes a project and every inbox in it. [DESTRUCTIVE]
 *
 * Unlike every other delete in this catalog (confirmed empty-body 204 for
 * contacts, contact lists, contact fields, email templates and sending
 * domains), the OSS catalog documents this operation as returning the
 * deleted project's id - see `MailtrapProjectDeleteResultSchema` in
 * `types.ts` for why that could not be independently confirmed live.
 */
export const remove: MailtrapEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/projects/${input.project_id}`);
	await mailtrapCall(ctx, path, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'mailtrap.projects.delete',
		auditPayload(input, ['project_id']),
		'completed',
	);

	await evictEntity(ctx.db?.projects, String(input.project_id), 'project');

	return { id: input.project_id };
};
