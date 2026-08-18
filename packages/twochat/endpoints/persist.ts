import type {
	TwoChatAccountEntity,
	TwoChatContactEntity,
	TwoChatWebhookSubscriptionEntity,
} from '../schema/database';

type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
};

type CacheCtx = {
	db?: {
		contacts?: EntityStore<TwoChatContactEntity>;
		accounts?: EntityStore<TwoChatAccountEntity>;
		webhookSubscriptions?: EntityStore<TwoChatWebhookSubscriptionEntity>;
	};
};

function entityDb(ctx: unknown): NonNullable<CacheCtx['db']> {
	if (typeof ctx !== 'object' || ctx === null) return {};
	return (ctx as CacheCtx).db ?? {};
}

function asDate(value: string | Date | undefined): Date | undefined {
	if (value instanceof Date) return value;
	if (!value) return undefined;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[TWOCHAT] failed to cache ${what}:`, error);
	}
}

export async function cacheContacts(
	ctx: unknown,
	contacts:
		| Array<{
				uuid?: string;
				first_name?: string;
				last_name?: string;
				profile_pic_url?: string | null;
				created_at?: string;
		  }>
		| undefined,
) {
	const store = entityDb(ctx).contacts;
	if (!store || !contacts) return;
	for (const contact of contacts) {
		if (!contact.uuid || !contact.first_name) continue;
		await safely(
			() =>
				store.upsertByEntityId(contact.uuid as string, {
					uuid: contact.uuid as string,
					first_name: contact.first_name as string,
					last_name: contact.last_name,
					profile_pic_url: contact.profile_pic_url ?? undefined,
					created_at: asDate(contact.created_at),
				}),
			`contact ${contact.uuid}`,
		);
	}
}

export async function cacheAccount(
	ctx: unknown,
	account:
		| {
				uuid?: string;
				name?: string;
				on_trial?: boolean;
				blocked?: boolean;
		  }
		| undefined,
	requestsPerMinute?: number,
) {
	const store = entityDb(ctx).accounts;
	if (!store || !account?.uuid) return;
	await safely(
		() =>
			store.upsertByEntityId(account.uuid as string, {
				uuid: account.uuid as string,
				name: account.name,
				on_trial: account.on_trial,
				blocked: account.blocked,
				requests_per_minute: requestsPerMinute,
			}),
		`account ${account.uuid}`,
	);
}

export async function cacheWebhooks(
	ctx: unknown,
	webhooks:
		| Array<{
				uuid?: string;
				event_name?: string;
				channel_uuid?: string;
				hook_url?: string;
				created_at?: string;
		  }>
		| undefined,
) {
	const store = entityDb(ctx).webhookSubscriptions;
	if (!store || !webhooks) return;
	for (const webhook of webhooks) {
		if (!webhook.uuid || !webhook.event_name || !webhook.hook_url) continue;
		await safely(
			() =>
				store.upsertByEntityId(webhook.uuid as string, {
					uuid: webhook.uuid as string,
					event_name: webhook.event_name as string,
					channel_uuid: webhook.channel_uuid,
					hook_url: webhook.hook_url as string,
					created_at: asDate(webhook.created_at),
				}),
			`webhook ${webhook.uuid}`,
		);
	}
}
