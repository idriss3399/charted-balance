import { Transaction } from './TransactionForm';
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';

interface FinanceChartsProps {
  transactions: Transaction[];
}

const COLORS = ['#6E59A5', '#D3E4FD', '#F97316', '#9333EA', '#22D3EE', '#F59E0B'];

const FinanceCharts = ({ transactions }: FinanceChartsProps) => {
  // Calculate category totals for pie chart
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // Calculate monthly totals for bar chart
  const monthlyData = transactions.reduce((acc, curr) => {
    const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 };
    }
    if (curr.type === 'income') {
      acc[month].income += curr.amount;
    } else {
      acc[month].expenses += curr.amount;
    }
    return acc;
  }, {} as Record<string, { month: string; income: number; expenses: number }>);

  const barData = Object.values(monthlyData);

  // Calculate daily totals for line chart
  const dailyTotals = transactions.reduce((acc, curr) => {
    const date = new Date(curr.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += curr.type === 'income' ? curr.amount : -curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const lineData = Object.entries(dailyTotals).map(([date, amount]) => ({
    date,
    amount,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Expense Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: $${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="chart-container">
        <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="income" fill="#6E59A5" name="Income" />
            <Bar dataKey="expenses" fill="#F97316" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="chart-container md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Balance Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#6E59A5" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default FinanceCharts;