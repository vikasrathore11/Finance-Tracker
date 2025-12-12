import { useState } from 'react';
import { DollarSign, Tag, FileText, Calendar, Check } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Expense } from './Dashboard';

interface AddExpenseProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', color: 'bg-orange-500', icon: '🍽️' },
  { id: 'transport', label: 'Transportation', color: 'bg-blue-500', icon: '🚗' },
  { id: 'entertainment', label: 'Entertainment', color: 'bg-purple-500', icon: '🎬' },
  { id: 'shopping', label: 'Shopping', color: 'bg-pink-500', icon: '🛍️' },
  { id: 'bills', label: 'Bills & Utilities', color: 'bg-yellow-500', icon: '💡' },
  { id: 'healthcare', label: 'Healthcare', color: 'bg-red-500', icon: '⚕️' },
  { id: 'education', label: 'Education', color: 'bg-green-500', icon: '📚' },
  { id: 'other', label: 'Other', color: 'bg-gray-500', icon: '📌' },
];

export function AddExpense({ onAddExpense }: AddExpenseProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount && category && description) {
      onAddExpense({
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date).toISOString(),
      });

      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setAmount('');
      setCategory('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);

      // Hide success message after 2 seconds
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-green-900">Expense added successfully!</p>
            <p className="text-sm text-green-700">Your expense has been recorded and added to this month's total.</p>
          </div>
        </div>
      )}

      <Card title="Add New Expense" subtitle="Track your daily spending by adding expenses">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    category === cat.label
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Grocery shopping at Walmart"
              icon={<FileText className="w-5 h-5" />}
              required
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              icon={<Calendar className="w-5 h-5" />}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" variant="primary" fullWidth size="lg">
              Add Expense
            </Button>
          </div>
        </form>
      </Card>

      {/* Quick Tips */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl">
          <div className="text-2xl mb-2">💡</div>
          <h4 className="font-medium text-gray-900 mb-1">Be Specific</h4>
          <p className="text-sm text-gray-600">Add detailed descriptions to track spending patterns better</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <div className="text-2xl mb-2">🎯</div>
          <h4 className="font-medium text-gray-900 mb-1">Stay Consistent</h4>
          <p className="text-sm text-gray-600">Log expenses daily for accurate financial insights</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <div className="text-2xl mb-2">📊</div>
          <h4 className="font-medium text-gray-900 mb-1">Review Analytics</h4>
          <p className="text-sm text-gray-600">Check your spending trends in the Analytics tab</p>
        </div>
      </div>
    </div>
  );
}
