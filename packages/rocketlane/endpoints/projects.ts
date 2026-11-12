import type { z } from 'zod';
import type { RocketlaneEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { filterOf } from './filters';
import { deletedShape, pagedShape, singleShape } from './shape';
import {
	RocketlaneEndpointInputSchemas as Inputs,
	RocketlaneEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The fields a create and an update share, all optional: an update sends only
 * what changed, while a create's schema has already made its own fields
 * required before reaching this builder.
 */
type ProjectWriteBody = Partial<z.output<(typeof Inputs)['projectsCreate']>>;

export const list: RocketlaneEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/1.0/projects',
			replayable: true,
			query: {
				...queryOf({
					pageSize: parsed.page_size,
					pageToken: parsed.page_token,
					includeAllFields: parsed.include_all_fields,
					sortBy: parsed.sort_by,
					sortOrder: parsed.sort_order,
					match: parsed.match,
				}),
				includeFields: parsed.include_fields,
				...filterOf('projectName', parsed.project_name),
				...filterOf('status', parsed.status),
				...filterOf('companyId', parsed.company_id),
				...filterOf('customerId', parsed.customer_id),
				...filterOf('teamMemberId', parsed.team_member_id),
				...filterOf('contractType', parsed.contract_type),
				...filterOf('includeArchive', parsed.include_archive),
				...filterOf('externalReferenceId', parsed.external_reference_id),
				...filterOf(
					'annualizedRecurringRevenue',
					parsed.annualized_recurring_revenue,
				),
				...filterOf('projectFee', parsed.project_fee),
				...filterOf('budgetedHours', parsed.budgeted_hours),
				...filterOf('allocatedHours', parsed.allocated_hours),
			},
		}),
		{
			shape: pagedShape('projects'),
			log: (_, result) => ({
				count: result.projects.length,
				hasMore: result.has_more,
			}),
		},
	);

export const get: RocketlaneEndpoints['projectsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.get',
			input: Inputs.projectsGet,
			output: Outputs.projectsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/1.0/projects/${segment(parsed.project_id)}`,
			replayable: true,
			query: {
				...queryOf({ includeAllFields: parsed.include_all_fields }),
				includeFields: parsed.include_fields,
			},
		}),
		{
			shape: singleShape('project'),
			log: (_, result) => ({ projectId: result.project.projectId ?? 0 }),
		},
	);

/**
 * The customer and owner blocks take either an id or a name, and Rocketlane
 * rejects a block that names neither. The input schema has already enforced
 * that, so the body just renames the fields to the wire spelling.
 */
// unknown: the body is assembled under provider field names from a
// schema-validated input, so its values are the provider's own shapes.
function projectBody(input: ProjectWriteBody): Record<string, unknown> {
	const customer = input.customer;
	const owner = input.owner;
	return {
		projectName: input.project_name,
		customer: customer
			? {
					companyId: customer.company_id,
					companyName: customer.company_name,
				}
			: undefined,
		owner: owner
			? { userId: owner.user_id, emailId: owner.email_id }
			: undefined,
		startDate: input.start_date,
		dueDate: input.due_date,
		visibility: input.visibility,
		teamMembers: input.team_member_ids
			? { members: input.team_member_ids.map((userId) => ({ userId })) }
			: undefined,
		currency: input.currency,
		annualizedRecurringRevenue: input.annualized_recurring_revenue,
		projectFee: input.project_fee,
		budgetedHours: input.budgeted_hours,
		externalReferenceId: input.external_reference_id,
		autoCreateCompany: input.auto_create_company,
		assignProjectOwner: input.assign_project_owner,
		fields: input.fields?.map((field) => ({
			fieldId: field.fieldId,
			fieldValue: field.value,
		})),
	};
}

export const create: RocketlaneEndpoints['projectsCreate'] = (ctx, input) =>
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
			path: '/1.0/projects',
			replayable: false,
			body: projectBody(parsed),
		}),
		{
			shape: singleShape('project'),
			log: (_, result) => ({ projectId: result.project.projectId ?? 0 }),
		},
	);

export const update: RocketlaneEndpoints['projectsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.update',
			input: Inputs.projectsUpdate,
			output: Outputs.projectsUpdate,
		},
		input,
		(parsed) => {
			const { project_id: projectId, ...rest } = parsed;
			return {
				method: 'PUT',
				path: `/1.0/projects/${segment(projectId)}`,
				replayable: false,
				body: projectBody(rest),
			};
		},
		{
			shape: singleShape('project'),
			log: (parsed, result) => ({
				projectId: parsed.project_id,
				status: result.project.status?.value ?? undefined,
			}),
		},
	);

export const remove: RocketlaneEndpoints['projectsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.delete',
			input: Inputs.projectsDelete,
			output: Outputs.projectsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/1.0/projects/${segment(parsed.project_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('project_id'),
			log: (parsed) => ({ projectId: parsed.project_id }),
		},
	);

export const archive: RocketlaneEndpoints['projectsArchive'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.archive',
			input: Inputs.projectsArchive,
			output: Outputs.projectsArchive,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/1.0/projects/${segment(parsed.project_id)}/archive`,
			replayable: false,
		}),
		{
			shape: deletedShape('project_id'),
			log: (parsed) => ({ projectId: parsed.project_id }),
		},
	);
