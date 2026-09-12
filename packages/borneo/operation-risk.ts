import type { BorneoOperationId, BorneoRiskLevel } from './operations';
import { BORNEO_OPERATIONS } from './operations';

export type { BorneoRiskLevel };

export const BORNEO_TOOL_RISK = Object.fromEntries(
	BORNEO_OPERATIONS.map((operation) => [operation.id, operation.riskLevel]),
) as Record<BorneoOperationId, BorneoRiskLevel>;
