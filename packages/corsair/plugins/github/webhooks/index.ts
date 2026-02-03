import {
	pullRequestClosed,
	pullRequestOpened,
	pullRequestSynchronize,
} from './pull-requests';
import { push } from './push';
import { starCreated, starDeleted } from './stars';

export const PullRequestWebhooks = {
	opened: pullRequestOpened,
	closed: pullRequestClosed,
	synchronize: pullRequestSynchronize,
};

export const PushWebhooks = {
	push,
};

export const StarWebhooks = {
	created: starCreated,
	deleted: starDeleted,
};

export * from './types';
