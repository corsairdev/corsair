/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { repository_rule_branch_name_pattern } from './repository_rule_branch_name_pattern';
import type { repository_rule_code_scanning } from './repository_rule_code_scanning';
import type { repository_rule_commit_author_email_pattern } from './repository_rule_commit_author_email_pattern';
import type { repository_rule_commit_message_pattern } from './repository_rule_commit_message_pattern';
import type { repository_rule_committer_email_pattern } from './repository_rule_committer_email_pattern';
import type { repository_rule_copilot_code_review } from './repository_rule_copilot_code_review';
import type { repository_rule_creation } from './repository_rule_creation';
import type { repository_rule_deletion } from './repository_rule_deletion';
import type { repository_rule_file_extension_restriction } from './repository_rule_file_extension_restriction';
import type { repository_rule_file_path_restriction } from './repository_rule_file_path_restriction';
import type { repository_rule_max_file_path_length } from './repository_rule_max_file_path_length';
import type { repository_rule_max_file_size } from './repository_rule_max_file_size';
import type { repository_rule_non_fast_forward } from './repository_rule_non_fast_forward';
import type { repository_rule_pull_request } from './repository_rule_pull_request';
import type { repository_rule_required_deployments } from './repository_rule_required_deployments';
import type { repository_rule_required_linear_history } from './repository_rule_required_linear_history';
import type { repository_rule_required_signatures } from './repository_rule_required_signatures';
import type { repository_rule_required_status_checks } from './repository_rule_required_status_checks';
import type { repository_rule_tag_name_pattern } from './repository_rule_tag_name_pattern';
import type { repository_rule_update } from './repository_rule_update';
import type { repository_rule_workflows } from './repository_rule_workflows';
/**
 * A repository rule.
 */
export type org_rules = (repository_rule_creation | repository_rule_update | repository_rule_deletion | repository_rule_required_linear_history | repository_rule_required_deployments | repository_rule_required_signatures | repository_rule_pull_request | repository_rule_required_status_checks | repository_rule_non_fast_forward | repository_rule_commit_message_pattern | repository_rule_commit_author_email_pattern | repository_rule_committer_email_pattern | repository_rule_branch_name_pattern | repository_rule_tag_name_pattern | repository_rule_file_path_restriction | repository_rule_max_file_path_length | repository_rule_file_extension_restriction | repository_rule_max_file_size | repository_rule_workflows | repository_rule_code_scanning | repository_rule_copilot_code_review);

