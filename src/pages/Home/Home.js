import React, { useState, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react'
import './home.css'
import profilePicture from '../../Img/defaultUser.png'
// import AsideSearch from "./AsideSearch/AsideSearch";
import AsideChat from "./AsideChat/AsideChat";
import MainChat from "./MainChat/MainChat";
import Detail from "./Details/Details";
import { useUserStore } from "../../lib/userStore";
import { auth, db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import upload from "../../lib/upload";

export default function Home() {
    const [emojiShow, setEmojiShow] = useState(false);
    const [text, setText] = useState('');
    const [showNav, setShowNav] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showAside, setShowAside] = useState(true);
    const [showMain,setShowMain]=useState(false);
    const [img, setImg] = useState({
        file: null,
        url: "",
    })

    const { currentUser, colorStore } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

    function handleEmoji(e) {
        setText(prev => prev + " " + e.emoji);
    }

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    async function enterSent(e) {
        if (e.key == 'Enter' && text !== '') {
            handleSend();
        }
    }

    function handleBack(e) {
        e.stopPropagation();
        setShowAside(true);
        setShowMain(false);
    }

    const handleSend = async () => {
        if (text === "") return;

        let imgUrl = null;

        try {

            if (img.file) {
                imgUrl = await upload(img.file)
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            })

            const userIds = [currentUser.id, user.id];

            userIds.forEach(async (id) => {


                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updateAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,

                    })
                }

            })
        } catch (error) {
            console.log(error)
        }

        setImg({
            file: null,
            url: ""
        })

        setText('');

        
    }

    return (
        <div className="main-aside-holder" style={{ backgroundColor: colorStore.bgCol }}>
            {showDetail ? (
                <div className="details-container show-detail-container">
                    <Detail showDetail={showDetail} setShowDetail={setShowDetail} />
                </div>
            ) : showAside && (
                <aside className="asideBar">
                    <div className="aside-nav">
                        <div className="aside-nav-profile">
                            <div className="dp-holder">
                                <img className="img" src={currentUser.avatar || profilePicture} />
                            </div>
                            <p className="aside-user-name" style={{ color: colorStore.textCol }}>{currentUser.username}</p>
                        </div>
                    </div>

                    {/* aside-chat-bar */}
                    <AsideChat showNav={showNav} setShowNav={setShowNav} setShowAside={setShowAside} setShowMain={setShowMain} />
                </aside>
            )}

            {/* Main */}
            {/* //////////////////////////// */}
            {chatId && showNav && showMain && !showDetail && (
                <div className="main-detail-both">
                    <div className="main">
                        <div className="main-nav" onClick={() => { setShowDetail(true) }} >
                            <div className="chat-holder-nav">
                                <i class="fa-solid fa-arrow-left back-nav" style={{ color: colorStore.textCol }} onClick={(e) => { handleBack(e) }} ></i>
                                <div className="chat-holder-dpp">
                                    <img className="chat-dp img" src={user?.avatar || profilePicture} />
                                </div>
                                <div className="chat-holder-info">
                                    <p className="name-chat-nav " style={{ color: colorStore.textCol }}>{user?.username}</p>
                                </div>
                            </div>
                            <button className="main-nav-btn text-white" onClick={() => auth.signOut()} >Logout</button>
                        </div>

                        {/* Main Chat Holder */}
                        
                        <MainChat imgMsg={img.url} />

                        <div className="main-input-holder" >
                            <input type="text" placeholder={isCurrentUserBlocked ? "User Blocked You..." : isReceiverBlocked ? "You Blocked User..." : "Enter Text here..."} className="msg-input text-white" value={text} onChange={(e) => { setText(e.target.value); }} onKeyDown={(e) => { enterSent(e) }} disabled={isCurrentUserBlocked || isReceiverBlocked} style={{ backgroundColor: colorStore.secBgCol }} />
                            <div className="inner-main-input">
                                <div className="emoji-container">

                                    <i className="fa-solid fa-face-laugh-beam  hover:cursor-pointer hover:text-gray-200 text-white emoji" onClick={() => { setEmojiShow(!emojiShow) }} style={{ color: colorStore.textCol }}>
                                    </i>


                                    <div className="emoji-holder">
                                        {emojiShow && <EmojiPicker onEmojiClick={handleEmoji} style={{ width: '200px', height: '400px' }} />}
                                    </div>
                                </div>

                                <label htmlFor="file" className="text-sm font-medium leading-6 text-gray-900 hover:cursor-pointer flex items-center gap-2 ">
                                    <i className="fa-solid fa-paperclip emoji  hover:text-gray-500" style={{ color: colorStore.textCol }}></i>
                                </label>

                                <div className="mt-2 hidden">
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        onChange={handleImg}
                                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                                    />
                                </div>

                                <button className="send-btn text-white" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked} >Send</button>
                            </div>
                        </div>

                    </div>


                </div>
            )}

            {/* ///////////////////// */}
        </div>

    )
}