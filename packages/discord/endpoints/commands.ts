import { makeDiscordRequest } from '../client';
import type { DiscordContext } from '../index';
import type {
	CommandsCreateGlobalInput,
	CommandsCreateGuildInput,
	CommandsDeleteGlobalInput,
	CommandsDeleteGuildInput,
	CommandsGetGlobalInput,
	CommandsGetGuildInput,
	CommandsListGlobalInput,
	CommandsListGuildInput,
	CommandsUpdateGlobalInput,
	CommandsUpdateGuildInput,
	DiscordEndpointOutputs,
} from './types';

export const commandsCreateGlobal = async (
	ctx: DiscordContext,
	input: CommandsCreateGlobalInput,
) => {
	const { application_id, ...body } = input;
	return makeDiscordRequest<DiscordEndpointOutputs['commandsCreateGlobal']>(
		`applications/${application_id}/commands`,
		ctx.key,
		{ method: 'POST', body },
	);
};

export const commandsGetGlobal = async (
	ctx: DiscordContext,
	input: CommandsGetGlobalInput,
) => {
	return makeDiscordRequest<DiscordEndpointOutputs['commandsGetGlobal']>(
		`applications/${input.application_id}/commands/${input.command_id}`,
		ctx.key,
	);
};

export const commandsListGlobal = async (
	ctx: DiscordContext,
	input: CommandsListGlobalInput,
) => {
	return makeDiscordRequest<DiscordEndpointOutputs['commandsListGlobal']>(
		`applications/${input.application_id}/commands`,
		ctx.key,
		{ query: { with_localizations: input.with_localizations } },
	);
};

export const commandsUpdateGlobal = async (
	ctx: DiscordContext,
	input: CommandsUpdateGlobalInput,
) => {
	const { application_id, command_id, ...body } = input;
	return makeDiscordRequest<DiscordEndpointOutputs['commandsUpdateGlobal']>(
		`applications/${application_id}/commands/${command_id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
};

export const commandsDeleteGlobal = async (
	ctx: DiscordContext,
	input: CommandsDeleteGlobalInput,
) => {
	await makeDiscordRequest<void>(
		`applications/${input.application_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	return { success: true } as const;
};

export const commandsCreateGuild = async (
	ctx: DiscordContext,
	input: CommandsCreateGuildInput,
) => {
	const { application_id, guild_id, ...body } = input;
	return makeDiscordRequest<DiscordEndpointOutputs['commandsCreateGuild']>(
		`applications/${application_id}/guilds/${guild_id}/commands`,
		ctx.key,
		{ method: 'POST', body },
	);
};

export const commandsGetGuild = async (
	ctx: DiscordContext,
	input: CommandsGetGuildInput,
) => {
	return makeDiscordRequest<DiscordEndpointOutputs['commandsGetGuild']>(
		`applications/${input.application_id}/guilds/${input.guild_id}/commands/${input.command_id}`,
		ctx.key,
	);
};

export const commandsListGuild = async (
	ctx: DiscordContext,
	input: CommandsListGuildInput,
) => {
	return makeDiscordRequest<DiscordEndpointOutputs['commandsListGuild']>(
		`applications/${input.application_id}/guilds/${input.guild_id}/commands`,
		ctx.key,
		{ query: { with_localizations: input.with_localizations } },
	);
};

export const commandsUpdateGuild = async (
	ctx: DiscordContext,
	input: CommandsUpdateGuildInput,
) => {
	const { application_id, guild_id, command_id, ...body } = input;
	return makeDiscordRequest<DiscordEndpointOutputs['commandsUpdateGuild']>(
		`applications/${application_id}/guilds/${guild_id}/commands/${command_id}`,
		ctx.key,
		{ method: 'PATCH', body },
	);
};

export const commandsDeleteGuild = async (
	ctx: DiscordContext,
	input: CommandsDeleteGuildInput,
) => {
	await makeDiscordRequest<void>(
		`applications/${input.application_id}/guilds/${input.guild_id}/commands/${input.command_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	return { success: true } as const;
};
