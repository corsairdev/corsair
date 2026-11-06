import { asRecord } from 'corsair/core';
import type { ESignaturesContext, ESignaturesEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ESignaturesEndpointInputSchemas as Inputs,
	ESignaturesEndpointOutputSchemas as Outputs,
} from './types';

// unknown: the response body is untyped; call() validates whatever this
// extracts. Writes carry their status at the top level, and the contract
// sits under `data.contract`.
function contractOf(raw: unknown): unknown {
	return asRecord(asRecord(raw)?.data)?.contract;
}

export const create: ESignaturesEndpoints['contractsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contracts.create',
			input: Inputs.contractsCreate,
			output: Outputs.contractsCreate,
		},
		input,
		(body) => ({
			method: 'POST',
			path: '/contracts',
			body,
		}),
		{
			shape: (raw) => ({
				status: asRecord(raw)?.status,
				contract: contractOf(raw),
			}),
			log: ({ template_id, signers, test }, result) => ({
				templateId: template_id,
				signers: signers.length,
				test: test === 'yes',
				contractId: result.contract.id ?? undefined,
				contractStatus: result.contract.status ?? undefined,
			}),
		},
	);

export const get: ESignaturesEndpoints['contractsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contracts.get',
			input: Inputs.contractsGet,
			output: Outputs.contractsGet,
		},
		input,
		({ contract_id }) => ({
			method: 'GET',
			path: `/contracts/${segment(contract_id)}`,
		}),
		{
			shape: (raw) => ({ contract: contractOf(raw) }),
			log: ({ contract_id }) => ({ contractId: contract_id }),
		},
	);

export const withdraw: ESignaturesEndpoints['contractsWithdraw'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contracts.withdraw',
			input: Inputs.contractsWithdraw,
			output: Outputs.contractsWithdraw,
		},
		input,
		({ contract_id }) => ({
			method: 'POST',
			path: `/contracts/${segment(contract_id)}/withdraw`,
		}),
		{
			log: ({ contract_id }) => ({ contractId: contract_id }),
		},
	);

export const sendDraft: ESignaturesEndpoints['contractsSendDraft'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contracts.sendDraft',
			input: Inputs.contractsSendDraft,
			output: Outputs.contractsSendDraft,
		},
		input,
		({ contract_id }) => ({
			method: 'POST',
			path: `/contracts/${segment(contract_id)}/send_draft`,
		}),
		{
			log: ({ contract_id }) => ({ contractId: contract_id }),
		},
	);

export const addSigner: ESignaturesEndpoints['contractsAddSigner'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contracts.addSigner',
			input: Inputs.contractsAddSigner,
			output: Outputs.contractsAddSigner,
		},
		input,
		({ contract_id, signer }) => ({
			method: 'POST',
			path: `/contracts/${segment(contract_id)}/signers`,
			body: signer,
		}),
		{
			log: ({ contract_id }) => ({ contractId: contract_id }),
		},
	);

export const updateSigner: ESignaturesEndpoints['contractsUpdateSigner'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contracts.updateSigner',
			input: Inputs.contractsUpdateSigner,
			output: Outputs.contractsUpdateSigner,
		},
		input,
		({ contract_id, signer_id, signer }) => ({
			method: 'POST',
			path: `/contracts/${segment(contract_id)}/signers/${segment(signer_id)}`,
			body: signer,
		}),
		{
			log: ({ contract_id, signer_id }) => ({
				contractId: contract_id,
				signerId: signer_id,
			}),
		},
	);

/** Resending a sign request and deleting a signer share one input and answer. */
function signerAction(
	ctx: ESignaturesContext,
	action: 'resendToSigner' | 'deleteSigner',
	// unknown: raw caller input, parsed by call().
	input: unknown,
) {
	return call(
		ctx,
		{
			event: `contracts.${action}`,
			input: Inputs.contractsResendToSigner,
			output: Outputs.contractsResendToSigner,
		},
		input,
		({ contract_id, signer_id }) => ({
			method: 'POST',
			path: `/contracts/${segment(contract_id)}/signers/${segment(signer_id)}/${
				action === 'resendToSigner' ? 'send_contract' : 'delete'
			}`,
		}),
		{
			log: ({ contract_id, signer_id }) => ({
				contractId: contract_id,
				signerId: signer_id,
			}),
		},
	);
}

export const resendToSigner: ESignaturesEndpoints['contractsResendToSigner'] = (
	ctx,
	input,
) => signerAction(ctx, 'resendToSigner', input);

export const deleteSigner: ESignaturesEndpoints['contractsDeleteSigner'] = (
	ctx,
	input,
) => signerAction(ctx, 'deleteSigner', input);
