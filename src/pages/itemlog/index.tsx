import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { LoginUser } from "@/types/auth";
import PageWithLayoutType from "@/types/layout";
import { NextPage } from "next";
import Head from "next/head";
import Table from "@/components/pagination/table"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PageInfo, Paging } from "@/types/pagination";
import { ItemlogView, PageItemlog } from "@/types/itemlog";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { ColumnDef, TableFeatures } from "@tanstack/react-table";
import { displayDateTime, displayNumber } from "@/utils/formater";
import { Tooltip } from 'react-tooltip';
import { removeEmptyValues } from "@/utils/helper";
import { isEmptyObject } from "@/utils/validate";
import { Funnel, ArrowBigDown, ArrowBigUp, ChevronRight, ChevronLeft } from 'lucide-react';
import ModalFilter from "@/components/modal/modal-filter-itemlog";
import { PageItem } from "@/types/item";
import { useIsMobile } from "@/utils/hook";
import List from "@/components/pagination/list";
import ButtonIcon from "@/components/component/button-icon";


type Props = {
  loginUser: LoginUser
}

type PaginationMobileProps = {
  data: ItemlogView[]
  setPageRequest: Dispatch<SetStateAction<Paging & any>>
  pageRequest: Paging & any
  pageInfo: PageInfo
  isLoading?: boolean
}

type PaginationWebProps = {
  data: ItemlogView[]
  setPageRequest: Dispatch<SetStateAction<Paging & any>>
  pageRequest: Paging & any
  pageInfo: PageInfo
  isLoading?: boolean
}

const Index: NextPage<Props> = ({ loginUser }) => {


  const [filter, setFilter] = useState<PageItemlog>({})
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);

  const isMobile = useIsMobile();

  const [pageRequest, setPageRequest] = useState<PageItemlog>({
    limit: 10,
    page: 1,
    preloads: "",
  });

  const request: PageItemlog = {
    ...pageRequest,
    ...removeEmptyValues({
      ...filter,
      startCreateDt: filter.startCreateDt ? new Date(filter.startCreateDt as string) : '',
      endCreateDt: filter.endCreateDt ? new Date(new Date(filter.endCreateDt as string).setHours(23, 59, 59, 999)) : '',
    })
  }

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['itemlog', request],
    queryFn: ({ queryKey }) => Api.get('/itemlog', queryKey[1] as object),
  });

  const pageInfo: PageInfo = {
    pageCount: data?.payload.totalPage || 0,
    pageSize: data?.payload.dataPerPage || 0,
    totalData: data?.payload.totalData || 0,
    page: data?.payload.page || 0
  }

  const itemlogs: ItemlogView[] = data?.payload.list || [];

  const toggleModalFilter = () => {
    setShowModalFilter(!showModalFilter);
  }



  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Item Log'}</title>
      </Head>
      <ModalFilter
        show={showModalFilter}
        onClickOverlay={toggleModalFilter}
        filter={filter}
        setFilter={setFilter}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Item Log', path: '' },
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
                    onClick={() => toggleModalFilter()}
                    icon={isEmptyObject(removeEmptyValues(filter)) ? <Funnel className='' size={'1.2rem'} /> : <Funnel className='text-primary-500' size={'1.2rem'} fill="currentColor" strokeWidth={0} />}
                  />
                </div>
              </div>
            </div>
            {isMobile ? (
              <PaginationMobile
                data={itemlogs}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            ) : (
              <PaginationWeb
                data={itemlogs}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;





const PaginationMobile: NextPage<PaginationMobileProps> = ({ data, setPageRequest, pageRequest, pageInfo, isLoading }) => {
  return (
    <List
      data={data}
      setPageRequest={setPageRequest}
      pageRequest={pageRequest}
      pageInfo={pageInfo}
      isLoading={isLoading}
      renderItem={(item: ItemlogView) => {
        const isStock = item.type === 'STOCK';

        const typeLabel = isStock ? 'Stock' : 'Sent';

        return (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-gray-900">
                  {item.itemName || '-'}
                </h3>

                {item.companyName && (
                  <p className="mt-1 truncate text-xs text-gray-500">
                    {item.companyName}
                  </p>
                )}
              </div>

              {/* Type */}
              <span
                className={`
              shrink-0 rounded-full px-2.5 py-1
              text-xs font-medium
              ${isStock
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                  }
            `}
              >
                {typeLabel}
              </span>
            </div>

            {/* Quantity */}
            <div
              className={`
            mt-4 flex items-center justify-between
            rounded-lg px-3 py-2.5
            ${isStock
                  ? 'bg-green-50'
                  : 'bg-orange-50'
                }
          `}
            >
              <span className="text-xs text-gray-500">
                Quantity
              </span>

              <span
                className={`
              text-lg font-bold
              ${isStock
                    ? 'text-green-600'
                    : 'text-orange-600'
                  }
            `}
              >
                {isStock ? '+' : '-'}
                {item.quantity}
              </span>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between gap-3">
              {/* Created By */}
              <div className="min-w-0">
                <p className="text-xs text-gray-400">
                  Dibuat oleh
                </p>

                <p className="truncate text-xs font-medium text-gray-600">
                  {item.createName || item.createBy || '-'}
                </p>
              </div>

              {/* Date */}
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  Tanggal
                </p>

                <p className="text-xs font-medium text-gray-600">
                  {item.createDt
                    ? new Date(item.createDt).toLocaleDateString(
                      'id-ID',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      },
                    )
                    : '-'}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <p className="text-xs font-medium text-gray-600">Keterangan</p>
              <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                {item.notes || '-'}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
};

const PaginationWeb: NextPage<PaginationWebProps> = ({ data, setPageRequest, pageRequest, pageInfo, isLoading }) => {
  const column: ColumnDef<TableFeatures, ItemlogView, unknown>[] = [
    {
      id: 'type',
      header: () => (
        <div className="whitespace-nowrap">
          Tipe
        </div>
      ),
      accessorKey: 'type',
      enableSorting: false,
      size: 50,
      cell: ({ row, getValue }) => {
        return (
          <div className="whitespace-nowrap">
            {getValue() === "STOCK" && (
              <>
                <ArrowBigDown
                  size={"1.5rem"}
                  className="text-green-500"
                  fill={'currentColor'}
                  strokeWidth={0}
                  data-tooltip-id={`tootltip-type-${row.original.id}`}
                  data-tooltip-delay-show={300}
                  data-tooltip-delay-hide={200}
                />
                <Tooltip id={`tootltip-type-${row.original.id}`}>
                  Stok
                </Tooltip>
              </>
            )}
            {getValue() === "SENT" && (
              <>
                <ArrowBigUp
                  size={"1.5rem"}
                  className="text-orange-500"
                  fill={'currentColor'}
                  strokeWidth={0}
                  data-tooltip-id={`tootltip-type-${row.original.id}`}
                  data-tooltip-delay-show={300}
                  data-tooltip-delay-hide={200}
                />
                <Tooltip id={`tootltip-type-${row.original.id}`}>
                  Dikirim
                </Tooltip>
              </>
            )}
          </div>
        )
      }
    },
    {
      id: 'item_name',
      header: () => (
        <div className="whitespace-nowrap">
          Item
        </div>
      ),
      accessorKey: 'itemName',
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
      id: 'quantity',
      header: () => (
        <div className="whitespace-nowrap">
          Jumlah
        </div>
      ),
      accessorKey: 'quantity',
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
  ];

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