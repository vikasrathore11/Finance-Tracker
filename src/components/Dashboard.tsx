import { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, BarChart3, Target, LogOut, Menu, X } from 'lucide-react';
import { Overview } from './Overview';
import { AddExpense } from './AddExpense';
import { Analytics } from './Analytics';
import { BudgetSettings } from './BudgetSettings';
import { Button } from './ui/Button';

interface DashboardProps {
  userEmail: string | null;
  onLogout: () => void;
}

type Tab = 'overview' | 'add' | 'analytics' | 'budget';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  limit: number;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudgets = localStorage.getItem('budgets');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      // Add some demo data
      const demoExpenses: Expense[] = [
        { id: '1', amount: 45.50, category: 'Food & Dining', description: 'Grocery shopping', date: new Date().toISOString() },
        { id: '2', amount: 120.00, category: 'Transportation', description: 'Gas', date: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', amount: 25.00, category: 'Entertainment', description: 'Movie tickets', date: new Date(Date.now() - 172800000).toISOString() },
      ];
      setExpenses(demoExpenses);
      localStorage.setItem('expenses', JSON.stringify(demoExpenses));
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      // Add demo budgets
      const demoBudgets: Budget[] = [
        { category: 'Food & Dining', limit: 500 },
        { category: 'Transportation', limit: 300 },
        { category: 'Entertainment', limit: 200 },
        { category: 'Shopping', limit: 400 },
        { category: 'Bills & Utilities', limit: 600 },
        { category: 'Healthcare', limit: 250 },
      ];
      setBudgets(demoBudgets);
      localStorage.setItem('budgets', JSON.stringify(demoBudgets));
    }
  }, []);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
    setActiveTab('overview');
  };

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  const updateBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    localStorage.setItem('budgets', JSON.stringify(newBudgets));
  };

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'add' as Tab, label: 'Add Expense', icon: PlusCircle },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'budget' as Tab, label: 'Budget', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FinanceFlow
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <div className="text-right">
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className="hidden sm:flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {activeTab === 'overview' && (
          <Overview expenses={expenses} budgets={budgets} onDeleteExpense={deleteExpense} />
        )}
        {activeTab === 'add' && <AddExpense onAddExpense={addExpense} />}
        {activeTab === 'analytics' && <Analytics expenses={expenses} budgets={budgets} />}
        {activeTab === 'budget' && <BudgetSettings budgets={budgets} onUpdateBudgets={updateBudgets} />}
      </main>
    </div>
  );
}
