import type { DnsfilterContext } from './index';

// Unwraps JSON:API rows and keeps local sync best-effort: a DB failure never
// fails the API call.

type Row = Record<string, unknown>;

function asRecord(value: unknown): Row | undefined {
	// Safe: the guard is exactly the property the cast asserts.
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? (value as Row)
		: undefined;
}

function collectRows(payload: unknown): Row[] {
	const document = asRecord(payload);
	if (!document) return [];
	const data = document.data;
	if (Array.isArray(data)) {
		return data.map(asRecord).filter((row): row is Row => row !== undefined);
	}
	const single = asRecord(data);
	if (!single) return [];
	if (single.id !== undefined || single.attributes !== undefined)
		return [single];
	const collections = Object.values(single).filter(
		Array.isArray,
		// Safe: the predicate above keeps only array values.
	) as unknown[][];
	if (collections.length === 1) {
		return (collections[0] ?? [])
			.map(asRecord)
			.filter((row): row is Row => row !== undefined);
	}
	return [single];
}

function attributesOf(row: Row): Row {
	return asRecord(row.attributes) ?? row;
}

function toId(value: unknown): string | undefined {
	if (typeof value === 'string' && value.length > 0) return value;
	if (typeof value === 'number') return String(value);
	return undefined;
}

function toStringOrUndefined(value: unknown): string | undefined {
	if (typeof value === 'string' && value.length > 0) return value;
	if (typeof value === 'number') return String(value);
	return undefined;
}

function toDate(value: unknown): Date | null | undefined {
	if (value instanceof Date) return value;
	if (typeof value === 'string' || typeof value === 'number') {
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? undefined : parsed;
	}
	return undefined;
}

function relationshipId(row: Row, relation: string): string | undefined {
	const relationships = asRecord(row.relationships);
	const data = asRecord(asRecord(relationships?.[relation])?.data);
	return data ? toId(data.id) : undefined;
}

export async function persistNetworks(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.networks.upsertByEntityId(id, {
				id,
				name: toStringOrUndefined(attributes.name),
				organizationId:
					relationshipId(row, 'organization') ??
					toStringOrUndefined(attributes.organization_id),
				policyId:
					relationshipId(row, 'policy') ??
					toStringOrUndefined(attributes.policy_id),
				blockPageId: toStringOrUndefined(attributes.block_page_id),
				scheduledPolicyId: toStringOrUndefined(attributes.scheduled_policy_id),
				createdAt: toDate(attributes.created_at),
				updatedAt: toDate(attributes.updated_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter network:', error);
		}
	}
}

export async function persistPolicies(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.policies.upsertByEntityId(id, {
				id,
				name: toStringOrUndefined(attributes.name),
				organizationId:
					relationshipId(row, 'organization') ??
					toStringOrUndefined(attributes.organization_id),
				createdAt: toDate(attributes.created_at),
				updatedAt: toDate(attributes.updated_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter policy:', error);
		}
	}
}

export async function persistOrganizations(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.organizations.upsertByEntityId(id, {
				id,
				name: toStringOrUndefined(attributes.name),
				createdAt: toDate(attributes.created_at),
				updatedAt: toDate(attributes.updated_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter organization:', error);
		}
	}
}

export async function persistUsers(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.users.upsertByEntityId(id, {
				id,
				name: toStringOrUndefined(attributes.name),
				email: toStringOrUndefined(attributes.email),
				role: toStringOrUndefined(attributes.role),
				organizationId:
					relationshipId(row, 'organization') ??
					toStringOrUndefined(attributes.organization_id),
				createdAt: toDate(attributes.created_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter user:', error);
		}
	}
}

export async function persistUserAgents(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.userAgents.upsertByEntityId(id, {
				id,
				name:
					toStringOrUndefined(attributes.friendly_name) ??
					toStringOrUndefined(attributes.hostname),
				platform:
					toStringOrUndefined(attributes.os_name) ??
					toStringOrUndefined(attributes.agent_type),
				status: toStringOrUndefined(attributes.status),
				organizationId:
					relationshipId(row, 'organization') ??
					toStringOrUndefined(attributes.organization_id),
				networkId:
					relationshipId(row, 'network') ??
					toStringOrUndefined(attributes.network_id),
				createdAt: toDate(attributes.created_at),
				lastSeenAt:
					toDate(attributes.last_sync) ?? toDate(attributes.last_seen_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter user agent:', error);
		}
	}
}

export async function persistIpAddresses(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.ipAddresses.upsertByEntityId(id, {
				id,
				address: toStringOrUndefined(attributes.ip ?? attributes.address),
				policyId:
					relationshipId(row, 'policy') ??
					toStringOrUndefined(attributes.policy_id),
				organizationId:
					relationshipId(row, 'organization') ??
					toStringOrUndefined(attributes.organization_id),
				comment: toStringOrUndefined(attributes.comment),
				createdAt: toDate(attributes.created_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter IP address:', error);
		}
	}
}

export async function persistMacAddresses(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.macAddresses.upsertByEntityId(id, {
				id,
				address: toStringOrUndefined(attributes.mac ?? attributes.address),
				policyId:
					relationshipId(row, 'policy') ??
					toStringOrUndefined(attributes.policy_id),
				organizationId:
					relationshipId(row, 'organization') ??
					toStringOrUndefined(attributes.organization_id),
				comment: toStringOrUndefined(attributes.comment),
				createdAt: toDate(attributes.created_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter MAC address:', error);
		}
	}
}

export async function persistSubnets(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			await ctx.db.subnets.upsertByEntityId(id, {
				id,
				name: toStringOrUndefined(attributes.name),
				from: toStringOrUndefined(attributes.from),
				to: toStringOrUndefined(attributes.to),
				networkId:
					relationshipId(row, 'network') ??
					toStringOrUndefined(attributes.network_id),
				createdAt: toDate(attributes.created_at),
				updatedAt: toDate(attributes.updated_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter subnet:', error);
		}
	}
}

export async function persistUnblockRequests(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		const organization = asRecord(attributes.organization);
		try {
			await ctx.db.unblockRequests.upsertByEntityId(id, {
				id,
				domain: toStringOrUndefined(attributes.domain),
				status:
					toStringOrUndefined(attributes.status) ??
					toStringOrUndefined(attributes.action),
				organizationId:
					toId(organization?.id) ??
					toStringOrUndefined(attributes.organization_id),
				createdAt:
					toDate(attributes.time_of_attempt) ?? toDate(attributes.created_at),
				resolvedAt:
					toDate(attributes.resolved_date) ?? toDate(attributes.decided_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter unblock request:', error);
		}
	}
}

export async function persistScheduledReports(
	ctx: DnsfilterContext,
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		const organization = asRecord(attributes.organization);
		try {
			await ctx.db.scheduledReports.upsertByEntityId(id, {
				id,
				name: toStringOrUndefined(attributes.name),
				frequency: toStringOrUndefined(attributes.frequency),
				organizationId:
					relationshipId(row, 'organization') ??
					toId(organization?.id) ??
					toStringOrUndefined(attributes.organization_id),
				createdAt: toDate(attributes.created_at),
				updatedAt: toDate(attributes.updated_at),
			});
		} catch (error) {
			console.warn('Failed to persist DNSFilter scheduled report:', error);
		}
	}
}
