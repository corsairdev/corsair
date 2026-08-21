import {
	downloadStudioByAI21LabsFile,
	makeStudioByAI21LabsRequest,
} from '../client';
import type { StudioByAI21LabsEndpoints } from '../index';

export const checkCanIframe: StudioByAI21LabsEndpoints['checkCanIframe'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'iframe/check',
			input,
		);
		return response as any;
	};

export const checkKirshGrantCompliance: StudioByAI21LabsEndpoints['checkKirshGrantCompliance'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'kirsh/grant/compliance/check',
			input,
		);
		return response as any;
	};

export const compareText: StudioByAI21LabsEndpoints['compareText'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'POST',
		'compare-text',
		input,
	);
	return response as any;
};

export const createAftersalesPartsBatch: StudioByAI21LabsEndpoints['createAftersalesPartsBatch'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'aftersales/parts-classification/batch',
			input,
		);
		return response as any;
	};

export const createDemo: StudioByAI21LabsEndpoints['createDemo'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'POST',
		'demos',
		input,
	);
	return response as any;
};

export const createKirshGrantCompliancePreview: StudioByAI21LabsEndpoints['createKirshGrantCompliancePreview'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'kirsh/grant/compliance/preview',
			input,
		);
		return response as any;
	};

export const createMcpStorage: StudioByAI21LabsEndpoints['createMcpStorage'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'mcp-storage',
			input,
		);
		return response as any;
	};

export const deleteDemo: StudioByAI21LabsEndpoints['deleteDemo'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'DELETE',
		`demos/${input.id}`,
		input,
	);
	return response as any;
};

export const deleteMcpStorage: StudioByAI21LabsEndpoints['deleteMcpStorage'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'DELETE',
			`mcp-storage/${input.id}`,
			input,
		);
		return response as any;
	};

export const deleteSecret: StudioByAI21LabsEndpoints['deleteSecret'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'DELETE',
		`secrets/${input.id}`,
		input,
	);
	return response as any;
};

export const deleteWebsiteConnector: StudioByAI21LabsEndpoints['deleteWebsiteConnector'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'DELETE',
			`website-connectors/${input.id}`,
			input,
		);
		return response as any;
	};

export const downloadModifiedDocument: StudioByAI21LabsEndpoints['downloadModifiedDocument'] =
	async (ctx, input) => {
		const response = await downloadStudioByAI21LabsFile(
			`documents/${input.documentId}/download`,
			ctx.key,
		);
		return response as any;
	};

export const generateRequirements: StudioByAI21LabsEndpoints['generateRequirements'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'requirements/generate',
			input,
		);
		return response as any;
	};

export const generateThreadName: StudioByAI21LabsEndpoints['generateThreadName'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'threads/generate-name',
			input,
		);
		return response as any;
	};

export const getBatchPredictionStatus: StudioByAI21LabsEndpoints['getBatchPredictionStatus'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			`batch-predictions/${input.id}`,
		);
		return response as any;
	};

export const getDemo: StudioByAI21LabsEndpoints['getDemo'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		`demos/${input.id}`,
	);
	return response as any;
};

export const getLibraryBatchStatus: StudioByAI21LabsEndpoints['getLibraryBatchStatus'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			`library/batches/${input.id}/status`,
		);
		return response as any;
	};

export const getMcpStorage: StudioByAI21LabsEndpoints['getMcpStorage'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		`mcp-storage/${input.id}`,
	);
	return response as any;
};

export const getOutputExplanation: StudioByAI21LabsEndpoints['getOutputExplanation'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			`output-explanations/${input.id}`,
		);
		return response as any;
	};

export const getWebsiteConnectorById: StudioByAI21LabsEndpoints['getWebsiteConnectorById'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			`website-connectors/${input.id}`,
		);
		return response as any;
	};

export const getWebsiteConnectorStatus: StudioByAI21LabsEndpoints['getWebsiteConnectorStatus'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			`website-connectors/${input.id}/status`,
		);
		return response as any;
	};

export const getWebsiteConnectorUrlStatus: StudioByAI21LabsEndpoints['getWebsiteConnectorUrlStatus'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			`website-connectors/${input.id}/urls/${input.urlId}/status`,
		);
		return response as any;
	};

export const grantKirshMetadata: StudioByAI21LabsEndpoints['grantKirshMetadata'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'kirsh/grant/metadata',
			input,
		);
		return response as any;
	};

export const ingestWebsiteConnector: StudioByAI21LabsEndpoints['ingestWebsiteConnector'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			`website-connectors/${input.id}/ingest`,
			input,
		);
		return response as any;
	};

export const ingestWebsiteConnectorUrl: StudioByAI21LabsEndpoints['ingestWebsiteConnectorUrl'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			`website-connectors/${input.id}/urls/${input.urlId}/ingest`,
			input,
		);
		return response as any;
	};

export const kirshGrantMetadataPreview: StudioByAI21LabsEndpoints['kirshGrantMetadataPreview'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			'kirsh/grant/metadata/preview',
			input,
		);
		return response as any;
	};

export const listDemos: StudioByAI21LabsEndpoints['listDemos'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		'demos',
		input,
	);
	return response as any;
};

export const listMcpStorage: StudioByAI21LabsEndpoints['listMcpStorage'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			'mcp-storage',
			input,
		);
		return response as any;
	};

export const listSecrets: StudioByAI21LabsEndpoints['listSecrets'] = async (
	ctx,
	input,
) => {
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'GET',
		'secrets',
		input,
	);
	return response as any;
};

export const listWebsiteConnectors: StudioByAI21LabsEndpoints['listWebsiteConnectors'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'GET',
			'website-connectors',
			input,
		);
		return response as any;
	};

export const retryIngestWebsite: StudioByAI21LabsEndpoints['retryIngestWebsite'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			`website-connectors/${input.id}/ingest/retry`,
			input,
		);
		return response as any;
	};

export const syncWebsiteConnector: StudioByAI21LabsEndpoints['syncWebsiteConnector'] =
	async (ctx, input) => {
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'POST',
			`website-connectors/${input.id}/sync`,
			input,
		);
		return response as any;
	};

export const updateDemo: StudioByAI21LabsEndpoints['updateDemo'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'PUT',
		`demos/${id}`,
		body,
	);
	return response as any;
};

export const updateMcpStorage: StudioByAI21LabsEndpoints['updateMcpStorage'] =
	async (ctx, input) => {
		const { id, ...body } = input;
		const response = await makeStudioByAI21LabsRequest(
			ctx,
			'PUT',
			`mcp-storage/${id}`,
			body,
		);
		return response as any;
	};

export const updateSecret: StudioByAI21LabsEndpoints['updateSecret'] = async (
	ctx,
	input,
) => {
	const { id, ...body } = input;
	const response = await makeStudioByAI21LabsRequest(
		ctx,
		'PUT',
		`secrets/${id}`,
		body,
	);
	return response as any;
};
