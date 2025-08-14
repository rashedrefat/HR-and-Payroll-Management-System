import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AttendanceBarChart = () => {
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
      legend: {
        data: ['Present', 'Absent', 'On Leave'],
        bottom: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '3%',
        containLabel: true
      },
      dataset: {
        source: [
          ['product', 'Present', 'Absent', 'On Leave'],
          ['Sunday', 95, 27, 3],
          ['Monday', 109, 10, 6],
          ['Tuesday', 110, 13, 2],
          ['Wednesday', 100, 24, 1],
          ['Thursday', 90, 20, 15]
        ]
      },
      xAxis: {
        type: 'category',
        axisTick: { alignWithLabel: true }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        { 
          type: 'bar',
          itemStyle: { color: '#FF5454' },
          emphasis: {
            itemStyle: { color: '#FF5454' }
          }
        },
        { 
          type: 'bar',
          itemStyle: { color: '#FF0000' },
          emphasis: {
            itemStyle: { color: '#FF0000' }
          }
        },
        { 
          type: 'bar',
          itemStyle: { color: '#8B0000' },
          emphasis: {
            itemStyle: { color: '#8B0000' }
          }
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4 transition-colors duration-500">Weekly Attendance Overview</h2>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '350px', minHeight: '350px' }}
        className="transition-all duration-500 ease-out"
      />
    </div>
  );
};

export default AttendanceBarChart;
