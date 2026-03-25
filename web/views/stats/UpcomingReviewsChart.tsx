import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useNextNDaysStatsQuery } from '../../hooks/useQueries';
import { useI18n } from '../../contexts/I18nContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function UpcomingReviewsChart() {
  const t = useI18n();
  const { data: next14DaysStats } = useNextNDaysStatsQuery(14);

  const chartData = {
    labels:
      next14DaysStats?.map((stat) => {
        const [, month, day] = stat.date.split('-').map(Number);
        return `${month}/${day}`;
      }) || [],
    datasets: [
      {
        label: t.charts.cardsDue,
        data: next14DaysStats?.map((stat) => stat.count) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: 'currentColor',
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.2)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: 'currentColor',
        },
        grid: {
          color: 'rgba(128, 128, 128, 0.2)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
  };

  return (
    <div className="mb-6 p-4 rounded-lg bg-secondary border border-theme">
      <h3 className="text-lg font-semibold mb-4">{t.charts.upcomingReviews}</h3>
      <div style={{ height: '250px' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
