import { useEffect, useState } from "react";
import { BalanceContentModel } from "../components/balanceContentModel";
import { AccountContentModel } from "../components/accountContentModel";
import { BackendUrl } from "../config";
import axios from "axios";
import { TransactionContentModel } from "../components/transationContentModel";
import { PaytmIcon } from "../components/icons";
import { TransactionHistoryContentModel } from "../components/transactionHistoryContentModel";

export function Dashboard() {
    const [openBalanceModel, setOpenBalanceModel] = useState(false);
    const [openAccountModel, setOpenAccountModel] = useState(false);
    const [openHistoryModel, setOpenHistoryModel] = useState(false);
    const [openSendMoneyModel, setOpenSendMoneyModel] = useState({state: false, accountNumber: ""});
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BackendUrl}/api/v1/users`, {
                    headers: {
                        token: localStorage.getItem("Token"),
                    },
                });
                setUsers(response.data.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="bg-blue-50 h-screen flex flex-col">
            {/* Top Navbar */}
            <div className="flex  items-center border border-gray-100 bg-gray-300 rounded-sm justify-around">
                <div>
                    <PaytmIcon />
                </div>
                <div>
                    <AccountContentModel open={openAccountModel} onClose={() => setOpenAccountModel(false)} />
                    <button
                        className="bg-blue-400  cursor-pointer text-white font-semibold text-sm md:text-base lg:text-lg py-2 px-2 rounded-2xl"
                        onClick={() => setOpenAccountModel(true)}
                    >
                        Add <span className="block md:inline">Account</span>
                    </button>
                </div>
                <div>
                    <BalanceContentModel open={openBalanceModel} onClose={() => setOpenBalanceModel(false)} />
                    <button
                        className="bg-blue-400 cursor-pointer text-white text-sm md:text-base lg:text-lg font-semibold py-2 px-2 rounded-2xl"
                        onClick={() => setOpenBalanceModel(true)}
                    >
                        Check<span className="block md:inline"> Balance</span>
                    </button>
                </div>
                <div>
                    <TransactionHistoryContentModel open={openHistoryModel} onClose={() => setOpenHistoryModel(false)} />
                    <button onClick={() => setOpenHistoryModel(true)} className="bg-blue-400 text-sm md:text-base lg:text-lg cursor-pointer text-white font-semibold py-2 px-2 rounded-2xl">
                        Transaction<span className="block md:inline">   History</span>
                    </button>
                </div>
            </div>

            <TransactionContentModel open={openSendMoneyModel} onClose={() => setOpenSendMoneyModel({state: false, accountNumber: ""})} />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-4">
                <div className="flex items-center mt-4 gap-2">
                    <img
                        className="w-16 h-12 sm:w-20 sm:h-14 md:w-24 md:h-16 lg:w-28 lg:h-20 rounded-3xl border border-gray-300"
                        src="https://assetscdn1.paytm.com/images/catalog/view/308023/1615956941865.png"
                        alt=""
                    />
                    <div className="text-sm md:text-md lg:text-lg font-bold text-gray-600">
                        Send Money to <br /> Anyone
                    </div>
                </div>

                {/* Table Container with Scroll */}
                <div className="mt-4 max-h-4/5 overflow-y-auto border border-gray-300 rounded-md">
                    <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
                        <thead className="sticky top-0">
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Account Name</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Account Number</th>
                                <th className="border border-gray-300 px-2 md:px-4 py-2">Send Money</th>
                            </tr>
                        </thead>
                        {users.length===0 ?
                        <tr>
                        <td colSpan={3} className="text-center py-4">
                            No users found
                        </td>
                    </tr>:<tbody>
                            {users.map((user: { name: string; accountNumber: string }, index) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{user.accountNumber}</td>
                                    <td className="border border-gray-300 px-4 py-2 flex justify-center">
                                        <button
                                            onClick={() => setOpenSendMoneyModel({state: true, accountNumber: user.accountNumber})}
                                            className="bg-black hover:bg-gray-700 text-white font-semibold py-1 px-2 md:px-4 md:py-2 rounded-lg"

                                        >
                                            Send Money
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>}
                    </table>
                </div>
            </div>
        </div>
    );
}
