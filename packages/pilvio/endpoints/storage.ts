import type { PilvioEndpoints } from '..';
import { call } from './call';
import {
	PilvioEndpointInputSchemas as Inputs,
	PilvioEndpointOutputSchemas as Outputs,
} from './types';

const DISKS = '/v1/storage/disks';
const BUCKET = '/v1/storage/bucket';

export const listDisks: PilvioEndpoints['disksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'disks.list',
			input: Inputs.disksList,
			output: Outputs.disksList,
		},
		input,
		() => ({ method: 'GET', path: DISKS }),
		{ log: (_, disks) => ({ count: disks.length }) },
	);

export const createDisk: PilvioEndpoints['disksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'disks.create',
			input: Inputs.disksCreate,
			output: Outputs.disksCreate,
		},
		input,
		({
			sizeGb,
			sourceImageType,
			sourceImage,
			displayName,
			billingAccountId,
		}) => ({
			method: 'POST',
			path: DISKS,
			body: {
				size_gb: sizeGb,
				source_image_type: sourceImageType,
				source_image: sourceImage,
				display_name: displayName,
				billing_account_id: billingAccountId,
			},
		}),
		{ log: (_, disk) => ({ diskUuid: disk.uuid ?? undefined }) },
	);

export const getDisk: PilvioEndpoints['disksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'disks.get',
			input: Inputs.disksGet,
			output: Outputs.disksGet,
		},
		input,
		({ uuid }) => ({
			method: 'GET',
			path: `${DISKS}/${encodeURIComponent(uuid)}`,
		}),
		{ log: (_, disk) => ({ diskUuid: disk.uuid ?? undefined }) },
	);

export const updateDisk: PilvioEndpoints['disksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'disks.update',
			input: Inputs.disksUpdate,
			output: Outputs.disksUpdate,
		},
		input,
		({ uuid, displayName, billingAccountId }) => ({
			method: 'PATCH',
			path: `${DISKS}/${encodeURIComponent(uuid)}`,
			body: { display_name: displayName, billing_account_id: billingAccountId },
		}),
		{ log: (_, disk) => ({ diskUuid: disk.uuid ?? undefined }) },
	);

export const deleteDisk: PilvioEndpoints['disksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'disks.delete',
			input: Inputs.disksDelete,
			output: Outputs.disksDelete,
		},
		input,
		({ uuid }) => ({
			method: 'DELETE',
			path: `${DISKS}/${encodeURIComponent(uuid)}`,
		}),
		{ log: ({ uuid }) => ({ diskUuid: uuid }) },
	);

export const listBuckets: PilvioEndpoints['bucketsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'buckets.list',
			input: Inputs.bucketsList,
			output: Outputs.bucketsList,
		},
		input,
		() => ({ method: 'GET', path: `${BUCKET}/list` }),
		{ log: (_, buckets) => ({ count: buckets.length }) },
	);

export const createBucket: PilvioEndpoints['bucketsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'buckets.create',
			input: Inputs.bucketsCreate,
			output: Outputs.bucketsCreate,
		},
		input,
		({ name, billingAccountId }) => ({
			method: 'PUT',
			path: BUCKET,
			body: { name, billing_account_id: billingAccountId },
		}),
		{ log: (_, bucket) => ({ bucket: bucket.name ?? undefined }) },
	);

export const getBucket: PilvioEndpoints['bucketsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'buckets.get',
			input: Inputs.bucketsGet,
			output: Outputs.bucketsGet,
		},
		input,
		({ name }) => ({ method: 'GET', path: BUCKET, query: { name } }),
		{ log: (_, bucket) => ({ bucket: bucket.name ?? undefined }) },
	);

export const updateBucket: PilvioEndpoints['bucketsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'buckets.update',
			input: Inputs.bucketsUpdate,
			output: Outputs.bucketsUpdate,
		},
		input,
		({ name, billingAccountId }) => ({
			method: 'PATCH',
			path: BUCKET,
			body: { name, billing_account_id: billingAccountId },
		}),
		{ log: (_, bucket) => ({ bucket: bucket.name ?? undefined }) },
	);

export const deleteBucket: PilvioEndpoints['bucketsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'buckets.delete',
			input: Inputs.bucketsDelete,
			output: Outputs.bucketsDelete,
		},
		input,
		({ name }) => ({
			method: 'DELETE',
			path: BUCKET,
			query: { name },
		}),
		{ log: ({ name }) => ({ bucket: name }) },
	);
