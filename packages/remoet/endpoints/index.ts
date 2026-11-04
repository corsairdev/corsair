import { get as companiesGet, search as companiesSearch } from './companies';
import {
	create as educationCreate,
	remove as educationDelete,
	list as educationList,
	update as educationUpdate,
} from './education';
import { list as feedList } from './feed';
import { get as jobContextGet } from './job-context';
import { search as jobsSearch } from './jobs';
import { get as linkTreesGet, list as linkTreesList } from './link-trees';
import {
	get as profileGet,
	getLinks as profileGetLinks,
	update as profileUpdate,
} from './profile';
import {
	create as projectsCreate,
	remove as projectsDelete,
	list as projectsList,
	update as projectsUpdate,
} from './projects';
import {
	create as savedJobsCreate,
	remove as savedJobsDelete,
	list as savedJobsList,
	update as savedJobsUpdate,
} from './saved-jobs';
import { list as starredJobsList } from './starred-jobs';
import { create as starsCreate, remove as starsDelete } from './stars';
import {
	create as workExperienceCreate,
	remove as workExperienceDelete,
	list as workExperienceList,
	update as workExperienceUpdate,
} from './work-experience';

export const Profile = {
	get: profileGet,
	getLinks: profileGetLinks,
	update: profileUpdate,
};

export const WorkExperience = {
	list: workExperienceList,
	create: workExperienceCreate,
	update: workExperienceUpdate,
	delete: workExperienceDelete,
};

export const Projects = {
	list: projectsList,
	create: projectsCreate,
	update: projectsUpdate,
	delete: projectsDelete,
};

export const Education = {
	list: educationList,
	create: educationCreate,
	update: educationUpdate,
	delete: educationDelete,
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
	delete: starsDelete,
};

export const Jobs = {
	search: jobsSearch,
};

export const Companies = {
	search: companiesSearch,
	get: companiesGet,
};

export const StarredJobs = {
	list: starredJobsList,
};

export const SavedJobs = {
	list: savedJobsList,
	create: savedJobsCreate,
	update: savedJobsUpdate,
	delete: savedJobsDelete,
};

export const Feed = {
	list: feedList,
};

export * from './types';
