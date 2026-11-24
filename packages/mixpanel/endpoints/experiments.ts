import { z } from 'zod';
import { segment } from '../client';
import { op } from './call';
import {
	LooseObject,
	okEnvelope,
	PropertiesSchema,
	RequiredWorkspaceIdSchema,
} from './common';

const ExperimentSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		hypothesis: z.string().nullish(),
		status: z.string().nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
		variants: z.array(LooseObject).nullish(),
		metrics: z.array(LooseObject).nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

const Envelope = okEnvelope(ExperimentSchema);

const ExperimentId = z.string().min(1).describe('The experiment id.');

const path = (workspaceId: number, experimentId?: string, action?: string) =>
	`/workspaces/${workspaceId}/experiments${experimentId ? `/${segment(experimentId)}` : ''}${action ? `/${action}` : ''}`;

const Ref = z.object({
	workspace_id: RequiredWorkspaceIdSchema,
	experiment_id: ExperimentId,
});

export const list = op({
	name: 'experiments.list',
	input: z.object({ workspace_id: RequiredWorkspaceIdSchema }),
	output: okEnvelope(z.array(ExperimentSchema)),
	meta: {
		riskLevel: 'read',
		description: 'List the experiments of a workspace',
	},
	toRequest: (input) => ({
		service: 'app',
		method: 'GET',
		path: path(input.workspace_id),
	}),
});

export const get = op({
	name: 'experiments.get',
	input: Ref,
	output: Envelope,
	meta: { riskLevel: 'read', description: 'Get one experiment' },
	toRequest: (input) => ({
		service: 'app',
		method: 'GET',
		path: path(input.workspace_id, input.experiment_id),
	}),
});

export const create = op({
	name: 'experiments.create',
	input: z
		.object({
			workspace_id: RequiredWorkspaceIdSchema,
			name: z.string().min(1),
			description: z.string().optional(),
			hypothesis: z.string().optional(),
			settings: PropertiesSchema.optional(),
			variants: z.array(LooseObject).optional(),
			metrics: z.array(LooseObject).optional(),
			global_access_type: z.string().optional(),
		})
		.loose(),
	output: Envelope,
	meta: { riskLevel: 'write', description: 'Create a draft experiment' },
	toRequest: ({ workspace_id, ...body }) => ({
		service: 'app',
		method: 'POST',
		path: path(workspace_id),
		body,
		mediaType: 'application/json',
	}),
});

export const update = op({
	name: 'experiments.update',
	input: Ref.extend({
		name: z.string().optional(),
		description: z.string().optional(),
		hypothesis: z.string().optional(),
		status: z.string().optional(),
		settings: PropertiesSchema.optional(),
		variants: z.array(LooseObject).optional(),
		metrics: z.array(LooseObject).optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		tags: z.array(z.string()).optional(),
		global_access_type: z.string().optional(),
	}).loose(),
	output: Envelope,
	meta: { riskLevel: 'write', description: "Update an experiment's fields" },
	toRequest: ({ workspace_id, experiment_id, ...body }) => ({
		service: 'app',
		method: 'PATCH',
		path: path(workspace_id, experiment_id),
		body,
		mediaType: 'application/json',
	}),
});

export const remove = op({
	name: 'experiments.delete',
	input: Ref,
	output: okEnvelope(LooseObject),
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an experiment',
	},
	toRequest: (input) => ({
		service: 'app',
		method: 'DELETE',
		path: path(input.workspace_id, input.experiment_id),
	}),
});

export const archive = op({
	name: 'experiments.archive',
	input: Ref,
	output: Envelope,
	meta: { riskLevel: 'write', description: 'Archive an experiment' },
	toRequest: (input) => ({
		service: 'app',
		method: 'POST',
		path: path(input.workspace_id, input.experiment_id, 'archive'),
		body: {},
		mediaType: 'application/json',
	}),
});

export const unarchive = op({
	name: 'experiments.unarchive',
	input: Ref,
	output: Envelope,
	meta: { riskLevel: 'write', description: 'Restore an archived experiment' },
	toRequest: (input) => ({
		service: 'app',
		method: 'DELETE',
		path: path(input.workspace_id, input.experiment_id, 'archive'),
	}),
});

export const launch = op({
	name: 'experiments.launch',
	input: Ref,
	output: Envelope,
	meta: {
		riskLevel: 'destructive',
		description: 'Launch an experiment: live users start getting its variants',
	},
	toRequest: (input) => ({
		service: 'app',
		method: 'PUT',
		path: path(input.workspace_id, input.experiment_id, 'launch'),
		body: {},
		mediaType: 'application/json',
	}),
});

export const decide = op({
	name: 'experiments.decide',
	input: Ref.extend({
		success: z.boolean().describe('Whether the experiment succeeded.'),
		variant: z.string().optional().describe('The winning variant key.'),
		message: z.string().optional(),
	}),
	output: Envelope,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Record the decision on a concluded experiment (success and winning variant)',
	},
	toRequest: ({ workspace_id, experiment_id, ...body }) => ({
		service: 'app',
		method: 'PATCH',
		path: path(workspace_id, experiment_id, 'decide'),
		body,
		mediaType: 'application/json',
	}),
});

export const forceConclude = op({
	name: 'experiments.forceConclude',
	input: Ref.extend({ end_date: z.string().optional() }),
	output: Envelope,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop a running experiment now, ending exposure to its variants',
	},
	toRequest: ({ workspace_id, experiment_id, ...body }) => ({
		service: 'app',
		method: 'PUT',
		path: path(workspace_id, experiment_id, 'force_conclude'),
		body,
		mediaType: 'application/json',
	}),
});
