import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
  date: string;
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
  editingTransaction: Transaction | null;
}

const TransactionForm = ({ onAddTransaction, editingTransaction }: TransactionFormProps) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [newCategory, setNewCategory] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description);
      setType(editingTransaction.type);
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast.error("Please fill in all fields");
      return;
    }

    const transaction: Transaction = {
      id: editingTransaction ? editingTransaction.id : Date.now().toString(),
      amount: Number(amount),
      category,
      description,
      type,
      date: editingTransaction ? editingTransaction.date : new Date().toISOString(),
    };

    onAddTransaction(transaction);
    
    setAmount('');
    setCategory('');
    setDescription('');
    setType('expense');
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCustomCategories([...customCategories, newCategory.trim()]);
      setNewCategory('');
      toast.success("New category added!");
    }
  };

  const defaultCategories = ['food', 'transport', 'utilities', 'entertainment', 'shopping', 'salary', 'investment', 'other'];
  const allCategories = [...defaultCategories, ...customCategories];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 gradient-card rounded-xl">
      <h2 className="text-2xl font-bold mb-4">
        {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {allCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newCategory">Add New Category</Label>
        <div className="flex gap-2">
          <Input
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
          />
          <Button type="button" onClick={handleAddCategory}>
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>

      <Button type="submit" className="w-full">
        {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
      </Button>
    </form>
  );
};

export default TransactionForm;