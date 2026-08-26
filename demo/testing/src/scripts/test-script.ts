import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

import { DocusignClient, docusignPlugin } from '@corsair-dev/docusign';
import { corsair } from '../server/corsair';

async function main() {
	console.log('🚀 Running DocuSign Integration Test...\n');

	// 1. Verify Plugin Metadata & Exported Operations
	console.log('Plugin ID:', docusignPlugin.id);
	console.log('Plugin Name:', docusignPlugin.name);
	console.log('Available Endpoints:', Object.keys(docusignPlugin.endpoints));

	// 2. Test Client Instantiation
	const client = new DocusignClient({
		accessToken: process.env.DOCUSIGN_ACCESS_TOKEN ?? 'test_access_token',
		accountId: process.env.DOCUSIGN_ACCOUNT_ID ?? 'test_account_id',
		baseUri: 'https://demo.docusign.net/restapi',
	});

	console.log('Client Base URI configured:', client.baseUri);

	// 3. Verify Corsair Server Instance is loaded
	console.log('Corsair Server instance active:', !!corsair);

	console.log('\n✅ DocuSign Integration test completed successfully!');
}

main().catch((err) => {
	console.error('Test execution failed:', err);
	process.exit(1);
});
