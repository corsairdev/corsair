import { makePdfcoRequest } from '../client';
import type {
	AccountBalanceInput,
	AccountBalanceResponse,
	BarcodeGenerateInput,
	BarcodeGenerateResponse,
	FileUploadBase64Input,
	FileUploadBase64Response,
	JobCheckInput,
	JobCheckResponse,
	PdfcoEndpointContext,
} from './types';
import { PdfcoEndpointInputSchemas, PdfcoEndpointOutputSchemas } from './types';

export async function fileUploadBase64(
	ctx: PdfcoEndpointContext,
	input: FileUploadBase64Input,
): Promise<FileUploadBase64Response> {
	const args = PdfcoEndpointInputSchemas.fileUploadBase64.parse(input);
	return await makePdfcoRequest<FileUploadBase64Response>(
		'/v1/file/upload/base64',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.fileUploadBase64,
			body: {
				file: args.file,
				name: args.name,
				expiration: args.expiration,
			},
		},
	);
}

export async function jobCheck(
	ctx: PdfcoEndpointContext,
	input: JobCheckInput,
): Promise<JobCheckResponse> {
	const args = PdfcoEndpointInputSchemas.jobCheck.parse(input);
	return await makePdfcoRequest<JobCheckResponse>('/v1/job/check', ctx.key, {
		schema: PdfcoEndpointOutputSchemas.jobCheck,
		body: {
			jobid: args.jobId,
		},
	});
}

export async function barcodeGenerate(
	ctx: PdfcoEndpointContext,
	input: BarcodeGenerateInput,
): Promise<BarcodeGenerateResponse> {
	const args = PdfcoEndpointInputSchemas.barcodeGenerate.parse(input);
	return await makePdfcoRequest<BarcodeGenerateResponse>(
		'/v1/barcode/generate',
		ctx.key,
		{
			schema: PdfcoEndpointOutputSchemas.barcodeGenerate,
			body: {
				type: args.type,
				value: args.value,
				name: args.name,
				inline: args.inline,
				decorationImage: args.decorationImage,
				async: args.async,
				expiration: args.expiration,
				profiles: args.profiles,
			},
		},
	);
}

export async function accountBalance(
	ctx: PdfcoEndpointContext,
	input: AccountBalanceInput,
): Promise<AccountBalanceResponse> {
	const args = PdfcoEndpointInputSchemas.accountBalance.parse(input);
	return await makePdfcoRequest<AccountBalanceResponse>(
		'/v1/account/credit/balance',
		ctx.key,
		{
			method: 'GET',
			schema: PdfcoEndpointOutputSchemas.accountBalance,
		},
	);
}
