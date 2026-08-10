import { set, list } from './auto-schedule';
import { deletePost, history } from './posts';

export const AutoScheduleEndpoints = { set, list };
export const PostsEndpoints = { deletePost, history };
export * from './types';
