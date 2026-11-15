import {
	completion as chatCompletion,
	createResponse as chatCreateResponse,
	estimateInputTokens as chatEstimateInputTokens,
} from './chat';
import {
	list as filesList,
	remove as filesRemove,
	retrieve as filesRetrieve,
} from './files';
import { generate as imageGenerate } from './image';
import {
	list as modelsList,
	listAnthropic as modelsListAnthropic,
	retrieve as modelsRetrieve,
	retrieveAnthropic as modelsRetrieveAnthropic,
} from './models';
import {
	coverPreprocess as musicCoverPreprocess,
	generate as musicGenerate,
	generateLyrics as musicGenerateLyrics,
} from './music';
import {
	createAsyncTask as speechCreateAsyncTask,
	queryAsyncTask as speechQueryAsyncTask,
	t2a as speechT2a,
} from './speech';
import {
	cancelOrDeleteV2 as videoCancelOrDeleteV2,
	contextIr as videoContextIr,
	generate as videoGenerate,
	generateV2 as videoGenerateV2,
	listV2 as videoListV2,
	query as videoQuery,
	queryV2 as videoQueryV2,
	regenerate as videoRegenerate,
	templateGenerate as videoTemplateGenerate,
	templateQuery as videoTemplateQuery,
} from './video';
import {
	clone as voiceClone,
	design as voiceDesign,
	list as voiceList,
	remove as voiceRemove,
} from './voice';

export const Chat = {
	completion: chatCompletion,
	createResponse: chatCreateResponse,
	estimateInputTokens: chatEstimateInputTokens,
};

export const Speech = {
	t2a: speechT2a,
	createAsyncTask: speechCreateAsyncTask,
	queryAsyncTask: speechQueryAsyncTask,
};

export const Voice = {
	list: voiceList,
	clone: voiceClone,
	design: voiceDesign,
	delete: voiceRemove,
};

export const Music = {
	generate: musicGenerate,
	coverPreprocess: musicCoverPreprocess,
	generateLyrics: musicGenerateLyrics,
};

export const Image = {
	generate: imageGenerate,
};

export const Video = {
	generate: videoGenerate,
	query: videoQuery,
	generateV2: videoGenerateV2,
	queryV2: videoQueryV2,
	listV2: videoListV2,
	cancelOrDeleteV2: videoCancelOrDeleteV2,
	contextIr: videoContextIr,
	regenerate: videoRegenerate,
	templateGenerate: videoTemplateGenerate,
	templateQuery: videoTemplateQuery,
};

export const Files = {
	list: filesList,
	retrieve: filesRetrieve,
	delete: filesRemove,
};

export const Models = {
	list: modelsList,
	retrieve: modelsRetrieve,
	listAnthropic: modelsListAnthropic,
	retrieveAnthropic: modelsRetrieveAnthropic,
};

export * from './types';
