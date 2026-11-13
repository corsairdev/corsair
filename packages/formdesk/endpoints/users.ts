import {
	defineOperation,
	encodePathSegment,
	jsonBody,
	tenantPlan,
} from './runtime';
import {
	FormdeskEndpointInputSchemas,
	FormdeskEndpointOutputSchemas,
} from './types';

const list = defineOperation(
	'usersList',
	FormdeskEndpointInputSchemas.usersList,
	FormdeskEndpointOutputSchemas.usersList,
	(input) => tenantPlan(input, 'GET', '/users'),
);

const get = defineOperation(
	'usersGet',
	FormdeskEndpointInputSchemas.usersGet,
	FormdeskEndpointOutputSchemas.usersGet,
	(input) =>
		tenantPlan(input, 'GET', `/users/${encodePathSegment(input.userId)}`),
);

const getExternal = defineOperation(
	'usersGetExternal',
	FormdeskEndpointInputSchemas.usersGetExternal,
	FormdeskEndpointOutputSchemas.usersGetExternal,
	(input) =>
		tenantPlan(
			input,
			'GET',
			`/users/external/${encodePathSegment(input.externalUserId)}`,
		),
);

const add = defineOperation(
	'usersAdd',
	FormdeskEndpointInputSchemas.usersAdd,
	FormdeskEndpointOutputSchemas.usersAdd,
	(input) =>
		tenantPlan(input, 'POST', '/users', {
			body: jsonBody(input.user),
			retryable: false,
		}),
);

const update = defineOperation(
	'usersUpdate',
	FormdeskEndpointInputSchemas.usersUpdate,
	FormdeskEndpointOutputSchemas.usersUpdate,
	(input) =>
		tenantPlan(input, 'PUT', `/users/${encodePathSegment(input.userId)}`, {
			body: jsonBody(input.user),
			retryable: false,
		}),
);

const remove = defineOperation(
	'usersRemove',
	FormdeskEndpointInputSchemas.usersRemove,
	FormdeskEndpointOutputSchemas.usersRemove,
	(input) =>
		tenantPlan(input, 'DELETE', `/users/${encodePathSegment(input.userId)}`, {
			retryable: false,
		}),
);

const signOn = defineOperation(
	'usersSignOn',
	FormdeskEndpointInputSchemas.usersSignOn,
	FormdeskEndpointOutputSchemas.usersSignOn,
	(input) =>
		tenantPlan(input, 'POST', '/signon', {
			body: jsonBody(input.credentials),
			retryable: false,
		}),
);

export const Users = { list, get, getExternal, add, update, remove, signOn };
