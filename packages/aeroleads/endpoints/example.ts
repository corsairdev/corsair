import { logEventFromContext } from 'corsair/core';
import type { AeroleadsEndpoints } from '..';
import type { AeroleadsEndpointOutputs } from './types';
import { makeAeroleadsRequest } from '../client';

export const getDetailsFromLinkedinUrl: AeroleadsEndpoints['getDetailsFromLinkedinUrl'] = async (ctx, input) => {
  const response = await makeAeroleadsRequest<AeroleadsEndpointOutputs['getDetailsFromLinkedinUrl']>(
    '',
    ctx.key,
    {
      method: 'GET',
      query: {
        url: input.linkedin_url,
      },
    },
  );

  await logEventFromContext(
    ctx,
    'aeroleads.prospects.get_details_from_linkedin_url',
    { ...input },
    'completed',
  );

  return response;
};