import { Api } from '@/lib/api';
import { UpdateUser } from '@/types/user';
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
  fullname: Yup.string().required(),
  email: Yup.string().email().required(),
  phoneNumber: Yup.string().required().min(8, "Phone number must be at least 8 characters").max(15, 'Phone number must be 15 characters or less'),
  address: Yup.string(),
  
});

const ModalUpdateUser: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const { data: dataUser, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => Api.get(`/user/${id}`),
    enabled: show,
  })

  const { isPending: isPendingUpdate, mutate } = useMutation({
    mutationKey: ['user', 'update', id],
    mutationFn: (data: UpdateUser) => Api.put(`/user/${id}`, data),
  })

  const handleSubmit = async (values: UpdateUser, formikHelpers: FormikHelpers<UpdateUser>) => {
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

  if (dataUser && !dataUser.payload) {
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

  const initFormikValue: UpdateUser = {
    fullname: dataUser?.payload?.fullname ?? '',
    email: dataUser?.payload?.email ?? '',
    phoneNumber: dataUser?.payload?.phoneNumber ?? '',
    username: dataUser?.payload?.username ?? '',
    address: dataUser?.payload?.address ?? '',
    birthDt: dataUser?.payload?.birthDt ?? null,
    birthPlace: dataUser?.payload?.birthPlace ?? '',
  }


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-lg'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Update User</div>
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
                      label={'Nama Lengkap'}
                      name={'fullname'}
                      type={'text'}
                      placeholder={'Nama Lengkap'}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label={'Email'}
                      name={'email'}
                      type={'email'}
                      placeholder={'Email'}
                      className={'lowercase'}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label={'Username'}
                      name={'username'}
                      type={'text'}
                      placeholder={'Username'}
                      className={'lowercase'}
                      required
                    />
                  </div>
                  {/* <div className="mb-4">
                    <TextField
                      label={'Password'}
                      name={'password'}
                      type={'text'}
                      placeholder={'Password'}
                      required
                    />
                  </div> */}
                  <div className="mb-4">
                    <TextField
                      label={'No. Telepon'}
                      name={'phoneNumber'}
                      type={'text'}
                      placeholder={'No. Telepon'}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <TextAreaField
                      label={'Alamat'}
                      name={'address'}
                      placeholder={'Alamat'}
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

export default ModalUpdateUser;