import type {
	BotpressBotEntity,
	BotpressIntegrationEntity,
	BotpressWorkspaceEntity,
} from '../schema/database';
import type {
	BotpressBot,
	BotpressIntegration,
	BotpressWorkspace,
} from './types';

/**
 * Minimal structural view of a Corsair entity store. Only the two operations
 * the Botpress endpoints need are declared, so the helpers below stay usable
 * whatever else the concrete store exposes.
 */
type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

/**
 * Caching is best-effort: a plugin call must not fail because the local
 * mirror could not be written. Failures are warned about and swallowed.
 */
async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[BOTPRESS] failed to cache ${what}:`, error);
	}
}

/** Mirrors a workspace into the local cache. */
export async function cacheWorkspace(
	store: EntityStore<BotpressWorkspaceEntity> | undefined,
	workspace: BotpressWorkspace | undefined | null,
) {
	if (!store || !workspace?.id) return;
	await safely(
		() =>
			store.upsertByEntityId(workspace.id, {
				id: workspace.id,
				name: workspace.name,
				ownerId: workspace.ownerId,
				createdAt: workspace.createdAt ? new Date(workspace.createdAt) : null,
				updatedAt: workspace.updatedAt ? new Date(workspace.updatedAt) : null,
				blocked: workspace.blocked,
				plan: workspace.plan,
				billingVersion: workspace.billingVersion,
				spendingLimit: workspace.spendingLimit,
				botCount: workspace.botCount,
				about: workspace.about,
				profilePicture: workspace.profilePicture,
				contactEmail: workspace.contactEmail,
				website: workspace.website,
				isPublic: workspace.isPublic,
				handle: workspace.handle,
				activeTrialId: workspace.activeTrialId,
			}),
		`workspace ${workspace.id}`,
	);
}

/** Mirrors a bot into the local cache. */
export async function cacheBot(
	store: EntityStore<BotpressBotEntity> | undefined,
	bot: BotpressBot | undefined | null,
) {
	if (!store || !bot?.id) return;
	await safely(
		() =>
			store.upsertByEntityId(bot.id, {
				id: bot.id,
				name: bot.name,
				createdAt: bot.createdAt ? new Date(bot.createdAt) : null,
				updatedAt: bot.updatedAt ? new Date(bot.updatedAt) : null,
				createdBy: bot.createdBy,
				dev: bot.dev,
				alwaysAlive: bot.alwaysAlive,
				status: bot.status,
				type: bot.type,
				tags: bot.tags,
			}),
		`bot ${bot.id}`,
	);
}

/** Mirrors an integration into the local cache. */
export async function cacheIntegration(
	store: EntityStore<BotpressIntegrationEntity> | undefined,
	integration: BotpressIntegration | undefined | null,
) {
	if (!store || !integration?.id) return;
	await safely(
		() =>
			store.upsertByEntityId(integration.id, {
				id: integration.id,
				name: integration.name,
				version: integration.version,
				title: integration.title,
				description: integration.description,
				createdAt: integration.createdAt
					? new Date(integration.createdAt)
					: null,
				updatedAt: integration.updatedAt
					? new Date(integration.updatedAt)
					: null,
				visibility: integration.visibility,
				dev: integration.dev,
				url: integration.url,
				iconUrl: integration.iconUrl,
				readmeUrl: integration.readmeUrl,
			}),
		`integration ${integration.id}`,
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
	id: string,
	what: string,
) {
	const remove = store?.deleteByEntityId;
	if (!remove || !id) return;
	await safely(() => remove(id), `${what} ${id}`);
}
