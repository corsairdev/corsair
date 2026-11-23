import type { CanvaEndpoints } from '../index';
import { callCanva, defined, seg } from './shared';
import type { CanvaEndpointOutputs } from './types';

// Canva serves these only to apps registered as Print Partners.

export const createDesign: CanvaEndpoints['printPartnerCreateDesign'] = async (
	ctx,
	input,
) =>
	callCanva<CanvaEndpointOutputs['printPartnerCreateDesign']>(
		ctx,
		'printPartner.createDesign',
		{ ...input },
		'v1/print-partner/designs',
		{ method: 'POST', body: defined({ ...input }) },
	);

export const getDesign: CanvaEndpoints['printPartnerGetDesign'] = async (
	ctx,
	input,
) => {
	const { designId, ...query } = input;
	return callCanva<CanvaEndpointOutputs['printPartnerGetDesign']>(
		ctx,
		'printPartner.getDesign',
		{ ...input },
		`v1/print-partner/designs/${seg(designId)}`,
		{ method: 'GET', query: defined(query) },
	);
};

export const createExport: CanvaEndpoints['printPartnerCreateExport'] = async (
	ctx,
	input,
) =>
	callCanva<CanvaEndpointOutputs['printPartnerCreateExport']>(
		ctx,
		'printPartner.createExport',
		{ ...input },
		'v1/print-partner/exports',
		{ method: 'POST', body: defined({ ...input }) },
	);
