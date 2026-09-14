import Breadcrumb from "@/components/component/breadcrumb";
import ButtonIcon from "@/components/component/button-icon";
import MainAuth from "@/components/layout/main-auth";
import ModalCreateUser from "@/components/modal/modal-create-user";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import ModalFilterUser from "@/components/modal/modal-filter-user";
import ModalUpdateUser from "@/components/modal/modal-update-user";
import List from "@/components/pagination/list";
import Table from "@/components/pagination/table";
import { Api } from "@/lib/api";
import { LoginUser } from "@/types/auth";
import { UserView, PageUser } from "@/types/user";
import PageWithLayoutType from "@/types/layout";
import { PageInfo, Paging } from "@/types/pagination";
import { displayDateTime, displayNumber, displayPhoneNumber } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import { useIsMobile } from "@/utils/hook";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef, TableFeatures } from "@tanstack/react-table";
import { Funnel, Plus, ChevronDown, Pencil, Trash, Clock, Phone, Mail } from "lucide-react";
import Head from "next/head";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Tooltip } from "react-tooltip";


type Props = {
  loginUser: LoginUser
}

type PropsDropdownMore = {
  toggleModalUpdate: (refresh?: boolean, id?: string) => void
  toggleModalDelete: (id?: string, name?: string) => void
}


const DropdownMore: NextPage<CellContext<TableFeatures, UserView, unknown> & PropsDropdownMore> = ({ row, toggleModalUpdate, toggleModalDelete }) => {
  const refMore = useRef<HTMLDivElement>(null);
  const [moreBar, setMoreBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (moreBar && refMore.current && !refMore.current.contains(e.target)) {
        setMoreBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [moreBar]);

  const handleClickDelete = (id, name) => {
    setMoreBar(false);
    toggleModalDelete(id, name)
  }

  return (
    <div className="relative inline-block py-2 text-right" ref={refMore}>
      <button className="flex justify-center items-center text-primary-500" type="button" onClick={() => setMoreBar(!moreBar)} >
        <div>More</div>
        <ChevronDown size={'1.2rem'} strokeWidth={2.5} className={'ml-2'} />
      </button>
      <div className={`z-50 absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right border-2 border-gray-200 bg-white duration-300 ease-in-out ${!moreBar && 'scale-0'}`}>
        <div className="" role="none">
          <button onClick={() => toggleModalUpdate(false, row.original.id)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Edit'}
          </button>
          <button onClick={() => handleClickDelete(row.original.id, row.original.fullname)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

type PaginationMobileProps = {
  data: UserView[]
  setPageRequest: Dispatch<SetStateAction<Paging & any>>
  pageRequest: Paging & any
  pageInfo: PageInfo
  isLoading?: boolean
  toggleModalUpdate: (refresh?: boolean, id?: string) => void
  toggleModalDelete: (id?: string, name?: string) => void
}

type PaginationWebProps = {
  data: UserView[]
  setPageRequest: Dispatch<SetStateAction<Paging & any>>
  pageRequest: Paging & any
  pageInfo: PageInfo
  isLoading?: boolean
  toggleModalUpdate: (refresh?: boolean, id?: string) => void
  toggleModalDelete: (id?: string, name?: string) => void
}

const Index: NextPage<Props> = ({ loginUser }) => {


  const [filter, setFilter] = useState<PageUser>({})
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const isMobile = useIsMobile();

  const [pageRequest, setPageRequest] = useState<PageUser>({
    limit: 10,
    page: 1,
    preloads: "",
  });

  const request: PageUser = {
    ...pageRequest,
    ...removeEmptyValues({
      ...filter,
      startCreateDt: filter.startCreateDt ? new Date(filter.startCreateDt as string) : '',
      endCreateDt: filter.endCreateDt ? new Date(new Date(filter.endCreateDt as string).setHours(23, 59, 59, 999)) : '',
    })
  }

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['user', request],
    queryFn: ({ queryKey }) => Api.get('/user', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['user', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/user/' + id)
  });

  const pageInfo: PageInfo = {
    pageCount: data?.payload.totalPage || 0,
    pageSize: data?.payload.dataPerPage || 0,
    totalData: data?.payload.totalData || 0,
    page: data?.payload.page || 0
  }

  const users: UserView[] = data?.payload.list || [];

  const toggleModalCreate = (refresh = false) => {
    if (refresh)
      refetch();

    setShowModalCreate(!showModalCreate);

  }

  const toggleModalFilter = () => {
    setShowModalFilter(!showModalFilter);
  }

  const toggleModalUpdate = (refresh = false, id = '') => {
    if (refresh)
      refetch();

    setUpdateId(id);
    setShowModalUpdate(!showModalUpdate);
  }

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDelete();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - User'}</title>
      </Head>
      <ModalCreateUser
        show={showModalCreate}
        onClickOverlay={toggleModalCreate}
      />
      <ModalFilterUser
        show={showModalFilter}
        onClickOverlay={toggleModalFilter}
        filter={filter}
        setFilter={setFilter}
      />
      <ModalUpdateUser
        show={showModalUpdate}
        onClickOverlay={toggleModalUpdate}
        id={updateId}
      />
      <ModalDeleteVerify
        show={showModalDelete}
        onClickOverlay={toggleModalDelete}
        onDelete={handleDelete}
        verify={deleteVerify}
        isLoading={isPendingDelete}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDeleteVerify>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'User', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-4'>
              <div>
                <div className='text-xl'>{ }</div>
              </div>
              <div className='flex'>
                <div className='ml-2'>
                  <ButtonIcon
                    type="button"
                    onClick={() => toggleModalCreate()}
                    icon={<Plus className='' size={'1.2rem'} />}
                  />
                </div>
                <div className='ml-2'>
                  <ButtonIcon
                    type="button"
                    onClick={() => toggleModalFilter()}
                    icon={isEmptyObject(removeEmptyValues(filter)) ? <Funnel className='' size={'1.2rem'} /> : <Funnel className='text-primary-500' size={'1.2rem'} fill="currentColor" strokeWidth={0} />}
                  />
                </div>
              </div>
            </div>
            {isMobile ? (
              <PaginationMobile
                data={users}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
                toggleModalUpdate={toggleModalUpdate}
                toggleModalDelete={toggleModalDelete}
              />
            ) : (
              <PaginationWeb
                data={users}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
                toggleModalUpdate={toggleModalUpdate}
                toggleModalDelete={toggleModalDelete}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;

const PaginationMobile: NextPage<PaginationMobileProps> = ({
  data,
  setPageRequest,
  pageRequest,
  pageInfo,
  isLoading,
  toggleModalUpdate,
  toggleModalDelete,
}) => {
  return (
    <List
      data={data}
      setPageRequest={setPageRequest}
      pageRequest={pageRequest}
      pageInfo={pageInfo}
      isLoading={isLoading}
      renderItem={(user: UserView) => {
        return (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {/* Avatar */}
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.fullname}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-semibold text-blue-600">
                    {user.fullname?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                {/* Name */}
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-900">
                    {user.fullname}
                  </h3>

                  <p className="truncate text-sm text-gray-500">
                    @{user.username}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0">
                <ButtonIcon
                  type="button"
                  onClick={() => toggleModalUpdate(false, user.id)}
                  icon={
                    <Pencil
                      className="text-amber-500"
                      size="1.2rem"
                    />
                  }
                />

                <ButtonIcon
                  type="button"
                  onClick={() =>
                    toggleModalDelete(user.id, user.fullname)
                  }
                  icon={
                    <Trash
                      className="text-rose-500"
                      size="1.2rem"
                    />
                  }
                />
              </div>
            </div>

            {/* Status & Role */}
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  user.isActive
                    ? 'bg-green-50 text-green-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {user.isActive ? 'Aktif' : 'Nonaktif'}
              </span>

              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-600">
                {user.role}
              </span>
            </div>

            {/* Information */}
            <div className="mt-4 space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Mail className="text-gray-500" size="1rem" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="truncate text-sm font-medium text-gray-700">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {user.phoneNumber && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Phone className="text-gray-500" size="1rem" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">No. Telepon</p>
                    <p className="text-sm font-medium text-gray-700">
                      {displayPhoneNumber(user.phoneNumber)}
                    </p>
                  </div>
                </div>
              )}

              {/* Last Login */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Clock className="text-gray-500" size="1rem" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-gray-400">Login Terakhir</p>
                  <p className="text-sm font-medium text-gray-700">
                    {user.lastLoginDt
                      ? displayDateTime(user.lastLoginDt)
                      : 'Belum pernah login'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
};

const PaginationWeb: NextPage<PaginationWebProps> = ({ data, setPageRequest, pageRequest, pageInfo, isLoading, toggleModalUpdate,  toggleModalDelete }) => {

  const column: ColumnDef<TableFeatures, UserView, unknown>[] = [
    {
      id: 'fullname',
      header: () => (
        <div className="whitespace-nowrap">
          User
        </div>
      ),
      accessorKey: 'fullname',
      enableSorting: true,
      cell: ({ row, getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {getValue() as string}
          </div>
        )
      }
    },
    {
      id: 'email',
      header: () => (
        <div className="whitespace-nowrap">
          Email
        </div>
      ),
      accessorKey: 'email',
      enableSorting: true,
      cell: ({ row, getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {getValue() as string}
          </div>
        )
      },
      size: 200,
      minSize: 100,
      maxSize: 200,
    },
    {
      id: 'phone_number',
      header: () => (
        <div className="whitespace-nowrap">
          No. Handphone
        </div>
      ),
      accessorKey: 'phoneNumber',
      enableSorting: true,
      cell: ({ getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {displayPhoneNumber(getValue() as string)}
          </div>
        )
      }
    },
    {
      id: 'last_login_dt',
      header: () => (
        <div className="whitespace-nowrap">
          Terakhir Login
        </div>
      ),
      accessorKey: 'lastLoginDt',
      enableSorting: true,
      cell: ({ getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {getValue() ? displayDateTime(getValue() as string) : 'Belum pernah login'}
          </div>
        )
      }
    },
    {
      id: 'create_name',
      header: () => (
        <div className="whitespace-nowrap">
          Dibuat Oleh
        </div>
      ),
      accessorKey: 'createName',
      enableSorting: true,
      cell: ({ getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {getValue() as string}
          </div>
        )
      }
    },
    {
      id: 'create_dt',
      header: () => (
        <div className="whitespace-nowrap">
          Tanggal
        </div>
      ),
      accessorKey: 'createDt',
      enableSorting: true,
      size: 100,
      cell: ({ getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {displayDateTime(getValue() as string)}
          </div>
        )
      }
    },
    {
      id: 'action',
      size: 75,
      enableSorting: false,
      cell: (props) => {
        return (
          <div className="text-right">
            <DropdownMore {...props}
              toggleModalDelete={toggleModalDelete}
              toggleModalUpdate={toggleModalUpdate}
            />
          </div>

        )
      }
    }
  ]

  return (
    <div className=''>
      <Table
        columns={column}
        data={data}
        setPageRequest={setPageRequest}
        pageRequest={pageRequest}
        pageInfo={pageInfo}
        isLoading={isLoading}
      />
    </div>
  )
}
