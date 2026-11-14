import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
	FeltEndpointInputSchemas,
	FeltEndpointOutputSchemas,
	FeltIdSchema,
} from './endpoints/types';
import { FeltSchema } from './schema';

describe('Felt schema', () => {
	it('declares a semver version', () => {
		expect(FeltSchema.version).toBeDefined();
		expect(FeltSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FeltSchema.entities).toBe('object');
		expect(FeltSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FeltSchema.entities))).toBe(true);
	});
});

describe('User schemas', () => {
	it('validates usersGetCurrent input and output', () => {
		expect(FeltEndpointInputSchemas.usersGetCurrent.parse({})).toEqual({});
		// Strict check: rejects extra properties
		expect(() =>
			// `unknown` because testing invalid input types against strict schema.
			FeltEndpointInputSchemas.usersGetCurrent.parse({
				extra: 'field',
			} as unknown),
		).toThrow();

		const validUser = {
			id: 'u_123',
			email: 'user@example.com',
			name: 'Test User',
		};
		expect(FeltEndpointOutputSchemas.usersGetCurrent.parse(validUser)).toEqual(
			validUser,
		);
	});
});

describe('Maps schemas', () => {
	it('validates mapsCreate input and output', () => {
		const validInput = {
			title: 'New Map',
			public_access: 'view_only' as const,
			basemap: 'satellite',
		};
		expect(FeltEndpointInputSchemas.mapsCreate.parse(validInput)).toEqual(
			validInput,
		);

		// Reject invalid public_access enum
		expect(() =>
			// `unknown` because testing invalid enum values against Zod schema.
			FeltEndpointInputSchemas.mapsCreate.parse({
				public_access: 'invalid_access',
			} as unknown),
		).toThrow();

		const validMap = {
			id: 'map_123',
			type: 'map',
			title: 'New Map',
			public_access: 'view_only',
		};
		expect(FeltEndpointOutputSchemas.mapsCreate.parse(validMap)).toMatchObject(
			validMap,
		);
	});

	it('validates mapsGet input and output', () => {
		expect(FeltEndpointInputSchemas.mapsGet.parse({ map_id: 'm1' })).toEqual({
			map_id: 'm1',
		});
		expect(() =>
			FeltEndpointInputSchemas.mapsGet.parse({ map_id: '' }),
		).toThrow();
	});

	it('validates mapsUpdate input', () => {
		const valid = {
			map_id: 'm1',
			title: 'Updated Title',
			public_access: 'private' as const,
		};
		expect(FeltEndpointInputSchemas.mapsUpdate.parse(valid)).toEqual(valid);
	});

	it('validates mapsDelete input and output', () => {
		expect(FeltEndpointInputSchemas.mapsDelete.parse({ map_id: 'm1' })).toEqual(
			{ map_id: 'm1' },
		);
		const out = { success: true, id: 'm1' };
		expect(FeltEndpointOutputSchemas.mapsDelete.parse(out)).toEqual(out);
	});

	it('validates mapsDuplicate input', () => {
		const valid = { map_id: 'm1', title: 'Copy of Map' };
		expect(FeltEndpointInputSchemas.mapsDuplicate.parse(valid)).toEqual(valid);
	});

	it('validates mapsMove input', () => {
		const valid = { map_id: 'm1', project_id: 'p1' };
		expect(FeltEndpointInputSchemas.mapsMove.parse(valid)).toEqual(valid);
	});

	it('validates mapsExportImage input and output', () => {
		const valid = {
			map_id: 'm1',
			units: 'metric' as const,
			output: { format: 'png' as const, width_px: 1920, height_px: 1080 },
		};
		expect(FeltEndpointInputSchemas.mapsExportImage.parse(valid)).toEqual(
			valid,
		);

		const out = {
			id: 'exp_1',
			status: 'completed',
			download_url: 'https://example.com/dl',
		};
		expect(FeltEndpointOutputSchemas.mapsExportImage.parse(out)).toMatchObject(
			out,
		);
	});

	it('validates mapsCreateEmbedToken input and output', () => {
		const valid = { map_id: 'm1', user_email: 'embed@example.com' };
		expect(FeltEndpointInputSchemas.mapsCreateEmbedToken.parse(valid)).toEqual(
			valid,
		);

		const out = { token: 'tok_abc', expires_at: '2026-12-01T00:00:00Z' };
		expect(
			FeltEndpointOutputSchemas.mapsCreateEmbedToken.parse(out),
		).toMatchObject(out);
	});
});

describe('Layers schemas', () => {
	it('validates layersList input and output', () => {
		expect(
			FeltEndpointInputSchemas.layersList.parse({
				map_id: 'm1',
				include_uploading: false,
			}),
		).toEqual({
			map_id: 'm1',
			include_uploading: false,
		});

		const out = [{ id: 'l1', name: 'Layer 1', status: 'completed' }];
		expect(FeltEndpointOutputSchemas.layersList.parse(out)).toEqual(out);
	});

	it('validates layersGet input and output', () => {
		expect(
			FeltEndpointInputSchemas.layersGet.parse({
				map_id: 'm1',
				layer_id: 'l1',
			}),
		).toEqual({
			map_id: 'm1',
			layer_id: 'l1',
		});
	});

	it('validates layersUpload input and output', () => {
		const valid = {
			map_id: 'm1',
			name: 'Uploaded Layer',
			import_url: 'https://example.com/data.geojson',
		};
		expect(FeltEndpointInputSchemas.layersUpload.parse(valid)).toEqual(valid);

		const out = { layer_id: 'l1', url: 'https://s3.example.com/upload' };
		expect(FeltEndpointOutputSchemas.layersUpload.parse(out)).toMatchObject(
			out,
		);
	});

	it('validates layersUpdateStyle input and output', () => {
		const valid = {
			map_id: 'm1',
			layer_id: 'l1',
			style: { color: 'red', size: 5 },
		};
		expect(FeltEndpointInputSchemas.layersUpdateStyle.parse(valid)).toEqual(
			valid,
		);
	});

	it('validates layersCustomExport input and poll output', () => {
		const valid = {
			map_id: 'm1',
			layer_id: 'l1',
			output_format: 'geojson',
		};
		expect(
			FeltEndpointInputSchemas.layersCreateCustomExport.parse(valid),
		).toEqual(valid);

		const pollOut = {
			export_id: 'exp_1',
			status: 'completed',
			download_url: 'https://example.com/dl.zip',
		};
		expect(
			FeltEndpointOutputSchemas.layersPollCustomExport.parse(pollOut),
		).toMatchObject(pollOut);
	});
});

describe('Layer Groups schemas', () => {
	it('validates layer groups CRUD schemas', () => {
		const listIn = { map_id: 'm1' };
		expect(FeltEndpointInputSchemas.layerGroupsList.parse(listIn)).toEqual(
			listIn,
		);

		const updateIn = {
			map_id: 'm1',
			layer_group_id: 'lg1',
			name: 'Group 1',
			legend_visibility: 'show' as const,
		};
		expect(FeltEndpointInputSchemas.layerGroupsUpdate.parse(updateIn)).toEqual(
			updateIn,
		);

		const outGroup = {
			id: 'lg1',
			name: 'Group 1',
			legend_visibility: 'show' as const,
		};
		expect(
			FeltEndpointOutputSchemas.layerGroupsGet.parse(outGroup),
		).toMatchObject(outGroup);
	});
});

describe('Layer Components schemas', () => {
	it('validates layer components CRUD schemas', () => {
		const createIn = {
			map_id: 'm1',
			layer_id: 'l1',
			component: { type: 'chart', title: 'Layer Chart' },
		};
		expect(
			FeltEndpointInputSchemas.layerComponentsCreate.parse(createIn),
		).toEqual(createIn);

		const outComp = {
			id: 'c1',
			type: 'chart',
			config: { title: 'Layer Chart' },
		};
		expect(
			FeltEndpointOutputSchemas.layerComponentsCreate.parse(outComp),
		).toMatchObject(outComp);
	});
});

describe('Elements schemas', () => {
	it('validates elementsList and elementsUpsert GeoJSON schemas', () => {
		const listIn = { map_id: 'm1' };
		expect(FeltEndpointInputSchemas.elementsList.parse(listIn)).toEqual(listIn);

		const upsertIn = {
			map_id: 'm1',
			features: [
				{
					type: 'Feature',
					geometry: { type: 'Point', coordinates: [0, 0] },
					properties: { name: 'Pin' },
				},
			],
		};
		expect(FeltEndpointInputSchemas.elementsUpsert.parse(upsertIn)).toEqual(
			upsertIn,
		);

		const geojsonOut = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					geometry: { type: 'Point', coordinates: [0, 0] },
					properties: { name: 'Pin' },
				},
			],
		};
		expect(
			FeltEndpointOutputSchemas.elementsList.parse(geojsonOut),
		).toMatchObject(geojsonOut);
	});
});

describe('Comments schemas', () => {
	it('validates comments export, resolve and delete schemas', () => {
		const expIn = { map_id: 'm1', format: 'json' as const };
		expect(FeltEndpointInputSchemas.commentsExport.parse(expIn)).toEqual(expIn);

		const resIn = { map_id: 'm1', comment_id: 'c1' };
		expect(FeltEndpointInputSchemas.commentsResolve.parse(resIn)).toEqual(
			resIn,
		);

		const resOut = { comment_id: 'c1' };
		expect(FeltEndpointOutputSchemas.commentsResolve.parse(resOut)).toEqual(
			resOut,
		);
	});
});

describe('Projects schemas', () => {
	it('validates projects CRUD schemas', () => {
		const createIn = {
			name: 'Q4 Maps',
			visibility: 'workspace' as const,
			max_inherited_permission: 'view_only' as const,
		};
		expect(FeltEndpointInputSchemas.projectsCreate.parse(createIn)).toEqual(
			createIn,
		);

		const projOut = {
			id: 'p1',
			name: 'Q4 Maps',
			visibility: 'workspace' as const,
			max_inherited_permission: 'view_only' as const,
			maps: [],
		};
		expect(FeltEndpointOutputSchemas.projectsGet.parse(projOut)).toMatchObject(
			projOut,
		);
	});
});

describe('Sources schemas', () => {
	it('validates sources CRUD and credentials schemas', () => {
		const createIn = {
			name: 'Postgres DB',
			connection: { host: 'db.example.com', port: 5432, database: 'gis' },
		};
		expect(FeltEndpointInputSchemas.sourcesCreate.parse(createIn)).toEqual(
			createIn,
		);

		const credIn = {
			source_id: 's1',
			name: 'DB Password',
			use_case: 'source_authentication' as const,
			credential: { password: 'secret-password' },
		};
		expect(
			FeltEndpointInputSchemas.sourcesCreateCredential.parse(credIn),
		).toEqual(credIn);

		const credOut = {
			id: 'cred_1',
			source_id: 's1',
			name: 'DB Password',
		};
		expect(
			FeltEndpointOutputSchemas.sourcesCreateCredential.parse(credOut),
		).toMatchObject(credOut);
	});
});

describe('Print Pages schemas', () => {
	it('validates print layouts and pages schemas', () => {
		const layoutIn = { map_id: 'm1', page_id: 'pg1', name: 'Poster Layout' };
		expect(
			FeltEndpointInputSchemas.printPagesCreateLayout.parse(layoutIn),
		).toEqual(layoutIn);

		const pageIn = {
			map_id: 'm1',
			name: 'A4 Page',
			page: { size: 'A4', orientation: 'landscape' },
		};
		expect(FeltEndpointInputSchemas.printPagesCreatePage.parse(pageIn)).toEqual(
			pageIn,
		);

		const exportIn = { map_id: 'm1', page_id: 'pg1' };
		expect(
			FeltEndpointInputSchemas.printPagesExportPage.parse(exportIn),
		).toEqual(exportIn);

		const exportOut = {
			id: 'pexp_1',
			page_id: 'pg1',
			download_url: 'https://example.com/print.pdf',
		};
		expect(
			FeltEndpointOutputSchemas.printPagesExportPage.parse(exportOut),
		).toMatchObject(exportOut);
	});
});

describe('plugin-docs.yaml examples', () => {
	it('validates every example in plugin-docs.yaml against endpoint input schemas', () => {
		const docPath = path.resolve(__dirname, 'plugin-docs.yaml');
		// `unknown` because parsed YAML contains untyped document trees before schema assertions.
		const doc = parseYaml(fs.readFileSync(docPath, 'utf8')) as {
			// `unknown` because apiExamples holds untyped example objects.
			apiExamples?: Record<string, unknown>;
			examples?: {
				// `unknown` because read example arguments are untyped test inputs.
				read?: { path: string; args?: unknown };
				// `unknown` because write example arguments are untyped test inputs.
				write?: { path: string; args?: unknown };
			};
		};

		function dotToCamel(dot: string): string {
			const parts = dot.split('.');
			return `${parts[0]}${parts[1] ? parts[1].charAt(0).toUpperCase() + parts[1].slice(1) : ''}`;
		}

		// `unknown` because schemas map maps string keys to Zod parsers handling arbitrary test values.
		const schemas = FeltEndpointInputSchemas as Record<
			string,
			// `unknown` because Zod parser inputs and outputs are untrusted at dynamic invocation sites.
			{ parse: (val: unknown) => unknown }
		>;

		for (const [dotPath, example] of Object.entries(doc.apiExamples ?? {})) {
			const schemaName = dotToCamel(dotPath);
			const schema = schemas[schemaName];
			expect(schema).toBeDefined();
			if (!schema) continue;
			expect(() => schema.parse(example)).not.toThrow();
		}

		if (doc.examples?.read) {
			const readExample = doc.examples.read;
			const schema = schemas[dotToCamel(readExample.path)];
			expect(schema).toBeDefined();
			if (schema) {
				expect(() => schema.parse(readExample.args ?? {})).not.toThrow();
			}
		}

		if (doc.examples?.write) {
			const writeExample = doc.examples.write;
			const schema = schemas[dotToCamel(writeExample.path)];
			expect(schema).toBeDefined();
			if (schema) {
				expect(() => schema.parse(writeExample.args ?? {})).not.toThrow();
			}
		}
	});
});

describe('FeltIdSchema', () => {
	it('rejects dot segments that URL parsing would remove from a path', () => {
		expect(FeltIdSchema.safeParse('.').success).toBe(false);
		expect(FeltIdSchema.safeParse('..').success).toBe(false);
		expect(FeltIdSchema.safeParse('').success).toBe(false);
		expect(FeltIdSchema.parse('l_1..2')).toBe('l_1..2');
		expect(
			FeltEndpointInputSchemas.layersDelete.safeParse({
				map_id: 'm_1',
				layer_id: '..',
			}).success,
		).toBe(false);
	});
});
