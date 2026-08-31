import { NextPage } from 'next';
import React, { ReactNode } from 'react';
import { Loader } from 'lucide-react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	icon: ReactNode;
}

const ButtonIcon: NextPage<Props> = ({ icon, ...props }) => {


  const className = [
		'h-10',
		'w-10',
		'flex',
		'justify-center',
		'items-center',
		'duration-300',
		'rounded',
		'disabled:text-gray-400',
		'disabled:cursor-not-allowed',
		'enabled:hover:-translate-y-1',
		'enabled:hover:bg-gray-100',
		props.className || '',
  ]
    .filter(Boolean)
    .join(' ');

	return (
		<button
			{...props}
			className={className}
		>
			{icon}
		</button>
	);
};

export default ButtonIcon;