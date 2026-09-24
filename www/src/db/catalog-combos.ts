import { asc, eq, inArray } from 'drizzle-orm';

import type { DB } from '@/db';
import {
	catalogIntegrationComboFaqs,
	catalogIntegrationComboKbSources,
	catalogIntegrationComboKbToolApps,
	catalogIntegrationComboKbTools,
	catalogIntegrationComboMembers,
	catalogIntegrationComboPickerItems,
	catalogIntegrationCombos,
	catalogIntegrationComboWorkflows,
	catalogIntegrations,
} from '@/db/catalog-schema';
import type {
	ComboAction,
	ComboData,
	ComboFaq,
	ComboKbTool,
	ComboTrigger,
	ComboWorkflow,
} from '@/lib/combo-types';

export function catalogComboSetId(memberIds: string[]): string {
	return [...memberIds].sort((a, b) => a.localeCompare(b)).join('+');
}

function pickerItemToTriggerOrAction(
	row: typeof catalogIntegrationComboPickerItems.$inferSelect,
	displayNameById: Map<string, string>,
): ComboTrigger | ComboAction {
	const appLabel = displayNameById.get(row.integrationId) ?? row.integrationId;
	return {
		id: row.shortPath,
		app: row.integrationId,
		appLabel,
		label: row.label,
		description: row.description,
	};
}

async function loadComboBundle(db: DB, comboId: string) {
	const [combo] = await db
		.select()
		.from(catalogIntegrationCombos)
		.where(eq(catalogIntegrationCombos.id, comboId))
		.limit(1);

	if (!combo) return null;

	const [
		members,
		pickerItems,
		workflows,
		faqs,
		kbTools,
		kbToolApps,
		kbSources,
	] = await Promise.all([
		db
			.select()
			.from(catalogIntegrationComboMembers)
			.where(eq(catalogIntegrationComboMembers.comboId, comboId))
			.orderBy(asc(catalogIntegrationComboMembers.sortOrder)),
		db
			.select()
			.from(catalogIntegrationComboPickerItems)
			.where(eq(catalogIntegrationComboPickerItems.comboId, comboId))
			.orderBy(asc(catalogIntegrationComboPickerItems.sortOrder)),
		db
			.select()
			.from(catalogIntegrationComboWorkflows)
			.where(eq(catalogIntegrationComboWorkflows.comboId, comboId))
			.orderBy(asc(catalogIntegrationComboWorkflows.sortOrder)),
		db
			.select({
				id: catalogIntegrationComboFaqs.faqId,
				question: catalogIntegrationComboFaqs.question,
				answer: catalogIntegrationComboFaqs.answer,
			})
			.from(catalogIntegrationComboFaqs)
			.where(eq(catalogIntegrationComboFaqs.comboId, comboId))
			.orderBy(asc(catalogIntegrationComboFaqs.sortOrder)),
		db
			.select()
			.from(catalogIntegrationComboKbTools)
			.where(eq(catalogIntegrationComboKbTools.comboId, comboId))
			.orderBy(asc(catalogIntegrationComboKbTools.sortOrder)),
		db
			.select({
				toolId: catalogIntegrationComboKbToolApps.toolId,
				integrationId: catalogIntegrationComboKbToolApps.integrationId,
				appLabel: catalogIntegrationComboKbToolApps.appLabel,
			})
			.from(catalogIntegrationComboKbToolApps)
			.innerJoin(
				catalogIntegrationComboKbTools,
				eq(
					catalogIntegrationComboKbToolApps.toolId,
					catalogIntegrationComboKbTools.id,
				),
			)
			.where(eq(catalogIntegrationComboKbTools.comboId, comboId)),
		db
			.select()
			.from(catalogIntegrationComboKbSources)
			.where(eq(catalogIntegrationComboKbSources.comboId, comboId))
			.orderBy(asc(catalogIntegrationComboKbSources.sortOrder)),
	]);

	if (members.length < 2) return null;

	const integrationIds = members.map((member) => member.integrationId);
	const integrationRows = await db
		.select({
			id: catalogIntegrations.id,
			displayName: catalogIntegrations.displayName,
			apiCount: catalogIntegrations.apiCount,
			webhooksCount: catalogIntegrations.webhooksCount,
		})
		.from(catalogIntegrations)
		.where(inArray(catalogIntegrations.id, integrationIds));

	const displayNameById = new Map(
		integrationRows.map((row) => [row.id, row.displayName]),
	);
	const countsById = new Map(
		integrationRows.map((row) => [
			row.id,
			{ ops: row.apiCount, triggers: row.webhooksCount },
		]),
	);

	const pickerById = new Map(pickerItems.map((row) => [row.id, row]));

	const triggers = pickerItems
		.filter((row) => row.itemType === 'trigger')
		.map((row) => pickerItemToTriggerOrAction(row, displayNameById));

	const actions = pickerItems
		.filter((row) => row.itemType === 'action')
		.map((row) => pickerItemToTriggerOrAction(row, displayNameById));

	const workflowRows: ComboWorkflow[] = workflows.map((workflow) => {
		const triggerRow = pickerById.get(workflow.triggerPickerItemId);
		const actionRow = pickerById.get(workflow.actionPickerItemId);
		if (!triggerRow || !actionRow) {
			throw new Error(
				`Combo ${comboId} workflow ${workflow.id} references missing picker items`,
			);
		}
		return {
			id: workflow.id,
			title: workflow.title,
			description: workflow.description,
			trigger: pickerItemToTriggerOrAction(
				triggerRow,
				displayNameById,
			) as ComboTrigger,
			action: pickerItemToTriggerOrAction(
				actionRow,
				displayNameById,
			) as ComboAction,
		};
	});

	const appsByToolId = new Map<
		string,
		Array<{ appId: string; appLabel: string }>
	>();
	for (const row of kbToolApps) {
		const toolId = row.toolId;
		const integrationId = row.integrationId;
		const appLabel =
			row.appLabel ?? displayNameById.get(integrationId) ?? integrationId;
		const existing = appsByToolId.get(toolId);
		const entry = { appId: integrationId, appLabel };
		if (existing) {
			existing.push(entry);
		} else {
			appsByToolId.set(toolId, [entry]);
		}
	}

	const kbToolRows: ComboKbTool[] = kbTools.map((tool) => {
		const apps = appsByToolId.get(tool.id) ?? [];
		if (apps.length === 0) {
			throw new Error(`Combo ${comboId} kb tool ${tool.id} has no apps`);
		}
		return {
			apps: apps as ComboKbTool['apps'],
			op: tool.op,
			label: tool.label,
			result: tool.result,
		};
	});

	const slugA = members[0]?.integrationId;
	const slugB = members[1]?.integrationId;
	if (!slugA || !slugB) return null;

	const displayA = displayNameById.get(slugA) ?? slugA;
	const displayB = displayNameById.get(slugB) ?? slugB;

	const worksWithA = members[0]?.worksWithBlurb ?? '';
	const worksWithB = members[1]?.worksWithBlurb ?? '';

	const counts = members.map((member) => {
		const count = countsById.get(member.integrationId);
		return {
			id: member.integrationId,
			ops: count?.ops ?? 0,
			triggers: count?.triggers ?? 0,
		};
	});

	const faqRows: ComboFaq[] = faqs.map((faq) => ({
		id: faq.id,
		question: faq.question,
		answer: faq.answer,
	}));

	const data: ComboData = {
		slugA,
		slugB,
		displayA,
		displayB,
		title: combo.title,
		description: combo.description,
		introA: '',
		introB: '',
		counts,
		triggers,
		actions,
		workflows: workflowRows,
		connectSteps: [],
		worksWith: {
			a: worksWithA,
			b: worksWithB,
		},
		kb: {
			query: combo.kbQuery,
			answer: combo.kbAnswer,
			tools: kbToolRows,
			sources: kbSources.map((source) => ({
				label: source.label,
				href: source.href,
				appId: source.integrationId,
				appLabel:
					displayNameById.get(source.integrationId) ?? source.integrationId,
			})),
		},
		faqs: faqRows,
	};

	return data;
}

export async function fetchCatalogComboIds(db: DB): Promise<string[]> {
	const rows = await db
		.select({ id: catalogIntegrationCombos.id })
		.from(catalogIntegrationCombos)
		.orderBy(asc(catalogIntegrationCombos.id));
	return rows.map((row) => row.id);
}

export async function fetchCatalogComboByMemberIds(
	db: DB,
	slugA: string,
	slugB: string,
): Promise<ComboData | null> {
	const a = slugA.toLowerCase().trim();
	const b = slugB.toLowerCase().trim();
	if (!a || !b || a === b) return null;
	return loadComboBundle(db, catalogComboSetId([a, b]));
}

export async function fetchAllCatalogCombos(db: DB): Promise<ComboData[]> {
	const ids = await fetchCatalogComboIds(db);
	const combos: ComboData[] = [];
	for (const id of ids) {
		const combo = await loadComboBundle(db, id);
		if (combo) combos.push(combo);
	}
	return combos;
}

export type ComboRouteKey = {
	slugA: string;
	slugB: string;
};

export async function fetchCatalogComboRouteKeys(
	db: DB,
): Promise<ComboRouteKey[]> {
	const members = await db
		.select()
		.from(catalogIntegrationComboMembers)
		.orderBy(
			asc(catalogIntegrationComboMembers.comboId),
			asc(catalogIntegrationComboMembers.sortOrder),
		);

	const byCombo = new Map<string, string[]>();
	for (const member of members) {
		const existing = byCombo.get(member.comboId);
		if (existing) {
			existing.push(member.integrationId);
		} else {
			byCombo.set(member.comboId, [member.integrationId]);
		}
	}

	const keys: ComboRouteKey[] = [];
	for (const memberIds of byCombo.values()) {
		if (memberIds.length < 2) continue;
		const slugA = memberIds[0];
		const slugB = memberIds[1];
		if (!slugA || !slugB) continue;
		keys.push({ slugA, slugB });
	}
	return keys;
}
