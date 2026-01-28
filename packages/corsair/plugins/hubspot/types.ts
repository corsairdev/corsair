export type ContactResponse = {
	id: string;
	properties: Record<string, any>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
};

export type CompanyResponse = {
	id: string;
	properties: Record<string, any>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
};

export type DealResponse = {
	id: string;
	properties: Record<string, any>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
};

export type TicketResponse = {
	id: string;
	properties: Record<string, any>;
	createdAt: string;
	updatedAt: string;
	archived?: boolean;
};

export type EngagementResponse = {
	id: string;
	engagement: {
		id: number;
		portalId: number;
		active?: boolean;
		createdAt?: number;
		lastUpdated?: number;
		createdBy?: number;
		modifiedBy?: number;
		ownerId?: number;
		type?: string;
		timestamp?: number;
	};
	associations?: Record<string, any>;
	metadata?: Record<string, any>;
};

export type PagingResponse = {
	next?: {
		after: string;
	};
	prev?: {
		before: string;
	};
};
