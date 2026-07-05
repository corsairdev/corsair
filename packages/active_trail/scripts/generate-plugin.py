#!/usr/bin/env python3
"""Generate the ActiveTrail Corsair plugin from Composio toolkit MD and API docs."""

from __future__ import annotations

import difflib
import re
import textwrap
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = ROOT.parents[1]
COMPOSIO_MD = Path("/tmp/active_trail_composio.md")
API_DOCS = Path(
    "/Users/ayushkumar/.cursor/projects/Users-ayushkumar-Projects-corsair/agent-tools/ebd3544c-41c5-4ffa-b175-93b7497b3ce4.txt"
)

PLUGIN_ID = "active_trail"
PASCAL = "ActiveTrail"
CAMEL = "activeTrail"
PACKAGE_NAME = "@corsair-dev/active_trail"
BASE_URL = "https://webapi.mymarketing.co.il/api"
PREFIX = "ACTIVE_TRAIL_"

VERBS = {
    "GET",
    "LIST",
    "CREATE",
    "UPDATE",
    "DELETE",
    "POST",
    "PUT",
    "ADD",
    "SEND",
    "IMPORT",
    "REMOVE",
    "TEST",
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
class ApiEndpoint:
    method: str
    raw_path: str
    description: str

    @property
    def path_only(self) -> str:
        return self.raw_path.split("?", 1)[0]

    @property
    def query_keys(self) -> list[str]:
        if "?" not in self.raw_path:
            return []
        query = self.raw_path.split("?", 1)[1]
        return re.findall(r"\{([^}?]+)\}", query)

    @property
    def path_keys(self) -> list[str]:
        return re.findall(r"\{([^}?]+)\}", self.path_only)

    @property
    def group(self) -> str:
        parts = self.path_only.replace("api/", "").split("/")
        return normalize_group(parts[0] if parts else "operations")


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
    match_score: float = 0.0


def normalize_group(segment: str) -> str:
    mapping = {
        "automationreports": "automationReports",
        "automationtriggers": "automationTriggers",
        "campaignreports": "campaignReports",
        "campaigntemplates": "campaignTemplates",
        "mailinglist": "mailingList",
        "operationalmessage": "operationalMessage",
        "pushcampaign": "pushCampaign",
        "pushcampaignreport": "pushCampaignReport",
        "saleslifecycle": "salesLifecycle",
        "signupforms": "signupForms",
        "smartcodesite": "smartCodeSite",
        "smscampaign": "smsCampaign",
        "smscampaignreport": "smsCampaignReport",
        "usersocial": "userSocial",
        "twowaysms": "twoWaySms",
        "whatsapp": "whatsApp",
        "webhooks": "webhooks",
        "webhooks": "webhooks",
        "external": "external",
        "commerce": "commerce",
        "contacts": "contacts",
        "groups": "groups",
        "campaigns": "campaigns",
        "automations": "automations",
        "templates": "templates",
        "account": "account",
        "segmentations": "segmentations",
    }
    lower = re.sub(r"[^a-z0-9]", "", segment.lower())
    return mapping.get(lower, to_camel_case(segment))


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


def tokens(value: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", value.lower()))


def method_hint(slug: str, name: str) -> str:
    upper = slug.upper()
    text = f"{upper} {name}".upper()
    if "DELETE" in upper or text.startswith("REMOVE") or " REMOVE " in f" {text} ":
        return "DELETE"
    if upper.startswith("PUT_") or "_PUT_" in upper or "UPDATE" in upper:
        return "PUT"
    if (
        upper.startswith("POST_")
        or "_POST_" in upper
        or "CREATE" in upper
        or "ADD" in upper
        or "SEND" in upper
        or "IMPORT" in upper
        or "TEST" in upper
    ):
        return "POST"
    return "GET"


def risk_level(method: str, slug: str, name: str) -> str:
    if method == "GET":
        return "read"
    if method == "DELETE" or "DELETE" in slug or "REMOVE" in slug.upper():
        return "destructive"
    return "write"


MANUAL_ROUTES: dict[str, tuple[str, str]] = {
    "ACTIVE_TRAIL_CONTACT_GROWTH": (
        "GET",
        "api/account/executivereport/contactgrowth?FromDate={FromDate}&ToDate={ToDate}",
    ),
    "ACTIVE_TRAIL_ADD_GROUP_MEMBER": ("POST", "api/groups/{id}/members"),
    "ACTIVE_TRAIL_DELETE_A_MEMBER_IN_A_GROUP": (
        "DELETE",
        "api/groups/{group_id}/members/{contact_id}",
    ),
    "ACTIVE_TRAIL_ADD_MAILINGLIST_MEMBER": ("POST", "api/mailinglist/{id}/members"),
    "ACTIVE_TRAIL_REMOVE_A_CONTACT_FROM_A_MAILING_LIST": (
        "DELETE",
        "api/mailinglist/{mailinglist_id}/members/{contact_id}",
    ),
    "ACTIVE_TRAIL_CREATE_A_NEW_GROUP": ("POST", "api/groups"),
    "ACTIVE_TRAIL_DELETE_GROUP_BY_ID": ("DELETE", "api/groups/{id}"),
    "ACTIVE_TRAIL_GET_GROUP": ("GET", "api/groups/{id}"),
    "ACTIVE_TRAIL_UPDATE_GROUP": ("PUT", "api/groups/{id}"),
    "ACTIVE_TRAIL_GET_ALL_GROUPS": ("GET", "api/groups"),
    "ACTIVE_TRAIL_GET_GROUP_CONTENTS_BY_ID": ("GET", "api/groups/{id}/contents"),
    "ACTIVE_TRAIL_GET_GROUPS_EVENTS": ("GET", "api/groups/events"),
    "ACTIVE_TRAIL_DELETE_AUTOMATIONS": ("DELETE", "api/automations/{ids}"),
    "ACTIVE_TRAIL_GET_AUTOMATIONS": (
        "GET",
        "api/automations?StateType={StateType}&Page={Page}&Limit={Limit}",
    ),
    "ACTIVE_TRAIL_GET_AUTOMATIONS_DETAILS": ("GET", "api/automations/{id}/details"),
    "ACTIVE_TRAIL_GET_AUTOMATIONS_EMAIL_CAMPAIGN_STEPS": (
        "GET",
        "api/automations/{id}/EmailCampaignSteps",
    ),
    "ACTIVE_TRAIL_GET_AUTOMATIONS_SMS_CAMPAIGN_STEPS": (
        "GET",
        "api/automations/{id}/SMSCampaignSteps",
    ),
    "ACTIVE_TRAIL_DELETE_WEBHOOKS_PARAMETERS": (
        "DELETE",
        "api/webhooks/{webhook_id}/parameters/{id}",
    ),
    "ACTIVE_TRAIL_POST_WEBHOOKS_TEST2": ("POST", "api/webhooks/{id}/test"),
    "ACTIVE_TRAIL_TEST_WEBHOOK": ("POST", "api/webhooks/{id}/test"),
    "ACTIVE_TRAIL_GET_ACCOUNT_CONTENT_CATEGORIES2": (
        "GET",
        "api/account/contentCategories/{id}",
    ),
    "ACTIVE_TRAIL_DELETE_ACCOUNT_CONTENT_CATEGORIES": (
        "DELETE",
        "api/account/contentCategories/{id}",
    ),
    "ACTIVE_TRAIL_PUT_ACCOUNT_CONTENT_CATEGORIES": (
        "PUT",
        "api/account/contentCategories/{id}",
    ),
}


def parse_composio_md(path: Path) -> list[Operation]:
    text = path.read_text(encoding="utf-8")
    sections = re.split(r"\n### ", text)
    operations: list[Operation] = []
    for section in sections[1:]:
        slug_match = re.search(r"\*\*Slug:\*\* `([^`]+)`", section)
        if not slug_match:
            continue
        slug = slug_match.group(1)
        if slug == "ACTIVE_TRAIL":
            continue
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
                        type=ptype.lower(),
                        required=req.lower() == "yes",
                        description=pdesc,
                    )
                )
        operations.append(
            Operation(slug=slug, name=name, description=description, params=params)
        )
    return operations


def parse_api_docs(path: Path) -> list[ApiEndpoint]:
    lines = [line.strip() for line in path.read_text(encoding="utf-8").splitlines()]
    endpoints: list[ApiEndpoint] = []
    i = 0
    while i < len(lines):
        if lines[i] in {"GET", "POST", "PUT", "DELETE", "PATCH"}:
            method = lines[i]
            j = i + 1
            while j < len(lines) and not lines[j]:
                j += 1
            if j < len(lines) and lines[j].startswith("api/"):
                raw_path = lines[j]
                k = j + 1
                while k < len(lines) and not lines[k]:
                    k += 1
                desc = ""
                if k < len(lines) and lines[k] not in {
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE",
                    "PATCH",
                    "Method",
                    "Endpoint",
                    "Description",
                    "Top",
                }:
                    desc = lines[k]
                endpoints.append(
                    ApiEndpoint(method=method, raw_path=raw_path, description=desc)
                )
                i = j + 1
                continue
        i += 1
    return endpoints


def score_endpoint(op: Operation, endpoint: ApiEndpoint, hinted_method: str) -> float:
    if endpoint.method != hinted_method:
        return 0.0
    slug_part = strip_prefix(op.slug).lower()
    slug_tokens = tokens(slug_part.replace("_", " "))
    name_tokens = tokens(op.name)
    path_tokens = tokens(endpoint.path_only.replace("/", " "))
    desc_tokens = tokens(endpoint.description)
    score = 0.0
    score += len(slug_tokens & path_tokens) * 6.0
    score += len(name_tokens & path_tokens) * 4.0
    score += len(name_tokens & desc_tokens) * 10.0
    score += difflib.SequenceMatcher(
        None, op.name.lower(), endpoint.description.lower()
    ).ratio() * 25.0
    score += difflib.SequenceMatcher(
        None, slug_part.replace("_", " "), endpoint.path_only.replace("/", " ")
    ).ratio() * 15.0
    # verb alignment
    for verb in VERBS:
        if verb in slug_part and verb.lower() in endpoint.description.lower():
            score += 3.0
    return score


def choose_endpoint(op: Operation, endpoints: list[ApiEndpoint]) -> ApiEndpoint:
    if op.slug in MANUAL_ROUTES:
        method, raw_path = MANUAL_ROUTES[op.slug]
        for ep in endpoints:
            if ep.method == method and ep.raw_path == raw_path:
                return ep
        return ApiEndpoint(method=method, raw_path=raw_path, description=op.description)

    hinted = method_hint(op.slug, op.name)
    scored = [
        (score_endpoint(op, ep, hinted), ep)
        for ep in endpoints
        if ep.method == hinted
    ]
    scored = [item for item in scored if item[0] > 0]
    if scored:
        scored.sort(key=lambda item: item[0], reverse=True)
        return scored[0][1]

    # fallback: any method match on description only
    scored_any = [(score_endpoint(op, ep, ep.method), ep) for ep in endpoints]
    scored_any.sort(key=lambda item: item[0], reverse=True)
    return scored_any[0][1]


def normalize_path(path: str) -> str:
    if not path.startswith("/"):
        path = "/" + path
    return path


def infer_path_params(path: str, params: list[Param]) -> list[str]:
    keys = re.findall(r"\{([^}?]+)\}", path.split("?", 1)[0])
    param_names = {p.name for p in params}
    resolved: list[str] = []
    alias_map = {
        "id": ["id", "group_id", "contact_id", "campaign_id", "mailinglist_id", "webhook_id", "template_id", "automation_id", "category_id", "parameter_id", "order_id", "site_id", "segmentation_id"],
        "group_id": ["group_id", "id"],
        "contact_id": ["contact_id", "id"],
        "mailinglist_id": ["mailinglist_id", "id"],
        "campaign_id": ["campaign_id", "id"],
        "webhook_id": ["webhook_id", "id"],
        "stepId": ["step_id", "stepId"],
        "FieldsType": ["fields_type", "FieldsType"],
        "FromDate": ["from_date", "FromDate"],
        "ToDate": ["to_date", "ToDate"],
        "ids": ["ids", "id"],
    }
    for key in keys:
        if key in param_names:
            resolved.append(key)
            continue
        snake = re.sub(r"(?<!^)(?=[A-Z])", "_", key).lower()
        if snake in param_names:
            resolved.append(snake)
            continue
        for candidate in alias_map.get(key, [snake, key]):
            if candidate in param_names:
                resolved.append(candidate)
                break
        else:
            resolved.append(snake if snake != key.lower() else key)
    return resolved


def build_routes(
    operations: list[Operation], endpoints: list[ApiEndpoint]
) -> list[Route]:
    used_keys: set[str] = set()
    routes: list[Route] = []
    for op in operations:
        ep = choose_endpoint(op, endpoints)
        key = endpoint_key(op.slug, used_keys)
        group = ep.group
        path = normalize_path(ep.path_only)
        path_params = infer_path_params(ep.raw_path, op.params)
        route = Route(
            key=key,
            group=group,
            name=key,
            method=ep.method,
            path=path,
            description=op.description or op.name,
            path_params=path_params,
            query_params=ep.query_keys,
            params=op.params,
            slug=op.slug,
            risk_level=risk_level(ep.method, op.slug, op.name),
            match_score=score_endpoint(op, ep, ep.method),
        )
        routes.append(route)
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


def generate_types(routes: list[Route]) -> str:
    lines = ["import { z } from 'zod';", ""]
    for route in routes:
        key_pascal = schema_type_name(route.key)
        fields = []
        for param in route.params:
            fields.append(f"\t{param.name}: {zod_type(param)},")
        for qp in route.query_params:
            snake = re.sub(r"(?<!^)(?=[A-Z])", "_", qp).lower()
            if not any(p.name == snake for p in route.params):
                fields.append(f"\t{snake}: z.union([z.string(), z.number()]).optional(),")
        for pp in route.path_params:
            if not any(p.name == pp for p in route.params):
                fields.append(f"\t{pp}: z.union([z.string(), z.number()]).optional(),")
        fields.append("\tbody: z.unknown().optional(),")
        fields.append("\tquery: z.record(z.string(), z.unknown()).optional(),")
        schema = (
            "z.object({\n" + "\n".join(fields) + "\n})"
            if fields
            else "z.object({}).optional()"
        )
        lines.extend(
            [
                f"// {route.name}",
                f"const {key_pascal}InputSchema = {schema};",
                f"export type {key_pascal}Input = z.infer<typeof {key_pascal}InputSchema>;",
                f"const {key_pascal}ResponseSchema = z.unknown();",
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

    lines.append("export type ActiveTrailEndpointInput = ActiveTrailEndpointInputs[keyof ActiveTrailEndpointInputs] & {")
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


def json_str(value: str) -> str:
    return repr(value)


def generate_factory() -> str:
    return textwrap.dedent(
        f"""
        import type {{ CorsairEndpoint }} from 'corsair/core';
        import {{ logEventFromContext }} from 'corsair/core';
        import {{ make{PASCAL}Request }} from '../client';
        import type {{ {PASCAL}Context }} from '../index';
        import type {{ {PASCAL}Route }} from './routes';
        import type {{ {PASCAL}EndpointInput }} from './types';

        const PATH_PARAM_ALIASES: Record<string, readonly string[]> = {{
        	id: ['id', 'group_id', 'contact_id', 'campaign_id', 'mailinglist_id', 'webhook_id', 'template_id', 'automation_id', 'category_id', 'parameter_id', 'order_id', 'site_id', 'segmentation_id'],
        	ids: ['ids', 'id'],
        	group_id: ['group_id', 'id'],
        	contact_id: ['contact_id', 'id'],
        	mailinglist_id: ['mailinglist_id', 'id'],
        	campaign_id: ['campaign_id', 'id'],
        	webhook_id: ['webhook_id', 'id'],
        	stepId: ['step_id', 'stepId'],
        	FieldsType: ['fields_type', 'FieldsType'],
        	FromDate: ['from_date', 'FromDate'],
        	ToDate: ['to_date', 'ToDate'],
        }};

        const BODY_CONTROL_KEYS = new Set(['body', 'query', 'headers']);

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

        export function resolvePath(path: string, input: {PASCAL}EndpointInput): string {{
        	const pathOnly = path.split('?')[0] ?? path;
        	return pathOnly.replace(/\\{{([^}}]+)\\}}/g, (_, key: string) =>
        		encodePathPart(resolvePathParam(input, key)),
        	);
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

        export async function log{PASCAL}Operation(
        	ctx: {PASCAL}Context,
        	input: {PASCAL}EndpointInput,
        	route: {PASCAL}Route,
        ) {{
        	await logEventFromContext(
        		ctx,
        		`{PLUGIN_ID}.${{route.group}}.${{route.name}}`,
        		{{ method: route.method, path: route.path }},
        		'completed',
        	);
        }}

        export async function request{PASCAL}Operation(
        	ctx: {PASCAL}Context,
        	input: {PASCAL}EndpointInput,
        	route: {PASCAL}Route,
        ) {{
        	return make{PASCAL}Request(resolvePath(route.path, input), ctx.key, {{
        		method: route.method,
        		body: requestBody(route, input),
        		query: buildQuery(route, input),
        		headers: input.headers as Record<string, string> | undefined,
        	}});
        }}
        """
    ).strip() + "\n"


def generate_group_file(group: str, routes: list[Route]) -> str:
    group_pascal = to_pascal_case(group)
    lines = [
        f"import {{ {CAMEL}Routes }} from './routes';",
        f"import type {{ {PASCAL}Endpoint }} from './factory';",
        f"import {{ log{PASCAL}Operation, request{PASCAL}Operation }} from './factory';",
        "",
        "function getRoute(name: string) {",
        "\tconst route = activeTrailRoutes.find((candidate) => candidate.name === name);",
        "\tif (!route) {",
        f"\t\tthrow new Error('[{PLUGIN_ID}] missing route: ${{name}}');",
        "\t}",
        "\treturn route;",
        "}",
        "",
    ]
    # fix variable name in getRoute
    lines[5] = f"\tconst route = {CAMEL}Routes.find((candidate) => candidate.name === name);"

    exports: list[str] = []
    for route in routes:
        const_name = f"{route.name}Route"
        lines.extend(
            [
                f"const {const_name} = getRoute('{route.name}');",
                f"export const {route.name}: {PASCAL}Endpoint = async (ctx, input = {{}}) => {{",
                f"\tconst result = await request{PASCAL}Operation(ctx, input, {const_name});",
                f"\tawait log{PASCAL}Operation(ctx, input, {const_name});",
                "\treturn result;",
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
        			Authorization: apiKey,
        			...headers,
        		}},
        	}};

        	const hasBody = !['GET', 'HEAD', 'OPTIONS', 'DELETE'].includes(method);
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
        import type {{ {PASCAL}APIError }} from './client';

        function getStatus(error: Error): number | undefined {{
        	return (error as Partial<{PASCAL}APIError>).status;
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
        				'[{PASCAL.upper()}] Authentication failed — check your ActiveTrail API key.',
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
        """
        import { z } from 'zod';

        export const ActiveTrailContact = z.object({
        	id: z.union([z.string(), z.number()]).optional(),
        	email: z.string().optional(),
        	first_name: z.string().optional(),
        	last_name: z.string().optional(),
        	createdAt: z.coerce.date().nullable().optional(),
        });

        export const ActiveTrailCampaign = z.object({
        	id: z.union([z.string(), z.number()]).optional(),
        	name: z.string().optional(),
        	subject: z.string().optional(),
        	createdAt: z.coerce.date().nullable().optional(),
        });

        export const ActiveTrailGroup = z.object({
        	id: z.union([z.string(), z.number()]).optional(),
        	name: z.string().optional(),
        	createdAt: z.coerce.date().nullable().optional(),
        });

        export type ActiveTrailContact = z.infer<typeof ActiveTrailContact>;
        export type ActiveTrailCampaign = z.infer<typeof ActiveTrailCampaign>;
        export type ActiveTrailGroup = z.infer<typeof ActiveTrailGroup>;
        """
    ).strip() + "\n"


def generate_schema_index() -> str:
    return textwrap.dedent(
        """
        import { ActiveTrailCampaign, ActiveTrailContact, ActiveTrailGroup } from './database';

        export const ActiveTrailSchema = {
        	version: '1.0.0',
        	entities: {
        		contacts: ActiveTrailContact,
        		campaigns: ActiveTrailCampaign,
        		groups: ActiveTrailGroup,
        	},
        } as const;
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
        						'[{PASCAL.upper()}] API key missing — connect ActiveTrail or pass key in plugin options.',
        					);
        					throw new AuthMissingError('{PLUGIN_ID}', 'api_key');
        				}}
        				return res;
        			}}

        			console.error(
        				'[{PASCAL.upper()}] Authentication required for ActiveTrail API requests.',
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
    import json

    return (
        json.dumps(
            {
                "name": PACKAGE_NAME,
                "version": "0.1.0",
                "description": "ActiveTrail plugin for Corsair",
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
                "keywords": ["corsair", "active_trail", "activetrail", "plugin"],
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

        	it('sends Authorization header and JSON bodies', async () => {{
        		await make{PASCAL}Request('/api/account/balance', 'test-api-key', {{
        			method: 'GET',
        		}});

        		expect(mockRequest).toHaveBeenCalledWith(
        			expect.objectContaining({{
        				BASE: '{BASE_URL}',
        				TOKEN: 'test-api-key',
        				HEADERS: expect.objectContaining({{
        					Authorization: 'test-api-key',
        					'Content-Type': 'application/json',
        				}}),
        			}}),
        			expect.objectContaining({{
        				method: 'GET',
        				url: '/api/account/balance',
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
        			account: {{
        				getAccountBalance: (ctx: {PASCAL}Context, input: {{}}) => Promise<unknown>;
        			}};
        			groups: {{
        				createANewGroup: (
        					ctx: {PASCAL}Context,
        					input: {{ name: string }},
        				) => Promise<unknown>;
        			}};
        		}};

        		await endpoints.account.getAccountBalance(mockCtx, {{}});
        		await endpoints.groups.createANewGroup(mockCtx, {{ name: 'Test Group' }});

        		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
        			expect.arrayContaining([
        				expect.objectContaining({{
        					method: 'GET',
        					url: '/api/account/balance',
        				}}),
        				expect.objectContaining({{
        					method: 'POST',
        					url: '/api/groups',
        					body: {{ name: 'Test Group' }},
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
    if "'active_trail'" not in text:
        text = text.replace(
            "\t'agentql',",
            "\t'active_trail',\n\t'agentql',",
        )
        text = text.replace(
            "\tagentql: 'AgentQL',",
            "\tactive_trail: 'ActiveTrail',\n\tagentql: 'AgentQL',",
        )
        text = text.replace(
            "\t| 'agentql'",
            "\t| 'active_trail'\n\t| 'agentql'",
        )
        path.write_text(text, encoding="utf-8")


def update_demo_testing() -> None:
    pkg_path = REPO_ROOT / "demo/testing/package.json"
    import json

    pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
    deps = pkg.setdefault("dependencies", {})
    deps["@corsair-dev/active_trail"] = "workspace:*"
    pkg_path.write_text(json.dumps(pkg, indent=2) + "\n", encoding="utf-8")

    corsair_path = REPO_ROOT / "demo/testing/src/server/corsair.ts"
    text = corsair_path.read_text(encoding="utf-8")
    if "@corsair-dev/active_trail" not in text:
        text = text.replace(
            "import { agentql } from '@corsair-dev/agentql';",
            "import { active_trail } from '@corsair-dev/active_trail';\nimport { agentql } from '@corsair-dev/agentql';",
        )
    if "active_trail(" not in text:
        text = text.replace(
            "\t\tagentql({\n\t\t\tkey: process.env.AGENTQL_API_KEY,\n\t\t}),",
            "\t\tactive_trail({\n\t\t\tkey: process.env.ACTIVE_TRAIL_API_KEY,\n\t\t}),\n\t\tagentql({\n\t\t\tkey: process.env.AGENTQL_API_KEY,\n\t\t}),",
        )
    corsair_path.write_text(text, encoding="utf-8")


def main() -> None:
    operations = parse_composio_md(COMPOSIO_MD)
    endpoints = parse_api_docs(API_DOCS)
    routes = build_routes(operations, endpoints)
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
