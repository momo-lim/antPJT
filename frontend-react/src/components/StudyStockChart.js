import React from 'react';

import { BarChart } from '@toast-ui/react-chart';

function StudyStockChart({ nowPrice, prevPrice, date }) {
  // chart
  const options = {
    chart: {
      width: 400,
      height: 300,
      title: '주가 비교',
      format: '1,000',
    },
    yAxis: {
      title: '날짜',
    },
    xAxis: {
      title: '가격',
      min: 0,
      max: 9000,
      suffix: '$',
    },
    series: {
      showLabel: false,
    },
  };

  return (
    <BarChart
      data={{
        categories: ['현재', date.slice(0, 10)],
        series: [
          {
            name: 'Stock',
            data: [nowPrice.replace(',', ''), prevPrice],
            colorByCategories: true,
          },
        ],
      }}
      options={options}
    />
  );
}

export default StudyStockChart;
