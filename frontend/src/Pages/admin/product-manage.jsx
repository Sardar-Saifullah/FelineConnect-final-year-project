import React, { useEffect, useState } from "react";
import { ProductTable } from "../../components/admin/ui/tables/product-table";
import { useProducts } from "../../actions/query";
import { CreateEditProductsComp } from "../../components/admin/ui/dialogs/create-edit-product";

export const ProductManage = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [productsData, setProductsData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(false);
  const { data, isLoading, error, refetch } = useProducts(page);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    if (data) {
      setTotalProducts(data?.totalProducts || 0);
      setProductsData(data?.products || []);
      setTotalPages(data?.totalPages || 0); // Set total pages from API response
    }
  }, [data]);
  if (isLoading) {
    return (
      <>
        <div className="h-[60vh] w-full flex flex-row items-center justify-center">
          <p>loading...</p>
        </div>
      </>
    );
  }
  return (
    <>
      {openCreate && (
        <CreateEditProductsComp
          refetch={refetch}
          open={openCreate}
          setOpen={setOpenCreate}
        />
      )}

      <main className="mt-4">
        <div className="flex flex-col gap-10">
          <div className="flex flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>

            <button
              onClick={() => {
                setOpenCreate(true);
              }}
              className="px-3 py-2 border-0 rounded-[7px] bg-[#DB4444] text-white font-[500]"
            >
              Create Product
            </button>
          </div>
          <ProductTable
            data={productsData}
            currentPage={page}
            onPageChange={setPage}
            totalPages={totalPages}
            refetch={refetch}
          />
        </div>
      </main>
    </>
  );
};
