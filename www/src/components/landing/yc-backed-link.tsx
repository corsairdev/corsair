const YC_URL = 'https://www.ycombinator.com/companies/corsair';
const ASPECT_RATIO = 358 / 133;

export function YcBackedLink({
	height = 32,
	className,
}: {
	height?: number;
	className?: string;
}) {
	const width = Math.round(height * ASPECT_RATIO);

	return (
		<a
			href={YC_URL}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Corsair on Y Combinator"
			className={className}
		>
			<img
				src="/backed-by-yc.svg"
				alt="Backed by Y Combinator"
				width={width}
				height={height}
				className="block h-auto max-w-full"
			/>
		</a>
	);
}
