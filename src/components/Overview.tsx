import { DollarSign, TrendingUp, TrendingDown, Calendar, Trash2 } from 'lucide-react';
import { Expense, Budget } from './Dashboard';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface OverviewProps {
  expenses: Expense[];
  budgets: Budget[];
  onDeleteExpense: (id: string) => void;
}

export function Overview({ expenses, budgets, onDeleteExpense }: OverviewProps) {
  // Calculate current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const remainingBudget = totalBudget - totalSpent;

  // Calculate spending by category
  const categorySpending = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate last month comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
  });
  
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const percentageChange = lastMonthTotal > 0 ? ((totalSpent - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Spent</span>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(2)}</div>
          <div className="mt-2 text-sm text-gray-500">This month</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Budget</span>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">${totalBudget.toFixed(2)}</div>
          <div className="mt-2 text-sm text-gray-500">Monthly limit</div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Remaining</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              remainingBudget >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-5 h-5 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
          <div className={`text-3xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${Math.abs(remainingBudget).toFixed(2)}
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {remainingBudget >= 0 ? 'Available' : 'Over budget'}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">vs Last Month</span>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className={`text-3xl font-bold ${percentageChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%
          </div>
          <div className="mt-2 text-sm text-gray-500">Change in spending</div>
        </Card>
      </div>

      {/* Category Overview & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending */}
        <Card title="Spending by Category">
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = categorySpending[budget.category] || 0;
              const percentage = (spent / budget.limit) * 100;
              
              return (
                <div key={budget.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{budget.category}</span>
                    <span className="font-semibold">
                      ${spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        percentage > 100 ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {budgets.length === 0 && (
              <p className="text-gray-500 text-center py-8">No budget categories set</p>
            )}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card title="Recent Transactions">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {currentMonthExpenses.slice(0, 10).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{expense.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{expense.category}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="font-semibold text-gray-900 whitespace-nowrap">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteExpense(expense.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
            {currentMonthExpenses.length === 0 && (
              <p className="text-gray-500 text-center py-8">No expenses this month</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
