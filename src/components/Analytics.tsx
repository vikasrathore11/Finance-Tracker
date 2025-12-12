import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Expense, Budget } from './Dashboard';
import { Card } from './ui/Card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface AnalyticsProps {
  expenses: Expense[];
  budgets: Budget[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6b7280'];

export function Analytics({ expenses, budgets }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Calculate current period expenses
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Category breakdown data
  const categoryData = currentMonthExpenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Monthly trend data (last 6 months)
  const monthlyTrendData = [];
  for (let i = 5; i >= 0; i--) {
    const targetMonth = currentMonth - i;
    const targetYear = currentYear + Math.floor(targetMonth / 12);
    const normalizedMonth = ((targetMonth % 12) + 12) % 12;
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === normalizedMonth && expenseDate.getFullYear() === targetYear;
    });

    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const monthName = new Date(targetYear, normalizedMonth).toLocaleDateString('en', { month: 'short' });
    
    monthlyTrendData.push({
      month: monthName,
      spent: parseFloat(total.toFixed(2)),
      budget: budgets.reduce((sum, b) => sum + b.limit, 0)
    });
  }

  // Daily spending for current month
  const dailySpendingData = [];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  for (let day = 1; day <= Math.min(daysInMonth, 30); day++) {
    const dayExpenses = currentMonthExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getDate() === day;
    });
    
    const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    dailySpendingData.push({
      day: day.toString(),
      amount: parseFloat(total.toFixed(2))
    });
  }

  // Top spending categories
  const topCategories = [...categoryData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Calculate insights
  const totalSpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const avgDailySpending = totalSpent / now.getDate();
  const projectedMonthlySpending = avgDailySpending * daysInMonth;

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
          <p className="text-gray-600 mt-1">Visualize your spending patterns and trends</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Avg Daily Spending</span>
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${avgDailySpending.toFixed(2)}</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Projected Monthly</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">${projectedMonthlySpending.toFixed(2)}</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Budget Usage</span>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}%
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Total Categories</span>
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-green-600">{categoryData.length}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{categoryData.length}</div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category - Pie Chart */}
        <Card title="Spending Distribution">
          {categoryData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No spending data available
            </div>
          )}
        </Card>

        {/* Top Categories - Bar Chart */}
        <Card title="Top Spending Categories">
          {topCategories.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              No category data available
            </div>
          )}
        </Card>

        {/* Monthly Trend */}
        <Card title="6-Month Spending Trend">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="spent" stroke="#6366f1" strokeWidth={2} name="Spent" />
                <Line type="monotone" dataKey="budget" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Budget" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Daily Spending Pattern */}
        <Card title="Daily Spending (This Month)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpendingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Spending Summary Table */}
      <Card title="Category Summary">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Spent</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Budget</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Remaining</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {budgets.map((budget) => {
                const spent = categoryData.find(c => c.name === budget.category)?.value || 0;
                const remaining = budget.limit - spent;
                const percentage = (spent / budget.limit) * 100;

                return (
                  <tr key={budget.category} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{budget.category}</td>
                    <td className="py-3 px-4 text-right text-gray-900">${spent.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-600">${budget.limit.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${Math.abs(remaining).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        percentage > 100 ? 'bg-red-100 text-red-700' :
                        percentage > 80 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {budgets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No budget categories configured
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
