import { getFixlessAudits } from './audits';
import {
	createBatch,
	finalizeBatch,
	getBatch,
	getBatchStatus,
	listBatches,
} from './batches';
import { getAssets, importFile, uploadFile } from './files';
import {
	getProject,
	listProjects,
	setProjectOntology,
	setProjectParams,
} from './projects';
import { getQualityLabelers } from './quality';
import {
	addStudioAssignments,
	getStudioAssignments,
	getStudioBatches,
	removeStudioAssignments,
	resetBatchPriorities,
	setBatchPriorities,
} from './studio';
import {
	addTaskTags,
	createDocumentTranscriptionTask,
	createImageAnnotationTask,
	createLidarAnnotationTask,
	createLidarSegmentationTask,
	createNamedEntityRecognitionTask,
	createSegmentationAnnotationTask,
	createTextCollectionTask,
	createVideoAnnotationTask,
	createVideoPlaybackAnnotationTask,
	deleteTaskTags,
	deleteTaskUniqueId,
	getTask,
	getTaskResponseUrl,
	listTasks,
	sendTaskCallback,
	setTaskMetadata,
	updateTaskUniqueId,
} from './tasks';
import { getTeams, inviteTeamMember } from './teams';

export const Tasks = {
	createImageAnnotationTask,
	createSegmentationAnnotationTask,
	createVideoAnnotationTask,
	createVideoPlaybackAnnotationTask,
	createLidarAnnotationTask,
	createLidarSegmentationTask,
	createNamedEntityRecognitionTask,
	createTextCollectionTask,
	createDocumentTranscriptionTask,
	getTask,
	listTasks,
	addTaskTags,
	deleteTaskTags,
	updateTaskUniqueId,
	deleteTaskUniqueId,
	setTaskMetadata,
	getTaskResponseUrl,
	sendTaskCallback,
};

export const Batches = {
	createBatch,
	finalizeBatch,
	getBatch,
	getBatchStatus,
	listBatches,
};

export const Projects = {
	getProject,
	listProjects,
	setProjectParams,
	setProjectOntology,
};

export const Files = { getAssets, importFile, uploadFile };

export const Teams = { getTeams, inviteTeamMember };

export const Studio = {
	getStudioAssignments,
	addStudioAssignments,
	removeStudioAssignments,
	getStudioBatches,
	setBatchPriorities,
	resetBatchPriorities,
};

export const Audits = { getFixlessAudits };

export const Quality = { getQualityLabelers };

export * from './types';
