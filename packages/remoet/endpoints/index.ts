import { list as educationList } from './education';
import { get as jobContextGet } from './job-context';
import { get as linkTreesGet, list as linkTreesList } from './link-trees';
import {
	get as profileGet,
	getLinks as profileGetLinks,
	update as profileUpdate,
} from './profile';
import { list as projectsList } from './projects';
import { create as starsCreate } from './stars';
import { list as workExperienceList } from './work-experience';

export const Profile = {
	get: profileGet,
	getLinks: profileGetLinks,
	update: profileUpdate,
};

export const WorkExperience = {
	list: workExperienceList,
};

export const Projects = {
	list: projectsList,
};

export const Education = {
	list: educationList,
};

export const LinkTrees = {
	list: linkTreesList,
	get: linkTreesGet,
};

export const JobContext = {
	get: jobContextGet,
};

export const Stars = {
	create: starsCreate,
};

export * from './types';
