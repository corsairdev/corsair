'use client';

import { createCodeUsageGeneratorRegistry } from 'fumadocs-openapi/requests/generators';
import { curl } from 'fumadocs-openapi/requests/generators/curl';
import { go } from 'fumadocs-openapi/requests/generators/go';
import { javascript } from 'fumadocs-openapi/requests/generators/javascript';
import { python } from 'fumadocs-openapi/requests/generators/python';
import { createOpenAPIPage } from 'fumadocs-openapi/ui';

// `registerDefault` also adds java, csharp and rust. We ship no client in any
// of them, and seven tabs crowd the example panel.
const codeUsages = createCodeUsageGeneratorRegistry();
codeUsages.add('js', javascript);
codeUsages.add('python', python);
codeUsages.add('go', go);
codeUsages.add('curl', curl);

export const OpenAPIPage = createOpenAPIPage({
	codeUsages,
	// auth.corsair.dev answers the preflight 401 with no Access-Control-* headers,
	// so every Send failed. The key is also a server secret with full project
	// authority, which does not belong in a browser.
	playground: { enabled: false },
});
