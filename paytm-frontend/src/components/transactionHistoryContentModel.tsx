import axios from "axios";
import { BackendUrl } from "../config";
import { useEffect, useState } from "react";
import { CrossIcon } from "./icons";

interface Transaction {
    from: string;
    to: string;
    amount: string;
    createdAt: string;
}

interface TransactionHistoryContentModelProps {
    open: boolean;
    onClose: () => void;
}

export function TransactionHistoryContentModel({ open, onClose }: TransactionHistoryContentModelProps) {
    const [history, setHistory] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(`${BackendUrl}/api/v1/transactionHistory`, {
                    headers: { token: localStorage.getItem("Token") },
                });
                
                if (Array.isArray(response.data)) {
                    setHistory(response.data);
                } else {
                    setHistory(response.data.transactionHistory || []);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        if (open) {
            fetchHistory();
        }
    }, [open]);

    return (
        <div>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-8">
                    <div className="fixed inset-0 bg-gray-400 opacity-60" onClick={onClose}></div>
                    <div className="relative w-full max-w-4xl lg:max-w-5xl bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg overflow-hidden">
                        <span onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
                            <CrossIcon />
                        </span>
                        <div className="mt-4 border border-gray-300 rounded-md max-h-[70vh] overflow-y-auto">
                            <div className="w-full overflow-x-auto">
                                <table className="w-full border-collapse text-xs sm:text-sm md:text-base min-w-[600px]">
                                    <thead className="sticky top-0 bg-gray-200">
                                        <tr>
                                            <th className="border border-gray-300 px-2 sm:px-4 py-2 whitespace-nowrap">Account Number</th>
                                            <th className="border border-gray-300 px-2 sm:px-4 py-2 whitespace-nowrap">Receiver's Account Number</th>
                                            <th className="border border-gray-300 px-2 sm:px-4 py-2 whitespace-nowrap">Amount</th>
                                            <th className="border border-gray-300 px-2 sm:px-4 py-2 whitespace-nowrap">Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4">No transactions found</td>
                                            </tr>
                                        ) : (
                                            history.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-100">
                                                    <td className="border border-gray-300 px-2 sm:px-4 py-2 truncate max-w-[150px] md:max-w-[200px]">
                                                        {item.from}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 sm:px-4 py-2 truncate max-w-[150px] md:max-w-[200px]">
                                                        {item.to}
                                                    </td>
                                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">{item.amount}</td>
                                                    <td className="border border-gray-300 px-2 sm:px-4 py-2">
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}