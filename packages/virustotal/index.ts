import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Analyses, Comments, Domains, Files, Urls } from './endpoints';
import type {
	VirustotalEndpointInputs,
	VirustotalEndpointOutputs,
} from './endpoints/types';
import {
	VirustotalEndpointInputSchemas,
	VirustotalEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { VirustotalSchema } from './schema';

export type VirustotalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalVirustotalPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof virustotalEndpointsNested>;
};

export type VirustotalContext = CorsairPluginContext<
	typeof VirustotalSchema,
	VirustotalPluginOptions
>;

export type VirustotalKeyBuilderContext =
	KeyBuilderContext<VirustotalPluginOptions>;

export type VirustotalBoundEndpoints = BindEndpoints<
	typeof virustotalEndpointsNested
>;

type VirustotalEndpoint<K extends keyof VirustotalEndpointOutputs> =
	CorsairEndpoint<
		VirustotalContext,
		VirustotalEndpointInputs[K],
		VirustotalEndpointOutputs[K]
	>;

export type VirustotalEndpoints = {
	filesGet: VirustotalEndpoint<'filesGet'>;
	filesRescan: VirustotalEndpoint<'filesRescan'>;
	filesComments: VirustotalEndpoint<'filesComments'>;
	filesAddComment: VirustotalEndpoint<'filesAddComment'>;
	filesVotes: VirustotalEndpoint<'filesVotes'>;
	filesVote: VirustotalEndpoint<'filesVote'>;
	urlsScan: VirustotalEndpoint<'urlsScan'>;
	urlsGet: VirustotalEndpoint<'urlsGet'>;
	urlsRescan: VirustotalEndpoint<'urlsRescan'>;
	urlsComments: VirustotalEndpoint<'urlsComments'>;
	urlsAddComment: VirustotalEndpoint<'urlsAddComment'>;
	domainsGet: VirustotalEndpoint<'domainsGet'>;
	domainsRescan: VirustotalEndpoint<'domainsRescan'>;
	ipAddressesGet: VirustotalEndpoint<'ipAddressesGet'>;
	ipAddressesRescan: VirustotalEndpoint<'ipAddressesRescan'>;
	analysesGet: VirustotalEndpoint<'analysesGet'>;
	commentsList: VirustotalEndpoint<'commentsList'>;
	commentsGet: VirustotalEndpoint<'commentsGet'>;
	commentsDelete: VirustotalEndpoint<'commentsDelete'>;
};

const virustotalEndpointsNested = {
	files: {
		get: Files.get,
		rescan: Files.rescan,
		comments: Files.comments,
		addComment: Files.addComment,
		votes: Files.votes,
		vote: Files.vote,
	},
	urls: {
		scan: Urls.scan,
		get: Urls.get,
		rescan: Urls.rescan,
		comments: Urls.comments,
		addComment: Urls.addComment,
	},
	domains: {
		get: Domains.get,
		rescan: Domains.rescan,
	},
	ipAddresses: {
		get: Domains.ipGet,
		rescan: Domains.ipRescan,
	},
	analyses: {
		get: Analyses.get,
	},
	comments: {
		list: Comments.list,
		get: Comments.get,
		delete: Comments.remove,
	},
} as const;

export const virustotalEndpointSchemas = {
	'files.get': {
		input: VirustotalEndpointInputSchemas.filesGet,
		output: VirustotalEndpointOutputSchemas.filesGet,
	},
	'files.rescan': {
		input: VirustotalEndpointInputSchemas.filesRescan,
		output: VirustotalEndpointOutputSchemas.filesRescan,
	},
	'files.comments': {
		input: VirustotalEndpointInputSchemas.filesComments,
		output: VirustotalEndpointOutputSchemas.filesComments,
	},
	'files.addComment': {
		input: VirustotalEndpointInputSchemas.filesAddComment,
		output: VirustotalEndpointOutputSchemas.filesAddComment,
	},
	'files.votes': {
		input: VirustotalEndpointInputSchemas.filesVotes,
		output: VirustotalEndpointOutputSchemas.filesVotes,
	},
	'files.vote': {
		input: VirustotalEndpointInputSchemas.filesVote,
		output: VirustotalEndpointOutputSchemas.filesVote,
	},
	'urls.scan': {
		input: VirustotalEndpointInputSchemas.urlsScan,
		output: VirustotalEndpointOutputSchemas.urlsScan,
	},
	'urls.get': {
		input: VirustotalEndpointInputSchemas.urlsGet,
		output: VirustotalEndpointOutputSchemas.urlsGet,
	},
	'urls.rescan': {
		input: VirustotalEndpointInputSchemas.urlsRescan,
		output: VirustotalEndpointOutputSchemas.urlsRescan,
	},
	'urls.comments': {
		input: VirustotalEndpointInputSchemas.urlsComments,
		output: VirustotalEndpointOutputSchemas.urlsComments,
	},
	'urls.addComment': {
		input: VirustotalEndpointInputSchemas.urlsAddComment,
		output: VirustotalEndpointOutputSchemas.urlsAddComment,
	},
	'domains.get': {
		input: VirustotalEndpointInputSchemas.domainsGet,
		output: VirustotalEndpointOutputSchemas.domainsGet,
	},
	'domains.rescan': {
		input: VirustotalEndpointInputSchemas.domainsRescan,
		output: VirustotalEndpointOutputSchemas.domainsRescan,
	},
	'ipAddresses.get': {
		input: VirustotalEndpointInputSchemas.ipAddressesGet,
		output: VirustotalEndpointOutputSchemas.ipAddressesGet,
	},
	'ipAddresses.rescan': {
		input: VirustotalEndpointInputSchemas.ipAddressesRescan,
		output: VirustotalEndpointOutputSchemas.ipAddressesRescan,
	},
	'analyses.get': {
		input: VirustotalEndpointInputSchemas.analysesGet,
		output: VirustotalEndpointOutputSchemas.analysesGet,
	},
	'comments.list': {
		input: VirustotalEndpointInputSchemas.commentsList,
		output: VirustotalEndpointOutputSchemas.commentsList,
	},
	'comments.get': {
		input: VirustotalEndpointInputSchemas.commentsGet,
		output: VirustotalEndpointOutputSchemas.commentsGet,
	},
	'comments.delete': {
		input: VirustotalEndpointInputSchemas.commentsDelete,
		output: VirustotalEndpointOutputSchemas.commentsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof virustotalEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const virustotalEndpointMeta = {
	'files.get': {
		riskLevel: 'read',
		description:
			'Read a file report by SHA-256, SHA-1 or MD5, including every engine verdict and the malicious tally',
	},
	'files.rescan': {
		riskLevel: 'write',
		description:
			'Ask VirusTotal to reanalyse a file already uploaded; answers an analysis id to poll, and counts against the scan quota',
	},
	'files.comments': {
		riskLevel: 'read',
		description:
			'List the comments on a file, newest first, with cursor paging',
	},
	'files.addComment': {
		riskLevel: 'write',
		description:
			'Comment on a file publicly; a word starting with # becomes a tag, and only the author can delete it',
	},
	'files.votes': {
		riskLevel: 'read',
		description: 'List the votes on a file with their verdicts',
	},
	'files.vote': {
		riskLevel: 'write',
		description: 'Vote a file harmless or malicious as your account',
	},
	'urls.scan': {
		riskLevel: 'write',
		description:
			'Submit a URL for analysis; it is added to the public dataset, answers an analysis id to poll, and cannot be withdrawn',
	},
	'urls.get': {
		riskLevel: 'read',
		description:
			'Read a URL report by its base64url identifier, which `urlId()` builds from a raw URL',
	},
	'urls.rescan': {
		riskLevel: 'write',
		description: 'Ask VirusTotal to reanalyse a URL already submitted',
	},
	'urls.comments': {
		riskLevel: 'read',
		description: 'List the comments on a URL, with cursor paging',
	},
	'urls.addComment': {
		riskLevel: 'write',
		description: 'Comment on a URL publicly',
	},
	'domains.get': {
		riskLevel: 'read',
		description:
			'Read a domain report: registrar, dates, categories, DNS records and engine verdicts',
	},
	'domains.rescan': {
		riskLevel: 'write',
		description: 'Ask VirusTotal to reanalyse a domain',
	},
	'ipAddresses.get': {
		riskLevel: 'read',
		description:
			'Read an IP report: ASN and owner, country, network and engine verdicts',
	},
	'ipAddresses.rescan': {
		riskLevel: 'write',
		description: 'Ask VirusTotal to reanalyse an IP address',
	},
	'analyses.get': {
		riskLevel: 'read',
		description:
			'Read an analysis a scan produced; its status moves from queued to completed',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments across the account, optionally filtered',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Read one comment',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete one of your own comments, which cannot be restored',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof virustotalEndpointsNested
>;

export type BaseVirustotalPlugin<T extends VirustotalPluginOptions> =
	CorsairPlugin<
		'virustotal',
		typeof VirustotalSchema,
		typeof virustotalEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalVirustotalPlugin =
	BaseVirustotalPlugin<VirustotalPluginOptions>;

export type ExternalVirustotalPlugin<T extends VirustotalPluginOptions> =
	BaseVirustotalPlugin<T>;

export function virustotal<const T extends VirustotalPluginOptions>(
	incomingOptions: VirustotalPluginOptions & T = {} as VirustotalPluginOptions &
		T,
): ExternalVirustotalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'virustotal',
		schema: VirustotalSchema,
		options: options,
		hooks: options.hooks,
		endpoints: virustotalEndpointsNested,
		webhooks: {},
		endpointMeta: virustotalEndpointMeta,
		endpointSchemas: virustotalEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: VirustotalKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('virustotal', ctx.authType ?? 'api_key');
		},
	} satisfies InternalVirustotalPlugin;
}

export {
	isVirustotalFailure,
	urlId,
	VIRUSTOTAL_API_BASE,
	VIRUSTOTAL_API_KEY_HEADER,
	VirustotalAPIError,
} from './client';

export type {
	AddCommentInput,
	AddUrlCommentInput,
	AnalysisResponse,
	CommentResponse,
	CommentsDeleteInput,
	CommentsDeleteResponse,
	CommentsGetInput,
	CommentsListInput,
	DomainResponse,
	DomainsGetInput,
	DomainsRescanInput,
	FileResponse,
	FilesCommentsInput,
	FilesGetInput,
	FilesRescanInput,
	FilesVotesInput,
	IpAddressesGetInput,
	IpAddressesRescanInput,
	IpResponse,
	UrlResponse,
	UrlsCommentsInput,
	UrlsGetInput,
	UrlsRescanInput,
	UrlsScanInput,
	VirustotalAnalysis,
	VirustotalComment,
	VirustotalComments,
	VirustotalDescriptor,
	VirustotalDomain,
	VirustotalEndpointInputs,
	VirustotalEndpointOutputs,
	VirustotalFile,
	VirustotalIpAddress,
	VirustotalUrl,
	VirustotalVote,
	VirustotalVotes,
	VoteInput,
	VoteResponse,
} from './endpoints/types';
