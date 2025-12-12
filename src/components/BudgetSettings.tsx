import { useState } from 'react';
import { Target, Plus, Trash2, Save } from 'lucide-react';
import { Budget } from './Dashboard';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface BudgetSettingsProps {
  budgets: Budget[];
  onUpdateBudgets: (budgets: Budget[]) => void;
}

const CATEGORY_OPTIONS = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Gifts & Donations',
  'Insurance',
  'Other'
];

export function BudgetSettings({ budgets, onUpdateBudgets }: BudgetSettingsProps) {
  const [editingBudgets, setEditingBudgets] = useState<Budget[]>([...budgets]);
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [saved, setSaved] = useState(false);

  const handleAddBudget = () => {
    if (newCategory && newLimit && parseFloat(newLimit) > 0) {
      const exists = editingBudgets.find(b => b.category === newCategory);
      if (!exists) {
        setEditingBudgets([...editingBudgets, { category: newCategory, limit: parseFloat(newLimit) }]);
        setNewCategory('');
        setNewLimit('');
      }
    }
  };

  const handleUpdateLimit = (category: string, newLimitValue: string) => {
    const limit = parseFloat(newLimitValue);
    if (!isNaN(limit) && limit >= 0) {
      setEditingBudgets(
        editingBudgets.map(b => 
          b.category === category ? { ...b, limit } : b
        )
      );
    }
  };

  const handleRemoveBudget = (category: string) => {
    setEditingBudgets(editingBudgets.filter(b => b.category !== category));
  };

  const handleSave = () => {
    onUpdateBudgets(editingBudgets);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalBudget = editingBudgets.reduce((sum, b) => sum + b.limit, 0);
  const availableCategories = CATEGORY_OPTIONS.filter(
    cat => !editingBudgets.find(b => b.category === cat)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Settings</h2>
          <p className="text-gray-600 mt-1">Set monthly spending limits for each category</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Monthly Budget</p>
          <p className="text-3xl font-bold text-indigo-600">${totalBudget.toFixed(2)}</p>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Save className="w-5 h-5 text-white" />
          </div>
          <p className="font-medium text-green-900">Budget settings saved successfully!</p>
        </div>
      )}

      {/* Add New Budget */}
      <Card title="Add Budget Category" icon={<Plus className="w-5 h-5" />}>
        <div className="grid sm:grid-cols-[1fr,200px,auto] gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Limit</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddBudget}
              disabled={!newCategory || !newLimit}
              className="w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </Card>

      {/* Budget List */}
      <Card title="Current Budgets" icon={<Target className="w-5 h-5" />}>
        <div className="space-y-3">
          {editingBudgets.map((budget) => {
            const percentage = (budget.limit / totalBudget) * 100;
            
            return (
              <div
                key={budget.category}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{budget.category}</h4>
                      <span className="text-sm text-gray-500">
                        {percentage.toFixed(1)}% of total budget
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={budget.limit}
                          onChange={(e) => handleUpdateLimit(budget.category, e.target.value)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveBudget(budget.category)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {editingBudgets.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No budget categories yet</p>
              <p className="text-sm text-gray-400 mt-1">Add your first budget category above</p>
            </div>
          )}
        </div>
      </Card>

      {/* Budget Allocation Visualization */}
      {editingBudgets.length > 0 && (
        <Card title="Budget Allocation">
          <div className="space-y-3">
            {editingBudgets
              .sort((a, b) => b.limit - a.limit)
              .map((budget, index) => {
                const percentage = (budget.limit / totalBudget) * 100;
                const colors = [
                  'bg-indigo-500',
                  'bg-purple-500',
                  'bg-pink-500',
                  'bg-orange-500',
                  'bg-green-500',
                  'bg-blue-500',
                  'bg-red-500',
                  'bg-yellow-500'
                ];

                return (
                  <div key={budget.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{budget.category}</span>
                      <span className="text-sm text-gray-900 font-semibold">
                        ${budget.limit.toFixed(2)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${colors[index % colors.length]} transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={() => setEditingBudgets([...budgets])}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          className="min-w-32"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Tips */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-5 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">💡 Budget Planning Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
            <li>• Review and adjust budgets monthly</li>
            <li>• Set realistic limits based on past spending</li>
          </ul>
        </div>
        <div className="bg-green-50 p-5 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">🎯 Staying on Track</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Check your progress in the Overview tab</li>
            <li>• Get alerted when approaching 80% of budget</li>
            <li>• Analyze spending patterns in Analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
