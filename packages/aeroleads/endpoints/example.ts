import { logEventFromContext } from 'corsair/core';
import type { AeroleadsEndpoints } from '..';
import type { AeroleadsEndpointOutputs } from './types';
import { makeAeroleadsRequest } from '../client';

export const getDetailsFromLinkedinUrl: AeroleadsEndpoints['getDetailsFromLinkedinUrl'] = async (ctx, input) => {
  // TODO(provider-doc-needed): The endpoint path and request shape below are
  // placeholders — AeroLeads did not publish a public API spec at scaffold
  // time. Verify the path, query/body parameters, and response schema against
  // the official docs before sending real traffic.
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