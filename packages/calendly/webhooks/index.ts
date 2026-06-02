import { eventTypeUpdated } from './event-type-updated';
import { inviteeCanceled } from './invitee-canceled';
import { inviteeCreated } from './invitee-created';
import { inviteeNoShow } from './invitee-no-show';
import { routingFormSubmission } from './routing-form-submission';
import { userUpdated } from './user-updated';

export const InviteeWebhooks = {
	created: inviteeCreated,
	canceled: inviteeCanceled,
	noShow: inviteeNoShow,
};

export const RoutingFormWebhooks = {
	submission: routingFormSubmission,
};

export const EventTypeWebhooks = {
	updated: eventTypeUpdated,
};

export const UserWebhooks = {
	updated: userUpdated,
};

export * from './types';
