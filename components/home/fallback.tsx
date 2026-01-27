import DataTable from '@/components/DataTable.tsx';

export const CoinOverviewFallback = () => {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image skeleton animate-pulse"></div>
        <div className="info">
          <div className="header-line-sm skeleton animate-pulse"></div>
          <div className="header-line-lg skeleton animate-pulse"></div>
        </div>
      </div>
      <div className="chart">
        <div className="chart-skeleton skeleton animate-pulse"></div>
      </div>
    </div>
  );
};

export const TrendingCoinsFallback = () => {
  const skeletonData = Array.from({ length: 5 }, (_, i) => ({
    id: `skeleton-${i}`,
  }));

  const skeletonColumns = [
    {
      header: 'Name',
      cell: () => (
        <div className="name-link">
          <div className="name-image skeleton animate-pulse"></div>
          <div className="name-line skeleton animate-pulse"></div>
        </div>
      ),
    },
    {
      header: '24h Change',
      cell: () => (
        <div className="change-line skeleton animate-pulse"></div>
      ),
    },
    {
      header: 'Price',
      cell: () => (
        <div className="price-line skeleton animate-pulse"></div>
      ),
    },
  ];

  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <div className="trending-coins-table">
        <DataTable
          columns={skeletonColumns}
          data={skeletonData}
          rowKey={(row) => row.id}
        />
      </div>
    </div>
  );
};
