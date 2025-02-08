import { useRef, useState } from "react";
import { CrossIcon } from "./icons";
import { BackendUrl } from "../config";
import axios from "axios";
interface TransactionContentModelProps {
    open: boolean;
    onClose: () => void;
}
export function TransactionContentModel({ open, onClose }: TransactionContentModelProps) {
    const passwordRef = useRef<HTMLInputElement>(null)
    const amountRef = useRef<HTMLInputElement>(null)
    const AccNumRef = useRef<HTMLInputElement>(null)
    async function submit() {
        const password = passwordRef.current?.value;
        const amount = amountRef.current?.value;
        const AccNum = AccNumRef.current?.value;
        if (!password) {
            alert("Enter the password")
        }
        try {
             await axios.post(`${BackendUrl}/api/v1/balance`, {
                headers: {
                    token: localStorage.getItem("Token"),
                },
                params: { password }, 
                data:{
                    amount:amount,
                    to:"1234567890"
                }
            });
            onClose()
        }
        catch (e) {
            console.log(e)
        }
    }
    return (
        open && <div className=" flex justify-center items-center  fixed inset-0 z-50 ">
            <div className="fixed inset-0 bg-gray-200 opacity-60" onClick={onClose}></div>
            <div className="w-96 h-54 border-1 opacity-100 z-50 bg-slate-200 ">
                <span onClick={onClose} className="flex justify-end cursor-pointer">
                    <CrossIcon />
                </span> 
                <div className="px-4">
                    <div>
                        <span className="font-semibold">
                            Amount:
                        </span>
                        <div className="border-1 items-center">
                            <input ref={amountRef} type="text" placeholder="Enter Amount" />
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold">
                            Account Number:
                        </span>
                        <div className="border-1 items-center">
                            <input ref={AccNumRef} type="text" placeholder="Enter Account Number" />
                        </div>
                    </div>
                    <span className="font-semibold">
                        Password:
                    </span>
                    <div className="border-1 items-center">
                        <input ref={passwordRef} type="text" placeholder="Enter your password" />
                    </div>
                    <div className="flex justify-center pt-1  items-center">
                        <button className="bg-black text-white cursor-pointer rounded-lg px-2 py-1" onClick={submit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}