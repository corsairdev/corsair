import { asc, eq } from 'drizzle-orm';

import type { DB } from '@/db';
import {
	catalogIntegrationFaqs,
	catalogIntegrationOperations,
	catalogIntegrations,
	catalogIntegrationTriggers,
} from '@/db/catalog-schema';
import type {
	IntegrationCapabilityAction,
	IntegrationCapabilityGroup,
	IntegrationDetailData,
	IntegrationRiskLevel,
} from '@/lib/integration-page.types';
import type {
	IntegrationAuthType,
	IntegrationCatalogEntry,
} from '@/lib/integrations-catalog.types';

function humanizeToken(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseRiskLevel(
	value?: string | null,
): IntegrationRiskLevel | undefined {
	if (value === 'read' || value === 'write' || value === 'destructive') {
		return value;
	}
	return undefined;
}

type EndpointRow = {
	shortPath: string;
	resource: string;
	name: string;
	description: string | null;
	riskLevel: string | null;
};

function groupEndpoints(
	endpoints: EndpointRow[],
	popularIds: Set<string> = new Set(),
): IntegrationCapabilityGroup[] {
	const groups = new Map<string, IntegrationCapabilityAction[]>();

	for (const endpoint of endpoints) {
		const action: IntegrationCapabilityAction = {
			id: endpoint.shortPath,
			label: endpoint.name,
			description: endpoint.description ?? undefined,
			riskLevel: parseRiskLevel(endpoint.riskLevel),
			popular: popularIds.has(endpoint.shortPath),
		};

		const existing = groups.get(endpoint.resource);
		if (existing) {
			existing.push(action);
		} else {
			groups.set(endpoint.resource, [action]);
		}
	}

	return [...groups.entries()]
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([resource, actions]) => ({
			resource,
			resourceLabel: humanizeToken(resource),
			actions: actions.sort((a, b) => a.label.localeCompare(b.label)),
		}));
}

function parseAuthType(value: string | null | undefined): IntegrationAuthType {
	if (value === 'oauth_2' || value === 'api_key' || value === 'bot_token') {
		return value;
	}
	return 'api_key';
}

function toCatalogEntry(
	row: typeof catalogIntegrations.$inferSelect,
): IntegrationCatalogEntry {
	const counts = {
		api: row.apiCount,
		webhooks: row.webhooksCount,
		db: row.dbCount,
	};

	return {
		id: row.id,
		displayName: row.displayName,
		description: row.description,
		npmPackageName: row.npmPackageName,
		authTypes: row.authTypes,
		defaultAuthType: parseAuthType(row.defaultAuthType ?? row.authTypes[0]),
		counts,
		totalOperations: counts.api + counts.webhooks + counts.db,
	};
}

export async function fetchCatalogIntegrationsList(
	db: DB,
): Promise<IntegrationCatalogEntry[]> {
	const rows = await db
		.select()
		.from(catalogIntegrations)
		.orderBy(asc(catalogIntegrations.displayName));

	return rows.map(toCatalogEntry);
}

export async function fetchCatalogIntegrationById(
	db: DB,
	id: string,
): Promise<IntegrationDetailData | null> {
	const [integration] = await db
		.select()
		.from(catalogIntegrations)
		.where(eq(catalogIntegrations.id, id))
		.limit(1);

	if (!integration) return null;

	const [operationRows, triggerRows, faqRows] = await Promise.all([
		db
			.select({
				shortPath: catalogIntegrationOperations.shortPath,
				resource: catalogIntegrationOperations.resource,
				name: catalogIntegrationOperations.name,
				description: catalogIntegrationOperations.description,
				riskLevel: catalogIntegrationOperations.riskLevel,
			})
			.from(catalogIntegrationOperations)
			.where(eq(catalogIntegrationOperations.integrationId, id))
			.orderBy(
				asc(catalogIntegrationOperations.resource),
				asc(catalogIntegrationOperations.name),
			),
		db
			.select({
				shortPath: catalogIntegrationTriggers.shortPath,
				resource: catalogIntegrationTriggers.resource,
				name: catalogIntegrationTriggers.name,
				description: catalogIntegrationTriggers.description,
			})
			.from(catalogIntegrationTriggers)
			.where(eq(catalogIntegrationTriggers.integrationId, id))
			.orderBy(
				asc(catalogIntegrationTriggers.resource),
				asc(catalogIntegrationTriggers.name),
			),
		db
			.select({
				id: catalogIntegrationFaqs.faqId,
				question: catalogIntegrationFaqs.question,
				answer: catalogIntegrationFaqs.answer,
			})
			.from(catalogIntegrationFaqs)
			.where(eq(catalogIntegrationFaqs.integrationId, id))
			.orderBy(asc(catalogIntegrationFaqs.sortOrder)),
	]);

	const counts = {
		api: integration.apiCount,
		webhooks: integration.webhooksCount,
		db: integration.dbCount,
	};

	return {
		id: integration.id,
		displayName: integration.displayName,
		blurb: integration.description,
		description: integration.description,
		popularOperationIds: [],
		faqs: faqRows,
		counts,
		operations: groupEndpoints(operationRows),
		triggers: groupEndpoints(
			triggerRows.map((row) => ({ ...row, riskLevel: null })),
		),
	};
}

export async function fetchCatalogIntegrationIds(db: DB): Promise<string[]> {
	const rows = await db
		.select({ id: catalogIntegrations.id })
		.from(catalogIntegrations)
		.orderBy(asc(catalogIntegrations.id));

	return rows.map((row) => row.id);
}
