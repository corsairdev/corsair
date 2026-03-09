export type PermissionStatus =
  | 'pending'
  | 'granted'
  | 'declined'
  | 'completed'
  | (string & {});

export type PermissionLike = {
  id: string;
  plugin: string;
  endpoint: string;
  operation?: string | null;
  description: string;
  status: PermissionStatus;
  args?: Record<string, unknown> | null;
  createdAt: Date | string;
};

export type PermissionAction = 'approve' | 'decline';

export type PermissionActionDescriptor = {
  method: 'GET' | 'POST';
  url: string;
};

export type PermissionActionCallback = (
  perm: PermissionLike,
) => PermissionActionDescriptor;

