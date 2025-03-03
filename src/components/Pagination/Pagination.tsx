import React from "react";
import "./Pagination.scss";

interface PaginationProps {
  currentPage: number;
  totalStocks: number;
  stocksPerPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Component to handle pagination of stock list.
 * @param currentPage - The current active page.
 * @param totalStocks - The total number of stocks.
 * @param stocksPerPage - The number of stocks per page.
 * @param onPageChange - Function to handle page change.
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalStocks,
  stocksPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalStocks / stocksPerPage);

  /**
   * Dynamically adjust visible page numbers.
   * @returns An array of visible page numbers.
   */
  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1); // Show all if <= 5 pages
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination">
      <button
        className="pagination__button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {visiblePages.map((page, index) => (
        <button
          key={index}
          className={`pagination__button ${
            page === currentPage ? "pagination__button--active" : ""
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination__button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
