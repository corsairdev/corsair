/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Pages Health Check Status
 */
export type pages_health_check = {
    domain?: {
        host?: string;
        uri?: string;
        nameservers?: string;
        dns_resolves?: boolean;
        is_proxied?: boolean | null;
        is_cloudflare_ip?: boolean | null;
        is_fastly_ip?: boolean | null;
        is_old_ip_address?: boolean | null;
        is_a_record?: boolean | null;
        has_cname_record?: boolean | null;
        has_mx_records_present?: boolean | null;
        is_valid_domain?: boolean;
        is_apex_domain?: boolean;
        should_be_a_record?: boolean | null;
        is_cname_to_github_user_domain?: boolean | null;
        is_cname_to_pages_dot_github_dot_com?: boolean | null;
        is_cname_to_fastly?: boolean | null;
        is_pointed_to_github_pages_ip?: boolean | null;
        is_non_github_pages_ip_present?: boolean | null;
        is_pages_domain?: boolean;
        is_served_by_pages?: boolean | null;
        is_valid?: boolean;
        reason?: string | null;
        responds_to_https?: boolean;
        enforces_https?: boolean;
        https_error?: string | null;
        is_https_eligible?: boolean | null;
        caa_error?: string | null;
    };
    alt_domain?: {
        host?: string;
        uri?: string;
        nameservers?: string;
        dns_resolves?: boolean;
        is_proxied?: boolean | null;
        is_cloudflare_ip?: boolean | null;
        is_fastly_ip?: boolean | null;
        is_old_ip_address?: boolean | null;
        is_a_record?: boolean | null;
        has_cname_record?: boolean | null;
        has_mx_records_present?: boolean | null;
        is_valid_domain?: boolean;
        is_apex_domain?: boolean;
        should_be_a_record?: boolean | null;
        is_cname_to_github_user_domain?: boolean | null;
        is_cname_to_pages_dot_github_dot_com?: boolean | null;
        is_cname_to_fastly?: boolean | null;
        is_pointed_to_github_pages_ip?: boolean | null;
        is_non_github_pages_ip_present?: boolean | null;
        is_pages_domain?: boolean;
        is_served_by_pages?: boolean | null;
        is_valid?: boolean;
        reason?: string | null;
        responds_to_https?: boolean;
        enforces_https?: boolean;
        https_error?: string | null;
        is_https_eligible?: boolean | null;
        caa_error?: string | null;
    } | null;
};

