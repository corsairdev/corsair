export interface SpokiAccount {
	id: number;
	name: string;
	current_credit: number;
	status: string;
	default_language: string;
	phone: string;
	has_official_verification: boolean;
	daily_limit: number;
	phone_status: string;
	quality_score: number;
	quality_reasons: unknown;
	is_active: boolean;
	country_code: string;
	estimated_available_conversations: number;
	account_type: number;
	default_pricing_delta: number;
	low_credit_threshold: number;
	has_low_credit_alert: boolean;
	default_prefix: string;
	default_country_code: string;
	timezone: string;
	contacted_in_24h: number;
	contacted_in_7d: number;
	primary_channel_id?: number | null;
	channels?: SpokiChannel[];
}

export interface SpokiChannel {
	id: number;
	name: string;
	phone: string;
	phone_status: string;
	quality_score: number;
	quality_reasons?: unknown;
	has_official_verification: boolean;
	daily_limit: number;
	account_type: number;
	is_active: boolean;
}

export interface StartAutomationInput {
	secret: string;
	phone: string;
	first_name?: string;
	last_name?: string;
	email?: string;
	language?: string;
	custom_fields?: Record<string, unknown>;
	metadata?: Record<string, unknown>;
}

export interface SendMessageInput {
	phone: string;
	message: string;
}

export interface SendMessageResponse {
	success?: boolean;
	message?: string;
	[key: string]: unknown;
}

export interface ListAccountsResponse {
	accounts: SpokiAccount[];
	[key: string]: unknown;
}

export interface GetAccountResponse extends SpokiAccount {}

export interface GetAccountByPhoneResponse extends SpokiAccount {}
