import type { WebhookTenantMatch } from 'corsair/core';

export function matchBunnycdnTenantWebhook(body: any): WebhookTenantMatch | null {
    const tenantCode = body?.tenant?.code || body?.payload?.tenant?.code;

    if (!tenantCode) return null;

    return { 
        linkType: 'account' as const, 
        externalId: String(tenantCode)
    };
}