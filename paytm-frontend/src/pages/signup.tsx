import { useRef } from "react"
import { BackendUrl } from "../config"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export function Signup() {
    const navigate=useNavigate()
    const emailRef=useRef<HTMLInputElement>(null)
    const passwordRef=useRef<HTMLInputElement>(null)
    const firstNameRef=useRef<HTMLInputElement>(null)
    const lastNameRef=useRef<HTMLInputElement>(null)
    async function signUp(){
        const email=emailRef.current?.value
        const password=passwordRef.current?.value
        const firstName=firstNameRef.current?.value
        const lastName=lastNameRef.current?.value
        try{
            await axios.post(BackendUrl+"/api/v1/signUp",{
                email:email,
                password:password,
                firstName:firstName,
                lastName:lastName
            })

            navigate("/signin");
            alert("Signed Up Successfully")
        }
        catch(e){
            console.log(e)
        }
    }
    return <div className=" bg-slate-200 h-screen items-center flex justify-center w-screen">
        <div className=" bg-white p-4 w-105 h-125 rounded-lg border-1 shadow-lg ">
            <div className="text-3xl font-bold justify-center flex pt-5">
                Sign Up
            </div >
            <div className="text-lg  justify-center flex pt-6 text-gray-600">
                Enter Your creditials to access your account
            </div>
            <div className="flex flex-col gap-3 text-md">
                <div className="font-semibold pt-4">
                    Email
                </div>
                <input ref={emailRef} className="border-1 border-gray-400 rounded-md items-center p-1" type="text" placeholder="Enter your email" />
                <div className="font-semibold">
                    Password
                </div>
                <input ref={passwordRef} className="border-1 border-gray-400 rounded-md items-center p-1" type="text" placeholder="Enter your password" />
                <div className="flex gap-2">
                    <div>
                        <span className="font-semibold">
                        First Name
                        </span>
                        <input type="text" ref={firstNameRef} className="border-1 border-gray-400 rounded-md items-center p-1" placeholder="Enter your first name" />
                    </div>
                    <div>
                        <span className="font-semibold">
                        Last Name
                        </span>
                        <input type="text" ref={lastNameRef} className="border-1 border-gray-400 rounded-md items-center p-1" placeholder="Enter your last name" />
                    </div>
                </div>
                <div className="mt-6">
                <button className=" text-white w-full p-2 cursor-pointer rounded-md bg-black flex items-center justify-center" onClick={signUp} >Sign Up</button>
                </div>
            </div>
            <div className="pt-4 flex justify-center">
                Already have an account?<a className="text-blue-600" href="/signin">Sign In</a>
            </div>

        </div>


    </div>
}