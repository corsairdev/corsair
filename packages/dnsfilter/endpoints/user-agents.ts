// DNSFilter user agents endpoints.
// One file per resource family; each endpoint keeps its own group name.
import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUserAgents } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// List user agents - GET /v1/user_agents
export const userAgentsList: DnsfilterEndpoints['userAgentsList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsList.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsList']
	>('/v1/user_agents', ctx.key, {
		method: 'GET',
		query: {
			agent_local_user_uuids: values.agent_local_user_uuids,
			agent_state: values.agent_state,
			agent_type: values.agent_type,
			agent_version: values.agent_version,
			auto_update: values.auto_update,
			block_page_id: values.block_page_id,
			browser_extension_status: values.browser_extension_status,
			cybersight_enabled: values.cybersight_enabled,
			cybersight_status: values.cybersight_status,
			end_at: values.end_at,
			msp_id: values.msp_id,
			name_search: values.name_search,
			network_ids: values.network_ids,
			new_agent_states: values.new_agent_states,
			organization_ids: values.organization_ids,
			page: values.page,
			policy_id: values.policy_id,
			policy_schedule: values.policy_schedule,
			release_channels: values.release_channels,
			scheduled_policy_id: values.scheduled_policy_id,
			search: values.search,
			sort: values.sort,
			start_at: values.start_at,
			state: values.state,
			status: values.status,
			tags: values.tags,
			traffic_received_last_15_mins: values.traffic_received_last_15_mins,
			type: values.type,
			vpn_mode: values.vpn_mode,
			vpn_status: values.vpn_status,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.userAgentsList.parse(response);
	await persistUserAgents(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all user agents - GET /v1/user_agents/all
export const userAgentsListAll: DnsfilterEndpoints['userAgentsListAll'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentsListAll.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsListAll']
		>('/v1/user_agents/all', ctx.key, {
			method: 'GET',
			query: {
				agent_local_user_uuids: values.agent_local_user_uuids,
				cybersight_enabled: values.cybersight_enabled,
				end_at: values.end_at,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				page: values.page,
				search: values.search,
				sort: values.sort,
				start_at: values.start_at,
				state: values.state,
				status: values.status,
				tags: values.tags,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsListAll.parse(response);
		await persistUserAgents(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.listAll',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for user agents - GET /v1/user_agents/counts
export const userAgentsCounts: DnsfilterEndpoints['userAgentsCounts'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsCounts.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsCounts']
	>('/v1/user_agents/counts', ctx.key, {
		method: 'GET',
		query: {
			msp_id: values.msp_id,
			name_search: values.name_search,
			network_ids: values.network_ids,
			new_agent_states: values.new_agent_states,
			organization_ids: values.organization_ids,
			release_channels: values.release_channels,
			search: values.search,
			state: values.state,
			status: values.status,
			tags: values.tags,
			type: values.type,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.userAgentsCounts.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.counts',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get a user agent - GET /v1/user_agents/{id}
export const userAgentsGet: DnsfilterEndpoints['userAgentsGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsGet']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.userAgentsGet.parse(response);
	await persistUserAgents(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a user agent - PATCH /v1/user_agents/{id}
export const userAgentsUpdate: DnsfilterEndpoints['userAgentsUpdate'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsUpdate.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsUpdate']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'PATCH',
		path: {
			id: values.id,
		},
		body: {
			user_agent: values.user_agent,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.userAgentsUpdate.parse(response);
	await persistUserAgents(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.update',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Delete a user agent - DELETE /v1/user_agents/{id}
export const userAgentsDelete: DnsfilterEndpoints['userAgentsDelete'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsDelete.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsDelete']
	>('/v1/user_agents/{id}', ctx.key, {
		method: 'DELETE',
		path: {
			id: values.id,
		},
		query: {
			clear_registry: values.clear_registry,
			queue_uninstall: values.queue_uninstall,
		},
	});
	const result =
		DnsfilterEndpointOutputSchemas.userAgentsDelete.parse(response);
	try {
		await ctx.db.userAgents.deleteByEntityId(String(values.id));
	} catch (error) {
		console.warn('Failed to evict DNSFilter userAgents row:', error);
	}
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.delete',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Tags for user agents - GET /v1/user_agents/tags
export const userAgentsTags: DnsfilterEndpoints['userAgentsTags'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.userAgentsTags.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['userAgentsTags']
	>('/v1/user_agents/tags', ctx.key, {
		method: 'GET',
		query: {
			include_used_only: values.include_used_only,
			msp_id: values.msp_id,
			network_ids: values.network_ids,
			organization_ids: values.organization_ids,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.userAgentsTags.parse(response);
	await logEventFromContext(
		ctx,
		'dnsfilter.userAgents.tags',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Dequeue uninstall for user agents - POST /v1/user_agents/dequeue_uninstall
export const userAgentsDequeueUninstall: DnsfilterEndpoints['userAgentsDequeueUninstall'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentsDequeueUninstall.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsDequeueUninstall']
		>('/v1/user_agents/dequeue_uninstall', ctx.key, {
			method: 'POST',
			query: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsDequeueUninstall.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.dequeueUninstall',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Uninstall pin for user agents - GET /v1/user_agents/uninstall_pin
export const userAgentsUninstallPin: DnsfilterEndpoints['userAgentsUninstallPin'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentsUninstallPin.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsUninstallPin']
		>('/v1/user_agents/uninstall_pin', ctx.key, {
			method: 'GET',
			query: {
				organization_id: values.organization_id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsUninstallPin.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgents.uninstallPin',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk delete user agent - POST /v1/user_agent_bulk_deletes
export const userAgentBulkDeletesCreate: DnsfilterEndpoints['userAgentBulkDeletesCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkDeletesCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesCreate']
		>('/v1/user_agent_bulk_deletes', ctx.key, {
			method: 'POST',
			query: {
				agent_state: values.agent_state,
				agent_version: values.agent_version,
				block_page_id: values.block_page_id,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				policy_id: values.policy_id,
				policy_schedule: values.policy_schedule,
				queue_uninstall: values.queue_uninstall,
				release_channels: values.release_channels,
				scheduled_policy_id: values.scheduled_policy_id,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
			body: {
				ids: values.ids,
				exclude_ids: values.exclude_ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkDeletesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a user agent bulk delete - GET /v1/user_agent_bulk_deletes/{id}
export const userAgentBulkDeletesGet: DnsfilterEndpoints['userAgentBulkDeletesGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentBulkDeletesGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesGet']
		>('/v1/user_agent_bulk_deletes/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkDeletesGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for user agent bulk deletes - GET /v1/user_agent_bulk_deletes/counts
export const userAgentBulkDeletesCounts: DnsfilterEndpoints['userAgentBulkDeletesCounts'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkDeletesCounts.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkDeletesCounts']
		>('/v1/user_agent_bulk_deletes/counts', ctx.key, {
			method: 'GET',
			query: {
				agent_state: values.agent_state,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkDeletesCounts.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkDeletes.counts',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Bulk update user agent - POST /v1/user_agent_bulk_updates
export const userAgentBulkUpdatesCreate: DnsfilterEndpoints['userAgentBulkUpdatesCreate'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkUpdatesCreate.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesCreate']
		>('/v1/user_agent_bulk_updates', ctx.key, {
			method: 'POST',
			query: {
				agent_state: values.agent_state,
				agent_version: values.agent_version,
				block_page_id: values.block_page_id,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				policy_id: values.policy_id,
				policy_schedule: values.policy_schedule,
				release_channels: values.release_channels,
				scheduled_policy_id: values.scheduled_policy_id,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
			body: {
				ids: values.ids,
				exclude_ids: values.exclude_ids,
				changeset: values.changeset,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a user agent bulk update - GET /v1/user_agent_bulk_updates/{id}
export const userAgentBulkUpdatesGet: DnsfilterEndpoints['userAgentBulkUpdatesGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentBulkUpdatesGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesGet']
		>('/v1/user_agent_bulk_updates/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Has mixed for user agent bulk updates - POST /v1/user_agent_bulk_updates/has_mixed
export const userAgentBulkUpdatesHasMixed: DnsfilterEndpoints['userAgentBulkUpdatesHasMixed'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkUpdatesHasMixed.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesHasMixed']
		>('/v1/user_agent_bulk_updates/has_mixed', ctx.key, {
			method: 'POST',
			query: {
				agent_state: values.agent_state,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_ids: values.organization_ids,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
			body: {
				ids: values.ids,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesHasMixed.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.hasMixed',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Counts for user agent bulk updates - GET /v1/user_agent_bulk_updates/counts
export const userAgentBulkUpdatesCounts: DnsfilterEndpoints['userAgentBulkUpdatesCounts'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentBulkUpdatesCounts.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentBulkUpdatesCounts']
		>('/v1/user_agent_bulk_updates/counts', ctx.key, {
			method: 'GET',
			query: {
				agent_state: values.agent_state,
				block_page_id: values.block_page_id,
				name_search: values.name_search,
				network_ids: values.network_ids,
				organization_id: values.organization_id,
				policy_id: values.policy_id,
				release_channels: values.release_channels,
				scheduled_policy_id: values.scheduled_policy_id,
				search: values.search,
				state: values.state,
				status: values.status,
				tags: values.tags,
				traffic_received_last_15_mins: values.traffic_received_last_15_mins,
				type: values.type,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentBulkUpdatesCounts.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentBulkUpdates.counts',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Clean up user agent - POST /v1/user_agent_cleanups
export const userAgentCleanupsCreate: DnsfilterEndpoints['userAgentCleanupsCreate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentCleanupsCreate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsCreate']
		>('/v1/user_agent_cleanups', ctx.key, {
			method: 'POST',
			body: {
				organization_id: values.organization_id,
				organization_ids: values.organization_ids,
				inactive_for: values.inactive_for,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentCleanupsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.create',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Get a user agent cleanup - GET /v1/user_agent_cleanups/{id}
export const userAgentCleanupsGet: DnsfilterEndpoints['userAgentCleanupsGet'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentCleanupsGet.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsGet']
		>('/v1/user_agent_cleanups/{id}', ctx.key, {
			method: 'GET',
			path: {
				id: values.id,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentCleanupsGet.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.get',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update a user agent cleanup - PUT /v1/user_agent_cleanups/{id}
export const userAgentCleanupsUpdate: DnsfilterEndpoints['userAgentCleanupsUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentCleanupsUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentCleanupsUpdate']
		>('/v1/user_agent_cleanups/{id}', ctx.key, {
			method: 'PUT',
			path: {
				id: values.id,
			},
			body: {
				start: values.start,
				inactive_for: values.inactive_for,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentCleanupsUpdate.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentCleanups.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// List user agent releases - GET /v1/user_agent_releases
export const userAgentReleasesList: DnsfilterEndpoints['userAgentReleasesList'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentReleasesList.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentReleasesList']
		>('/v1/user_agent_releases', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentReleasesList.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentReleases.list',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Relay for user agent releases - GET /v1/user_agent_releases/relay
export const userAgentReleasesRelay: DnsfilterEndpoints['userAgentReleasesRelay'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.userAgentReleasesRelay.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentReleasesRelay']
		>('/v1/user_agent_releases/relay', ctx.key, {
			method: 'GET',
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentReleasesRelay.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentReleases.relay',
			redactSensitive(values),
			'completed',
		);
		return result;
	};

// Update settings for user agents V2 - PATCH /v2/user_agents/{id}/update_settings
export const userAgentsV2UpdateSettings: DnsfilterEndpoints['userAgentsV2UpdateSettings'] =
	async (ctx, input) => {
		const values =
			DnsfilterEndpointInputSchemas.userAgentsV2UpdateSettings.parse(
				input ?? {},
			);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['userAgentsV2UpdateSettings']
		>('/v2/user_agents/{id}/update_settings', ctx.key, {
			method: 'PATCH',
			path: {
				id: values.id,
			},
			body: {
				user_agent: values.user_agent,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.userAgentsV2UpdateSettings.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.userAgentsV2.updateSettings',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
