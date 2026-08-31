import { NextPage } from 'next';

interface Props {
  children: React.ReactNode;
  show: boolean;
  onClickOverlay: () => void;
  layout: 'sm:max-w-md' | 'sm:max-w-lg' | 'sm:max-w-xl' | 'sm:max-w-2xl' | 'sm:max-w-3xl' | 'sm:max-w-4xl' | 'sm:max-w-5xl' | 'sm:max-w-6xl' | 'sm:max-w-7xl'
}


const Modal: NextPage<Props> = ({ children, show, onClickOverlay, layout = '' }) => {

  const handleClickBackdrop = () => {
    console.log('handleClickBackdrop', )
    onClickOverlay()
  }

  if (!show)
    return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-dvh items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="absolute inset-0 z-0 bg-gray-500/75 transition-opacity"
          onClick={handleClickBackdrop}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div className={`relative z-10 inline-block w-full overflow-hidden rounded-lg bg-white text-left shadow-xl transform transition-all sm:my-8 sm:align-middle ${layout}`} role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div className="bg-white">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Modal;