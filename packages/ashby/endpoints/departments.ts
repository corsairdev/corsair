import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	DepartmentArchiveResponse,
	DepartmentCreateResponse,
	DepartmentInfoResponse,
	DepartmentListResponse,
	DepartmentUpdateResponse,
} from './types';

export const info: AshbyEndpoints['department.info'] = async (ctx, input) => {
	return await ashbyCall<DepartmentInfoResponse>(ctx, 'department.info', {
		departmentId: input.departmentId,
	});
};

export const list: AshbyEndpoints['department.list'] = async (ctx, input) => {
	return await ashbyCall<DepartmentListResponse>(ctx, 'department.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		includeArchived: input.includeArchived,
	});
};

export const create: AshbyEndpoints['department.create'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<DepartmentCreateResponse>(ctx, 'department.create', {
		name: input.name,
		parentId: input.parentId,
	});
};

export const update: AshbyEndpoints['department.update'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<DepartmentUpdateResponse>(ctx, 'department.update', {
		departmentId: input.departmentId,
		name: input.name,
		parentId: input.parentId,
	});
};

export const archive: AshbyEndpoints['department.archive'] = async (
	ctx,
	input,
) => {
	return await ashbyCall<DepartmentArchiveResponse>(ctx, 'department.archive', {
		departmentId: input.departmentId,
	});
};
