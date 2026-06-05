import 'dotenv/config';
import {
    createCorsair,
} from 'corsair/core';

import {
    createIntegrationAndAccount,
    createTestDatabase,
} from 'corsair/tests';

import {
    getValidFacebookAccessToken,
    makeInstagramRequest,
    makeAuthenticatedInstagramRequest,
} from './client';

import { instagram } from './index';


async function createInstagramClient() {

    const appId =
        process.env.FACEBOOK_APP_ID;

    const appSecret =
        process.env.FACEBOOK_APP_SECRET;

    const accessToken =
        process.env.IG_ACCESS_TOKEN;

    if (
        !appId ||
        !appSecret ||
        !accessToken
    ) {
        throw new Error(
            'Missing environment variables'
        );
    }

    const testDb =
        createTestDatabase();

    await createIntegrationAndAccount(
        testDb.db,
        'instagram'
    );

    const integrations = await testDb.db
    .selectFrom('corsair_integrations')
    .selectAll()
    .execute();

    const accounts = await testDb.db
    .selectFrom('corsair_accounts')
    .selectAll()
    .execute();

console.log(accounts);

    console.log(integrations);

    const corsair =
        createCorsair({
            // multiTenancy: true,
            plugins: [
                instagram({
                    authType: 'oauth_2',
                }),
            ],
            database: testDb.db,
            kek:
                process.env.CORSAIR_KEK!,
        });

    // Integration Keys
   
    await corsair.keys.instagram
        .issue_new_dek();

    await corsair.keys.instagram
        .set_client_id(appId);

    await corsair.keys.instagram
        .set_client_secret(appSecret);

    // User Keys

    await corsair.instagram.keys
        .issue_new_dek();

    await corsair.instagram.keys
        .set_access_token(accessToken);

    // for multitendency = true
    // const tenant = corsair.withTenant('default');
    // await tenant.instagram.keys.issue_new_dek();
    // await tenant.instagram.keys.set_access_token(accessToken);

    return corsair;
}

export const corsair = await createInstagramClient();
