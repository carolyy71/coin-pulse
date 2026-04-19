import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const column: DataTableColumn<TrendingCoin>[] = [
  {
    header: 'Price',
    cellClassName: 'price-cell',
    cell: (coin) => coin.item.data.price,
  },
  {
    header: 'Name',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;
      return (
        <Link href={`/coins${item.id}`}>
          <Image src={item.large} alt={item.name} width={36} height={36}>
            <p>{item.name}</p>
          </Image>
        </Link>
      );
    },
  },
  {
    header: '24 Change',
    cellClassName: 'name-cell',
    cell: (coin) => {
      const item = coin.item;
      const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

      return (
        <div
          className={cn(
            'price-change',
            isTrendingUp ? 'text-green-500' : 'text-red-500'
          )}
        >
          {isTrendingUp ? (
            <TrendingUp width={16} height={16} />
          ) : (
            <TrendingDown width={16} height={16} />
          )}
        </div>
      );
    },
  },
];

const DataTable = <T,>({
  tableClassName,
  data,
  headerCellClassName,
  headerRowClassName,
  columns,
  bodyRowClassName,
  bodyCellClassName,
  rowKey,
}: DataTableProps<T>) => {
  return (
    <Table className={cn('custom-scroller', tableClassName)}>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader className={headerCellClassName}>
        <TableRow className={cn('hover:bg-transparent!', headerRowClassName)}>
          {columns.map((column, i) => (
            <TableHead
              key={i}
              className={cn(
                'bg-dark-400 text-purple-100 py-4 first:pl-5 last:pr-5',
                headerCellClassName,
                column.headClassName
              )}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, i) => (
          <TableRow
            key={rowKey(row, i)}
            className={cn(
              'overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30! relative',
              bodyRowClassName
            )}
          >
            {columns.map((column, j) => (
              <TableCell
                key={j}
                className={cn(
                  'py-4 first:pl-5 last:pr-5',
                  bodyCellClassName,
                  column.cellClassName
                )}
              >
                {column.cell(row, i)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DataTable;
