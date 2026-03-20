import { list, get, getAnalytics, getAudioUrl, getVideoUrl, getSummary } from './transcripts';
import { getCurrent, list as listUsers } from './users';
import { getThreads, getThread, createThread, continueThread, deleteThread } from './askfred';
import { upload } from './audio';
import { getOutputs } from './aiapp';

export const Transcripts = { list, get, getAnalytics, getAudioUrl, getVideoUrl, getSummary };
export const Users = { getCurrent, list: listUsers };
export const AskFred = { getThreads, getThread, createThread, continueThread, deleteThread };
export const Audio = { upload };
export const AiApp = { getOutputs };

export * from './types';
