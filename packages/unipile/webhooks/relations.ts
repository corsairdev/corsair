import { defineUnipileWebhook } from './define';
import { FollowerNewEventSchema, RelationNewEventSchema } from './types';

// An invitation was accepted (or another new 1st-degree connection appeared).
// LinkedIn can report it up to 6 hours late.
export const relationNew = defineUnipileWebhook(
	'relationNew',
	'relation.new',
	RelationNewEventSchema,
);

export const followerNew = defineUnipileWebhook(
	'followerNew',
	'follower.new',
	FollowerNewEventSchema,
);
