import { ReactNode } from 'react';

interface ContainerProps {
	children: ReactNode;
}

export function Container({ children }: ContainerProps) {
	return (
		<div className="max-w-xl m-auto h-screen flex flex-col justify-center items-center">
			{children}
		</div>
	);
}
