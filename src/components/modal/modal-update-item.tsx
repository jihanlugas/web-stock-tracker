import { Api } from '@/lib/api';
import { UpdateItem } from '@/types/item';
import notif from '@/utils/notif';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { NextPage } from 'next/types';
import * as Yup from 'yup';
import Modal from '@/components/modal/modal';
import { FolderOpen, Loader, X } from 'lucide-react';
import TextField from '@/components/formik/text-field';
import TextAreaField from '@/components/formik/text-area-field';
import Button from '@/components/component/button';
import ButtonIcon from '@/components/component/button-icon';

type Props = {
  show: boolean;
  onClickOverlay: (refresh?: boolean, id?: string) => void;
  id: string
}

const schema = Yup.object().shape({
  name: Yup.string().required(),
  notes: Yup.string(),
});

const ModalUpdateItem: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const { data: dataItem, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => Api.get(`/item/${id}`),
    enabled: show,
  })

  const { isPending: isPendingUpdate, mutate } = useMutation({
    mutationKey: ['item', 'update', id],
    mutationFn: (data: UpdateItem) => Api.put(`/item/${id}`, data),
  })

  const handleSubmit = async (values: UpdateItem, formikHelpers: FormikHelpers<UpdateItem>) => {
    mutate(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          onClickOverlay(true)
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

  console.log('dataItem', dataItem)

  if (!show)
    return null

  if (isLoading) {
    return (
      <Modal
        show={show}
        onClickOverlay={() => onClickOverlay()}
        layout="sm:max-w-lg"
      >
        <div className='w-full text-center p-20'>
          <div className='flex justify-center items-center mb-4'>
            <Loader  className={'animate-spin'} size={'8rem'} />
          </div>
        </div>
      </Modal>
    )
  }

  if (dataItem && !dataItem.payload) {
    return (
      <Modal
        show={show}
        onClickOverlay={() => onClickOverlay()}
        layout="sm:max-w-lg"
      >
        <div className='w-full text-center p-20'>
          <div className='flex justify-center items-center mb-4'>
            <FolderOpen size={'4rem'} className={'text-gray-500'} />
          </div>
          <div>
            {'No data found'}
          </div>
        </div>
      </Modal>
    )
  }

  const initFormikValue: UpdateItem = {
    name: dataItem?.payload?.name ?? '',
    notes: dataItem?.payload?.notes ?? '',
  }


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-lg'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Update Item</div>
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
                    <TextField
                      label={'Name'}
                      name={'name'}
                      type={'text'}
                      placeholder={'Name'}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <TextAreaField
                      label={'Keterangan'}
                      name={'notes'}
                      placeholder={'Keterangan'}
                    />
                  </div>
                  <div className="mt-auto">
                    <Button
                      label={'Simpan'}
                      type={'submit'}
                      disabled={isPendingUpdate}
                      loading={isPendingUpdate}
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
  );
}

export default ModalUpdateItem;