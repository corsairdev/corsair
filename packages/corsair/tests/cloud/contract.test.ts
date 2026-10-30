import contract from '../../core/cloud/contract.openapi.yaml';
import { CLOUD_ROUTES } from '../../core/cloud/routes';

function toOpenapiPath(template: string): string {
	return template.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

describe('cloud route contract', () => {
	const paths = Object.keys((contract as any).paths);

	it.each(Object.entries(CLOUD_ROUTES))(
		'%s (%s) exists in the runtime openapi contract',
		(_name, template) => {
			expect(paths).toContain(toOpenapiPath(template));
		},
	);
});
