import type { MocoEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type { CustomPropertiesInput } from './types';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MocoEndpoints['projectsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		({
			page,
			include_archived,
			company_id,
			leader_id,
			project_group_id,
			deal_id,
			created_from,
			created_to,
			updated_from,
			updated_to,
			tags,
			identifier,
			retainer,
			term,
		}) => ({
			replayable: true,
			method: 'GET',
			path: '/projects',
			query: {
				page,
				include_archived,
				company_id,
				leader_id,
				project_group_id,
				deal_id,
				created_from,
				created_to,
				updated_from,
				updated_to,
				tags,
				identifier,
				retainer,
				term,
			},
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MocoEndpoints['projectsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		({ id, include_company }) => ({
			replayable: true,
			method: 'GET',
			path: `/projects/${segment(id)}`,
			query: { include_company },
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

function upsertBody(input: {
	identifier?: string;
	name?: string;
	company_id?: number;
	leader_id?: number;
	co_leader_id?: number;
	contact_id?: number;
	secondary_contact_id?: number;
	billing_contact_id?: number;
	deal_id?: number;
	project_group_id?: number;
	currency?: string;
	hourly_rate?: number;
	budget?: number;
	budget_monthly?: number;
	budget_expenses?: number;
	start_date?: string;
	finish_date?: string;
	fixed_price?: boolean;
	retainer?: boolean;
	billing_variant?: string;
	billing_address?: string;
	billing_email_to?: string;
	billing_email_cc?: string;
	billing_notes?: string;
	setting_include_time_report?: boolean;
	info?: string;
	color?: string;
	skip_favorite?: boolean;
	tags?: string[];
	custom_properties?: CustomPropertiesInput;
}) {
	return {
		identifier: input.identifier,
		name: input.name,
		company_id: input.company_id,
		leader_id: input.leader_id,
		co_leader_id: input.co_leader_id,
		contact_id: input.contact_id,
		secondary_contact_id: input.secondary_contact_id,
		billing_contact_id: input.billing_contact_id,
		deal_id: input.deal_id,
		project_group_id: input.project_group_id,
		currency: input.currency,
		hourly_rate: input.hourly_rate,
		budget: input.budget,
		budget_monthly: input.budget_monthly,
		budget_expenses: input.budget_expenses,
		start_date: input.start_date,
		finish_date: input.finish_date,
		fixed_price: input.fixed_price,
		retainer: input.retainer,
		billing_variant: input.billing_variant,
		billing_address: input.billing_address,
		billing_email_to: input.billing_email_to,
		billing_email_cc: input.billing_email_cc,
		billing_notes: input.billing_notes,
		setting_include_time_report: input.setting_include_time_report,
		info: input.info,
		color: input.color,
		skip_favorite: input.skip_favorite,
		tags: input.tags,
		custom_properties: input.custom_properties,
	};
}

export const create: MocoEndpoints['projectsCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.create',
			input: Inputs.projectsCreate,
			output: Outputs.projectsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/projects',
			body: upsertBody(parsed),
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const update: MocoEndpoints['projectsUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/projects/${segment(id)}`,
			body: upsertBody(rest),
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const archive: MocoEndpoints['projectsArchive'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.archive',
			input: Inputs.projectsArchive,
			output: Outputs.projectsArchive,
		},
		input,
		({ id }) => ({
			method: 'PUT',
			path: `/projects/${segment(id)}/archive`,
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ project: raw }),
			log: ({ id }) => ({ id }),
		},
	);

export const unarchive: MocoEndpoints['projectsUnarchive'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'projects.unarchive',
			input: Inputs.projectsUnarchive,
			output: Outputs.projectsUnarchive,
		},
		input,
		({ id }) => ({
			method: 'PUT',
			path: `/projects/${segment(id)}/unarchive`,
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ project: raw }),
			log: ({ id }) => ({ id }),
		},
	);

export const report: MocoEndpoints['projectsReport'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.report',
			input: Inputs.projectsReport,
			output: Outputs.projectsReport,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/projects/${segment(id)}/report`,
		}),
		{
			shape: (raw) => ({ report: raw }),
			log: ({ id }) => ({ id }),
		},
	);
