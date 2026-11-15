import {
	formSubmitted,
	messageBounced,
	messageClicked,
	messageEnqueued,
	messageOpened,
	messageReported,
	relationshipCreated,
	relationshipUpdated,
} from './records';
import {
	companyCreated,
	companyUpdated,
	userCreated,
	userSubscribed,
	userUnsubscribed,
	userUpdated,
} from './users';

export const UserlistWebhooks = {
	userCreated,
	userUpdated,
	userSubscribed,
	userUnsubscribed,
	companyCreated,
	companyUpdated,
	relationshipCreated,
	relationshipUpdated,
	formSubmitted,
	messageEnqueued,
	messageOpened,
	messageClicked,
	messageBounced,
	messageReported,
} as const;

export * from './types';
