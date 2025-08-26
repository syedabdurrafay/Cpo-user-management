import Chart from 'react-apexcharts';

const chartOptions = {
  chart: {
    type: 'radar',
    toolbar: { show: false },
    dropShadow: {
      enabled: true,
      blur: 1,
      left: 1,
      top: 1
    }
  },
  colors: ['#FFC107'],
  xaxis: {
    categories: ['IG', 'DIG', 'SSP', 'ASP', 'Inspector', 'Constable']
  },
  markers: {
    size: 4,
    hover: {
      size: 6
    }
  },
  fill: {
    opacity: 0.2
  },
  tooltip: {
    theme: 'dark'
  }
};

export default function RankDistribution() {
  return (
    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
      <h3 className="text-lg font-medium mb-6">Rank Distribution</h3>
      <Chart
        options={chartOptions}
        series={[{ name: 'Personnel', data: [12, 28, 45, 78, 210, 1469] }]}
        type="radar"
        height={350}
      />
    </div>
  );
}