import Modal from '@/components/modal/modal';
import { NextPage } from 'next';
import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import Button from '@/components/component/button';
import ButtonIcon from '@/components/component/button-icon';

type Props = {
  show: boolean;
  onClickOverlay: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  verify: string;
  children: React.ReactNode;
}

const ModalDelete: NextPage<Props> = ({ show, onClickOverlay, onDelete, isLoading = false, verify, children }) => {

  const [verifyValue, setVerifyValue] = useState('');

  if (!show)
    return null

  return (
    <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
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
        <div className={'mb-4'}>
          {children}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onDelete(); }} >
          <div className={'mb-4'}>
            <div className='mb-2'>Ketik <span className={'font-bold'}>{verify}</span> untuk melanjutakan</div>
            <input
              type="text"
              className='w-full h-10 px-2 select-all border-2 rounded-md'
              value={verifyValue}
              onChange={e => setVerifyValue(e.target.value)}
              placeholder={"Ketik '" + verify + "'"}
            />
          </div>
          <div className={'flex'}>
            <Button
              label={'Delete'}
              disabled={isLoading || verifyValue !== verify}
              loading={isLoading}
              type={"submit"}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ModalDelete;