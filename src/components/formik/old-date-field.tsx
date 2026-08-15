import { NextPage } from 'next';
import { FastField, ErrorMessage, useField } from 'formik';
import React from 'react';
import { X } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  name: string
  handleClear?: (setFieldValue) => void
  description?: string
}

const DateField: NextPage<Props> = ({
  label,
  name,
  handleClear,
  description,
  ...props }) => {

  const [, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  // const className = `w-full h-10 px-2 ${hasError ? 'border-rose-400' : ''} ${props.className}`;

  const className = [
    'w-full',
    'h-10',
    'px-2',
    'border-2',
    'rounded-md',
    hasError && '!border-rose-400 outline-rose-400',
    props.className || '',
  ]
    .filter(Boolean)
    .join(' ');


  return (
    <>
      <div className='relative'>
        {label && (
          <div className={'mb-1'}>
            <span>{label}</span>
            {props.required && <span className={'text-rose-600'}>{'*'}</span>}
          </div>
        )}
        <div className='relative'>
          <FastField
            className={className}
            type={'datetime-local'}
            name={name}
            {...props}
          />
          {handleClear && (
            <button
              type="button"
              onClick={handleClear}
              className={'absolute h-6 w-6 flex justify-center items-center top-2 right-8 '}
              title={'Clear Value'}
            >
              <X size={'1.2rem'} className="" />
            </button>
          )}
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
    </>
  )
}

export default DateField;