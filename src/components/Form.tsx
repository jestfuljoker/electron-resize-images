import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from './Button';
import { Input } from './Input';

type InputData = {
	width: string;
	height: string;
};

interface FormProps {
	files: File[];
}

const outputPath = window.path.join(window.os.homedir(), 'image-resizer');

export function Form({ files }: FormProps) {
	const [inputData, setInputData] = useState<InputData>({
		height: '',
		width: '',
	});

	function handleInputDataChange(name: keyof InputData, value: string) {
		setInputData((prevInputData) => ({
			...prevInputData,
			[name]: value,
		}));
	}

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!inputData.width || !inputData.height) {
			toast.error('Por favor, preencha todos os campos!');
			return;
		}

		for (const [index, file] of files.entries()) {
			window.ipcRenderer.send('image:resize', {
				filePath: file.path,
				isLast: index === files.length - 1,
				width: parseInt(inputData.width),
				height: parseInt(inputData.height),
			});
		}
	}

	const areInputsEmpty = !inputData.width || !inputData.height;

	return (
		<form id="img-form" onSubmit={onSubmit} noValidate>
			<div className="mt-2 flex justify-center">
				<span className="text-sm text-center tracking-wide text-white font-bold">
					{files.length > 1 ? `${files.length} arquivos selecionados` : '1 arquivo selecionado'}{' '}
				</span>
			</div>

			<div className="mt-2">
				<Input
					id="width"
					name="width"
					placeholder="Largura"
					value={inputData.width}
					onChange={(event) => handleInputDataChange('width', event.target.value)}
				/>
			</div>

			<div className="mt-2">
				<Input
					id="height"
					name="height"
					placeholder="Altura"
					value={inputData.height}
					onChange={(event) => handleInputDataChange('height', event.target.value)}
				/>
			</div>

			<div className="mt-6">
				<Button type="submit" disabled={areInputsEmpty}>
					Redimensionar
				</Button>
			</div>

			<div className="flex justify-center mt-4 flex-col">
				<span className="text-sm text-center tracking-wide text-white font-bold">
					Os arquivos serão salvos em:
				</span>
				<span className="text-sm text-center tracking-wide text-white">{outputPath}</span>
			</div>
		</form>
	);
}
