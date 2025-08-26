import Chart from 'react-apexcharts';

const CrimeTrendChart = () => {
  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#EF4444'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5,
      hover: {
        size: 7
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#6B7280',
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " cases";
        }
      }
    },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4
    }
  };

  const series = [{
    name: 'Crime Cases',
    data: [120, 190, 150, 210, 180, 200, 190, 230, 210, 250, 240, 280]
  }];

  return (
    <Chart
      options={chartOptions}
      series={series}
      type="line"
      height={250}
    />
  );
};

export default CrimeTrendChart;