export const FluxguardSchema = {
	version: '1.0.0',
	// Every entity lives in Fluxguard: sites, pages, versions and webhooks are
	// read on demand and never mirrored here, so there is nothing to sync.
	entities: {},
} as const;
