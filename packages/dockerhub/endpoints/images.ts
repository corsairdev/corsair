import { logEventFromContext } from 'corsair/core';
import type { DockerHubEndpoints } from '../index';
import { pageQuery, req, summarize } from './helpers';

type TagResult = {
	name?: string;
	images?: Array<{
		architecture?: string;
		os?: string;
		digest?: string;
		size?: number;
		status?: string;
		last_pulled?: string;
		last_pushed?: string;
	}>;
};

type TagsPage = {
	count?: number;
	next?: string | null;
	results?: TagResult[];
};

const MAX_TAG_PAGES = 50;

function tagsPath(namespace: string, name: string) {
	return `/namespaces/${encodeURIComponent(namespace)}/repositories/${encodeURIComponent(name)}/tags`;
}

/**
 * Platform variants derived from official tags list
 * (`GET /v2/namespaces/{namespace}/repositories/{repository}/tags`).
 * Deduped by digest. Single page only — paginate with page/pageSize.
 */
export const list: DockerHubEndpoints['imagesList'] = async (ctx, input) => {
	const page = await req<TagsPage>(ctx, tagsPath(input.namespace, input.name), {
		method: 'GET',
		query: pageQuery(input),
	});
	const byDigest = new Map<string, Record<string, unknown>>();
	for (const tag of page.results ?? []) {
		for (const img of tag.images ?? []) {
			if (!img.digest) continue;
			if (!byDigest.has(img.digest)) {
				byDigest.set(img.digest, {
					digest: img.digest,
					architecture: img.architecture,
					os: img.os,
					size: img.size,
					status: img.status,
					tag: tag.name,
					last_pulled: img.last_pulled,
					last_pushed: img.last_pushed,
				});
			}
		}
	}
	const response = {
		count: byDigest.size,
		namespace: input.namespace,
		repository: input.name,
		results: [...byDigest.values()],
		next: page.next ?? null,
		tagCount: page.count,
	};
	await logEventFromContext(
		ctx,
		'dockerhub.images.list',
		summarize(input),
		'completed',
	);
	return response;
};

/**
 * Find a platform image by digest by scanning official tag pages.
 * Caps at MAX_TAG_PAGES to avoid unbounded API walks.
 */
export const get: DockerHubEndpoints['imagesGet'] = async (ctx, input) => {
	const digest = input.digest.startsWith('sha256:')
		? input.digest
		: `sha256:${input.digest}`;
	const pageSize = input.pageSize ?? 100;
	let pageNum = 1;

	for (let i = 0; i < MAX_TAG_PAGES; i++) {
		const page = await req<TagsPage>(
			ctx,
			tagsPath(input.namespace, input.name),
			{
				method: 'GET',
				query: { page: pageNum, page_size: pageSize },
			},
		);
		for (const tag of page.results ?? []) {
			for (const img of tag.images ?? []) {
				if (img.digest === digest || img.digest === input.digest) {
					const response = {
						digest: img.digest,
						architecture: img.architecture,
						os: img.os,
						size: img.size,
						status: img.status,
						tag: tag.name,
						namespace: input.namespace,
						repository: input.name,
						last_pulled: img.last_pulled,
						last_pushed: img.last_pushed,
						foundOnPage: pageNum,
					};
					await logEventFromContext(
						ctx,
						'dockerhub.images.get',
						summarize(input),
						'completed',
					);
					return response;
				}
			}
		}
		if (!page.next) break;
		pageNum += 1;
	}

	await logEventFromContext(
		ctx,
		'dockerhub.images.get',
		summarize(input),
		'failed',
	);
	throw new Error(
		`Image digest not found after scanning tag pages: ${input.digest}`,
	);
};
