import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const StatChart = ({ data, type = 'line' }) => {
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
  };

  if (type === 'pie') {
    return (
      <PieChart
        data={data.datasets[0].data.map((value, index) => ({
          name: data.labels[index],
          population: value,
          color: ['#007bff', '#28a745', '#ffc107'][index],
          legendFontColor: '#333',
          legendFontSize: 14,
        }))}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    );
  }

  return (
    <LineChart
      data={data}
      width={screenWidth - 40}
      height={220}
      chartConfig={chartConfig}
      bezier
      style={{ borderRadius: 16 }}
    />
  );
};

export default StatChart;