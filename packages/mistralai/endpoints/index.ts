import * as agents from './agents';
import * as audio from './audio';
import * as audioAgentsOps from './audio-agents';
import * as batch from './batch';
import * as chat from './chat';
import * as classifiers from './classifiers';
import * as embeddings from './embeddings';
import * as files from './files';
import * as fim from './fim';
import * as models from './models';
import * as ocr from './ocr';
import * as responses from './responses';
import * as voices from './voices';

export const Chat = { complete: chat.complete };

export const Fim = { complete: fim.complete };

export const Agents = {
	complete: agents.complete,
	create: agents.create,
	list: agents.list,
	get: agents.get,
	update: agents.update,
	delete: agents.remove,
	setVersion: agents.setVersion,
	listVersions: agents.listVersions,
	getVersion: agents.getVersion,
	listAliases: agents.listAliases,
	upsertAlias: agents.upsertAlias,
	deleteAlias: agents.deleteAlias,
};

export const Embeddings = { create: embeddings.create };

export const Classifiers = {
	moderate: classifiers.moderate,
	moderateChat: classifiers.moderateChat,
	classify: classifiers.classify,
	classifyChat: classifiers.classifyChat,
};

export const Ocr = { process: ocr.processDocument };

export const Audio = {
	speech: audio.speech,
	transcribe: audio.transcribe,
};

export const Voices = {
	list: voices.list,
	get: voices.get,
	create: voices.create,
	update: voices.update,
	delete: voices.remove,
};

export const AudioAgents = {
	list: audioAgentsOps.list,
	get: audioAgentsOps.get,
	create: audioAgentsOps.create,
	update: audioAgentsOps.update,
	delete: audioAgentsOps.remove,
	listVersions: audioAgentsOps.listVersions,
	listSessions: audioAgentsOps.listSessions,
};

export const Models = {
	list: models.list,
	get: models.get,
	delete: models.remove,
	update: models.update,
	archive: models.archive,
	unarchive: models.unarchive,
};

export const Files = {
	list: files.list,
	upload: files.upload,
	get: files.get,
	delete: files.remove,
	getSignedUrl: files.getSignedUrl,
};

export const Batch = {
	list: batch.list,
	create: batch.create,
	get: batch.get,
	delete: batch.remove,
	cancel: batch.cancel,
};

export const Responses = {
	create: responses.create,
	countInputTokens: responses.countInputTokens,
};

export * from './types';
