import {
	added as itemAdded,
	completed as itemCompleted,
	deleted as itemDeleted,
	uncompleted as itemUncompleted,
	updated as itemUpdated,
} from './items';
import {
	added as noteAdded,
	deleted as noteDeleted,
	updated as noteUpdated,
} from './notes';
import {
	added as projectAdded,
	archived as projectArchived,
	deleted as projectDeleted,
	unarchived as projectUnarchived,
	updated as projectUpdated,
} from './projects';

export const ItemWebhooks = {
	added: itemAdded,
	updated: itemUpdated,
	deleted: itemDeleted,
	completed: itemCompleted,
	uncompleted: itemUncompleted,
};

export const NoteWebhooks = {
	added: noteAdded,
	updated: noteUpdated,
	deleted: noteDeleted,
};

export const ProjectWebhooks = {
	added: projectAdded,
	updated: projectUpdated,
	deleted: projectDeleted,
	archived: projectArchived,
	unarchived: projectUnarchived,
};

export * from './types';
