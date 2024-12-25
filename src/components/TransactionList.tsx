import { Transaction } from './TransactionForm';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const TransactionList = ({ transactions, onDelete, onEdit }: TransactionListProps) => {
  return (
    <div className="chart-container">
      <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`transaction-item ${
                transaction.type === 'income' ? 'bg-green-50' : 'bg-red-50'
              } p-4 rounded-lg`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p
                    className={`font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TransactionList;