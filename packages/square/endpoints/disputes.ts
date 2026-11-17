import type { SquareEndpoints } from '../index';
import { buildUploadForm, callSquare, decodeBase64 } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/disputes/{dispute_id}/accept (AcceptDispute). */
export const accept: SquareEndpoints['disputesAccept'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.disputesAccept.parse(rawInput);
	return callSquare(ctx, '/v2/disputes/{dispute_id}/accept', {
		method: 'POST',
		path: { dispute_id: input.dispute_id },
		output: SquareEndpointOutputSchemas.disputesAccept,
		event: 'disputes.accept',
		logged: { dispute_id: input.dispute_id },
	});
};

/**
 * POST /v2/disputes/{dispute_id}/evidence-files (CreateDisputeEvidenceFile) as multipart/form-data: a JSON
 * `request` form field and the file in `image_file`. The file arrives as base64
 * and malformed base64 is refused before anything is sent.
 */
export const createEvidenceFile: SquareEndpoints['disputesCreateEvidenceFile'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.disputesCreateEvidenceFile.parse(rawInput);
		const { dispute_id, file_base64, filename, ...request } = input;
		const bytes = decodeBase64(file_base64, 'file_base64');

		const formData = buildUploadForm(request, {
			bytes,
			contentType: request.content_type,
			filename,
		});

		return callSquare(ctx, '/v2/disputes/{dispute_id}/evidence-files', {
			method: 'POST',
			formData,
			path: { dispute_id: input.dispute_id },
			output: SquareEndpointOutputSchemas.disputesCreateEvidenceFile,
			event: 'disputes.createEvidenceFile',
			logged: { dispute_id: input.dispute_id, bytes: bytes.length },
		});
	};

/** POST /v2/disputes/{dispute_id}/evidence-text (CreateDisputeEvidenceText). */
export const createEvidenceText: SquareEndpoints['disputesCreateEvidenceText'] =
	async (ctx, rawInput) => {
		const input =
			SquareEndpointInputSchemas.disputesCreateEvidenceText.parse(rawInput);
		const { dispute_id, ...body } = input;
		return callSquare(ctx, '/v2/disputes/{dispute_id}/evidence-text', {
			method: 'POST',
			body,
			path: { dispute_id },
			output: SquareEndpointOutputSchemas.disputesCreateEvidenceText,
			event: 'disputes.createEvidenceText',
			logged: { dispute_id },
		});
	};

/** DELETE /v2/disputes/{dispute_id}/evidence/{evidence_id} (DeleteDisputeEvidence). */
export const deleteEvidence: SquareEndpoints['disputesDeleteEvidence'] = async (
	ctx,
	rawInput,
) => {
	const input =
		SquareEndpointInputSchemas.disputesDeleteEvidence.parse(rawInput);
	return callSquare(ctx, '/v2/disputes/{dispute_id}/evidence/{evidence_id}', {
		method: 'DELETE',
		path: { dispute_id: input.dispute_id, evidence_id: input.evidence_id },
		output: SquareEndpointOutputSchemas.disputesDeleteEvidence,
		event: 'disputes.deleteEvidence',
		logged: { dispute_id: input.dispute_id, evidence_id: input.evidence_id },
	});
};

/** GET /v2/disputes/{dispute_id}/evidence/{evidence_id} (RetrieveDisputeEvidence). */
export const getEvidence: SquareEndpoints['disputesGetEvidence'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.disputesGetEvidence.parse(rawInput);
	return callSquare(ctx, '/v2/disputes/{dispute_id}/evidence/{evidence_id}', {
		path: { dispute_id: input.dispute_id, evidence_id: input.evidence_id },
		output: SquareEndpointOutputSchemas.disputesGetEvidence,
		event: 'disputes.getEvidence',
		logged: { dispute_id: input.dispute_id, evidence_id: input.evidence_id },
	});
};

/** GET /v2/disputes/{dispute_id}/evidence (ListDisputeEvidence). */
export const listEvidence: SquareEndpoints['disputesListEvidence'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.disputesListEvidence.parse(rawInput);
	const { dispute_id, ...query } = input;
	return callSquare(ctx, '/v2/disputes/{dispute_id}/evidence', {
		query,
		path: { dispute_id },
		output: SquareEndpointOutputSchemas.disputesListEvidence,
		event: 'disputes.listEvidence',
		logged: { dispute_id },
	});
};

/** GET /v2/disputes/{dispute_id} (RetrieveDispute). */
export const get: SquareEndpoints['disputesGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.disputesGet.parse(rawInput);
	return callSquare(ctx, '/v2/disputes/{dispute_id}', {
		path: { dispute_id: input.dispute_id },
		output: SquareEndpointOutputSchemas.disputesGet,
		event: 'disputes.get',
		logged: { dispute_id: input.dispute_id },
	});
};

/** POST /v2/disputes/{dispute_id}/submit-evidence (SubmitEvidence). */
export const submitEvidence: SquareEndpoints['disputesSubmitEvidence'] = async (
	ctx,
	rawInput,
) => {
	const input =
		SquareEndpointInputSchemas.disputesSubmitEvidence.parse(rawInput);
	return callSquare(ctx, '/v2/disputes/{dispute_id}/submit-evidence', {
		method: 'POST',
		path: { dispute_id: input.dispute_id },
		output: SquareEndpointOutputSchemas.disputesSubmitEvidence,
		event: 'disputes.submitEvidence',
		logged: { dispute_id: input.dispute_id },
	});
};

/** GET /v2/disputes (ListDisputes). */
export const list: SquareEndpoints['disputesList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.disputesList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/disputes', {
		query: input,
		output: SquareEndpointOutputSchemas.disputesList,
		event: 'disputes.list',
	});
};
