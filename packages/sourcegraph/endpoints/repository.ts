import { logEventFromContext } from 'corsair/core';
import type { SourcegraphEndpoints } from '..';
import { sourcegraphGraphql } from '../client';
import type {
	CompareCommitsResponse,
	GetCommitDetailsResponse,
	GetFileContentsResponse,
	ListRepositoriesResponse,
	ListRepositoryFilesResponse,
	ListRepositoryLanguagesResponse,
} from './types';
import { SourcegraphEndpointOutputSchemas } from './types';

const COMPARE_COMMITS = `
query CompareCommits($repo: String!, $base: String!, $head: String!, $first: Int) {
  repository(name: $repo) {
    comparison(base: $base, head: $head) {
      range { expr }
      fileDiffs(first: $first) {
        nodes {
          oldPath
          newPath
          stat { added deleted }
        }
        totalCount
        pageInfo { hasNextPage endCursor }
      }
    }
  }
}
`;

const GET_COMMIT_DETAILS = `
query GetCommitDetails($repo: String!, $rev: String!) {
  repository(name: $repo) {
    commit(rev: $rev) {
      oid
      abbreviatedOID
      message
      subject
      body
      url
      canonicalURL
      author { date person { name email displayName } }
      committer { date person { name email displayName } }
    }
  }
}
`;

const GET_FILE_CONTENTS = `
query GetFileContents($repo: String!, $path: String!) {
  repository(name: $repo) {
    name
    defaultBranch { displayName }
    commit(rev: "HEAD") {
      oid
      file(path: $path) {
        name
        path
        content
        binary
        byteSize
      }
    }
  }
}
`;

const LIST_REPOSITORIES = `
query ListRepositories($first: Int!, $after: String) {
  repositories(first: $first, after: $after) {
    nodes { name url description language }
    totalCount
    pageInfo { hasNextPage endCursor }
  }
}
`;

const LIST_REPOSITORY_FILES = `
query ListRepositoryFiles($repo: String!, $rev: String!, $path: String, $recursive: Boolean) {
  repository(name: $repo) {
    commit(rev: $rev) {
      tree(path: $path) {
        path
        isRoot
        entries(recursive: $recursive) {
          name
          path
          isDirectory
        }
      }
    }
  }
}
`;

const LIST_REPOSITORY_LANGUAGES = `
query ListRepositoryLanguages($repo: String!) {
  repository(name: $repo) {
    name
    language
    commit(rev: "HEAD") {
      languages
      languageStatistics { name totalBytes totalLines }
    }
  }
}
`;

export const compareCommits: SourcegraphEndpoints['compareCommits'] = async (
	ctx,
	input,
) => {
	const data = await sourcegraphGraphql<CompareCommitsResponse>(
		ctx.key,
		COMPARE_COMMITS,
		{
			repo: input.repo,
			base: input.base,
			head: input.head,
			first: input.first ?? 100,
		},
		ctx.options?.instanceUrl,
	);

	const parsed = SourcegraphEndpointOutputSchemas.compareCommits.parse(data);

	await logEventFromContext(
		ctx,
		'sourcegraph.repository.compareCommits',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const getCommitDetails: SourcegraphEndpoints['getCommitDetails'] =
	async (ctx, input) => {
		const data = await sourcegraphGraphql<GetCommitDetailsResponse>(
			ctx.key,
			GET_COMMIT_DETAILS,
			{ repo: input.repo, rev: input.rev },
			ctx.options?.instanceUrl,
		);

		const parsed =
			SourcegraphEndpointOutputSchemas.getCommitDetails.parse(data);

		await logEventFromContext(
			ctx,
			'sourcegraph.repository.getCommitDetails',
			{ ...input },
			'completed',
		);

		return parsed;
	};

export const getFileContents: SourcegraphEndpoints['getFileContents'] = async (
	ctx,
	input,
) => {
	const data = await sourcegraphGraphql<GetFileContentsResponse>(
		ctx.key,
		GET_FILE_CONTENTS,
		{ repo: input.repo_name, path: input.file_path },
		ctx.options?.instanceUrl,
	);

	const parsed = SourcegraphEndpointOutputSchemas.getFileContents.parse(data);

	await logEventFromContext(
		ctx,
		'sourcegraph.repository.getFileContents',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const list: SourcegraphEndpoints['listRepositories'] = async (
	ctx,
	input,
) => {
	const data = await sourcegraphGraphql<ListRepositoriesResponse>(
		ctx.key,
		LIST_REPOSITORIES,
		{ first: input.first, after: input.after },
		ctx.options?.instanceUrl,
	);

	const parsed = SourcegraphEndpointOutputSchemas.listRepositories.parse(data);

	await logEventFromContext(
		ctx,
		'sourcegraph.repository.list',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const listFiles: SourcegraphEndpoints['listRepositoryFiles'] = async (
	ctx,
	input,
) => {
	const data = await sourcegraphGraphql<ListRepositoryFilesResponse>(
		ctx.key,
		LIST_REPOSITORY_FILES,
		{
			repo: input.repo_name,
			rev: input.rev ?? 'HEAD',
			path: input.path ?? '',
			recursive: input.recursive ?? true,
		},
		ctx.options?.instanceUrl,
	);

	const parsed =
		SourcegraphEndpointOutputSchemas.listRepositoryFiles.parse(data);

	await logEventFromContext(
		ctx,
		'sourcegraph.repository.listFiles',
		{ ...input },
		'completed',
	);

	return parsed;
};

export const listLanguages: SourcegraphEndpoints['listRepositoryLanguages'] =
	async (ctx, input) => {
		const data = await sourcegraphGraphql<ListRepositoryLanguagesResponse>(
			ctx.key,
			LIST_REPOSITORY_LANGUAGES,
			{ repo: input.repoName },
			ctx.options?.instanceUrl,
		);

		const parsed =
			SourcegraphEndpointOutputSchemas.listRepositoryLanguages.parse(data);

		await logEventFromContext(
			ctx,
			'sourcegraph.repository.listLanguages',
			{ ...input },
			'completed',
		);

		return parsed;
	};
