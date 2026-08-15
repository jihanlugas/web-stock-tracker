import { NextPage } from 'next';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker';
import { DatePickerProps } from 'react-datepicker';
import { X } from 'lucide-react';

type Props = DatePickerProps & {
  name: string;
  label?: string;
  required?: boolean;
  handleClear?: boolean;
  className?: string;
  placeholderText?: string;
  description?: string;
};

const DateField: NextPage<Props> = ({
  label,
  name,
  required,
  handleClear,
  className,
  placeholderText = 'Select date',
  showTimeSelect = true,
  timeFormat = 'HH:mm',
  timeIntervals = 30,
  dateFormat,
  description,
  ...props
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext<any>();

  const hasError = meta.touched && meta.error;

  const inputClassName = [
    'w-full',
    'h-10',
    'px-2',
    'border-2',
    'rounded-md',
    hasError && '!border-rose-400 outline-rose-400',
    className || ''
  ].filter(Boolean).join(' ');

  return (
    <div className="]relative">
      {label && (
        <div className="mb-1">
          <span>{label}</span>
          {required && <span className="text-rose-600">*</span>}
        </div>
      )}

      <div className="relative">
        <DatePicker
          selected={field.value ? new Date(field.value) : null}
          onChange={(date) => setFieldValue(name, date)}
          showTimeSelect={showTimeSelect}
          timeFormat={timeFormat}
          timeIntervals={timeIntervals}
          dateFormat={dateFormat ? dateFormat : showTimeSelect ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
          className={inputClassName}
          wrapperClassName={'w-full'}
          placeholderText={placeholderText}
          {...props}
        />
        {handleClear && field.value && (
          <button
            type="button"
            onClick={() => setFieldValue(name, null)}
            className="absolute h-6 w-6 flex justify-center items-center top-2 right-2"
            title="Clear Value"
          >
            <X size="1.2rem" />
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
  );
};

export default DateField;
