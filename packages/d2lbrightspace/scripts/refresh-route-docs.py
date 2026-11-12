import html
import json
import re
import urllib.request
from pathlib import Path

PACKAGE_ROOT = Path(__file__).resolve().parents[1]
INVENTORY_PATH = PACKAGE_ROOT / "route-inventory.json"
routes = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
USER_SCHEMA_ROUTES = {
    "d2l0854",
    "d2l0855",
    "d2l0857",
    "d2l0858",
    "d2l0859",
    "d2l0861",
    "d2l0862",
    "d2l0863",
    "d2l0867",
    "d2l0868",
    "d2l0870",
    "d2l0871",
    "d2l0872",
    "d2l0873",
    "d2l0874",
    "d2l0875",
    "d2l0876",
}
pages = sorted({route["doc"].split("#", 1)[0] for route in routes})
page_cache = {}

for page in pages:
    request = urllib.request.Request(
        page,
        headers={"User-Agent": "Corsair D2L Brightspace route inventory"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        page_cache[page] = response.read().decode("utf-8")


def plain_text(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", html.unescape(value)).strip()


def field_value(section: str, name: str) -> str:
    escaped = re.escape(name)
    match = re.search(
        rf"{escaped}.*?</dt>\s*<dd[^>]*>(.*?)</dd>", section, re.S
    )
    return match.group(1) if match else ""


def parameter_rows(section: str, label: str) -> list[dict[str, str | bool]]:
    value = field_value(section, label)
    rows = []
    for name_html, detail_html in re.findall(
        r"<li><p><strong>(.*?)</strong>(.*?)</p></li>", value, re.S
    ):
        name = plain_text(name_html)
        detail = plain_text(detail_html)
        type_match = re.match(r"\s*\((.*?)\)", detail)
        type_name = type_match.group(1) if type_match else "string"
        rows.append(
            {
                "name": name,
                "type": type_name,
                "required": not bool(re.search(r"\bOptional\.", detail)),
                "repeatable": "may appear more than once" in detail.lower(),
                "description": detail,
            }
        )
    return rows


for route in routes:
    route.pop("queryTypes", None)
    route.pop("returnText", None)
    page, anchor = route["doc"].split("#", 1)
    source = page_cache[page]
    anchor_offset = source.find(f'id="{anchor}"')
    if anchor_offset < 0:
        raise ValueError(f"Official route anchor not found: {route['doc']}")
    start = source.rfind('<dt class="sig sig-object http"', 0, anchor_offset)
    end = source.find('<dt class="sig sig-object http"', anchor_offset + 1)
    section = source[start : end if end >= 0 else len(source)]

    input_match = re.search(r"<p><strong>Input</strong>(.*?)</p>", section, re.S)
    return_match = re.search(r"<p><strong>Returns?</strong>(.*?)</p>", section, re.S)
    query_rows = parameter_rows(section, "Query Parameters")
    json_rows = parameter_rows(section, "JSON Parameters")
    form_rows = parameter_rows(section, "Form Parameters")
    status_section = field_value(section, "Status Codes")
    statuses = sorted(
        {
            int(code)
            for code in re.findall(r">(\d{3})\s+[A-Za-z ]+<", status_section)
        }
    )
    scope_section = field_value(section, "Oauth2 Scopes")
    scopes = sorted(
        {
            scope
            for group in re.findall(r"<em>(.*?)</em>", scope_section, re.S)
            for scope in plain_text(group).split()
        }
    )
    input_text = plain_text(input_match.group(1)) if input_match else ""
    return_text = plain_text(return_match.group(1)) if return_match else ""
    lower_contract = (input_text + " " + return_text).lower()
    if "if the action retrieves a folder" in lower_contract and "file stream" in lower_contract:
        response_mode = "binary_or_json"
    elif "file stream" in lower_contract or "zip file containing" in lower_contract:
        response_mode = "binary"
    else:
        response_mode = "json"
    if "resumable upload" in input_text.lower():
        request_mode = "resumable"
    elif any(
        term in input_text.lower()
        for term in (
            "multipart",
            "simple file upload",
            "uploaded image file",
            "uploaded content file",
            "simple upload",
        )
    ):
        request_mode = "multipart"
    elif "post form" in input_text.lower() or "put form" in input_text.lower() or "form data" in input_text.lower():
        request_mode = "form"
    else:
        request_mode = "json"

    route["queryDetails"] = query_rows
    route["requiredQueryParams"] = [row["name"] for row in query_rows if row["required"]]
    route["jsonParamDetails"] = json_rows
    route["formDetails"] = form_rows
    route["formFields"] = [row["name"] for row in form_rows]
    route["requiredFormFields"] = [row["name"] for row in form_rows if row["required"]]
    route["inputDescription"] = input_text
    route["returnDescription"] = return_text
    route["statusCodes"] = statuses
    route["apiVersions"] = plain_text(field_value(section, "API Versions"))
    route["oauthScopes"] = scopes
    route["requestMode"] = request_mode
    route["responseMode"] = response_mode

# These multipart part names are stated by the linked route docs or D2L's
# official upload protocol examples cited by those routes.
multipart_fields = {
    "d2l0057": (["file"], True, False),
    "d2l0219": (["file"], True, False),
    "d2l0224": (["file"], True, False),
    "d2l0310": ([""], True, False),
    "d2l0312": ([""], True, False),
    "d2l0378": (["file"], False, True),
    "d2l0383": (["file"], True, False),
    "d2l0487": (["file"], True, False),
    "d2l0586": (["Resource"], True, False),
    "d2l0587": (["Resource"], True, False),
    "d2l0692": (["Image"], True, False),
    "d2l0823": (["profileImage"], True, False),
    "d2l0828": (["profileImage"], True, False),
    "d2l0833": (["profileImage"], True, False),
}
for route in routes:
    part_names, files_required, numbered = multipart_fields.get(
        route["routeId"], ([], False, False)
    )
    route["filePartNames"] = part_names
    route["filesRequired"] = files_required
    route["filePartNumbered"] = numbered
    route["multipartFormat"] = (
        "mixed"
        if route["requestMode"] == "multipart"
        and "multipart/mixed" in route["inputDescription"].lower()
        else "form-data"
    )
    if route["coverageStatus"] == "excluded":
        continue
    if (
        route["routeId"]
        in {"d2l0001", "d2l0002", "d2l0003", "d2l0004"} | USER_SCHEMA_ROUTES
        or route["responseMode"] == "binary"
    ):
        route["coverageStatus"] = "schema_audited"
    elif route["requestMode"] in {"multipart", "resumable"} or (
        route["requestMode"] == "form" and route["formFields"]
    ):
        route["coverageStatus"] = "transport_modeled"
    elif route["requestMode"] == "form":
        route["coverageStatus"] = "transport_pending"
    else:
        route["coverageStatus"] = "wrapper_only"

INVENTORY_PATH.write_text(
    json.dumps(routes, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"refreshed {len(routes)} operations from {len(pages)} official resource pages")
