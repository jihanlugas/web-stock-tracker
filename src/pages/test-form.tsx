'use client'

import Button from '@/components/component/button';
import OldDateField from '@/components/formik/old-date-field';
import DateField from '@/components/formik/date-field';
import TextAreaField from '@/components/formik/text-area-field';
import TextField from '@/components/formik/text-field';
import TextFieldNumber from '@/components/formik/text-field-number';
import { displayDateTimeForm } from '@/utils/formater';
import { Form, Formik } from 'formik';
import React, { useState } from 'react'
import * as Yup from 'yup';
import PasswordField from '@/components/formik/password-field';
import DropdownField from '@/components/formik/dropdown-field';


const schema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  password: Yup.string().required('Required field'),
  description: Yup.string().required('Required field'),
  price: Yup.number().nullable().required('Required field'),
  gender: Yup.string().required('Required field'),
  startDt: Yup.string().nullable().required('Required field'),
  endDt: Yup.string().nullable().required('Required field'),
});


const initFormikValue = {
  companyId: '',
  name: '',
  password: '',
  description: '',
  price: '',
  gender: '',
  startDt: null,
  endDt: null,
}

const handleSubmit = async (values, formikHelpers) => {

  const startDt = values.startDt
  const endDt = new Date(values.endDt).toISOString()

  console.log('startDt', startDt)
  console.log('endDt', endDt)
}

export default function SortableVertical() {

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-3">
      <div className='bg-white mb-4 p-4 rounded shadow'>
        <div className='mb-4'>
          <div className='text-xl'>Create Product</div>
        </div>
        <div className='max-w-xl'>
          <Formik
            initialValues={initFormikValue}
            validationSchema={schema}
            enableReinitialize={true}
            onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
          >
            {({ values, errors }) => {
              return (
                <Form noValidate={true}>
                  <div className="mb-4">
                    <div className="text-lg">Product</div>
                    <hr className="my-4" />
                    <div className="">
                      <TextField
                        label={'Product Name'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Product Name'}
                        required
                        description={'Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. '}
                      />
                    </div>
                    <div className="">
                      <PasswordField
                        label={'Password'}
                        name={'password'}
                        placeholder={'Password'}
                        required
                        description={'Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. '}
                      />
                    </div>
                    <div className="">
                      <TextAreaField
                        label={'Description'}
                        name={'description'}
                        placeholder={'Description'}
                        required
                        description={'Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. Hallo ini descriotion. '}
                      />
                    </div>
                    <div className=''>
                      <DateField
                        label='Start Date'
                        name='startDt'
                        required
                      />
                    </div>
                    <div className=''>
                      <OldDateField
                        label='End Date'
                        name='endDt'
                        required
                      />
                    </div>
                    <div className="">
                      <DropdownField
                        name='gender'
                        label='Gender'
                        keyValue='value'
                        keyLabel='label'
                        required
                        items={[
                          { label: 'Male', value: 'male' },
                          { label: 'Female', value: 'female' },
                        ]}
                        placeholder='Select Gender'
                      />
                    </div>
                    <div className="">
                      <TextFieldNumber
                        label={'Price'}
                        name={'price'}
                        placeholder={'1000xx'}
                        required
                      />
                    </div>
                  </div>
                  <div className="my-4">
                    <Button
                      label={'Save'}
                      type={'submit'}
                    />
                  </div>
                  {process.env.DEBUG === 'true' && (
                    <div>
                      <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                        {JSON.stringify(values, null, 4)}
                      </div>
                      <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                        {JSON.stringify(errors, null, 4)}
                      </div>
                    </div>
                  )}
                </Form>
              )
            }}
          </Formik>
        </div>
      </div>
    </div>
  )
}
