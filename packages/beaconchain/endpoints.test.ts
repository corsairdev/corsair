import { AuthMissingError } from 'corsair/core';
import * as client from './client';
import * as Chart from './endpoints/chart';
import * as Ens from './endpoints/ens';
import * as Epoch from './endpoints/epoch';
import * as EthStore from './endpoints/eth-store';
import * as Eth1 from './endpoints/eth1';
import * as Execution from './endpoints/execution';
import * as LatestState from './endpoints/latest-state';
import * as Network from './endpoints/network';
import * as Node from './endpoints/node';
import * as Queues from './endpoints/queues';
import * as Rocketpool from './endpoints/rocketpool';
import * as Slot from './endpoints/slot';
import * as SyncCommittee from './endpoints/sync-committee';
import * as Validator from './endpoints/validator';
import * as Validators from './endpoints/validators';
import type { BeaconchainContext } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeBeaconchainV1Request: jest.fn(),
		makeBeaconchainV2Request: jest.fn(),
		makeBeaconchainHealthRequest: jest.fn(),
	};
});

const mockedV1Request = client.makeBeaconchainV1Request as jest.MockedFunction<
	typeof client.makeBeaconchainV1Request
>;
const mockedV2Request = client.makeBeaconchainV2Request as jest.MockedFunction<
	typeof client.makeBeaconchainV2Request
>;
const mockedHealthRequest =
	client.makeBeaconchainHealthRequest as jest.MockedFunction<
		typeof client.makeBeaconchainHealthRequest
	>;

function makeCtx(
	overrides: Partial<BeaconchainContext> = {},
): BeaconchainContext {
	return {
		key: 'test-api-key',
		options: {},
		db: {},
		...overrides,
	} as never;
}

const ctx = makeCtx();

describe('Beaconchain endpoint contracts', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedV1Request.mockResolvedValue({ status: 'OK', data: {} } as never);
		mockedV2Request.mockResolvedValue({ data: {} } as never);
		mockedHealthRequest.mockResolvedValue('module monitoring_api: OK' as never);
	});

	it('throws AuthMissingError when no key is on the context', async () => {
		await expect(
			Chart.getChart(makeCtx({ key: undefined }), { chartName: 'validators' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockedV1Request).not.toHaveBeenCalled();
	});

	describe('V1', () => {
		it('gets chart data', async () => {
			await Chart.getChart(ctx, { chartName: 'validators' });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'chart/validators',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('resolves ENS', async () => {
			await Ens.resolveEns(ctx, { name: 'vitalik.eth' });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'ens/lookup/vitalik.eth',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets epoch by path', async () => {
			await Epoch.getEpoch(ctx, { epochId: 1000 });
			expect(mockedV1Request).toHaveBeenCalledWith('epoch/1000', ctx.key, {
				method: 'GET',
			});
		});

		it('gets eth1 deposits by tx hash', async () => {
			await Eth1.getEth1DepositsByTxHash(ctx, { txHash: '0x123' });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'eth1deposit/0x123',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets execution ERC-20 tokens', async () => {
			await Execution.getExecutionAddressErc20Tokens(ctx, {
				address: '0xabc',
			});
			expect(mockedV1Request).toHaveBeenCalledWith(
				'execution/address/0xabc/erc20tokens',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets produced execution blocks', async () => {
			await Execution.getExecutionProducedBlocks(ctx, { address: '0xabc' });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'execution/0xabc/produced',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets rocketpool validator', async () => {
			await Rocketpool.getRocketpoolValidator(ctx, { indexOrPubkey: '1' });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'rocketpool/validator/1',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets slot attestations, slashings, and exits', async () => {
			await Slot.getSlotAttestations(ctx, { slotId: 10 });
			await Slot.getSlotAttesterSlashings(ctx, { slotId: 10 });
			await Slot.getSlotProposerSlashings(ctx, { slotId: 10 });
			await Slot.getSlotVoluntaryExits(ctx, { slotId: 10 });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'slot/10/attestations',
				ctx.key,
				{ method: 'GET' },
			);
			expect(mockedV1Request).toHaveBeenCalledWith(
				'slot/10/attesterslashings',
				ctx.key,
				{ method: 'GET' },
			);
			expect(mockedV1Request).toHaveBeenCalledWith(
				'slot/10/proposerslashings',
				ctx.key,
				{ method: 'GET' },
			);
			expect(mockedV1Request).toHaveBeenCalledWith(
				'slot/10/voluntaryexits',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets BLS changes for the requested validator', async () => {
			await Validator.getValidatorBlsChanges(ctx, { indexOrPubkey: '1' });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'validator/1/blsChange',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets daily stats, leaderboard, deposits, and withdrawals', async () => {
			await Validator.getValidatorDailyStats(ctx, { indexOrPubkey: '1' });
			await Validator.getValidatorLeaderboard(ctx, {});
			await Validator.getValidatorDeposits(ctx, { indexOrPubkey: '1' });
			await Validator.getValidatorWithdrawals(ctx, { indexOrPubkey: '1' });
			expect(mockedV1Request).toHaveBeenCalledWith(
				'validator/stats/1',
				ctx.key,
				{ method: 'GET' },
			);
			expect(mockedV1Request).toHaveBeenCalledWith(
				'validator/leaderboard',
				ctx.key,
				{ method: 'GET' },
			);
			expect(mockedV1Request).toHaveBeenCalledWith(
				'validator/1/deposits',
				ctx.key,
				{ method: 'GET' },
			);
			expect(mockedV1Request).toHaveBeenCalledWith(
				'validator/1/withdrawals',
				ctx.key,
				{ method: 'GET' },
			);
		});

		it('gets proposal luck and the V1 queue', async () => {
			await Validators.getValidatorsProposalLuck(ctx, {
				validators: ['1', '2'],
			});
			await Validators.getValidatorsQueue(ctx, {});
			expect(mockedV1Request).toHaveBeenCalledWith(
				'validators/proposalLuck',
				ctx.key,
				{
					method: 'GET',
					query: { validators: '1,2' },
				},
			);
			expect(mockedV1Request).toHaveBeenCalledWith(
				'validators/queue',
				ctx.key,
				{ method: 'GET' },
			);
		});
	});

	describe('V2', () => {
		it('gets latest state at ethereum/state', async () => {
			await LatestState.getLatestState(ctx, {});
			expect(mockedV2Request).toHaveBeenCalledWith('ethereum/state', ctx.key, {
				method: 'POST',
				body: { chain: 'mainnet' },
			});
		});

		it('gets network performance with an evaluation window', async () => {
			await Network.getNetworkPerformance(ctx, {});
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/performance-aggregate',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						range: { evaluation_window: '24h' },
					},
				},
			);
		});

		it('gets eth-store with an evaluation window', async () => {
			await EthStore.getEthStoreDaily(ctx, {});
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/eth-store',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						range: { evaluation_window: '24h' },
					},
				},
			);
		});

		it('gets a slot', async () => {
			await Slot.getSlot(ctx, { slotId: 10 });
			expect(mockedV2Request).toHaveBeenCalledWith('ethereum/slot', ctx.key, {
				method: 'POST',
				body: { chain: 'mainnet', slot: 10 },
			});
		});

		it('gets the sync committee', async () => {
			await SyncCommittee.getSyncCommittee(ctx, { period: 290 });
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/sync-committee',
				ctx.key,
				{
					method: 'POST',
					body: { chain: 'mainnet', period: 290 },
				},
			);
		});

		it('gets network queues', async () => {
			await Queues.getQueues(ctx, {});
			expect(mockedV2Request).toHaveBeenCalledWith('ethereum/queues', ctx.key, {
				method: 'POST',
				body: { chain: 'mainnet' },
			});
		});

		it('gets an execution block', async () => {
			await Execution.getExecutionBlock(ctx, { blockId: 1 });
			expect(mockedV2Request).toHaveBeenCalledWith('ethereum/block', ctx.key, {
				method: 'POST',
				body: { chain: 'mainnet', block: 1 },
			});
		});

		it('looks up validators with nested identifiers', async () => {
			await Validator.getValidator(ctx, { indexOrPubkey: '1' });
			await Validators.postValidators(ctx, { indicesOrPubkeys: ['1', '2'] });
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: { validator_identifiers: ['1'] },
					},
				},
			);
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: { validator_identifiers: ['1', '2'] },
					},
				},
			);
		});

		it('nests deposit and withdrawal selectors under validator', async () => {
			await Validators.getValidatorsByDepositAddress(ctx, {
				address: '0x123',
			});
			await Validators.getValidatorsByWithdrawalCredentials(ctx, {
				credentials: '0xabc',
			});
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: { deposit_address: '0x123' },
					},
				},
			);
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: { withdrawal: '0xabc' },
					},
				},
			);
		});

		it('uses documented validator metric routes', async () => {
			await Validator.getValidatorBalanceHistory(ctx, { indexOrPubkey: '1' });
			await Validator.getValidatorAttestations(ctx, { indexOrPubkey: '1' });
			await Validator.getValidatorProposals(ctx, { indexOrPubkey: '1' });
			await Validator.getValidatorAttestationEfficiency(ctx, {
				indexOrPubkey: '1',
			});
			await Validator.getValidatorIncomeHistory(ctx, { indexOrPubkey: '1' });
			await Validator.getValidatorConsensusRewards(ctx, {
				indexOrPubkey: '1',
			});
			await Validator.getValidatorExecutionRewards(ctx, {
				indexOrPubkey: '1',
			});
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/balances',
				ctx.key,
				expect.objectContaining({
					body: expect.objectContaining({
						validator: { validator_identifiers: ['1'] },
					}),
				}),
			);
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/attestation-slots',
				ctx.key,
				expect.objectContaining({
					body: expect.objectContaining({
						validator: { validator_identifiers: ['1'] },
					}),
				}),
			);
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/proposal-slots',
				ctx.key,
				expect.objectContaining({
					body: expect.objectContaining({
						validator: { validator_identifiers: ['1'] },
					}),
				}),
			);
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/performance-aggregate',
				ctx.key,
				expect.objectContaining({
					body: expect.objectContaining({
						validator: { validator_identifiers: ['1'] },
						range: { evaluation_window: '24h' },
					}),
				}),
			);
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/rewards-list',
				ctx.key,
				expect.objectContaining({
					body: expect.objectContaining({
						validator: { validator_identifiers: ['1'] },
					}),
				}),
			);
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/rewards-aggregate',
				ctx.key,
				expect.objectContaining({
					body: expect.objectContaining({
						validator: { validator_identifiers: ['1'] },
					}),
				}),
			);
		});

		it('forwards chain and cursor pagination on list lookups', async () => {
			await Validators.postValidators(ctx, {
				indicesOrPubkeys: ['1'],
				chain: 'hoodi',
				cursor: 'abc',
				page_size: 10,
			});
			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'hoodi',
						validator: { validator_identifiers: ['1'] },
						cursor: 'abc',
						page_size: 10,
					},
				},
			);
		});
	});

	it('gets explorer health from /api/healthz', async () => {
		const result = await Node.getNodeHealth(ctx, {});
		expect(mockedHealthRequest).toHaveBeenCalledWith(ctx.key, 'mainnet');
		expect(result).toEqual({ data: 'module monitoring_api: OK' });
	});
});
