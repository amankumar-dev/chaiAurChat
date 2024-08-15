import React, { useRef } from "react";
import './details.css';
import profilePicture from '../../../Img/defaultUser.png';
import sharePhoto from '../../../Img/download.png';
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function Detail({showDetail,setShowDetail}){
    const {currentUser,colorStore}=useUserStore();
    const {chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock}=useChatStore();
    const mainHolder=useRef();

    function handleClose(){
        mainHolder.current.style.display="none";
        setShowDetail(!showDetail);
    }

    async function handleBlock(){
        if(!user) return;

        const userDocRef=doc(db,"users",currentUser.id)

        try {
            await updateDoc(userDocRef,{
                blocked:isReceiverBlocked?arrayRemove(user.id):arrayUnion(user.id),
            });
            changeBlock()
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <div className="main-detail-container" ref={mainHolder}>
            <div className="info-card-holder">
                <div className="info-card-img-holder">
                    <img src={user?.avatar||profilePicture} className="info-card-img"/>
                </div>
                <p className="info-card-name" style={{color:colorStore.textCol}}>{user?.username}</p>
                <p className="text-white info-card-name-desc" style={{color:colorStore.textCol}}>Created by Aman Kumar</p>
            </div>

            

            {/* user-block */}
            <div className="block-holder">
                <button className="block-btn text-white" onClick={handleBlock}>
                    {isCurrentUserBlocked?"You are Blocked!":isReceiverBlocked?"User Blocked":"Block User"}
                </button>
                <button className="block-btn close-btn text-white" onClick={handleClose}>
                    Close
                </button>
            </div>
        </div>
    )
}