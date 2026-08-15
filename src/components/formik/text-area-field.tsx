import { Field, ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	name: string;
	label?: string;
	description?: string;
}


const TextAreaField: NextPage<Props> = ({
	name,
	label,
	description,
	...props
}) => {
	const [, meta] = useField(name);
	const hasError = meta.touched && meta.error;

	const className = [
		'w-full',
		'h-24',
		'px-2',
		'py-1',
		'select-all',
		'border-2',
		'rounded-md',
		hasError && '!border-rose-400 outline-rose-400',
		props.className || ''
	].filter(Boolean).join(' ');

	return (
		<div className={'flex flex-col w-full relative'}>
			{label && (
				<div className={'mb-1'}>
					<span>{label}</span>
					{props.required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<Field
				as={'textarea'}
				name={name}
				{...props}
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

export default TextAreaField;