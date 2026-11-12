import type { RoboflowEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	RoboflowEndpointInputSchemas as Inputs,
	RoboflowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The root route answers `200` whether or not a key is valid: only `workspace`
 * appears for a valid one. So the check here is not the status but the presence of
 * a workspace, and `authenticated` reports it.
 *
 * Live, with no key at all, the body is the welcome text and nothing else.
 */
export const account: RoboflowEndpoints['accountGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({ method: 'GET', path: '/', replayable: true }),
		{
			// unknown: the raw body is the root answer until the output schema
			// validates it; `workspace` is the only authentication signal it carries.
			shape: (raw) => {
				const record =
					raw !== null && typeof raw === 'object' && !Array.isArray(raw)
						? (raw as Record<string, unknown>)
						: {};
				const workspace =
					typeof record.workspace === 'string' ? record.workspace : null;
				return { ...record, authenticated: workspace !== null };
			},
			log: (_, result) => ({
				authenticated: result.authenticated,
				workspace: result.workspace ?? undefined,
			}),
		},
	);

export const workspace: RoboflowEndpoints['workspaceGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workspace.get',
			input: Inputs.workspaceGet,
			output: Outputs.workspaceGet,
		},
		input,
		({ workspace: slug }) => ({
			method: 'GET',
			path: `/${segment(slug)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				projects: result.workspace?.projects?.length ?? 0,
				members: result.workspace?.members ?? undefined,
			}),
		},
	);

export const project: RoboflowEndpoints['projectGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'project.get',
			input: Inputs.projectGet,
			output: Outputs.projectGet,
		},
		input,
		({ workspace: slug, project: name }) => ({
			method: 'GET',
			path: `/${segment(slug)}/${segment(name)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({
				images: result.project?.images ?? undefined,
				unannotated: result.project?.unannotated ?? undefined,
				versions: result.versions?.length ?? 0,
			}),
		},
	);

/**
 * Creates a project.
 *
 * `annotation` is the group name, and projects sharing it share classes, which is
 * what lets a second project reuse an existing label set. On a public plan a
 * `license` is required, because a private project cannot be created there; the
 * field description says so rather than the plugin guessing at a default.
 */
export const create: RoboflowEndpoints['projectCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectCreate,
			output: Outputs.projectCreate,
		},
		input,
		({ workspace: slug, name, type, annotation, license, group }) => ({
			method: 'POST',
			path: `/${segment(slug)}/projects`,
			body: { name, type, annotation, license, group },
			// Two creates make two projects; a name is not a unique key.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				projectId: result.id ?? undefined,
				type: parsed.type,
			}),
		},
	);

export const remove: RoboflowEndpoints['projectDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectDelete,
			output: Outputs.projectDelete,
		},
		input,
		({ workspace: slug, project: name }) => ({
			method: 'DELETE',
			path: `/${segment(slug)}/${segment(name)}`,
			// A second delete finds nothing; the project is already gone.
			replayable: false,
		}),
		{
			shape: () => ({}),
			log: (parsed) => ({ project: parsed.project }),
		},
	);

export const version: RoboflowEndpoints['versionGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'versions.get',
			input: Inputs.versionGet,
			output: Outputs.versionGet,
		},
		input,
		({ workspace: slug, project: name, version: number }) => ({
			method: 'GET',
			path: `/${segment(slug)}/${segment(name)}/${segment(number)}`,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				version: parsed.version,
				images: result.version?.images ?? undefined,
				generating: result.version?.generating ?? undefined,
			}),
		},
	);

export const deleteVersion: RoboflowEndpoints['versionDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'versions.delete',
			input: Inputs.versionDelete,
			output: Outputs.versionDelete,
		},
		input,
		({ workspace: slug, project: name, version: number }) => ({
			method: 'DELETE',
			path: `/${segment(slug)}/${segment(name)}/${segment(number)}`,
			// A second delete finds nothing; the version is already gone.
			replayable: false,
		}),
		{
			shape: () => ({}),
			log: (parsed) => ({ project: parsed.project, version: parsed.version }),
		},
	);

/**
 * Lists a project's trained models.
 *
 * A model's `url` is the ID `infer` takes, so this is the route that tells a caller
 * what it can run.
 */
export const models: RoboflowEndpoints['modelsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'models.list',
			input: Inputs.modelsList,
			output: Outputs.modelsList,
		},
		input,
		({ workspace: slug, project: name, group }) => ({
			method: 'GET',
			path: `/${segment(slug)}/${segment(name)}/models`,
			query: { group },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				models: result.length,
				finished: result.filter((model) => model.train?.status === 'finished')
					.length,
			}),
		},
	);

/**
 * Uploads one image to a project, by URL or as base64.
 *
 * The upload route takes the project slug. For a workspace/project ID, extract
 * the slug; the API key selects the workspace. The documented workspace alias
 * returns 404 on the live host.
 */
export const upload: RoboflowEndpoints['imageUpload'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'images.upload',
			input: Inputs.imageUpload,
			output: Outputs.imageUpload,
		},
		input,
		({ project: projectId, image, name, batch, tag }) => ({
			method: 'POST',
			path: `/dataset/${segment(projectId.split('/').at(-1) ?? projectId)}/upload`,
			query: {
				name,
				batch,
				tag: tag?.join(','),
				image: /^https?:\/\//i.test(image) ? image : undefined,
			},
			body: /^https?:\/\//i.test(image) ? undefined : image,
			mediaType: 'application/x-www-form-urlencoded',
			// A re-upload of the same image is answered as a duplicate with no new
			// image, so a retry cannot duplicate it, but the upload is also billed, so
			// it is not resent.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				imageId: result.id ?? undefined,
				duplicate: result.duplicate ?? false,
			}),
		},
	);
