import { useEffect, useState } from "react";
import { BalanceContentModel } from "../components/balanceContentModel";
import { AccountContentModel } from "../components/accountContentModel";
import { BackendUrl } from "../config";
import axios from "axios";
import { TransactionContentModel } from "../components/transationContentModel";
import { PaytmIcon } from "../components/icons";
export function Dashboard() {
    const [openBalanceModel, setOpenBalanceModel] = useState(false)
    const [openAccountModel, setOpenAccountModel] = useState(false)
    const [openSendMoneyModel, setOpenSendMoneyModel] = useState(false)
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BackendUrl}/api/v1/users`, {
                    headers: {
                        token: localStorage.getItem("Token") // Ensure token is always a string
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
        <div className=" w-screen bg-blue-50 h-screen">
            <div className="flex items-center border-1  border-gray-100  bg-gray-300  rounded-sm justify-around">     
                <div className="" >
                    <PaytmIcon />
                </div>
                <div>
                    <AccountContentModel open={openAccountModel} onClose={() => setOpenAccountModel(false)} />
                    <button className="bg-blue-400 cursor-pointer text-white font-semibold py-2 px-4 rounded-2xl" onClick={() => setOpenAccountModel(true)}>Add Account</button>
                </div>
                <div >
                    <BalanceContentModel open={openBalanceModel} onClose={() => setOpenBalanceModel(false)} />
                    <button className="bg-blue-400 cursor-pointer text-white font-semibold py-2 px-4 rounded-2xl" onClick={() => setOpenBalanceModel(true)}>check balance</button>
                </div>
                <div>
                    <button className="bg-blue-400 cursor-pointer text-white font-semibold py-2 px-4 rounded-2xl">Transation History</button>
                </div>
            </div>
            <div>
                <TransactionContentModel open={openSendMoneyModel} onClose={() => setOpenSendMoneyModel(false)} />
            </div>
            <div className="p-4">
            <div className="flex items-center  mt-15 gap-2">
                <img className="w-20 h-13 rounded-3xl border-1 border-gray-300" src="https://assetscdn1.paytm.com/images/catalog/view/308023/1615956941865.png" alt=""></img>
                <div className="text-md font-bold text-gray-600 ">
                    sendMoney to <br /> anyone
                </div>
            </div>
            <table className="w-full border-collapse mt-8 border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2">Account Name</th>
                        <th className="border border-gray-300 px-4 py-2">Account Number</th>
                        <th className="border border-gray-300 px-4 py-2 ">Send Money</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{user.accountNumber}</td>
                            <td className="border border-gray-300 px-4 py-2 flex justify-center">
                                <button onClick={() => setOpenSendMoneyModel(true)} className="bg-black hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg">Send Money</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

        </div>
    )
}