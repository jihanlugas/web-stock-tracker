import { ErrorMessage, FastField, Field, useField } from 'formik';
import { Input } from '@base-ui/react/input';
import { NextPage } from 'next';
import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type: string;
  field?: boolean;
  label?: string;
  description?: string;
}

const TextField: NextPage<Props> = ({
  name,
  type,
  field = false,
  label,
  description,
  ...props
}) => {
  const FieldComponent = field ? Field : FastField;

  const [, meta] = useField(name);

  const hasError = Boolean(meta.touched && meta.error);

  const className = [
    'w-full',
    'h-10',
    'px-2',
    'select-all',
    'border-2',
    'rounded-md',
    hasError && '!border-rose-400 outline-rose-400',
    props.className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative flex w-full flex-col">
      {label && (
        <div className="mb-1">
          <span>{label}</span>
          {props.required && (
            <span className="text-rose-600">*</span>
          )}
        </div>
      )}

      <FieldComponent name={name}>
        {({ field: formikField }: any) => (
          <Input
            {...formikField}
            {...props}
            type={type}
            name={name}
            className={className}
          />
        )}
      </FieldComponent>

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

export default TextField;