// Generated from Supermemory's OpenAPI spec (https://api.supermemory.ai/openapi.json,
// fetched 2026-11-27); supermemory-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput } from 'corsair/http';

export type SupermemoryJsonValue =
	| null
	| boolean
	| number
	| string
	| SupermemoryJsonValue[]
	| { [key: string]: SupermemoryJsonValue | undefined };

export const SUPERMEMORY_OPERATION_IDS = [
	'connectors.create',
	'connectors.delete',
	'connectors.get',
	'connectors.list',
	'connectors.listAll',
	'connectors.sync',
	'connectors.update',
	'documents.add',
	'documents.batchAdd',
	'documents.delete',
	'documents.get',
	'documents.memoryCounts',
	'documents.replaceWithFile',
	'documents.update',
	'documents.updateFile',
	'documents.uploadFile',
	'feedback.send',
	'graph.get',
	'legacy.connections.configure',
	'legacy.connections.create',
	'legacy.connections.delete',
	'legacy.connections.deleteByProvider',
	'legacy.connections.documents',
	'legacy.connections.get',
	'legacy.connections.getByProvider',
	'legacy.connections.list',
	'legacy.connections.resources',
	'legacy.connections.sync',
	'legacy.containerTags.delete',
	'legacy.containerTags.get',
	'legacy.containerTags.list',
	'legacy.containerTags.merge',
	'legacy.containerTags.mergeStatus',
	'legacy.containerTags.update',
	'legacy.conversations.ingest',
	'legacy.documents.add',
	'legacy.documents.batchAdd',
	'legacy.documents.bulkDelete',
	'legacy.documents.chunks',
	'legacy.documents.delete',
	'legacy.documents.fileUrl',
	'legacy.documents.get',
	'legacy.documents.list',
	'legacy.documents.listProcessing',
	'legacy.documents.search',
	'legacy.documents.update',
	'legacy.documents.uploadFile',
	'legacy.memories.create',
	'legacy.memories.forget',
	'legacy.memories.forgetMatching',
	'legacy.memories.list',
	'legacy.memories.search',
	'legacy.memories.update',
	'legacy.profile.buckets',
	'legacy.profile.get',
	'legacy.settings.get',
	'legacy.settings.reset',
	'legacy.settings.suggestBuckets',
	'legacy.settings.update',
	'memories.forget',
	'memories.forgetMatching',
	'memories.get',
	'namespaces.delete',
	'namespaces.get',
	'namespaces.list',
	'namespaces.update',
	'organization.get',
	'organization.update',
	'profiles.buckets.delete',
	'profiles.buckets.get',
	'profiles.buckets.set',
	'profiles.get',
	'resources.list',
	'search.query',
] as const;

export type SupermemoryOperationId = (typeof SUPERMEMORY_OPERATION_IDS)[number];

/** A single filter condition based on metadata, numeric values, array contents, or string matching */
export type SupermemoryFilterConditionInput = {
	filterType?: 'metadata' | 'numeric' | 'array_contains' | 'string_contains';
	key: string;
	negate?: boolean | 'true' | 'false';
	ignoreCase?: boolean | 'true' | 'false';
	numericOperator?: '>' | '<' | '>=' | '<=' | '=';
	value: string;
};

/** A type-safe metadata filter predicate or nested and/or expression. The API validates up to 5 levels of nesting. */
export type SupermemoryFilterExpressionInput =
	| SupermemoryFilterPredicateInput
	| {
			/** Require every nested filter expression to match */
			operator: 'and';
			/** Filter expressions combined with logical AND */
			operands: Array<SupermemoryFilterExpressionInput>;
	  }
	| {
			/** Require at least one nested filter expression to match */
			operator: 'or';
			/** Filter expressions combined with logical OR */
			operands: Array<SupermemoryFilterExpressionInput>;
	  };

export type SupermemoryFilterPredicateInput =
	| {
			/** Metadata key to evaluate, matched literally. A period is part of the key name, not a path into nested metadata. */
			field: string;
			/** Compare the field for equality or inequality */
			operator: 'eq' | 'neq';
			/** String value to compare against */
			value: string;
			/** Whether string comparison preserves letter case */
			caseSensitive?: boolean;
	  }
	| {
			/** Metadata key to evaluate, matched literally. A period is part of the key name, not a path into nested metadata. */
			field: string;
			/** Compare the field for equality or inequality */
			operator: 'eq' | 'neq';
			/** Numeric or boolean value to compare against */
			value: number | boolean;
	  }
	| {
			/** Metadata key to evaluate, matched literally. A period is part of the key name, not a path into nested metadata. */
			field: string;
			/** Numeric comparison to apply */
			operator: 'gt' | 'gte' | 'lt' | 'lte';
			/** Numeric value to compare against */
			value: number;
	  }
	| {
			/** Metadata key to evaluate, matched literally. A period is part of the key name, not a path into nested metadata. */
			field: string;
			/** Require or exclude a substring match */
			operator: 'contains' | 'notContains';
			/** Substring to look for */
			value: string;
			/** Whether substring matching preserves letter case */
			caseSensitive?: boolean;
	  }
	| {
			/** Metadata key to evaluate, matched literally. A period is part of the key name, not a path into nested metadata. */
			field: string;
			/** Require or exclude an exact array member */
			operator: 'arrayContains' | 'arrayNotContains';
			/** Array member to look for */
			value: string;
	  };

/** A single filter condition or a nested AND/OR expression. The API validates up to 5 levels of nesting. */
export type SupermemoryLogicalExpressionInput =
	| SupermemoryFilterConditionInput
	| {
			/** OR: Array of conditions or nested expressions */
			OR: Array<SupermemoryLogicalExpressionInput>;
	  }
	| {
			/** AND: Array of conditions or nested expressions */
			AND: Array<SupermemoryLogicalExpressionInput>;
	  };

/** Root query object that must contain either an AND or OR array of filter expressions */
export type SupermemoryQueryFilterInput =
	| {
			/** Array of OR filter expressions */
			OR: Array<SupermemoryLogicalExpressionInput>;
	  }
	| {
			/** Array of AND filter expressions */
			AND: Array<SupermemoryLogicalExpressionInput>;
	  };

export type SupermemoryOperationInputs = {
	'connectors.create': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		provider:
			| 'notion'
			| 'gmail'
			| 'onedrive'
			| 'github'
			| 'google-drive'
			| 's3'
			| 'web-crawler'
			| 'granola';
		/** Where the user returns after authorizing with the provider */
		redirectUrl?: string;
		/** Maximum documents this connector imports */
		documentLimit?: number;
		config?:
			| {
					/** selected (default) syncs only folders the user picks. full syncs the whole OneDrive. */
					syncScope?: 'selected' | 'full';
			  }
			| {
					/** selected (default) syncs only files the user picks. full syncs the whole Drive. */
					syncScope?: 'selected' | 'full';
			  }
			| {
					bucket: string;
					region: string;
					accessKeyId: string;
					secretAccessKey: string;
					/** For S3-compatible stores such as R2 or MinIO */
					endpoint?: string;
					/** Only sync keys under this prefix */
					prefix?: string;
			  }
			| {
					startUrl: string;
					/** How many links deep to follow. Defaults to 3. */
					crawlDepth?: number;
			  }
			| {
					apiKey: string;
			  };
	};
	'connectors.delete': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		/** Connector identifier returned when the connector was created */
		id: string;
		/** Also delete documents this connector imported. Defaults to true. */
		deleteDocuments?: boolean;
	};
	'connectors.get': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		/** Connector identifier returned when the connector was created */
		id: string;
		/** Comma-separated extras. syncs: the 10 most recent sync runs with their failed items. picker: a one-time hosted picker URL. */
		include?: Array<'syncs' | 'picker'>;
		/** Where the hosted picker sends the user when they finish */
		returnUrl?: string;
	};
	'connectors.list': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		/** Only return connectors for this provider */
		provider?:
			| 'notion'
			| 'google-drive'
			| 'onedrive'
			| 'gmail'
			| 'github'
			| 'web-crawler'
			| 's3'
			| 'granola';
		/** One-based page number */
		page?: number;
		/** Maximum connectors to return per page */
		limit?: number;
	};
	'connectors.listAll': {
		/** Only return connectors for this provider */
		provider?:
			| 'notion'
			| 'google-drive'
			| 'onedrive'
			| 'gmail'
			| 'github'
			| 'web-crawler'
			| 's3'
			| 'granola';
		/** One-based page number */
		page?: number;
		/** Maximum connectors to return per page */
		limit?: number;
	};
	'connectors.sync': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		/** Connector identifier returned when the connector was created */
		id: string;
	};
	'connectors.update': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		/** Connector identifier returned when the connector was created */
		id: string;
		/** What to sync, as ids grouped by kind. GitHub takes repos, Gmail takes labels, Google Drive takes files and folders, OneDrive takes folders. Replaces the current selection. */
		selection?: {
			/** GitHub repository ids */
			repos?: Array<string>;
			/** Gmail label ids */
			labels?: Array<string>;
			/** Google Drive file ids */
			files?: Array<string>;
			/** Google Drive or OneDrive folder ids */
			folders?: Array<string>;
		};
		/** Maximum documents this connector imports */
		documentLimit?: number;
	};
	'documents.add': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** The content to process. This may be plaintext or a URL to supported rich content. */
		content: string;
		/** An optional caller-defined document ID */
		id?: string;
		/** Context used to guide memory extraction within this namespace. Max 1500 characters. */
		supportingContext?: string;
		/** Arbitrary metadata attached to the document and derived data */
		metadata?: Record<string, string | number | boolean | Array<string>>;
		/** Metadata values that isolate related context within the namespace */
		group?: Record<string, string | number | boolean | Array<string>>;
		/** When the source content is from, in ISO 8601 format */
		date?: string;
		/** Processing pipeline. "memory" builds durable learned context; "superrag" optimizes the document for retrieval without generating memories. */
		taskType?: 'memory' | 'superrag';
		/** Processing mode. "dynamic" (default) groups related documents so memories form from coherent context. "instant" processes each document independently right away and bills one extra operation per document. */
		dreaming?: 'dynamic' | 'instant';
	};
	'documents.batchAdd': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** Documents to ingest or append in one request */
		documents: Array<{
			/** The content to process. This may be plaintext or a URL to supported rich content. */
			content: string;
			/** An optional caller-defined document ID */
			id?: string;
			/** Context used to guide memory extraction within this namespace. Max 1500 characters. */
			supportingContext?: string;
			/** Arbitrary metadata attached to the document and derived data */
			metadata?: Record<string, string | number | boolean | Array<string>>;
			/** Metadata values that isolate related context within the namespace */
			group?: Record<string, string | number | boolean | Array<string>>;
			/** When the source content is from, in ISO 8601 format */
			date?: string;
		}>;
		/** Processing pipeline. "memory" builds durable learned context; "superrag" optimizes the document for retrieval without generating memories. */
		taskType?: 'memory' | 'superrag';
		/** Processing mode. "dynamic" (default) groups related documents so memories form from coherent context. "instant" processes each document independently right away and bills one extra operation per document. */
		dreaming?: 'dynamic' | 'instant';
	};
	'documents.delete': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** Document identifiers to permanently delete from this namespace */
		ids: Array<string>;
	};
	'documents.get': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** The public document ID */
		id: string;
		/** Comma-separated child resources to include: chunks, memories, or both. */
		include?: Array<'chunks' | 'memories'>;
	};
	'documents.memoryCounts': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		ids: Array<string>;
	};
	'documents.replaceWithFile': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** The public document ID */
		id: string;
		/** File contents to upload */
		file: FileInput;
		/** Context used to guide memory extraction within this namespace. Max 1500 characters. */
		supportingContext?: string;
		/** JSON-encoded metadata to attach to the document and its derived memories */
		metadata?: string;
		/** JSON-encoded metadata used to keep related context isolated during processing and recall */
		group?: string;
		/** When the source content is from, in ISO 8601 format */
		date?: string;
		/** Processing pipeline. "memory" builds durable learned context; "superrag" optimizes the document for retrieval without generating memories. */
		taskType?: 'memory' | 'superrag';
		/** Processing mode. "dynamic" (default) groups related documents so memories form from coherent context. "instant" processes each document independently right away and bills one extra operation per document. */
		dreaming?: 'dynamic' | 'instant';
		/** Explicit source type used when automatic inference is insufficient */
		fileType?: 'text' | 'pdf' | 'image' | 'video' | 'audio';
		/** Explicit MIME type used when upload metadata is insufficient */
		mimeType?: string;
	};
	'documents.update': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** The public document ID */
		id: string;
		/** The content to process. This may be plaintext or a URL to supported rich content. */
		content?: string;
		/** Context used to guide memory extraction within this namespace. Max 1500 characters. */
		supportingContext?: string;
		/** Arbitrary metadata attached to the document and derived data */
		metadata?: Record<string, string | number | boolean | Array<string>>;
		/** Metadata values that isolate related context within the namespace */
		group?: Record<string, string | number | boolean | Array<string>>;
		/** When the source content is from, in ISO 8601 format */
		date?: string;
		/** Processing pipeline. "memory" builds durable learned context; "superrag" optimizes the document for retrieval without generating memories. */
		taskType?: 'memory' | 'superrag';
		/** Processing mode. "dynamic" (default) groups related documents so memories form from coherent context. "instant" processes each document independently right away and bills one extra operation per document. */
		dreaming?: 'dynamic' | 'instant';
	};
	'documents.updateFile': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** The public document ID */
		id: string;
		/** File contents to upload */
		file?: FileInput;
		/** Context used to guide memory extraction within this namespace. Max 1500 characters. */
		supportingContext?: string;
		/** JSON-encoded metadata to attach to the document and its derived memories */
		metadata?: string;
		/** JSON-encoded metadata used to keep related context isolated during processing and recall */
		group?: string;
		/** When the source content is from, in ISO 8601 format */
		date?: string;
		/** Processing pipeline. "memory" builds durable learned context; "superrag" optimizes the document for retrieval without generating memories. */
		taskType?: 'memory' | 'superrag';
		/** Processing mode. "dynamic" (default) groups related documents so memories form from coherent context. "instant" processes each document independently right away and bills one extra operation per document. */
		dreaming?: 'dynamic' | 'instant';
		/** Explicit source type used when automatic inference is insufficient */
		fileType?: 'text' | 'pdf' | 'image' | 'video' | 'audio';
		/** Explicit MIME type used when upload metadata is insufficient */
		mimeType?: string;
	};
	'documents.uploadFile': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		/** File contents to upload */
		file: FileInput;
		/** Context used to guide memory extraction within this namespace. Max 1500 characters. */
		supportingContext?: string;
		/** JSON-encoded metadata to attach to the document and its derived memories */
		metadata?: string;
		/** JSON-encoded metadata used to keep related context isolated during processing and recall */
		group?: string;
		/** When the source content is from, in ISO 8601 format */
		date?: string;
		/** Processing pipeline. "memory" builds durable learned context; "superrag" optimizes the document for retrieval without generating memories. */
		taskType?: 'memory' | 'superrag';
		/** Processing mode. "dynamic" (default) groups related documents so memories form from coherent context. "instant" processes each document independently right away and bills one extra operation per document. */
		dreaming?: 'dynamic' | 'instant';
		/** Explicit source type used when automatic inference is insufficient */
		fileType?: 'text' | 'pdf' | 'image' | 'video' | 'audio';
		/** Explicit MIME type used when upload metadata is insufficient */
		mimeType?: string;
	};
	'feedback.send': {
		/** Kind of feedback */
		type: 'bug' | 'feature_request' | 'docs' | 'other';
		/** One-line summary */
		title: string;
		/** What happened, with enough detail for an engineer to act on it */
		description: string;
		/** API operation the feedback is about */
		endpoint?: string;
		/** Request ID of a failing call, if there is one */
		requestId?: string;
		/** What you expected to happen */
		expected?: string;
		/** What actually happened */
		actual?: string;
		/** Agent, tool or SDK sending the feedback */
		client?: string;
		/** Where to reach you about this feedback */
		contactEmail?: string;
	};
	'graph.get': {
		/** The isolated namespace. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents. */
		namespace: string;
		cursor?: string;
		limit?: number;
		/** A type-safe metadata filter predicate or nested and/or expression with up to 5 levels of nesting */
		filter?: SupermemoryFilterExpressionInput;
		sort?: 'createdAt' | 'updatedAt';
		order?: 'asc' | 'desc';
	};
	'legacy.connections.configure': {
		connectionId: string;
		resources: Array<Record<string, SupermemoryJsonValue>>;
	};
	'legacy.connections.create': {
		provider:
			| 'notion'
			| 'google-drive'
			| 'onedrive'
			| 'gmail'
			| 'github'
			| 'web-crawler'
			| 's3'
			| 'granola';
		containerTag?: string;
		containerTags?: Array<string>;
		documentLimit?: number;
		metadata?: Record<string, string | number | boolean> | null;
		redirectUrl?: string;
	};
	'legacy.connections.delete': {
		connectionId: string;
		/** Whether to also delete documents imported by this connection. Defaults to true. */
		deleteDocuments?: string;
	};
	'legacy.connections.deleteByProvider': {
		provider:
			| 'notion'
			| 'google-drive'
			| 'onedrive'
			| 'gmail'
			| 'github'
			| 'web-crawler'
			| 's3'
			| 'granola';
		/** Optional comma-separated list of container tags to filter connections by */
		containerTags: Array<string>;
	};
	'legacy.connections.documents': {
		provider:
			| 'notion'
			| 'google-drive'
			| 'onedrive'
			| 'gmail'
			| 'github'
			| 'web-crawler'
			| 's3'
			| 'granola';
		/** Optional comma-separated list of container tags to filter documents by */
		containerTags?: Array<string>;
	};
	'legacy.connections.get': {
		connectionId: string;
	};
	'legacy.connections.getByProvider': {
		provider:
			| 'notion'
			| 'google-drive'
			| 'onedrive'
			| 'gmail'
			| 'github'
			| 'web-crawler'
			| 's3'
			| 'granola';
		/** Comma-separated list of container tags to filter connection by */
		containerTags: Array<string>;
	};
	'legacy.connections.list': {
		/** Optional comma-separated list of container tags to filter documents by */
		containerTags?: Array<string>;
	};
	'legacy.connections.resources': {
		connectionId: string;
		page?: number;
		parent_id?: string;
		per_page?: number;
	};
	'legacy.connections.sync': {
		provider:
			| 'notion'
			| 'google-drive'
			| 'onedrive'
			| 'gmail'
			| 'github'
			| 'web-crawler'
			| 's3'
			| 'granola';
		/** Optional comma-separated list of container tags to filter connections by */
		containerTags?: Array<string>;
	};
	'legacy.containerTags.delete': {
		containerTag: string;
	};
	'legacy.containerTags.get': {
		containerTag: string;
	};
	'legacy.containerTags.list': {
		/** Comma-separated container tags to limit the list to */
		containerTags?: string;
	};
	'legacy.containerTags.merge': {
		/** List of container tags to merge (min: 2, max: 2). All documents from these tags will be merged into the target. */
		containerTags: Array<string>;
		/** The container tag to merge into. Must either be in the containerTags list or a completely new tag that doesn't exist in the org. */
		targetContainerTag: string;
	};
	'legacy.containerTags.mergeStatus': {
		mergeId: string;
	};
	'legacy.containerTags.update': {
		containerTag: string;
		/** Display name for this container tag. This does not change the container tag identifier. */
		name?: string;
		/** Custom context prompt for this container tag. Used to provide additional context when processing documents in this container. Maximum 1500 characters. */
		entityContext?: string | null;
		/** Per-tag allowlist of filesystem paths that trigger memory generation for mount-ingested documents. Docs whose filepath does not match are ingested as 'superrag' (chunked and searchable, no memory extraction). */
		memoryFilesystemPaths?: Array<string> | null;
		/** Container-tag-level buckets to set (add-only on top of org buckets). Replaces this tag's own bucket list; cannot override or remove org buckets. */
		profileBuckets?: Array<{
			/** Stable slug for the bucket, stored on each memory */
			key: string;
			/** What belongs in this bucket — used to guide the ingestion classifier. */
			description?: string;
		}>;
	};
	'legacy.conversations.ingest': {
		conversationId: string;
		messages: Array<{
			role: 'user' | 'assistant' | 'system' | 'tool';
			content:
				| string
				| Array<
						| {
								type: 'text';
								text: string;
						  }
						| {
								type: 'image_url';
								imageUrl: {
									url: string;
								};
						  }
				  >;
			name?: string;
			tool_calls?: Array<SupermemoryJsonValue>;
			tool_call_id?: string;
		}>;
		containerTags?: Array<string>;
		metadata?: Record<string, string | number | boolean>;
	};
	'legacy.documents.add': {
		/** The content to extract and process into a document. This can be a URL to a website, a PDF, an image, or a video. */
		content: string;
		/** Optional tag this document should be containerized by. Max 100 characters, alphanumeric with hyphens, underscores, and dots only. */
		containerTag?: string;
		containerTags?: Array<string>;
		/** Optional entity context for this container tag. Max 1500 characters. Used during document processing to guide memory extraction. */
		entityContext?: string;
		/** Optional custom ID of the document. Max 100 characters, alphanumeric with hyphens, underscores, and dots only. */
		customId?: string;
		/** Optional metadata for the document. */
		metadata?: Record<string, string | number | boolean | Array<string>>;
		/** Task type: "memory" (default) for full context layer with SuperRAG built in, "superrag" for managed RAG as a service. */
		taskType?: 'memory' | 'superrag';
		/** Optional file path for the document. Used by supermemoryfs to store the full path of the file. */
		filepath?: string;
		/** Optional metadata filter to apply when pulling related memories and profile during ingestion. Only memories matching these filters will be used as context. */
		filterByMetadata?: Record<
			string,
			string | number | boolean | Array<string>
		>;
		/** When this document's content is from, as opposed to when it was uploaded. Accepts YYYY-MM-DD or a full ISO 8601 timestamp. Memory extraction resolves relative dates against this instead of the ingestion time, and documents in a batch are processed oldest-first so newer facts correctly supersede… */
		documentDate?: string;
		/** Processing mode. "dynamic" (default) groups related documents together so memories form from coherent, logical units rather than one isolated entry at a time. "instant" processes each document on its own right away, and bills one extra operation per document. */
		dreaming?: 'instant' | 'dynamic';
	};
	'legacy.documents.batchAdd': {
		/** Optional tag this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
		containerTag?: string;
		/** (DEPRECATED: Use containerTag instead) Optional tags this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
		containerTags?: Array<string>;
		/** Optional metadata for the document. This is used to store additional information about the document. You can use this to store any additional information you need about the document. Metadata can be filtered through. Keys must be strings and are case sensitive. Values can be strings, numbers, or… */
		metadata?: Record<string, string | number | boolean | Array<string>>;
		/** Task type: "memory" (default) for full context layer with SuperRAG built in, "superrag" for managed RAG as a service. */
		taskType?: 'memory' | 'superrag';
		/** Optional file path for the document (e.g., '/documents/reports/file.pdf'). Used by supermemoryfs to map documents to filesystem paths. */
		filepath?: string;
		/** Optional metadata filter scoping which existing memories are pulled as context during ingestion. Scalar values match exactly (AND across keys); array values match ANY (OR within key). Only memories whose source documents match this filter are used as context. */
		filterByMetadata?: Record<
			string,
			string | number | boolean | Array<string>
		>;
		/** When this document's content is from, as opposed to when it was uploaded. Accepts YYYY-MM-DD or a full ISO 8601 timestamp. Memory extraction resolves relative dates ('yesterday', 'last quarter') against this instead of the ingestion time, and documents in a batch are processed oldest-first so… */
		documentDate?: string;
		/** Optional entity context for this container tag. Max 1500 characters. Used during document processing to guide memory extraction. */
		entityContext?: string;
		/** Processing mode. "dynamic" (default) groups related documents together so memories form from coherent, logical units rather than one isolated entry at a time. "instant" processes each document on its own right away, and bills one extra operation per document. */
		dreaming?: 'instant' | 'dynamic';
		documents:
			| Array<{
					/** Optional tag this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
					containerTag?: string;
					/** (DEPRECATED: Use containerTag instead) Optional tags this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
					containerTags?: Array<string>;
					/** The content to extract and process into a document. This can be a URL to a website, a PDF, an image, or a video. Plaintext: Any plaintext format URL: A URL to a website, PDF, image, or video We automatically detect the content type from the url's response format. */
					content: string;
					/** Optional custom ID of the document. This could be an ID from your database that will uniquely identify this document. */
					customId?: string;
					/** Optional metadata for the document. This is used to store additional information about the document. You can use this to store any additional information you need about the document. Metadata can be filtered through. Keys must be strings and are case sensitive. Values can be strings, numbers, or… */
					metadata?: Record<string, string | number | boolean | Array<string>>;
					/** Task type: "memory" (default) for full context layer with SuperRAG built in, "superrag" for managed RAG as a service. */
					taskType?: 'memory' | 'superrag';
					/** Optional file path for the document (e.g., '/documents/reports/file.pdf'). Used by supermemoryfs to map documents to filesystem paths. */
					filepath?: string;
					/** Optional metadata filter scoping which existing memories are pulled as context during ingestion. Scalar values match exactly (AND across keys); array values match ANY (OR within key). Only memories whose source documents match this filter are used as context. */
					filterByMetadata?: Record<
						string,
						string | number | boolean | Array<string>
					>;
					/** When this document's content is from, as opposed to when it was uploaded. Accepts YYYY-MM-DD or a full ISO 8601 timestamp. Memory extraction resolves relative dates ('yesterday', 'last quarter') against this instead of the ingestion time, and documents in a batch are processed oldest-first so… */
					documentDate?: string;
					/** Optional entity context for this container tag. Max 1500 characters. Used during document processing to guide memory extraction. */
					entityContext?: string;
					/** Processing mode. "dynamic" (default) groups related documents together so memories form from coherent, logical units rather than one isolated entry at a time. "instant" processes each document on its own right away, and bills one extra operation per document. */
					dreaming?: 'instant' | 'dynamic';
			  }>
			| Array<string>;
		content?: null;
	};
	'legacy.documents.bulkDelete': {
		/** Array of document IDs to delete (max 100 at once) */
		ids?: Array<string>;
		/** Array of container tags - all documents in these containers will be deleted */
		containerTags?: Array<string>;
		/** Delete documents matching this filepath. Exact match for full paths, prefix match if ending with / */
		filepath?: string;
	};
	'legacy.documents.chunks': {
		id: string;
	};
	'legacy.documents.delete': {
		id: string;
	};
	'legacy.documents.fileUrl': {
		id: string;
	};
	'legacy.documents.get': {
		id: string;
		namespace?: string;
	};
	'legacy.documents.list': {
		/** Optional tags this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
		containerTags?: Array<string>;
		/** Optional filters to apply to the search. Can be a JSON string or Query object. */
		filters?: SupermemoryQueryFilterInput;
		/** Whether to include the content field in the response. Warning: This can make responses significantly larger. */
		includeContent?: boolean;
		/** Opaque cursor from a previous response's `pagination.nextCursor`. When present, `page` is ignored and results continue after the last item of the previous page. Filters, sort, order and limit must match the request that produced the cursor. */
		cursor?: string;
		/** Number of items per page */
		limit?: string | number;
		/** Sort order */
		order?: 'asc' | 'desc';
		/** Page number to fetch */
		page?: string | number;
		/** Field to sort by */
		sort?: 'createdAt' | 'updatedAt';
		/** Filter documents by filepath. Exact match for full paths, prefix match if ending with / */
		filepath?: string;
	};
	'legacy.documents.listProcessing': {
		/** `active` returns in-flight documents updated in the last 4 hours. `pending` returns every document that is not done or failed, with no time cutoff. `all` also includes failed documents, paginated. */
		view?: 'active' | 'pending' | 'all';
		/** Comma-separated container tags to filter by */
		containerTags?: string;
		/** Page number to fetch. Used with `view=all`. */
		page?: string | number;
		/** Number of items per page. Used with `view=all`. */
		limit?: string | number;
	};
	'legacy.documents.search': {
		/** Threshold / sensitivity for chunk selection. 0 is least sensitive (returns most chunks, more results), 1 is most sensitive (returns lesser chunks, accurate results) */
		chunkThreshold?: number;
		/** Optional single container tag. Use this or containerTags. */
		containerTag?: string;
		/** Optional tags this search should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to filter documents. */
		containerTags?: Array<string>;
		/** Optional document ID to search within. You can use this to find chunks in a very large document. */
		docId?: string;
		/** DEPRECATED: This field is no longer used in v3 search. The search now uses chunkThreshold only. This parameter will be ignored. */
		documentThreshold?: number;
		/** Optional filters to apply to the search. Can be a JSON string or Query object. */
		filters?: SupermemoryQueryFilterInput;
		/** If true, include full document in the response. This is helpful if you want a chatbot to know the full context of the document. */
		includeFullDocs?: boolean;
		/** If true, include document summary in the response. This is helpful if you want a chatbot to know the full context of the document. */
		includeSummary?: boolean;
		/** Maximum number of results to return */
		limit?: number;
		/** If true, only return matching chunks without context. Normally, we send the previous and next chunk to provide more context for LLMs. If you only want the matching chunk, set this to true. */
		onlyMatchingChunks?: boolean;
		/** Search query string */
		q: string;
		/** If true, rerank the results based on the query. This is helpful if you want to ensure the most relevant results are returned. */
		rerank?: boolean;
		/** If true, rewrites the query to make it easier to find documents. This increases the latency by about 400ms */
		rewriteQuery?: boolean;
		/** DEPRECATED: Optional category filters */
		categoriesFilter?: Array<string>;
		/** Filter search results by filepath. Exact match for full paths, prefix match if ending with / */
		filepath?: string;
	};
	'legacy.documents.update': {
		id: string;
		/** Optional tag this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
		containerTag?: string;
		/** (DEPRECATED: Use containerTag instead) Optional tags this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
		containerTags?: Array<string>;
		/** The content to extract and process into a document. This can be a URL to a website, a PDF, an image, or a video. Plaintext: Any plaintext format URL: A URL to a website, PDF, image, or video We automatically detect the content type from the url's response format. */
		content?: string;
		/** Optional custom ID of the document. This could be an ID from your database that will uniquely identify this document. */
		customId?: string;
		/** Optional metadata for the document. This is used to store additional information about the document. You can use this to store any additional information you need about the document. Metadata can be filtered through. Keys must be strings and are case sensitive. Values can be strings, numbers, or… */
		metadata?: Record<string, string | number | boolean | Array<string>>;
		/** Task type: "memory" (default) for full context layer with SuperRAG built in, "superrag" for managed RAG as a service. */
		taskType?: 'memory' | 'superrag';
		/** Optional file path for the document (e.g., '/documents/reports/file.pdf'). Used by supermemoryfs to map documents to filesystem paths. */
		filepath?: string;
		/** Optional metadata filter scoping which existing memories are pulled as context during ingestion. Scalar values match exactly (AND across keys); array values match ANY (OR within key). Only memories whose source documents match this filter are used as context. */
		filterByMetadata?: Record<
			string,
			string | number | boolean | Array<string>
		>;
		/** When this document's content is from, as opposed to when it was uploaded. Accepts YYYY-MM-DD or a full ISO 8601 timestamp. Memory extraction resolves relative dates ('yesterday', 'last quarter') against this instead of the ingestion time, and documents in a batch are processed oldest-first so… */
		documentDate?: string;
	};
	'legacy.documents.uploadFile': {
		/** File to upload and process */
		file: FileInput;
		/** Optional container tag (e.g., 'user_123'). Use this for a single tag. */
		containerTag?: string;
		/** Optional container tags. Can be either a JSON string of an array (e.g., '["user_123", "project_123"]') or a single string (e.g., 'user_123'). Single strings will be automatically converted to an array. */
		containerTags?: string;
		/** Optional file type override to force specific processing behavior. Valid values: text, pdf, tweet, google_doc, google_slide, google_sheet, image, video, notion_doc, webpage, onedrive */
		fileType?: string;
		/** Required when fileType is 'image' or 'video'. Specifies the exact MIME type to use (e.g., 'image/png', 'image/jpeg', 'video/mp4', 'video/webm') */
		mimeType?: string;
		/** Optional metadata for the document as a JSON string. This is used to store additional information about the document. Keys must be strings and values can be strings, numbers, or booleans. */
		metadata?: string;
		/** Optional metadata filter as a JSON string. Scopes which existing memories are pulled as context during ingestion. Scalar values match exactly (AND across keys); array values match ANY (OR within key). */
		filterByMetadata?: string;
		/** Optional file path for the uploaded file (e.g., '/documents/reports/file.pdf'). Used by supermemoryfs to map documents to filesystem paths. */
		filepath?: string;
		/** DEPRECATED: This field is no longer used. Advanced PDF processing is now automatic with our hybrid Mistral OCR + Gemini pipeline. This parameter will be accepted but ignored for backwards compatibility. */
		useAdvancedProcessing?: string;
		/** Optional custom ID of the document. Max 100 characters, alphanumeric with hyphens, underscores, and colons only. */
		customId?: string;
		/** Optional entity context for this container tag. Max 1500 characters. Used during document processing to guide memory extraction. */
		entityContext?: string;
		/** Task type: "memory" (default) for full context layer with SuperRAG built in, "superrag" for managed RAG as a service. */
		taskType?: 'memory' | 'superrag';
		/** Processing mode. "dynamic" (default) groups related documents together so memories form from coherent, logical units rather than one isolated entry at a time. "instant" processes each document on its own right away, and bills one extra operation per document. */
		dreaming?: 'instant' | 'dynamic';
	};
	'legacy.memories.create': {
		/** Array of memories to create */
		memories: Array<{
			/** The memory text. Should be entity-centric, e.g. 'John prefers dark mode'. */
			content: string;
			/** Mark as true for permanent traits (name, profession, hometown). Defaults to false. */
			isStatic?: boolean;
			/** Arbitrary key-value metadata to attach. */
			metadata?: Record<string, string | number | boolean | Array<string>>;
			/** ISO 8601 datetime string. The memory will be auto-forgotten after this time. Pass null or omit for no expiry. */
			forgetAfter?: string | null;
			/** Optional reason for the scheduled forgetting. Only meaningful when forgetAfter is set. */
			forgetReason?: string | null;
			/** Structured temporal metadata. Merged into the metadata JSON column. */
			temporalContext?: {
				/** Date the document was authored */
				documentDate?: string | null;
				/** Dates of events referenced in the memory */
				eventDate?: Array<string> | null;
			};
		}>;
		/** The space / container tag these memories belong to. */
		containerTag: string;
	};
	'legacy.memories.forget': {
		/** ID of the memory entry to operate on */
		id?: string;
		/** Exact content match of the memory entry to operate on. Use this when you don't have the ID. */
		content?: string;
		/** Container tag / space identifier. Required to scope the operation. */
		containerTag: string;
		/** Optional reason for forgetting this memory */
		reason?: string;
	};
	'legacy.memories.forgetMatching': {
		/** Natural-language instruction ('forget everything about Project Titan') or a bare topic ('Project Titan'). The service searches the container's memories and selects matches to forget. Provide either query or ids. */
		query?: string;
		/** Forget exactly these memory ids, with no semantic search. Ids are validated against the containerTag, so unknown or out-of-scope ids are ignored. Provide either query or ids. */
		ids?: Array<string>;
		/** Container tag / space the forget operation is scoped to. */
		containerTag: string;
		/** When true, returns the memories that WOULD be forgotten without mutating anything. Defaults to false (forgets for real). */
		dryRun?: boolean;
		/** Minimum cosine similarity a memory must have to be considered. Lower = wider net. Defaults to 0.5. */
		threshold?: number;
		/** Maximum number of memories this call may forget. Defaults to 100, max 500. */
		maxForget?: number;
		/** Optional reason stored as forgetReason on each memory. */
		reason?: string;
	};
	'legacy.memories.list': {
		/** Container tags to filter memory entries. At least one tag is required. */
		containerTags: Array<string>;
		/** Optional filters to apply to the search. Can be a JSON string or Query object. */
		filters?: SupermemoryQueryFilterInput;
		/** Opaque cursor from a previous response's `pagination.nextCursor`. When present, `page` is ignored and results continue after the last item of the previous page. Filters, sort, order and limit must match the request that produced the cursor. */
		cursor?: string;
		/** Number of items per page */
		limit?: string | number;
		/** Sort order */
		order?: 'asc' | 'desc';
		/** Page number to fetch */
		page?: string | number;
		/** Field to sort by */
		sort?: 'createdAt' | 'updatedAt';
	};
	'legacy.memories.search': {
		/** Optional tag this search should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to filter memories. */
		containerTag?: string;
		/** Optional tags this search should be containerized by. Search is scoped to memories under these tags. */
		containerTags?: Array<string>;
		/** Threshold / sensitivity for memories selection. 0 is least sensitive (returns most memories, more results), 1 is most sensitive (returns lesser memories, accurate results) */
		threshold?: number;
		/** Optional filters to apply to the search. Can be a JSON string or Query object. */
		filters?: SupermemoryQueryFilterInput;
		include?: {
			documents?: boolean;
			summaries?: boolean;
			relatedMemories?: boolean;
			/** If true, include forgotten memories in search results. Forgotten memories are memories that have been explicitly forgotten or have passed their expiration date. */
			forgottenMemories?: boolean;
			/** DEPRECATED: Use searchMode='hybrid' instead. If true, automatically switches to hybrid mode. This field is kept for backward compatibility only. */
			chunks?: boolean;
		};
		/** Maximum number of results to return */
		limit?: number;
		/** Search query string */
		q: string;
		/** If true, rerank the results based on the query. This is helpful if you want to ensure the most relevant results are returned. */
		rerank?: boolean;
		/** If true, aggregates information from multiple memories to create new synthesized memories. The result will be a mix of aggregated and non-aggregated memories, reranked by relevance to the query. Works in conjunction with reranking. */
		aggregate?: boolean;
		/** If true, rewrites the query to make it easier to find documents. This increases the latency by about 400ms */
		rewriteQuery?: boolean;
		/** Search mode. 'memories' searches only memory entries (default). 'hybrid' searches both memories and document chunks. 'documents' searches only document chunks. */
		searchMode?: 'memories' | 'hybrid' | 'documents';
		/** Filter search results by filepath. Exact match for full paths, prefix match if ending with / */
		filepath?: string;
	};
	'legacy.memories.update': {
		/** ID of the memory entry to operate on */
		id?: string;
		/** Exact content match of the memory entry to operate on. Use this when you don't have the ID. */
		content?: string;
		/** Container tag / space identifier. Required to scope the operation. */
		containerTag: string;
		/** The new content that will replace the existing memory */
		newContent: string;
		/** Optional metadata. If not provided, inherits from the previous version. */
		metadata?: Record<string, string | number | boolean | Array<string>>;
		/** ISO 8601 datetime string. The memory will be auto-forgotten after this time. Pass null to clear an existing expiry. Omit to inherit from the previous version. */
		forgetAfter?: string | null;
		/** Optional reason for the scheduled forgetting. Cleared automatically when forgetAfter is set to null. */
		forgetReason?: string | null;
		/** Structured temporal metadata. Merged into the metadata JSON column. If omitted, existing temporalContext is preserved. */
		temporalContext?: {
			/** Date the document was authored */
			documentDate?: string | null;
			/** Dates of events referenced in the memory */
			eventDate?: Array<string> | null;
		};
	};
	'legacy.profile.buckets': {
		/** Tag to resolve effective bucket definitions for. Can be a user ID, project ID, or any identifier used to scope memories. */
		containerTag: string;
	};
	'legacy.profile.get': {
		/** Optional search query to include search results in the response */
		q?: string;
		/** Tag to filter the profile by. This can be an ID for your user, a project ID, or any other identifier you wish to use to filter memories. */
		containerTag: string;
		/** Threshold for search results. Only results with a score above this threshold will be included. */
		threshold?: number;
		/** Optional metadata filters to apply to profile results and search results. Supports complex AND/OR queries with multiple conditions. */
		filters?: SupermemoryQueryFilterInput;
		/** Profile sections to return. Omit to return all sections. Pass a subset to reduce payload — e.g. ["buckets"] skips static and dynamic entirely. */
		include?: Array<'static' | 'dynamic' | 'buckets'>;
		/** Specific bucket keys to return. Omit to return all configured buckets. Only relevant when "buckets" is included. */
		buckets?: Array<string>;
	};
	'legacy.settings.get': Record<string, never>;
	'legacy.settings.reset': {
		confirmation: string;
	};
	'legacy.settings.suggestBuckets': Record<string, never>;
	'legacy.settings.update': {
		excludeItems?:
			| (
					| (string | number | boolean)
					| null
					| Record<string, SupermemoryJsonValue>
					| Array<SupermemoryJsonValue>
			  )
			| null;
		filterPrompt?: string | null;
		googleDriveClientId?: string | null;
		googleDriveClientSecret?: string | null;
		googleDriveCustomKeyEnabled?: boolean | null;
		includeItems?:
			| (
					| (string | number | boolean)
					| null
					| Record<string, SupermemoryJsonValue>
					| Array<SupermemoryJsonValue>
			  )
			| null;
		notionClientId?: string | null;
		notionClientSecret?: string | null;
		notionCustomKeyEnabled?: boolean | null;
		onedriveClientId?: string | null;
		onedriveClientSecret?: string | null;
		onedriveCustomKeyEnabled?: boolean | null;
		githubClientId?: string | null;
		githubClientSecret?: string | null;
		githubCustomKeyEnabled?: boolean | null;
		shouldLLMFilter?: boolean | null;
		chunkSize?: number | null;
		/** Profile bucket definitions */
		profileBuckets?: Array<{
			/** Stable slug for the bucket, stored on each memory */
			key: string;
			/** What belongs in this bucket — used to guide the ingestion classifier. */
			description?: string;
		}>;
	};
	'memories.forget': {
		/** Namespace containing the memories to forget. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
		/** Memory identifiers to remove from normal recall */
		ids: Array<string>;
	};
	'memories.forgetMatching': {
		/** Namespace containing the memories to forget. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
		/** Natural-language description of the memories that should be forgotten */
		query: string;
		/** When true, preview matching memories without changing their recall state */
		dryRun: boolean;
	};
	'memories.get': {
		/** Namespace containing the memories to forget. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
		/** Memory identifier */
		id: string;
		/** Comma-separated extras. related: the memory's version history and connected memories. documents: the source document, also attached to each related memory when both are requested. */
		include?: Array<'related' | 'documents'>;
		/** Maximum parents, children and siblings to return, applied to each list separately. Parents and children are earlier and later versions up to three steps away, nearest first; siblings are direct extends or derives links. */
		relatedLimit?: number;
	};
	'namespaces.delete': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		/** Destination namespace that should receive this namespace's content before deletion. Omit to permanently delete the content. */
		moveTo?: string;
	};
	'namespaces.get': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
	};
	'namespaces.list': {
		/** One-based page number */
		page?: number;
		/** Maximum namespaces to return per page */
		limit?: number;
		/** Case-insensitive substring to match against namespace names */
		q?: string;
	};
	'namespaces.update': {
		/** Namespace identifier. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope documents and memories. */
		namespace: string;
		/** Background that guides how Supermemory interprets documents and forms memories. Max 1500 characters. Set null to clear it. */
		supportingContext?: string | null;
	};
	'organization.get': Record<string, never>;
	'organization.update': {
		/** Shared background that guides memory formation across every namespace. Set null to clear it. */
		organizationalContext: string | null;
	};
	'profiles.buckets.delete': {
		/** The isolated namespace to search. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
		/** Namespace-owned bucket names to delete. Organization-level buckets are protected and cannot be removed here. */
		buckets: Array<string>;
	};
	'profiles.buckets.get': {
		/** The isolated namespace to search. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
	};
	'profiles.buckets.set': {
		/** The isolated namespace to search. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
		/** Namespace-owned bucket names mapped to descriptions that guide memory classification. Existing names are updated; new names are added. */
		buckets: Record<string, string>;
	};
	'profiles.get': {
		/** The isolated namespace to search. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
		/** Type-safe metadata conditions that limit which memories contribute to the profile */
		filter?: SupermemoryFilterExpressionInput;
		/** Custom buckets to return. Omit to return every effective bucket. */
		buckets?: Array<string>;
	};
	'resources.list': {
		/** Namespace containing the resources to list. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope resources. */
		namespace: string;
		/** Resource collection to list: source documents, extracted chunks, or learned memories */
		type: 'documents' | 'chunks' | 'memories';
		/** Opaque cursor from a previous response's `pagination.nextCursor`. When present, `page` is ignored and results continue after the last item of the previous page. Filters, sort, order and limit must match the request that produced the cursor. */
		cursor?: string;
		/** One-based page number */
		page?: number;
		/** Maximum resources to return per page */
		limit?: number;
		/** Field used to order results. Position is available only when listing chunks. */
		sort?: 'createdAt' | 'updatedAt' | 'position';
		/** Ascending or descending sort direction */
		order?: 'asc' | 'desc';
		/** Type-safe metadata conditions applied before pagination */
		filter?: SupermemoryFilterExpressionInput;
		/** Optional extras */
		include?: {
			/** Include the last published extracted text when listing documents only. Large documents can make the response significantly larger. */
			content?: boolean;
			/** Include live memory counts when listing documents */
			memoryCount?: boolean;
			/** List forgotten and expired memories too, with isForgotten: true. Applies to type memories only. */
			forgotten?: boolean;
		};
	};
	'search.query': {
		/** The isolated namespace to search. This can be an ID for your user, a project ID, or any other identifier you wish to use to scope memories. */
		namespace: string;
		/** Natural-language question, topic, or phrase to retrieve relevant context for. Replaces the v4 `q` field. */
		query: string;
		/** Type-safe metadata conditions applied before ranking results. Replaces the v4 `filters` field and unifies both legacy filter formats into one expression type. */
		filter?: SupermemoryFilterExpressionInput;
		/** Search surface. "hybrid" combines learned memories with source chunks, "memories" returns learned context, and "chunks" returns source passages. */
		searchMode?: 'hybrid' | 'memories' | 'chunks';
		/** Maximum number of results to return */
		limit?: number;
		/** Optional context to include alongside each matching result */
		include?: {
			/** Include the source document for each result when one is available */
			documents?: boolean;
			/** Include parent, child, and sibling memories that explain how each memory evolved */
			related?: boolean;
			/** Let forgotten and expired memories appear in results */
			forgotten?: boolean;
		};
		/** Minimum relevance score from 0 to 1. Raise it for precision (fewer, accurate results) or lower it for broader recall (more results). */
		threshold?: number;
		/** Post-retrieval ranking. "order" improves result ordering; "aggregate" also combines overlapping context into cleaner answers. This is helpful if you want to ensure the most relevant results are returned. */
		rerank?: 'none' | 'order' | 'aggregate';
		/** Expand and clarify the query before retrieval to improve recall for conversational or underspecified prompts. This increases the latency by about 400ms. */
		rewriteQuery?: boolean;
	};
};

export type SupermemoryOperationOutputs = {
	'connectors.create': {
		/** Connector identifier */
		id?: string | null;
		/** Null for providers that authenticate with config only */
		authorization?: {
			/** Send the user here to authorize the provider */
			url?: string | null;
			/** When url stops working */
			expiresAt?: string | null;
		} | null;
	};
	'connectors.delete': {
		id?: string | null;
		deleted?: boolean | null;
	};
	'connectors.get': {
		id?: string | null;
		/** External source */
		provider?: string | null;
		/** Present while pending, when the caller can create connectors in this namespace */
		authorization?: {
			/** Send the user here to authorize the provider */
			url?: string | null;
			/** When url stops working */
			expiresAt?: string | null;
		} | null;
		/** Namespace the connector syncs into. Connectors created without one report sm_project_default. */
		namespace?: string | null;
		/** Account on the provider side, usually an email */
		account?: string | null;
		capabilities?: {
			/** Supports choosing what to sync via the hosted picker */
			selectable?: boolean | null;
			/** Receives change notifications instead of only polling */
			webhooks?: boolean | null;
		} | null;
		/** Non-secret setup, such as the S3 bucket, crawler start URL or Notion workspace. Credentials are never returned. */
		config?: Record<string, string | number | boolean> | null;
		/** What syncs, grouped by kind (repos, labels, files or folders), each a list of { id, name }. Null for connectors that sync everything. */
		selection?: Record<
			string,
			Array<{
				id?: string | null;
				name?: string | null;
			}>
		> | null;
		documentLimit?: number | null;
		documentCount?: number | null;
		/** The most recent sync run, which may still be running or may have failed */
		latestRun?: {
			errorCode?: string | null;
			/** Customer-safe error message */
			error?: string | null;
			/** Run status and timestamps maintained by Supermemory */
			system?: {
				status?: string | null;
				/** ISO 8601 timestamp when the run started */
				startedAt?: string | null;
				/** ISO 8601 timestamp when the run ended; null while running */
				completedAt?: string | null;
			} | null;
		} | null;
		/** Lifecycle status and timestamps maintained by Supermemory */
		system?: {
			/** pending_authorization until the user finishes the provider login at authorization.url; DELETE cancels it. Pending connectors are not listed. */
			status?: string | null;
			/** ISO 8601 timestamp when the connector was created */
			createdAt?: string | null;
			/** ISO 8601 timestamp when content last finished syncing successfully */
			lastSuccessfulSyncAt?: string | null;
		} | null;
		/** Present when include=syncs */
		syncs?: Array<{
			errorCode?: string | null;
			/** Customer-safe error message */
			error?: string | null;
			/** Run status and timestamps maintained by Supermemory */
			system?: {
				status?: string | null;
				/** ISO 8601 timestamp when the run started */
				startedAt?: string | null;
				/** ISO 8601 timestamp when the run ended; null while running */
				completedAt?: string | null;
			} | null;
			id?: string | null;
			trigger?: string | null;
			itemsProcessed?: number | null;
			itemsFailed?: number | null;
			/** Failed items, capped. itemsFailed is the true count. */
			failures?: Array<{
				documentId?: string | null;
				title?: string | null;
				errorCode?: string | null;
				errorMessage?: string | null;
				failedAt?: string | null;
			}> | null;
		}> | null;
		/** Present when include=picker. Null for connectors that sync everything. */
		picker?: {
			/** Send the user here to choose what syncs. Works once, in any browser. */
			url?: string | null;
			expiresAt?: string | null;
		} | null;
	};
	'connectors.list': {
		connectors?: Array<{
			id?: string | null;
			/** External source */
			provider?: string | null;
			/** Present while pending, when the caller can create connectors in this namespace */
			authorization?: {
				/** Send the user here to authorize the provider */
				url?: string | null;
				/** When url stops working */
				expiresAt?: string | null;
			} | null;
			/** Namespace the connector syncs into. Connectors created without one report sm_project_default. */
			namespace?: string | null;
			/** Account on the provider side, usually an email */
			account?: string | null;
			capabilities?: {
				/** Supports choosing what to sync via the hosted picker */
				selectable?: boolean | null;
				/** Receives change notifications instead of only polling */
				webhooks?: boolean | null;
			} | null;
			/** Non-secret setup, such as the S3 bucket, crawler start URL or Notion workspace. Credentials are never returned. */
			config?: Record<string, string | number | boolean> | null;
			/** What syncs, grouped by kind (repos, labels, files or folders), each a list of { id, name }. Null for connectors that sync everything. */
			selection?: Record<
				string,
				Array<{
					id?: string | null;
					name?: string | null;
				}>
			> | null;
			documentLimit?: number | null;
			documentCount?: number | null;
			/** The most recent sync run, which may still be running or may have failed */
			latestRun?: {
				errorCode?: string | null;
				/** Customer-safe error message */
				error?: string | null;
				/** Run status and timestamps maintained by Supermemory */
				system?: {
					status?: string | null;
					/** ISO 8601 timestamp when the run started */
					startedAt?: string | null;
					/** ISO 8601 timestamp when the run ended; null while running */
					completedAt?: string | null;
				} | null;
			} | null;
			/** Lifecycle status and timestamps maintained by Supermemory */
			system?: {
				/** pending_authorization until the user finishes the provider login at authorization.url; DELETE cancels it. Pending connectors are not listed. */
				status?: string | null;
				/** ISO 8601 timestamp when the connector was created */
				createdAt?: string | null;
				/** ISO 8601 timestamp when content last finished syncing successfully */
				lastSuccessfulSyncAt?: string | null;
			} | null;
			/** Present when include=syncs */
			syncs?: Array<{
				errorCode?: string | null;
				/** Customer-safe error message */
				error?: string | null;
				/** Run status and timestamps maintained by Supermemory */
				system?: {
					status?: string | null;
					/** ISO 8601 timestamp when the run started */
					startedAt?: string | null;
					/** ISO 8601 timestamp when the run ended; null while running */
					completedAt?: string | null;
				} | null;
				id?: string | null;
				trigger?: string | null;
				itemsProcessed?: number | null;
				itemsFailed?: number | null;
				/** Failed items, capped. itemsFailed is the true count. */
				failures?: Array<{
					documentId?: string | null;
					title?: string | null;
					errorCode?: string | null;
					errorMessage?: string | null;
					failedAt?: string | null;
				}> | null;
			}> | null;
			/** Present when include=picker. Null for connectors that sync everything. */
			picker?: {
				/** Send the user here to choose what syncs. Works once, in any browser. */
				url?: string | null;
				expiresAt?: string | null;
			} | null;
		}> | null;
		/** Pagination metadata */
		pagination?: {
			currentPage?: number | null;
			limit?: number | null;
			totalItems?: number | null;
			totalPages?: number | null;
			/** Whether more items exist after this page */
			hasMore?: boolean | null;
			/** Opaque cursor for the next page. Pass it back as `cursor`. Null when there are no more items. */
			nextCursor?: string | null;
		} | null;
	};
	'connectors.listAll': {
		connectors?: Array<{
			id?: string | null;
			/** External source */
			provider?: string | null;
			/** Present while pending, when the caller can create connectors in this namespace */
			authorization?: {
				/** Send the user here to authorize the provider */
				url?: string | null;
				/** When url stops working */
				expiresAt?: string | null;
			} | null;
			/** Namespace the connector syncs into. Connectors created without one report sm_project_default. */
			namespace?: string | null;
			/** Account on the provider side, usually an email */
			account?: string | null;
			capabilities?: {
				/** Supports choosing what to sync via the hosted picker */
				selectable?: boolean | null;
				/** Receives change notifications instead of only polling */
				webhooks?: boolean | null;
			} | null;
			/** Non-secret setup, such as the S3 bucket, crawler start URL or Notion workspace. Credentials are never returned. */
			config?: Record<string, string | number | boolean> | null;
			/** What syncs, grouped by kind (repos, labels, files or folders), each a list of { id, name }. Null for connectors that sync everything. */
			selection?: Record<
				string,
				Array<{
					id?: string | null;
					name?: string | null;
				}>
			> | null;
			documentLimit?: number | null;
			documentCount?: number | null;
			/** The most recent sync run, which may still be running or may have failed */
			latestRun?: {
				errorCode?: string | null;
				/** Customer-safe error message */
				error?: string | null;
				/** Run status and timestamps maintained by Supermemory */
				system?: {
					status?: string | null;
					/** ISO 8601 timestamp when the run started */
					startedAt?: string | null;
					/** ISO 8601 timestamp when the run ended; null while running */
					completedAt?: string | null;
				} | null;
			} | null;
			/** Lifecycle status and timestamps maintained by Supermemory */
			system?: {
				/** pending_authorization until the user finishes the provider login at authorization.url; DELETE cancels it. Pending connectors are not listed. */
				status?: string | null;
				/** ISO 8601 timestamp when the connector was created */
				createdAt?: string | null;
				/** ISO 8601 timestamp when content last finished syncing successfully */
				lastSuccessfulSyncAt?: string | null;
			} | null;
			/** Present when include=syncs */
			syncs?: Array<{
				errorCode?: string | null;
				/** Customer-safe error message */
				error?: string | null;
				/** Run status and timestamps maintained by Supermemory */
				system?: {
					status?: string | null;
					/** ISO 8601 timestamp when the run started */
					startedAt?: string | null;
					/** ISO 8601 timestamp when the run ended; null while running */
					completedAt?: string | null;
				} | null;
				id?: string | null;
				trigger?: string | null;
				itemsProcessed?: number | null;
				itemsFailed?: number | null;
				/** Failed items, capped. itemsFailed is the true count. */
				failures?: Array<{
					documentId?: string | null;
					title?: string | null;
					errorCode?: string | null;
					errorMessage?: string | null;
					failedAt?: string | null;
				}> | null;
			}> | null;
			/** Present when include=picker. Null for connectors that sync everything. */
			picker?: {
				/** Send the user here to choose what syncs. Works once, in any browser. */
				url?: string | null;
				expiresAt?: string | null;
			} | null;
		}> | null;
		/** Pagination metadata */
		pagination?: {
			currentPage?: number | null;
			limit?: number | null;
			totalItems?: number | null;
			totalPages?: number | null;
			/** Whether more items exist after this page */
			hasMore?: boolean | null;
			/** Opaque cursor for the next page. Pass it back as `cursor`. Null when there are no more items. */
			nextCursor?: string | null;
		} | null;
	};
	'connectors.sync': {
		/** Connector identifier */
		id?: string | null;
		status?: string | null;
	};
	'connectors.update': {
		id?: string | null;
		/** External source */
		provider?: string | null;
		/** Present while pending, when the caller can create connectors in this namespace */
		authorization?: {
			/** Send the user here to authorize the provider */
			url?: string | null;
			/** When url stops working */
			expiresAt?: string | null;
		} | null;
		/** Namespace the connector syncs into. Connectors created without one report sm_project_default. */
		namespace?: string | null;
		/** Account on the provider side, usually an email */
		account?: string | null;
		capabilities?: {
			/** Supports choosing what to sync via the hosted picker */
			selectable?: boolean | null;
			/** Receives change notifications instead of only polling */
			webhooks?: boolean | null;
		} | null;
		/** Non-secret setup, such as the S3 bucket, crawler start URL or Notion workspace. Credentials are never returned. */
		config?: Record<string, string | number | boolean> | null;
		/** What syncs, grouped by kind (repos, labels, files or folders), each a list of { id, name }. Null for connectors that sync everything. */
		selection?: Record<
			string,
			Array<{
				id?: string | null;
				name?: string | null;
			}>
		> | null;
		documentLimit?: number | null;
		documentCount?: number | null;
		/** The most recent sync run, which may still be running or may have failed */
		latestRun?: {
			errorCode?: string | null;
			/** Customer-safe error message */
			error?: string | null;
			/** Run status and timestamps maintained by Supermemory */
			system?: {
				status?: string | null;
				/** ISO 8601 timestamp when the run started */
				startedAt?: string | null;
				/** ISO 8601 timestamp when the run ended; null while running */
				completedAt?: string | null;
			} | null;
		} | null;
		/** Lifecycle status and timestamps maintained by Supermemory */
		system?: {
			/** pending_authorization until the user finishes the provider login at authorization.url; DELETE cancels it. Pending connectors are not listed. */
			status?: string | null;
			/** ISO 8601 timestamp when the connector was created */
			createdAt?: string | null;
			/** ISO 8601 timestamp when content last finished syncing successfully */
			lastSuccessfulSyncAt?: string | null;
		} | null;
		/** Present when include=syncs */
		syncs?: Array<{
			errorCode?: string | null;
			/** Customer-safe error message */
			error?: string | null;
			/** Run status and timestamps maintained by Supermemory */
			system?: {
				status?: string | null;
				/** ISO 8601 timestamp when the run started */
				startedAt?: string | null;
				/** ISO 8601 timestamp when the run ended; null while running */
				completedAt?: string | null;
			} | null;
			id?: string | null;
			trigger?: string | null;
			itemsProcessed?: number | null;
			itemsFailed?: number | null;
			/** Failed items, capped. itemsFailed is the true count. */
			failures?: Array<{
				documentId?: string | null;
				title?: string | null;
				errorCode?: string | null;
				errorMessage?: string | null;
				failedAt?: string | null;
			}> | null;
		}> | null;
		/** Present when include=picker. Null for connectors that sync everything. */
		picker?: {
			/** Send the user here to choose what syncs. Works once, in any browser. */
			url?: string | null;
			expiresAt?: string | null;
		} | null;
	};
	'documents.add': {
		/** Document identifier to poll or retrieve */
		id?: string | null;
		/** The document's processing state after this request. queued when new work was queued; otherwise its current state, e.g. done for an unchanged duplicate or failed for a metadata-only update to a failed document. */
		status?: string | null;
	};
	'documents.batchAdd': {
		/** One result per submitted document: accepted documents first, in request order, then failed ones. Match results by id, or by url for a failed item with no id. */
		results?: Array<{
			/** Document identifier */
			id?: string | null;
			/** The document's processing state after this request, or error when this item failed */
			status?: string | null;
			/** Failure reason */
			error?: string | null;
			/** Human-readable explanation of the failure */
			details?: string | null;
			/** URL of the failed item, when it had one */
			url?: string | null;
		}> | null;
		/** Number of documents accepted */
		count?: number | null;
		/** Number of documents that failed */
		failed?: number | null;
	};
	'documents.delete': {
		/** Number of documents successfully deleted */
		count?: number | null;
		/** Per-document failures; successful deletions are not rolled back */
		errors?: Array<{
			/** The requested document identifier */
			id?: string | null;
			/** Why this document could not be deleted */
			error?: string | null;
		}> | null;
	};
	'documents.get': {
		/** Stable document identifier */
		id?: string | null;
		/** Extracted or caller-provided document title */
		title?: string | null;
		/** Detected source or content type */
		type?: string | null;
		/** Generated summary of the document, when available */
		summary?: string | null;
		/** Canonical extracted text used for processing and recall */
		content?: string | null;
		/** Caller metadata with internal fields removed */
		metadata?: Record<string, SupermemoryJsonValue> | null;
		/** Ingestion source, processing status, lifecycle timestamps, and storage path maintained by Supermemory */
		system?: {
			/** Recorded ingestion source; null when unavailable */
			source?: string | null;
			/** Current extraction and memory-processing status */
			status?: string | null;
			/** Memory generation state, separate from status. dreaming while memories for the latest content are queued, being generated, or waiting for a retry after a failure; done once they are generated or when none are needed. Under dynamic dreaming, status can reach done minutes before dreamingStatus does. */
			dreamingStatus?: string | null;
			/** ISO 8601 timestamp when the document was created */
			createdAt?: string | null;
			/** ISO 8601 timestamp of the latest document update */
			updatedAt?: string | null;
		} | null;
		/** Ordered document chunks; included only when requested */
		chunks?: Array<{
			/** Stable chunk identifier */
			id?: string | null;
			/** Zero-based order within the document */
			position?: number | null;
			/** Chunk text used for retrieval */
			content?: string | null;
			/** Chunk content type */
			type?: string | null;
			/** Chunk metadata; empty object when none */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Lifecycle timestamps maintained by Supermemory */
			system?: {
				/** ISO 8601 timestamp when the chunk was created */
				createdAt?: string | null;
			} | null;
		}> | null;
		/** Memories derived from the document; included only when requested */
		memories?: Array<{
			/** Stable memory identifier */
			id?: string | null;
			/** Learned fact or context extracted from the document */
			memory?: string | null;
			/** Memory metadata, including temporal context; empty object when none */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Whether the memory belongs to the stable profile section */
			isStatic?: boolean | null;
			/** Whether the memory was inferred rather than explicitly stated */
			isInference?: boolean | null;
			/** Whether this is the newest version in its memory chain */
			isLatest?: boolean | null;
			/** Whether this memory has been excluded from normal recall */
			isForgotten?: boolean | null;
			/** Version number within the memory chain */
			version?: number | null;
			/** Lifecycle timestamps maintained by Supermemory */
			system?: {
				/** ISO 8601 timestamp when this memory version was created */
				createdAt?: string | null;
				/** ISO 8601 timestamp of the latest update to this version */
				updatedAt?: string | null;
			} | null;
		}> | null;
	};
	'documents.memoryCounts': {
		counts?: Array<{
			id?: string | null;
			memoryCount?: number | null;
		}> | null;
	};
	'documents.replaceWithFile': {
		/** Document identifier to poll or retrieve */
		id?: string | null;
		/** The document's processing state after this request. queued when new work was queued; otherwise its current state, e.g. done for an unchanged duplicate or failed for a metadata-only update to a failed document. */
		status?: string | null;
	};
	'documents.update': {
		/** Document identifier to poll or retrieve */
		id?: string | null;
		/** The document's processing state after this request. queued when new work was queued; otherwise its current state, e.g. done for an unchanged duplicate or failed for a metadata-only update to a failed document. */
		status?: string | null;
	};
	'documents.updateFile': {
		/** Document identifier to poll or retrieve */
		id?: string | null;
		/** The document's processing state after this request. queued when new work was queued; otherwise its current state, e.g. done for an unchanged duplicate or failed for a metadata-only update to a failed document. */
		status?: string | null;
	};
	'documents.uploadFile': {
		/** Document identifier to poll or retrieve */
		id?: string | null;
		/** The document's processing state after this request. queued when new work was queued; otherwise its current state, e.g. done for an unchanged duplicate or failed for a metadata-only update to a failed document. */
		status?: string | null;
	};
	'feedback.send': {
		/** Feedback reference */
		id?: string | null;
		/** Submissions left for this caller until 00:00 UTC */
		remaining?: number | null;
	};
	'graph.get': {
		nodes?: Array<
			| {
					kind?: string | null;
					id?: string | null;
					customId?: string | null;
					title?: string | null;
					summary?: string | null;
					type?: string | null;
					namespaces?: Array<string> | null;
					createdAt?: string | null;
					updatedAt?: string | null;
			  }
			| {
					kind?: string | null;
					id?: string | null;
					memory?: string | null;
					namespace?: string | null;
					isStatic?: boolean | null;
					isLatest?: boolean | null;
					isForgotten?: boolean | null;
					isInference?: boolean | null;
					forgetAfter?: string | null;
					forgetReason?: string | null;
					version?: number | null;
					parentMemoryId?: string | null;
					rootMemoryId?: string | null;
					createdAt?: string | null;
					updatedAt?: string | null;
			  }
		> | null;
		edges?: Array<
			| {
					type?: string | null;
					source?: string | null;
					target?: string | null;
					sourceAddedAt?: string | null;
					sourceRelevanceScore?: number | null;
			  }
			| {
					type?: string | null;
					source?: string | null;
					target?: string | null;
			  }
		> | null;
		nextCursor?: string | null;
	};
	'legacy.connections.configure': {
		success?: boolean | null;
		message?: string | null;
		webhooksRegistered?: number | null;
	};
	'legacy.connections.create': {
		authLink?: string | null;
		expiresIn?: string | null;
		id?: string | null;
		redirectsTo?: string | null;
	};
	'legacy.connections.delete': Array<{
		id?: string | null;
		provider?: string | null;
	}>;
	'legacy.connections.deleteByProvider': Array<{
		id?: string | null;
		provider?: string | null;
	}>;
	'legacy.connections.documents': Array<{
		createdAt?: string | null;
		id?: string | null;
		status?: string | null;
		summary?: string | null;
		title?: string | null;
		type?: string | null;
		updatedAt?: string | null;
	}>;
	'legacy.connections.get': {
		createdAt?: string | null;
		documentLimit?: number | null;
		email?: string | null;
		expiresAt?: string | null;
		id?: string | null;
		metadata?: Record<string, SupermemoryJsonValue> | null;
		provider?: string | null;
		containerTags?: Array<string> | null;
		lastSyncRun?: {
			status?: string | null;
			errorCode?: string | null;
			error?: string | null;
			startedAt?: string | null;
			completedAt?: string | null;
		} | null;
	};
	'legacy.connections.getByProvider': {
		createdAt?: string | null;
		documentLimit?: number | null;
		email?: string | null;
		expiresAt?: string | null;
		id?: string | null;
		metadata?: Record<string, SupermemoryJsonValue> | null;
		provider?: string | null;
		containerTags?: Array<string> | null;
		lastSyncRun?: {
			status?: string | null;
			errorCode?: string | null;
			error?: string | null;
			startedAt?: string | null;
			completedAt?: string | null;
		} | null;
	};
	'legacy.connections.list': Array<{
		createdAt?: string | null;
		documentLimit?: number | null;
		email?: string | null;
		expiresAt?: string | null;
		id?: string | null;
		metadata?: Record<string, SupermemoryJsonValue> | null;
		provider?: string | null;
		containerTags?: Array<string> | null;
		lastSyncRun?: {
			status?: string | null;
			errorCode?: string | null;
			error?: string | null;
			startedAt?: string | null;
			completedAt?: string | null;
		} | null;
	}>;
	'legacy.connections.resources': {
		resources?: Array<Record<string, SupermemoryJsonValue>> | null;
		total_count?: number | null;
	};
	'legacy.connections.sync': {
		/** The response body as text. */
		text: string;
		/** The content type Supermemory answered with. */
		contentType: string | null;
	};
	'legacy.containerTags.delete': {
		/** Whether the deletion was successful */
		success?: boolean | null;
		/** The deleted container tag */
		containerTag?: string | null;
		/** Number of documents deleted */
		deletedDocumentsCount?: number | null;
		/** Number of memories marked as forgotten */
		deletedMemoriesCount?: number | null;
	};
	'legacy.containerTags.get': {
		/** The container tag identifier */
		containerTag?: string | null;
		/** Display name for this container tag */
		name?: string | null;
		/** Custom context prompt for this container tag. Used to provide additional context when processing documents in this container. */
		entityContext?: string | null;
		/** Per-tag allowlist of filesystem paths that trigger memory generation for mount-ingested documents. Docs whose filepath does not match are ingested as 'superrag' (chunked and searchable, no memory extraction). */
		memoryFilesystemPaths?: Array<string> | null;
		/** Container-tag-level buckets added on top of the org buckets (add-only) */
		profileBuckets?: Array<{
			/** Stable slug for the bucket, stored on each memory */
			key?: string | null;
			/** What belongs in this bucket — used to guide the ingestion classifier. */
			description?: string | null;
		}> | null;
		/** Creation timestamp */
		createdAt?: string | null;
		/** Last update timestamp */
		updatedAt?: string | null;
	};
	'legacy.containerTags.list': Array<{
		/** Unique identifier of the space/container tag */
		id?: string | null;
		/** Display name */
		name?: string | null;
		/** Container tag identifier */
		containerTag?: string | null;
		/** Auto-maintained, keyword-dense summary of the container's recurring topics, refreshed on each ingestion. Use it to pick the right container tag to read from or write to. */
		description?: string | null;
		/** Creation timestamp */
		createdAt?: string | null;
		/** Last update timestamp */
		updatedAt?: string | null;
		/** Whether the space is in experimental mode */
		isExperimental?: boolean | null;
		/** Emoji icon */
		emoji?: string | null;
		/** Space visibility: public (org-shared) or private (owner-only) */
		visibility?: string | null;
		/** Whether this is a Nova space (sm_project_* prefix) */
		isNova?: boolean | null;
		/** Number of documents linked to this container tag */
		documentCount?: number | null;
		/** Number of active memory entries (latest, not forgotten) in this container tag */
		memoryCount?: number | null;
		/** Most recent activity timestamp across documents and memories */
		lastActivityAt?: string | null;
		/** Whether this tag is involved in an active merge */
		mergeStatus?: string | null;
		/** Active merge job identifier */
		mergeId?: string | null;
		/** Target tag for an active source-tag merge */
		mergeTargetTag?: string | null;
	}>;
	'legacy.containerTags.merge': {
		/** Whether the merge job was queued successfully. */
		success?: boolean | null;
		/** The queued status of the merge job. */
		status?: string | null;
		/** Identifier for the queued merge job. */
		mergeId?: string | null;
		/** The target container tag that documents will be merged into. */
		targetTag?: string | null;
		/** List of source container tags queued for merge. */
		sourceTags?: Array<string> | null;
	};
	'legacy.containerTags.mergeStatus': {
		id?: string | null;
		status?: string | null;
		sourceTags?: Array<string> | null;
		targetTag?: string | null;
		progress?: {
			phase?: string | null;
			currentSourceTag?: string | null;
			currentKind?: string | null;
			copiedRows?: number | null;
			completedSourceTags?: Array<string> | null;
			inFlightItems?: number | null;
			attempt?: number | null;
			renamedCustomIds?: Array<{
				documentId?: string | null;
				from?: string | null;
				to?: string | null;
			}> | null;
		} | null;
		lastError?: string | null;
	};
	'legacy.containerTags.update': {
		/** The container tag identifier */
		containerTag?: string | null;
		/** Display name for this container tag */
		name?: string | null;
		/** Custom context prompt for this container tag. Used to provide additional context when processing documents in this container. */
		entityContext?: string | null;
		/** Per-tag allowlist of filesystem paths that trigger memory generation for mount-ingested documents. Docs whose filepath does not match are ingested as 'superrag' (chunked and searchable, no memory extraction). */
		memoryFilesystemPaths?: Array<string> | null;
		/** Container-tag-level buckets added on top of the org buckets (add-only) */
		profileBuckets?: Array<{
			/** Stable slug for the bucket, stored on each memory */
			key?: string | null;
			/** What belongs in this bucket — used to guide the ingestion classifier. */
			description?: string | null;
		}> | null;
		/** Last update timestamp */
		updatedAt?: string | null;
	};
	'legacy.conversations.ingest': {
		/** ID of the document backing this conversation */
		id?: string | null;
		/** The conversation ID supplied in the request */
		conversationId?: string | null;
		/** Processing status of the document */
		status?: string | null;
	};
	'legacy.documents.add': {
		/** Unique identifier of the document */
		id?: string | null;
		/** Status of the document */
		status?: string | null;
	};
	'legacy.documents.batchAdd': {
		/** Array of results for each document in the batch */
		results?: Array<{
			/** Unique identifier of the document (empty string for failed items) */
			id?: string | null;
			/** Status of the document (e.g. 'done', 'queued', 'error') */
			status?: string | null;
			/** Error message when status is 'error' */
			error?: string | null;
			/** Additional error details when status is 'error' */
			details?: string | null;
			/** URL of the failed item, when it had one. Only present on failed items, where it may be the only way to tell which input the error belongs to (the id falls back to 'unknown' when the input had neither an id nor a customId). */
			url?: string | null;
		}> | null;
		/** Count of documents that failed to add */
		failed?: number | null;
		/** Count of documents successfully added */
		success?: number | null;
	};
	'legacy.documents.bulkDelete': {
		/** Whether the bulk deletion was successful */
		success?: boolean | null;
		/** Number of documents successfully deleted */
		deletedCount?: number | null;
		/** Array of errors for documents that couldn't be deleted (only applicable when deleting by IDs) */
		errors?: Array<{
			id?: string | null;
			error?: string | null;
		}> | null;
		/** Container tags that were processed (only applicable when deleting by container tags) */
		containerTags?: Array<string> | null;
	};
	'legacy.documents.chunks': {
		/** The document ID */
		documentId?: string | null;
		/** Ordered list of chunks */
		chunks?: Array<{
			/** Unique identifier of the chunk */
			id?: string | null;
			/** Sequential position within the document */
			position?: number | null;
			/** Chunk text content */
			content?: string | null;
			/** Chunk type (text or image) */
			type?: string | null;
			/** Optional metadata attached to the chunk */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Creation timestamp */
			createdAt?: string | null;
		}> | null;
		/** Total number of chunks */
		total?: number | null;
	};
	'legacy.documents.delete': {
		/** Supermemory accepted the call; it answered with no body. */
		success: true;
	};
	'legacy.documents.fileUrl': {
		url?: string | null;
	};
	'legacy.documents.get': {
		connectionId?: string | null | null;
		content?: string | null;
		/** Optional tags this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
		containerTags?: Array<string> | null;
		/** Creation timestamp */
		createdAt?: string | null;
		customId?: string | null;
		/** Unique identifier of the document. */
		id?: string | null;
		metadata?:
			| (
					| (string | number | boolean)
					| null
					| Record<string, SupermemoryJsonValue>
					| Array<SupermemoryJsonValue>
			  )
			| null;
		ogImage?: string | null;
		raw?: SupermemoryJsonValue | null;
		source?: string | null;
		/** Task type: "memory" (default) for full context layer with SuperRAG built in, "superrag" for managed RAG as a service. */
		taskType?: string | null;
		latestRevision?: number | null;
		activeContentUpdateId?: string | null;
		tombstonedAt?: string | null;
		/** Status of the document */
		status?: string | null;
		dreamingStatus?: string | null;
		summary?: string | null;
		title?: string | null;
		/** Type of the document */
		type?: string | null;
		/** Last update timestamp */
		updatedAt?: string | null;
		url?: string | null | null;
		filepath?: string | null;
		/** Memories extracted from this document. Omitted when the document has no memories (e.g. still processing). */
		memories?: Array<{
			id?: string | null;
			memory?: string | null;
			/** Creation timestamp */
			createdAt?: string | null;
			/** Last update timestamp */
			updatedAt?: string | null;
			isLatest?: boolean | null;
			isForgotten?: boolean | null;
			isStatic?: boolean | null;
			isInference?: boolean | null;
			version?: number | null;
			sourceCount?: number | null;
			metadata?:
				| (
						| (string | number | boolean)
						| null
						| Record<string, SupermemoryJsonValue>
						| Array<SupermemoryJsonValue>
				  )
				| null;
			parentMemoryId?: string | null;
			rootMemoryId?: string | null;
		}> | null;
	};
	'legacy.documents.list': {
		memories?: Array<{
			connectionId?: string | null | null;
			/** Optional tags this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
			containerTags?: Array<string> | null;
			/** Creation timestamp */
			createdAt?: string | null;
			customId?: string | null;
			filepath?: string | null;
			/** Unique identifier of the document. */
			id?: string | null;
			metadata?:
				| (
						| (string | number | boolean)
						| null
						| Record<string, SupermemoryJsonValue>
						| Array<SupermemoryJsonValue>
				  )
				| null;
			/** Status of the document */
			status?: string | null;
			summary?: string | null;
			title?: string | null;
			/** Type of the document */
			type?: string | null;
			/** Last update timestamp */
			updatedAt?: string | null;
			url?: string | null | null;
			/** Content of the document (only included when includeContent=true) */
			content?: string | null;
		}> | null;
		pagination?: {
			currentPage?: number | null;
			limit?: number | null;
			totalItems?: number | null;
			totalPages?: number | null;
			/** Whether more items exist after this page */
			hasMore?: boolean | null;
			/** Opaque cursor for the next page. Pass it back as `cursor` with the same filters, sort, order and limit. Null when there are no more items. Cursor requests skip the per-page count and avoid deep offsets. */
			nextCursor?: string | null;
		} | null;
	};
	'legacy.documents.listProcessing': {
		documents?: Array<{
			/** Unique identifier of the document. */
			id?: string | null;
			customId?: string | null;
			title?: string | null;
			/** Type of the document */
			type?: string | null;
			/** Status of the document */
			status?: string | null;
			summary?: string | null;
			connectionId?: string | null | null;
			/** Creation timestamp */
			createdAt?: string | null;
			/** Last update timestamp */
			updatedAt?: string | null;
			metadata?:
				| (
						| (string | number | boolean)
						| null
						| Record<string, SupermemoryJsonValue>
						| Array<SupermemoryJsonValue>
				  )
				| null;
			/** Optional tags this document should be containerized by. This can be an ID for your user, a project ID, or any other identifier you wish to use to group documents. */
			containerTags?: Array<string> | null;
			/** True when the document is not done/failed and has not been updated for 4 hours */
			stuck?: boolean | null;
			/** Stable error code when processing failed, if available */
			errorCode?: string | null;
			/** Human-readable processing error, if available */
			errorMessage?: string | null;
		}> | null;
		/** Total number of processing documents */
		totalCount?: number | null;
		/** Present when `view=all` */
		pagination?: {
			currentPage?: number | null;
			limit?: number | null;
			totalItems?: number | null;
			totalPages?: number | null;
			/** Whether more items exist after this page */
			hasMore?: boolean | null;
			/** Opaque cursor for the next page. Pass it back as `cursor`. Null when there are no more items. */
			nextCursor?: string | null;
		} | null;
	};
	'legacy.documents.search': {
		results?: Array<{
			/** Matching content chunks from the document */
			chunks?: Array<{
				/** Content of the matching chunk */
				content?: string | null;
				/** Whether this chunk is relevant to the query */
				isRelevant?: boolean | null;
				/** Position of this chunk within the source document (0-indexed). Use it to order chunks and to locate surrounding context chunks (isRelevant=false) relative to the matching ones. */
				position?: number | null;
				/** Similarity score for this chunk */
				score?: number | null;
			}> | null;
			/** Document creation date */
			createdAt?: string | null;
			/** ID of the matching document */
			documentId?: string | null;
			/** Document metadata */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Relevance score of the match */
			score?: number | null;
			/** Document summary */
			summary?: string | null;
			/** Full document content (only included when includeFullDocs=true) */
			content?: string | null;
			/** Document title */
			title?: string | null;
			/** Document last update date */
			updatedAt?: string | null;
			/** Document type */
			type?: string | null;
		}> | null;
		timing?: number | null;
		total?: number | null;
	};
	'legacy.documents.update': {
		/** Unique identifier of the document */
		id?: string | null;
		/** Status of the document */
		status?: string | null;
	};
	'legacy.documents.uploadFile': {
		/** Unique identifier of the document */
		id?: string | null;
		/** Status of the document */
		status?: string | null;
	};
	'legacy.memories.create': {
		/** ID of the source document created */
		documentId?: string | null;
		memories?: Array<{
			id?: string | null;
			memory?: string | null;
			isStatic?: boolean | null;
			createdAt?: string | null;
			/** ISO datetime when this memory expires */
			forgetAfter?: string | null;
			/** Reason for scheduled forgetting */
			forgetReason?: string | null;
			/** Arbitrary key-value metadata attached to this memory, or null if none was provided */
			metadata?: Record<string, SupermemoryJsonValue> | null;
		}> | null;
	};
	'legacy.memories.forget': {
		/** ID of the memory that was forgotten */
		id?: string | null;
		/** Indicates the memory was successfully forgotten */
		forgotten?: boolean | null;
	};
	'legacy.memories.forgetMatching': {
		/** Whether this was a preview (no mutation) or a real forget */
		dryRun?: boolean | null;
		/** Number of memories selected / forgotten */
		count?: number | null;
		/** ID tagged on every memory forgotten in this call (null on dryRun) */
		forgetBatchId?: string | null;
		/** The agent's one-line summary of what it did */
		summary?: string | null;
		/** On dryRun: the memories that would be forgotten */
		candidates?: Array<{
			/** Memory ID */
			id?: string | null;
			/** Memory content */
			memory?: string | null;
			/** Similarity score against the forget query */
			score?: number | null;
		}> | null;
		/** On apply: the memories that were forgotten */
		forgotten?: Array<{
			/** Memory ID */
			id?: string | null;
			/** Memory content */
			memory?: string | null;
			/** Similarity score against the forget query */
			score?: number | null;
		}> | null;
	};
	'legacy.memories.list': {
		memoryEntries?: Array<{
			/** Unique identifier for the memory entry */
			id?: string | null;
			/** The memory content/text */
			memory?: string | null;
			/** Version number of this memory */
			version?: number | null;
			/** Whether this is the latest version */
			isLatest?: boolean | null;
			/** Whether this memory has been forgotten */
			isForgotten?: boolean | null;
			/** Whether this is a static profile memory */
			isStatic?: boolean | null;
			/** Whether this is an inferred memory */
			isInference?: boolean | null;
			/** ISO timestamp of creation */
			createdAt?: string | null;
			/** ISO timestamp of last update */
			updatedAt?: string | null;
			/** ID of the space this memory belongs to */
			spaceId?: string | null;
			/** Organization ID */
			orgId?: string | null;
			/** Number of source documents for this memory */
			sourceCount?: number | null;
			/** ID of the parent memory (previous version) */
			parentMemoryId?: string | null;
			/** ID of the root memory (first version) */
			rootMemoryId?: string | null;
			/** ISO timestamp when memory should be forgotten */
			forgetAfter?: string | null;
			/** Reason for forgetting */
			forgetReason?: string | null;
			/** Metadata including temporal context and other information */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Relations to other memories */
			memoryRelations?: Record<string, string> | null;
			/** Temporal context metadata (alias for metadata field) */
			temporalContext?: Record<string, SupermemoryJsonValue> | null;
			/** Previous versions of this memory */
			history?: Array<{
				id?: string | null;
				memory?: string | null;
				version?: number | null;
				createdAt?: string | null;
				updatedAt?: string | null;
				parentMemoryId?: string | null;
				rootMemoryId?: string | null;
				isLatest?: boolean | null;
				isForgotten?: boolean | null;
			}> | null;
			/** IDs of source documents for this memory */
			documentIds?: Array<string> | null;
		}> | null;
		pagination?: {
			currentPage?: number | null;
			limit?: number | null;
			totalItems?: number | null;
			totalPages?: number | null;
			/** Whether more items exist after this page */
			hasMore?: boolean | null;
			/** Opaque cursor for the next page. Pass it back as `cursor` with the same filters, sort, order and limit. Null when there are no more items. Cursor requests skip the per-page count and avoid deep offsets. */
			nextCursor?: string | null;
		} | null;
	};
	'legacy.memories.search': {
		/** Array of matching memory entries and chunks with similarity scores. Contains memory results when searchMode='memories', both memory and chunk results when searchMode='hybrid', or only chunk results when searchMode='documents'. Memory results have 'memory' field, chunk results have 'chunk' field.… */
		results?: Array<{
			/** Memory entry ID or chunk ID */
			id?: string | null;
			/** The memory content (only present for memory results) */
			memory?: string | null;
			/** The chunk content (only present for chunk results from hybrid search) */
			chunk?: string | null;
			/** Memory metadata */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Memory last update date */
			updatedAt?: string | null;
			/** Similarity score between the query and memory entry */
			similarity?: number | null;
			/** Filepath of the source document this memory or chunk came from */
			filepath?: string | null;
			/** Version number of this memory entry */
			version?: number | null;
			/** ID of the root (first version) memory entry this one descends from. Null for memories that have never been superseded. Only present on memory results, not on standalone chunk results. */
			rootMemoryId?: string | null;
			/** Object containing version history (parents/children via updates) and related memories (extends/derives) */
			context?: {
				parents?: Array<{
					/** Related memory ID */
					id?: string | null;
					/** Relation type between this memory and its parent/child */
					relation?: string | null;
					/** Relative version distance from the primary memory (-1 for direct parent, -2 for grand-parent, etc.) */
					version?: number | null;
					/** The contextual memory content */
					memory?: string | null;
					/** Contextual memory metadata */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Contextual memory last update date */
					updatedAt?: string | null;
				}> | null;
				children?: Array<{
					/** Related memory ID */
					id?: string | null;
					/** Relation type between this memory and its parent/child */
					relation?: string | null;
					/** Relative version distance from the primary memory (+1 for direct child, +2 for grand-child, etc.) */
					version?: number | null;
					/** The contextual memory content */
					memory?: string | null;
					/** Contextual memory metadata */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Contextual memory last update date */
					updatedAt?: string | null;
				}> | null;
				related?: Array<{
					/** Related memory ID */
					id?: string | null;
					/** Relation type */
					relation?: string | null;
					/** The related memory content */
					memory?: string | null;
					/** Related memory metadata */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Related memory last update date */
					updatedAt?: string | null;
				}> | null;
			} | null;
			/** Associated documents for this memory entry */
			documents?: Array<{
				/** Document ID */
				id?: string | null;
				/** Document title (only included when documents=true) */
				title?: string | null;
				/** Document type (only included when documents=true) */
				type?: string | null;
				/** Document metadata (only included when documents=true) */
				metadata?: Record<string, SupermemoryJsonValue> | null;
				/** Document summary (only included when summaries=true) */
				summary?: string | null;
				/** Document creation date */
				createdAt?: string | null;
				/** Document last update date */
				updatedAt?: string | null;
			}> | null;
			/** Relevant chunks from associated documents (only included when chunks=true) */
			chunks?: Array<{
				/** Content of the chunk */
				content?: string | null;
				/** Position of chunk in the document (0-indexed) */
				position?: number | null;
				/** ID of the document this chunk belongs to */
				documentId?: string | null;
			}> | null;
			/** Indicates if this memory was created by aggregating multiple source memories */
			isAggregated?: boolean | null;
		}> | null;
		/** Search execution time in milliseconds */
		timing?: number | null;
		/** Total number of results returned */
		total?: number | null;
	};
	'legacy.memories.update': {
		/** ID of the newly created memory version */
		id?: string | null;
		/** The content of the new memory version */
		memory?: string | null;
		/** Version number of this memory entry */
		version?: number | null;
		/** ID of the memory this version updates */
		parentMemoryId?: string | null;
		/** ID of the first memory in this version chain */
		rootMemoryId?: string | null;
		/** When this memory version was created */
		createdAt?: string | null;
		/** When this memory will be auto-forgotten, or null if no expiry */
		forgetAfter?: string | null;
		/** Reason for the scheduled forgetting, or null */
		forgetReason?: string | null;
		/** Arbitrary key-value metadata attached to this memory, or null if none was provided */
		metadata?: Record<string, SupermemoryJsonValue> | null;
	};
	'legacy.profile.buckets': {
		buckets?: Array<{
			key?: string | null;
			description?: string | null;
		}> | null;
	};
	'legacy.profile.get': {
		profile?: {
			/** Static profile information that remains relevant long-term */
			static?: Array<string> | null;
			/** Dynamic profile information (recent memories) */
			dynamic?: Array<string> | null;
			/** Per-bucket memory lists, keyed by bucket key */
			buckets?: Record<string, Array<string>> | null;
		} | null;
		/** Search results if a search query was provided */
		searchResults?: {
			/** Search results for the provided query */
			results?: Array<{
				/** Memory entry ID or chunk ID */
				id?: string | null;
				/** The memory content (only present for memory results) */
				memory?: string | null;
				/** The chunk content (only present for chunk results from hybrid search) */
				chunk?: string | null;
				/** Memory metadata */
				metadata?: Record<string, SupermemoryJsonValue> | null;
				/** Memory last update date */
				updatedAt?: string | null;
				/** Similarity score between the query and memory entry */
				similarity?: number | null;
				/** Filepath of the source document this memory or chunk came from */
				filepath?: string | null;
				/** Version number of this memory entry */
				version?: number | null;
				/** ID of the root (first version) memory entry this one descends from. Null for memories that have never been superseded. Only present on memory results, not on standalone chunk results. */
				rootMemoryId?: string | null;
				/** Object containing version history (parents/children via updates) and related memories (extends/derives) */
				context?: {
					parents?: Array<{
						/** Related memory ID */
						id?: string | null;
						/** Relation type between this memory and its parent/child */
						relation?: string | null;
						/** Relative version distance from the primary memory (-1 for direct parent, -2 for grand-parent, etc.) */
						version?: number | null;
						/** The contextual memory content */
						memory?: string | null;
						/** Contextual memory metadata */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Contextual memory last update date */
						updatedAt?: string | null;
					}> | null;
					children?: Array<{
						/** Related memory ID */
						id?: string | null;
						/** Relation type between this memory and its parent/child */
						relation?: string | null;
						/** Relative version distance from the primary memory (+1 for direct child, +2 for grand-child, etc.) */
						version?: number | null;
						/** The contextual memory content */
						memory?: string | null;
						/** Contextual memory metadata */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Contextual memory last update date */
						updatedAt?: string | null;
					}> | null;
					related?: Array<{
						/** Related memory ID */
						id?: string | null;
						/** Relation type */
						relation?: string | null;
						/** The related memory content */
						memory?: string | null;
						/** Related memory metadata */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Related memory last update date */
						updatedAt?: string | null;
					}> | null;
				} | null;
				/** Associated documents for this memory entry */
				documents?: Array<{
					/** Document ID */
					id?: string | null;
					/** Document title (only included when documents=true) */
					title?: string | null;
					/** Document type (only included when documents=true) */
					type?: string | null;
					/** Document metadata (only included when documents=true) */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Document summary (only included when summaries=true) */
					summary?: string | null;
					/** Document creation date */
					createdAt?: string | null;
					/** Document last update date */
					updatedAt?: string | null;
				}> | null;
				/** Relevant chunks from associated documents (only included when chunks=true) */
				chunks?: Array<{
					/** Content of the chunk */
					content?: string | null;
					/** Position of chunk in the document (0-indexed) */
					position?: number | null;
					/** ID of the document this chunk belongs to */
					documentId?: string | null;
				}> | null;
				/** Indicates if this memory was created by aggregating multiple source memories */
				isAggregated?: boolean | null;
			}> | null;
			/** Total number of search results */
			total?: number | null;
			/** Search timing in milliseconds */
			timing?: number | null;
		} | null;
	};
	'legacy.settings.get': {
		excludeItems?:
			| (
					| (string | number | boolean)
					| null
					| Record<string, SupermemoryJsonValue>
					| Array<SupermemoryJsonValue>
			  )
			| null;
		filterPrompt?: string | null;
		googleDriveClientId?: string | null;
		googleDriveClientSecret?: string | null;
		googleDriveCustomKeyEnabled?: boolean | null;
		includeItems?:
			| (
					| (string | number | boolean)
					| null
					| Record<string, SupermemoryJsonValue>
					| Array<SupermemoryJsonValue>
			  )
			| null;
		notionClientId?: string | null;
		notionClientSecret?: string | null;
		notionCustomKeyEnabled?: boolean | null;
		onedriveClientId?: string | null;
		onedriveClientSecret?: string | null;
		onedriveCustomKeyEnabled?: boolean | null;
		githubClientId?: string | null;
		githubClientSecret?: string | null;
		githubCustomKeyEnabled?: boolean | null;
		shouldLLMFilter?: boolean | null;
		chunkSize?: number | null;
		/** Profile bucket definitions */
		profileBuckets?: Array<{
			/** Stable slug for the bucket, stored on each memory */
			key?: string | null;
			/** What belongs in this bucket — used to guide the ingestion classifier. */
			description?: string | null;
		}> | null;
	};
	'legacy.settings.reset': {
		success?: boolean | null;
		deletedConnections?: number | null;
		deletedDocumentBatches?: number | null;
		deletedDocumentsApprox?: number | null;
		deletedMemoryRows?: number | null;
		deletedExtraSpaces?: number | null;
		clearedDefaultSpaceContext?: boolean | null;
		settingsReset?: boolean | null;
	};
	'legacy.settings.suggestBuckets': {
		suggestions?: Array<{
			/** Stable slug for the bucket, stored on each memory */
			key?: string | null;
			/** What belongs in this bucket — used to guide the ingestion classifier. */
			description?: string | null;
		}> | null;
	};
	'legacy.settings.update': {
		orgId?: string | null;
		orgSlug?: string | null;
		updated?: {
			excludeItems?:
				| (
						| (string | number | boolean)
						| null
						| Record<string, SupermemoryJsonValue>
						| Array<SupermemoryJsonValue>
				  )
				| null;
			filterPrompt?: string | null;
			googleDriveClientId?: string | null;
			googleDriveClientSecret?: string | null;
			googleDriveCustomKeyEnabled?: boolean | null;
			includeItems?:
				| (
						| (string | number | boolean)
						| null
						| Record<string, SupermemoryJsonValue>
						| Array<SupermemoryJsonValue>
				  )
				| null;
			notionClientId?: string | null;
			notionClientSecret?: string | null;
			notionCustomKeyEnabled?: boolean | null;
			onedriveClientId?: string | null;
			onedriveClientSecret?: string | null;
			onedriveCustomKeyEnabled?: boolean | null;
			githubClientId?: string | null;
			githubClientSecret?: string | null;
			githubCustomKeyEnabled?: boolean | null;
			shouldLLMFilter?: boolean | null;
			chunkSize?: number | null;
			/** Profile bucket definitions */
			profileBuckets?: Array<{
				/** Stable slug for the bucket, stored on each memory */
				key?: string | null;
				/** What belongs in this bucket — used to guide the ingestion classifier. */
				description?: string | null;
			}> | null;
		} | null;
	};
	'memories.forget': {
		/** Number of memories matched by this operation */
		count?: number | null;
		/** Per-memory failures for exact-ID requests */
		errors?: Array<{
			/** Requested memory identifier */
			id?: string | null;
			/** Why the memory could not be forgotten */
			error?: string | null;
		}> | null;
		/** Memories selected by the operation, whether previewed or forgotten */
		matches?: Array<{
			/** Stable identifier of the matched memory */
			id?: string | null;
			/** Matched memory text */
			memory?: string | null;
		}> | null;
	};
	'memories.forgetMatching': {
		/** Number of memories matched by this operation */
		count?: number | null;
		/** Per-memory failures for exact-ID requests */
		errors?: Array<{
			/** Requested memory identifier */
			id?: string | null;
			/** Why the memory could not be forgotten */
			error?: string | null;
		}> | null;
		/** Memories selected by the operation, whether previewed or forgotten */
		matches?: Array<{
			/** Stable identifier of the matched memory */
			id?: string | null;
			/** Matched memory text */
			memory?: string | null;
		}> | null;
	};
	'memories.get': {
		/** Stable memory identifier */
		id?: string | null;
		/** Learned fact or context extracted from the document */
		memory?: string | null;
		/** Memory metadata, including temporal context; empty object when none */
		metadata?: Record<string, SupermemoryJsonValue> | null;
		/** Whether the memory belongs to the stable profile section */
		isStatic?: boolean | null;
		/** Whether the memory was inferred rather than explicitly stated */
		isInference?: boolean | null;
		/** Whether this is the newest version in its memory chain */
		isLatest?: boolean | null;
		/** Whether this memory has been excluded from normal recall */
		isForgotten?: boolean | null;
		/** Version number within the memory chain */
		version?: number | null;
		/** Lifecycle timestamps maintained by Supermemory */
		system?: {
			/** ISO 8601 timestamp when this memory version was created */
			createdAt?: string | null;
			/** ISO 8601 timestamp of the latest update to this version */
			updatedAt?: string | null;
		} | null;
		/** Requested extras */
		included?: {
			/** Present when include has related */
			related?: {
				/** Earlier versions this memory updates */
				parents?: Array<{
					/** Related memory ID */
					id?: string | null;
					/** How this memory is connected to the matched memory */
					relation?: string | null;
					/** Version number within the related memory's history */
					version?: number | null;
					/** Related learned fact or context */
					memory?: string | null;
					/** Public metadata associated with the related memory */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Lifecycle details for the related memory */
					system?: {
						/** ISO 8601 timestamp of the related memory's latest update */
						updatedAt?: string | null;
					} | null;
					/** Source document; present when include has both related and documents */
					document?: {
						/** Source document identifier */
						id?: string | null;
						/** Source document title */
						title?: string | null;
						/** Detected source or content type */
						type?: string | null;
						/** Public metadata attached to the source document */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Generated summary of the source document */
						summary?: string | null;
						/** Lifecycle timestamps maintained by Supermemory */
						system?: {
							/** ISO 8601 timestamp when the source document was created */
							createdAt?: string | null;
							/** ISO 8601 timestamp of the source document's latest update */
							updatedAt?: string | null;
						} | null;
					} | null;
				}> | null;
				/** Newer versions that update this memory */
				children?: Array<{
					/** Related memory ID */
					id?: string | null;
					/** How this memory is connected to the matched memory */
					relation?: string | null;
					/** Version number within the related memory's history */
					version?: number | null;
					/** Related learned fact or context */
					memory?: string | null;
					/** Public metadata associated with the related memory */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Lifecycle details for the related memory */
					system?: {
						/** ISO 8601 timestamp of the related memory's latest update */
						updatedAt?: string | null;
					} | null;
					/** Source document; present when include has both related and documents */
					document?: {
						/** Source document identifier */
						id?: string | null;
						/** Source document title */
						title?: string | null;
						/** Detected source or content type */
						type?: string | null;
						/** Public metadata attached to the source document */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Generated summary of the source document */
						summary?: string | null;
						/** Lifecycle timestamps maintained by Supermemory */
						system?: {
							/** ISO 8601 timestamp when the source document was created */
							createdAt?: string | null;
							/** ISO 8601 timestamp of the source document's latest update */
							updatedAt?: string | null;
						} | null;
					} | null;
				}> | null;
				/** Memories connected by extends or derives */
				siblings?: Array<{
					/** Related memory ID */
					id?: string | null;
					/** How this memory is connected to the matched memory */
					relation?: string | null;
					/** Version number within the related memory's history */
					version?: number | null;
					/** Related learned fact or context */
					memory?: string | null;
					/** Public metadata associated with the related memory */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Lifecycle details for the related memory */
					system?: {
						/** ISO 8601 timestamp of the related memory's latest update */
						updatedAt?: string | null;
					} | null;
					/** Source document; present when include has both related and documents */
					document?: {
						/** Source document identifier */
						id?: string | null;
						/** Source document title */
						title?: string | null;
						/** Detected source or content type */
						type?: string | null;
						/** Public metadata attached to the source document */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Generated summary of the source document */
						summary?: string | null;
						/** Lifecycle timestamps maintained by Supermemory */
						system?: {
							/** ISO 8601 timestamp when the source document was created */
							createdAt?: string | null;
							/** ISO 8601 timestamp of the source document's latest update */
							updatedAt?: string | null;
						} | null;
					} | null;
				}> | null;
			} | null;
			/** Source document; present when include has documents and one exists */
			document?: {
				/** Source document identifier */
				id?: string | null;
				/** Source document title */
				title?: string | null;
				/** Detected source or content type */
				type?: string | null;
				/** Public metadata attached to the source document */
				metadata?: Record<string, SupermemoryJsonValue> | null;
				/** Generated summary of the source document */
				summary?: string | null;
				/** Lifecycle timestamps maintained by Supermemory */
				system?: {
					/** ISO 8601 timestamp when the source document was created */
					createdAt?: string | null;
					/** ISO 8601 timestamp of the source document's latest update */
					updatedAt?: string | null;
				} | null;
			} | null;
		} | null;
	};
	'namespaces.delete':
		| (
				| {
						/** The namespace and its content are gone */
						status?: string | null;
						/** Deleted namespace identifier */
						namespace?: string | null;
						/** Number of documents permanently removed */
						deletedDocumentsCount?: number | null;
						/** Number of memories permanently removed */
						deletedMemoriesCount?: number | null;
				  }
				| {
						/** The move continues asynchronously after this response */
						status?: string | null;
						/** Identifier used to trace the asynchronous move operation */
						operationId?: string | null;
						/** Source namespace being removed */
						namespace?: string | null;
						/** Destination namespace receiving the content */
						moveTo?: string | null;
				  }
		  )
		| {
				/** The move continues asynchronously after this response */
				status?: string | null;
				/** Identifier used to trace the asynchronous move operation */
				operationId?: string | null;
				/** Source namespace being removed */
				namespace?: string | null;
				/** Destination namespace receiving the content */
				moveTo?: string | null;
		  };
	'namespaces.get': {
		/** Namespace identifier used in API paths */
		namespace?: string | null;
		/** Background that helps Supermemory interpret documents and form better memories in this namespace */
		supportingContext?: string | null;
		/** Namespace lifecycle timestamps */
		system?: {
			/** ISO 8601 timestamp when the namespace was created */
			createdAt?: string | null;
			/** ISO 8601 timestamp of the latest change to the namespace's settings, documents, or memories */
			updatedAt?: string | null;
		} | null;
	};
	'namespaces.list': {
		/** Namespaces on this page, newest first */
		namespaces?: Array<{
			/** Internal identifier for the namespace */
			id?: string | null;
			/** Namespace identifier used in API paths */
			namespace?: string | null;
			/** Number of active source documents in the namespace */
			documentCount?: number | null;
			/** Number of current, recallable memories in the namespace */
			memoryCount?: number | null;
			/** Human-readable purpose or scope of the namespace */
			description?: string | null;
			/** Namespace lifecycle timestamps */
			system?: {
				/** ISO 8601 timestamp when the namespace was created */
				createdAt?: string | null;
				/** ISO 8601 timestamp of the latest change to the namespace's settings, documents, or memories */
				updatedAt?: string | null;
			} | null;
		}> | null;
		/** Pagination metadata */
		pagination?: {
			currentPage?: number | null;
			limit?: number | null;
			totalItems?: number | null;
			totalPages?: number | null;
			/** Whether more items exist after this page */
			hasMore?: boolean | null;
			/** Opaque cursor for the next page. Pass it back as `cursor`. Null when there are no more items. */
			nextCursor?: string | null;
		} | null;
	};
	'namespaces.update': {
		/** Namespace identifier used in API paths */
		namespace?: string | null;
		/** Background that helps Supermemory interpret documents and form better memories in this namespace */
		supportingContext?: string | null;
		/** Namespace lifecycle timestamps */
		system?: {
			/** ISO 8601 timestamp when the namespace was created */
			createdAt?: string | null;
			/** ISO 8601 timestamp of the latest change to the namespace's settings, documents, or memories */
			updatedAt?: string | null;
		} | null;
	};
	'organization.get': {
		/** Shared background that helps Supermemory interpret content consistently across every namespace */
		organizationalContext?: string | null;
		/** Number of namespaces in the organization */
		namespaceCount?: number | null;
	};
	'organization.update': {
		/** Shared background that helps Supermemory interpret content consistently across every namespace */
		organizationalContext?: string | null;
		/** Number of namespaces in the organization */
		namespaceCount?: number | null;
	};
	'profiles.buckets.delete': {
		/** Effective bucket definitions keyed by name. Includes organization buckets and namespace-owned additions. */
		buckets?: Record<string, string> | null;
	};
	'profiles.buckets.get': {
		/** Effective bucket definitions keyed by name. Includes organization buckets and namespace-owned additions. */
		buckets?: Record<string, string> | null;
	};
	'profiles.buckets.set': {
		/** Effective bucket definitions keyed by name. Includes organization buckets and namespace-owned additions. */
		buckets?: Record<string, string> | null;
	};
	'profiles.get': {
		/** Continuously maintained understanding of the subject represented by this namespace */
		profile?: {
			/** Durable facts that define the subject and rarely change, such as identity or long-term preferences */
			static?: Array<{
				/** Memory ID, or an aggregated_-prefixed ID for a summary synthesized from several memories */
				id?: string | null;
				/** Memory text */
				memory?: string | null;
			}> | null;
			/** Recent or evolving context, such as current goals, projects, and active interests */
			dynamic?: Array<{
				/** Memory ID, or an aggregated_-prefixed ID for a summary synthesized from several memories */
				id?: string | null;
				/** Memory text */
				memory?: string | null;
			}> | null;
			/** Custom profile sections keyed by bucket name, with the memories currently assigned to each bucket */
			buckets?: Record<
				string,
				Array<{
					/** Memory ID, or an aggregated_-prefixed ID for a summary synthesized from several memories */
					id?: string | null;
					/** Memory text */
					memory?: string | null;
				}>
			> | null;
		} | null;
	};
	'resources.list': {
		/** Documents on this page; empty when a different resource type is requested */
		documents?: Array<{
			/** Stable document identifier */
			id?: string | null;
			/** Extracted or caller-provided document title */
			title?: string | null;
			/** Detected source or content type */
			type?: string | null;
			/** Last published extracted text when include.content is true; null before the first content publication */
			content?: string | null;
			/** Generated summary of the document, when available */
			summary?: string | null;
			/** Public metadata attached to the document */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Source URL or uploaded file URL when available */
			url?: string | null;
			/** Processing status, lifecycle timestamps, and storage path maintained by Supermemory */
			system?: {
				/** Current extraction and memory-processing status */
				status?: string | null;
				/** Memory generation state, separate from status. dreaming while memories for the latest content are queued, being generated, or waiting for a retry after a failure; done once they are generated or when none are needed. Under dynamic dreaming, status can reach done minutes before dreamingStatus does. */
				dreamingStatus?: string | null;
				/** Number of live memories linked to this document in the requested namespace */
				memoryCount?: number | null;
				/** ISO 8601 timestamp when the document was created */
				createdAt?: string | null;
				/** ISO 8601 timestamp of the latest document update */
				updatedAt?: string | null;
			} | null;
		}> | null;
		/** Chunks on this page; empty when a different resource type is requested */
		chunks?: Array<{
			/** Stable chunk identifier */
			id?: string | null;
			/** Zero-based order within the document */
			position?: number | null;
			/** Chunk text used for retrieval */
			content?: string | null;
			/** Chunk content type */
			type?: string | null;
			/** Chunk metadata; empty object when none */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Lifecycle timestamps maintained by Supermemory */
			system?: {
				/** ISO 8601 timestamp when the chunk was created */
				createdAt?: string | null;
			} | null;
			/** ID of the chunk's parent document */
			documentId?: string | null;
		}> | null;
		/** Memories on this page; empty when a different resource type is requested */
		memories?: Array<{
			/** Stable memory identifier */
			id?: string | null;
			/** Learned fact or context extracted from the document */
			memory?: string | null;
			/** Memory metadata, including temporal context; empty object when none */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Whether the memory belongs to the stable profile section */
			isStatic?: boolean | null;
			/** Whether the memory was inferred rather than explicitly stated */
			isInference?: boolean | null;
			/** Whether this is the newest version in its memory chain */
			isLatest?: boolean | null;
			/** Whether this memory has been excluded from normal recall */
			isForgotten?: boolean | null;
			/** Version number within the memory chain */
			version?: number | null;
			/** Lifecycle timestamps maintained by Supermemory */
			system?: {
				/** ISO 8601 timestamp when this memory version was created */
				createdAt?: string | null;
				/** ISO 8601 timestamp of the latest update to this version */
				updatedAt?: string | null;
			} | null;
		}> | null;
		/** Page metadata for the selected resource collection */
		pagination?: {
			/** Current one-based page number */
			currentPage?: number | null;
			/** Maximum resources returned per page */
			limit?: number | null;
			/** Total resources matching the request */
			totalItems?: number | null;
			/** Total pages available at the selected limit */
			totalPages?: number | null;
			/** Whether more items exist after this page */
			hasMore?: boolean | null;
			/** Opaque cursor for the next page. Pass it back as `cursor` with the same filters, sort, order and limit. Null when there are no more items. Cursor requests skip the per-page count and avoid deep offsets. */
			nextCursor?: string | null;
		} | null;
	};
	'search.query': {
		/** Ranked memories and source chunks matching the query */
		results?: Array<{
			/** Stable identifier for the matching result */
			id?: string | null;
			/** Learned fact or context returned by memory search (only present for memory results) */
			memory?: string | null;
			/** Source passage returned by chunk search (only present for chunk results from hybrid search) */
			chunk?: string | null;
			/** Public metadata attached to the result */
			metadata?: Record<string, SupermemoryJsonValue> | null;
			/** Normalized relevance score used to rank the result, from 0 to 1 */
			similarity?: number | null;
			/** Whether the memory is its latest version; false for recalled forgotten memories */
			isLatest?: boolean | null;
			/** Whether the memory was inferred rather than stated directly; false for chunks */
			isInference?: boolean | null;
			/** Lifecycle and filesystem details for the result */
			system?: {
				/** ISO 8601 timestamp of the latest result update */
				updatedAt?: string | null;
				/** ISO 8601 timestamp when the result was first created */
				createdAt?: string | null;
			} | null;
			/** Requested supporting context for the result */
			included?: {
				/** Memory relationships included when requested */
				related?: {
					/** Earlier memories this result updates or derives from */
					parents?: Array<{
						/** Related memory ID */
						id?: string | null;
						/** How this memory is connected to the matched memory */
						relation?: string | null;
						/** Version number within the related memory's history */
						version?: number | null;
						/** Related learned fact or context */
						memory?: string | null;
						/** Public metadata associated with the related memory */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Lifecycle details for the related memory */
						system?: {
							/** ISO 8601 timestamp of the related memory's latest update */
							updatedAt?: string | null;
						} | null;
					}> | null;
					/** Newer memories that update or extend this result */
					children?: Array<{
						/** Related memory ID */
						id?: string | null;
						/** How this memory is connected to the matched memory */
						relation?: string | null;
						/** Version number within the related memory's history */
						version?: number | null;
						/** Related learned fact or context */
						memory?: string | null;
						/** Public metadata associated with the related memory */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Lifecycle details for the related memory */
						system?: {
							/** ISO 8601 timestamp of the related memory's latest update */
							updatedAt?: string | null;
						} | null;
					}> | null;
					/** Other memories derived from related context */
					siblings?: Array<{
						/** Related memory ID */
						id?: string | null;
						/** How this memory is connected to the matched memory */
						relation?: string | null;
						/** Version number within the related memory's history */
						version?: number | null;
						/** Related learned fact or context */
						memory?: string | null;
						/** Public metadata associated with the related memory */
						metadata?: Record<string, SupermemoryJsonValue> | null;
						/** Lifecycle details for the related memory */
						system?: {
							/** ISO 8601 timestamp of the related memory's latest update */
							updatedAt?: string | null;
						} | null;
					}> | null;
				} | null;
				/** Source document included when requested and available */
				document?: {
					/** Source document identifier */
					id?: string | null;
					/** Source document title */
					title?: string | null;
					/** Detected source or content type */
					type?: string | null;
					/** Public metadata attached to the source document */
					metadata?: Record<string, SupermemoryJsonValue> | null;
					/** Generated summary of the source document */
					summary?: string | null;
					/** Lifecycle timestamps maintained by Supermemory */
					system?: {
						/** ISO 8601 timestamp when the source document was created */
						createdAt?: string | null;
						/** ISO 8601 timestamp of the source document's latest update */
						updatedAt?: string | null;
					} | null;
				} | null;
			} | null;
		}> | null;
		/** Server-side search duration in milliseconds */
		searchTime?: number | null;
	};
};
