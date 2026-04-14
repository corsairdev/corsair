import { cardCreated } from './cardCreated';
import { cardUpdated } from './cardUpdated';
import { commentCreated } from './commentCreated';
import { listCreated } from './listCreated';
import { listUpdated } from './listUpdated';
import { memberAddedToCard } from './memberAddedToCard';

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
