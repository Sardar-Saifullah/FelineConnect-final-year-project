export const ReviewTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-row w-full h-[60vh] items-center justify-center text-gray-400">
        <p>No Review Found for this user.</p>
      </div>
    );
  }
  return (
    <>
      <table className="w-full">
        <thead className="bg-[#DB4444] text-white">
          <tr>
            <th className="p-3 text-start">ID</th>
            <th className="p-3 text-start">Product Id</th>
            <th className="p-3 text-start">Rating</th>
            <th className="p-3 text-start">Comments</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((review) => (
            <tr
              key={review.id}
              className="border-t-[1px] border-b-[1px] border-gray-400/20 cursor-pointer hover:bg-gray-100"
            >
              <td className="p-3">{review?.id}</td>
              <td className="p-3">{review?.productId}</td>
              <td className="p-3">{review?.rating}</td>
              <td className="p-3">{review?.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
