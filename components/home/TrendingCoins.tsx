import { fetcher } from '@/lib/coingecko.sctions';
import DataTable from '../DataTable.tsx';
import Link from 'next/link.js';
import Image from 'next/image.js';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

const TrendingCoins = async () => {
  const columns: DataTableColumn<TrendingCoin>[] = [
    {
      header: 'Name',
      cellClassName: 'name-cell',
      cell: (coin) => {
        const item = coin.item;
        return (
          <Link href={`/coins${item.id}`} className="flex items-center gap-2">
            <Image src={item.large} alt={item.name} width={36} height={36} />
            <p>{item.name}</p>
          </Link>
        );
      },
    },
    {
      header: '24h Change',
      cellClassName: 'name-cell',
      cell: (coin) => {
        const item = coin.item;
        const isTrendingUp = item.data.price_change_percentage_24h.usd > 0;

        return (
          <div
            className={
              isTrendingUp
                ? 'text-green-500 flex items-center gap-1'
                : 'text-red-500 flex items-center gap-1'
            }
          >
            {isTrendingUp ? (
              <TrendingUpIcon width={16} height={16} />
            ) : (
              <TrendingDownIcon width={16} height={16} />
            )}
            <span>{item.data.price_change_percentage_24h.usd.toFixed(2)}%</span>
          </div>
        );
      },
    },
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (coin) => coin.item.data.price,
    },
  ];

  const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
    '/search/trending',
    undefined,
    300
  );
  return (
    <div id="trending-coins">
      <h4>Trending Coins</h4>
      <DataTable
        columns={columns}
        data={trendingCoins.coins.slice(0, 6) || []}
        rowKey={(coin) => coin.item.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyRowClassName="py-2"
      />
    </div>
  );
};

export default TrendingCoins;
