import json
from pathlib import Path

PACKAGE_ROOT = Path(__file__).resolve().parents[1]
INVENTORY_PATH = PACKAGE_ROOT / "route-inventory.json"
COVERAGE_PATH = PACKAGE_ROOT / "ROUTE_COVERAGE.md"

routes = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
excluded = [route for route in routes if route["coverageStatus"] == "excluded"]
registered = [route for route in routes if route["coverageStatus"] != "excluded"]
audited = [route for route in registered if route["coverageStatus"] == "schema_audited"]
wrapper_only = [route for route in registered if route["coverageStatus"] == "wrapper_only"]
transport_modeled = [route for route in registered if route["coverageStatus"] == "transport_modeled"]
transport_pending = [route for route in registered if route["coverageStatus"] == "transport_pending"]
lines = [
    "# D2L Brightspace REST route coverage",
    "",
    "> Inventory source: D2L official [HTTP Routing Table](https://docs.valence.desire2learn.com/http-routingtable.html), with per-operation source links below. The route table currently enumerates **876** method/path pairs across seven product groups.",
    "",
    "## Coverage status",
    "",
    f"- Official route entries inventoried: **{len(routes)}**.",
    f"- Corsair route wrappers registered: **{len(registered)}**.",
    f"- Routes with operation-specific input/output handling: **{len(audited)}** audited JSON/binary schemas and **{len(transport_modeled)}** multipart/form/resumable-upload transports (JSON resource schemas may still be generic).",
    f"- Routes with generic route wrappers and incomplete body/response models: **{len(wrapper_only)}**.",
    f"- Routes requiring undocumented form-field work: **{len(transport_pending)}**.",
    f"- Explicitly excluded: **{len(excluded)}** legacy browser-auth redirects described below.",
    "",
    "Each route row below records the official method/path, path and query parameters, JSON parameter type names, request/response modes, response summary, status codes, version range, scope, and D2L source. API version discovery operations (`d2l0001`–`d2l0004`), documented binary-output routes, and selected user identity/profile routes have operation-specific Zod schemas. The remaining JSON resource shapes and three form routes with incomplete field details still need route-by-route schema work before claiming full surface implementation.",
    "",
    "## Explicit exclusions",
    "",
    "| Route | Reason | Official evidence |",
    "| --- | --- | --- |",
]

for route in excluded:
    lines.append(
        f"| `{route['method']} {route['path']}` | Legacy interactive ID-Key authentication redirect/cancel flow; not a normal resource request/response operation and not used by the OAuth 2 auth-code integration. | [Operation docs]({route['doc']}), [legacy auth flow](https://docs.valence.desire2learn.com/basic/legacyauth.html) |"
    )

lines.extend(
    [
        "",
        "## Complete route ledger",
        "",
        "| ID | Product group | Auth | Method + path | Path params | Query params (type/required) | JSON params | Form params | File parts | Request mode | Response mode / documented return | Status codes | API versions | OAuth scopes | Coverage | Official operation reference |",
        "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
)

for route in routes:
    path_params = ", ".join(f"`{value}`" for value in route["pathParams"]) or "—"
    query_params = ", ".join(
        f"`{detail['name']}` ({detail['type'].strip()}; {'required' if detail['required'] else 'optional'})"
        for detail in route["queryDetails"]
    ) or "—"
    json_params = ", ".join(
        f"`{detail['name']}` ({detail['type'].strip()}; {'required' if detail['required'] else 'optional'})"
        for detail in route["jsonParamDetails"]
    ) or "—"
    form_params = ", ".join(
        f"`{detail['name']}` ({detail['type'].strip()}; {'required' if detail['required'] else 'optional'}{'; repeatable' if detail['repeatable'] else ''})"
        for detail in route["formDetails"]
    ) or "—"
    file_parts = ", ".join(f"`{name}`" for name in route["filePartNames"])
    if route["filePartNumbered"]:
        file_parts = "`file 0`, `file 1`, …"
    if file_parts and route["filesRequired"]:
        file_parts += " (required)"
    elif file_parts:
        file_parts += " (optional)"
    else:
        file_parts = "—"
    scopes = ", ".join(f"`{value}`" for value in route["oauthScopes"])
    if not scopes:
        scopes = "`core:*:*` fallback where no operation-specific scope is assigned"
    auth = "OAuth 2 auth-code; legacy ID-Key"
    if route["coverageStatus"] == "excluded":
        auth = "Legacy ID-Key browser flow"
    elif route["group"] == "API properties" and "/versions" in route["path"]:
        auth = "Public (D2L documents anonymous calls)"
    if route["coverageStatus"] == "excluded":
        status = "Excluded: legacy interactive auth flow"
    elif route["coverageStatus"] == "schema_audited":
        status = "Operation-specific Zod schema audited"
    elif route["coverageStatus"] == "transport_modeled":
        status = "Documented multipart/form/resumable transport modeled; resource schema pending"
    elif route["coverageStatus"] == "transport_pending":
        status = "Pending undocumented form field details"
    else:
        status = "Wrapper only; strict resource schema pending"
    summary = route["returnDescription"] or "Return shape not stated in this operation's first Return paragraph."
    summary = summary.replace("|", "\\|")
    api_versions = route["apiVersions"].replace("|", "\\|") or "Not stated"
    status_codes = ", ".join(str(code) for code in route["statusCodes"]) or "Not stated"
    lines.append(
        f"| {route['routeId']} | {route['group']} | {auth} | `{route['method']} {route['path']}` | {path_params} | {query_params} | {json_params} | {form_params} | {file_parts} | {route['requestMode']} | {route['responseMode']}: {summary} | {status_codes} | {api_versions} | {scopes} | {status} | [D2L docs]({route['doc']}) |"
    )

COVERAGE_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(
    f"coverage rows: {len(routes)}; wrappers: {len(registered)}; "
    f"exclusions: {len(excluded)}"
)
