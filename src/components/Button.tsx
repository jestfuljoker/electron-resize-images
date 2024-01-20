import { ButtonHTMLAttributes, ReactNode } from 'react';

import { merge } from '~/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
}

export function Button({ children, disabled, ...props }: ButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			className={merge(
				'w-80 m-auto flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm rounded-md text-white font-bold bg-teal-500 hover:bg-teal-600 transition-colors focus:outline-none focus:ring focus:ring-offset-2 focus:ring-teal-600',
				disabled && 'opacity-50 cursor-not-allowed bg-gray-600 hover:bg-gray-600',
			)}
			{...props}
		>
			{children}
		</button>
	);
}
