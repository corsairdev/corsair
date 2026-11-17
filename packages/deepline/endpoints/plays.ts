import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	GetPlayInputSchema,
	GetPlayOutputSchema,
	GetPlaysActivityInputSchema,
	GetPlaysActivityOutputSchema,
	ListPlaysInputSchema,
	ListPlaysOutputSchema,
	StartPlayRunInputSchema,
	StartPlayRunOutputSchema,
} from './types';
import {
	ClearPlayHistoryInputSchema,
	ClearPlayHistoryOutputSchema,
	DeletePlayInputSchema,
	DeletePlayOutputSchema,
	GetPlayCostInputSchema,
	GetPlayCostOutputSchema,
	GetPlaySettingsInputSchema,
	GetPlaySettingsOutputSchema,
	GetPlayTriggerHistoryInputSchema,
	GetPlayTriggerHistoryOutputSchema,
	GetPlayTriggersInputSchema,
	GetPlayTriggersOutputSchema,
	GetSharePageInputSchema,
	ListPlayPathsInputSchema,
	ListPlayPathsOutputSchema,
	ListPlayTriggerInventoryInputSchema,
	ListPlayTriggerInventoryOutputSchema,
	ListPlayVersionsInputSchema,
	ListPlayVersionsOutputSchema,
	PublishPlayVersionInputSchema,
	PublishPlayVersionOutputSchema,
	PublishSharePageInputSchema,
	RegenerateSharePageInputSchema,
	RestorePlayInputSchema,
	RestorePlayOutputSchema,
	SetPlayPinnedInputSchema,
	SetPlayPinnedOutputSchema,
	SharePageStatusSchema,
	UnpublishSharePageInputSchema,
	UpdatePlaySettingsInputSchema,
	UpdatePlaySettingsOutputSchema,
	UpdatePlayTriggersInputSchema,
	UpdatePlayTriggersOutputSchema,
	UpdateSharePageInputSchema,
} from './types-plays';
export const run = defineEndpoint({
	event: 'deepline.plays.run',
	input: StartPlayRunInputSchema,
	output: StartPlayRunOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/run`, ctx.key, {
			method: 'POST',
			body: {
				name: input.name,
				input: input.input,
				revisionId: input.revisionId,
				force: input.force,
				forceToolRefresh: input.forceToolRefresh,
				maxCredits: input.maxCredits,
				maxConcurrentExternalCalls: input.maxConcurrentExternalCalls,
				maxConcurrentRows: input.maxConcurrentRows,
				waitForCompletionMs: input.waitForCompletionMs,
				terminalStatus: input.terminalStatus,
			},
		}),
});
export const list = defineEndpoint({
	event: 'deepline.plays.list',
	input: ListPlaysInputSchema,
	output: ListPlaysOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays`, ctx.key, {
			method: 'GET',
			query: {
				summary_only: input.summary_only,
				grep: input.search,
				inventory_paginated: input.search?.trim() ? undefined : '1',
				cursor: input.cursor,
				origin: input.origin,
				limit: input.limit,
			},
		}),
});
export const activity = defineEndpoint({
	event: 'deepline.plays.activity',
	input: GetPlaysActivityInputSchema,
	output: GetPlaysActivityOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/activity`, ctx.key, {
			method: 'POST',
			body: {
				timeZone: input.timeZone,
				days: input.days,
				endDate: input.endDate,
				groupBy: input.groupBy,
			},
		}),
});
export const get = defineEndpoint({
	event: 'deepline.plays.get',
	input: GetPlayInputSchema,
	output: GetPlayOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}`, ctx.key, {
			method: 'GET',
		}),
});

// ——— Lifecycle ———

export const cost = defineEndpoint({
	event: 'deepline.plays.cost',
	input: GetPlayCostInputSchema,
	output: GetPlayCostOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}/cost`, ctx.key, {
			method: 'GET',
		}),
});
export const paths = defineEndpoint({
	event: 'deepline.plays.paths',
	input: ListPlayPathsInputSchema,
	output: ListPlayPathsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/settings/paths`, ctx.key, {
			method: 'GET',
			query: { root: input.root, limit: input.limit, cursor: input.cursor },
		}),
});
export const pin = defineEndpoint({
	event: 'deepline.plays.pin',
	input: SetPlayPinnedInputSchema,
	output: SetPlayPinnedOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}/pin`, ctx.key, {
			method: 'POST',
			body: { pinned: input.pinned },
		}),
});
// Soft delete: moves the Play to Trash and disables its active triggers.
const removePlay = defineEndpoint({
	event: 'deepline.plays.delete',
	input: DeletePlayInputSchema,
	output: DeletePlayOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}`, ctx.key, {
			method: 'DELETE',
		}),
});
export { removePlay as delete };
export const restore = defineEndpoint({
	event: 'deepline.plays.restore',
	input: RestorePlayInputSchema,
	output: RestorePlayOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/restore`,
			ctx.key,
			{ method: 'POST', body: {} },
		),
});
export const clearHistory = defineEndpoint({
	event: 'deepline.plays.clearHistory',
	input: ClearPlayHistoryInputSchema,
	output: ClearPlayHistoryOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/history/clear`,
			ctx.key,
			{ method: 'POST', body: { tableNamespaces: input.tableNamespaces } },
		),
});

// ——— Settings ———

const getSettings = defineEndpoint({
	event: 'deepline.plays.settings.get',
	input: GetPlaySettingsInputSchema,
	output: GetPlaySettingsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/settings`,
			ctx.key,
			{ method: 'GET' },
		),
});
// PATCH semantics: omitted fields keep their current value.
const updateSettings = defineEndpoint({
	event: 'deepline.plays.settings.update',
	input: UpdatePlaySettingsInputSchema,
	output: UpdatePlaySettingsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/settings`,
			ctx.key,
			{
				method: 'PATCH',
				body: {
					path:
						input.path === undefined || input.path === null
							? input.path
							: { root: input.path.root, folders: input.path.folders ?? [] },
					displayName:
						input.displayName === undefined
							? undefined
							: input.displayName || null,
				},
			},
		),
});
export const settings = { get: getSettings, update: updateSettings };

// ——— Versions ———

const listVersions = defineEndpoint({
	event: 'deepline.plays.versions.list',
	input: ListPlayVersionsInputSchema,
	output: ListPlayVersionsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/versions`,
			ctx.key,
			{ method: 'GET', query: { full: input.full ? 'true' : undefined } },
		),
});
const publishVersion = defineEndpoint({
	event: 'deepline.plays.versions.publish',
	input: PublishPlayVersionInputSchema,
	output: PublishPlayVersionOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}/live`, ctx.key, {
			method: 'POST',
			body: { revisionId: input.revisionId },
		}),
});
export const versions = { list: listVersions, publish: publishVersion };

// ——— Triggers ———

const getTriggers = defineEndpoint({
	event: 'deepline.plays.triggers.get',
	input: GetPlayTriggersInputSchema,
	output: GetPlayTriggersOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/triggers`,
			ctx.key,
			{ method: 'GET' },
		),
});
// Declarative: null removes a trigger, an omitted key keeps it. A change is
// published as a new live revision; repeating a satisfied request is a no-op.
const updateTriggers = defineEndpoint({
	event: 'deepline.plays.triggers.update',
	input: UpdatePlayTriggersInputSchema,
	output: UpdatePlayTriggersOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/triggers`,
			ctx.key,
			{
				method: 'PUT',
				body: {
					expectedRevisionId: input.expectedRevisionId,
					cron: input.cron,
					webhook: input.webhook,
				},
			},
		),
});
const triggerInventory = defineEndpoint({
	event: 'deepline.plays.triggers.inventory',
	input: ListPlayTriggerInventoryInputSchema,
	output: ListPlayTriggerInventoryOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/triggers`, ctx.key, {
			method: 'GET',
			query: { view: 'inventory', cursor: input.cursor },
		}),
});
const triggerHistory = defineEndpoint({
	event: 'deepline.plays.triggers.history',
	input: GetPlayTriggerHistoryInputSchema,
	output: GetPlayTriggerHistoryOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/triggers`, ctx.key, {
			method: 'GET',
			query: {
				view: 'history',
				binding_id: input.bindingId,
				history_limit: input.limit,
			},
		}),
});
export const triggers = {
	get: getTriggers,
	update: updateTriggers,
	inventory: triggerInventory,
	history: triggerHistory,
};

// ——— Public share page ———

const getShare = defineEndpoint({
	event: 'deepline.plays.share.get',
	input: GetSharePageInputSchema,
	output: SharePageStatusSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}/share`, ctx.key, {
			method: 'GET',
			query: { revisionId: input.revisionId },
		}),
});
const publishShare = defineEndpoint({
	event: 'deepline.plays.share.publish',
	input: PublishSharePageInputSchema,
	output: SharePageStatusSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}/share`, ctx.key, {
			method: 'POST',
			body: {
				revisionId: input.revisionId,
				acknowledgedUnlisted: input.acknowledgedUnlisted,
				showAverageDeeplineCost: input.showAverageDeeplineCost,
				showAverageLatency: input.showAverageLatency,
				seoIndexing: input.seoIndexing,
			},
		}),
});
const updateShare = defineEndpoint({
	event: 'deepline.plays.share.update',
	input: UpdateSharePageInputSchema,
	output: SharePageStatusSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}/share`, ctx.key, {
			method: 'PATCH',
			body: {
				showAverageDeeplineCost: input.showAverageDeeplineCost,
				showAverageLatency: input.showAverageLatency,
				seoIndexing: input.seoIndexing,
			},
		}),
});
const unpublishShare = defineEndpoint({
	event: 'deepline.plays.share.unpublish',
	input: UnpublishSharePageInputSchema,
	output: SharePageStatusSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/plays/${segment(input.name)}/share`, ctx.key, {
			method: 'DELETE',
		}),
});
const regenerateShare = defineEndpoint({
	event: 'deepline.plays.share.regenerate',
	input: RegenerateSharePageInputSchema,
	output: SharePageStatusSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(input.name)}/share/regenerate`,
			ctx.key,
			{ method: 'POST', body: { revisionId: input.revisionId } },
		),
});
export const share = {
	get: getShare,
	publish: publishShare,
	update: updateShare,
	unpublish: unpublishShare,
	regenerate: regenerateShare,
};
