import { makeAuthenticatedVercelRequest } from '../client';
import { defineEndpoint } from './common';
import {
	VercelUserInputSchemas as In,
	VercelUserOutputSchemas as Out,
} from './user-types';

export const getUser = defineEndpoint({
	event: 'vercel.user.getUser',
	input: In.getUser,
	output: Out.getUser,
	// The token's own user: not team-scoped, so no teamId is sent.
	run: async (ctx) =>
		makeAuthenticatedVercelRequest('/v2/user', ctx, { teamScope: false }),
});
