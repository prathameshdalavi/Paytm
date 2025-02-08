import { CrossIcon } from "./icons";
import axios from "axios";
import { useRef } from "react";
import { BackendUrl } from "../config";
interface AccountContentModelProps{
    open: boolean,
    onClose: () => void
}

export function AccountContentModel({open, onClose}: AccountContentModelProps){
    const passwordRef = useRef<HTMLInputElement>(null)
    async function submit() {
        const password = passwordRef.current?.value;
        if(!password){
            alert("Enter the password")
            return
        }
        try{
            console.log("1")    
            await axios.post(
                BackendUrl + "/api/v1/addAccount",
                { password: password }, // ✅ Correctly sending password in request body
                {
                    headers: {
                        token: localStorage.getItem("Token"), // ✅ Fix: Properly formatted token
                    },
                }
            );
            console.log("3")    
            onClose()
        }
        catch(e){
            console.log(e)
        }
        if(!open){
            onClose()
        }
    }
    return (
            open && <div className=" flex justify-center items-center  fixed inset-0 z-50 ">
                <div className="fixed inset-0 bg-gray-200 opacity-60" onClick={onClose}></div>
                <div className="w-72 h-28 border-1 opacity-100 z-50 bg-slate-200 ">
                    <span onClick={onClose} className="flex justify-end cursor-pointer">
                        <CrossIcon />
                    </span> 
                    <div className="px-4">
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