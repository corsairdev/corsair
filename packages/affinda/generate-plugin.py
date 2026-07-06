#!/usr/bin/env python3
"""Generate the Affinda Corsair plugin from Composio toolkit MD and manual routes."""

from __future__ import annotations

import json
import re
import textwrap
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parents[1]
COMPOSIO_MD = Path("/tmp/affinda_composio.md")


PLUGIN_ID = "affinda"
PASCAL = "Affinda"
CAMEL = "affinda"
PACKAGE_NAME = "@corsair-dev/affinda"
BASE_URL = "https://api.affinda.com/v3"
PREFIX = "AFFINDA_"

from routes_data import MANUAL_ROUTES

PATH_PARAM_ALIASES: dict[str, list[str]] = {
	"identifier": ["identifier", "collection_id", "collectionId", "document_id", "documentId"],
	"id": ["id"],
	"name": ["name", "index_name", "indexName"],
	"datapoint_identifier": ["datapoint_identifier", "datapointIdentifier", "data_point_id"],
	"value": ["value"],
	"token": ["token"],
}


@dataclass
class Param:
    name: str
    type: str
    required: bool
    description: str = ""


@dataclass
class Operation:
    slug: str
    name: str
    description: str
    params: list[Param] = field(default_factory=list)


@dataclass
class Route:
    key: str
    group: str
    name: str
    method: str
    path: str
    description: str
    path_params: list[str]
    query_params: list[str]
    params: list[Param]
    slug: str
    risk_level: str


def to_camel_case(value: str) -> str:
    parts = re.split(r"[_\s-]+", value)
    if not parts:
        return value
    return parts[0].lower() + "".join(p[:1].upper() + p[1:].lower() for p in parts[1:])


def schema_type_name(key: str) -> str:
    return key[0].upper() + key[1:] if key else key


def to_pascal_case(value: str) -> str:
    if value and re.search(r"[A-Z]", value[1:]):
        return value[:1].upper() + value[1:]
    camel = to_camel_case(value)
    return camel[:1].upper() + camel[1:]


def strip_prefix(slug: str) -> str:
    upper = slug.upper()
    if upper.startswith(PREFIX):
        return upper[len(PREFIX) :]
    return upper


def endpoint_key(slug: str, used: set[str]) -> str:
    stripped = strip_prefix(slug)
    parts = [p for p in stripped.split("_") if p]
    key = to_camel_case("_".join(parts))
    if key not in used:
        used.add(key)
        return key
    base = key
    i = 2
    while f"{base}{i}" in used:
        i += 1
    key = f"{base}{i}"
    used.add(key)
    return key


def risk_level(method: str, slug: str) -> str:
    if method == "GET":
        return "read"
    if method == "DELETE" or "DELETE" in slug:
        return "destructive"
    if "REMOVE" in slug or "BATCH_DELETE" in slug:
        if method == "POST":
            return "destructive"
    return "write"


def derive_group(path: str) -> str:
    if path.startswith("/documents"):
        return "documents"
    if path.startswith("/annotations"):
        return "annotations"
    if path.startswith("/collections"):
        return "collections"
    if path.startswith("/data_points"):
        return "dataPoints"
    if path.startswith("/data_point_choices"):
        return "dataPointChoices"
    if path.startswith("/mapping_data_sources"):
        return "dataSources"
    if path.startswith("/document_types"):
        return "documentTypes"
    if path.startswith("/document_splitters"):
        return "documentSplitters"
    if path.startswith("/extractors"):
        return "extractors"
    if path.startswith("/index"):
        return "indexes"
    if path.startswith("/invitations"):
        return "invitations"
    if path.startswith("/job_description_search"):
        return "jobDescriptionSearch"
    if path.startswith("/mappings"):
        return "mappings"
    if path.startswith("/organizations"):
        return "organizations"
    if path.startswith("/organization_memberships"):
        return "organizationMemberships"
    if path.startswith("/resthook"):
        return "resthooks"
    if path.startswith("/resume_search"):
        return "resumeSearch"
    if path.startswith("/tags"):
        return "tags"
    if path.startswith("/validation_results"):
        return "validationResults"
    if path.startswith("/workspaces"):
        return "workspaces"
    if path.startswith("/workspace_memberships"):
        return "workspaceMemberships"
    if path.startswith("/api_users"):
        return "apiUsers"
    if path.startswith("/occupation_groups"):
        return "occupationGroups"
    if path.startswith("/usage"):
        return "usage"
    if path.startswith("/validate"):
        return "validation"
    return "misc"


def parse_composio_md(path: Path) -> list[Operation]:
    text = path.read_text(encoding="utf-8")
    sections = re.split(r"\n### ", text)
    operations: list[Operation] = []
    for section in sections[1:]:
        slug_match = re.search(r"\*\*Slug:\*\* `([^`]+)`", section)
        if not slug_match:
            continue
        slug = slug_match.group(1)
        name = section.split("\n", 1)[0].strip()
        desc_lines: list[str] = []
        for line in section.splitlines()[1:]:
            if line.startswith("#### Input Parameters"):
                break
            if line.strip() and not line.startswith("**Slug"):
                desc_lines.append(line.strip())
        description = " ".join(desc_lines).strip()
        params: list[Param] = []
        table = re.search(
            r"#### Input Parameters\s*\n\n\| Parameter.*?\n\|[-| ]+\|\n(.*?)(?:\n\n####|\Z)",
            section,
            re.S,
        )
        if table:
            for row in table.group(1).strip().splitlines():
                cols = [c.strip() for c in row.strip("|").split("|")]
                if len(cols) < 3:
                    continue
                pname, ptype, req = cols[0], cols[1], cols[2]
                pdesc = cols[3] if len(cols) > 3 else ""
                params.append(
                    Param(
                        name=pname.strip("`"),
                        type=re.sub(r"\s*\(.*", "", ptype).lower().strip(),
                        required=req.lower() == "yes",
                        description=pdesc,
                    )
                )
        operations.append(
            Operation(slug=slug, name=name, description=description, params=params)
        )
    return operations



def path_template_keys(path: str) -> list[str]:
    return re.findall(r"\{([^}]+)\}", path)


def resolve_path_param_name(template_key: str, params: list[Param]) -> str:
    param_names = {p.name for p in params}
    if template_key in param_names:
        return template_key
    for candidate in PATH_PARAM_ALIASES.get(template_key, [template_key]):
        if candidate in param_names:
            return candidate
    snake = re.sub(r"(?<!^)(?=[A-Z])", "_", template_key).lower()
    if snake in param_names:
        return snake
    return template_key


def build_routes(operations: list[Operation]) -> list[Route]:
    used_keys: set[str] = set()
    routes: list[Route] = []
    for op in operations:
        if op.slug not in MANUAL_ROUTES:
            raise KeyError(f"Missing manual route for {op.slug}")
        method, path = MANUAL_ROUTES[op.slug]
        group = derive_group(path)
        key = endpoint_key(op.slug, used_keys)
        template_keys = path_template_keys(path)
        path_params = [resolve_path_param_name(k, op.params) for k in template_keys]
        path_param_set = set(path_params)
        query_params: list[str] = []
        if method == "GET":
            query_params = [p.name for p in op.params if p.name not in path_param_set]
        routes.append(
            Route(
                key=key,
                group=group,
                name=key,
                method=method,
                path=path,
                description=op.description or op.name,
                path_params=path_params,
                query_params=query_params,
                params=op.params,
                slug=op.slug,
                risk_level=risk_level(method, op.slug),
            )
        )
    return routes


def zod_type(param: Param) -> str:
    ptype = param.type
    if ptype == "string":
        core = "z.string()"
    elif ptype == "boolean":
        core = "z.boolean()"
    elif ptype == "integer":
        core = "z.number().int()"
    elif ptype == "number":
        core = "z.number()"
    elif ptype == "array":
        core = "z.array(z.unknown())"
    elif ptype == "object":
        core = "z.record(z.string(), z.unknown())"
    else:
        core = "z.unknown()"
    return core if param.required else f"{core}.optional()"


def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def json_str(value: str) -> str:
    return repr(value)


def generate_types(routes: list[Route]) -> str:
    lines = [
        "import { z } from 'zod';",
        "",
        f"// Affinda response payloads vary across {len(routes)} endpoints; per-route schemas are not yet mapped from API docs.",
        f"const {PASCAL}ResponseSchema = z.unknown();",
        "// Optional raw JSON body passthrough for operations with complex or dynamic request payloads.",
        f"const {PASCAL}OptionalBodySchema = z.unknown().optional();",
        "",
    ]
    for route in routes:
        key_pascal = schema_type_name(route.key)
        fields = []
        seen: set[str] = set()
        for param in route.params:
            fields.append(f"\t{param.name}: {zod_type(param)},")
            seen.add(param.name)
        for pp in route.path_params:
            if pp not in seen:
                fields.append(f"\t{pp}: z.union([z.string(), z.number()]).optional(),")
                seen.add(pp)
        fields.append(f"\tbody: {PASCAL}OptionalBodySchema,")
        fields.append("\tquery: z.record(z.string(), z.unknown()).optional(),")
        fields.append("\theaders: z.record(z.string(), z.string()).optional(),")
        schema = "z.object({\n" + "\n".join(fields) + "\n})"
        lines.extend(
            [
                f"// {route.name}",
                f"const {key_pascal}InputSchema = {schema};",
                f"export type {key_pascal}Input = z.infer<typeof {key_pascal}InputSchema>;",
                f"const {key_pascal}ResponseSchema = {PASCAL}ResponseSchema;",
                f"export type {key_pascal}Response = z.infer<typeof {key_pascal}ResponseSchema>;",
                "",
            ]
        )

    lines.append(f"export const {PASCAL}EndpointInputSchemas = {{")
    for route in routes:
        key_pascal = schema_type_name(route.key)
        lines.append(f"\t{route.key}: {key_pascal}InputSchema,")
    lines.append("} as const;")
    lines.append("")
    lines.append(f"export type {PASCAL}EndpointInputs = {{")
    lines.append(
        f"\t[K in keyof typeof {PASCAL}EndpointInputSchemas]: z.infer<(typeof {PASCAL}EndpointInputSchemas)[K]>;"
    )
    lines.append("};")
    lines.append("")
    lines.append(f"export const {PASCAL}EndpointOutputSchemas = {{")
    for route in routes:
        key_pascal = schema_type_name(route.key)
        lines.append(f"\t{route.key}: {key_pascal}ResponseSchema,")
    lines.append("} as const;")
    lines.append("")
    lines.append(f"export type {PASCAL}EndpointOutputs = {{")
    lines.append(
        f"\t[K in keyof typeof {PASCAL}EndpointOutputSchemas]: z.infer<(typeof {PASCAL}EndpointOutputSchemas)[K]>;"
    )
    lines.append("};")
    lines.append("")
    lines.append(
        f"export type {PASCAL}EndpointInput = {PASCAL}EndpointInputs[keyof {PASCAL}EndpointInputs] & {{"
    )
    lines.append("\t[key: string]: unknown;")
    lines.append("};")
    lines.append("")
    return "\n".join(lines)


def generate_routes_ts(routes: list[Route]) -> str:
    lines = [
        "import type { EndpointRiskLevel } from 'corsair/core';",
        "",
        f"export type {PASCAL}Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';",
        "",
        f"export type {PASCAL}Route = {{",
        "\tkey: string;",
        "\tgroup: string;",
        "\tname: string;",
        f"\tmethod: {PASCAL}Method;",
        "\tpath: string;",
        "\tdescription: string;",
        "\tpathParams?: readonly string[];",
        "\tqueryParams?: readonly string[];",
        "\triskLevel: EndpointRiskLevel;",
        "\tirreversible?: boolean;",
        "};",
        "",
        f"export const {CAMEL}Routes = [",
    ]
    for route in routes:
        path_params = ", ".join(f"'{p}'" for p in route.path_params)
        query_params = ", ".join(f"'{p}'" for p in route.query_params)
        risk_lines = [f"\t\triskLevel: '{route.risk_level}' as const,"]
        if route.risk_level == "destructive":
            risk_lines.append("\t\tirreversible: true,")
        lines.extend(
            [
                "\t{",
                f"\t\tkey: '{route.key}',",
                f"\t\tgroup: '{route.group}',",
                f"\t\tname: '{route.name}',",
                f"\t\tmethod: '{route.method}',",
                f"\t\tpath: '{route.path}',",
                f"\t\tdescription: {json_str(route.description)},",
                f"\t\tpathParams: [{path_params}]," if path_params else "\t\tpathParams: [],",
                (
                    f"\t\tqueryParams: [{query_params}],"
                    if query_params
                    else "\t\tqueryParams: [],"
                ),
                *risk_lines,
                "\t},",
            ]
        )
    lines.extend(["] as const;", "", f"export type {PASCAL}Routes = typeof {CAMEL}Routes;"])
    return "\n".join(lines)


def path_param_aliases_ts() -> str:
    entries = []
    for key, aliases in PATH_PARAM_ALIASES.items():
        quoted = ", ".join(f"'{a}'" for a in aliases)
        entries.append(f"\t{key}: [{quoted}],")
    return "\n".join(entries)


def generate_factory() -> str:
    return textwrap.dedent(
        f"""
        import type {{ CorsairEndpoint }} from 'corsair/core';
        import {{ logEventFromContext }} from 'corsair/core';
        import {{ make{PASCAL}Request }} from '../client';
        import type {{ {PASCAL}Context }} from '../index';
        import {{ {CAMEL}Routes, type {PASCAL}Route }} from './routes';
        import type {{ {PASCAL}EndpointInput }} from './types';

        const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {{
        {path_param_aliases_ts()}
        }};

        const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

        // Affinda response payloads vary by resource; outputs validated via shared Zod schemas.
        export type {PASCAL}Endpoint = CorsairEndpoint<
        	{PASCAL}Context,
        	{PASCAL}EndpointInput,
        	unknown
        >;

        function camelToSnake(value: string): string {{
        	return value.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase();
        }}

        function encodePathPart(value: unknown): string {{
        	if (value === undefined || value === null || value === '') {{
        		throw new Error('[{PLUGIN_ID}] missing required path parameter');
        	}}
        	return encodeURIComponent(String(value));
        }}

        function resolvePathParam(input: {PASCAL}EndpointInput, pathKey: string): unknown {{
        	const snake = camelToSnake(pathKey);
        	const candidates = [pathKey, snake, ...(PATH_PARAM_ALIASES[pathKey] ?? [])];
        	for (const candidate of candidates) {{
        		if (input[candidate] !== undefined) return input[candidate];
        	}}
        	return undefined;
        }}

        export function resolvePath(
        	path: string,
        	input: {PASCAL}EndpointInput,
        	route?: Pick<{PASCAL}Route, 'pathParams'>,
        ): string {{
        	const pathOnly = path.split('?')[0] ?? path;
        	let index = 0;
        	return pathOnly.replace(/\\{{([^}}]+)\\}}/g, (_, placeholder: string) => {{
        		const mappedKey = route?.pathParams?.[index];
        		index += 1;
        		if (mappedKey !== undefined) {{
        			const direct = input[mappedKey] ?? input[camelToSnake(mappedKey)];
        			if (direct !== undefined) {{
        				return encodePathPart(direct);
        			}}
        		}}
        		return encodePathPart(resolvePathParam(input, placeholder));
        	}});
        }}

        function buildQuery(route: {PASCAL}Route, input: {PASCAL}EndpointInput) {{
        	const query: Record<string, unknown> = {{ ...(input.query ?? {{}}) }};
        	for (const key of route.queryParams ?? []) {{
        		const snake = camelToSnake(key);
        		const value =
        			input[snake] ?? input[key] ?? resolvePathParam(input, key);
        		if (value !== undefined) query[key] = value;
        	}}
        	return Object.keys(query).length > 0 ? query : undefined;
        }}

        function requestBody(route: {PASCAL}Route, input: {PASCAL}EndpointInput) {{
        	if ('body' in input && input.body !== undefined) return input.body;
        	const pathParams = new Set(route.pathParams ?? []);
        	const queryParams = new Set(
        		(route.queryParams ?? []).flatMap((key) => [key, camelToSnake(key)]),
        	);
        	const body = Object.fromEntries(
        		Object.entries(input).filter(([key, value]) => {{
        			return (
        				!pathParams.has(key) &&
        				!queryParams.has(key) &&
        				!BODY_CONTROL_KEYS.has(key) &&
        				value !== undefined
        			);
        		}}),
        	);
        	return Object.keys(body).length > 0 ? body : undefined;
        }}

        export function getRoute(name: string): {PASCAL}Route {{
        	const route = {CAMEL}Routes.find((candidate) => candidate.name === name);
        	if (!route) {{
        		throw new Error(`[{PLUGIN_ID}] missing route: ${{name}}`);
        	}}
        	return route;
        }}

        export async function log{PASCAL}Operation(
        	ctx: {PASCAL}Context,
        	input: {PASCAL}EndpointInput,
        	route: {PASCAL}Route,
        	status: 'completed' | 'failed',
        ) {{
        	await logEventFromContext(
        		ctx,
        		`{PLUGIN_ID}.${{route.group}}.${{route.name}}`,
        		{{ method: route.method, path: route.path }},
        		status,
        	);
        }}

        export async function request{PASCAL}Operation(
        	ctx: {PASCAL}Context,
        	input: {PASCAL}EndpointInput,
        	route: {PASCAL}Route,
        ) {{
        	return make{PASCAL}Request(resolvePath(route.path, input, route), ctx.key, {{
        		method: route.method,
        		body: requestBody(route, input),
        		query: buildQuery(route, input),
        		// input.headers is unknown via the AffindaEndpointInput index signature;
			// callers supply string-valued header maps validated by per-op Zod schemas.
			headers: input.headers as Record<string, string> | undefined,
        	}});
        }}

        export async function execute{PASCAL}Operation(
        	ctx: {PASCAL}Context,
        	input: {PASCAL}EndpointInput,
        	route: {PASCAL}Route,
        ) {{
        	let status: 'completed' | 'failed' = 'completed';
        	try {{
        		return await request{PASCAL}Operation(ctx, input, route);
        	}} catch (error) {{
        		status = 'failed';
        		throw error;
        	}} finally {{
        		await log{PASCAL}Operation(ctx, input, route, status);
        	}}
        }}
        """
    ).strip() + "\n"


def generate_group_file(group: str, routes: list[Route]) -> str:
    group_pascal = to_pascal_case(group)
    lines = [
        f"import type {{ {PASCAL}Endpoint }} from './factory';",
        f"import {{ execute{PASCAL}Operation, getRoute }} from './factory';",
        "",
    ]
    exports: list[str] = []
    for route in routes:
        const_name = f"{route.name}Route"
        lines.extend(
            [
                f"const {const_name} = getRoute('{route.name}');",
                f"export const {route.name}: {PASCAL}Endpoint = async (ctx, input = {{}}) => {{",
                f"\treturn execute{PASCAL}Operation(ctx, input, {const_name});",
                "};",
                "",
            ]
        )
        exports.append(route.name)
    lines.append(f"export const {group_pascal}Endpoints = {{")
    lines.append(",\n".join(f"\t{name}" for name in exports))
    lines.append("} as const;")
    return "\n".join(lines)


def generate_endpoints_index(groups: dict[str, list[Route]]) -> str:
    imports = []
    nested = []
    for group in sorted(groups):
        pascal = to_pascal_case(group)
        imports.append(f"import {{ {pascal}Endpoints }} from './{group}';")
        nested.append(f"\t{group}: {pascal}Endpoints")
    return (
        "\n".join(imports)
        + "\nimport type { RequiredPluginEndpointMeta } from 'corsair/core';\n"
        + f"import {{ {CAMEL}Routes }} from './routes';\n"
        + f"import {{ {PASCAL}EndpointInputSchemas, {PASCAL}EndpointOutputSchemas }} from './types';\n\n"
        + f"export const {CAMEL}EndpointsNested = {{\n"
        + ",\n".join(nested)
        + "\n} as const;\n\n"
        + f"export const {CAMEL}EndpointMeta = Object.fromEntries(\n"
        + f"\t{CAMEL}Routes.map((route) => [\n"
        + "\t\t`${route.group}.${route.name}`,\n"
        + "\t\t{\n"
        + "\t\t\triskLevel: route.riskLevel,\n"
        + "\t\t\tirreversible: 'irreversible' in route ? route.irreversible : undefined,\n"
        + "\t\t\tdescription: route.description,\n"
        + "\t\t},\n"
        + "\t]),\n"
        + f") as RequiredPluginEndpointMeta<typeof {CAMEL}EndpointsNested>;\n\n"
        + f"export const {CAMEL}EndpointSchemas = Object.fromEntries(\n"
        + f"\t{CAMEL}Routes.map((route) => [\n"
        + "\t\t`${route.group}.${route.name}`,\n"
        + "\t\t{\n"
        + f"\t\t\tinput: {PASCAL}EndpointInputSchemas[route.key],\n"
        + f"\t\t\toutput: {PASCAL}EndpointOutputSchemas[route.key],\n"
        + "\t\t},\n"
        + "\t]),\n"
        + ");\n\n"
        + f"export {{ {PASCAL}EndpointInputSchemas, {PASCAL}EndpointOutputSchemas }};\n"
        + "export * from './routes';\n"
        + "export * from './types';\n"
    )


def generate_client() -> str:
    return textwrap.dedent(
        f"""
        import type {{ ApiRequestOptions, OpenAPIConfig }} from 'corsair/http';
        import {{ ApiError, request }} from 'corsair/http';
        import type {{ {PASCAL}Method }} from './endpoints/routes';

        export class {PASCAL}APIError extends Error {{
        	public readonly status?: number;
        	public readonly statusText?: string;
        	// body is unknown because Affinda error payloads vary by endpoint and are not schema-validated here.
        	public readonly body?: unknown;

        	constructor(message: string, options?: {{ cause?: Error }}) {{
        		super(message, options);
        		this.name = '{PASCAL}APIError';
        		if (options?.cause instanceof ApiError) {{
        			this.status = options.cause.status;
        			this.statusText = options.cause.statusText;
        			this.body = options.cause.body;
        		}}
        	}}
        }}

        const {PASCAL.upper()}_API_BASE = '{BASE_URL}';

        export type {PASCAL}RequestOptions = {{
        	method?: {PASCAL}Method;
        	body?: unknown;
        	query?: Record<string, unknown>;
        	headers?: Record<string, string>;
        }};

        export async function make{PASCAL}Request<T>(
        	endpoint: string,
        	apiKey: string,
        	options: {PASCAL}RequestOptions = {{}},
        ): Promise<T> {{
        	const {{ method = 'GET', body, query, headers }} = options;
        	const config: OpenAPIConfig = {{
        		BASE: {PASCAL.upper()}_API_BASE,
        		VERSION: '1.0.0',
        		WITH_CREDENTIALS: false,
        		CREDENTIALS: 'omit',
        		TOKEN: apiKey,
        		HEADERS: {{
        			'Content-Type': 'application/json',
        			Authorization: `Bearer ${{apiKey}}`,
        			...headers,
        		}},
        	}};

        	const hasBody =
        		body !== undefined && !['GET', 'HEAD', 'OPTIONS'].includes(method);
        	const requestOptions: ApiRequestOptions = {{
        		method,
        		url: endpoint,
        		body: hasBody ? body : undefined,
        		query,
        	}};

        	try {{
        		return await request<T>(config, requestOptions);
        	}} catch (error) {{
        		if (error instanceof ApiError) {{
        			throw new {PASCAL}APIError(error.message, {{ cause: error }});
        		}}
        		if (error instanceof Error) {{
        			throw new {PASCAL}APIError(error.message, {{ cause: error }});
        		}}
        		throw new {PASCAL}APIError('Unknown error');
        	}}
        }}
        """
    ).strip() + "\n"


def generate_error_handlers() -> str:
    return textwrap.dedent(
        f"""
        import type {{ CorsairErrorHandler }} from 'corsair/core';
        import {{ {PASCAL}APIError }} from './client';

        function getStatus(error: Error): number | undefined {{
        	if (error instanceof {PASCAL}APIError) {{
        		return error.status;
        	}}
        	return undefined;
        }}

        export const errorHandlers = {{
        	RATE_LIMIT_ERROR: {{
        		match: (error: Error) => getStatus(error) === 429,
        		handler: async () => ({{
        			maxRetries: 3,
        			retryStrategy: 'exponential_backoff' as const,
        		}}),
        	}},
        	AUTH_ERROR: {{
        		match: (error: Error) => {{
        			const status = getStatus(error);
        			if (status === 401 || status === 403) return true;
        			const msg = error.message.toLowerCase();
        			return msg.includes('unauthorized') || msg.includes('forbidden');
        		}},
        		handler: async () => {{
        			console.error(
        				'[{PASCAL.upper()}] Authentication failed — check your Affinda API key.',
        			);
        			return {{ maxRetries: 0 }};
        		}},
        	}},
        	NOT_FOUND_ERROR: {{
        		match: (error: Error) => getStatus(error) === 404,
        		handler: async () => ({{ maxRetries: 0 }}),
        	}},
        	SERVER_ERROR: {{
        		match: (error: Error) => {{
        			const status = getStatus(error);
        			return status !== undefined && status >= 500;
        		}},
        		handler: async () => ({{
        			maxRetries: 2,
        			retryStrategy: 'exponential_backoff' as const,
        		}}),
        	}},
        	DEFAULT: {{
        		match: () => true,
        		handler: async (error: Error) => {{
        			console.error(`[{PASCAL.upper()}] Unhandled error: ${{error.message}}`);
        			return {{ maxRetries: 0 }};
        		}},
        	}},
        }} satisfies CorsairErrorHandler;
        """
    ).strip() + "\n"


def generate_schema_database() -> str:
    return textwrap.dedent(
        f"""
        import {{ z }} from 'zod';

        export const {PASCAL}Document = z.object({{
        	identifier: z.string().optional(),
        	fileName: z.string().optional(),
        	status: z.string().optional(),
        	ready: z.boolean().optional(),
        }}).catchall(z.unknown());

        export const {PASCAL}Collection = z.object({{
        	identifier: z.string().optional(),
        	name: z.string().optional(),
        	extractor: z.string().optional(),
        }}).catchall(z.unknown());

        export const {PASCAL}Workspace = z.object({{
        	identifier: z.string().optional(),
        	name: z.string().optional(),
        }}).catchall(z.unknown());

        export type {PASCAL}Document = z.infer<typeof {PASCAL}Document>;
        export type {PASCAL}Collection = z.infer<typeof {PASCAL}Collection>;
        export type {PASCAL}Workspace = z.infer<typeof {PASCAL}Workspace>;
        """
    ).strip() + "\n"


def generate_schema_index() -> str:
    return textwrap.dedent(
        f"""
        import {{ {PASCAL}Collection, {PASCAL}Document, {PASCAL}Workspace }} from './database';

        export const {PASCAL}Schema = {{
        	version: '1.0.0',
        	entities: {{
        		documents: {PASCAL}Document,
        		collections: {PASCAL}Collection,
        		workspaces: {PASCAL}Workspace,
        	}},
        }} as const;
        """
    ).strip() + "\n"


def generate_index() -> str:
    return textwrap.dedent(
        f"""
        import type {{
        	AuthTypes,
        	BindEndpoints,
        	CorsairErrorHandler,
        	CorsairPlugin,
        	CorsairPluginContext,
        	KeyBuilderContext,
        	PickAuth,
        	PluginAuthConfig,
        	PluginPermissionsConfig,
        	RequiredPluginEndpointMeta,
        }} from 'corsair/core';
        import {{ AuthMissingError }} from 'corsair/core';
        import {{
        	{CAMEL}EndpointMeta as generated{PASCAL}EndpointMeta,
        	{CAMEL}EndpointSchemas,
        	{CAMEL}EndpointsNested,
        }} from './endpoints';
        import {{ errorHandlers }} from './error-handlers';
        import {{ {PASCAL}Schema }} from './schema';

        export const {CAMEL}EndpointMeta =
        	generated{PASCAL}EndpointMeta satisfies RequiredPluginEndpointMeta<
        		typeof {CAMEL}EndpointsNested
        	>;

        export type {PASCAL}PluginOptions = {{
        	authType?: PickAuth<'api_key'>;
        	key?: string;
        	hooks?: Internal{PASCAL}Plugin['hooks'];
        	errorHandlers?: CorsairErrorHandler;
        	permissions?: PluginPermissionsConfig<typeof {CAMEL}EndpointsNested>;
        }};

        export type {PASCAL}Context = CorsairPluginContext<
        	typeof {PASCAL}Schema,
        	{PASCAL}PluginOptions
        >;

        export type {PASCAL}KeyBuilderContext = KeyBuilderContext<{PASCAL}PluginOptions>;

        export type {PASCAL}BoundEndpoints = BindEndpoints<typeof {CAMEL}EndpointsNested>;

        export type {PASCAL}Endpoints = typeof {CAMEL}EndpointsNested;

        const defaultAuthType: AuthTypes = 'api_key' as const;

        export const {CAMEL}AuthConfig = {{
        	api_key: {{}},
        }} as const satisfies PluginAuthConfig;

        export type Base{PASCAL}Plugin<T extends {PASCAL}PluginOptions> = CorsairPlugin<
        	'{PLUGIN_ID}',
        	typeof {PASCAL}Schema,
        	typeof {CAMEL}EndpointsNested,
        	{{}},
        	T,
        	typeof defaultAuthType
        >;

        export type Internal{PASCAL}Plugin = Base{PASCAL}Plugin<{PASCAL}PluginOptions>;

        export type External{PASCAL}Plugin<T extends {PASCAL}PluginOptions> =
        	Base{PASCAL}Plugin<T>;

        export function {PLUGIN_ID}<const T extends {PASCAL}PluginOptions>(
        	incomingOptions: {PASCAL}PluginOptions & T = {{}} as {PASCAL}PluginOptions & T,
        ): External{PASCAL}Plugin<T> {{
        	const options = {{
        		...incomingOptions,
        		authType: incomingOptions.authType ?? defaultAuthType,
        	}};
        	return {{
        		id: '{PLUGIN_ID}',
        		schema: {PASCAL}Schema,
        		options,
        		authConfig: {CAMEL}AuthConfig,
        		hooks: options.hooks,
        		endpoints: {CAMEL}EndpointsNested,
        		webhooks: {{}},
        		endpointMeta: {CAMEL}EndpointMeta,
        		endpointSchemas: {CAMEL}EndpointSchemas,
        		pluginWebhookMatcher: undefined,
        		errorHandlers: {{
        			...errorHandlers,
        			...options.errorHandlers,
        		}},
        		keyBuilder: async (ctx: {PASCAL}KeyBuilderContext, source) => {{
        			if (source === 'endpoint' && options.key) {{
        				return options.key;
        			}}

        			if (source === 'endpoint' && ctx.authType === 'api_key') {{
        				const res = await ctx.keys.get_api_key();
        				if (!res) {{
        					console.error(
        						'[{PASCAL.upper()}] API key missing — connect Affinda or pass key in plugin options.',
        					);
        					throw new AuthMissingError('{PLUGIN_ID}', 'api_key');
        				}}
        				return res;
        			}}

        			console.error(
        				'[{PASCAL.upper()}] Authentication required for Affinda API requests.',
        			);
        			throw new AuthMissingError('{PLUGIN_ID}', 'api_key');
        		}},
        	}} satisfies Internal{PASCAL}Plugin;
        }}

        export type {{
        	{PASCAL}EndpointInputs,
        	{PASCAL}EndpointOutputs,
        }} from './endpoints/types';

        export {{ {CAMEL}EndpointsNested, {CAMEL}EndpointSchemas }};
        """
    ).strip() + "\n"


def generate_package_json() -> str:
    return (
        json.dumps(
            {
                "name": PACKAGE_NAME,
                "version": "0.1.0",
                "description": "Affinda plugin for Corsair",
                "type": "module",
                "main": "./dist/index.js",
                "module": "./dist/index.js",
                "types": "./dist/index.d.ts",
                "exports": {
                    ".": {
                        "dev-source": "./index.ts",
                        "types": "./dist/index.d.ts",
                        "default": "./dist/index.js",
                    }
                },
                "scripts": {
                    "build": "rm -rf dist && tsc --build --force && tsup",
                    "typecheck": "tsc --noEmit",
                    "test": "jest --config jest.config.json",
                },
                "peerDependencies": {"corsair": ">=0.1.0", "zod": "^4.1.13"},
                "devDependencies": {
                    "@types/jest": "^29.5.14",
                    "corsair": "workspace:*",
                    "ts-jest": "^29.4.9",
                    "tsup": "^8.0.1",
                    "typescript": "catalog:",
                    "zod": "^4.1.13",
                    "jest": "^29.7.0",
                },
                "keywords": ["corsair", "affinda", "documents", "ai", "plugin"],
                "author": "",
                "license": "Apache-2.0",
                "files": ["dist"],
            },
            indent=2,
        )
        + "\n"
    )


def generate_api_test(count: int) -> str:
    return textwrap.dedent(
        f"""
        import {{ request }} from 'corsair/http';
        import {{ make{PASCAL}Request }} from './client';
        import type {{ {PASCAL}Context }} from './index';
        import {{ {PLUGIN_ID}, {CAMEL}EndpointSchemas }} from './index';

        jest.mock('corsair/http', () => {{
        	const original = jest.requireActual('corsair/http');
        	return {{
        		...original,
        		request: jest.fn(),
        	}};
        }});

        const mockRequest = request as jest.Mock;

        function countLeaves(tree: Record<string, unknown>): number {{
        	return Object.values(tree).reduce<number>((count, value) => {{
        		if (typeof value === 'function') return count + 1;
        		if (value && typeof value === 'object') {{
        			return count + countLeaves(value as Record<string, unknown>);
        		}}
        		return count;
        	}}, 0);
        }}

        function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {{
        	return Object.entries(tree).flatMap(([key, value]) => {{
        		const path = prefix ? `${{prefix}}.${{key}}` : key;
        		if (typeof value === 'function') return [path];
        		if (value && typeof value === 'object') {{
        			return endpointPaths(value as Record<string, unknown>, path);
        		}}
        		return [];
        	}});
        }}

        const mockCtx = {{
        	key: 'test-api-key',
        	$getAccountId: () => 'test-account-id',
        	options: {{}},
        	logEvent: jest.fn(),
        	db: {{}},
        }} as unknown as {PASCAL}Context;

        describe('{PASCAL} plugin shape', () => {{
        	it('exposes every listed operation with schemas and no webhooks', () => {{
        		const plugin = {PLUGIN_ID}();
        		const endpoints = plugin.endpoints as Record<string, unknown>;
        		const paths = endpointPaths(endpoints).sort();

        		expect(countLeaves(endpoints)).toBe({count});
        		expect(Object.keys(plugin.endpointMeta ?? {{}})).toHaveLength({count});
        		expect(Object.keys({CAMEL}EndpointSchemas)).toHaveLength({count});
        		expect(Object.keys(plugin.endpointMeta ?? {{}}).sort()).toEqual(paths);
        		expect(Object.keys({CAMEL}EndpointSchemas).sort()).toEqual(paths);
        		expect(plugin.webhooks).toEqual({{}});
        		expect(plugin.pluginWebhookMatcher).toBeUndefined();
        	}});

        	it('supports api key auth configuration', () => {{
        		const plugin = {PLUGIN_ID}();
        		expect(plugin.options?.authType).toBe('api_key');
        		expect(plugin.authConfig).toEqual({{ api_key: {{}} }});
        	}});
        }});

        describe('{PASCAL} request client', () => {{
        	beforeEach(() => {{
        		mockRequest.mockReset();
        		mockRequest.mockResolvedValue({{ ok: true }});
        	}});

        	it('sends Bearer Authorization header and JSON bodies', async () => {{
        		await make{PASCAL}Request('/documents', 'test-api-key', {{
        			method: 'GET',
        		}});

        		expect(mockRequest).toHaveBeenCalledWith(
        			expect.objectContaining({{
        				BASE: '{BASE_URL}',
        				TOKEN: 'test-api-key',
        				HEADERS: expect.objectContaining({{
        					Authorization: 'Bearer test-api-key',
        					'Content-Type': 'application/json',
        				}}),
        			}}),
        			expect.objectContaining({{
        				method: 'GET',
        				url: '/documents',
        			}}),
        		);
        	}});
        }});

        describe('{PASCAL} endpoints', () => {{
        	beforeEach(() => {{
        		mockRequest.mockReset();
        		mockRequest.mockResolvedValue({{ ok: true }});
        	}});

        	it('maps representative operations to API routes', async () => {{
        		const plugin = {PLUGIN_ID}({{ key: 'test-api-key' }});
        		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints> & {{
        			documents: {{
        				getDocuments: (ctx: {PASCAL}Context, input: {{ workspace?: string }}) => Promise<unknown>;
        				createDocument: (
        					ctx: {PASCAL}Context,
        					input: {{ url?: string; workspace?: string }},
        				) => Promise<unknown>;
        			}};
        		}};

        		await endpoints.documents.getDocuments(mockCtx, {{ workspace: 'ws123' }});
        		await endpoints.documents.createDocument(mockCtx, {{
        			url: 'https://example.com/resume.pdf',
        			workspace: 'ws123',
        		}});

        		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
        			expect.arrayContaining([
        				expect.objectContaining({{
        					method: 'GET',
        					url: '/documents',
        				}}),
        				expect.objectContaining({{
        					method: 'POST',
        					url: '/documents',
        					body: {{
        						url: 'https://example.com/resume.pdf',
        						workspace: 'ws123',
        					}},
        				}}),
        			]),
        		);
        	}});
        }});
        """
    ).strip() + "\n"


def update_constants() -> None:
    path = REPO_ROOT / "packages/corsair/core/constants.ts"
    text = path.read_text(encoding="utf-8")
    if "'affinda'" not in text:
        text = text.replace(
            "\t'agentql',",
            "\t'affinda',\n\t'agentql',",
        )
        text = text.replace(
            "\tagentql: 'AgentQL',",
            "\taffinda: 'Affinda',\n\tagentql: 'AgentQL',",
        )
        text = text.replace(
            "\t| 'agentql'",
            "\t| 'affinda'\n\t| 'agentql'",
        )
        path.write_text(text, encoding="utf-8")


def update_demo_testing() -> None:
    pkg_path = REPO_ROOT / "demo/testing/package.json"
    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    deps = pkg.setdefault("dependencies", {})
    deps["@corsair-dev/affinda"] = "workspace:*"
    pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")

    corsair_path = REPO_ROOT / "demo/testing/src/server/corsair.ts"
    text = corsair_path.read_text(encoding="utf-8")
    if "@corsair-dev/affinda" not in text:
        text = text.replace(
            "import { agentql } from '@corsair-dev/agentql';",
            "import { affinda } from '@corsair-dev/affinda';\nimport { agentql } from '@corsair-dev/agentql';",
        )
    if "affinda(" not in text:
        text = text.replace(
            "\t\tagentql({\n\t\t\tkey: process.env.AGENTQL_API_KEY,\n\t\t}),",
            "\t\taffinda({\n\t\t\tkey: process.env.AFFINDA_API_KEY,\n\t\t}),\n\t\tagentql({\n\t\t\tkey: process.env.AGENTQL_API_KEY,\n\t\t}),",
        )
    corsair_path.write_text(text, encoding="utf-8")


def main() -> None:
    operations = parse_composio_md(COMPOSIO_MD)
    if len(operations) != len(MANUAL_ROUTES):
        missing = set(MANUAL_ROUTES) - {op.slug for op in operations}
        extra = {op.slug for op in operations} - set(MANUAL_ROUTES)
        raise SystemExit(
            f"Route count mismatch: ops={len(operations)} manual={len(MANUAL_ROUTES)} "
            f"missing={missing} extra={extra}"
        )

    routes = build_routes(operations)
    groups: dict[str, list[Route]] = defaultdict(list)
    for route in routes:
        groups[route.group].append(route)

    print(f"Generated {len(routes)} routes across {len(groups)} groups")

    write_file(ROOT / "client.ts", generate_client())
    write_file(ROOT / "error-handlers.ts", generate_error_handlers())
    write_file(ROOT / "schema/database.ts", generate_schema_database())
    write_file(ROOT / "schema/index.ts", generate_schema_index())
    write_file(ROOT / "endpoints/types.ts", generate_types(routes))
    write_file(ROOT / "endpoints/routes.ts", generate_routes_ts(routes))
    write_file(ROOT / "endpoints/factory.ts", generate_factory())
    write_file(ROOT / "endpoints/index.ts", generate_endpoints_index(groups))
    for group, group_routes in sorted(groups.items()):
        write_file(ROOT / f"endpoints/{group}.ts", generate_group_file(group, group_routes))
    write_file(ROOT / "index.ts", generate_index())
    write_file(ROOT / "package.json", generate_package_json())
    write_file(
        ROOT / "tsconfig.json",
        (REPO_ROOT / "packages/openweathermap/tsconfig.json").read_text(encoding="utf-8"),
    )
    write_file(
        ROOT / "tsup.config.ts",
        (REPO_ROOT / "packages/openweathermap/tsup.config.ts").read_text(encoding="utf-8"),
    )
    write_file(
        ROOT / "jest.config.json",
        (REPO_ROOT / "packages/supabase/jest.config.json").read_text(encoding="utf-8"),
    )
    write_file(ROOT / "api.test.ts", generate_api_test(len(routes)))

    update_constants()
    update_demo_testing()


if __name__ == "__main__":
    main()
