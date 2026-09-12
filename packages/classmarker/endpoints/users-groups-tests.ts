import type { ClassmarkerEndpoints } from '..';
import { runClassmarkerEndpoint } from './helpers';
import {
	CreateGroupInputSchema,
	CreateGroupOutputSchema,
	CreateUserInputSchema,
	CreateUserOutputSchema,
	DeleteGroupInputSchema,
	DeleteGroupOutputSchema,
	DeleteTestLinkInputSchema,
	DeleteTestLinkOutputSchema,
	DeleteUserInputSchema,
	DeleteUserOutputSchema,
	GetGroupDetailsInputSchema,
	GetGroupDetailsOutputSchema,
	GetTestDetailsInputSchema,
	GetTestDetailsOutputSchema,
	GetUserDetailsInputSchema,
	GetUserDetailsOutputSchema,
	ListTestsInputSchema,
	ListTestsOutputSchema,
	ListUsersInputSchema,
	ListUsersOutputSchema,
} from './types';

export const listUsers: ClassmarkerEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const parsedInput = ListUsersInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'listUsers',
		path: '/v1/users.json',
		input: parsedInput,
		inputSchema: ListUsersInputSchema,
		outputSchema: ListUsersOutputSchema,
		query: {
			page: parsedInput.page,
		},
	});
};

export const getUserDetails: ClassmarkerEndpoints['getUserDetails'] = async (
	ctx,
	input,
) => {
	const parsedInput = GetUserDetailsInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'getUserDetails',
		path: `/v1/users/${parsedInput.user_id}.json`,
		input: parsedInput,
		inputSchema: GetUserDetailsInputSchema,
		outputSchema: GetUserDetailsOutputSchema,
		logPayload: {
			user_id: parsedInput.user_id,
		},
	});
};

export const createUser: ClassmarkerEndpoints['createUser'] = async (
	ctx,
	input,
) => {
	const parsedInput = CreateUserInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'createUser',
		path: '/v1/users.json',
		method: 'POST',
		input: parsedInput,
		inputSchema: CreateUserInputSchema,
		outputSchema: CreateUserOutputSchema,
		body: parsedInput,
		logPayload: {
			email: parsedInput.email,
			group_count: parsedInput.group_ids?.length ?? 0,
		},
	});
};

export const deleteUser: ClassmarkerEndpoints['deleteUser'] = async (
	ctx,
	input,
) => {
	const parsedInput = DeleteUserInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'deleteUser',
		path: `/v1/users/${parsedInput.user_id}.json`,
		method: 'DELETE',
		input: parsedInput,
		inputSchema: DeleteUserInputSchema,
		outputSchema: DeleteUserOutputSchema,
		logPayload: {
			user_id: parsedInput.user_id,
		},
	});
};

export const createGroup: ClassmarkerEndpoints['createGroup'] = async (
	ctx,
	input,
) => {
	const parsedInput = CreateGroupInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'createGroup',
		path: '/v1/groups.json',
		method: 'POST',
		input: parsedInput,
		inputSchema: CreateGroupInputSchema,
		outputSchema: CreateGroupOutputSchema,
		body: parsedInput,
	});
};

export const deleteGroup: ClassmarkerEndpoints['deleteGroup'] = async (
	ctx,
	input,
) => {
	const parsedInput = DeleteGroupInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'deleteGroup',
		path: `/v1/groups/${parsedInput.group_id}.json`,
		method: 'DELETE',
		input: parsedInput,
		inputSchema: DeleteGroupInputSchema,
		outputSchema: DeleteGroupOutputSchema,
		logPayload: {
			group_id: parsedInput.group_id,
		},
	});
};

export const getGroupDetails: ClassmarkerEndpoints['getGroupDetails'] = async (
	ctx,
	input,
) => {
	const parsedInput = GetGroupDetailsInputSchema.parse(input);
	const all = await runClassmarkerEndpoint(ctx, {
		operation: 'getGroupDetails',
		path: '/v1.json',
		input: parsedInput,
		inputSchema: GetGroupDetailsInputSchema,
		outputSchema: GetGroupDetailsOutputSchema,
		responseTransformer: (response) => {
			const groups =
				typeof response === 'object' && response !== null
					? ((response as { groups?: Array<{ group?: unknown }> }).groups ?? [])
					: [];

			const matchedGroup = groups.find((item) => {
				if (!item || typeof item !== 'object' || !('group' in item)) {
					return false;
				}
				const group = (item as { group?: { group_id?: unknown } }).group;
				return Number(group?.group_id) === parsedInput.group_id;
			});

			if (!matchedGroup) {
				return {
					status: 'no_results',
				};
			}

			return {
				status: 'ok',
				group: (matchedGroup as { group: unknown }).group,
			};
		},
		logPayload: {
			group_id: parsedInput.group_id,
		},
	});

	return all;
};

export const listTests: ClassmarkerEndpoints['listTests'] = async (
	ctx,
	input,
) => {
	const parsedInput = ListTestsInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'listTests',
		path: '/v1.json',
		input: parsedInput,
		inputSchema: ListTestsInputSchema,
		outputSchema: ListTestsOutputSchema,
		responseTransformer: (response) => {
			const testsById = new Map<
				number,
				{ test_id: number; test_name: string }
			>();
			const fromContainer = (
				container: unknown,
				key: 'groups' | 'links',
			): void => {
				if (!container || typeof container !== 'object') {
					return;
				}
				const rows = (container as { [K in typeof key]?: unknown })[key];
				if (!Array.isArray(rows)) {
					return;
				}
				for (const row of rows) {
					if (!row || typeof row !== 'object') {
						continue;
					}
					const branch =
						(row as { group?: unknown; link?: unknown }).group ??
						(row as { group?: unknown; link?: unknown }).link;
					if (!branch || typeof branch !== 'object') {
						continue;
					}
					const assigned =
						(branch as { assigned_tests?: unknown }).assigned_tests ?? [];
					if (!Array.isArray(assigned)) {
						continue;
					}
					for (const assignment of assigned) {
						if (!assignment || typeof assignment !== 'object') {
							continue;
						}
						const test = (assignment as { test?: unknown }).test;
						if (!test || typeof test !== 'object') {
							continue;
						}
						const testId = Number((test as { test_id?: unknown }).test_id);
						const testName = (test as { test_name?: unknown }).test_name;
						if (!Number.isFinite(testId) || typeof testName !== 'string') {
							continue;
						}
						if (!testsById.has(testId)) {
							testsById.set(testId, { test_id: testId, test_name: testName });
						}
					}
				}
			};

			fromContainer(response, 'groups');
			fromContainer(response, 'links');

			return {
				status: testsById.size > 0 ? 'ok' : 'no_results',
				tests: Array.from(testsById.values()),
			};
		},
	});
};

export const getTestDetails: ClassmarkerEndpoints['getTestDetails'] = async (
	ctx,
	input,
) => {
	const parsedInput = GetTestDetailsInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'getTestDetails',
		path: '/v1.json',
		input: parsedInput,
		inputSchema: GetTestDetailsInputSchema,
		outputSchema: GetTestDetailsOutputSchema,
		responseTransformer: (response) => {
			const assignments: Array<{
				test: { test_id: number; test_name: string };
				group?: { group_id: number; group_name: string };
				link?: {
					link_id: number;
					link_name: string;
					link_url_id?: string;
					access_list_id?: number;
				};
			}> = [];

			let targetTest: { test_id: number; test_name: string } | undefined;

			const collectAssignments = (
				rows: unknown,
				owner: 'group' | 'link',
			): void => {
				if (!Array.isArray(rows)) {
					return;
				}
				for (const row of rows) {
					if (!row || typeof row !== 'object') {
						continue;
					}
					const node = (row as { group?: unknown; link?: unknown })[owner];
					if (!node || typeof node !== 'object') {
						continue;
					}
					const assigned =
						(node as { assigned_tests?: unknown }).assigned_tests ?? [];
					if (!Array.isArray(assigned)) {
						continue;
					}
					for (const entry of assigned) {
						if (!entry || typeof entry !== 'object') {
							continue;
						}
						const test = (entry as { test?: unknown }).test;
						if (!test || typeof test !== 'object') {
							continue;
						}
						const testId = Number((test as { test_id?: unknown }).test_id);
						const testName = (test as { test_name?: unknown }).test_name;
						if (
							!Number.isFinite(testId) ||
							testId !== parsedInput.test_id ||
							typeof testName !== 'string'
						) {
							continue;
						}

						targetTest = { test_id: testId, test_name: testName };
						if (owner === 'group') {
							assignments.push({
								test: targetTest,
								group: {
									group_id: Number((node as { group_id?: unknown }).group_id),
									group_name: String(
										(node as { group_name?: unknown }).group_name,
									),
								},
							});
						} else {
							assignments.push({
								test: targetTest,
								link: {
									link_id: Number((node as { link_id?: unknown }).link_id),
									link_name: String(
										(node as { link_name?: unknown }).link_name,
									),
									link_url_id:
										typeof (node as { link_url_id?: unknown }).link_url_id ===
										'string'
											? String((node as { link_url_id?: unknown }).link_url_id)
											: undefined,
									access_list_id:
										typeof (node as { access_list_id?: unknown })
											.access_list_id === 'number'
											? Number(
													(node as { access_list_id?: unknown }).access_list_id,
												)
											: undefined,
								},
							});
						}
					}
				}
			};

			if (response && typeof response === 'object') {
				collectAssignments((response as { groups?: unknown }).groups, 'group');
				collectAssignments((response as { links?: unknown }).links, 'link');
			}

			return {
				status: targetTest ? 'ok' : 'no_results',
				test: targetTest,
				assignments,
			};
		},
		logPayload: {
			test_id: parsedInput.test_id,
		},
	});
};

export const deleteTestLink: ClassmarkerEndpoints['deleteTestLink'] = async (
	ctx,
	input,
) => {
	const parsedInput = DeleteTestLinkInputSchema.parse(input);
	return runClassmarkerEndpoint(ctx, {
		operation: 'deleteTestLink',
		path: `/v1/links/${parsedInput.link_id}/tests/${parsedInput.test_id}.json`,
		method: 'DELETE',
		input: parsedInput,
		inputSchema: DeleteTestLinkInputSchema,
		outputSchema: DeleteTestLinkOutputSchema,
		logPayload: {
			link_id: parsedInput.link_id,
			test_id: parsedInput.test_id,
		},
	});
};
