import React, { useState } from "react";
import './searchAdd.css';
import profilePicture from '../../../../Img/pp.png';
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useUserStore } from "../../../../lib/userStore";


export default function SearchAdd({setShowAdd,showAdd}) {
    const [user,setUser]=useState(null);
    const {currentUser}=useUserStore()
    async function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");

            const q = query(userRef, where("username", "==", username));

            const querySnapShot= await getDocs(q);

            if(!querySnapShot.empty){
                setUser(querySnapShot.docs[0].data())
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleAdd() {
        const chatRef=collection(db,"chats");
        const userChatsRef=collection (db,"userchats");

        try {
            const newChatRef=doc(chatRef);
            await setDoc (newChatRef,{
                createdAt:serverTimestamp(),
                messages:[],
            });

            await updateDoc(doc(userChatsRef,user.id),{
                chats:arrayUnion({
                    chatId:newChatRef.id,
                    lastMessage:"",
                    receiverId:currentUser.id,
                    updatedAt:Date.now(),
                }),
            });

            await updateDoc(doc(userChatsRef,currentUser.id),{
                chats:arrayUnion({
                    chatId:newChatRef.id,
                    lastMessage:"",
                    receiverId:user.id,
                    updatedAt:Date.now(),
                }),
            });

            
        } catch (error) {
            console.log(error);
        }

        setShowAdd(!showAdd);
        
    }


    return (
        <div className="add-container">
            <form className="input-add-holder" onSubmit={handleSearch} >
                <input className="input-add" placeholder="Username" name="username" />
                <button className="input-btn">
                    Send
                </button>
            </form>
            {user && <div className="profile-add-holder">
                <div className="dp-name-add">
                    <div className="dp-holder-add">
                        <img className="dp-add" src={user.avatar || profilePicture} />
                    </div>
                    <p className="name-add">{user.username}</p>
                </div>
                <button className="add-user-btn" onClick={handleAdd} >Add User</button>
            </div>}
        </div>
    )
}