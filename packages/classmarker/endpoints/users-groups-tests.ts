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

// unknown justified: ClassMarker returns untyped JSON; records are narrowed with
// `typeof`/`Array.isArray` below and validated by Zod output schemas afterwards.
type ProviderRecord = Record<string, unknown>;

// unknown justified: provider payloads arrive untyped; this guard narrows them to
// key/value records before any field access, with Zod output schemas validating after.
function isProviderRecord(value: unknown): value is ProviderRecord {
	return typeof value === 'object' && value !== null;
}

// unknown justified: provider field values are untyped JSON; callers narrow the
// result with `typeof`/`Array.isArray` before use.
function readProviderField(record: ProviderRecord, key: string): unknown {
	return record[key];
}

// unknown justified: provider arrays contain untyped entries; every entry is
// narrowed with isProviderRecord before field access.
function readProviderArray(value: unknown): Array<unknown> | undefined {
	if (!Array.isArray(value)) {
		return undefined;
	}
	return value;
}

function readStringField(
	record: ProviderRecord,
	key: string,
): string | undefined {
	const value = readProviderField(record, key);
	return typeof value === 'string' ? value : undefined;
}

function readCoercedString(
	record: ProviderRecord,
	key: string,
): string | undefined {
	const value = readProviderField(record, key);
	if (typeof value === 'string') {
		return value;
	}
	if (typeof value === 'number' || typeof value === 'boolean') {
		return String(value);
	}
	return undefined;
}

function readCoercedNumber(
	record: ProviderRecord,
	key: string,
): number | undefined {
	const value = readProviderField(record, key);
	if (typeof value !== 'string' && typeof value !== 'number') {
		return undefined;
	}
	const numeric = Number(value);
	return Number.isFinite(numeric) ? numeric : undefined;
}

function readStrictNumber(
	record: ProviderRecord,
	key: string,
): number | undefined {
	const value = readProviderField(record, key);
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

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
			const groups = isProviderRecord(response)
				? readProviderArray(readProviderField(response, 'groups'))
				: undefined;
			if (!groups) {
				return {
					status: 'no_results',
				};
			}

			const matchedGroup = groups.find((item) => {
				if (!isProviderRecord(item)) {
					return false;
				}
				const group = readProviderField(item, 'group');
				if (!isProviderRecord(group)) {
					return false;
				}
				return readCoercedNumber(group, 'group_id') === parsedInput.group_id;
			});

			if (!isProviderRecord(matchedGroup)) {
				return {
					status: 'no_results',
				};
			}

			const group = readProviderField(matchedGroup, 'group');
			if (!isProviderRecord(group)) {
				return {
					status: 'no_results',
				};
			}

			return {
				status: 'ok',
				group,
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
				// unknown justified: untyped provider `groups`/`links` container;
				// narrowed with isProviderRecord before any field access.
				container: unknown,
				key: 'groups' | 'links',
			): void => {
				if (!isProviderRecord(container)) {
					return;
				}
				const rows = readProviderArray(readProviderField(container, key));
				if (!rows) {
					return;
				}
				for (const row of rows) {
					if (!isProviderRecord(row)) {
						continue;
					}
					const groupBranch = readProviderField(row, 'group');
					const linkBranch = readProviderField(row, 'link');
					const branch = isProviderRecord(groupBranch)
						? groupBranch
						: linkBranch;
					if (!isProviderRecord(branch)) {
						continue;
					}
					const assigned = readProviderArray(
						readProviderField(branch, 'assigned_tests'),
					);
					if (!assigned) {
						continue;
					}
					for (const assignment of assigned) {
						if (!isProviderRecord(assignment)) {
							continue;
						}
						const test = readProviderField(assignment, 'test');
						if (!isProviderRecord(test)) {
							continue;
						}
						const testId = readCoercedNumber(test, 'test_id');
						const testName = readStringField(test, 'test_name');
						if (testId === undefined || testName === undefined) {
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
				// unknown justified: untyped provider `groups`/`links` rows;
				// every row is narrowed with isProviderRecord before field access.
				rows: unknown,
				owner: 'group' | 'link',
			): void => {
				const items = readProviderArray(rows);
				if (!items) {
					return;
				}
				for (const row of items) {
					if (!isProviderRecord(row)) {
						continue;
					}
					const node = readProviderField(row, owner);
					if (!isProviderRecord(node)) {
						continue;
					}
					const assigned = readProviderArray(
						readProviderField(node, 'assigned_tests'),
					);
					if (!assigned) {
						continue;
					}
					for (const entry of assigned) {
						if (!isProviderRecord(entry)) {
							continue;
						}
						const test = readProviderField(entry, 'test');
						if (!isProviderRecord(test)) {
							continue;
						}
						const testId = readCoercedNumber(test, 'test_id');
						const testName = readStringField(test, 'test_name');
						if (
							testId === undefined ||
							testId !== parsedInput.test_id ||
							testName === undefined
						) {
							continue;
						}

						targetTest = { test_id: testId, test_name: testName };
						if (owner === 'group') {
							const groupId = readCoercedNumber(node, 'group_id');
							const groupName = readCoercedString(node, 'group_name');
							if (groupId === undefined || groupName === undefined) {
								continue;
							}
							assignments.push({
								test: targetTest,
								group: {
									group_id: groupId,
									group_name: groupName,
								},
							});
						} else {
							const linkId = readCoercedNumber(node, 'link_id');
							const linkName = readCoercedString(node, 'link_name');
							if (linkId === undefined || linkName === undefined) {
								continue;
							}
							const linkUrlId = readStringField(node, 'link_url_id');
							const accessListId = readStrictNumber(node, 'access_list_id');
							assignments.push({
								test: targetTest,
								link: {
									link_id: linkId,
									link_name: linkName,
									...(linkUrlId === undefined
										? {}
										: { link_url_id: linkUrlId }),
									...(accessListId === undefined
										? {}
										: { access_list_id: accessListId }),
								},
							});
						}
					}
				}
			};

			if (isProviderRecord(response)) {
				collectAssignments(readProviderField(response, 'groups'), 'group');
				collectAssignments(readProviderField(response, 'links'), 'link');
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
