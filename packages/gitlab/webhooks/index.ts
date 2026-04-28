import { issue } from './issues';
import { mergeRequest } from './merge-request';
import { note } from './note';
import { pipeline } from './pipeline';
import { push } from './push';

export const GitlabWebhooks = {
	push,
	mergeRequest,
	issue,
	pipeline,
	note,
};

export * from './types';
