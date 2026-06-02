import {
	TrelloBoard,
	TrelloCard,
	TrelloLabel,
	TrelloList,
	TrelloMember,
} from './database';

export const TrelloSchema = {
	version: '1.0.0',
	entities: {
		boards: TrelloBoard,
		lists: TrelloList,
		cards: TrelloCard,
		members: TrelloMember,
		labels: TrelloLabel,
	},
} as const;
