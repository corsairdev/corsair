import Image from 'next/image';

export function CorsairLogo() {
	return (
		<span className="flex items-center gap-2.5">
			<Image
				src="/images/logo-light.svg"
				alt="Corsair"
				width={120}
				height={28}
				className="h-7 w-auto dark:hidden"
				style={{ width: 'auto', height: '1.75rem' }}
				priority
			/>
			<Image
				src="/images/logo-dark.svg"
				alt="Corsair"
				width={120}
				height={28}
				className="hidden h-7 w-auto dark:block"
				style={{ width: 'auto', height: '1.75rem' }}
				priority
			/>
		</span>
	);
}
