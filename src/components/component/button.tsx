import { NextPage } from 'next';
import React from 'react';
import { Loader } from 'lucide-react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	label: string;
	disabled?: boolean;
	loading?: boolean;
	type: "submit" | "reset" | "button";
}

const Button: NextPage<Props> = ({ label, disabled = false, loading = false, type, ...props }) => {


  const className = [
		'duration-300',
		'bg-primary-500',
		'border-primary-500',
		'enabled:hover:bg-primary-600',
		'enabled:hover:border-primary-600',
		'focus:border-primary-600',
		'h-10',
		'rounded-md',
		'text-gray-50',
		'font-semibold',
		'px-4',
		'w-full',
		'shadow-lg',
		'shadow-primary-600/20',
		'disabled:cursor-not-allowed',
		'disabled:bg-primary-400',
		props.className || '',
  ]
    .filter(Boolean)
    .join(' ');

	return (
		<button
			className={className}
			type={type}
			disabled={disabled}
			{...props}
		>
			<div className={'flex justify-center items-center'}>
				{loading ? <Loader  className={'animate-spin'} size={'1.5rem'} /> : label}
			</div>
		</button>
	);
};

export default Button;