export const renderPageNumbers = (totalPages, onPageChange, currentPage) => {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
  } else {
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 rounded ${
          currentPage === 1 ? "bg-orange-500 text-white" : "bg-gray-200"
        }`}
      >
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(<span key="start-ellipsis">...</span>);
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded ${
            currentPage === i ? "bg-orange-500 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(<span key="end-ellipsis">...</span>);
    }

    pages.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-orange-500 text-white"
            : "bg-gray-200"
        }`}
      >
        {totalPages}
      </button>
    );
  }

  return pages;
};
