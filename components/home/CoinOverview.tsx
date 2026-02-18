/* eslint-disable react-hooks/error-boundaries */
import { fetcher } from '@/lib/coingecko.sctions';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';
import { CoinOverviewFallback } from './fallback';
import CandleStickChart from '../CandleStickChart';

const CoinOverview = async () => {
  try {
    const [coin, coinOHLCData] = await Promise.all([
      await fetcher<CoinDetailsData>('/coins/bitcoin', {
        dex_pair_format: 'symbol',
      }),

      await fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
        // interval: 'hourly',
        precision: 'full',
      }),
    ]);

    console.log('Coin Overview Data:', { coin, coinOHLCData });

    return (
      <div id="coin-overview">
        <CandleStickChart data={coinOHLCData} coinId="bitcoin">
          <div className="header pt-2">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={56}
              height={56}
            />
            <div className="info">
              <p>
                {coin.name} / {coin.symbol.toUpperCase()}
              </p>
              <h1>{formatPrice(coin.market_data.current_price.usd)}</h1>
            </div>
          </div>
        </CandleStickChart>
      </div>
    );
  } catch (error) {
    console.log('Error fetching coin overview data:', error);
    return <CoinOverviewFallback />;
  }
};

export default CoinOverview;
