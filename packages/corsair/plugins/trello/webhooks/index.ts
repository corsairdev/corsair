import { cardCreated } from './cardCreated';
import { cardUpdated } from './cardUpdated';
import { cardMoved } from './cardMoved';
import { memberAddedToCard } from './memberAddedToCard';
import { listCreated } from './listCreated';
import { listUpdated } from './listUpdated';
import { commentCreated } from './commentCreated';

export const CardWebhooks = {
	cardCreated,
	cardUpdated,
	cardMoved,
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
