export function SkeletonLine({ className = '' }: { className?: string }) {
	return (
		<span
			className={`block h-2 rounded-full bg-[#1c1c1c0a] ${className}`}
			aria-hidden
		/>
	);
}
