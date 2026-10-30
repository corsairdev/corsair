import { logEventFromContext } from 'corsair/core';
import type { SourcegraphEndpoints } from '..';
import { sourcegraphGraphql } from '../client';
import { SourcegraphEndpointOutputSchemas } from './types';

const CHECK_SITE_SETTINGS_EDIT_PERMISSION = `
query CheckSiteSettingsEditPermission {
  site {
    id
    siteID
    canReloadSite
    viewerCanAdminister
  }
  currentUser {
    siteAdmin
    viewerCanAdminister
  }
}
`;

export const checkSettingsEditPermission: SourcegraphEndpoints['checkSiteSettingsEditPermission'] =
	async (ctx, input) => {
		const data = await sourcegraphGraphql<{
			site?: { viewerCanAdminister?: boolean } | null;
			currentUser?: {
				siteAdmin?: boolean;
				viewerCanAdminister?: boolean;
			} | null;
		}>(
			ctx.key,
			CHECK_SITE_SETTINGS_EDIT_PERMISSION,
			undefined,
			ctx.options?.instanceUrl,
		);

		const parsed =
			SourcegraphEndpointOutputSchemas.checkSiteSettingsEditPermission.parse({
				...data,
				canEditSiteSettings: Boolean(data.site?.viewerCanAdminister),
			});

		await logEventFromContext(
			ctx,
			'sourcegraph.site.checkSettingsEditPermission',
			{ ...input },
			'completed',
		);

		return parsed;
	};
