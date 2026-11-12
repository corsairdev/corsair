import { AuthMissingError } from 'corsair/core';
import { isValidProjectId, requireDataset, SanityError } from '../client';

/** The dataset used when neither the call, the plugin options nor the account name one. */
export const DEFAULT_DATASET = 'production';

type ProjectContext = {
	options?: { projectId?: string; dataset?: string };
	keys?: {
		get_project_id?: () => Promise<string | null | undefined>;
		get_dataset?: () => Promise<string | null | undefined>;
	};
};

/**
 * The project every data call goes to: `sanity({ projectId })`, else the one
 * stored on the account. Raises rather than returning '' so a missing id shows
 * up as the missing setting it is, not as a request to `https://.api.sanity.io`.
 */
export async function resolveProjectId(ctx: ProjectContext): Promise<string> {
	const projectId = (
		ctx.options?.projectId ??
		(await ctx.keys?.get_project_id?.()) ??
		''
	).trim();
	if (!projectId) {
		throw new AuthMissingError(
			'sanity',
			'project_id',
			'[auth-missing:sanity:project_id]: a Sanity project id is required. Find it at sanity.io/manage or in sanity.config.ts, and store it with keys.set_project_id.',
		);
	}
	if (!isValidProjectId(projectId)) {
		throw new SanityError(
			'The stored Sanity project id must be lowercase letters and digits, for example abc123de.',
			'invalid_input',
		);
	}
	return projectId;
}

/** The call's dataset, else the plugin's or the account's, else `production`. */
export async function resolveDataset(
	ctx: ProjectContext,
	fromInput?: string,
): Promise<string> {
	const dataset =
		fromInput ??
		ctx.options?.dataset ??
		((await ctx.keys?.get_dataset?.()) || undefined) ??
		DEFAULT_DATASET;
	return requireDataset(dataset.trim());
}

export async function resolveTarget(ctx: ProjectContext, dataset?: string) {
	return {
		projectId: await resolveProjectId(ctx),
		dataset: await resolveDataset(ctx, dataset),
	};
}

export const DRAFTS_PREFIX = 'drafts.';
export const VERSIONS_PREFIX = 'versions.';

/** The published id behind a draft or release version id. */
export function publishedIdOf(id: string): string {
	if (id.startsWith(DRAFTS_PREFIX)) return id.slice(DRAFTS_PREFIX.length);
	if (id.startsWith(VERSIONS_PREFIX)) {
		const rest = id.slice(VERSIONS_PREFIX.length);
		const dot = rest.indexOf('.');
		return dot === -1 ? rest : rest.slice(dot + 1);
	}
	return id;
}

export function draftIdOf(id: string): string {
	return `${DRAFTS_PREFIX}${publishedIdOf(id)}`;
}
