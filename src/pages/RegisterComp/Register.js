import React, { useRef, useState } from 'react';
import './register.css';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../lib/upload';
import Loading from '../Loading/Loading';
import { useUserStore } from '../../lib/userStore';

export default function Register() {
    const [showPass, setShowPass] = useState(false);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);

    const {setLog} = useUserStore();
    
    
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    })

    const handleFile = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const formData = new FormData(e.target);

        const { username, email, password } = Object.fromEntries(formData);
        console.log(username, email, password)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const imgUrl = await upload(avatar.file)

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: []
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            toast.success('Bs bhai login kr le ab !!!')


        }
        catch (error) {
            toast.error(error.message)
        }
        finally {
            setLoading(false);
            setFileName('');
        }

    }
    return (
        <>
            {loading ? (<Loading/>) :
                (<div className="flex min-h-full flex-1 flex-col justify-center px-10 py-5 lg:px-8" >

                    <div className=" sm:mx-auto sm:w-full sm:max-w-sm px-5 py-5 border rounded-md reg-holder">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-white">
                                Chai & Chat
                            </h2 >
                            <p className="text-center text-sm text-gray-200">
                                Register
                            </p>
                        </div >

                        <form className="space-y-6 mt-5" onSubmit={handleSubmit}>

                            {/* For username */}
                            <div>
                                <label htmlFor="reg-name" className="block text-sm font-medium leading-6 text-white">
                                    Display Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="reg-name"
                                        name="username"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2 bg-[rgba(0,0,0,0.62)] text-white"
                                    />
                                </div>
                            </div>

                            {/* For Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        className="text-white block w-full bg-[rgba(0,0,0,0.62)] rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                    />
                                </div>
                            </div>

                            {/* For Password */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-white">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <p className="font-semibold text-indigo-400 hover:text-indigo-500 hover:cursor-pointer" onClick={() => { setShowPass(!showPass) }}>
                                            {showPass ? 'Hide Password' : 'Show Password'}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPass ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        className="text-white bg-[rgba(0,0,0,0.62)] block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                    />
                                </div>
                            </div>

                            {/* For DP */}
                            <div style={{ maxWidth: 'max-content' }}>
                                <label htmlFor="file" className="text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer flex items-center gap-2 ">
                                    <i class="fa-solid fa-image text-2xl text-indigo-500"></i>
                                    <span className=' text-center text-white' >{fileName ? fileName : 'Add an Avatar'}</span>
                                </label>
                                <div className="mt-2 hidden">
                                    <input
                                        onChange={(e) => { setFileName(e.target.files[0].name); handleFile(e) }}
                                        id="file"
                                        name="file"
                                        type="file"
                                        className="block w-full rounded-md border-0 py-1.5  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </form>

                        <p className="mt-5 text-center text-sm text-white">
                            Already a member?{' '}
                            <span onClick={()=>{setLog(true)}}  className="font-semibold leading-6 text-indigo-300 hover:text-indigo-600 font-black hover:cursor-pointer ">
                                Login
                            </span>
                        </p>
                    </div >
                </div >
                )
            }
        </>
    )
}
