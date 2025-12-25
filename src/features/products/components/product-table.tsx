import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, Category } from "../../../../prisma/generated/client";

type ProductTableProps = {
  data: (Product & { category: Category })[];
};

export const ProductTable = ({ data }: ProductTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Nama Produk</TableCell>
          <TableCell>Harga</TableCell>
          <TableCell>Kategori</TableCell>
          <TableCell>Aksi</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody></TableBody>
    </Table>
  );
};
