import type { CorsairInternalConfig, CorsairKeyBuilderBase } from '../core';
import { createAccountKeyManager } from '../core';
import { getCorsairInternal } from '../core/utils/corsair-instance';
import { subscribeAndReport } from './subscribe-report';

export type SubscribableAccountRow = {
	tenantId: string;
	integrationName: string;
};

/**
 * Re-arm provider subscriptions for the given connected accounts. Blanket
 * re-subscribe: no expiry bookkeeping — subscribes are idempotent (Graph
 * cleanup deletes stale subs, Gmail watch replaces itself, Google channels
 * lapse at TTL), so re-arming everything inside the tightest expiry window
 * keeps all providers alive. Per-account failures are isolated and tallied,
 * never thrown.
 */
export async function renewAccounts(input: {
	corsair: unknown;
	internal: CorsairInternalConfig;
	rows: SubscribableAccountRow[];
	subscribeAndReport?: typeof subscribeAndReport;
}): Promise<{ renewed: string[]; failed: string[] }> {
	const { corsair, internal, rows } = input;
	const doSubscribe = input.subscribeAndReport ?? subscribeAndReport;
	const renewed: string[] = [];
	const failed: string[] = [];
	if (!internal.database) return { renewed, failed };

	for (const row of rows) {
		const plugin = internal.plugins.find((p) => p.id === row.integrationName);
		if (!plugin?.subscribe) continue;
		const label = `${plugin.id}/${row.tenantId}`;
		try {
			const keys = createAccountKeyManager({
				authType: 'oauth_2',
				integrationName: plugin.id,
				tenantId: row.tenantId,
				kek: internal.kek,
				database: internal.database,
				extraAccountFields: [...(plugin.authConfig?.oauth_2?.account ?? [])],
			});
			// Refresh first: stored access tokens expire (~1h) between renewal
			// passes, and the bookkept expires_at can drift from the real token
			// (lost-update race on concurrent config writes). So never trust it:
			// present the token as already expired, forcing the keyBuilder's
			// refresh branch, which persists a fresh token for subscribe to read.
			const keyBuilder = plugin.keyBuilder as CorsairKeyBuilderBase | undefined;
			if (keyBuilder) {
				const primingKeys = Object.create(keys, {
					get_expires_at: { value: async () => '0' },
				});
				await keyBuilder(
					{ authType: 'oauth_2', keys: primingKeys },
					'endpoint',
				);
			}
			await doSubscribe(corsair, plugin, row.tenantId, keys);
			renewed.push(label);
		} catch (error) {
			console.warn(
				`[corsair:renewal] re-subscribe failed for '${label}':`,
				error,
			);
			failed.push(label);
		}
	}
	return { renewed, failed };
}

/** One renewal pass over every connected account of every subscribable plugin. */
export async function renewSubscriptions(
	corsair: unknown,
): Promise<{ renewed: string[]; failed: string[] }> {
	const internal = getCorsairInternal(corsair);
	if (!internal.database) return { renewed: [], failed: [] };

	const rows = await internal.database.db
		.selectFrom('corsair_accounts as a')
		.innerJoin('corsair_integrations as i', 'i.id', 'a.integration_id')
		.select(['a.tenant_id as tenantId', 'i.name as integrationName'])
		.where('a.dek', 'is not', null)
		.execute();

	return renewAccounts({
		corsair,
		internal,
		rows: rows.filter((r): r is SubscribableAccountRow => !!r.tenantId),
	});
}

/**
 * Start periodic BYO subscription renewal. Call once at app startup (a
 * long-running server; serverless apps should invoke renewSubscriptions from
 * their own scheduler instead). Runs immediately, then on the interval.
 * Default 45 min sits inside MS Graph's 60-minute expiry — the tightest
 * provider window. Returns a stop function.
 *
 * In-process interval: with multiple app instances each renews independently;
 * re-subscribes are idempotent so that only adds provider API chatter. Move
 * to a shared scheduler (e.g. a db-backed job) when running many instances.
 */
export function startSubscriptionRenewal(
	corsair: unknown,
	options: { intervalMinutes?: number } = {},
): () => void {
	// Reentrancy guard: overlapping passes race each other's token refreshes
	// (concurrent config writes lose updates), so never start a pass while one
	// is still running.
	let inFlight = false;
	const run = () => {
		if (inFlight) return;
		inFlight = true;
		renewSubscriptions(corsair)
			.catch((error) =>
				console.warn('[corsair:renewal] renewal pass failed:', error),
			)
			.finally(() => {
				inFlight = false;
			});
	};
	run();
	const timer = setInterval(run, (options.intervalMinutes ?? 45) * 60_000);
	timer.unref?.();
	return () => clearInterval(timer);
}
