import { commentsOperations } from '../operations/comments';
import type { WebflowEndpoint } from './factory';
import {
	logWebflowOperation,
	requestWebflowOperation,
	syncWebflowOperationResult,
} from './factory';

function getOperation(name: (typeof commentsOperations)[number]['name']) {
	const operation = commentsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[webflow] missing operation: ${name}`);
	}
	return operation;
}

const listCommentThreadsDefinition = getOperation('listCommentThreads');
export const listCommentThreads: WebflowEndpoint = async (ctx, input = {}) => {
	const result = await requestWebflowOperation(
		ctx,
		input,
		listCommentThreadsDefinition,
	);
	await syncWebflowOperationResult(
		ctx,
		listCommentThreadsDefinition,
		input,
		result,
	);
	await logWebflowOperation(ctx, input, listCommentThreadsDefinition);
	return result;
};

export const CommentsEndpoints = {
	listCommentThreads,
} as const;
