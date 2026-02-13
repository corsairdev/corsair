import { logEventFromContext } from '../../utils/events';
import type { LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type { StatesListResponse, StateGetResponse } from './types';

const STATES_LIST_QUERY = `
  query TeamStates($teamId: String!) {
    team(id: $teamId) {
      states {
        nodes {
          id
          name
          type
          color
          position
          description
        }
      }
    }
  }
`;

const STATE_GET_QUERY = `
  query State($id: String!) {
    workflowState(id: $id) {
      id
      name
      type
      color
      position
      description
      team {
        id
        name
        key
      }
    }
  }
`;

export const list: LinearEndpoints['statesList'] = async (ctx, input) => {
	const response = await makeLinearRequest<StatesListResponse>(
		STATES_LIST_QUERY,
		ctx.key,
		{ teamId: input.teamId },
	);

	const result = response.team.states;

	await logEventFromContext(
		ctx,
		'linear.states.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: LinearEndpoints['statesGet'] = async (ctx, input) => {
	const response = await makeLinearRequest<StateGetResponse>(
		STATE_GET_QUERY,
		ctx.key,
		{ id: input.id },
	);

	const result = response.workflowState;

	await logEventFromContext(ctx, 'linear.states.get', { ...input }, 'completed');
	return result;
};

export const getCanceledStateId: LinearEndpoints['statesGetCanceled'] = async (
	ctx,
	input,
) => {
	const response = await makeLinearRequest<StatesListResponse>(
		STATES_LIST_QUERY,
		ctx.key,
		{ teamId: input.teamId },
	);

	const canceledState = response.team.states.nodes.find(
		(state) => state.type === 'canceled',
	);

	await logEventFromContext(
		ctx,
		'linear.states.getCanceled',
		{ ...input },
		'completed',
	);

	return canceledState?.id || null;
};
