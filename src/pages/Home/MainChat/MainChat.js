import React, { useEffect, useRef, useState } from "react";
import './mainChat.css';
import profilePicture from '../../../Img/pp.png'
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";

export default function MainChat({ imgMsg }) {
    const [chat, setChat] = useState()

    const { chatId } = useChatStore();
    const {currentUser,colorStore} =useUserStore();

    const endRef = useRef(null)
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
    })

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        })

        return () => {
            unSub();
        }
    }, [chatId])


    function formatTime(timestamp) {
        const date = timestamp.toDate(); // Convert Firebase Timestamp to JS Date
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
    
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
    
        return `${formattedHours}:${formattedMinutes}`;
    }
    

    return (
        <div className="main-chat-holders">
            {chat?.messages?.map((message) => {
                console.log(message)
                let time=formatTime(message?.createdAt);
                return (
                    <div className={message.senderId===currentUser?.id?"own-chat":"own-chat frnd-chat"} key={message?.createdAt}>
                        <div className={message.senderId===currentUser?.id?"own-chat-holder":"frnd-chat-holder"}>
                            <span className={message.senderId===currentUser?.id?"own-chat-msg":"frnd-chat-msg"}>{message.text}</span>

                        </div>
                        {message.img && <div className="chat-img-msg-holder">
                            <img className="chat-img-msg" src={message.img} />
                        </div>}
                        <p className="time" style={{color:colorStore.textCol}}>{time}</p>


                    </div>
                )
            })}
            {imgMsg && (
                <div className="img-msg-holder-temp">
                    <div className="chat-img-msg-holder temp">
                        <img className="chat-img-msg" src={imgMsg} />
                    </div>
                </div>)}



            {/* <div className="own-chat frnd-chat">
                <div className="own-chat-holder frnd-chat-holder">
                    <div className="chat-img-holder">
                        <img className="chat-dp" src={profilePicture} />
                    </div>
                    <span className="frnd-chat-msg text-white">Hi I am Aman lkadsjf lsadjflsak fjalsjdflsajdflsajf salfjlsadjflaskjdflskadjfsladkjflskajdflsadfjlsakdjflsadjf  salfjalsk jflaskj flksaj flsa jflsak jfsal jflsa jflsak fjlsakd fjlska ;dflsak flsak dfjlkasd fjlksa dfjlsa jlskajd flksa jfsla flaskd fjlsak dfjlksajdf lkasdfls afdl;ksd fjlksd afjlksd jflk sadfjlk sadfjlks adfj fjlsakd fjlska ;dflsak flsak dfjlkasd fjlksa dfjlsa jlskajd flksa jfsla flaskd fjlsak dfjlksajdf lkasdfls afdl;ksd fjlksd afjlksd jflk sadfjlk sadfjlks adfjfjlsakd fjlska ;dflsak flsak dfjlkasd fjlksa dfjlsa jlskajd flksa jfsla flaskd fjlsak dfjlksajdf lkasdfls afdl;ksd fjlksd afjlksd jflk sadfjlk sadfjlks adfjfjlsakd fjlska ;dflsak flsak dfjlkasd fjlksa dfjlsa jlskajd flksa jfsla flaskd fjlsak dfjlksajdf lkasdfls afdl;ksd fjlksd afjlksd jflk sadfjlk sadfjlks adfjfjlsakd fjlska ;dflsak flsak dfjlkasd fjlksa dfjlsa jlskajd flksa jfsla flaskd fjlsak dfjlksajdf lkasdfls afdl;ksd fjlksd afjlksd jflk sadfjlk sadfjlks adfjfjlsakd fjlska ;dflsak flsak dfjlkasd fjlksa dfjlsa jlskajd flksa jfsla flaskd fjlsak dfjlksajdf lkasdfls afdl;ksd fjlksd afjlksd jflk sadfjlk sadfjlks adfj</span>
                </div>
                <p className="time frnd-time">Just now</p>
            </div>
             */}
            {/* for auto scroll */}
            <div ref={endRef}></div>
        </div>
    )
}


// store
{/* <div className="chat-img-holder">
                                <img className="chat-dp" src={profilePicture} />
                            </div> */}
