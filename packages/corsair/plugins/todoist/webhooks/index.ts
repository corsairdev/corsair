import {
	added as itemAdded,
	updated as itemUpdated,
	deleted as itemDeleted,
	completed as itemCompleted,
	uncompleted as itemUncompleted,
} from './items';
import {
	added as noteAdded,
	updated as noteUpdated,
	deleted as noteDeleted,
} from './notes';
import {
	added as projectAdded,
	updated as projectUpdated,
	deleted as projectDeleted,
	archived as projectArchived,
	unarchived as projectUnarchived,
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
