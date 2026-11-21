import type { PilvioEndpoints } from '..';
import { call } from './call';
import {
	PilvioEndpointInputSchemas as Inputs,
	PilvioEndpointOutputSchemas as Outputs,
	withoutSecrets,
} from './types';

const USER_RESOURCE = '/v1/user-resource';

export const getUser: PilvioEndpoints['userGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'user.get',
			input: Inputs.userGet,
			output: Outputs.userGet,
		},
		input,
		() => ({ method: 'GET', path: `${USER_RESOURCE}/user` }),
		{
			shape: withoutSecrets,
			log: (_, user) => ({ userId: user.id ?? undefined }),
		},
	);

export const updateProfile: PilvioEndpoints['userUpdateProfile'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'user.updateProfile',
			input: Inputs.userUpdateProfile,
			output: Outputs.userUpdateProfile,
		},
		input,
		({ firstName, lastName, phoneNumber, personalIdNumber }) => ({
			method: 'PATCH',
			path: `${USER_RESOURCE}/user/profile`,
			body: {
				first_name: firstName,
				last_name: lastName,
				phone_number: phoneNumber,
				personal_id_number: personalIdNumber,
			},
		}),
	);

export const listTokens: PilvioEndpoints['tokensList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tokens.list',
			input: Inputs.tokensList,
			output: Outputs.tokensList,
		},
		input,
		() => ({ method: 'GET', path: `${USER_RESOURCE}/token/list` }),
		{
			shape: withoutSecrets,
			log: (_, tokens) => ({ count: tokens.length }),
		},
	);

export const updateToken: PilvioEndpoints['tokensUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tokens.update',
			input: Inputs.tokensUpdate,
			output: Outputs.tokensUpdate,
		},
		input,
		({ tokenId, description, restricted, billingAccountId }) => ({
			method: 'PATCH',
			path: `${USER_RESOURCE}/token`,
			body: {
				token_id: tokenId,
				description,
				// The docs' table says any supplied restricted value restricts the
				// token (their example sends false), so only true is sent.
				restricted: restricted === true ? true : undefined,
				billing_account_id: billingAccountId,
			},
		}),
		{ shape: withoutSecrets, log: ({ tokenId }) => ({ tokenId }) },
	);

export const deleteToken: PilvioEndpoints['tokensDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tokens.delete',
			input: Inputs.tokensDelete,
			output: Outputs.tokensDelete,
		},
		input,
		({ tokenId }) => ({
			method: 'DELETE',
			path: `${USER_RESOURCE}/token`,
			body: { token_id: tokenId },
		}),
		{ log: ({ tokenId }) => ({ tokenId }) },
	);

export const listSshKeys: PilvioEndpoints['sshKeysList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sshKeys.list',
			input: Inputs.sshKeysList,
			output: Outputs.sshKeysList,
		},
		input,
		() => ({ method: 'GET', path: `${USER_RESOURCE}/ssh_keys` }),
		{ log: (_, keys) => ({ count: keys.length }) },
	);

export const createSshKey: PilvioEndpoints['sshKeysCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sshKeys.create',
			input: Inputs.sshKeysCreate,
			output: Outputs.sshKeysCreate,
		},
		input,
		({ name, publicKey }) => ({
			method: 'POST',
			path: `${USER_RESOURCE}/ssh_keys`,
			json: true,
			body: { name, public_key: publicKey },
		}),
		{ log: (_, key) => ({ keyUuid: key.uuid ?? undefined }) },
	);

export const renameSshKey: PilvioEndpoints['sshKeysRename'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sshKeys.rename',
			input: Inputs.sshKeysRename,
			output: Outputs.sshKeysRename,
		},
		input,
		({ uuid, name }) => ({
			method: 'PATCH',
			path: `${USER_RESOURCE}/ssh_keys/${encodeURIComponent(uuid)}`,
			json: true,
			body: { name },
		}),
		{ log: (_, key) => ({ keyUuid: key.uuid ?? undefined }) },
	);

export const deleteSshKey: PilvioEndpoints['sshKeysDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'sshKeys.delete',
			input: Inputs.sshKeysDelete,
			output: Outputs.sshKeysDelete,
		},
		input,
		({ uuid }) => ({
			method: 'DELETE',
			path: `${USER_RESOURCE}/ssh_keys/${encodeURIComponent(uuid)}`,
		}),
		{ log: ({ uuid }) => ({ keyUuid: uuid }) },
	);
