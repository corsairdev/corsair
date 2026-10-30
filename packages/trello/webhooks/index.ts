import { cardCreated } from './card-created';
import { cardUpdated } from './card-updated';
import { commentCreated } from './comment-created';
import { listCreated } from './list-created';
import { listUpdated } from './list-updated';
import { memberAddedToCard } from './member-added-to-card';

export const CardWebhooks = {
	cardCreated,
	cardUpdated,
};

export const MemberWebhooks = {
	memberAddedToCard,
};

export const ListWebhooks = {
	listCreated,
	listUpdated,
};

export const CommentWebhooks = {
	commentCreated,
};

export * from './types';
