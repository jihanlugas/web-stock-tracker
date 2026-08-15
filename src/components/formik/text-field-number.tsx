import { Input } from '@base-ui/react';
import { ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import { HTMLProps } from 'react';

interface Props extends HTMLProps<HTMLInputElement> {
	name: string;
	field?: boolean;
	description?: string
}

const TextFieldNumber: NextPage<Props> = ({ name, description, ...props }) => {
	const [field, meta, helpers] = useField(name);

	const hasError = meta.touched && meta.error;

	const className = [
		'w-full',
		'h-10',
		'px-2',
		'select-all',
		'text-right',
		'border-2',
		'rounded-md',
		hasError && '!border-rose-400 outline-rose-400',
		props.className || '',
	]
		.filter(Boolean)
		.join(' ');

	const formatNumber = (value: unknown) => {
		if (value === '' || value === null || value === undefined) {
			return '';
		}

		return new Intl.NumberFormat('id-ID').format(Number(value));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = e.target.value;

		// Hanya ambil angka
		const rawValue = inputValue.replace(/[^\d]/g, '');

		if (rawValue === '') {
			helpers.setValue('');
			return;
		}

		helpers.setValue(Number(rawValue));

		props.onChange?.(e);
	};

	return (
		<div className="flex flex-col w-full relative">
			{props.label && (
				<div className="mb-1">
					<span>{props.label}</span>

					{props.required && (
						<span className="text-rose-600">*</span>
					)}
				</div>
			)}

			<Input
				{...field}
				{...props}
				type="text"
				value={formatNumber(field.value)}
				onChange={handleChange}
				className={className}
			/>

			<ErrorMessage name={name}>
				{(msg) => (
					<div className="mt-1 text-sm normal-case text-rose-600">
						{msg}
					</div>
				)}
			</ErrorMessage>

			{description && (
				<div className="text-xs text-gray-600 mt-1">{description}</div>
			)}
		</div>
	);
};

export default TextFieldNumber;