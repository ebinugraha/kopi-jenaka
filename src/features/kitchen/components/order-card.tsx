import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderKitchen } from "@/features/orders/type";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { CheckCircle, ChefHat, Clock } from "lucide-react";

interface OrderCardProps {
  order: OrderKitchen;
  onUpdateStatus: (id: string, status: "COOKING" | "READY") => void;
  isUpdating: boolean;
}

export function OrderCard({
  order,
  onUpdateStatus,
  isUpdating,
}: OrderCardProps) {
  return (
    <Card
      className={`border-l-4 ${
        order.status === "PENDING" ? "border-l-red-500" : "border-l-yellow-500"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {order.id.slice(-4)}
          </CardTitle>
          <Badge
            variant={order.status === "PENDING" ? "destructive" : "secondary"}
          >
            {order.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(order.createdAt), {
            addSuffix: true,
            locale: id,
          })}
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {order.items.map((item: any) => (
            <li
              key={item.id}
              className="flex justify-between text-sm font-medium border-b border-dashed pb-1"
            >
              <span>{item.product.name}</span>
              <span className="font-bold">x{item.quantity}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-2">
        {order.status === "PENDING" ? (
          <Button
            className="w-full bg-yellow-600 hover:bg-yellow-700"
            onClick={() => onUpdateStatus(order.id, "COOKING")}
            disabled={isUpdating}
          >
            <ChefHat className="mr-2 h-4 w-4" /> Masak
          </Button>
        ) : (
          <Button
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={() => onUpdateStatus(order.id, "READY")}
            disabled={isUpdating}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Siap Saji
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
