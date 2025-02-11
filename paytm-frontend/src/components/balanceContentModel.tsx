import { useRef, useState } from "react";
import { CrossIcon } from "./icons";
import { BackendUrl } from "../config";
import axios from "axios";
interface BalanceContentModelProps {
    open: boolean,
    onClose: () => void
}
export function BalanceContentModel({ open, onClose }: BalanceContentModelProps) {
    const passwordRef = useRef<HTMLInputElement>(null)
    const [balance, setBalance] = useState<number|null>(null)
    async function submit() {
        const password = passwordRef.current?.value;
        if (!password) {
            alert("Enter the password")
        }
        try {
            const response = await axios.get(`${BackendUrl}/api/v1/balance`, {
                headers: {
                    token: localStorage.getItem("Token"),
                },
                params: { password }, 
            });
            setBalance(response.data.balance);
        }
        catch (e) {
            console.log(e)
        }
    }
    return (
        open && <div className=" flex justify-center items-center  fixed inset-0 z-50 ">
            <div className="fixed inset-0 bg-gray-400 opacity-60" onClick={onClose}></div>
            <div className="w-72 h-32 border-1 opacity-100 z-50 bg-white ">
                <span onClick={onClose} className="flex justify-end cursor-pointer">
                    <CrossIcon />
                </span> 
                <div className="px-4">
                    <span className="font-semibold">
                        Password:
                    </span>
                    <div className="border-1 bg-gray-200 px-2 mt-2 items-center">
                        <input className="w-full" ref={passwordRef} type="text" placeholder="Enter your password" />
                    </div>
                    <div className="flex justify-center pt-1  items-center">
                        <button className="bg-gray-800 text-white cursor-pointer mt-2 rounded-lg px-2 py-1" onClick={submit}>Submit</button>
                    </div>
                    {balance!==null && (<div className="flex justify-center pt-1  items-center">
                        <span className="font-semibold">Balance:</span>
                        <span className="font-semibold">₹{balance}</span>
                    </div>)}
                </div>
            </div>
        </div>
    )
}