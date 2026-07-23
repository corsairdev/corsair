import { snapshotsOperations } from '../operations/snapshots';
import type { NeonEndpoint } from './factory';
import {
	logNeonOperation,
	requestNeonOperation,
	syncNeonOperationResult,
} from './factory';

function getOperation(name: (typeof snapshotsOperations)[number]['name']) {
	const operation = snapshotsOperations.find(
		(candidate) => candidate.name === name,
	);
	if (!operation) {
		throw new Error(`[neon] missing operation: ${name}`);
	}
	return operation;
}

const createSnapshotDefinition = getOperation('createSnapshot');
export const createSnapshot: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		createSnapshotDefinition,
	);
	await syncNeonOperationResult(ctx, createSnapshotDefinition, input, result);
	await logNeonOperation(ctx, input, createSnapshotDefinition);
	return result;
};

const listSnapshotsDefinition = getOperation('listSnapshots');
export const listSnapshots: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		listSnapshotsDefinition,
	);
	await syncNeonOperationResult(ctx, listSnapshotsDefinition, input, result);
	await logNeonOperation(ctx, input, listSnapshotsDefinition);
	return result;
};

const updateSnapshotDefinition = getOperation('updateSnapshot');
export const updateSnapshot: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		updateSnapshotDefinition,
	);
	await syncNeonOperationResult(ctx, updateSnapshotDefinition, input, result);
	await logNeonOperation(ctx, input, updateSnapshotDefinition);
	return result;
};

const deleteSnapshotDefinition = getOperation('deleteSnapshot');
export const deleteSnapshot: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		deleteSnapshotDefinition,
	);
	await syncNeonOperationResult(ctx, deleteSnapshotDefinition, input, result);
	await logNeonOperation(ctx, input, deleteSnapshotDefinition);
	return result;
};

const restoreSnapshotDefinition = getOperation('restoreSnapshot');
export const restoreSnapshot: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		restoreSnapshotDefinition,
	);
	await syncNeonOperationResult(ctx, restoreSnapshotDefinition, input, result);
	await logNeonOperation(ctx, input, restoreSnapshotDefinition);
	return result;
};

const getSnapshotScheduleDefinition = getOperation('getSnapshotSchedule');
export const getSnapshotSchedule: NeonEndpoint = async (ctx, input = {}) => {
	const result = await requestNeonOperation(
		ctx,
		input,
		getSnapshotScheduleDefinition,
	);
	await syncNeonOperationResult(
		ctx,
		getSnapshotScheduleDefinition,
		input,
		result,
	);
	await logNeonOperation(ctx, input, getSnapshotScheduleDefinition);
	return result;
};

export const SnapshotsEndpoints = {
	createSnapshot,
	listSnapshots,
	updateSnapshot,
	deleteSnapshot,
	restoreSnapshot,
	getSnapshotSchedule,
} as const;
