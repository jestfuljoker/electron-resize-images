import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Container, Form, Header } from './components';

export function App() {
	const [files, setFiles] = useState<File[]>([]);

	function handleFilesChange(files: File[]) {
		setFiles(files);
	}

	useEffect(() => {
		window.ipcRenderer.on('image:done', (_, isLast, error, fileName) => {
			if (isLast) {
				setFiles([]);
				toast.success(`Arquivo(s) redimensionado(s) com sucesso!`);
			}

			if (error) {
				toast.error(`Ops, aconteceu um erro ao redimensionar o arquivo ${fileName}`);
			}
		});
	}, []);

	return (
		<>
			<div>
				<Toaster />
			</div>

			<Container>
				<Header onFilesChange={handleFilesChange} />
				{files.length > 0 && <Form files={files} />}
			</Container>
		</>
	);
}
