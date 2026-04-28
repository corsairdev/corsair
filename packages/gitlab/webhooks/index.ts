import { push } from './push';
import { mergeRequest } from './merge-request';
import { issue } from './issues';
import { pipeline } from './pipeline';
import { note } from './note';

export const GitlabWebhooks = {
	push,
	mergeRequest,
	issue,
	pipeline,
	note,
};

export * from './types';
