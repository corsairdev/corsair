import { get as accountsGet, list as accountsList } from './accounts';
import { get as clientsGet, list as clientsList } from './clients';
import { get as projectsGet, list as projectsList } from './projects';
import { get as reportsGet, list as reportsList } from './reports';
import { get as tagsGet, list as tagsList } from './tags';
import { get as teamsGet, list as teamsList } from './teams';
import { get as timeEntriesGet, list as timeEntriesList } from './time-entries';
import { get as usersGet, list as usersList } from './users';

export const Accounts = { list: accountsList, get: accountsGet };
export const Clients = { list: clientsList, get: clientsGet };
export const Projects = { list: projectsList, get: projectsGet };
export const Users = { list: usersList, get: usersGet };
export const Teams = { list: teamsList, get: teamsGet };
export const Tags = { list: tagsList, get: tagsGet };
export const TimeEntries = { list: timeEntriesList, get: timeEntriesGet };
export const Reports = { list: reportsList, get: reportsGet };

export * from './types';
