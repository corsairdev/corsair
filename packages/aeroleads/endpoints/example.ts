import { logEventFromContext } from 'corsair/core';
import type { AeroleadsEndpoints } from '..';
import type { AeroleadsEndpointOutputs } from './types';
import { makeAeroleadsRequest } from '../client';

// AeroLeads LinkedIn API — see https://aeroleads.com/api
// GET https://aeroleads.com/api/get_linkedin_details?api_key=KEY&linkedin_url=URL
const AEROLEADS_GET_LINKEDIN_DETAILS = 'get_linkedin_details';

export const getDetailsFromLinkedinUrl: AeroleadsEndpoints['getDetailsFromLinkedinUrl'] = async (ctx, input) => {
  const response = await makeAeroleadsRequest<AeroleadsEndpointOutputs['getDetailsFromLinkedinUrl']>(
    AEROLEADS_GET_LINKEDIN_DETAILS,
    ctx.key,
    {
      method: 'GET',
      query: {
        linkedin_url: input.linkedin_url,
      },
    },
  );

  // Log only the operation name and a non-PII marker. Do NOT include
  // `linkedin_url` or the response payload here — both are PII and would
  // land in the events table.
  await logEventFromContext(
    ctx,
    'aeroleads.prospects.get_details_from_linkedin_url',
    { hadInput: true },
    'completed',
  );

  return response;
};