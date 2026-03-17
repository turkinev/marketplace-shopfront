import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { StoreReviews } from "@/components/StoreReviews";

const ProductReviews = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-card border-b border-border sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="p-1">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground">Отзывы</h1>
      </div>

      <div className="lg:px-4 lg:py-6">
        <StoreReviews />
      </div>
    </div>
  );
};

export default ProductReviews;
