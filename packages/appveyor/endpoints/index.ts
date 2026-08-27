import { getLast as getLastBuild } from './builds';
import { list as listProjects } from './projects';

export const Projects = {
	list: listProjects,
};

export const Builds = {
	getLast: getLastBuild,
};

export * from './types';
