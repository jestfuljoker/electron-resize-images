import { useRef } from 'react';
import toast from 'react-hot-toast';

import logo from '~/assets/logo.svg';
import { merge } from '~/utils';

interface HeaderProps {
	onFilesChange(files: File[]): void;
}

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export function Header({ onFilesChange }: HeaderProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	function handleFileInputChange(files: File[]) {
		const newFiles: File[] = [];

		for (const file of files) {
			const fileExtension = file.name.split('.').pop();

			if (!ALLOWED_EXTENSIONS.includes(fileExtension!)) {
				toast.error('Ops, parece que um dos arquivos selecionados não é uma imagem');
				return;
			}

			newFiles.push(file);
		}

		fileInputRef.current!.value = '';

		onFilesChange(newFiles);
	}

	return (
		<header className="flex flex-col items-center justify-center">
			<div
				className={merge(
					'w-64 h-[10.6rem] flex flex-col items-center justify-around px-4 py-7 bg-white rounded-lg shadow-lg cursor-pointer border-2 border-white',
				)}
				onClick={() => fileInputRef.current?.click()}
			>
				<img src={logo} width={32} alt="Application logo" />

				<input
					ref={fileInputRef}
					type="file"
					className="hidden"
					accept={ALLOWED_EXTENSIONS.map((ext) => `image/${ext}`).join(',')}
					multiple
					onChange={(event) => handleFileInputChange([...(event.target.files ?? [])])}
				/>

				<span
					className={merge(
						'mt-2 leading-normal text-sm text-center hover:text-teal-800 tracking-wide uppercase text-gray-500',
					)}
				>
					Selecionar imagens
				</span>
				<span className="text-[0.625rem] text-gray-500">
					Extensões permitidas {ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(', ')}
				</span>
			</div>
		</header>
	);
}
