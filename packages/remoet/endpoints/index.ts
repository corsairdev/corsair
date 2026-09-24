import { get as companiesGet, search as companiesSearch } from './companies';
import { list as educationList } from './education';
import { get as jobContextGet } from './job-context';
import { search as jobsSearch } from './jobs';
import { get as linkTreesGet, list as linkTreesList } from './link-trees';
import {
	get as profileGet,
	getLinks as profileGetLinks,
	update as profileUpdate,
} from './profile';
import { list as projectsList } from './projects';
import {
	create as savedJobsCreate,
	remove as savedJobsDelete,
	list as savedJobsList,
	update as savedJobsUpdate,
} from './saved-jobs';
import { list as starredJobsList } from './starred-jobs';
import { create as starsCreate, remove as starsDelete } from './stars';
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

export * from './types';
