import { backupsOperations } from '../operations/backups';
import type { PrismaEndpoint } from './factory';
import {
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

function getOperation(name: (typeof backupsOperations)[number]['name']) {
	const operation = backupsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[prisma] missing operation: ${name}`);
	}
	return operation;
}

const listBackupsDefinition = getOperation('list');
export const listBackups: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		listBackupsDefinition,
	);
	await syncPrismaOperationResult(ctx, listBackupsDefinition, input, result);
	await logPrismaOperation(ctx, input, listBackupsDefinition);
	return result;
};

const restoreBackupDefinition = getOperation('restore');
export const restoreBackup: PrismaEndpoint = async (ctx, input = {}) => {
	const result = await requestPrismaOperation(
		ctx,
		input,
		restoreBackupDefinition,
	);
	await logPrismaOperation(ctx, input, restoreBackupDefinition);
	return result;
};

export const BackupsEndpoints = {
	list: listBackups,
	restore: restoreBackup,
} as const;
