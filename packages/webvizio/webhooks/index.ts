import { commentCreated, commentDeleted } from './comments';
import { projectCreated, projectDeleted, projectUpdated } from './projects';
import { taskCreated, taskDeleted, taskUpdated } from './tasks';

export const ProjectWebhooks = {
	projectCreated,
	projectUpdated,
	projectDeleted,
};

export const TaskWebhooks = {
	taskCreated,
	taskUpdated,
	taskDeleted,
};

export const CommentWebhooks = {
	commentCreated,
	commentDeleted,
};

export * from './tenant-matcher';
export * from './types';
