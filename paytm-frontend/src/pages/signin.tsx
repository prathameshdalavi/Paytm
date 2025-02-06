import { useRef } from "react"
import { BackendUrl } from "../config"
import axios from "axios"
export function Signin() {
    const emailRef=useRef<HTMLInputElement>(null)
    const passwordRef=useRef<HTMLInputElement>(null)
    async function signIn(){
        const email=emailRef.current?.value
        const password=passwordRef.current?.value
        
        try{
            const response=await axios.post(BackendUrl+"/api/v1/signIn",{
                email:email,
                password:password
            })
            const jwtToken=response.data.token;
            localStorage.setItem("Token",jwtToken);
        }
        catch(e){
            console.log(e)
        }
    }
    return <div className=" bg-slate-200 h-screen items-center flex justify-center w-screen">
        <div className=" bg-white p-4 w-105 h-125 rounded-lg border-1 shadow-lg ">
            <div className="text-3xl font-bold justify-center flex pt-8">
                Sign In
            </div >
            <div className="text-lg  justify-center flex pt-8 text-gray-600">
                Enter Your creditials to access your account
            </div>
            <div className="flex flex-col gap-4 pt-4 text-md">
                <div className="font-semibold pt-4">
                    Email
                </div>
                <input ref={emailRef} className="border-1 border-gray-400 rounded-md items-center p-1" type="text" placeholder="Enter your email" />
                <div className="font-semibold">
                    Password
                </div>
                <input ref={passwordRef} className="border-1 border-gray-400 rounded-md items-center p-1" type="text" placeholder="Enter your password" />
                <div className=" mt-6">
                <button className="p-2 text-white cursor-pointer rounded-md bg-black flex items-center justify-center w-full" onClick={signIn} >Sign In</button>
                </div>
            </div>
            <div className="pt-4 flex justify-center">
                Don't have an account?<a className="text-blue-600" href="/signup">Sign Up</a>
            </div>

        </div>


    </div>
}