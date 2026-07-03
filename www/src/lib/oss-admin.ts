export const OSS_ADMIN_EMAIL = 'dev@corsair.dev';

export function isOssAdminEmail(email: string | null | undefined): boolean {
	return email?.toLowerCase() === OSS_ADMIN_EMAIL;
}
