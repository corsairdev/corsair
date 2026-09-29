export type CompareFeatureRow = {
	feature: string;
	corsair: boolean;
	competitor: boolean;
};

export type ComparePageContent = {
	meta: {
		title: string;
		description: string;
	};
	hero: {
		competitor: string;
		title: string;
		description: string;
	};
	sections: {
		title: string;
		/** HTML string — use `<p>`, `<a href="...">`, etc. */
		body: string;
	}[];
	recap: {
		title: string;
		columns: {
			feature: string;
			corsair: string;
			competitor: string;
		};
		rows: CompareFeatureRow[];
		/** HTML string */
		footer: string;
	};
};
