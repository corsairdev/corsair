import { z } from 'zod';

const text = z.string().min(1);

export const comboTriggerSchema = z.object({
	id: text,
	app: text,
	appLabel: text,
	label: text,
	description: text,
});

export const comboActionSchema = comboTriggerSchema;

export const comboWorkflowSchema = z.object({
	id: text,
	title: text,
	description: text,
	trigger: comboTriggerSchema,
	action: comboActionSchema,
});

export const connectStepSchema = z.object({
	title: text,
	description: text,
});

export const comboFaqSchema = z.object({
	id: text,
	question: text,
	answer: text,
});

export const comboKbAppSchema = z.object({
	appId: text,
	appLabel: text,
});

export const comboKbToolSchema = z.object({
	apps: z.tuple([comboKbAppSchema]).rest(comboKbAppSchema),
	op: text,
	label: text,
	result: text,
});

export const comboCountSchema = z.object({
	id: text,
	ops: z.number().int().nonnegative(),
	triggers: z.number().int().nonnegative(),
});

export const comboDataSchema = z
	.object({
		slugA: text,
		slugB: text,
		displayA: text,
		displayB: text,
		title: text,
		description: text,
		introA: text.optional().default(''),
		introB: text.optional().default(''),
		counts: z.array(comboCountSchema).min(2),
		triggers: z.array(comboTriggerSchema).min(1),
		actions: z.array(comboActionSchema).min(1),
		workflows: z.array(comboWorkflowSchema).min(1),
		connectSteps: z.array(connectStepSchema).optional().default([]),
		worksWith: z.object({
			a: text,
			b: text,
		}),
		kb: z.object({
			query: text,
			answer: text,
			tools: z.array(comboKbToolSchema).min(1),
			sources: z
				.array(
					z.object({
						label: text,
						href: text,
						appId: text,
						appLabel: text,
					}),
				)
				.min(1),
		}),
		faqs: z.array(comboFaqSchema).min(1),
	})
	.refine((combo) => combo.slugA !== combo.slugB, {
		message: 'slugA and slugB must differ',
	})
	.refine(
		(combo) => {
			const ids = new Set(combo.counts.map((row) => row.id));
			return ids.has(combo.slugA) && ids.has(combo.slugB);
		},
		{ message: 'counts must include slugA and slugB' },
	)
	.refine(
		(combo) => {
			const slugs = new Set([combo.slugA, combo.slugB]);
			return (
				combo.triggers.every((row) => slugs.has(row.app)) &&
				combo.actions.every((row) => slugs.has(row.app)) &&
				combo.kb.tools.every((tool) =>
					tool.apps.every((app) => slugs.has(app.appId)),
				) &&
				combo.kb.sources.every((source) => slugs.has(source.appId))
			);
		},
		{ message: 'trigger, action, and kb app ids must be slugA or slugB' },
	)
	.refine(
		(combo) => {
			const keys = new Set(combo.triggers.map((row) => `${row.app}.${row.id}`));
			return combo.workflows.every((workflow) =>
				keys.has(`${workflow.trigger.app}.${workflow.trigger.id}`),
			);
		},
		{ message: 'workflow triggers must exist in triggers' },
	)
	.refine(
		(combo) => {
			const keys = new Set(combo.actions.map((row) => `${row.app}.${row.id}`));
			return combo.workflows.every((workflow) =>
				keys.has(`${workflow.action.app}.${workflow.action.id}`),
			);
		},
		{ message: 'workflow actions must exist in actions' },
	);

export type ComboTrigger = z.infer<typeof comboTriggerSchema>;
export type ComboAction = z.infer<typeof comboActionSchema>;
export type ComboWorkflow = z.infer<typeof comboWorkflowSchema>;
export type ConnectStep = z.infer<typeof connectStepSchema>;
export type ComboFaq = z.infer<typeof comboFaqSchema>;
export type ComboKbApp = z.infer<typeof comboKbAppSchema>;
export type ComboKbTool = z.infer<typeof comboKbToolSchema>;
export type ComboCount = z.infer<typeof comboCountSchema>;
export type ComboData = z.infer<typeof comboDataSchema>;

export type ComboWorksWithItem = {
	id: string;
	displayName: string;
	href: string;
	blurb: string;
};

export function comboCountsFor({
	combo,
	appId,
}: {
	combo: ComboData;
	appId: string;
}): { api: number; webhooks: number } {
	const row = combo.counts.find((count) => count.id === appId);
	if (!row) return { api: 0, webhooks: 0 };
	return { api: row.ops, webhooks: row.triggers };
}

export function worksWithFor({
	combos,
	integrationId,
}: {
	combos: readonly ComboData[];
	integrationId: string;
}): ComboWorksWithItem[] {
	const id = integrationId.toLowerCase().trim();
	if (!id) return [];

	const items: ComboWorksWithItem[] = [];
	for (const combo of combos) {
		if (combo.slugA === id) {
			items.push({
				id: combo.slugB,
				displayName: combo.displayB,
				href: `/integrations/${combo.slugA}/and/${combo.slugB}`,
				blurb: combo.worksWith.a,
			});
		} else if (combo.slugB === id) {
			items.push({
				id: combo.slugA,
				displayName: combo.displayA,
				href: `/integrations/${combo.slugA}/and/${combo.slugB}`,
				blurb: combo.worksWith.b,
			});
		}
	}
	return items;
}
