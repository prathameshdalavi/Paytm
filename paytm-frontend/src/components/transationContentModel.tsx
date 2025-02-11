import { useRef, useEffect } from "react";
import { CrossIcon } from "./icons";
import { BackendUrl } from "../config";
import axios from "axios";
interface TransactionContentModelProps {
    open: { state: boolean, accountNumber: string };
    onClose: () => void;
}
export function TransactionContentModel({ open, onClose }: TransactionContentModelProps) {
    const passwordRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const accountNumberRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (accountNumberRef.current) {
            accountNumberRef.current.value = open.accountNumber;
        }
    }, [open.accountNumber]);

    async function submit() {
        const password = passwordRef.current?.value;
        const amount = amountRef.current?.value;
        const accountNumber = accountNumberRef.current?.value;

        if (!password || !amount || !accountNumber) {
            alert("All fields are required");
            return;
        }

        try {
            await axios.post(
                `${BackendUrl}/api/v1/transaction`,
                {
                    amount: Number(amount),
                    to: accountNumber,
                    password: password
                },
                {
                    headers: {
                        token: localStorage.getItem("Token"),
                    },
                }
            );
            onClose();
        } catch (e) {
            console.error("Transaction failed:", e);
            alert("Transaction failed");
        }
    }

    return (
        open.state && <div className=" flex justify-center items-center  fixed inset-0 z-50 ">
            <div className="fixed inset-0 bg-gray-400 opacity-60" onClick={onClose}></div>
            <div className="w-96 h-56 border-1 opacity-100 z-50 bg-white ">
                <span onClick={onClose} className="flex justify-end cursor-pointer">
                    <CrossIcon />
                </span>
                <div className="px-4">
                    <div>
                        <span className="font-semibold">
                            Amount:
                        </span>
                        <div className="border-1 mt-1 bg-gray-200 items-center">
                            <input className="w-full" ref={amountRef} type="text" placeholder="Enter Amount" />
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold  ">
                            Account Number:
                        </span>
                        <div className="border-1 mt-1  bg-gray-200 items-center ">
                            <input className="w-full" type="text" placeholder="Enter Account Number" ref={accountNumberRef} />
                        </div>
                    </div>
                    <span className="font-semibold ">
                        Password:
                    </span>
                    <div className="border-1 mt-1 bg-gray-200 items-center">
                        <input className="w-full" ref={passwordRef} type="text" placeholder="Enter your password" />
                    </div>
                    <div className="flex justify-center mt-0.5 pt-1  items-center">
                        <button className="bg-gray-800 text-white cursor-pointer rounded-lg px-2 py-1" onClick={submit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}