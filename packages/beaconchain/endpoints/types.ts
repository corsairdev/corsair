import { z } from 'zod';

export const BeaconchainV1ResponseSchema = z.object({
	status: z.string(),
	data: z.unknown(),
});
export type BeaconchainV1Response = z.infer<typeof BeaconchainV1ResponseSchema>;

export const BeaconchainV2ResponseSchema = z
	.object({
		data: z.unknown(),
	})
	.passthrough();
export type BeaconchainV2Response = z.infer<typeof BeaconchainV2ResponseSchema>;

export const BeaconchainHealthResponseSchema = z.object({
	data: z.unknown(),
});
export type BeaconchainHealthResponse = z.infer<
	typeof BeaconchainHealthResponseSchema
>;

const chain = z.enum(['mainnet', 'hoodi']).optional();
const cursor = z.string().optional();
const pageSize = z.number().int().positive().max(10).optional();
const evaluationWindow = z
	.enum(['24h', '7d', '30d', '90d', 'all_time'])
	.optional();

export const GetChartInputSchema = z.object({
	chartName: z.string().min(1, 'Chart name is required'),
	chain,
});
export type GetChartInput = z.infer<typeof GetChartInputSchema>;

export const GetExecutionAddressErc20TokensInputSchema = z.object({
	address: z.string().min(1, 'Address is required'),
	chain,
});
export type GetExecutionAddressErc20TokensInput = z.infer<
	typeof GetExecutionAddressErc20TokensInputSchema
>;

export const GetEthStoreDailyInputSchema = z.object({
	chain,
	cursor,
	page_size: pageSize,
	evaluation_window: evaluationWindow,
});
export type GetEthStoreDailyInput = z.infer<typeof GetEthStoreDailyInputSchema>;

export const GetEth1DepositsByTxHashInputSchema = z.object({
	txHash: z.string().min(1, 'Transaction hash is required'),
	chain,
});
export type GetEth1DepositsByTxHashInput = z.infer<
	typeof GetEth1DepositsByTxHashInputSchema
>;

export const GetEpochInputSchema = z.object({
	epochId: z.union([z.number(), z.string()]),
	chain,
});
export type GetEpochInput = z.infer<typeof GetEpochInputSchema>;

export const GetExecutionBlockInputSchema = z.object({
	blockId: z.union([z.number(), z.string()]),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetExecutionBlockInput = z.infer<
	typeof GetExecutionBlockInputSchema
>;

export const GetExecutionProducedBlocksInputSchema = z.object({
	address: z.string().min(1, 'Address is required'),
	chain,
});
export type GetExecutionProducedBlocksInput = z.infer<
	typeof GetExecutionProducedBlocksInputSchema
>;

export const GetNodeHealthInputSchema = z.object({
	chain,
});
export type GetNodeHealthInput = z.infer<typeof GetNodeHealthInputSchema>;

export const GetLatestStateInputSchema = z.object({
	chain,
});
export type GetLatestStateInput = z.infer<typeof GetLatestStateInputSchema>;

export const GetNetworkPerformanceInputSchema = z.object({
	chain,
	evaluation_window: evaluationWindow,
});
export type GetNetworkPerformanceInput = z.infer<
	typeof GetNetworkPerformanceInputSchema
>;

export const GetRocketpoolValidatorInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
});
export type GetRocketpoolValidatorInput = z.infer<
	typeof GetRocketpoolValidatorInputSchema
>;

export const GetSlotInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetSlotInput = z.infer<typeof GetSlotInputSchema>;

export const GetSlotAttestationsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
	chain,
});
export type GetSlotAttestationsInput = z.infer<
	typeof GetSlotAttestationsInputSchema
>;

export const GetSlotAttesterSlashingsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
	chain,
});
export type GetSlotAttesterSlashingsInput = z.infer<
	typeof GetSlotAttesterSlashingsInputSchema
>;

export const GetSlotProposerSlashingsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
	chain,
});
export type GetSlotProposerSlashingsInput = z.infer<
	typeof GetSlotProposerSlashingsInputSchema
>;

export const GetSlotVoluntaryExitsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
	chain,
});
export type GetSlotVoluntaryExitsInput = z.infer<
	typeof GetSlotVoluntaryExitsInputSchema
>;

export const GetSyncCommitteeInputSchema = z.object({
	period: z.number().optional(),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetSyncCommitteeInput = z.infer<typeof GetSyncCommitteeInputSchema>;

export const GetValidatorInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetValidatorInput = z.infer<typeof GetValidatorInputSchema>;

export const GetValidatorAttestationEfficiencyInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	evaluation_window: evaluationWindow,
});
export type GetValidatorAttestationEfficiencyInput = z.infer<
	typeof GetValidatorAttestationEfficiencyInputSchema
>;

export const GetValidatorAttestationsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetValidatorAttestationsInput = z.infer<
	typeof GetValidatorAttestationsInputSchema
>;

export const GetValidatorBlsChangesInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
});
export type GetValidatorBlsChangesInput = z.infer<
	typeof GetValidatorBlsChangesInputSchema
>;

export const GetValidatorBalanceHistoryInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetValidatorBalanceHistoryInput = z.infer<
	typeof GetValidatorBalanceHistoryInputSchema
>;

export const GetValidatorConsensusRewardsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	evaluation_window: evaluationWindow,
});
export type GetValidatorConsensusRewardsInput = z.infer<
	typeof GetValidatorConsensusRewardsInputSchema
>;

export const GetValidatorDailyStatsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
});
export type GetValidatorDailyStatsInput = z.infer<
	typeof GetValidatorDailyStatsInputSchema
>;

export const GetValidatorDepositsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
});
export type GetValidatorDepositsInput = z.infer<
	typeof GetValidatorDepositsInputSchema
>;

export const GetValidatorExecutionRewardsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	evaluation_window: evaluationWindow,
});
export type GetValidatorExecutionRewardsInput = z.infer<
	typeof GetValidatorExecutionRewardsInputSchema
>;

export const GetValidatorIncomeHistoryInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetValidatorIncomeHistoryInput = z.infer<
	typeof GetValidatorIncomeHistoryInputSchema
>;

export const GetValidatorLeaderboardInputSchema = z.object({
	chain,
});
export type GetValidatorLeaderboardInput = z.infer<
	typeof GetValidatorLeaderboardInputSchema
>;

export const GetValidatorProposalsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetValidatorProposalsInput = z.infer<
	typeof GetValidatorProposalsInputSchema
>;

export const GetQueuesInputSchema = z.object({
	chain,
});
export type GetQueuesInput = z.infer<typeof GetQueuesInputSchema>;

export const GetValidatorWithdrawalsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	chain,
});
export type GetValidatorWithdrawalsInput = z.infer<
	typeof GetValidatorWithdrawalsInputSchema
>;

export const GetValidatorsProposalLuckInputSchema = z.object({
	validators: z.array(z.string()).optional(),
	chain,
});
export type GetValidatorsProposalLuckInput = z.infer<
	typeof GetValidatorsProposalLuckInputSchema
>;

export const GetValidatorsQueueInputSchema = z.object({
	chain,
});
export type GetValidatorsQueueInput = z.infer<
	typeof GetValidatorsQueueInputSchema
>;

export const GetValidatorsByDepositAddressInputSchema = z.object({
	address: z.string().min(1, 'Deposit address is required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetValidatorsByDepositAddressInput = z.infer<
	typeof GetValidatorsByDepositAddressInputSchema
>;

export const GetValidatorsByWithdrawalCredentialsInputSchema = z.object({
	credentials: z.string().min(1, 'Withdrawal credentials are required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type GetValidatorsByWithdrawalCredentialsInput = z.infer<
	typeof GetValidatorsByWithdrawalCredentialsInputSchema
>;

export const PostValidatorsInputSchema = z.object({
	indicesOrPubkeys: z
		.array(z.string())
		.min(1, 'At least one validator index or pubkey is required'),
	chain,
	cursor,
	page_size: pageSize,
});
export type PostValidatorsInput = z.infer<typeof PostValidatorsInputSchema>;

export const ResolveEnsInputSchema = z.object({
	name: z.string().min(1, 'ENS name is required'),
	chain,
});
export type ResolveEnsInput = z.infer<typeof ResolveEnsInputSchema>;

export const BeaconchainEndpointInputSchemas = {
	getChart: GetChartInputSchema,
	getExecutionAddressErc20Tokens: GetExecutionAddressErc20TokensInputSchema,
	getEthStoreDaily: GetEthStoreDailyInputSchema,
	getEth1DepositsByTxHash: GetEth1DepositsByTxHashInputSchema,
	getEpoch: GetEpochInputSchema,
	getExecutionBlock: GetExecutionBlockInputSchema,
	getExecutionProducedBlocks: GetExecutionProducedBlocksInputSchema,
	getNodeHealth: GetNodeHealthInputSchema,
	getLatestState: GetLatestStateInputSchema,
	getNetworkPerformance: GetNetworkPerformanceInputSchema,
	getRocketpoolValidator: GetRocketpoolValidatorInputSchema,
	getSlot: GetSlotInputSchema,
	getSlotAttestations: GetSlotAttestationsInputSchema,
	getSlotAttesterSlashings: GetSlotAttesterSlashingsInputSchema,
	getSlotProposerSlashings: GetSlotProposerSlashingsInputSchema,
	getSlotVoluntaryExits: GetSlotVoluntaryExitsInputSchema,
	getSyncCommittee: GetSyncCommitteeInputSchema,
	getValidator: GetValidatorInputSchema,
	getValidatorAttestationEfficiency:
		GetValidatorAttestationEfficiencyInputSchema,
	getValidatorAttestations: GetValidatorAttestationsInputSchema,
	getValidatorBlsChanges: GetValidatorBlsChangesInputSchema,
	getValidatorBalanceHistory: GetValidatorBalanceHistoryInputSchema,
	getValidatorConsensusRewards: GetValidatorConsensusRewardsInputSchema,
	getValidatorDailyStats: GetValidatorDailyStatsInputSchema,
	getValidatorDeposits: GetValidatorDepositsInputSchema,
	getValidatorExecutionRewards: GetValidatorExecutionRewardsInputSchema,
	getValidatorIncomeHistory: GetValidatorIncomeHistoryInputSchema,
	getValidatorLeaderboard: GetValidatorLeaderboardInputSchema,
	getValidatorProposals: GetValidatorProposalsInputSchema,
	getQueues: GetQueuesInputSchema,
	getValidatorWithdrawals: GetValidatorWithdrawalsInputSchema,
	getValidatorsProposalLuck: GetValidatorsProposalLuckInputSchema,
	getValidatorsQueue: GetValidatorsQueueInputSchema,
	getValidatorsByDepositAddress: GetValidatorsByDepositAddressInputSchema,
	getValidatorsByWithdrawalCredentials:
		GetValidatorsByWithdrawalCredentialsInputSchema,
	postValidators: PostValidatorsInputSchema,
	resolveEns: ResolveEnsInputSchema,
};

export const BeaconchainEndpointOutputSchemas = {
	getChart: BeaconchainV1ResponseSchema,
	getExecutionAddressErc20Tokens: BeaconchainV1ResponseSchema,
	getEthStoreDaily: BeaconchainV2ResponseSchema,
	getEth1DepositsByTxHash: BeaconchainV1ResponseSchema,
	getEpoch: BeaconchainV1ResponseSchema,
	getExecutionBlock: BeaconchainV2ResponseSchema,
	getExecutionProducedBlocks: BeaconchainV1ResponseSchema,
	getNodeHealth: BeaconchainHealthResponseSchema,
	getLatestState: BeaconchainV2ResponseSchema,
	getNetworkPerformance: BeaconchainV2ResponseSchema,
	getRocketpoolValidator: BeaconchainV1ResponseSchema,
	getSlot: BeaconchainV2ResponseSchema,
	getSlotAttestations: BeaconchainV1ResponseSchema,
	getSlotAttesterSlashings: BeaconchainV1ResponseSchema,
	getSlotProposerSlashings: BeaconchainV1ResponseSchema,
	getSlotVoluntaryExits: BeaconchainV1ResponseSchema,
	getSyncCommittee: BeaconchainV2ResponseSchema,
	getValidator: BeaconchainV2ResponseSchema,
	getValidatorAttestationEfficiency: BeaconchainV2ResponseSchema,
	getValidatorAttestations: BeaconchainV2ResponseSchema,
	getValidatorBlsChanges: BeaconchainV1ResponseSchema,
	getValidatorBalanceHistory: BeaconchainV2ResponseSchema,
	getValidatorConsensusRewards: BeaconchainV2ResponseSchema,
	getValidatorDailyStats: BeaconchainV1ResponseSchema,
	getValidatorDeposits: BeaconchainV1ResponseSchema,
	getValidatorExecutionRewards: BeaconchainV2ResponseSchema,
	getValidatorIncomeHistory: BeaconchainV2ResponseSchema,
	getValidatorLeaderboard: BeaconchainV1ResponseSchema,
	getValidatorProposals: BeaconchainV2ResponseSchema,
	getQueues: BeaconchainV2ResponseSchema,
	getValidatorWithdrawals: BeaconchainV1ResponseSchema,
	getValidatorsProposalLuck: BeaconchainV1ResponseSchema,
	getValidatorsQueue: BeaconchainV1ResponseSchema,
	getValidatorsByDepositAddress: BeaconchainV2ResponseSchema,
	getValidatorsByWithdrawalCredentials: BeaconchainV2ResponseSchema,
	postValidators: BeaconchainV2ResponseSchema,
	resolveEns: BeaconchainV1ResponseSchema,
};

export type BeaconchainEndpointInputs = {
	getChart: GetChartInput;
	getExecutionAddressErc20Tokens: GetExecutionAddressErc20TokensInput;
	getEthStoreDaily: GetEthStoreDailyInput;
	getEth1DepositsByTxHash: GetEth1DepositsByTxHashInput;
	getEpoch: GetEpochInput;
	getExecutionBlock: GetExecutionBlockInput;
	getExecutionProducedBlocks: GetExecutionProducedBlocksInput;
	getNodeHealth: GetNodeHealthInput;
	getLatestState: GetLatestStateInput;
	getNetworkPerformance: GetNetworkPerformanceInput;
	getRocketpoolValidator: GetRocketpoolValidatorInput;
	getSlot: GetSlotInput;
	getSlotAttestations: GetSlotAttestationsInput;
	getSlotAttesterSlashings: GetSlotAttesterSlashingsInput;
	getSlotProposerSlashings: GetSlotProposerSlashingsInput;
	getSlotVoluntaryExits: GetSlotVoluntaryExitsInput;
	getSyncCommittee: GetSyncCommitteeInput;
	getValidator: GetValidatorInput;
	getValidatorAttestationEfficiency: GetValidatorAttestationEfficiencyInput;
	getValidatorAttestations: GetValidatorAttestationsInput;
	getValidatorBlsChanges: GetValidatorBlsChangesInput;
	getValidatorBalanceHistory: GetValidatorBalanceHistoryInput;
	getValidatorConsensusRewards: GetValidatorConsensusRewardsInput;
	getValidatorDailyStats: GetValidatorDailyStatsInput;
	getValidatorDeposits: GetValidatorDepositsInput;
	getValidatorExecutionRewards: GetValidatorExecutionRewardsInput;
	getValidatorIncomeHistory: GetValidatorIncomeHistoryInput;
	getValidatorLeaderboard: GetValidatorLeaderboardInput;
	getValidatorProposals: GetValidatorProposalsInput;
	getQueues: GetQueuesInput;
	getValidatorWithdrawals: GetValidatorWithdrawalsInput;
	getValidatorsProposalLuck: GetValidatorsProposalLuckInput;
	getValidatorsQueue: GetValidatorsQueueInput;
	getValidatorsByDepositAddress: GetValidatorsByDepositAddressInput;
	getValidatorsByWithdrawalCredentials: GetValidatorsByWithdrawalCredentialsInput;
	postValidators: PostValidatorsInput;
	resolveEns: ResolveEnsInput;
};

export type BeaconchainEndpointOutputs = {
	getChart: BeaconchainV1Response;
	getExecutionAddressErc20Tokens: BeaconchainV1Response;
	getEthStoreDaily: BeaconchainV2Response;
	getEth1DepositsByTxHash: BeaconchainV1Response;
	getEpoch: BeaconchainV1Response;
	getExecutionBlock: BeaconchainV2Response;
	getExecutionProducedBlocks: BeaconchainV1Response;
	getNodeHealth: BeaconchainHealthResponse;
	getLatestState: BeaconchainV2Response;
	getNetworkPerformance: BeaconchainV2Response;
	getRocketpoolValidator: BeaconchainV1Response;
	getSlot: BeaconchainV2Response;
	getSlotAttestations: BeaconchainV1Response;
	getSlotAttesterSlashings: BeaconchainV1Response;
	getSlotProposerSlashings: BeaconchainV1Response;
	getSlotVoluntaryExits: BeaconchainV1Response;
	getSyncCommittee: BeaconchainV2Response;
	getValidator: BeaconchainV2Response;
	getValidatorAttestationEfficiency: BeaconchainV2Response;
	getValidatorAttestations: BeaconchainV2Response;
	getValidatorBlsChanges: BeaconchainV1Response;
	getValidatorBalanceHistory: BeaconchainV2Response;
	getValidatorConsensusRewards: BeaconchainV2Response;
	getValidatorDailyStats: BeaconchainV1Response;
	getValidatorDeposits: BeaconchainV1Response;
	getValidatorExecutionRewards: BeaconchainV2Response;
	getValidatorIncomeHistory: BeaconchainV2Response;
	getValidatorLeaderboard: BeaconchainV1Response;
	getValidatorProposals: BeaconchainV2Response;
	getQueues: BeaconchainV2Response;
	getValidatorWithdrawals: BeaconchainV1Response;
	getValidatorsProposalLuck: BeaconchainV1Response;
	getValidatorsQueue: BeaconchainV1Response;
	getValidatorsByDepositAddress: BeaconchainV2Response;
	getValidatorsByWithdrawalCredentials: BeaconchainV2Response;
	postValidators: BeaconchainV2Response;
	resolveEns: BeaconchainV1Response;
};
