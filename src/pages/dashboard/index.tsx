import Breadcrumb from "@/components/component/breadcrumb";
import Button from "@/components/component/button";
import MainAuth from "@/components/layout/main-auth";
import ModalCreateStockSent from "@/components/modal/modal-create-stock-sent";
import { Api } from "@/lib/api";
import { LoginUser } from "@/types/auth";
import Dashboard from "@/types/dashboard";
import PageWithLayoutType from "@/types/layout";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = () => {

  const [showModalCreateStockSent, setShowModalCreateStockSent] = useState<boolean>(false);
  const [itemId, setItemId] = useState<string>('');


  const { isLoading, data, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: ({ queryKey }) => Api.get('/dashboard'),
  });

  const dashboard: Dashboard = data?.payload


  const toggleModalCreateStockSent = (itemId = '', refresh = false) => {
    setItemId(itemId);
    setShowModalCreateStockSent(!showModalCreateStockSent);
    if (refresh)
      refetch();
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Dashboard'}</title>
      </Head>
      <ModalCreateStockSent
        show={showModalCreateStockSent}
        onClickOverlay={toggleModalCreateStockSent}
        itemId={itemId}
      />

      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Dashboard', path: '' },
          ]}
        />
        {isLoading ? (
          <div className={'flex justify-center items-center mt-36'}>
            <Loader className={'animate-spin'} size={'8rem'} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboard?.items?.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Decorative background */}
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition-transform duration-300 group-hover:scale-150" />

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <span className="text-xl">📦</span>
                    </div>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                      Active
                    </span>
                  </div>

                  {/* Name */}
                  <div className="mt-4 text-lg font-semibold text-gray-800">
                    {item.name}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-green-50 p-3">
                      <div className="text-xs font-medium text-green-500">
                        Stok
                      </div>
                      <div className="mt-1 text-2xl font-bold text-green-600">
                        {item.stock}
                      </div>
                    </div>

                    <div className="rounded-lg bg-orange-50 p-3">
                      <div className="text-xs font-medium text-orange-500">
                        Dikirim
                      </div>
                      <div className="mt-1 text-2xl font-bold text-orange-600">
                        {item.sent}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button
                      label="Tambah Stok / Pengiriman"
                      type="button"
                      onClick={() => toggleModalCreateStockSent(item.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}


(Index as PageWithLayoutType).layout = MainAuth;

export default Index;