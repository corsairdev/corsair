import { Clusters } from './clusters';
import { Spaces } from './spaces';

export const Endpoints = {
	clusters: Clusters,
	spaces: Spaces,
} as const;

export * from './types';
export { Clusters, Spaces };
