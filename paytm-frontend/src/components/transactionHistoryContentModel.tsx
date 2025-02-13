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

                // Check if response is an object or array
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
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-gray-400 opacity-60" onClick={onClose}></div>
                    <div className="w-200 h-120 border opacity-100 z-50 bg-white p-4 rounded-lg shadow-lg">
                        <span onClick={onClose} className="flex justify-end cursor-pointer">
                            <CrossIcon />
                        </span>
                        <div className="mt-4 max-h-4/5 overflow-y-auto items-centern border border-gray-300 rounded-md">
                            <table className="w-full  border-collapse">
                                <thead className="sticky top-0 bg-gray-200">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Account Number</th>
                                        <th className="border border-gray-300 px-4 py-2">Receiver's Account Number</th>
                                        <th className="border border-gray-300 px-4 py-2">Amount</th>
                                        <th className="border border-gray-300 px-4 py-2">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {history.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-4">
                                                No transactions found
                                            </td>
                                        </tr>
                                    ) : (
                                        history.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="border border-gray-300 px-4 py-2">{item.from}</td>
                                                <td className="border border-gray-300 px-4 py-2">{item.to}</td>
                                                <td className="border border-gray-300 px-4 py-2">{item.amount}</td>
                                                <td className="border border-gray-300 px-4 py-2">
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
            )}
        </div>
    );
}
