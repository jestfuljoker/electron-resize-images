import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ ...props }: InputProps) {
	return (
		<input
			type="number"
			className="text-gray-500 mt-1 w-80 m-auto p-3 shadow-sm border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-teal-500"
			{...props}
		/>
	);
}
