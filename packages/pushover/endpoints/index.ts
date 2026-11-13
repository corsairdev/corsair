import { makePushoverRequest } from '../client';
import type { PushoverEndpoints } from '../index';
import {
	PushoverEndpointInputSchemas as inputs,
	PushoverEndpointOutputSchemas as outputs,
} from './types';

const messagesSend: PushoverEndpoints['messagesSend'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'messages.json',
		inputs.messagesSend.parse(input),
		outputs.messagesSend,
	);
const usersValidate: PushoverEndpoints['usersValidate'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'users/validate.json',
		inputs.usersValidate.parse(input),
		outputs.usersValidate,
	);
const soundsList: PushoverEndpoints['soundsList'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'GET',
		'sounds.json',
		inputs.soundsList.parse(input),
		outputs.soundsList,
	);
const appsLimits: PushoverEndpoints['appsLimits'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'GET',
		'apps/limits.json',
		inputs.appsLimits.parse(input),
		outputs.appsLimits,
	);
const receiptsGet: PushoverEndpoints['receiptsGet'] = async (ctx, input) => {
	const { receipt } = inputs.receiptsGet.parse(input);
	return makePushoverRequest(
		ctx.key,
		'GET',
		`receipts/${encodeURIComponent(receipt)}.json`,
		{},
		outputs.receiptsGet,
	);
};
const receiptsCancel: PushoverEndpoints['receiptsCancel'] = async (
	ctx,
	input,
) => {
	const { receipt } = inputs.receiptsCancel.parse(input);
	return makePushoverRequest(
		ctx.key,
		'POST',
		`receipts/${encodeURIComponent(receipt)}/cancel.json`,
		{},
		outputs.receiptsCancel,
	);
};
const receiptsCancelByTag: PushoverEndpoints['receiptsCancelByTag'] = async (
	ctx,
	input,
) => {
	const { tag } = inputs.receiptsCancelByTag.parse(input);
	return makePushoverRequest(
		ctx.key,
		'POST',
		`receipts/cancel_by_tag/${encodeURIComponent(tag)}.json`,
		{},
		outputs.receiptsCancelByTag,
	);
};
const groupsCreate: PushoverEndpoints['groupsCreate'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'groups.json',
		inputs.groupsCreate.parse(input),
		outputs.groupsCreate,
	);
const groupsList: PushoverEndpoints['groupsList'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'GET',
		'groups.json',
		inputs.groupsList.parse(input),
		outputs.groupsList,
	);
const groupsGet: PushoverEndpoints['groupsGet'] = async (ctx, input) => {
	const { group } = inputs.groupsGet.parse(input);
	return makePushoverRequest(
		ctx.key,
		'GET',
		`groups/${encodeURIComponent(group)}.json`,
		{},
		outputs.groupsGet,
	);
};
const groupsAddUser: PushoverEndpoints['groupsAddUser'] = async (
	ctx,
	input,
) => {
	const { group, ...body } = inputs.groupsAddUser.parse(input);
	return makePushoverRequest(
		ctx.key,
		'POST',
		`groups/${encodeURIComponent(group)}/add_user.json`,
		body,
		outputs.groupsAddUser,
	);
};
const groupsRemoveUser: PushoverEndpoints['groupsRemoveUser'] = async (
	ctx,
	input,
) => {
	const { group, ...body } = inputs.groupsRemoveUser.parse(input);
	return makePushoverRequest(
		ctx.key,
		'POST',
		`groups/${encodeURIComponent(group)}/remove_user.json`,
		body,
		outputs.groupsRemoveUser,
	);
};
const groupsDisableUser: PushoverEndpoints['groupsDisableUser'] = async (
	ctx,
	input,
) => {
	const { group, ...body } = inputs.groupsDisableUser.parse(input);
	return makePushoverRequest(
		ctx.key,
		'POST',
		`groups/${encodeURIComponent(group)}/disable_user.json`,
		body,
		outputs.groupsDisableUser,
	);
};
const groupsEnableUser: PushoverEndpoints['groupsEnableUser'] = async (
	ctx,
	input,
) => {
	const { group, ...body } = inputs.groupsEnableUser.parse(input);
	return makePushoverRequest(
		ctx.key,
		'POST',
		`groups/${encodeURIComponent(group)}/enable_user.json`,
		body,
		outputs.groupsEnableUser,
	);
};
const groupsRename: PushoverEndpoints['groupsRename'] = async (ctx, input) => {
	const { group, ...body } = inputs.groupsRename.parse(input);
	return makePushoverRequest(
		ctx.key,
		'POST',
		`groups/${encodeURIComponent(group)}/rename.json`,
		body,
		outputs.groupsRename,
	);
};
const glancesUpdate: PushoverEndpoints['glancesUpdate'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'glances.json',
		inputs.glancesUpdate.parse(input),
		outputs.glancesUpdate,
	);
const subscriptionsMigrate: PushoverEndpoints['subscriptionsMigrate'] = async (
	ctx,
	input,
) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'subscriptions/migrate.json',
		inputs.subscriptionsMigrate.parse(input),
		outputs.subscriptionsMigrate,
	);
const licensesGet: PushoverEndpoints['licensesGet'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'GET',
		'licenses.json',
		inputs.licensesGet.parse(input),
		outputs.licensesGet,
	);
const licensesAssign: PushoverEndpoints['licensesAssign'] = async (
	ctx,
	input,
) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'licenses/assign.json',
		inputs.licensesAssign.parse(input),
		outputs.licensesAssign,
	);
// Team endpoints use the team API token, not an application token. Configure
// a separate plugin instance/account with the team token for these operations.
const teamsGet: PushoverEndpoints['teamsGet'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'GET',
		'teams.json',
		inputs.teamsGet.parse(input),
		outputs.teamsGet,
	);
const teamsAddUser: PushoverEndpoints['teamsAddUser'] = async (ctx, input) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'teams/add_user.json',
		inputs.teamsAddUser.parse(input),
		outputs.teamsAddUser,
	);
const teamsRevokeInvitation: PushoverEndpoints['teamsRevokeInvitation'] =
	async (ctx, input) =>
		makePushoverRequest(
			ctx.key,
			'POST',
			'teams/revoke_invitation.json',
			inputs.teamsRevokeInvitation.parse(input),
			outputs.teamsRevokeInvitation,
		);
const teamsRemoveUser: PushoverEndpoints['teamsRemoveUser'] = async (
	ctx,
	input,
) =>
	makePushoverRequest(
		ctx.key,
		'POST',
		'teams/remove_user.json',
		inputs.teamsRemoveUser.parse(input),
		outputs.teamsRemoveUser,
	);

export const Messages = { send: messagesSend } as const;
export const Users = { validate: usersValidate } as const;
export const Sounds = { list: soundsList } as const;
export const Apps = { limits: appsLimits } as const;
export const Receipts = {
	get: receiptsGet,
	cancel: receiptsCancel,
	cancelByTag: receiptsCancelByTag,
} as const;
export const Groups = {
	create: groupsCreate,
	list: groupsList,
	get: groupsGet,
	addUser: groupsAddUser,
	removeUser: groupsRemoveUser,
	disableUser: groupsDisableUser,
	enableUser: groupsEnableUser,
	rename: groupsRename,
} as const;
export const Glances = { update: glancesUpdate } as const;
export const Subscriptions = { migrate: subscriptionsMigrate } as const;
export const Licenses = { get: licensesGet, assign: licensesAssign } as const;
export const Teams = {
	get: teamsGet,
	addUser: teamsAddUser,
	revokeInvitation: teamsRevokeInvitation,
	removeUser: teamsRemoveUser,
} as const;
