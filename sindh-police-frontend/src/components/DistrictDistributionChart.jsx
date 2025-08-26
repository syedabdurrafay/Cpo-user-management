import Chart from 'react-apexcharts';

const DistrictDistributionChart = ({ data }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    colors: ['#3B82F6'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: data.map(district => district.name),
      title: {
        text: 'Number of Personnel',
        style: {
          fontSize: '12px',
          color: '#6B7280'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          colors: '#6B7280'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " personnel";
        }
      }
    }
  };

  const series = [{
    name: 'Personnel',
    data: data.map(district => district.personnel)
  }];

  return (
    <div className="mt-4">
      <Chart
        options={chartOptions}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default DistrictDistributionChart;