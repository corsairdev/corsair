import { Loader2 } from 'lucide-react';

export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
				<p className="text-muted-foreground">Loading...</p>
			</div>
		</div>
	);
}
