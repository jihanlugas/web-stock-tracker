import Breadcrumb from "@/components/component/breadcrumb";
import ButtonIcon from "@/components/component/button-icon";
import MainAuth from "@/components/layout/main-auth";
import ModalCreateItem from "@/components/modal/modal-create-item";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import ModalFilterItem from "@/components/modal/modal-filter-item";
import ModalUpdateItem from "@/components/modal/modal-update-item";
import List from "@/components/pagination/list";
import Table from "@/components/pagination/table";
import { Api } from "@/lib/api";
import { LoginUser } from "@/types/auth";
import { ItemView, PageItem } from "@/types/item";
import PageWithLayoutType from "@/types/layout";
import { PageInfo, Paging } from "@/types/pagination";
import { displayDateTime, displayNumber } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import { useIsMobile } from "@/utils/hook";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef, TableFeatures } from "@tanstack/react-table";
import { Funnel, Plus, ChevronDown, Pencil, Trash } from "lucide-react";
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


const DropdownMore: NextPage<CellContext<TableFeatures, ItemView, unknown> & PropsDropdownMore> = ({ row, toggleModalUpdate, toggleModalDelete }) => {
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
          <button onClick={() => handleClickDelete(row.original.id, row.original.name)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

type PaginationMobileProps = {
  data: ItemView[]
  setPageRequest: Dispatch<SetStateAction<Paging & any>>
  pageRequest: Paging & any
  pageInfo: PageInfo
  isLoading?: boolean
  toggleModalUpdate: (refresh?: boolean, id?: string) => void
  toggleModalDelete: (id?: string, name?: string) => void
}

type PaginationWebProps = {
  data: ItemView[]
  setPageRequest: Dispatch<SetStateAction<Paging & any>>
  pageRequest: Paging & any
  pageInfo: PageInfo
  isLoading?: boolean
  toggleModalUpdate: (refresh?: boolean, id?: string) => void
  toggleModalDelete: (id?: string, name?: string) => void
}

const Index: NextPage<Props> = ({ loginUser }) => {


  const [filter, setFilter] = useState<PageItem>({})
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
  const [showModalUpdate, setShowModalUpdate] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [updateId, setUpdateId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const isMobile = useIsMobile();

  const [pageRequest, setPageRequest] = useState<PageItem>({
    limit: 10,
    page: 1,
    preloads: "",
  });

  const request: PageItem = {
    ...pageRequest,
    ...removeEmptyValues({
      ...filter,
      startCreateDt: filter.startCreateDt ? new Date(filter.startCreateDt as string) : '',
      endCreateDt: filter.endCreateDt ? new Date(new Date(filter.endCreateDt as string).setHours(23, 59, 59, 999)) : '',
    })
  }

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['item', request],
    queryFn: ({ queryKey }) => Api.get('/item', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['item', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/item/' + id)
  });

  const pageInfo: PageInfo = {
    pageCount: data?.payload.totalPage || 0,
    pageSize: data?.payload.dataPerPage || 0,
    totalData: data?.payload.totalData || 0,
    page: data?.payload.page || 0
  }

  const items: ItemView[] = data?.payload.list || [];

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
        <title>{process.env.APP_NAME + ' - Item'}</title>
      </Head>
      <ModalCreateItem
        show={showModalCreate}
        onClickOverlay={toggleModalCreate}
      />
      <ModalFilterItem
        show={showModalFilter}
        onClickOverlay={toggleModalFilter}
        filter={filter}
        setFilter={setFilter}
      />
      <ModalUpdateItem
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
            { name: 'Item', path: '' },
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
                data={items}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
                toggleModalUpdate={toggleModalUpdate}
                toggleModalDelete={toggleModalDelete}
              />
            ) : (
              <PaginationWeb
                data={items}
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

const PaginationMobile: NextPage<PaginationMobileProps> = ({ data, setPageRequest, pageRequest, pageInfo, isLoading, toggleModalUpdate, toggleModalDelete}) => {
  return (
    <List
      data={data}
      setPageRequest={setPageRequest}
      pageRequest={pageRequest}
      pageInfo={pageInfo}
      isLoading={isLoading}
      renderItem={(item: ItemView) => {
        return (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-gray-900"> {item.name} </h3>
                {item.notes && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500"> {item.notes} </p>
                )}
              </div>
              {/* Stock */}
              <div className={`flex`} >
                <ButtonIcon
                  type="button"
                  onClick={() => toggleModalUpdate(false, item.id)}
                  icon={<Pencil className='text-amber-500' size={'1.2rem'} />}
                />
                <ButtonIcon
                  type="button"
                  onClick={() => toggleModalDelete(item.id, item.name)}
                  icon={<Trash className='text-rose-500' size={'1.2rem'} />}
                />
              </div>
            </div>
            {/* Information */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-green-50 p-3">
                <p className="text-xs text-green-500">Stok</p>
                <p className="mt-1 text-lg font-semibold text-green-600"> {item.stock} </p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3">
                <p className="text-xs text-orange-500">Dikirim</p>
                <p className="mt-1 text-lg font-semibold text-orange-600"> {item.sent} </p>
              </div>
            </div>
          </div>);
      }}
    />);
};

const PaginationWeb: NextPage<PaginationWebProps> = ({ data, setPageRequest, pageRequest, pageInfo, isLoading, toggleModalUpdate,  toggleModalDelete }) => {

  const column: ColumnDef<TableFeatures, ItemView, unknown>[] = [
    {
      id: 'name',
      header: () => (
        <div className="whitespace-nowrap">
          Item
        </div>
      ),
      accessorKey: 'name',
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
      id: 'notes',
      header: () => (
        <div className="whitespace-nowrap">
          Keterangan
        </div>
      ),
      accessorKey: 'notes',
      enableSorting: true,
      cell: ({ row, getValue }) => {
        return (
          <>
            <div
              className="w-full overflow-hidden text-ellipsis whitespace-nowrap"
              data-tooltip-id={`tootltip-notes-${row.original.id}`}
              data-tooltip-delay-show={300}
              data-tooltip-delay-hide={200}
            >
              {getValue() as string}
            </div>
            <Tooltip id={`tootltip-notes-${row.original.id}`}>
              {getValue() as string}
            </Tooltip>
          </>
        )
      },
      size: 200,
      minSize: 100,
      maxSize: 200,
    },
    {
      id: 'stock',
      header: () => (
        <div className="whitespace-nowrap">
          Total Stok
        </div>
      ),
      accessorKey: 'stock',
      enableSorting: true,
      cell: ({ getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {displayNumber(getValue() as number)}
          </div>
        )
      }
    },
    {
      id: 'sent',
      header: () => (
        <div className="whitespace-nowrap">
          Total Dikirim
        </div>
      ),
      accessorKey: 'sent',
      enableSorting: true,
      cell: ({ getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {displayNumber(getValue() as number)}
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
      // header: () => (
      //   <div className="whitespace-nowrap">
      //     Aksi
      //   </div>
      // ),
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
