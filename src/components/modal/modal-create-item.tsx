import { Api } from '@/lib/api';
import { CreateItem } from '@/types/item';
import notif from '@/utils/notif';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, FormikHelpers } from 'formik';
import { NextPage } from 'next/types';
import * as Yup from 'yup';
import Modal from '@/components/modal/modal';
import { X } from 'lucide-react';
import TextField from '@/components/formik/text-field';
import TextAreaField from '@/components/formik/text-area-field';
import Button from '@/components/component/button';
import ButtonIcon from '@/components/component/button-icon';

type Props = {
  show: boolean;
  onClickOverlay: (refresh?: boolean) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required(),
  notes: Yup.string(),
});

const ModalCreateItem: NextPage<Props> = ({ show, onClickOverlay }) => {

  const { isPending: isPendingCreate, mutate } = useMutation({
    mutationKey: ['item', 'create'],
    mutationFn: (data: CreateItem) => Api.post('/item', data),
  })

  const handleSubmit = async (values: CreateItem, formikHelpers: FormikHelpers<CreateItem>) => {
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

  if (!show)
    return null

  const initFormikValue: CreateItem = {
    name: '',
    notes: '',
  }


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-lg'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Tambah Item</div>
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
  );
}

export default ModalCreateItem;