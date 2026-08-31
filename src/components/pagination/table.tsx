import {
  useTable,
  stockFeatures,
  flexRender,
} from '@tanstack/react-table';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, ArrowDownAZ, ArrowDownZA, FolderOpen } from 'lucide-react'
import { PageInfo, Paging } from '@/types/pagination';
import ButtonIcon from '../component/button-icon';

type Props = {
  columns: any[],
  data: any[],
  pageRequest: Paging & any,
  setPageRequest: Dispatch<SetStateAction<Paging & any>>,
  pageInfo: PageInfo,
  isLoading: boolean,
}

const Table: React.FC<Props> = ({ columns, data, setPageRequest, pageRequest, pageInfo, isLoading }) => {

  // const [sorting, setSorting] = React.useState<SortingState>([])

  const refRows = useRef<HTMLDivElement>(null);
  const [rowsBar, setRowsBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (rowsBar && refRows.current && !refRows.current.contains(e.target)) {
        setRowsBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [rowsBar]);

  const table = useTable({
    features: stockFeatures,
    columns: columns,
    data: data,
  });

  const handleChangeLimit = (limit: number) => {
    setPageRequest({ ...pageRequest, limit, page: 1 });
    setRowsBar(!rowsBar);
  };

  const handleSort = (sortField) => {
    // console.log('sortField ', sortField)
    if (pageRequest.sortField === sortField) {
      if ((pageRequest.sortOrder === 'asc')) {
        setPageRequest({
          ...pageRequest,
          sortField,
          sortOrder: "desc",
          page: 1,
        });
      } else if ((pageRequest.sortOrder === 'desc')) {
        setPageRequest({
          ...pageRequest,
          sortField: null,
          sortOrder: null,
          page: 1,
        });
      }
    } else {
      setPageRequest({
        ...pageRequest,
        sortField,
        sortOrder: "asc",
        page: 1,
      });
    }
  }

  return (
    <>
      <table className='w-full table-auto'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='border-gray-200 border-b border-t text-left'>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id} className='py-2 font-normal text-base whitespace-nowrap'
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                      maxWidth: header.getSize(),
                      minWidth: header.getSize(),
                    }}
                  >
                    {!header.isPlaceholder && (
                      <>
                        {header.column.getCanSort() ? (
                          <button
                            className='p-2 cursor-pointer select-none w-full flex justify-between items-center hover:bg-gray-100 rounded duration-300'
                            title={'Sort'}
                            onClick={() => handleSort(header.id)}
                          >
                            <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                            {header.id === pageRequest.sortField ? (
                              <>
                                {pageRequest.sortOrder === 'asc' ? (
                                  <div className='ml-4'>
                                    <ArrowDownAZ size={'1.0rem'} className={'text-primary-500'} />
                                  </div>
                                ) : (
                                  <div className='ml-4'>
                                    <ArrowDownZA size={'1.0rem'} className={'text-primary-500'} />
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className='ml-4'>
                                <ArrowDownAZ strokeWidth={'2'} size={'1.0rem'} className={''} />
                              </div>
                            )}

                          </button>
                        ) : (
                          <div className='p-2'>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <>
              {Array(...Array(pageRequest.limit)).map((data, key) => (
                <React.Fragment key={key}>
                  {table.getHeaderGroups().map((headerGroup, key) => (
                    <tr key={key} className='border-b text-left '>
                      {headerGroup.headers.map((column, key) => (
                        <td key={key} className='py-4 px-2 font-normal whitespace-nowrap animate-pulse'>
                          <div className='h-3 w-full bg-slate-200 rounded-full'></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {table.getRowModel().rows.length > 0 ? (
                <>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='border-gray-200 border-b text-left align-baseline'>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                          }}
                          className='py-2 px-2 font-normal'
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className='border-gray-200 text-xl p-12 border-b'
                  >
                    <div className='w-full text-center'>
                      <div className='flex justify-center items-center mb-4'>
                        <FolderOpen size={'4rem'} className={'text-gray-500'} />
                      </div>
                      <div>
                        {'No data found'}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
      <div className='flex justify-between items-center mt-2'>
        <div className='flex items-center p-2'>
          <div className='mr-2'>{'Page ' + pageInfo.page}</div>
        </div>
        <div className='flex items-center justify-end p-2'>
          <div className='relative mx-4' ref={refRows}>
            <div className='flex items-center'>
              <div className='mr-2'>{'Rows per page: '}</div>
              <button className='w-10 h-10 flex justify-center items-center duration-300 rounded hover:bg-gray-100' onClick={() => setRowsBar(!rowsBar)}>
                {pageRequest.limit}
              </button>
            </div>
            <div className={`absolute -top-40 -right-2 w-12 rounded overflow-hidden origin-bottom-left bg-white border border-gray-200 focus:outline-none duration-300 ease-in-out shadow ${!rowsBar && 'scale-0 shadow-none ring-0'}`}>
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(10)}>{'10'}</button>
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(25)}>{'25'}</button>
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(50)}>{'50'}</button>
              <button className='w-full flex justify-center items-center h-10 hover:bg-gray-100' onClick={() => handleChangeLimit(100)}>{'100'}</button>
            </div>
          </div>
          <div className='w-32 flex justify-center mx-4'>
            <span className='mx-1'>{'Data'}</span>
            <span>{pageInfo.totalData > 0 ? ((pageInfo.page - 1) * pageInfo.pageSize) + 1 : 0}</span>
            <span className='mx-1'>{'-'}</span>
            <span>{pageInfo.page * pageInfo.pageSize < pageInfo.totalData ? pageInfo.page * pageInfo.pageSize : pageInfo.totalData}</span>
            <span className='mx-1'>{'of'}</span>
            <span>{pageInfo.totalData}</span>
          </div>
          <div className='flex items-center ml-4'>
            <ButtonIcon
              className='mx-1'
              type="button"
              disabled={pageRequest.page <= 1}
              onClick={() => setPageRequest({ ...pageRequest, page: 1 })}
              icon={<ChevronsLeft size={'1.5rem'} className={''} />}
            />
            <ButtonIcon
              className='mx-1'
              type="button"
              disabled={pageRequest.page <= 1}
              onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page - 1 })}
              icon={<ChevronLeft size={'1.5rem'} className={''} />}
            />
            <ButtonIcon
              className='mx-1'
              type="button"
              disabled={pageRequest.page >= pageInfo.pageCount}
              onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page + 1 })}
              icon={<ChevronRight size={'1.5rem'} className={''} />}
            />
            <ButtonIcon
              className='mx-1'
              type="button"
              disabled={pageRequest.page >= pageInfo.pageCount}
              onClick={() => setPageRequest({ ...pageRequest, page: pageInfo.pageCount })}
              icon={<ChevronsRight size={'1.5rem'} className={''} />}
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default Table;