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

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('./client', () => ({
	makeBeaconchainV1Request: jest.fn(),
	makeBeaconchainV2Request: jest.fn(),
	makeBeaconchainRequest: jest.fn(),
}));

const mockedV1Request = client.makeBeaconchainV1Request as jest.MockedFunction<
	typeof client.makeBeaconchainV1Request
>;

const mockedV2Request = client.makeBeaconchainV2Request as jest.MockedFunction<
	typeof client.makeBeaconchainV2Request
>;

const mockedRequest = client.makeBeaconchainRequest as jest.MockedFunction<
	typeof client.makeBeaconchainRequest
>;

const ctx = {
	key: 'test-api-key',
	db: {},
} as any;

describe('Beaconchain endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedV1Request.mockResolvedValue({ status: 'OK', data: {} } as never);
		mockedV2Request.mockResolvedValue({ status: 'OK', data: {} } as never);
		mockedRequest.mockResolvedValue({ status: 'OK', data: {} } as never);
	});

	describe('chart', () => {
		it('gets chart data using V1 API', async () => {
			const input = { chartName: 'validators' };

			await Chart.getChart(ctx, input);

			expect(mockedV1Request).toHaveBeenCalledWith(
				'chart/validators',
				ctx.key,
				{ method: 'GET' },
			);
		});
	});

	describe('ens', () => {
		it('resolves ENS name using V1 API', async () => {
			const input = { name: 'vitalik.eth' };

			await Ens.resolveEns(ctx, input);

			expect(mockedV1Request).toHaveBeenCalledWith(
				'ens/lookup/vitalik.eth',
				ctx.key,
				{ method: 'GET' },
			);
		});
	});

	describe('epoch', () => {
		it('gets epoch data using V2 API with POST', async () => {
			const input = { epochId: 1000 };

			await Epoch.getEpoch(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith('ethereum/epoch', ctx.key, {
				method: 'POST',
				body: {
					chain: 'mainnet',
					epoch: 1000,
				},
			});
		});
	});

	describe('eth1', () => {
		it('gets eth1 deposits by tx hash using V2 API with POST', async () => {
			const input = { txHash: '0x123' };

			await Eth1.getEth1DepositsByTxHash(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/eth1/deposit',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						tx_hash: '0x123',
					},
				},
			);
		});
	});

	describe('ethStore', () => {
		it('gets ethstore daily stats using V2 API with POST', async () => {
			const input = { day: 20240101, limit: 10, page: 1 };

			await EthStore.getEthStoreDaily(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/ethstore/daily',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						day: 20240101,
						limit: 10,
						page: 1,
					},
				},
			);
		});
	});

	describe('execution', () => {
		it('gets execution address ERC20 tokens using V2 API with POST', async () => {
			const input = { address: '0x123' };

			await Execution.getExecutionAddressErc20Tokens(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/execution/address/erc20',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						address: '0x123',
					},
				},
			);
		});

		it('gets execution block using V2 API with POST', async () => {
			const input = { blockId: 12345 };

			await Execution.getExecutionBlock(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/execution/block',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						block: 12345,
					},
				},
			);
		});

		it('gets execution produced blocks using V2 API with POST', async () => {
			const input = { address: '0x123' };

			await Execution.getExecutionProducedBlocks(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/execution/produced',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						address: '0x123',
					},
				},
			);
		});
	});

	describe('latestState', () => {
		it('gets latest state using V2 API with POST', async () => {
			await LatestState.getLatestState(ctx, {});

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/state/latest',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
					},
				},
			);
		});
	});

	describe('network', () => {
		it('gets network performance using V2 API with POST', async () => {
			await Network.getNetworkPerformance(ctx, {});

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/network/performance',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
					},
				},
			);
		});
	});

	describe('node', () => {
		it('gets node health using V2 API with POST', async () => {
			await Node.getNodeHealth(ctx, {});

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/node/health',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
					},
				},
			);
		});
	});

	describe('queues', () => {
		it('gets queues using V2 API with POST', async () => {
			await Queues.getQueues(ctx, {});

			expect(mockedV2Request).toHaveBeenCalledWith('ethereum/queues', ctx.key, {
				method: 'POST',
				body: {
					chain: 'mainnet',
				},
			});
		});
	});

	describe('rocketpool', () => {
		it('gets rocketpool validator using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Rocketpool.getRocketpoolValidator(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/rocketpool/validator',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});
	});

	describe('slot', () => {
		it('gets slot using V2 API with POST', async () => {
			const input = { slotId: 123 };

			await Slot.getSlot(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith('ethereum/slot', ctx.key, {
				method: 'POST',
				body: {
					chain: 'mainnet',
					slot: 123,
				},
			});
		});

		it('gets slot attestations using V2 API with POST', async () => {
			const input = { slotId: 123 };

			await Slot.getSlotAttestations(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/slot/attestation-duties',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						slot: 123,
					},
				},
			);
		});

		it('gets slot attester slashings using V2 API with POST', async () => {
			const input = { slotId: 123 };

			await Slot.getSlotAttesterSlashings(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/slot/attester-slashings',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						slot: 123,
					},
				},
			);
		});

		it('gets slot proposer slashings using V2 API with POST', async () => {
			const input = { slotId: 123 };

			await Slot.getSlotProposerSlashings(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/slot/proposer-slashings',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						slot: 123,
					},
				},
			);
		});

		it('gets slot voluntary exits using V2 API with POST', async () => {
			const input = { slotId: 123 };

			await Slot.getSlotVoluntaryExits(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/slot/voluntary-exits',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						slot: 123,
					},
				},
			);
		});
	});

	describe('syncCommittee', () => {
		it('gets sync committee using V2 API with POST', async () => {
			const input = { period: 100 };

			await SyncCommittee.getSyncCommittee(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/sync-committee',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						period: 100,
					},
				},
			);
		});
	});

	describe('validator', () => {
		it('gets validator using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidator(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator attestation efficiency using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorAttestationEfficiency(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/attestation-efficiency',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator attestations using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1', page: 2 };

			await Validator.getValidatorAttestations(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/attestations',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
						page: 2,
					},
				},
			);
		});

		it('gets validator BLS changes using V2 API with POST', async () => {
			const input = { page: 1 };

			await Validator.getValidatorBlsChanges(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/bls-changes',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						page: 1,
					},
				},
			);
		});

		it('gets validator balance history using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorBalanceHistory(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/balance-history',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator consensus rewards using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorConsensusRewards(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/rewards/consensus',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator daily stats using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorDailyStats(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/stats/daily',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator deposits using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorDeposits(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/deposits',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator execution rewards using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorExecutionRewards(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/rewards/execution',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator income history using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorIncomeHistory(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/income-history',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator leaderboard using V2 API with POST', async () => {
			await Validator.getValidatorLeaderboard(ctx, {});

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/leaderboard',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
					},
				},
			);
		});

		it('gets validator proposals using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorProposals(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/proposals',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});

		it('gets validator withdrawals using V2 API with POST', async () => {
			const input = { indexOrPubkey: '1' };

			await Validator.getValidatorWithdrawals(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/withdrawals',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1'],
						},
					},
				},
			);
		});
	});

	describe('validators', () => {
		it('gets validators proposal luck using V2 API with POST', async () => {
			const input = { validators: ['1', '2'] };

			await Validators.getValidatorsProposalLuck(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/proposal-luck',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1', '2'],
						},
					},
				},
			);
		});

		it('gets validators queue using V2 API with POST', async () => {
			await Validators.getValidatorsQueue(ctx, {});

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators/queues',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
					},
				},
			);
		});

		it('gets validators by deposit address using V2 API with POST', async () => {
			const input = { address: '0x123' };

			await Validators.getValidatorsByDepositAddress(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						deposit_address: '0x123',
					},
				},
			);
		});

		it('gets validators by withdrawal credentials using V2 API with POST', async () => {
			const input = { credentials: '0xabc' };

			await Validators.getValidatorsByWithdrawalCredentials(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						withdrawal_credentials: '0xabc',
					},
				},
			);
		});

		it('posts validators using V2 API with POST', async () => {
			const input = { indicesOrPubkeys: ['1', '2'] };

			await Validators.postValidators(ctx, input);

			expect(mockedV2Request).toHaveBeenCalledWith(
				'ethereum/validators',
				ctx.key,
				{
					method: 'POST',
					body: {
						chain: 'mainnet',
						validator: {
							validator_identifiers: ['1', '2'],
						},
					},
				},
			);
		});
	});
});
