import {
	makeUploadcareRequest,
	makeUploadcareUploadRequest,
	publicKeyFromAuth,
} from './client';
import { UploadcareEndpointOutputSchemas } from './endpoints/types';

const API_KEY = process.env.UPLOADCARE_API_KEY;
const secret = API_KEY?.split(':')[1]?.trim() ?? '';
const hasPublic = Boolean(API_KEY);
const hasSecret = Boolean(
	secret && !/^(your_secret|xxx|changeme|secret)$/i.test(secret),
);

const rest = hasSecret ? it : it.skip;
const upload = hasPublic ? it : it.skip;

describe('Uploadcare live API', () => {
	rest('project.get matches official schema', async () => {
		const result = await makeUploadcareRequest('/project/', API_KEY!, {
			method: 'GET',
		});
		const parsed = UploadcareEndpointOutputSchemas.projectGet.parse(result);
		expect(parsed.pub_key || parsed.name).toBeTruthy();
	});

	rest('files.list matches official schema', async () => {
		const result = await makeUploadcareRequest('/files/', API_KEY!, {
			method: 'GET',
			query: { limit: 5 },
		});
		UploadcareEndpointOutputSchemas.filesList.parse(result);
	});

	upload('upload.from_url accepts the public key', async () => {
		const result = await makeUploadcareUploadRequest('/from_url/', {
			method: 'POST',
			formData: {
				pub_key: publicKeyFromAuth(API_KEY!),
				source_url: 'https://uploadcare.com/favicon.ico',
			},
		});
		UploadcareEndpointOutputSchemas.uploadFromUrl.parse(result);
	});
});
