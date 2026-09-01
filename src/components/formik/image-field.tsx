import { ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import Image from '@/components/component/image';
import React, { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';

interface Props {
  label?: string;
  name: string;
  required?: boolean;
  photoUrl?: string;
}

const ImageField: NextPage<Props & React.HTMLProps<HTMLInputElement>> = ({
  label,
  name,
  required,
  photoUrl = '',
  ...props
}) => {
  const [, meta, helpers] = useField(name);

  // Hanya menyimpan preview dari file baru yang dipilih
  const [previewImage, setPreviewImage] = useState<string>('');

  const inputField = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  /**
   * Gambar yang ditampilkan:
   *
   * 1. previewImage -> file baru yang dipilih user
   * 2. photoUrl     -> gambar dari server
   */
  const imageSrc = previewImage || photoUrl;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      return;
    }

    // Hapus object URL sebelumnya
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    // Buat URL untuk preview file
    const objectUrl = URL.createObjectURL(file);

    objectUrlRef.current = objectUrl;

    // Simpan preview
    setPreviewImage(objectUrl);

    // Simpan File ke Formik
    helpers.setTouched(true);
    helpers.setValue(file, true);
  };

  const handleClickImage = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    inputField.current?.click();
  };

  /**
   * Clear image
   */
  const handleClear = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setPreviewImage('');

    helpers.setValue(null);
    helpers.setTouched(true);

    // Reset input supaya file yang sama bisa dipilih kembali
    if (inputField.current) {
      inputField.current.value = '';
    }
  };

  /**
   * Cleanup ketika component unmount
   */
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex w-full flex-col pb-6">
      {/* Label */}
      {label && (
        <div className="mb-2">
          <span>{label}</span>

          {required && (
            <span className="text-red-600">*</span>
          )}
        </div>
      )}

      {/* File input */}
      <input
        {...props}
        ref={inputField}
        type="file"
        name={name}
        className="hidden"
        onChange={handleChange}
      />

      {/* Image */}
      <button
        type="button"
        className="w-36"
        onClick={handleClickImage}
      >
        {imageSrc ? (
          <div className="relative w-36 overflow-hidden rounded border-2 border-gray-200 bg-gray-50">
            <Image
              src={imageSrc}
              alt="Preview Image"
            />
          </div>
        ) : (
          <div className="relative flex h-36 w-36 items-center justify-center rounded border-2 border-gray-200 bg-gray-50">
            <Plus size="2.5rem" />
          </div>
        )}
      </button>

      {/* Clear button */}
      {imageSrc && (
        <button
          type="button"
          onClick={handleClear}
          className="mt-2 w-36 rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
        >
          Remove
        </button>
      )}

      {/* Error */}
      <ErrorMessage name={name}>
        {(msg) => (
          <div className="absolute bottom-0 text-sm normal-case text-red-600">
            {msg}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};

export default ImageField;
