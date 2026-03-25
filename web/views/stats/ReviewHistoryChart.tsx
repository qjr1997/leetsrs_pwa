import { Bar } from 'react-chartjs-2';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useLastNDaysStatsQuery } from '../../hooks/useQueries';
import { useI18n } from '../../contexts/I18nContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function ReviewHistoryChart() {
  const t = useI18n();
  const { data: last30DaysStats } = useLastNDaysStatsQuery(30);

  const chartData = {
    labels:
      last30DaysStats?.map((stat) => {
        const [, month, day] = stat.date.split('-').map(Number);
        return `${month}/${day}`;
      }) || [],
    datasets: [
      {
        label: t.ratings.again,
        data: last30DaysStats?.map((stat) => stat.ratingDistribution.again) || [],
        backgroundColor: '#ef4444',
      },
      {
        label: t.ratings.hard,
        data: last30DaysStats?.map((stat) => stat.ratingDistribution.hard) || [],
        backgroundColor: '#f59e0b',
      },
      {
        label: t.ratings.good,
        data: last30DaysStats?.map((stat) => stat.ratingDistribution.good) || [],
        backgroundColor: '#10b981',
      },
      {
        label: t.ratings.easy,
        data: last30DaysStats?.map((stat) => stat.ratingDistribution.easy) || [],
        backgroundColor: '#3b82f6',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          color: 'currentColor',
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.2)',
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: 'currentColor',
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.2)',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 10,
          color: 'currentColor',
        },
        title: {
          padding: 0,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    layout: {
      padding: {
        top: 5,
      },
    },
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-secondary border border-theme">
      <h3 className="text-lg font-semibold mb-4">{t.charts.reviewHistory}</h3>
      <div style={{ height: '250px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
