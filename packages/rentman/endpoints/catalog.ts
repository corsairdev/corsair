import type { RentmanEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { filterQuery, listQuery } from './contacts';
import { pagedShape, singleShape } from './shape';
import {
	RentmanEndpointInputSchemas as Inputs,
	RentmanEndpointOutputSchemas as Outputs,
} from './types';

export const projectsList: RentmanEndpoints['projectsList'] = (ctx, input) =>
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
			path: '/projects',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({ deposit_status: parsed.deposit_status }),
				...filterQuery('name', parsed.name),
				...filterQuery('number', parsed.number),
				...filterQuery('modified', parsed.modified),
			},
		}),
		{
			shape: pagedShape('projects'),
			log: (_, result) => ({
				count: result.projects.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const projectsGet: RentmanEndpoints['projectsGet'] = (ctx, input) =>
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
			path: `/projects/${segment(parsed.project_id)}`,
			replayable: true,
			query: queryOf({
				fields: parsed.fields?.join(','),
				expand: parsed.expand?.join(','),
			}),
		}),
		{
			shape: singleShape('project'),
			log: (_, result) => ({ projectId: result.project.id ?? 0 }),
		},
	);

export const projectsCreate: RentmanEndpoints['projectsCreate'] = (
	ctx,
	input,
) =>
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
			replayable: false,
			body: queryOf({
				name: parsed.name,
				customer: parsed.customer,
				number: parsed.number,
				reference: parsed.reference,
				account_manager: parsed.account_manager,
				deposit_status: parsed.deposit_status,
				color: parsed.color,
				conditions: parsed.conditions,
				refundabledeposit: parsed.refundabledeposit,
			}),
		}),
		{
			shape: singleShape('project'),
			log: (_, result) => ({ projectId: result.project.id ?? 0 }),
		},
	);

export const projectsUpdate: RentmanEndpoints['projectsUpdate'] = (
	ctx,
	input,
) =>
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
				path: `/projects/${segment(projectId)}`,
				replayable: false,
				body: queryOf({
					name: rest.name,
					customer: rest.customer,
					number: rest.number,
					reference: rest.reference,
					account_manager: rest.account_manager,
					deposit_status: rest.deposit_status,
					color: rest.color,
					conditions: rest.conditions,
					refundabledeposit: rest.refundabledeposit,
				}),
			};
		},
		{
			shape: singleShape('project'),
			log: (parsed) => ({ projectId: parsed.project_id }),
		},
	);

export const equipmentList: RentmanEndpoints['equipmentList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'equipment.list',
			input: Inputs.equipmentList,
			output: Outputs.equipmentList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/equipment',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({ in_shop: parsed.in_shop, folder: parsed.folder }),
				...filterQuery('name', parsed.name),
				...filterQuery('code', parsed.code),
				...filterQuery('modified', parsed.modified),
			},
		}),
		{
			shape: pagedShape('equipment'),
			log: (_, result) => ({
				count: result.equipment.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const equipmentGet: RentmanEndpoints['equipmentGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'equipment.get',
			input: Inputs.equipmentGet,
			output: Outputs.equipmentGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/equipment/${segment(parsed.equipment_id)}`,
			replayable: true,
			query: queryOf({
				fields: parsed.fields?.join(','),
				expand: parsed.expand?.join(','),
			}),
		}),
		{
			shape: singleShape('equipment'),
			log: (_, result) => ({ equipmentId: result.equipment.id ?? 0 }),
		},
	);

/** The equipment fields, already in the wire spelling. */
export function equipmentBody(parsed: {
	name?: string;
	code?: string;
	in_shop?: boolean;
	folder?: string;
	type?: number;
	price?: number;
	list_price?: number;
	weight?: number;
	volume?: number;
	power?: number;
	height?: number;
	width?: number;
	length?: number;
	internal_remark?: string;
	external_remark?: string;
}): Record<string, string | number | boolean | undefined> {
	return queryOf(parsed);
}

export const equipmentCreate: RentmanEndpoints['equipmentCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'equipment.create',
			input: Inputs.equipmentCreate,
			output: Outputs.equipmentCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/equipment',
			replayable: false,
			body: equipmentBody(parsed),
		}),
		{
			shape: singleShape('equipment'),
			log: (_, result) => ({ equipmentId: result.equipment.id ?? 0 }),
		},
	);

export const equipmentUpdate: RentmanEndpoints['equipmentUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'equipment.update',
			input: Inputs.equipmentUpdate,
			output: Outputs.equipmentUpdate,
		},
		input,
		(parsed) => {
			const { equipment_id: equipmentId, ...rest } = parsed;
			return {
				method: 'PUT',
				path: `/equipment/${segment(equipmentId)}`,
				replayable: false,
				body: equipmentBody(rest),
			};
		},
		{
			shape: singleShape('equipment'),
			log: (parsed) => ({ equipmentId: parsed.equipment_id }),
		},
	);
