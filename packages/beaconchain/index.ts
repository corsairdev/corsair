import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Chart,
	Ens,
	Epoch,
	Eth1,
	EthStore,
	Execution,
	LatestState,
	Network,
	Node,
	Queues,
	Rocketpool,
	Slot,
	SyncCommittee,
	Validator,
	Validators,
} from './endpoints';
import type {
	BeaconchainEndpointInputs,
	BeaconchainEndpointOutputs,
} from './endpoints/types';
import {
	BeaconchainEndpointInputSchemas,
	BeaconchainEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BeaconchainSchema } from './schema';

export type BeaconchainPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBeaconchainPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof beaconchainEndpointsNested>;
};

export type BeaconchainContext = CorsairPluginContext<
	typeof BeaconchainSchema,
	BeaconchainPluginOptions
>;

export type BeaconchainKeyBuilderContext =
	KeyBuilderContext<BeaconchainPluginOptions>;

export type BeaconchainBoundEndpoints = BindEndpoints<
	typeof beaconchainEndpointsNested
>;

type BeaconchainEndpoint<K extends keyof BeaconchainEndpointOutputs> =
	CorsairEndpoint<
		BeaconchainContext,
		BeaconchainEndpointInputs[K],
		BeaconchainEndpointOutputs[K]
	>;

export type BeaconchainEndpoints = {
	getChart: BeaconchainEndpoint<'getChart'>;
	getExecutionAddressErc20Tokens: BeaconchainEndpoint<'getExecutionAddressErc20Tokens'>;
	getEthStoreDaily: BeaconchainEndpoint<'getEthStoreDaily'>;
	getEth1DepositsByTxHash: BeaconchainEndpoint<'getEth1DepositsByTxHash'>;
	getEpoch: BeaconchainEndpoint<'getEpoch'>;
	getExecutionBlock: BeaconchainEndpoint<'getExecutionBlock'>;
	getExecutionProducedBlocks: BeaconchainEndpoint<'getExecutionProducedBlocks'>;
	getNodeHealth: BeaconchainEndpoint<'getNodeHealth'>;
	getLatestState: BeaconchainEndpoint<'getLatestState'>;
	getNetworkPerformance: BeaconchainEndpoint<'getNetworkPerformance'>;
	getRocketpoolValidator: BeaconchainEndpoint<'getRocketpoolValidator'>;
	getSlot: BeaconchainEndpoint<'getSlot'>;
	getSlotAttestations: BeaconchainEndpoint<'getSlotAttestations'>;
	getSlotAttesterSlashings: BeaconchainEndpoint<'getSlotAttesterSlashings'>;
	getSlotProposerSlashings: BeaconchainEndpoint<'getSlotProposerSlashings'>;
	getSlotVoluntaryExits: BeaconchainEndpoint<'getSlotVoluntaryExits'>;
	getSyncCommittee: BeaconchainEndpoint<'getSyncCommittee'>;
	getValidator: BeaconchainEndpoint<'getValidator'>;
	getValidatorAttestationEfficiency: BeaconchainEndpoint<'getValidatorAttestationEfficiency'>;
	getValidatorAttestations: BeaconchainEndpoint<'getValidatorAttestations'>;
	getValidatorBlsChanges: BeaconchainEndpoint<'getValidatorBlsChanges'>;
	getValidatorBalanceHistory: BeaconchainEndpoint<'getValidatorBalanceHistory'>;
	getValidatorConsensusRewards: BeaconchainEndpoint<'getValidatorConsensusRewards'>;
	getValidatorDailyStats: BeaconchainEndpoint<'getValidatorDailyStats'>;
	getValidatorDeposits: BeaconchainEndpoint<'getValidatorDeposits'>;
	getValidatorExecutionRewards: BeaconchainEndpoint<'getValidatorExecutionRewards'>;
	getValidatorIncomeHistory: BeaconchainEndpoint<'getValidatorIncomeHistory'>;
	getValidatorLeaderboard: BeaconchainEndpoint<'getValidatorLeaderboard'>;
	getValidatorProposals: BeaconchainEndpoint<'getValidatorProposals'>;
	getQueues: BeaconchainEndpoint<'getQueues'>;
	getValidatorWithdrawals: BeaconchainEndpoint<'getValidatorWithdrawals'>;
	getValidatorsProposalLuck: BeaconchainEndpoint<'getValidatorsProposalLuck'>;
	getValidatorsQueue: BeaconchainEndpoint<'getValidatorsQueue'>;
	getValidatorsByDepositAddress: BeaconchainEndpoint<'getValidatorsByDepositAddress'>;
	getValidatorsByWithdrawalCredentials: BeaconchainEndpoint<'getValidatorsByWithdrawalCredentials'>;
	postValidators: BeaconchainEndpoint<'postValidators'>;
	resolveEns: BeaconchainEndpoint<'resolveEns'>;
};

const beaconchainEndpointsNested = {
	chart: {
		get: Chart.getChart,
	},
	execution: {
		getAddressErc20Tokens: Execution.getExecutionAddressErc20Tokens,
		getBlock: Execution.getExecutionBlock,
		getProducedBlocks: Execution.getExecutionProducedBlocks,
	},
	ethStore: {
		getDaily: EthStore.getEthStoreDaily,
	},
	eth1: {
		getDepositsByTxHash: Eth1.getEth1DepositsByTxHash,
	},
	epoch: {
		get: Epoch.getEpoch,
	},
	node: {
		getHealth: Node.getNodeHealth,
	},
	latestState: {
		get: LatestState.getLatestState,
	},
	network: {
		getPerformance: Network.getNetworkPerformance,
	},
	rocketpool: {
		getValidator: Rocketpool.getRocketpoolValidator,
	},
	slot: {
		get: Slot.getSlot,
		getAttestations: Slot.getSlotAttestations,
		getAttesterSlashings: Slot.getSlotAttesterSlashings,
		getProposerSlashings: Slot.getSlotProposerSlashings,
		getVoluntaryExits: Slot.getSlotVoluntaryExits,
	},
	syncCommittee: {
		get: SyncCommittee.getSyncCommittee,
	},
	validator: {
		get: Validator.getValidator,
		getAttestationEfficiency: Validator.getValidatorAttestationEfficiency,
		getAttestations: Validator.getValidatorAttestations,
		getBlsChanges: Validator.getValidatorBlsChanges,
		getBalanceHistory: Validator.getValidatorBalanceHistory,
		getConsensusRewards: Validator.getValidatorConsensusRewards,
		getDailyStats: Validator.getValidatorDailyStats,
		getDeposits: Validator.getValidatorDeposits,
		getExecutionRewards: Validator.getValidatorExecutionRewards,
		getIncomeHistory: Validator.getValidatorIncomeHistory,
		getLeaderboard: Validator.getValidatorLeaderboard,
		getProposals: Validator.getValidatorProposals,
		getWithdrawals: Validator.getValidatorWithdrawals,
	},
	queues: {
		get: Queues.getQueues,
	},
	validators: {
		getProposalLuck: Validators.getValidatorsProposalLuck,
		getQueue: Validators.getValidatorsQueue,
		getByDepositAddress: Validators.getValidatorsByDepositAddress,
		getByWithdrawalCredentials: Validators.getValidatorsByWithdrawalCredentials,
		post: Validators.postValidators,
	},
	ens: {
		resolve: Ens.resolveEns,
	},
} as const;

export const beaconchainEndpointSchemas = {
	'chart.get': {
		input: BeaconchainEndpointInputSchemas.getChart,
		output: BeaconchainEndpointOutputSchemas.getChart,
	},
	'execution.getAddressErc20Tokens': {
		input: BeaconchainEndpointInputSchemas.getExecutionAddressErc20Tokens,
		output: BeaconchainEndpointOutputSchemas.getExecutionAddressErc20Tokens,
	},
	'execution.getBlock': {
		input: BeaconchainEndpointInputSchemas.getExecutionBlock,
		output: BeaconchainEndpointOutputSchemas.getExecutionBlock,
	},
	'execution.getProducedBlocks': {
		input: BeaconchainEndpointInputSchemas.getExecutionProducedBlocks,
		output: BeaconchainEndpointOutputSchemas.getExecutionProducedBlocks,
	},
	'ethStore.getDaily': {
		input: BeaconchainEndpointInputSchemas.getEthStoreDaily,
		output: BeaconchainEndpointOutputSchemas.getEthStoreDaily,
	},
	'eth1.getDepositsByTxHash': {
		input: BeaconchainEndpointInputSchemas.getEth1DepositsByTxHash,
		output: BeaconchainEndpointOutputSchemas.getEth1DepositsByTxHash,
	},
	'epoch.get': {
		input: BeaconchainEndpointInputSchemas.getEpoch,
		output: BeaconchainEndpointOutputSchemas.getEpoch,
	},
	'node.getHealth': {
		input: BeaconchainEndpointInputSchemas.getNodeHealth,
		output: BeaconchainEndpointOutputSchemas.getNodeHealth,
	},
	'latestState.get': {
		input: BeaconchainEndpointInputSchemas.getLatestState,
		output: BeaconchainEndpointOutputSchemas.getLatestState,
	},
	'network.getPerformance': {
		input: BeaconchainEndpointInputSchemas.getNetworkPerformance,
		output: BeaconchainEndpointOutputSchemas.getNetworkPerformance,
	},
	'rocketpool.getValidator': {
		input: BeaconchainEndpointInputSchemas.getRocketpoolValidator,
		output: BeaconchainEndpointOutputSchemas.getRocketpoolValidator,
	},
	'slot.get': {
		input: BeaconchainEndpointInputSchemas.getSlot,
		output: BeaconchainEndpointOutputSchemas.getSlot,
	},
	'slot.getAttestations': {
		input: BeaconchainEndpointInputSchemas.getSlotAttestations,
		output: BeaconchainEndpointOutputSchemas.getSlotAttestations,
	},
	'slot.getAttesterSlashings': {
		input: BeaconchainEndpointInputSchemas.getSlotAttesterSlashings,
		output: BeaconchainEndpointOutputSchemas.getSlotAttesterSlashings,
	},
	'slot.getProposerSlashings': {
		input: BeaconchainEndpointInputSchemas.getSlotProposerSlashings,
		output: BeaconchainEndpointOutputSchemas.getSlotProposerSlashings,
	},
	'slot.getVoluntaryExits': {
		input: BeaconchainEndpointInputSchemas.getSlotVoluntaryExits,
		output: BeaconchainEndpointOutputSchemas.getSlotVoluntaryExits,
	},
	'syncCommittee.get': {
		input: BeaconchainEndpointInputSchemas.getSyncCommittee,
		output: BeaconchainEndpointOutputSchemas.getSyncCommittee,
	},
	'validator.get': {
		input: BeaconchainEndpointInputSchemas.getValidator,
		output: BeaconchainEndpointOutputSchemas.getValidator,
	},
	'validator.getAttestationEfficiency': {
		input: BeaconchainEndpointInputSchemas.getValidatorAttestationEfficiency,
		output: BeaconchainEndpointOutputSchemas.getValidatorAttestationEfficiency,
	},
	'validator.getAttestations': {
		input: BeaconchainEndpointInputSchemas.getValidatorAttestations,
		output: BeaconchainEndpointOutputSchemas.getValidatorAttestations,
	},
	'validator.getBlsChanges': {
		input: BeaconchainEndpointInputSchemas.getValidatorBlsChanges,
		output: BeaconchainEndpointOutputSchemas.getValidatorBlsChanges,
	},
	'validator.getBalanceHistory': {
		input: BeaconchainEndpointInputSchemas.getValidatorBalanceHistory,
		output: BeaconchainEndpointOutputSchemas.getValidatorBalanceHistory,
	},
	'validator.getConsensusRewards': {
		input: BeaconchainEndpointInputSchemas.getValidatorConsensusRewards,
		output: BeaconchainEndpointOutputSchemas.getValidatorConsensusRewards,
	},
	'validator.getDailyStats': {
		input: BeaconchainEndpointInputSchemas.getValidatorDailyStats,
		output: BeaconchainEndpointOutputSchemas.getValidatorDailyStats,
	},
	'validator.getDeposits': {
		input: BeaconchainEndpointInputSchemas.getValidatorDeposits,
		output: BeaconchainEndpointOutputSchemas.getValidatorDeposits,
	},
	'validator.getExecutionRewards': {
		input: BeaconchainEndpointInputSchemas.getValidatorExecutionRewards,
		output: BeaconchainEndpointOutputSchemas.getValidatorExecutionRewards,
	},
	'validator.getIncomeHistory': {
		input: BeaconchainEndpointInputSchemas.getValidatorIncomeHistory,
		output: BeaconchainEndpointOutputSchemas.getValidatorIncomeHistory,
	},
	'validator.getLeaderboard': {
		input: BeaconchainEndpointInputSchemas.getValidatorLeaderboard,
		output: BeaconchainEndpointOutputSchemas.getValidatorLeaderboard,
	},
	'validator.getProposals': {
		input: BeaconchainEndpointInputSchemas.getValidatorProposals,
		output: BeaconchainEndpointOutputSchemas.getValidatorProposals,
	},
	'queues.get': {
		input: BeaconchainEndpointInputSchemas.getQueues,
		output: BeaconchainEndpointOutputSchemas.getQueues,
	},
	'validator.getWithdrawals': {
		input: BeaconchainEndpointInputSchemas.getValidatorWithdrawals,
		output: BeaconchainEndpointOutputSchemas.getValidatorWithdrawals,
	},
	'validators.getProposalLuck': {
		input: BeaconchainEndpointInputSchemas.getValidatorsProposalLuck,
		output: BeaconchainEndpointOutputSchemas.getValidatorsProposalLuck,
	},
	'validators.getQueue': {
		input: BeaconchainEndpointInputSchemas.getValidatorsQueue,
		output: BeaconchainEndpointOutputSchemas.getValidatorsQueue,
	},
	'validators.getByDepositAddress': {
		input: BeaconchainEndpointInputSchemas.getValidatorsByDepositAddress,
		output: BeaconchainEndpointOutputSchemas.getValidatorsByDepositAddress,
	},
	'validators.getByWithdrawalCredentials': {
		input: BeaconchainEndpointInputSchemas.getValidatorsByWithdrawalCredentials,
		output:
			BeaconchainEndpointOutputSchemas.getValidatorsByWithdrawalCredentials,
	},
	'validators.post': {
		input: BeaconchainEndpointInputSchemas.postValidators,
		output: BeaconchainEndpointOutputSchemas.postValidators,
	},
	'ens.resolve': {
		input: BeaconchainEndpointInputSchemas.resolveEns,
		output: BeaconchainEndpointOutputSchemas.resolveEns,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof beaconchainEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const beaconchainEndpointMeta = {
	'chart.get': {
		riskLevel: 'read',
		description: 'Get chart data by name from Beaconchain',
	},
	'execution.getAddressErc20Tokens': {
		riskLevel: 'read',
		description: 'Get ERC20 tokens for an execution address',
	},
	'execution.getBlock': {
		riskLevel: 'read',
		description: 'Get execution block information by block ID',
	},
	'execution.getProducedBlocks': {
		riskLevel: 'read',
		description: 'Get execution blocks produced by an address',
	},
	'ethStore.getDaily': {
		riskLevel: 'read',
		description: 'Get EthStore daily stats',
	},
	'eth1.getDepositsByTxHash': {
		riskLevel: 'read',
		description: 'Get Eth1 deposits by transaction hash',
	},
	'epoch.get': {
		riskLevel: 'read',
		description: 'Get epoch details by epoch ID',
	},
	'node.getHealth': {
		riskLevel: 'read',
		description: 'Get node health status',
	},
	'latestState.get': {
		riskLevel: 'read',
		description: 'Get latest chain state',
	},
	'network.getPerformance': {
		riskLevel: 'read',
		description: 'Get network performance metrics',
	},
	'rocketpool.getValidator': {
		riskLevel: 'read',
		description: 'Get Rocket Pool validator details',
	},
	'slot.get': {
		riskLevel: 'read',
		description: 'Get slot details by slot ID',
	},
	'slot.getAttestations': {
		riskLevel: 'read',
		description: 'Get attestations for a slot',
	},
	'slot.getAttesterSlashings': {
		riskLevel: 'read',
		description: 'Get attester slashings for a slot',
	},
	'slot.getProposerSlashings': {
		riskLevel: 'read',
		description: 'Get proposer slashings for a slot',
	},
	'slot.getVoluntaryExits': {
		riskLevel: 'read',
		description: 'Get voluntary exits for a slot',
	},
	'syncCommittee.get': {
		riskLevel: 'read',
		description: 'Get sync committee members',
	},
	'validator.get': {
		riskLevel: 'read',
		description: 'Get validator details by index or public key',
	},
	'validator.getAttestationEfficiency': {
		riskLevel: 'read',
		description: 'Get attestation efficiency for a validator',
	},
	'validator.getAttestations': {
		riskLevel: 'read',
		description: 'Get attestations performed by a validator',
	},
	'validator.getBlsChanges': {
		riskLevel: 'read',
		description: 'Get BLS to execution change operations',
	},
	'validator.getBalanceHistory': {
		riskLevel: 'read',
		description: 'Get balance history for a validator',
	},
	'validator.getConsensusRewards': {
		riskLevel: 'read',
		description: 'Get consensus rewards for a validator',
	},
	'validator.getDailyStats': {
		riskLevel: 'read',
		description: 'Get daily stats for a validator',
	},
	'validator.getDeposits': {
		riskLevel: 'read',
		description: 'Get deposits for a validator',
	},
	'validator.getExecutionRewards': {
		riskLevel: 'read',
		description: 'Get execution layer rewards for a validator',
	},
	'validator.getIncomeHistory': {
		riskLevel: 'read',
		description: 'Get income history for a validator',
	},
	'validator.getLeaderboard': {
		riskLevel: 'read',
		description: 'Get validator leaderboard',
	},
	'validator.getProposals': {
		riskLevel: 'read',
		description: 'Get block proposals for a validator',
	},
	'queues.get': {
		riskLevel: 'read',
		description: 'Get current activation and exit queue info',
	},
	'validator.getWithdrawals': {
		riskLevel: 'read',
		description: 'Get withdrawals for a validator',
	},
	'validators.getProposalLuck': {
		riskLevel: 'read',
		description: 'Get proposal luck for validators',
	},
	'validators.getQueue': {
		riskLevel: 'read',
		description: 'Get activation and exit queue position for validators',
	},
	'validators.getByDepositAddress': {
		riskLevel: 'read',
		description: 'Get validators registered with a deposit address',
	},
	'validators.getByWithdrawalCredentials': {
		riskLevel: 'read',
		description: 'Get validators registered with withdrawal credentials',
	},
	'validators.post': {
		riskLevel: 'read',
		description: 'Fetch multiple validators by indices or public keys',
	},
	'ens.resolve': {
		riskLevel: 'read',
		description: 'Resolve ENS name to Ethereum address',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof beaconchainEndpointsNested
>;

export const beaconchainAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBeaconchainPlugin<T extends BeaconchainPluginOptions> =
	CorsairPlugin<
		'beaconchain',
		typeof BeaconchainSchema,
		typeof beaconchainEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalBeaconchainPlugin =
	BaseBeaconchainPlugin<BeaconchainPluginOptions>;

export type ExternalBeaconchainPlugin<T extends BeaconchainPluginOptions> =
	BaseBeaconchainPlugin<T>;

export function beaconchain<const T extends BeaconchainPluginOptions>(
	incomingOptions: BeaconchainPluginOptions &
		T = {} as BeaconchainPluginOptions & T,
): ExternalBeaconchainPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'beaconchain',
		authConfig: beaconchainAuthConfig,
		schema: BeaconchainSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: beaconchainEndpointsNested,
		webhooks: {},
		endpointMeta: beaconchainEndpointMeta,
		endpointSchemas: beaconchainEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: BeaconchainKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('beaconchain', 'api_key');
		},
	} satisfies InternalBeaconchainPlugin;
}

export type {
	BeaconchainEndpointInputs,
	BeaconchainEndpointOutputs,
} from './endpoints/types';

export {
	BeaconchainEndpointInputSchemas,
	BeaconchainEndpointOutputSchemas,
} from './endpoints/types';
