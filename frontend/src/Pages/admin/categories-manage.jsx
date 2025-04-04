import React, { useEffect, useState } from "react";
import { useProductCategories } from "../../actions/query";
import { CategoryTable } from "../../components/admin/ui/tables/categories-table";
import { CreateEditCategoryComp } from "../../components/admin/ui/dialogs/create-edit-category";

export const CategoryManage = () => {
  const { data, isLoading, error, refetch } = useProductCategories();
  const [openCreate, setOpenCreate] = useState(false);
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
        <CreateEditCategoryComp
          edit={false}
          refetch={refetch}
          open={openCreate}
          setOpen={setOpenCreate}
        />
      )}

      <main className="mt-4">
        <div className="flex flex-col gap-10">
          <div className="flex flex-row items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Category Management
            </h1>

            <button
              onClick={() => {
                setOpenCreate(true);
              }}
              className="px-3 py-2 border-0 rounded-[7px] bg-[#DB4444] text-white font-[500]"
            >
              Create Category
            </button>
          </div>
          <CategoryTable data={data} edit={true} refetch={refetch} />
        </div>
      </main>
    </>
  );
};
