import { MondayBoard, MondayItem, MondayUpdate, MondayUser } from './database';

export const MondaySchema = {
	version: '1.0.0',
	entities: {
		boards: MondayBoard,
		items: MondayItem,
		updates: MondayUpdate,
		users: MondayUser,
	},
} as const;
