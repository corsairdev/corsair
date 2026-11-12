import { z } from 'zod';
import { PostHogJson, ProjectScopeSchema } from './read-types';

// Inputs for PostHog's write actions. Release conditions, queries, metrics and
// survey questions are PostHog's own nested structures and pass through as
// records (z.record / loose objects); PostHog validates them server-side.

function hasChange(keys: readonly string[]) {
	// Runs on any update input object; only checks which keys are set.
	return (value: Record<string, unknown>) =>
		keys.some((key) => value[key] !== undefined);
}
const CHANGE_MESSAGE = { message: 'Provide at least one field to update' };

const QueryObject = z.object({ kind: z.string().min(1) }).loose();
// Release conditions, metrics, filters and survey questions: PostHog's own
// nested JSON, validated by PostHog server-side.
const PostHogRecord = z.record(z.string(), PostHogJson);
const IdInput = ProjectScopeSchema.extend({ id: z.number().int().positive() });

// ── Insights ─────────────────────────────────────────────────────────────────

const InsightFields = {
	name: z.string().min(1),
	/** An InsightVizNode / DataVisualizationNode, or a TrendsQuery etc. */
	query: QueryObject,
	description: z.string().optional(),
	/** Dashboard ids to add the insight to. */
	dashboards: z.array(z.number().int().positive()).optional(),
	tags: z.array(z.string()).optional(),
	favorited: z.boolean().optional(),
};

export const InsightsCreateInputSchema =
	ProjectScopeSchema.extend(InsightFields);
export const InsightsUpdateInputSchema = IdInput.extend({
	name: InsightFields.name.optional(),
	query: QueryObject.optional(),
	description: InsightFields.description,
	dashboards: InsightFields.dashboards,
	tags: InsightFields.tags,
	favorited: InsightFields.favorited,
}).refine(
	hasChange([
		'name',
		'query',
		'description',
		'dashboards',
		'tags',
		'favorited',
	]),
	CHANGE_MESSAGE,
);
export const InsightsDeleteInputSchema = IdInput;

// ── Dashboards ───────────────────────────────────────────────────────────────

export const DashboardsCreateInputSchema = ProjectScopeSchema.extend({
	name: z.string().min(1),
	description: z.string().optional(),
	pinned: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
});
export const DashboardsUpdateInputSchema = IdInput.extend({
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	pinned: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
}).refine(hasChange(['name', 'description', 'pinned', 'tags']), CHANGE_MESSAGE);
export const DashboardsDeleteInputSchema = IdInput.extend({
	/** Also delete insights that live only on this dashboard. */
	delete_insights: z.boolean().optional(),
});

// ── Feature flags ────────────────────────────────────────────────────────────

export const FeatureFlagsCreateInputSchema = ProjectScopeSchema.extend({
	key: z
		.string()
		.min(1)
		.regex(/^[a-zA-Z0-9_-]+$/, 'Use letters, numbers, - and _ only'),
	name: z.string().optional(),
	/** PostHog makes a new flag active unless this is false. */
	active: z.boolean().optional(),
	/** Release conditions; wins over rollout_percentage. */
	filters: PostHogRecord.optional(),
	/** Shortcut: one condition for everyone at this percentage. */
	rollout_percentage: z.number().min(0).max(100).optional(),
	tags: z.array(z.string()).optional(),
	ensure_experience_continuity: z.boolean().optional(),
});
export const FeatureFlagsDeleteInputSchema = IdInput;

// ── Cohorts ──────────────────────────────────────────────────────────────────

export const CohortsGetInputSchema = IdInput;
export const CohortsCreateInputSchema = ProjectScopeSchema.extend({
	name: z.string().min(1),
	description: z.string().optional(),
	/** Matching rules, e.g. { properties: { type: 'AND', values: [...] } }. */
	filters: PostHogRecord.optional(),
	/** A static cohort holds a fixed list of persons. */
	is_static: z.boolean().optional(),
});
export const CohortsUpdateInputSchema = IdInput.extend({
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	filters: PostHogRecord.optional(),
}).refine(hasChange(['name', 'description', 'filters']), CHANGE_MESSAGE);

// ── Experiments (drafts; launching is done in PostHog) ───────────────────────

export const ExperimentsCreateInputSchema = ProjectScopeSchema.extend({
	name: z.string().min(1),
	/** Key of the flag PostHog creates for the experiment. */
	feature_flag_key: z
		.string()
		.min(1)
		.regex(/^[a-zA-Z0-9_-]+$/, 'Use letters, numbers, - and _ only'),
	description: z.string().optional(),
	/** e.g. { feature_flag_variants: [{ key: 'control', rollout_percentage: 50 }, ...] } */
	parameters: PostHogRecord.optional(),
	metrics: z.array(PostHogRecord).optional(),
	metrics_secondary: z.array(PostHogRecord).optional(),
});
export const ExperimentsUpdateInputSchema = IdInput.extend({
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	parameters: PostHogRecord.optional(),
	metrics: z.array(PostHogRecord).optional(),
	metrics_secondary: z.array(PostHogRecord).optional(),
	archived: z.boolean().optional(),
}).refine(
	hasChange([
		'name',
		'description',
		'parameters',
		'metrics',
		'metrics_secondary',
		'archived',
	]),
	CHANGE_MESSAGE,
);

// ── Surveys (drafts; launching is done in PostHog) ───────────────────────────

const SurveyQuestion = z
	.object({
		/** open, single_choice, multiple_choice, rating, link */
		type: z.string().min(1),
		question: z.string().min(1),
	})
	.loose();

export const SurveysCreateInputSchema = ProjectScopeSchema.extend({
	name: z.string().min(1),
	/** popover, widget, api or external_survey; defaults to api. */
	type: z.enum(['popover', 'widget', 'api', 'external_survey']).optional(),
	questions: z.array(SurveyQuestion).min(1),
	description: z.string().optional(),
	linked_flag_id: z.number().int().positive().optional(),
	appearance: PostHogRecord.optional(),
	conditions: PostHogRecord.optional(),
});
export const SurveysUpdateInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	questions: z.array(SurveyQuestion).min(1).optional(),
	appearance: PostHogRecord.optional(),
	conditions: PostHogRecord.optional(),
	archived: z.boolean().optional(),
}).refine(
	hasChange([
		'name',
		'description',
		'questions',
		'appearance',
		'conditions',
		'archived',
	]),
	CHANGE_MESSAGE,
);
export const SurveysDeleteInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
});

// ── Annotations, actions, persons, notebooks ─────────────────────────────────

export const AnnotationsUpdateInputSchema = IdInput.extend({
	content: z.string().min(1).optional(),
	date_marker: z.string().optional(),
	scope: z.enum(['project', 'organization', 'dashboard_item']).optional(),
}).refine(hasChange(['content', 'date_marker', 'scope']), CHANGE_MESSAGE);
export const AnnotationsDeleteInputSchema = IdInput;

export const ActionsGetInputSchema = IdInput;
export const ActionsCreateInputSchema = ProjectScopeSchema.extend({
	name: z.string().min(1),
	description: z.string().optional(),
	/** Any step matching makes the action match. */
	steps: z
		.array(
			z
				.object({
					event: z.string().nullable().optional(),
					url: z.string().nullable().optional(),
					url_matching: z.enum(['contains', 'regex', 'exact']).optional(),
					selector: z.string().nullable().optional(),
					text: z.string().nullable().optional(),
					href: z.string().nullable().optional(),
					properties: z.array(PostHogRecord).optional(),
				})
				.loose(),
		)
		.min(1),
	tags: z.array(z.string()).optional(),
});

export const PersonsUpdatePropertyInputSchema = ProjectScopeSchema.extend({
	/** Person UUID. */
	id: z.string().min(1),
	key: z.string().min(1),
	/** Any JSON value; person properties are schemaless in PostHog. */
	value: PostHogJson,
});
export const PersonsDeletePropertyInputSchema = ProjectScopeSchema.extend({
	id: z.string().min(1),
	key: z.string().min(1),
});

export const NotebooksCreateInputSchema = ProjectScopeSchema.extend({
	title: z.string().min(1),
	/** Plain text; blank lines start new paragraphs. Ignored when content is set. */
	text: z.string().optional(),
	/** Full notebook document in PostHog's (TipTap) format. */
	content: PostHogRecord.optional(),
});

// ── Outputs ──────────────────────────────────────────────────────────────────

export const DeletedResponseSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		deleted: z.literal(true),
	})
	.loose();

export const PersonPropertyResponseSchema = z
	.object({
		id: z.string(),
		key: z.string(),
		success: z.boolean(),
	})
	.loose();
