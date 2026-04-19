import { fetcher } from '@/lib/coingecko.sctions';
import DataTable from '../DataTable.tsx';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

export const Categories = async () => {
  const categories = await fetcher<Category[]>('coins/categories');

  const columns: DataTableColumn<Category>[] = [
    {
      header: 'Categories',
      cellClassName: 'category-cell',
      cell: (category) => category.name,
    },
    {
      header: 'Top Gainer',
      cellClassName: 'gainer-cell',
      cell: (category) =>
        category.top_3_coins.map((coin) => (
          <Image key={coin} src={coin} alt="coin" width={28} height={28} />
        )),
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (category) => formatCurrency(category.market_cap),
    },
    {
      header: '24h Change',
      cellClassName: 'change-header-cell',
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;

        return (
          <div
            className={cn(
              'change-cell',
              isTrendingUp ? 'text-green-500' : 'text-red-500'
            )}
          >
            <p className="flex items-center">
              {formatPercentage(category.market_cap_change_24h)}
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: '24h Volume',
      cellClassName: 'volume-cell',
      cell: (category) => formatCurrency(category.volume_24h),
    },
  ];

  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top CCategories</h4>
      <DataTable
        columns={columns}
        data={categories}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
};
