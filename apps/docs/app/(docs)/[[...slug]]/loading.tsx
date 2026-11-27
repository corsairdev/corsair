export default function Loading() {
	return (
		<div className="mx-auto w-full max-w-3xl animate-pulse space-y-6 px-4 py-8">
			<div className="h-9 w-2/3 rounded-md bg-fd-muted" />
			<div className="h-5 w-full max-w-xl rounded-md bg-fd-muted" />
			<div className="space-y-3 pt-4">
				<div className="h-4 w-full rounded bg-fd-muted" />
				<div className="h-4 w-full rounded bg-fd-muted" />
				<div className="h-4 w-5/6 rounded bg-fd-muted" />
			</div>
		</div>
	);
}
