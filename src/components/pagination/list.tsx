import { PageInfo, Paging } from '@/types/pagination';
import { ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';
import { NextPage } from 'next';
import { Dispatch, SetStateAction } from 'react';
import ButtonIcon from '../component/button-icon';

type ListProps = {
  data: any[];
  setPageRequest: Dispatch<SetStateAction<Paging & any>>;
  pageRequest: Paging & any;
  pageInfo: PageInfo;
  isLoading?: boolean;
  renderItem: (item: any, index: number) => React.ReactNode;
};

const List: NextPage<ListProps> = ({
  data,
  setPageRequest,
  pageRequest,
  pageInfo,
  isLoading,
  renderItem,
}) => {
  const page = pageRequest.page ?? 1;
  const limit = pageRequest.limit ?? 10;

  const total = pageInfo.totalData ?? 0;
  const totalPage = pageInfo.pageCount ?? 0;

  const handlePageChange = (newPage: number) => {
    if (
      newPage < 1 ||
      newPage > totalPage ||
      newPage === page
    ) {
      return;
    }

    setPageRequest((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const getPages = (): (number | '...')[] => {
    if (totalPage <= 5) {
      return Array.from(
        { length: totalPage },
        (_, index) => index + 1,
      );
    }

    // Halaman 1, 2, 3
    if (page <= 3) {
      return [1, 2, 3, '...', totalPage];
    }

    // Halaman terakhir
    if (page >= totalPage - 2) {
      return [
        1,
        '...',
        totalPage - 2,
        totalPage - 1,
        totalPage,
      ];
    }

    // Halaman tengah
    return [
      1,
      '...',
      page - 1,
      page,
      page + 1,
      '...',
      totalPage,
    ];
  };

  const pages = getPages();

  const start =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const end = Math.min(
    page * limit,
    total,
  );

  if (isLoading) {
    return (
      <div className="mt-4 animate-pulse">
        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>
    );
  }

  if (data.length === 0 || total === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center rounded-lg border-gray-200 bg-white px-4 py-10 text-center">
        <div className='w-full text-center'>
          <div className='flex justify-center items-center mb-4'>
            <FolderOpen size={'4rem'} className={'text-gray-500'} />
          </div>
          <div>
            {'No data found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Items */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="text-center text-sm text-gray-500">
        Menampilkan {start} - {end} dari {total} data
      </div>

      {/* Pagination */}
      {totalPage > 1 && (
        <div className="flex items-center justify-center gap-1">
          {/* Previous */}
          <ButtonIcon
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            icon={<ChevronLeft size={'1.5rem'} />}
          />

          {/* Pages */}
          {pages.map((item, index) => {
            if (item === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="
                    flex h-9 w-7
                    items-center justify-center
                    text-sm text-gray-400
                  "
                >
                  ...
                </span>
              );
            }

            const active = item === page;

            return (
              <>
                {/* <button
                  key={item}
                  type="button"
                  onClick={() => handlePageChange(item)}
                  className={`
                  flex h-9 min-w-9 shrink-0
                  items-center justify-center
                  rounded-lg border
                  px-2 text-sm
                  transition
                  ${active
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                    }
                `}
                >
                  {item}
                </button> */}
                <ButtonIcon
                  key={item}
                  type="button"
                  icon={<div className=''>{item}</div>}
                  onClick={() => handlePageChange(item)}
                  className={active && 'disabled:text-primary-600 disabled:cursor-default!'}
                  disabled={active}
                />
              </>
            );
          })}

          {/* Next */}
          <ButtonIcon
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPage}
            icon={<ChevronRight size={'1.5rem'} />}
          />
        </div>
      )}
    </div>
  );
};

export default List;