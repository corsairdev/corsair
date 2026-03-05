import {
	close,
	create as tasksCreate,
	deleteTask,
	get as tasksGet,
	getMany as tasksGetMany,
	move,
	quickAdd,
	reopen,
	update as tasksUpdate,
} from './tasks';
import {
	archive as projectsArchive,
	create as projectsCreate,
	deleteProject,
	get as projectsGet,
	getCollaborators,
	getMany as projectsGetMany,
	unarchive,
	update as projectsUpdate,
} from './projects';
import {
	create as sectionsCreate,
	deleteSection,
	get as sectionsGet,
	getMany as sectionsGetMany,
	update as sectionsUpdate,
} from './sections';
import {
	create as commentsCreate,
	deleteComment,
	get as commentsGet,
	getMany as commentsGetMany,
	update as commentsUpdate,
} from './comments';
import {
	create as labelsCreate,
	deleteLabel,
	get as labelsGet,
	getMany as labelsGetMany,
	update as labelsUpdate,
} from './labels';
import {
	create as remindersCreate,
	deleteReminder,
	getMany as remindersGetMany,
	update as remindersUpdate,
} from './reminders';

export const Tasks = {
	close,
	create: tasksCreate,
	delete: deleteTask,
	get: tasksGet,
	getMany: tasksGetMany,
	move,
	quickAdd,
	reopen,
	update: tasksUpdate,
};

export const Projects = {
	archive: projectsArchive,
	create: projectsCreate,
	delete: deleteProject,
	get: projectsGet,
	getCollaborators,
	getMany: projectsGetMany,
	unarchive,
	update: projectsUpdate,
};

export const Sections = {
	create: sectionsCreate,
	delete: deleteSection,
	get: sectionsGet,
	getMany: sectionsGetMany,
	update: sectionsUpdate,
};

export const Comments = {
	create: commentsCreate,
	delete: deleteComment,
	get: commentsGet,
	getMany: commentsGetMany,
	update: commentsUpdate,
};

export const Labels = {
	create: labelsCreate,
	delete: deleteLabel,
	get: labelsGet,
	getMany: labelsGetMany,
	update: labelsUpdate,
};

export const Reminders = {
	create: remindersCreate,
	delete: deleteReminder,
	getMany: remindersGetMany,
	update: remindersUpdate,
};

export * from './types';

