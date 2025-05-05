import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function Pagination({
  hasNextPage,
  hasPreviousPage,
  limit,
  page,
  totalPages,
  onPageChange,
}) {
  const [currentPage, setCurrentPage] = useState(page);

  // Update internal state when props change
  useEffect(() => {
    setCurrentPage(page);
  }, [page, limit]);

  // Handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    onPageChange(newPage);
  };

  return (
    <div className="flex items-center justify-between px-2 mt-auto g-2">
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
      >
        <ArrowLeft />
        Previous
      </Button>
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }).map(function (_, index) {
          return (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={`h-8 w-8 ${
                currentPage === index + 1 ? "bg-orange-600 text-white" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
      <Button
        variant="outline"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
      >
        Next
        <ArrowRight />
      </Button>
    </div>
  );
}
