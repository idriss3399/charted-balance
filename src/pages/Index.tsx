import { useState } from 'react';
import TransactionForm, { Transaction } from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import FinanceCharts from '@/components/FinanceCharts';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

// Demo data
const demoTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3000,
    category: 'salary',
    description: 'Monthly Salary',
    type: 'income',
    date: '2024-03-01',
  },
  {
    id: '2',
    amount: 500,
    category: 'food',
    description: 'Grocery Shopping',
    type: 'expense',
    date: '2024-03-05',
  },
  {
    id: '3',
    amount: 200,
    category: 'entertainment',
    description: 'Movie Night',
    type: 'expense',
    date: '2024-03-10',
  },
  {
    id: '4',
    amount: 1000,
    category: 'investment',
    description: 'Stock Investment',
    type: 'income',
    date: '2024-03-15',
  },
];

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
      setTransactions(transactions.map(t => 
        t.id === editingTransaction.id ? transaction : t
      ));
      setEditingTransaction(null);
      toast.success("Transaction updated successfully!");
    } else {
      setTransactions([transaction, ...transactions]);
      toast.success("Transaction added successfully!");
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Transaction deleted successfully!");
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const exportToExcel = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    const filteredTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    if (filteredTransactions.length === 0) {
      toast.error("No transactions found in the selected date range");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(filteredTransactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, `transactions_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.xlsx`);
    toast.success("Transactions exported successfully!");
  };

  // Calculate total balance
  const totalBalance = transactions.reduce(
    (acc, curr) => acc + (curr.type === 'income' ? curr.amount : -curr.amount),
    0
  );

  // Calculate total income
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Calculate total expenses
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold mb-8">Desert Cross Services Finance Tracker</h1>
          <p className="text-gray-600">Inspired and made by Idriss 🌍⚙️</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="stat-card bg-primary text-primary-foreground">
            <h3 className="text-lg font-medium">Total Balance</h3>
            <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
          </Card>
          
          <Card className="stat-card bg-green-500 text-white">
            <h3 className="text-lg font-medium">Total Income</h3>
            <p className="text-3xl font-bold">${totalIncome.toFixed(2)}</p>
          </Card>
          
          <Card className="stat-card bg-accent text-white">
            <h3 className="text-lg font-medium">Total Expenses</h3>
            <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FinanceCharts transactions={transactions} />
          </div>
          
          <div className="space-y-6">
            <TransactionForm 
              onAddTransaction={handleAddTransaction} 
              editingTransaction={editingTransaction}
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Export Transactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
              <Button onClick={exportToExcel} className="w-full">
                Export to Excel
              </Button>
            </div>
            <TransactionList 
              transactions={transactions}
              onDelete={handleDeleteTransaction}
              onEdit={handleEditTransaction}
            />
          </div>
        </div>

        <footer className="text-center text-gray-500 py-8">
          <p>© 2024 Desert Cross Services Finance Tracker. Created by Idriss</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
