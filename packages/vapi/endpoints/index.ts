import {
	create as assistantsCreate,
	get as assistantsGet,
	list as assistantsList,
	update as assistantsUpdate,
	deleteAssistant,
} from './assistants';
import {
	create as callsCreate,
	get as callsGet,
	list as callsList,
	update as callsUpdate,
	deleteCall,
} from './calls';
import {
	deleteFile,
	get as filesGet,
	list as filesList,
	update as filesUpdate,
} from './files';
import {
	deleteKnowledgeBase,
	create as knowledgeBasesCreate,
	get as knowledgeBasesGet,
	list as knowledgeBasesList,
	update as knowledgeBasesUpdate,
} from './knowledge-bases';
import {
	deletePhoneNumber,
	create as phoneNumbersCreate,
	get as phoneNumbersGet,
	list as phoneNumbersList,
	update as phoneNumbersUpdate,
} from './phone-numbers';
import {
	deleteSquad,
	create as squadsCreate,
	get as squadsGet,
	list as squadsList,
	update as squadsUpdate,
} from './squads';
import {
	deleteTool,
	create as toolsCreate,
	get as toolsGet,
	list as toolsList,
	update as toolsUpdate,
} from './tools';

export const Assistants = {
	list: assistantsList,
	create: assistantsCreate,
	get: assistantsGet,
	update: assistantsUpdate,
	delete: deleteAssistant,
};

export const Calls = {
	list: callsList,
	create: callsCreate,
	get: callsGet,
	update: callsUpdate,
	delete: deleteCall,
};

export const PhoneNumbers = {
	list: phoneNumbersList,
	create: phoneNumbersCreate,
	get: phoneNumbersGet,
	update: phoneNumbersUpdate,
	delete: deletePhoneNumber,
};

export const Squads = {
	list: squadsList,
	create: squadsCreate,
	get: squadsGet,
	update: squadsUpdate,
	delete: deleteSquad,
};

export const Tools = {
	list: toolsList,
	create: toolsCreate,
	get: toolsGet,
	update: toolsUpdate,
	delete: deleteTool,
};

export const Files = {
	list: filesList,
	get: filesGet,
	update: filesUpdate,
	delete: deleteFile,
};

export const KnowledgeBases = {
	list: knowledgeBasesList,
	create: knowledgeBasesCreate,
	get: knowledgeBasesGet,
	update: knowledgeBasesUpdate,
	delete: deleteKnowledgeBase,
};

export * from './types';
