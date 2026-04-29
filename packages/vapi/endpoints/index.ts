import {
	list as assistantsList,
	create as assistantsCreate,
	get as assistantsGet,
	update as assistantsUpdate,
	deleteAssistant,
} from './assistants';
import {
	list as callsList,
	create as callsCreate,
	get as callsGet,
	update as callsUpdate,
	deleteCall,
} from './calls';
import {
	list as phoneNumbersList,
	create as phoneNumbersCreate,
	get as phoneNumbersGet,
	update as phoneNumbersUpdate,
	deletePhoneNumber,
} from './phone-numbers';
import {
	list as squadsList,
	create as squadsCreate,
	get as squadsGet,
	update as squadsUpdate,
	deleteSquad,
} from './squads';
import {
	list as toolsList,
	create as toolsCreate,
	get as toolsGet,
	update as toolsUpdate,
	deleteTool,
} from './tools';
import {
	list as filesList,
	get as filesGet,
	update as filesUpdate,
	deleteFile,
} from './files';
import {
	list as knowledgeBasesList,
	create as knowledgeBasesCreate,
	get as knowledgeBasesGet,
	update as knowledgeBasesUpdate,
	deleteKnowledgeBase,
} from './knowledge-bases';

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
