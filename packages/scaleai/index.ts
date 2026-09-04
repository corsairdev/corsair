import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Audits,
	Batches,
	Files,
	Projects,
	Quality,
	Studio,
	Tasks,
	Teams,
} from './endpoints';
import type {
	ScaleAiEndpointInputs,
	ScaleAiEndpointOutputs,
} from './endpoints/types';
import {
	ScaleAiEndpointInputSchemas,
	ScaleAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ScaleAiSchema } from './schema';

export type ScaleAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Scale AI API key (live or test mode). Overrides the account key store. */
	key?: string;
	hooks?: InternalScaleAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof scaleAiEndpointsNested>;
};

export type ScaleAiContext = CorsairPluginContext<
	typeof ScaleAiSchema,
	ScaleAiPluginOptions
>;

export type ScaleAiKeyBuilderContext = KeyBuilderContext<ScaleAiPluginOptions>;

export type ScaleAiBoundEndpoints = BindEndpoints<
	typeof scaleAiEndpointsNested
>;

type ScaleAiEndpoint<K extends keyof ScaleAiEndpointOutputs> = CorsairEndpoint<
	ScaleAiContext,
	ScaleAiEndpointInputs[K],
	ScaleAiEndpointOutputs[K]
>;

export type ScaleAiEndpoints = {
	[K in keyof ScaleAiEndpointOutputs]: ScaleAiEndpoint<K>;
};

const scaleAiEndpointsNested = {
	tasks: {
		createImageAnnotationTask: Tasks.createImageAnnotationTask,
		createSegmentationAnnotationTask: Tasks.createSegmentationAnnotationTask,
		createVideoAnnotationTask: Tasks.createVideoAnnotationTask,
		createVideoPlaybackAnnotationTask: Tasks.createVideoPlaybackAnnotationTask,
		createLidarAnnotationTask: Tasks.createLidarAnnotationTask,
		createLidarSegmentationTask: Tasks.createLidarSegmentationTask,
		createNamedEntityRecognitionTask: Tasks.createNamedEntityRecognitionTask,
		createTextCollectionTask: Tasks.createTextCollectionTask,
		createDocumentTranscriptionTask: Tasks.createDocumentTranscriptionTask,
		getTask: Tasks.getTask,
		listTasks: Tasks.listTasks,
		addTaskTags: Tasks.addTaskTags,
		deleteTaskTags: Tasks.deleteTaskTags,
		updateTaskUniqueId: Tasks.updateTaskUniqueId,
		deleteTaskUniqueId: Tasks.deleteTaskUniqueId,
		setTaskMetadata: Tasks.setTaskMetadata,
		getTaskResponseUrl: Tasks.getTaskResponseUrl,
		sendTaskCallback: Tasks.sendTaskCallback,
	},
	batches: {
		createBatch: Batches.createBatch,
		finalizeBatch: Batches.finalizeBatch,
		getBatch: Batches.getBatch,
		getBatchStatus: Batches.getBatchStatus,
		listBatches: Batches.listBatches,
	},
	projects: {
		getProject: Projects.getProject,
		listProjects: Projects.listProjects,
		setProjectParams: Projects.setProjectParams,
		setProjectOntology: Projects.setProjectOntology,
	},
	files: {
		getAssets: Files.getAssets,
		importFile: Files.importFile,
		uploadFile: Files.uploadFile,
	},
	teams: {
		getTeams: Teams.getTeams,
		inviteTeamMember: Teams.inviteTeamMember,
	},
	studio: {
		getStudioAssignments: Studio.getStudioAssignments,
		addStudioAssignments: Studio.addStudioAssignments,
		removeStudioAssignments: Studio.removeStudioAssignments,
		getStudioBatches: Studio.getStudioBatches,
		setBatchPriorities: Studio.setBatchPriorities,
		resetBatchPriorities: Studio.resetBatchPriorities,
	},
	audits: {
		getFixlessAudits: Audits.getFixlessAudits,
	},
	quality: {
		getQualityLabelers: Quality.getQualityLabelers,
	},
} as const;

export const scaleAiEndpointSchemas = {
	'tasks.createImageAnnotationTask': {
		input: ScaleAiEndpointInputSchemas.createImageAnnotationTask,
		output: ScaleAiEndpointOutputSchemas.createImageAnnotationTask,
	},
	'tasks.createSegmentationAnnotationTask': {
		input: ScaleAiEndpointInputSchemas.createSegmentationAnnotationTask,
		output: ScaleAiEndpointOutputSchemas.createSegmentationAnnotationTask,
	},
	'tasks.createVideoAnnotationTask': {
		input: ScaleAiEndpointInputSchemas.createVideoAnnotationTask,
		output: ScaleAiEndpointOutputSchemas.createVideoAnnotationTask,
	},
	'tasks.createVideoPlaybackAnnotationTask': {
		input: ScaleAiEndpointInputSchemas.createVideoPlaybackAnnotationTask,
		output: ScaleAiEndpointOutputSchemas.createVideoPlaybackAnnotationTask,
	},
	'tasks.createLidarAnnotationTask': {
		input: ScaleAiEndpointInputSchemas.createLidarAnnotationTask,
		output: ScaleAiEndpointOutputSchemas.createLidarAnnotationTask,
	},
	'tasks.createLidarSegmentationTask': {
		input: ScaleAiEndpointInputSchemas.createLidarSegmentationTask,
		output: ScaleAiEndpointOutputSchemas.createLidarSegmentationTask,
	},
	'tasks.createNamedEntityRecognitionTask': {
		input: ScaleAiEndpointInputSchemas.createNamedEntityRecognitionTask,
		output: ScaleAiEndpointOutputSchemas.createNamedEntityRecognitionTask,
	},
	'tasks.createTextCollectionTask': {
		input: ScaleAiEndpointInputSchemas.createTextCollectionTask,
		output: ScaleAiEndpointOutputSchemas.createTextCollectionTask,
	},
	'tasks.createDocumentTranscriptionTask': {
		input: ScaleAiEndpointInputSchemas.createDocumentTranscriptionTask,
		output: ScaleAiEndpointOutputSchemas.createDocumentTranscriptionTask,
	},
	'tasks.getTask': {
		input: ScaleAiEndpointInputSchemas.getTask,
		output: ScaleAiEndpointOutputSchemas.getTask,
	},
	'tasks.listTasks': {
		input: ScaleAiEndpointInputSchemas.listTasks,
		output: ScaleAiEndpointOutputSchemas.listTasks,
	},
	'tasks.addTaskTags': {
		input: ScaleAiEndpointInputSchemas.addTaskTags,
		output: ScaleAiEndpointOutputSchemas.addTaskTags,
	},
	'tasks.deleteTaskTags': {
		input: ScaleAiEndpointInputSchemas.deleteTaskTags,
		output: ScaleAiEndpointOutputSchemas.deleteTaskTags,
	},
	'tasks.updateTaskUniqueId': {
		input: ScaleAiEndpointInputSchemas.updateTaskUniqueId,
		output: ScaleAiEndpointOutputSchemas.updateTaskUniqueId,
	},
	'tasks.deleteTaskUniqueId': {
		input: ScaleAiEndpointInputSchemas.deleteTaskUniqueId,
		output: ScaleAiEndpointOutputSchemas.deleteTaskUniqueId,
	},
	'tasks.setTaskMetadata': {
		input: ScaleAiEndpointInputSchemas.setTaskMetadata,
		output: ScaleAiEndpointOutputSchemas.setTaskMetadata,
	},
	'tasks.getTaskResponseUrl': {
		input: ScaleAiEndpointInputSchemas.getTaskResponseUrl,
		output: ScaleAiEndpointOutputSchemas.getTaskResponseUrl,
	},
	'tasks.sendTaskCallback': {
		input: ScaleAiEndpointInputSchemas.sendTaskCallback,
		output: ScaleAiEndpointOutputSchemas.sendTaskCallback,
	},
	'batches.createBatch': {
		input: ScaleAiEndpointInputSchemas.createBatch,
		output: ScaleAiEndpointOutputSchemas.createBatch,
	},
	'batches.finalizeBatch': {
		input: ScaleAiEndpointInputSchemas.finalizeBatch,
		output: ScaleAiEndpointOutputSchemas.finalizeBatch,
	},
	'batches.getBatch': {
		input: ScaleAiEndpointInputSchemas.getBatch,
		output: ScaleAiEndpointOutputSchemas.getBatch,
	},
	'batches.getBatchStatus': {
		input: ScaleAiEndpointInputSchemas.getBatchStatus,
		output: ScaleAiEndpointOutputSchemas.getBatchStatus,
	},
	'batches.listBatches': {
		input: ScaleAiEndpointInputSchemas.listBatches,
		output: ScaleAiEndpointOutputSchemas.listBatches,
	},
	'projects.getProject': {
		input: ScaleAiEndpointInputSchemas.getProject,
		output: ScaleAiEndpointOutputSchemas.getProject,
	},
	'projects.listProjects': {
		input: ScaleAiEndpointInputSchemas.listProjects,
		output: ScaleAiEndpointOutputSchemas.listProjects,
	},
	'projects.setProjectParams': {
		input: ScaleAiEndpointInputSchemas.setProjectParams,
		output: ScaleAiEndpointOutputSchemas.setProjectParams,
	},
	'projects.setProjectOntology': {
		input: ScaleAiEndpointInputSchemas.setProjectOntology,
		output: ScaleAiEndpointOutputSchemas.setProjectOntology,
	},
	'files.getAssets': {
		input: ScaleAiEndpointInputSchemas.getAssets,
		output: ScaleAiEndpointOutputSchemas.getAssets,
	},
	'files.importFile': {
		input: ScaleAiEndpointInputSchemas.importFile,
		output: ScaleAiEndpointOutputSchemas.importFile,
	},
	'files.uploadFile': {
		input: ScaleAiEndpointInputSchemas.uploadFile,
		output: ScaleAiEndpointOutputSchemas.uploadFile,
	},
	'teams.getTeams': {
		input: ScaleAiEndpointInputSchemas.getTeams,
		output: ScaleAiEndpointOutputSchemas.getTeams,
	},
	'teams.inviteTeamMember': {
		input: ScaleAiEndpointInputSchemas.inviteTeamMember,
		output: ScaleAiEndpointOutputSchemas.inviteTeamMember,
	},
	'studio.getStudioAssignments': {
		input: ScaleAiEndpointInputSchemas.getStudioAssignments,
		output: ScaleAiEndpointOutputSchemas.getStudioAssignments,
	},
	'studio.addStudioAssignments': {
		input: ScaleAiEndpointInputSchemas.addStudioAssignments,
		output: ScaleAiEndpointOutputSchemas.addStudioAssignments,
	},
	'studio.removeStudioAssignments': {
		input: ScaleAiEndpointInputSchemas.removeStudioAssignments,
		output: ScaleAiEndpointOutputSchemas.removeStudioAssignments,
	},
	'studio.getStudioBatches': {
		input: ScaleAiEndpointInputSchemas.getStudioBatches,
		output: ScaleAiEndpointOutputSchemas.getStudioBatches,
	},
	'studio.setBatchPriorities': {
		input: ScaleAiEndpointInputSchemas.setBatchPriorities,
		output: ScaleAiEndpointOutputSchemas.setBatchPriorities,
	},
	'studio.resetBatchPriorities': {
		input: ScaleAiEndpointInputSchemas.resetBatchPriorities,
		output: ScaleAiEndpointOutputSchemas.resetBatchPriorities,
	},
	'audits.getFixlessAudits': {
		input: ScaleAiEndpointInputSchemas.getFixlessAudits,
		output: ScaleAiEndpointOutputSchemas.getFixlessAudits,
	},
	'quality.getQualityLabelers': {
		input: ScaleAiEndpointInputSchemas.getQualityLabelers,
		output: ScaleAiEndpointOutputSchemas.getQualityLabelers,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof scaleAiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const scaleAiEndpointMeta = {
	'tasks.createImageAnnotationTask': {
		riskLevel: 'write',
		description:
			'Create an image annotation task (boxes, polygons, points, etc.)',
	},
	'tasks.createSegmentationAnnotationTask': {
		riskLevel: 'write',
		description: 'Create a semantic segmentation task classifying image pixels',
	},
	'tasks.createVideoAnnotationTask': {
		riskLevel: 'write',
		description: 'Create a video annotation task across frames or video files',
	},
	'tasks.createVideoPlaybackAnnotationTask': {
		riskLevel: 'write',
		description: 'Create a video playback annotation task for object tracking',
	},
	'tasks.createLidarAnnotationTask': {
		riskLevel: 'write',
		description: 'Create a LiDAR 3D cuboid annotation task',
	},
	'tasks.createLidarSegmentationTask': {
		riskLevel: 'write',
		description: 'Create a LiDAR point cloud semantic segmentation task',
	},
	'tasks.createNamedEntityRecognitionTask': {
		riskLevel: 'write',
		description: 'Create a named entity recognition task over text',
	},
	'tasks.createTextCollectionTask': {
		riskLevel: 'write',
		description:
			'Create a text collection task gathering structured field data',
	},
	'tasks.createDocumentTranscriptionTask': {
		riskLevel: 'write',
		description: 'Create a document transcription / annotation task',
	},
	'tasks.getTask': {
		riskLevel: 'read',
		description:
			'Retrieve a task by id including status, response and metadata',
	},
	'tasks.listTasks': {
		riskLevel: 'read',
		description: 'List tasks with filtering and cursor pagination',
	},
	'tasks.addTaskTags': {
		riskLevel: 'write',
		description: 'Add tags to a task (duplicates ignored)',
	},
	'tasks.deleteTaskTags': {
		riskLevel: 'write',
		description: 'Remove tags from a task',
	},
	'tasks.updateTaskUniqueId': {
		riskLevel: 'write',
		description: "Set or update a task's unique_id",
	},
	'tasks.deleteTaskUniqueId': {
		riskLevel: 'write',
		description: "Remove a task's unique_id",
	},
	'tasks.setTaskMetadata': {
		riskLevel: 'write',
		description: 'Set the metadata object on a task (idempotent)',
	},
	'tasks.getTaskResponseUrl': {
		riskLevel: 'read',
		description: 'Fetch secure authenticated task response data for a task',
	},
	'tasks.sendTaskCallback': {
		riskLevel: 'write',
		description: 'Re-send the callback for a completed or errored task',
	},
	'batches.createBatch': {
		riskLevel: 'write',
		description: 'Create a new batch within a project',
	},
	'batches.finalizeBatch': {
		riskLevel: 'write',
		description: 'Finalize a batch so its tasks can be worked on',
	},
	'batches.getBatch': {
		riskLevel: 'read',
		description: 'Retrieve a batch by name',
	},
	'batches.getBatchStatus': {
		riskLevel: 'read',
		description: 'Retrieve a batch status with task completion counts',
	},
	'batches.listBatches': {
		riskLevel: 'read',
		description: 'List batches newest-first with pagination',
	},
	'projects.getProject': {
		riskLevel: 'read',
		description: 'Retrieve a project by name',
	},
	'projects.listProjects': {
		riskLevel: 'read',
		description: 'List all projects, optionally filtered by archived state',
	},
	'projects.setProjectParams': {
		riskLevel: 'write',
		description: 'Set default task parameters for a project',
	},
	'projects.setProjectOntology': {
		riskLevel: 'write',
		description: 'Set the ontology (label classes) for a project',
	},
	'files.getAssets': {
		riskLevel: 'read',
		description:
			'List file assets filtered by project and metadata (paginated)',
	},
	'files.importFile': {
		riskLevel: 'write',
		description: 'Import a file into Scale from a remote URL',
	},
	'files.uploadFile': {
		riskLevel: 'write',
		description: 'Upload a local file (base64) to Scale, max 80 MB',
	},
	'teams.getTeams': {
		riskLevel: 'read',
		description:
			'List all team members with roles and notification preferences',
	},
	'teams.inviteTeamMember': {
		riskLevel: 'write',
		description: 'Invite users by email to the team with a role',
	},
	'studio.getStudioAssignments': {
		riskLevel: 'read',
		description: 'Retrieve current Studio project assignments per active user',
	},
	'studio.addStudioAssignments': {
		riskLevel: 'write',
		description: 'Assign projects to Studio team members by email',
	},
	'studio.removeStudioAssignments': {
		riskLevel: 'write',
		description: 'Unassign projects from Studio team members by email',
	},
	'studio.getStudioBatches': {
		riskLevel: 'read',
		description: 'List pending Studio batches ordered by priority',
	},
	'studio.setBatchPriorities': {
		riskLevel: 'write',
		description: 'Set the priority order of pending Studio batches',
	},
	'studio.resetBatchPriorities': {
		riskLevel: 'write',
		description: 'Reset Studio batch priority order to the default',
	},
	'audits.getFixlessAudits': {
		riskLevel: 'read',
		description: 'Retrieve fixless audits by task id or audit id',
	},
	'quality.getQualityLabelers': {
		riskLevel: 'read',
		description:
			'Retrieve labeler training attempts by quality task id or email',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof scaleAiEndpointsNested>;

export type BaseScaleAiPlugin<T extends ScaleAiPluginOptions> = CorsairPlugin<
	'scaleai',
	typeof ScaleAiSchema,
	typeof scaleAiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalScaleAiPlugin = BaseScaleAiPlugin<ScaleAiPluginOptions>;

export type ExternalScaleAiPlugin<T extends ScaleAiPluginOptions> =
	BaseScaleAiPlugin<T>;

export function scaleai<const T extends ScaleAiPluginOptions>(
	incomingOptions: ScaleAiPluginOptions & T = {} as ScaleAiPluginOptions & T,
): ExternalScaleAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'scaleai',
		schema: ScaleAiSchema,
		options,
		hooks: options.hooks,
		endpoints: scaleAiEndpointsNested,
		webhooks: {},
		endpointMeta: scaleAiEndpointMeta,
		endpointSchemas: scaleAiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ScaleAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('scaleai', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('scaleai', 'api_key');
		},
	} satisfies InternalScaleAiPlugin;
}

export type {
	ScaleAiEndpointInputs,
	ScaleAiEndpointOutputs,
	ScaleBatch,
	ScaleFile,
	ScaleProject,
	ScaleTask,
} from './endpoints/types';
