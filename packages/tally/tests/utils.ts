import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError } from 'corsair/http';

import { makeTallyRequest } from '../client';
import type {
	FormsListResponse,
	UsersGetMeResponse,
	WorkspacesListResponse,
} from '../endpoints/types';

export const TEST_API_KEY = process.env.TALLY_API_KEY;

export const tallyDescribe = TEST_API_KEY ? describe : describe.skip;

export function getKey(): string {
	return TEST_API_KEY as string;
}

export function mockApiError(
	status: number,
	message: string,
	retryAfter?: number,
): ApiError {
	const request: ApiRequestOptions = {
		method: 'GET',
		url: 'https://api.tally.so/forms',
	};
	const response: ApiResult = {
		url: 'https://api.tally.so/forms',
		ok: false,
		status,
		statusText: status === 429 ? 'Too Many Requests' : 'Error',
		body: {},
	};
	return new ApiError(request, response, message, { retryAfter });
}

export async function getFirstFormId(key: string): Promise<string> {
	const list = await makeTallyRequest<FormsListResponse>('forms', key, {
		method: 'GET',
		query: { page: 1, limit: 1 },
	});
	if (!list.items[0]?.id) {
		throw new Error('No forms available for tests');
	}
	return list.items[0].id;
}

export async function getFirstWorkspaceId(
	key: string,
): Promise<string | undefined> {
	const ws = await makeTallyRequest<WorkspacesListResponse>('workspaces', key, {
		method: 'GET',
		query: { page: 1 },
	});
	return ws.items[0]?.id;
}

export async function getOrganizationId(key: string): Promise<string> {
	const me = await makeTallyRequest<UsersGetMeResponse>('users/me', key, {
		method: 'GET',
	});
	const orgId = (me as UsersGetMeResponse & { organizationId?: string })
		.organizationId;
	if (!orgId) {
		throw new Error('User has no organizationId');
	}
	return orgId;
}
