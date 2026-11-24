import posthog from 'posthog-js';

// The /start funnel, with lug.dev's event names (hub apps/lug/src/lib/analytics.ts):
// PostHog dashboards count these, so keep the names. PostHog itself starts in
// instrumentation-client.ts; without its env vars nothing is sent.

type Events = {
	/** First keystroke in a name field. */
	lug_handle_typed: Record<string, never>;
	/** A free name was claimed: Continue on the name step, or arriving from the homepage form with one. */
	lug_claim_submitted: Record<string, never>;
	/** Step 2 shown. */
	lug_apps_step: Record<string, never>;
	/** Step 3 shown, with the apps and client from step 2. */
	lug_client_step: { apps: number; client: string };
	lug_handoff:
		| {
				kind: 'claim';
				apps: number;
				plugins: string;
				client: string;
				clients: string;
		  }
		| { kind: 'sign_in' };
};

/** Properties are plain ids and counts: never the handle or the link name. */
export function track<E extends keyof Events>(
	event: E,
	properties: Events[E],
): void {
	try {
		if (!posthog.__loaded) return;
		// lug_handoff leaves the page moments later, so it skips the batch.
		posthog.capture(event, properties, {
			send_instantly: event === 'lug_handoff',
		});
	} catch {
		// Analytics must never fail the action.
	}
}

/** For the hand-off link; undefined when PostHog isn't running. */
export function analyticsDistinctId(): string | undefined {
	try {
		return posthog.__loaded ? posthog.get_distinct_id() : undefined;
	} catch {
		return undefined;
	}
}
