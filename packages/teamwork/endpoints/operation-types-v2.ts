import type { TeamworkJsonValue } from './operation-types';

export type TeamworkV2Inputs = {
	'projects.listTaskPredecessors': {
		path: { id: number };
		query?: {
			includeDependencies?: boolean;
			onlyDependencies?: boolean;
			onlyBasicFields?: boolean;
			onlyActionable?: boolean;
			dataSet?: string;
			page?: string;
			pageSize?: string;
		};
		body?: never;
	};
};

export type TeamworkV2Outputs = {
	'projects.listTaskPredecessors': {
		STATUS?: string;
	} & Record<string, TeamworkJsonValue>;
};
