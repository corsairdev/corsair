import type { CorsairPermission } from 'corsair/db';

type p = CorsairPermission;

export type PermissionStatus = CorsairPermission['status'];

export type PermissionLike = CorsairPermission & { description?: string };

export type PermissionAction = 'approve' | 'decline';

export type PermissionActionDescriptor = {
	method: 'GET' | 'POST';
	url: string;
};

export type PermissionActionCallback = (
	perm: PermissionLike,
) => PermissionActionDescriptor;
