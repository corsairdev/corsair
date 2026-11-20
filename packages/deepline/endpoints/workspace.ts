import { makeDeeplineRequest } from '../client';
import { defineEndpoint } from './common';
import {
	ListServiceAccountsInputSchema,
	ListServiceAccountsOutputSchema,
	ListWorkspaceMembersInputSchema,
	ListWorkspaceMembersOutputSchema,
} from './types-integrations';

const membersList = defineEndpoint({
	event: 'deepline.workspace.members.list',
	input: ListWorkspaceMembersInputSchema,
	output: ListWorkspaceMembersOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`/api/v2/auth/workspace/members`, ctx.key, {
			method: 'GET',
			query: { cursor: input.cursor },
		}),
});
const serviceAccountsList = defineEndpoint({
	event: 'deepline.workspace.serviceAccounts.list',
	input: ListServiceAccountsInputSchema,
	output: ListServiceAccountsOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`/api/v2/auth/workspace/service-accounts`, ctx.key, {
			method: 'GET',
		}),
});
export const members = { list: membersList };
export const serviceAccounts = { list: serviceAccountsList };
