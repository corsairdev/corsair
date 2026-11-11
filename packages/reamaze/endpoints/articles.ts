import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['articlesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'articles.list',
			input: Inputs.articlesList,
			output: Outputs.articlesList,
		},
		input,
		({ status, q, page }) => ({
			method: 'GET',
			path: '/articles',
			query: queryOf({ status, q, page }),
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'article list'),
				articles: unwrapList(raw, 'articles', 'article list'),
			}),
			log: (_, result) => ({ count: result.articles.length }),
		},
	);

export const get: ReamazeEndpoints['articlesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'articles.get',
			input: Inputs.articlesGet,
			output: Outputs.articlesGet,
		},
		input,
		({ slug }) => ({
			method: 'GET',
			path: `/articles/${pathSegment(slug)}`,
		}),
		{
			shape: (raw) => unwrapObject(raw, 'article'),
			log: (parsed) => ({ slug: parsed.slug }),
		},
	);

export const create: ReamazeEndpoints['articlesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'articles.create',
			input: Inputs.articlesCreate,
			output: Outputs.articlesCreate,
		},
		input,
		({ topic, title, body, status, topic_id }) => ({
			// The topic is a path segment; posting to it files the article under it.
			method: 'POST',
			path: `/topics/${pathSegment(topic)}/articles`,
			body: { article: { title, body, status, topic_id } },
		}),
		{
			shape: (raw) => unwrapObject(raw, 'created article'),
			log: (parsed, result) => ({
				topic: parsed.topic,
				slug: typeof result.slug === 'string' ? result.slug : undefined,
			}),
		},
	);

export const update: ReamazeEndpoints['articlesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'articles.update',
			input: Inputs.articlesUpdate,
			output: Outputs.articlesUpdate,
		},
		input,
		({ slug, title, body, status, topic_id }) => ({
			method: 'PUT',
			path: `/articles/${pathSegment(slug)}`,
			body: { article: { title, body, status, topic_id } },
		}),
		{
			shape: (raw) => unwrapObject(raw, 'updated article'),
			log: (parsed) => ({ slug: parsed.slug }),
		},
	);
