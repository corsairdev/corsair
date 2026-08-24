import type {
	TogglClientEntity,
	TogglProjectEntity,
	TogglTagEntity,
	TogglWorkspaceEntity,
} from '../schema/database';
import type {
	TogglClient,
	TogglProject,
	TogglTag,
	TogglWorkspace,
} from './types';

/**
 * Minimal structural view of a Corsair entity store. Only the two operations
 * the Toggl endpoints need are declared, so the helpers below stay usable
 * whatever else the concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/**
 * Caching is best-effort: a plugin call must not fail because the local mirror
 * could not be written. Failures are warned about and swallowed, matching the
 * behaviour of the other provider plugins.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[TOGGL] failed to cache ${what}:`, error);
	}
}

/** Mirrors a workspace into the local cache. */
export async function cacheWorkspace(
	store: EntityStore<TogglWorkspaceEntity> | undefined,
	workspace: TogglWorkspace | undefined | null,
) {
	if (!store || !workspace) return;
	await safely(
		() =>
			store.upsertByEntityId(String(workspace.id), {
				id: workspace.id,
				organization_id: workspace.organization_id,
				name: workspace.name,
				premium: workspace.premium,
				role: workspace.role,
				default_currency: workspace.default_currency,
				at: workspace.at ? new Date(workspace.at) : null,
			}),
		`workspace ${workspace.id}`,
	);
}

/**
 * Mirrors a client into the local cache, mapping Toggl's `wid` onto
 * `workspace_id`.
 */
export async function cacheClient(
	store: EntityStore<TogglClientEntity> | undefined,
	client: TogglClient | undefined | null,
) {
	if (!store || !client) return;
	await safely(
		() =>
			store.upsertByEntityId(String(client.id), {
				id: client.id,
				// Toggl names the workspace id `wid` on client payloads.
				workspace_id: client.wid,
				name: client.name,
				archived: client.archived,
				at: client.at ? new Date(client.at) : null,
			}),
		`client ${client.id}`,
	);
}

/** Mirrors a project into the local cache. */
export async function cacheProject(
	store: EntityStore<TogglProjectEntity> | undefined,
	project: TogglProject | undefined | null,
) {
	if (!store || !project) return;
	await safely(
		() =>
			store.upsertByEntityId(String(project.id), {
				id: project.id,
				workspace_id: project.workspace_id,
				client_id: project.client_id,
				name: project.name,
				active: project.active,
				billable: project.billable,
				color: project.color,
				at: project.at ? new Date(project.at) : null,
			}),
		`project ${project.id}`,
	);
}

/** Mirrors a tag into the local cache. */
export async function cacheTag(
	store: EntityStore<TogglTagEntity> | undefined,
	tag: TogglTag | undefined | null,
) {
	if (!store || !tag) return;
	await safely(
		() =>
			store.upsertByEntityId(String(tag.id), {
				id: tag.id,
				workspace_id: tag.workspace_id,
				name: tag.name,
				at: tag.at ? new Date(tag.at) : null,
			}),
		`tag ${tag.id}`,
	);
}

/**
 * Drops a cached record after the provider confirmed the delete.
 *
 * This takes only the delete half of the store: referencing the upsert
 * signature here would make the parameter invariant in the entity type and
 * reject the concrete per-entity clients.
 */
type DeletableStore = {
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/** Drops a cached record once the provider confirmed the delete. */
export async function evictEntity(
	store: DeletableStore | undefined,
	id: number,
	what: string,
) {
	const remove = store?.deleteByEntityId;
	if (!remove) return;
	await safely(() => remove(String(id)), `${what} ${id}`);
}
