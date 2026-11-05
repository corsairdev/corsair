import * as Account from './account';
import * as Analysis from './analysis';
import * as Classifiers from './classifiers';
import * as Dictionaries from './dictionaries';

export const AnalysisEndpoints = {
	analyzeContent: Analysis.analyzeContent,
	classifyText: Analysis.classifyText,
	extractEntities: Analysis.extractEntities,
};

export const AccountEndpoints = {
	get: Account.get,
};

export const DictionaryEndpoints = {
	create: Dictionaries.create,
	list: Dictionaries.list,
	get: Dictionaries.get,
	delete: Dictionaries.remove,
	listEntries: Dictionaries.listEntries,
	addEntries: Dictionaries.addEntries,
	getEntry: Dictionaries.getEntry,
	deleteEntry: Dictionaries.deleteEntry,
};

export const ClassifierEndpoints = {
	put: Classifiers.put,
	delete: Classifiers.remove,
	listCategories: Classifiers.listCategories,
	getCategory: Classifiers.getCategory,
	deleteCategory: Classifiers.deleteCategory,
};

export * from './types';
