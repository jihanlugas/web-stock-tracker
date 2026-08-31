import React, { useContext, useEffect, useState } from 'react';
import { Calculator, User, Layers, List, Edit, Users, ThumbsUp, Inbox, Eye } from 'lucide-react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Props {
  sidebar: boolean,
  onClickOverlay: (boolean?) => void,
}

const icons = {
  Calculator,
  User,
  Edit,
  Layers,
  ThumbsUp,
  Inbox,
  Users,
  Eye,
};

const defaultMenu = [
  {
    name: 'Dashboard',
    icon: 'Calculator',
    path: '/dashboard',
  },
  {
    name: 'Item',
    icon: 'Package',
    path: '/item',
  },
  {
    name: 'Log',
    icon: 'Calendar',
    path: '/log',
  },
];

const SidebarAdmin: React.FC<Props> = ({ sidebar, onClickOverlay }) => {

  const router = useRouter();

  const [menu, setMenu] = useState(defaultMenu)

  useEffect(() => {
    onClickOverlay(false);
  }, [router.pathname]);

  const Menu = ({ name, icon, path }) => {
    const isSelected = router.pathname.indexOf(path) !== -1;

    const Icon = (props: any) => {
      const { icon } = props;
      const TheIcon = icons[icon];

      return <TheIcon {...props} />;
    };

    return (
      <Link href={path}>
        <div className={isSelected ? 'flex items-center px-4 h-12 bg-primary-200 duration-300 ease-in-out ' : 'flex items-center px-4 h-12 hover:bg-primary-100 duration-300 ease-in-out '}>
          <Icon icon={icon} className={`mr-2 ${isSelected ? 'text-gray-700' : 'text-gray-600'}`} size={'1.2rem'} />
          <div className={` ${isSelected ? 'text-gray-700' : 'text-gray-600'}`}>{name}</div>
        </div>
      </Link>
    );
  };


  return (
    <>
      <nav>
        <div className='block z-20 fixed'>
          <div className={`fixed ${sidebar && 'inset-0'}`} onClick={() => onClickOverlay()} aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className={`fixed bg-gray-50 h-dvh flex w-80 duration-300 ${sidebar ? 'left-0' : '-left-80'}`}>
            <div className='w-full'>
              <div className='flex items-center h-16 shadow px-2'>
                <button className='p-2 rounded-full duration-300 hover:bg-primary-100' onClick={() => onClickOverlay()}>
                  <List className='' size={'1.2rem'} />
                </button>
                <div className='p-2 text-xl'>{process.env.APP_NAME}</div>
              </div>
              <div className='mainContent py-2'>
                {menu.map((data, key) => {
                  return (
                    <Menu key={key} name={data.name} icon={data.icon} path={data.path} />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SidebarAdmin;
