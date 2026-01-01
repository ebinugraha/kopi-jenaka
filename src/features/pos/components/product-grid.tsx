import { Product } from "@/features/products/types";
import { useCart } from "../hooks/use-cart";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  const addToCart = useCart((state) => state.addToCart);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => (
        <Card
          key={product.id}
          className={cn(
            "cursor-pointer hover:border-primary transition-all flex flex-col justify-between",
            !product.isAvailable && "opacity-60 grayscale cursor-not-allowed"
          )}
          onClick={() => product.isAvailable && addToCart(product)}
        >
          <CardContent className="p-4 pt-6">
            <div className="flex justify-between items-start mb-2">
              <Badge variant={"outline"} className="text-[10px]">
                {product.category.name}
              </Badge>
              {!product.isAvailable && (
                <Badge variant={"destructive"} className="text-[10px]">
                  Unavailable
                </Badge>
              )}
            </div>
            <h3 className="font-bold text-lg leading-tight mb-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 h-10">
              {product.description || "Tidak ada deskripsi"}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="font-bold text-primary">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(product.price)}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
