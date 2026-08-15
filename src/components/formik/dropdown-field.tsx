import { Field, FastField, ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { Loader2, ChevronDown } from 'lucide-react';

// interface item {
// 	label: string;
// 	value: string | number;
// }

interface Props extends React.HTMLProps<HTMLSelectElement> {
	label?: string;
	items: Array<unknown>;
	name: string;
	required?: boolean;
	placeholder?: string;
	placeholderValue?: string | number;
	keyValue?: string;
	keyLabel?: string;
	isLoading?: boolean;
	field?: boolean;
	description?: string
}


const DropdownField: NextPage<Props> = ({ label, name, items, required, placeholder = '', placeholderValue = '', keyValue = 'value', keyLabel = 'label', isLoading = false, field = false, description, ...props }) => {
	const FieldComponent = field ? Field : FastField;


	const [, meta] = useField(name);
	const hasError = meta.touched && meta.error;

	const className = [
		'w-full',
		'h-10',
		'px-2',
		'pr-10',
		'select-all',
		'border-2',
		'rounded-md',
		'appearance-none',
		hasError && '!border-rose-400 outline-rose-400',
		props.className || ''
	].filter(Boolean).join(' ');

	return (
		<div className={'flex flex-col w-full relative'}>
			{label && (
				<div className={'mb-1'}>
					<span>{label}</span>
					{required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<div className="relative">
				<FieldComponent
					name={name}
					as="select"
					{...props}
					className={className}
				>
					{placeholder !== '' && (
						<option value={placeholderValue}>{placeholder}</option>
					)}

					{items.map((v, key) => {
						return (
							<option key={key} value={v[keyValue]}>
								{v[keyLabel]}
							</option>
						)
					})}
				</FieldComponent>

				{isLoading && (
					<Loader2
						className="animate-spin absolute top-1/2 right-8 -translate-y-1/2 text-gray-800 pointer-events-none"
						size={18}
						strokeWidth={3}
					/>
				)}
				<ChevronDown
					className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-800 pointer-events-none"
					size={18}
					strokeWidth={3}
				/>
			</div>

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

export default DropdownField;