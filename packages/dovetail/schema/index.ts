import {
	DovetailChannel,
	DovetailContact,
	DovetailData,
	DovetailDataPoint,
	DovetailDoc,
	DovetailFile,
	DovetailFolder,
	DovetailHighlight,
	DovetailInsight,
	DovetailNote,
	DovetailProject,
	DovetailTag,
	DovetailTopic,
} from './database';

export * from './database';

export const DovetailSchema = {
	version: '1.0.0',
	entities: {
		projects: DovetailProject,
		data: DovetailData,
		docs: DovetailDoc,
		insights: DovetailInsight,
		notes: DovetailNote,
		channels: DovetailChannel,
		topics: DovetailTopic,
		dataPoints: DovetailDataPoint,
		contacts: DovetailContact,
		folders: DovetailFolder,
		files: DovetailFile,
		highlights: DovetailHighlight,
		tags: DovetailTag,
	},
} as const;
