import { backupsOperations } from '../operations/backups';
import type { PrismaEndpoint } from './factory';
import {
	findOperation,
	logPrismaOperation,
	requestPrismaOperation,
	syncPrismaOperationResult,
} from './factory';

const listBackupsDefinition = findOperation(backupsOperations, 'list');
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

const restoreBackupDefinition = findOperation(backupsOperations, 'restore');
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
