import {
	create as commentsCreate,
	get as commentsGet,
	getMany as commentsGetMany,
	update as commentsUpdate,
	deleteComment,
} from './comments';
import {
	deleteLabel,
	create as labelsCreate,
	get as labelsGet,
	getMany as labelsGetMany,
	update as labelsUpdate,
} from './labels';
import {
	deleteProject,
	getCollaborators,
	archive as projectsArchive,
	create as projectsCreate,
	get as projectsGet,
	getMany as projectsGetMany,
	update as projectsUpdate,
	unarchive,
} from './projects';
import {
	deleteReminder,
	create as remindersCreate,
	getMany as remindersGetMany,
	update as remindersUpdate,
} from './reminders';
import {
	deleteSection,
	create as sectionsCreate,
	get as sectionsGet,
	getMany as sectionsGetMany,
	update as sectionsUpdate,
} from './sections';
import {
	close,
	deleteTask,
	move,
	quickAdd,
	reopen,
	create as tasksCreate,
	get as tasksGet,
	getMany as tasksGetMany,
	update as tasksUpdate,
} from './tasks';

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
