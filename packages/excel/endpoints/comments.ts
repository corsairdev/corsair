import type { ExcelEndpoints } from '../index';
import { sessionHeaders, workbookBase } from '../workbook-path';
import { callExcel } from './call';
import {
	CommentsGetInputSchema,
	CommentsListInputSchema,
	CommentsListRepliesInputSchema,
	CommentsReplyInputSchema,
	commentListSchema,
	commentSchema,
} from './types';

function pageQuery(top: number | undefined, skip: number | undefined) {
	return { $top: top, $skip: skip };
}

export const list: ExcelEndpoints['commentsList'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.comments.list',
		CommentsListInputSchema,
		commentListSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${workbookBase(body)}/comments`,
			headers: sessionHeaders(body.sessionId),
			query: pageQuery(body.top, body.skip),
		}),
		(_body, response) => ({ count: response.value.length }),
	);
};

export const get: ExcelEndpoints['commentsGet'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.comments.get',
		CommentsGetInputSchema,
		commentSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${workbookBase(body)}/comments/${encodeURIComponent(body.comment)}`,
			headers: sessionHeaders(body.sessionId),
		}),
		(body) => ({ comment: body.comment }),
	);
};

export const listReplies: ExcelEndpoints['commentsListReplies'] = async (
	ctx,
	input,
) => {
	return callExcel(
		ctx,
		'excel.comments.listReplies',
		CommentsListRepliesInputSchema,
		commentListSchema,
		input,
		(body) => ({
			method: 'GET',
			url: `${workbookBase(body)}/comments/${encodeURIComponent(body.comment)}/replies`,
			headers: sessionHeaders(body.sessionId),
			query: pageQuery(body.top, body.skip),
		}),
		(body, response) => ({
			comment: body.comment,
			count: response.value.length,
		}),
	);
};

export const reply: ExcelEndpoints['commentsReply'] = async (ctx, input) => {
	return callExcel(
		ctx,
		'excel.comments.reply',
		CommentsReplyInputSchema,
		commentSchema,
		input,
		(body) => ({
			method: 'POST',
			url: `${workbookBase(body)}/comments/${encodeURIComponent(body.comment)}/replies`,
			headers: sessionHeaders(body.sessionId),
			body: {
				content: body.content,
				...(body.contentType !== undefined
					? { contentType: body.contentType }
					: {}),
			},
		}),
		(body, response) => ({
			comment: body.comment,
			reply: response.id,
		}),
	);
};
