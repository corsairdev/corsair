import * as t from './endpoints/types-plays';

export const playsSchemas = {
	'plays.cost': {
		input: t.GetPlayCostInputSchema,
		output: t.GetPlayCostOutputSchema,
	},
	'plays.paths': {
		input: t.ListPlayPathsInputSchema,
		output: t.ListPlayPathsOutputSchema,
	},
	'plays.pin': {
		input: t.SetPlayPinnedInputSchema,
		output: t.SetPlayPinnedOutputSchema,
	},
	'plays.delete': {
		input: t.DeletePlayInputSchema,
		output: t.DeletePlayOutputSchema,
	},
	'plays.restore': {
		input: t.RestorePlayInputSchema,
		output: t.RestorePlayOutputSchema,
	},
	'plays.clearHistory': {
		input: t.ClearPlayHistoryInputSchema,
		output: t.ClearPlayHistoryOutputSchema,
	},
	'plays.settings.get': {
		input: t.GetPlaySettingsInputSchema,
		output: t.GetPlaySettingsOutputSchema,
	},
	'plays.settings.update': {
		input: t.UpdatePlaySettingsInputSchema,
		output: t.UpdatePlaySettingsOutputSchema,
	},
	'plays.versions.list': {
		input: t.ListPlayVersionsInputSchema,
		output: t.ListPlayVersionsOutputSchema,
	},
	'plays.versions.publish': {
		input: t.PublishPlayVersionInputSchema,
		output: t.PublishPlayVersionOutputSchema,
	},
	'plays.triggers.get': {
		input: t.GetPlayTriggersInputSchema,
		output: t.GetPlayTriggersOutputSchema,
	},
	'plays.triggers.update': {
		input: t.UpdatePlayTriggersInputSchema,
		output: t.UpdatePlayTriggersOutputSchema,
	},
	'plays.triggers.inventory': {
		input: t.ListPlayTriggerInventoryInputSchema,
		output: t.ListPlayTriggerInventoryOutputSchema,
	},
	'plays.triggers.history': {
		input: t.GetPlayTriggerHistoryInputSchema,
		output: t.GetPlayTriggerHistoryOutputSchema,
	},
	'plays.share.get': {
		input: t.GetSharePageInputSchema,
		output: t.SharePageStatusSchema,
	},
	'plays.share.publish': {
		input: t.PublishSharePageInputSchema,
		output: t.SharePageStatusSchema,
	},
	'plays.share.update': {
		input: t.UpdateSharePageInputSchema,
		output: t.SharePageStatusSchema,
	},
	'plays.share.unpublish': {
		input: t.UnpublishSharePageInputSchema,
		output: t.SharePageStatusSchema,
	},
	'plays.share.regenerate': {
		input: t.RegenerateSharePageInputSchema,
		output: t.SharePageStatusSchema,
	},
} as const;

export const playsMeta = {
	'plays.cost': {
		riskLevel: 'read',
		description:
			'Estimate credits per row or run for one saved or prebuilt Play (does not start a run)',
	},
	'plays.paths': {
		riskLevel: 'read',
		description: 'List the folder locations of workspace Plays, one page',
	},
	'plays.pin': {
		riskLevel: 'write',
		description: 'Pin or unpin a workspace Play so it sorts first',
	},
	'plays.delete': {
		riskLevel: 'destructive',
		description:
			'Move a workspace Play to Trash and disable its cron and webhook triggers (restorable)',
	},
	'plays.restore': {
		riskLevel: 'write',
		description: 'Restore a workspace Play from Trash',
	},
	'plays.clearHistory': {
		riskLevel: 'destructive',
		description:
			"Permanently delete a Play's run history and saved sheet data, keeping its code and versions",
	},
	'plays.settings.get': {
		riskLevel: 'read',
		description: "Read a workspace Play's location and display name",
	},
	'plays.settings.update': {
		riskLevel: 'write',
		description:
			"Change a workspace Play's location or display name; omitted fields stay as they are",
	},
	'plays.versions.list': {
		riskLevel: 'read',
		description: "List a Play's saved versions, newest first",
	},
	'plays.versions.publish': {
		riskLevel: 'destructive',
		description:
			'Make a Play version live; its cron and webhook triggers then run that version (may spend credits)',
	},
	'plays.triggers.get': {
		riskLevel: 'read',
		description:
			"Read a workspace Play's cron schedule and inbound webhook trigger, with the webhook URL",
	},
	'plays.triggers.update': {
		riskLevel: 'destructive',
		description:
			'Set or remove a Play cron schedule or inbound webhook (optional HMAC or Standard Webhooks signing) and publish it live (scheduled runs may spend credits)',
	},
	'plays.triggers.inventory': {
		riskLevel: 'read',
		description:
			'List cron and webhook triggers across the workspace, one page',
	},
	'plays.triggers.history': {
		riskLevel: 'read',
		description: "List one trigger's recent runs",
	},
	'plays.share.get': {
		riskLevel: 'read',
		description: "Read a Play's public share page status and revision picker",
	},
	'plays.share.publish': {
		riskLevel: 'destructive',
		description:
			"Publish or repoint a Play's public share page to a revision (publicly viewable)",
	},
	'plays.share.update': {
		riskLevel: 'write',
		description:
			'Change share page settings: search indexing, cost and latency display',
	},
	'plays.share.unpublish': {
		riskLevel: 'destructive',
		description: "Delete a Play's public share page and its cards",
	},
	'plays.share.regenerate': {
		riskLevel: 'destructive',
		description:
			"Regenerate a Play's public share page copy with an LLM (rewrites the public page)",
	},
} as const;
