import type { PingdomEndpoints } from '..';
import { call } from './call';
import {
	PingdomEndpointInputSchemas as Inputs,
	PingdomEndpointOutputSchemas as Outputs,
} from './types';

const V31 = '/api/3.1';
const TEAMS = `${V31}/alerting/teams`;
const CONTACTS = `${V31}/alerting/contacts`;

export const listTeams: PingdomEndpoints['teamsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.list',
			input: Inputs.teamsList,
			output: Outputs.teamsList,
		},
		input,
		() => ({ method: 'GET', path: TEAMS }),
		{ log: (_, page) => ({ count: page.teams.length }) },
	);

export const createTeam: PingdomEndpoints['teamsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.create',
			input: Inputs.teamsCreate,
			output: Outputs.teamsCreate,
		},
		input,
		({ name, memberIds }) => ({
			method: 'POST',
			path: TEAMS,
			body: { name, member_ids: memberIds },
		}),
		{ log: (_, created) => ({ teamId: created.team.id ?? undefined }) },
	);

export const getTeam: PingdomEndpoints['teamsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.get',
			input: Inputs.teamsGet,
			output: Outputs.teamsGet,
		},
		input,
		({ teamId }) => ({
			method: 'GET',
			path: `${TEAMS}/${teamId}`,
		}),
		{ log: ({ teamId }) => ({ teamId }) },
	);

export const updateTeam: PingdomEndpoints['teamsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.update',
			input: Inputs.teamsUpdate,
			output: Outputs.teamsUpdate,
		},
		input,
		({ teamId, name, memberIds }) => ({
			method: 'PUT',
			path: `${TEAMS}/${teamId}`,
			body: { name, member_ids: memberIds },
		}),
		{ log: ({ teamId }) => ({ teamId }) },
	);

export const deleteTeam: PingdomEndpoints['teamsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'teams.delete',
			input: Inputs.teamsDelete,
			output: Outputs.teamsDelete,
		},
		input,
		({ teamId }) => ({
			method: 'DELETE',
			path: `${TEAMS}/${teamId}`,
		}),
		{ log: ({ teamId }) => ({ teamId }) },
	);

export const listContacts: PingdomEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		() => ({ method: 'GET', path: CONTACTS }),
		{ log: (_, page) => ({ count: page.contacts.length }) },
	);

export const createContact: PingdomEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		({ name, paused, notificationTargets }) => ({
			method: 'POST',
			path: CONTACTS,
			body: {
				name,
				paused,
				notification_targets: notificationTargets.map((t) => ({
					severity: t.severity,
					country_code: t.countryCode,
					number: t.number,
					email: t.email,
				})),
			},
		}),
		{ log: (_, created) => ({ contactId: created.contact.id ?? undefined }) },
	);

export const getContact: PingdomEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		({ contactId }) => ({
			method: 'GET',
			path: `${CONTACTS}/${contactId}`,
		}),
		{ log: ({ contactId }) => ({ contactId }) },
	);

export const updateContact: PingdomEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		({ contactId, name, paused, notificationTargets }) => ({
			method: 'PUT',
			path: `${CONTACTS}/${contactId}`,
			body: {
				name,
				paused,
				notification_targets: notificationTargets.map((t) => ({
					severity: t.severity,
					country_code: t.countryCode,
					number: t.number,
					email: t.email,
				})),
			},
		}),
		{ log: ({ contactId }) => ({ contactId }) },
	);

export const deleteContact: PingdomEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		({ contactId }) => ({
			method: 'DELETE',
			path: `${CONTACTS}/${contactId}`,
		}),
		{ log: ({ contactId }) => ({ contactId }) },
	);
