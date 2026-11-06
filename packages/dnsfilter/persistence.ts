import type { DnsfilterContext } from './index';

// Unwraps JSON:API rows and keeps local sync best-effort: a DB failure never
// fails the API call.

// A JSON:API row is untyped on arrival; the helpers below narrow each field.
type Row = Record<string, unknown>;

// Arbitrary parsed JSON; the guard below proves the object shape.
function asRecord(value: unknown): Row | undefined {
	// Safe: the guard is exactly the property the cast asserts.
	return typeof value === 'object' && value !== null && !Array.isArray(value)
		? (value as Row)
		: undefined;
}

// Raw endpoint response: list, single resource, wrapped document, or a bare
// array of rows (organizations.settings).
function collectRows(payload: unknown): Row[] {
	if (Array.isArray(payload)) {
		return payload.map(asRecord).filter((row): row is Row => row !== undefined);
	}
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

// Ids come back as numbers or strings; narrowed here, not cast at call sites.
function toId(value: unknown): string | undefined {
	if (typeof value === 'string' && value.length > 0) return value;
	if (typeof value === 'number') return String(value);
	return undefined;
}

// The mappers below read the raw response, nulls included, and return one of
// three things per field: a value; null when the response cleared the field
// (an explicit null, an empty string, or `{ data: null }` for a relationship);
// undefined when the response did not include the field at all.

// Names, emails and similar values arrive as strings or numbers.
function toText(value: unknown): string | null | undefined {
	if (value === null || value === '') return null;
	if (typeof value === 'string') return value;
	if (typeof value === 'number') return String(value);
	return undefined;
}

// Timestamps arrive as ISO strings or epoch numbers.
function toDate(value: unknown): Date | null | undefined {
	if (value === null || value === '') return null;
	if (value instanceof Date) return value;
	if (typeof value === 'string' || typeof value === 'number') {
		const parsed = new Date(value);
		return Number.isNaN(parsed.getTime()) ? undefined : parsed;
	}
	return undefined;
}

// `relationships.<relation>.data`: an id, null when the link was removed, or
// undefined when the response has no such relationship.
function relationshipId(row: Row, relation: string): string | null | undefined {
	const relationship = asRecord(asRecord(row.relationships)?.[relation]);
	if (!relationship || !('data' in relationship)) return undefined;
	if (relationship.data === null) return null;
	return toId(asRecord(relationship.data)?.id);
}

// A nested `{ id, name }` object such as an unblock request's organization.
function nestedId(value: unknown): string | null | undefined {
	if (value === null) return null;
	return toId(asRecord(value)?.id);
}

// Several sources can carry the same field depending on the response shape.
// The first one with a value wins; null only when no source has a value and
// at least one cleared it; undefined when none of them was in the response.
function pick<T>(...values: (T | null | undefined)[]): T | null | undefined {
	for (const value of values) {
		if (value !== null && value !== undefined) return value;
	}
	return values.includes(null) ? null : undefined;
}

// What a mapper produces: each field is a value, null (cleared) or undefined
// (not in this response).
type RowPatch<T> = { [K in keyof T]?: T[K] | null };

// Some responses carry only part of a row: an unblock decision has no
// organization or request time, the unblock detail view has no status, and
// `basic_info` network lists leave out relationships. upsertByEntityId replaces
// the stored row, so a field the response left out keeps its stored value,
// while a field the response cleared is removed from the saved row.
function keepStored<T extends object>(
	stored: T | undefined,
	next: RowPatch<T>,
): T {
	// Copies the stored entity's keys, whose types differ per field.
	const merged: Record<string, unknown> = { ...stored };
	for (const [key, value] of Object.entries(next)) {
		if (value === null) delete merged[key];
		else if (value !== undefined) merged[key] = value;
	}
	// Safe: every key comes from `stored` or `next`, which describe the same T,
	// and nulls were removed above.
	return merged as T;
}

export async function persistNetworks(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.networks.findByEntityId(id);
			await ctx.db.networks.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					name: toText(attributes.name),
					organizationId: pick(
						relationshipId(row, 'organization'),
						toText(attributes.organization_id),
					),
					policyId: pick(
						relationshipId(row, 'policy'),
						toText(attributes.policy_id),
					),
					blockPageId: toText(attributes.block_page_id),
					scheduledPolicyId: toText(attributes.scheduled_policy_id),
					createdAt: toDate(attributes.created_at),
					updatedAt: toDate(attributes.updated_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter network:', error);
		}
	}
}

export async function persistPolicies(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.policies.findByEntityId(id);
			await ctx.db.policies.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					name: toText(attributes.name),
					organizationId: pick(
						relationshipId(row, 'organization'),
						toText(attributes.organization_id),
					),
					createdAt: toDate(attributes.created_at),
					updatedAt: toDate(attributes.updated_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter policy:', error);
		}
	}
}

export async function persistOrganizations(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.organizations.findByEntityId(id);
			await ctx.db.organizations.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					name: toText(attributes.name),
					createdAt: toDate(attributes.created_at),
					updatedAt: toDate(attributes.updated_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter organization:', error);
		}
	}
}

export async function persistUsers(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.users.findByEntityId(id);
			await ctx.db.users.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					name: toText(attributes.name),
					email: toText(attributes.email),
					role: toText(attributes.role),
					organizationId: pick(
						relationshipId(row, 'organization'),
						toText(attributes.organization_id),
					),
					createdAt: toDate(attributes.created_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter user:', error);
		}
	}
}

export async function persistUserAgents(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.userAgents.findByEntityId(id);
			await ctx.db.userAgents.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					name: pick(
						toText(attributes.friendly_name),
						toText(attributes.hostname),
					),
					platform: pick(
						toText(attributes.os_name),
						toText(attributes.agent_type),
					),
					status: toText(attributes.status),
					organizationId: pick(
						relationshipId(row, 'organization'),
						toText(attributes.organization_id),
					),
					networkId: pick(
						relationshipId(row, 'network'),
						toText(attributes.network_id),
					),
					createdAt: toDate(attributes.created_at),
					lastSeenAt: pick(
						toDate(attributes.last_sync),
						toDate(attributes.last_seen_at),
					),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter user agent:', error);
		}
	}
}

export async function persistIpAddresses(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.ipAddresses.findByEntityId(id);
			await ctx.db.ipAddresses.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					address: pick(toText(attributes.ip), toText(attributes.address)),
					policyId: pick(
						relationshipId(row, 'policy'),
						toText(attributes.policy_id),
					),
					organizationId: pick(
						relationshipId(row, 'organization'),
						toText(attributes.organization_id),
					),
					comment: toText(attributes.comment),
					createdAt: toDate(attributes.created_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter IP address:', error);
		}
	}
}

export async function persistMacAddresses(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.macAddresses.findByEntityId(id);
			await ctx.db.macAddresses.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					address: pick(toText(attributes.mac), toText(attributes.address)),
					policyId: pick(
						relationshipId(row, 'policy'),
						toText(attributes.policy_id),
					),
					organizationId: pick(
						relationshipId(row, 'organization'),
						toText(attributes.organization_id),
					),
					comment: toText(attributes.comment),
					createdAt: toDate(attributes.created_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter MAC address:', error);
		}
	}
}

export async function persistSubnets(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.subnets.findByEntityId(id);
			await ctx.db.subnets.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					name: toText(attributes.name),
					from: toText(attributes.from),
					to: toText(attributes.to),
					networkId: pick(
						relationshipId(row, 'network'),
						toText(attributes.network_id),
					),
					createdAt: toDate(attributes.created_at),
					updatedAt: toDate(attributes.updated_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter subnet:', error);
		}
	}
}

export async function persistUnblockRequests(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.unblockRequests.findByEntityId(id);
			await ctx.db.unblockRequests.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					domain: toText(attributes.domain),
					status: pick(toText(attributes.status), toText(attributes.action)),
					organizationId: pick(
						nestedId(attributes.organization),
						toText(attributes.organization_id),
					),
					createdAt: pick(
						toDate(attributes.time_of_attempt),
						toDate(attributes.created_at),
					),
					resolvedAt: pick(
						toDate(attributes.resolved_date),
						toDate(attributes.decided_at),
					),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter unblock request:', error);
		}
	}
}

export async function persistScheduledReports(
	ctx: DnsfilterContext,
	// Endpoint response, narrowed through collectRows/asRecord below.
	payload: unknown,
): Promise<void> {
	for (const row of collectRows(payload)) {
		const id = toId(row.id);
		if (!id) continue;
		const attributes = attributesOf(row);
		try {
			const stored = await ctx.db.scheduledReports.findByEntityId(id);
			await ctx.db.scheduledReports.upsertByEntityId(
				id,
				keepStored(stored?.data, {
					id,
					name: toText(attributes.name),
					frequency: toText(attributes.frequency),
					organizationId: pick(
						relationshipId(row, 'organization'),
						nestedId(attributes.organization),
						toText(attributes.organization_id),
					),
					createdAt: toDate(attributes.created_at),
					updatedAt: toDate(attributes.updated_at),
				}),
			);
		} catch (error) {
			console.warn('Failed to persist DNSFilter scheduled report:', error);
		}
	}
}
