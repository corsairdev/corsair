import type { DiscordEndpoints } from '../index'
import { makeDiscordRequest } from '../client'
import type { DiscordEndpointOutputs } from './types'
import { logEventFromContext } from '../../utils/events'

export const guildGet: DiscordEndpoints['guildGet'] = async (ctx, input) => {
  const response = await makeDiscordRequest<
    DiscordEndpointOutputs['guildGet']
  >(`example/${input.id}`, ctx.key, {
    method: 'GET',
  });

  await logEventFromContext(
    ctx,
    'discord.example.get',
    { ...input },
    'completed',
  );
  return response;
};
