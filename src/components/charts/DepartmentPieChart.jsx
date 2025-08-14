import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DepartmentPieChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  useEffect(() => {
    // Initialize chart
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
    }

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}%'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Departments',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: 'bold',
              formatter: function(params) {
                return params.name + '\n' + params.value + '%';
}

            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 40, name: 'Engineering', itemStyle: { color: '#B30000' } },
            { value: 20, name: 'Sales', itemStyle: { color: '#FF0000' } },
            { value: 15, name: 'Marketing', itemStyle: { color: '#A020F0 ' } },
            { value: 13, name: 'HR', itemStyle: { color: '#0059B3' } },
            { value: 12, name: 'Others', itemStyle: { color: '#008000' } }
          ]
        }
      ]
    };

    // Set chart option
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }

    // Handle resize
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 shadow-sm p-6 w-full h-full transition-all duration-500 ease-out hover:shadow-xl hover:border-indigo-100 hover:bg-gradient-to-br hover:from-white hover:to-indigo-50">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 transition-colors duration-500">Department Distribution</h2>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '350px', minHeight: '350px' }}
        className="transition-all duration-500 ease-out"
      />
    </div>
  );
};

export default DepartmentPieChart;
