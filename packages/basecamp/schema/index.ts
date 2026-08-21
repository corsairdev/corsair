import {
	BasecampCampfire,
	BasecampChatbot,
	BasecampMessageType,
	BasecampPerson,
	BasecampProject,
	BasecampTemplate,
} from './database';

export const BasecampSchema = {
	version: '1.0.0',
	entities: {
		projects: BasecampProject,
		templates: BasecampTemplate,
		people: BasecampPerson,
		messageTypes: BasecampMessageType,
		campfires: BasecampCampfire,
		chatbots: BasecampChatbot,
	},
} as const;
