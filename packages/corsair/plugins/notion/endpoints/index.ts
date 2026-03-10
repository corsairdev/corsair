import { appendBlock, getManyChildBlocks } from './blocks';
import {
	createDatabasePage,
	getDatabasePage,
	getManyDatabasePages,
	updateDatabasePage,
} from './database-pages';
import { getDatabase, getManyDatabases, searchDatabase } from './databases';
import { archivePage, createPage, searchPage } from './pages';
import { getManyUsers, getUser } from './users';

export const Blocks = {
	appendBlock,
	getManyChildBlocks,
};

export const Databases = {
	getDatabase,
	getManyDatabases,
	searchDatabase,
};

export const DatabasePages = {
	createDatabasePage,
	getDatabasePage,
	getManyDatabasePages,
	updateDatabasePage,
};

export const Pages = {
	archivePage,
	createPage,
	searchPage,
};

export const Users = {
	getUser,
	getManyUsers,
};

export * from './types';
