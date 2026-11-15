/**
 * Remarkety is the source of truth for every store, campaign, template and segment
 * this plugin touches, and a campaign's stats move with every send while the store
 * sync advances on its own. A cached copy would show a campaign as stopped after it
 * had started. Nothing is persisted and no entities are declared.
 */
export const RemarketySchema = {
	version: '1.0.0',
	entities: {},
} as const;
