import { CreateItemlog, PageItemlog } from "@/types/itemlog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "@/components/modal/modal";
import { X } from "lucide-react";
import { NextPage } from "next/types";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from 'yup';
import TextField from "@/components/formik/text-field";
import Button from "@/components/component/button";
import { removeEmptyValues } from "@/utils/helper";
import { ItemView, PageItem } from "@/types/item";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import DropdownField from "@/components/formik/dropdown-field";
import DateField from "@/components/formik/date-field";
import TextFieldNumber from "@/components/formik/text-field-number";
import TextAreaField from "@/components/formik/text-area-field";
import { displayNumber } from "@/utils/formater";
import notif from "@/utils/notif";
import ButtonIcon from "@/components/component/button-icon";


type Props = {
  show: boolean;
  onClickOverlay: (itemId?: string, refresh?: boolean) => void;
  itemId?: string
}

const schema = Yup.object().shape({
});

const ModalCreateStockSent: NextPage<Props> = ({ show, onClickOverlay, itemId = '' }) => {

  const pageRequestItem: PageItem = {
    limit: 100,
    page: 1,
  }

  const { isLoading: isLoadingItem, data, refetch } = useQuery({
    queryKey: ['item', pageRequestItem],
    queryFn: () => Api.get('/item', pageRequestItem),
    enabled: show,
  });

  const { isPending: isPendingCreate, mutate } = useMutation({
    mutationKey: ['itemlog', 'create'],
    mutationFn: (data: CreateItemlog) => Api.post('/itemlog', data),
  })

  const items: ItemView[] = data?.payload?.list ?? []



  const handleSubmit = async (values: CreateItemlog, formikHelpers: FormikHelpers<CreateItemlog>) => {
    mutate(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          onClickOverlay('', true)
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    })
  }

  if (!show)
    return null

  const initFormikValue: CreateItemlog = {
    itemId: itemId,
    notes: '',
    type: '',
    quantity: '',
  }

  const handleClear = () => {
    onClickOverlay()
  }



  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-lg'}>
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
            onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
          >
            {({ setFieldValue, values }) => {
              return (
                <Form className="flex flex-col h-full pt-4" noValidate={true}>
                  <div className="mb-4">
                    <DropdownField
                      field={true}
                      label={'Item'}
                      name={'itemId'}
                      items={items}
                      keyValue={'id'}
                      keyLabel={'name'}
                      placeholder={'Pilih Item'}
                      isLoading={isLoadingItem}
                    />
                  </div>
                  <div className="mb-4">
                    <DropdownField
                      label={'Tipe'}
                      name={'type'}
                      items={[{ "id": "STOCK", "name": "Stok" }, { "id": "SENT", "name": "Dikirim" }]}
                      keyValue={'id'}
                      keyLabel={'name'}
                      placeholder={'Pilih Tipe'}
                    />
                  </div>
                  <div className="mb-4">
                    <TextAreaField
                      label={'Keterangan'}
                      name={'notes'}
                      placeholder={'Keterangan'}
                    />
                  </div>
                  <div className="mb-4">
                    <TextFieldNumber
                      label={'Jumlah'}
                      name={'quantity'}
                      placeholder={'1xx'}
                      description={values.itemId !== '' && values.type === 'SENT' && 'Stock saat ini: ' + displayNumber(items.find(item => item.id === values.itemId)?.stock ?? 0)}
                    />
                  </div>
                  <div className="mt-auto">
                    <Button
                      label={'Simpan'}
                      type={'submit'}
                      disabled={isPendingCreate}
                      loading={isPendingCreate}
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

export default ModalCreateStockSent;