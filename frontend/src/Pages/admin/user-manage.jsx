import React, { useEffect, useState } from "react";
import { useUsers } from "../../actions/query";
import { UserTable } from "../../components/admin/ui/tables/user-table";
import { UserProfile } from "../../components/admin/ui/profile/user-profile";
import { CreateEditUsersComp } from "../../components/admin/ui/dialogs/create-edit-user";

export const UserManage = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsData, setItemsData] = useState([]);
  const [totalItems, setTotalItems] = useState(false);
  const { data, isLoading, error, refetch } = useUsers(page);
  const [profile, setProfile] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  useEffect(() => {
    if (data) {
      setTotalItems(data?.totalUsers || 0);
      setItemsData(data?.users || []);
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
        <CreateEditUsersComp
          refetch={refetch}
          edit={false}
          open={openCreate}
          setOpen={setOpenCreate}
        />
      )}

      <main className="mt-4">
        <div className="flex flex-col gap-10">
          {!profile && (
            <>
              <div className="flex flex-row items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <button
                  onClick={() => {
                    setOpenCreate(true);
                  }}
                  className="px-3 py-2 border-0 rounded-[7px] bg-[#DB4444] text-white font-[500]"
                >
                  Create User
                </button>
              </div>
              <UserTable
                data={itemsData}
                currentPage={page}
                onPageChange={setPage}
                totalPages={totalPages}
                profile={profile}
                setProfile={setProfile}
                setSelectedItem={setSelectedItem}
                refetch={refetch}
              />
            </>
          )}
          {profile && (
            <UserProfile
              profile={profile}
              setProfile={setProfile}
              data={selectedItem}
              refetch={refetch}
            />
          )}
        </div>
      </main>
    </>
  );
};
