import { z } from 'zod';

export const BeaconchainBaseResponseSchema = z.object({
	status: z.string(),
	data: z.unknown(),
});
export type BeaconchainBaseResponse = z.infer<
	typeof BeaconchainBaseResponseSchema
>;

// 1. BEACONCHAIN_GET_CHART
export const GetChartInputSchema = z.object({
	chartName: z.string().min(1, 'Chart name is required'),
});
export type GetChartInput = z.infer<typeof GetChartInputSchema>;

// 2. BEACONCHAIN_GET_EXECUTION_ADDRESS_ERC20_TOKENS
export const GetExecutionAddressErc20TokensInputSchema = z.object({
	address: z.string().min(1, 'Address is required'),
});
export type GetExecutionAddressErc20TokensInput = z.infer<
	typeof GetExecutionAddressErc20TokensInputSchema
>;

// 3. BEACONCHAIN_GET_ETH_STORE_DAILY
export const GetEthStoreDailyInputSchema = z.object({
	day: z.number().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
});
export type GetEthStoreDailyInput = z.infer<typeof GetEthStoreDailyInputSchema>;

// 4. BEACONCHAIN_GET_ETH1_DEPOSITS_BY_TX_HASH
export const GetEth1DepositsByTxHashInputSchema = z.object({
	txHash: z.string().min(1, 'Transaction hash is required'),
});
export type GetEth1DepositsByTxHashInput = z.infer<
	typeof GetEth1DepositsByTxHashInputSchema
>;

// 5. BEACONCHAIN_GET_EPOCH
export const GetEpochInputSchema = z.object({
	epochId: z.union([z.number(), z.string()]),
});
export type GetEpochInput = z.infer<typeof GetEpochInputSchema>;

// 6. BEACONCHAIN_GET_EXECUTION_BLOCK
export const GetExecutionBlockInputSchema = z.object({
	blockId: z.union([z.number(), z.string()]),
});
export type GetExecutionBlockInput = z.infer<
	typeof GetExecutionBlockInputSchema
>;

// 7. BEACONCHAIN_GET_EXECUTION_PRODUCED_BLOCKS
export const GetExecutionProducedBlocksInputSchema = z.object({
	address: z.string().min(1, 'Address is required'),
});
export type GetExecutionProducedBlocksInput = z.infer<
	typeof GetExecutionProducedBlocksInputSchema
>;

// 8. BEACONCHAIN_GET_NODE_HEALTH
export const GetNodeHealthInputSchema = z.object({});
export type GetNodeHealthInput = z.infer<typeof GetNodeHealthInputSchema>;

// 9. BEACONCHAIN_GET_LATEST_STATE
export const GetLatestStateInputSchema = z.object({});
export type GetLatestStateInput = z.infer<typeof GetLatestStateInputSchema>;

// 10. BEACONCHAIN_GET_NETWORK_PERFORMANCE
export const GetNetworkPerformanceInputSchema = z.object({});
export type GetNetworkPerformanceInput = z.infer<
	typeof GetNetworkPerformanceInputSchema
>;

// 11. BEACONCHAIN_GET_ROCKETPOOL_VALIDATOR
export const GetRocketpoolValidatorInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetRocketpoolValidatorInput = z.infer<
	typeof GetRocketpoolValidatorInputSchema
>;

// 12. BEACONCHAIN_GET_SLOT
export const GetSlotInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
});
export type GetSlotInput = z.infer<typeof GetSlotInputSchema>;

// 13. BEACONCHAIN_GET_SLOT_ATTESTATIONS
export const GetSlotAttestationsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
});
export type GetSlotAttestationsInput = z.infer<
	typeof GetSlotAttestationsInputSchema
>;

// 14. BEACONCHAIN_GET_SLOT_ATTESTER_SLASHINGS
export const GetSlotAttesterSlashingsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
});
export type GetSlotAttesterSlashingsInput = z.infer<
	typeof GetSlotAttesterSlashingsInputSchema
>;

// 15. BEACONCHAIN_GET_SLOT_PROPOSER_SLASHINGS
export const GetSlotProposerSlashingsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
});
export type GetSlotProposerSlashingsInput = z.infer<
	typeof GetSlotProposerSlashingsInputSchema
>;

// 16. BEACONCHAIN_GET_SLOT_VOLUNTARY_EXITS
export const GetSlotVoluntaryExitsInputSchema = z.object({
	slotId: z.union([z.number(), z.string()]),
});
export type GetSlotVoluntaryExitsInput = z.infer<
	typeof GetSlotVoluntaryExitsInputSchema
>;

// 17. BEACONCHAIN_GET_SYNC_COMMITTEE
export const GetSyncCommitteeInputSchema = z.object({
	period: z.number().optional(),
});
export type GetSyncCommitteeInput = z.infer<typeof GetSyncCommitteeInputSchema>;

// 18. BEACONCHAIN_GET_VALIDATOR
export const GetValidatorInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorInput = z.infer<typeof GetValidatorInputSchema>;

// 19. BEACONCHAIN_GET_VALIDATOR_ATTESTATION_EFFICIENCY
export const GetValidatorAttestationEfficiencyInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorAttestationEfficiencyInput = z.infer<
	typeof GetValidatorAttestationEfficiencyInputSchema
>;

// 20. BEACONCHAIN_GET_VALIDATOR_ATTESTATIONS
export const GetValidatorAttestationsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
	page: z.number().optional(),
});
export type GetValidatorAttestationsInput = z.infer<
	typeof GetValidatorAttestationsInputSchema
>;

// 21. BEACONCHAIN_GET_VALIDATOR_BLS_CHANGES
export const GetValidatorBlsChangesInputSchema = z.object({
	page: z.number().optional(),
});
export type GetValidatorBlsChangesInput = z.infer<
	typeof GetValidatorBlsChangesInputSchema
>;

// 22. BEACONCHAIN_GET_VALIDATOR_BALANCE_HISTORY
export const GetValidatorBalanceHistoryInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorBalanceHistoryInput = z.infer<
	typeof GetValidatorBalanceHistoryInputSchema
>;

// 23. BEACONCHAIN_GET_VALIDATOR_CONSENSUS_REWARDS
export const GetValidatorConsensusRewardsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorConsensusRewardsInput = z.infer<
	typeof GetValidatorConsensusRewardsInputSchema
>;

// 24. BEACONCHAIN_GET_VALIDATOR_DAILY_STATS
export const GetValidatorDailyStatsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorDailyStatsInput = z.infer<
	typeof GetValidatorDailyStatsInputSchema
>;

// 25. BEACONCHAIN_GET_VALIDATOR_DEPOSITS
export const GetValidatorDepositsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorDepositsInput = z.infer<
	typeof GetValidatorDepositsInputSchema
>;

// 26. BEACONCHAIN_GET_VALIDATOR_EXECUTION_REWARDS
export const GetValidatorExecutionRewardsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorExecutionRewardsInput = z.infer<
	typeof GetValidatorExecutionRewardsInputSchema
>;

// 27. BEACONCHAIN_GET_VALIDATOR_INCOME_HISTORY
export const GetValidatorIncomeHistoryInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorIncomeHistoryInput = z.infer<
	typeof GetValidatorIncomeHistoryInputSchema
>;

// 28. BEACONCHAIN_GET_VALIDATOR_LEADERBOARD
export const GetValidatorLeaderboardInputSchema = z.object({});
export type GetValidatorLeaderboardInput = z.infer<
	typeof GetValidatorLeaderboardInputSchema
>;

// 29. BEACONCHAIN_GET_VALIDATOR_PROPOSALS
export const GetValidatorProposalsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorProposalsInput = z.infer<
	typeof GetValidatorProposalsInputSchema
>;

// 30. BEACONCHAIN_GET_QUEUES
export const GetQueuesInputSchema = z.object({});
export type GetQueuesInput = z.infer<typeof GetQueuesInputSchema>;

// 31. BEACONCHAIN_GET_VALIDATOR_WITHDRAWALS
export const GetValidatorWithdrawalsInputSchema = z.object({
	indexOrPubkey: z.string().min(1, 'Validator index or public key is required'),
});
export type GetValidatorWithdrawalsInput = z.infer<
	typeof GetValidatorWithdrawalsInputSchema
>;

// 32. BEACONCHAIN_GET_VALIDATORS_PROPOSAL_LUCK
export const GetValidatorsProposalLuckInputSchema = z.object({
	validators: z.array(z.string()).optional(),
});
export type GetValidatorsProposalLuckInput = z.infer<
	typeof GetValidatorsProposalLuckInputSchema
>;

// 33. BEACONCHAIN_GET_VALIDATORS_QUEUE
export const GetValidatorsQueueInputSchema = z.object({});
export type GetValidatorsQueueInput = z.infer<
	typeof GetValidatorsQueueInputSchema
>;

// 34. BEACONCHAIN_GET_VALIDATORS_BY_DEPOSIT_ADDRESS
export const GetValidatorsByDepositAddressInputSchema = z.object({
	address: z.string().min(1, 'Deposit address is required'),
});
export type GetValidatorsByDepositAddressInput = z.infer<
	typeof GetValidatorsByDepositAddressInputSchema
>;

// 35. BEACONCHAIN_GET_VALIDATORS_BY_WITHDRAWAL_CREDENTIALS
export const GetValidatorsByWithdrawalCredentialsInputSchema = z.object({
	credentials: z.string().min(1, 'Withdrawal credentials are required'),
});
export type GetValidatorsByWithdrawalCredentialsInput = z.infer<
	typeof GetValidatorsByWithdrawalCredentialsInputSchema
>;

// 36. BEACONCHAIN_POST_VALIDATORS
export const PostValidatorsInputSchema = z.object({
	indicesOrPubkeys: z
		.array(z.string())
		.min(1, 'At least one validator index or pubkey is required'),
});
export type PostValidatorsInput = z.infer<typeof PostValidatorsInputSchema>;

// 37. BEACONCHAIN_RESOLVE_ENS
export const ResolveEnsInputSchema = z.object({
	name: z.string().min(1, 'ENS name is required'),
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
	getChart: BeaconchainBaseResponseSchema,
	getExecutionAddressErc20Tokens: BeaconchainBaseResponseSchema,
	getEthStoreDaily: BeaconchainBaseResponseSchema,
	getEth1DepositsByTxHash: BeaconchainBaseResponseSchema,
	getEpoch: BeaconchainBaseResponseSchema,
	getExecutionBlock: BeaconchainBaseResponseSchema,
	getExecutionProducedBlocks: BeaconchainBaseResponseSchema,
	getNodeHealth: BeaconchainBaseResponseSchema,
	getLatestState: BeaconchainBaseResponseSchema,
	getNetworkPerformance: BeaconchainBaseResponseSchema,
	getRocketpoolValidator: BeaconchainBaseResponseSchema,
	getSlot: BeaconchainBaseResponseSchema,
	getSlotAttestations: BeaconchainBaseResponseSchema,
	getSlotAttesterSlashings: BeaconchainBaseResponseSchema,
	getSlotProposerSlashings: BeaconchainBaseResponseSchema,
	getSlotVoluntaryExits: BeaconchainBaseResponseSchema,
	getSyncCommittee: BeaconchainBaseResponseSchema,
	getValidator: BeaconchainBaseResponseSchema,
	getValidatorAttestationEfficiency: BeaconchainBaseResponseSchema,
	getValidatorAttestations: BeaconchainBaseResponseSchema,
	getValidatorBlsChanges: BeaconchainBaseResponseSchema,
	getValidatorBalanceHistory: BeaconchainBaseResponseSchema,
	getValidatorConsensusRewards: BeaconchainBaseResponseSchema,
	getValidatorDailyStats: BeaconchainBaseResponseSchema,
	getValidatorDeposits: BeaconchainBaseResponseSchema,
	getValidatorExecutionRewards: BeaconchainBaseResponseSchema,
	getValidatorIncomeHistory: BeaconchainBaseResponseSchema,
	getValidatorLeaderboard: BeaconchainBaseResponseSchema,
	getValidatorProposals: BeaconchainBaseResponseSchema,
	getQueues: BeaconchainBaseResponseSchema,
	getValidatorWithdrawals: BeaconchainBaseResponseSchema,
	getValidatorsProposalLuck: BeaconchainBaseResponseSchema,
	getValidatorsQueue: BeaconchainBaseResponseSchema,
	getValidatorsByDepositAddress: BeaconchainBaseResponseSchema,
	getValidatorsByWithdrawalCredentials: BeaconchainBaseResponseSchema,
	postValidators: BeaconchainBaseResponseSchema,
	resolveEns: BeaconchainBaseResponseSchema,
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
	getChart: BeaconchainBaseResponse;
	getExecutionAddressErc20Tokens: BeaconchainBaseResponse;
	getEthStoreDaily: BeaconchainBaseResponse;
	getEth1DepositsByTxHash: BeaconchainBaseResponse;
	getEpoch: BeaconchainBaseResponse;
	getExecutionBlock: BeaconchainBaseResponse;
	getExecutionProducedBlocks: BeaconchainBaseResponse;
	getNodeHealth: BeaconchainBaseResponse;
	getLatestState: BeaconchainBaseResponse;
	getNetworkPerformance: BeaconchainBaseResponse;
	getRocketpoolValidator: BeaconchainBaseResponse;
	getSlot: BeaconchainBaseResponse;
	getSlotAttestations: BeaconchainBaseResponse;
	getSlotAttesterSlashings: BeaconchainBaseResponse;
	getSlotProposerSlashings: BeaconchainBaseResponse;
	getSlotVoluntaryExits: BeaconchainBaseResponse;
	getSyncCommittee: BeaconchainBaseResponse;
	getValidator: BeaconchainBaseResponse;
	getValidatorAttestationEfficiency: BeaconchainBaseResponse;
	getValidatorAttestations: BeaconchainBaseResponse;
	getValidatorBlsChanges: BeaconchainBaseResponse;
	getValidatorBalanceHistory: BeaconchainBaseResponse;
	getValidatorConsensusRewards: BeaconchainBaseResponse;
	getValidatorDailyStats: BeaconchainBaseResponse;
	getValidatorDeposits: BeaconchainBaseResponse;
	getValidatorExecutionRewards: BeaconchainBaseResponse;
	getValidatorIncomeHistory: BeaconchainBaseResponse;
	getValidatorLeaderboard: BeaconchainBaseResponse;
	getValidatorProposals: BeaconchainBaseResponse;
	getQueues: BeaconchainBaseResponse;
	getValidatorWithdrawals: BeaconchainBaseResponse;
	getValidatorsProposalLuck: BeaconchainBaseResponse;
	getValidatorsQueue: BeaconchainBaseResponse;
	getValidatorsByDepositAddress: BeaconchainBaseResponse;
	getValidatorsByWithdrawalCredentials: BeaconchainBaseResponse;
	postValidators: BeaconchainBaseResponse;
	resolveEns: BeaconchainBaseResponse;
};
