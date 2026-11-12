import json
from pathlib import Path

PACKAGE_ROOT = Path(__file__).resolve().parents[1]
routes = json.loads(
    (PACKAGE_ROOT / "route-inventory.json").read_text(encoding="utf-8")
)

route_fields = [
    "routeId",
    "group",
    "groupKey",
    "operationKey",
    "operationPath",
    "method",
    "path",
    "pathParams",
    "queryParams",
    "jsonParams",
    "jsonParamDetails",
    "formDetails",
    "formFields",
    "requiredFormFields",
    "queryDetails",
    "requiredQueryParams",
    "oauthScopes",
    "summary",
    "doc",
    "inputDescription",
    "returnDescription",
    "apiVersions",
    "statusCodes",
    "requestMode",
    "multipartFormat",
    "filePartNames",
    "filesRequired",
    "filePartNumbered",
    "responseMode",
    "coverageStatus",
    "coverageReason",
]

route_type_lines = [
    "// Generated from the official D2L HTTP Routing Table and linked resource pages.",
    "export type D2lRouteDefinition = {",
    "\trouteId: string;",
    "\tgroup: string;",
    "\tgroupKey: string;",
    "\toperationKey: string;",
    "\toperationPath: string;",
    "\tmethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';",
    "\tpath: string;",
    "\tpathParams: readonly string[];",
    "\tqueryParams: readonly string[];",
    "\tjsonParams: readonly string[];",
    "\tjsonParamDetails: readonly { name: string; type: string; required: boolean; repeatable: boolean; description: string }[];",
    "\tformDetails: readonly { name: string; type: string; required: boolean; repeatable: boolean; description: string }[];",
    "\tformFields: readonly string[];",
    "\trequiredFormFields: readonly string[];",
    "\tqueryDetails: readonly { name: string; type: string; required: boolean; repeatable: boolean; description: string }[];",
    "\trequiredQueryParams: readonly string[];",
    "\toauthScopes: readonly string[];",
    "\tsummary: string;",
    "\tdoc: string;",
    "\tinputDescription: string;",
    "\treturnDescription: string;",
    "\tapiVersions: string;",
    "\tstatusCodes: readonly number[];",
    "\trequestMode: 'json' | 'form' | 'multipart' | 'resumable';",
    "\tmultipartFormat: 'form-data' | 'mixed';",
    "\tfilePartNames: readonly string[];",
    "\tfilesRequired: boolean;",
    "\tfilePartNumbered: boolean;",
    "\tresponseMode: 'json' | 'binary' | 'binary_or_json';",
    "\tcoverageStatus: 'excluded' | 'wrapper_only' | 'schema_audited' | 'transport_modeled' | 'transport_pending';",
    "\tcoverageReason: string;",
    "};",
    "",
]
split_index = len(routes) // 2
route_parts = [routes[:split_index], routes[split_index:]]
for part_number, route_part in enumerate(route_parts, start=1):
    part_name = f"route-definitions-{part_number}.ts"
    const_name = f"D2L_ROUTE_PART_{part_number}"
    part_lines = [
        "// Generated from the official D2L HTTP Routing Table and linked resource pages.",
        "import type { D2lRouteDefinition } from './route-definitions';",
        "",
        f"export const {const_name}: readonly D2lRouteDefinition[] = [",
    ]
    for route in route_part:
        part_lines.append(
            "\t"
            + json.dumps(
                {field: route[field] for field in route_fields},
                ensure_ascii=False,
                separators=(",", ":"),
            )
            + ","
        )
    part_lines.extend(["];"])
    (PACKAGE_ROOT / part_name).write_text("\n".join(part_lines) + "\n", encoding="utf-8")

route_lines = route_type_lines + [
    "import { D2L_ROUTE_PART_1 } from './route-definitions-1';",
    "import { D2L_ROUTE_PART_2 } from './route-definitions-2';",
]
route_lines.extend(
    [
        "",
        "export const D2L_ROUTES: readonly D2lRouteDefinition[] = [",
        "\t...D2L_ROUTE_PART_1,",
        "\t...D2L_ROUTE_PART_2,",
        "];",
        "",
        "export function getD2lRoute(index: number): D2lRouteDefinition {",
        "\tconst route = D2L_ROUTES[index];",
        "\tif (!route) throw new Error(`Unknown D2L route index ${index}.`);",
        "\treturn route;",
        "}",
        "",
    ]
)
(PACKAGE_ROOT / "route-definitions.ts").write_text("\n".join(route_lines), encoding="utf-8")

groups = {}
for index, route in enumerate(routes):
    if route["coverageStatus"] != "excluded":
        groups.setdefault(route["groupKey"], []).append(
            (index, route["operationKey"])
        )

endpoint_lines = [
    "import { createD2lRouteEndpoint } from './route-operation';",
    "import { getD2lRoute } from '../route-definitions';",
    "",
    "export const d2lBrightspaceEndpointsNested = {",
]
for group, endpoints in groups.items():
    endpoint_lines.append(f"\t{group}: {{")
    for index, operation in endpoints:
        endpoint_lines.append(
            f"\t\t{operation}: createD2lRouteEndpoint(getD2lRoute({index})),"
        )
    endpoint_lines.append("\t},")
endpoint_lines.extend(["} as const;", ""])
(PACKAGE_ROOT / "endpoints" / "index.ts").write_text(
    "\n".join(endpoint_lines), encoding="utf-8"
)

registry_lines = [
    "import type { RequiredPluginEndpointMeta, RequiredPluginEndpointSchemas } from 'corsair/core';",
    "import { createD2lRouteInputSchema, createD2lRouteOutputSchema } from './types';",
    "import { d2lBrightspaceEndpointsNested } from './index';",
    "import { getD2lRoute } from '../route-definitions';",
    "",
    "export const d2lBrightspaceEndpointSchemas: RequiredPluginEndpointSchemas<typeof d2lBrightspaceEndpointsNested> = {",
]
for index, route in enumerate(routes):
    if route["coverageStatus"] == "excluded":
        continue
    registry_lines.append(
        f"\t{json.dumps(route['operationPath'])}: {{ input: createD2lRouteInputSchema(getD2lRoute({index})), output: createD2lRouteOutputSchema(getD2lRoute({index})) }},"
    )
registry_lines.extend(
    [
        "};",
        "",
        "export const d2lBrightspaceEndpointMeta: RequiredPluginEndpointMeta<typeof d2lBrightspaceEndpointsNested> = {",
    ]
)
for index, route in enumerate(routes):
    if route["coverageStatus"] == "excluded":
        continue
    risk = (
        "read"
        if route["method"] == "GET"
        else "destructive"
        if route["method"] == "DELETE"
        else "write"
    )
    description = (
        f"{route['method']} {route['path']}: {route['summary']} "
        f"Official reference: {route['doc']}"
    )
    registry_lines.append(
        f"\t{json.dumps(route['operationPath'])}: {{ riskLevel: {json.dumps(risk)}, description: {json.dumps(description, ensure_ascii=False)} }},"
    )
registry_lines.extend(
    [
        "};",
        "",
    ]
)
(PACKAGE_ROOT / "endpoints" / "registry.ts").write_text(
    "\n".join(registry_lines), encoding="utf-8"
)

print(
    f"generated {len(routes)} inventory rows, "
    f"{sum(len(items) for items in groups.values())} endpoint wrappers, "
    f"{sum(route['coverageStatus'] == 'excluded' for route in routes)} exclusions"
)
