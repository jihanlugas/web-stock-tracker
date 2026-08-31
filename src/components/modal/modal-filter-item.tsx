import { PageItemlog } from "@/types/itemlog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "@/components/modal/modal";
import { X } from "lucide-react";
import { NextPage } from "next/types";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import TextField from "@/components/formik/text-field";
import Button from "@/components/component/button";
import { removeEmptyValues } from "@/utils/helper";
import { ItemView, PageItem } from "@/types/item";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import DropdownField from "@/components/formik/dropdown-field";
import DateField from "@/components/formik/date-field";
import TextFieldNumber from "@/components/formik/text-field-number";
import ButtonIcon from "../component/button-icon";



type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PageItem
  setFilter: Dispatch<SetStateAction<PageItem>>
}

const schema = Yup.object().shape({
});

const ModalFilterItem: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  if (!show)
    return null

  const initFormikValue: PageItem = {
    name: '',
    notes: '',
    startStock: '',
    endStock: '',
    startSent: '',
    endSent: '',
    startCreateDt: '',
    endCreateDt: '',
    createName: '',
    ...filter
  }

  const handleSubmit = async (values: PageItem) => {
    setFilter(removeEmptyValues(values))
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({})
    onClickOverlay()
  }



  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-4xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Tambah Stok / Pengiriman</div>
          <ButtonIcon
            type="button"
            onClick={() => onClickOverlay()}
            icon={<X size={'1.2rem'} className="" strokeWidth="3" />}
          />
        </div>
        <hr className="border 2 border-gray-200" />
        <div className='max-h-[70vh] overflow-y-auto px-4 -mx-4'>
          <Formik
            initialValues={initFormikValue}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ setFieldValue, values }) => {
              return (
                <Form className="flex flex-col h-full pt-4" noValidate={true}>
                  <div className="mb-4">
                    <TextField
                      label={'Item'}
                      name={'name'}
                      type={'text'}
                      placeholder={'Item'}
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label={'Keterangan'}
                      name={'notes'}
                      type={'text'}
                      placeholder={'Keterangan'}
                    />
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <TextFieldNumber
                      label={'Stok Dari Jumlah'}
                      name={'startStock'}
                      placeholder={'1xx'}
                    />
                    <TextFieldNumber
                      label={'Hinga Jumlah'}
                      name={'endStock'}
                      placeholder={'9xx'}
                    />
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <TextFieldNumber
                      label={'Dikirim Dari Jumlah'}
                      name={'startSent'}
                      placeholder={'1xx'}
                    />
                    <TextFieldNumber
                      label={'Hinga Jumlah'}
                      name={'endSent'}
                      placeholder={'9xx'}
                    />
                  </div>
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <DateField
                      label={'Dari Tanggal'}
                      name={'startCreateDt'}
                      showTimeSelect={false}
                      handleClear={true}
                      showIcon={true}
                    />
                    <DateField
                      label={'Hingga Tanggal'}
                      name={'endCreateDt'}
                      showTimeSelect={false}
                      handleClear={true}
                      showIcon={true}
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label={'Dibuat Oleh'}
                      name={'createName'}
                      type={'text'}
                      placeholder={'Dibuat Oleh'}
                    />
                  </div>
                  <div className="mt-auto grid grid-cols-2 gap-2">
                    <Button
                      label={'Reset'}
                      type={'reset'}
                      onClick={() => handleClear()}
                      className={'duration-300 border-2 text-gray-600 border-gray-400 hover:bg-gray-100 hover:border-gray-500 focus:border-gray-500 h-10 rounded-md font-semibold px-4 w-full shadow-lg shadow-gray-500/20'}
                    />
                    <Button
                      label={'Simpan'}
                      type={'submit'}
                    />
                  </div>
                  {process.env.DEBUG === 'true' && (
                    <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div>
                  )}
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  )
}

export default ModalFilterItem;