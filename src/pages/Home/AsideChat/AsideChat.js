import React, { useState, useEffect } from "react";
import './asideChat.css';
import profilePicture from '../../../Img/defaultUser.png';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase.js";
import { useUserStore } from "../../../lib/userStore.js";
import { useChatStore } from "../../../lib/chatStore.js";
import SearchAdd from '../AsideSearch/SearchAdd/SearchAdd.js'

export default function AsideChat({ showNav, setShowNav,setShowAside,setShowMain }) {
    const [chats, setChats] = useState([]);
    const [showAdd, setShowAdd] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const { currentUser,colorStore } = useUserStore();
    const { chatId, changeChat } = useChatStore();

    useEffect(() => {
        if (!currentUser || !currentUser.id) return;

        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            console.log(currentUser.id)
            if (!res.exists()) {
                console.warn('No chat data found for the user.');
                setChats([]);
                return;
            }

            const items = await res.data()?.chats || [];
            console.log(items);
            const promises = items.map(async (item) => {
                console.log(item)
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                const user = userDocSnap.exists() ? userDocSnap.data() : null;
                return { ...item, user };
            });

            const chatData = await Promise.all(promises);
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => unSub();
    }, [currentUser]);

    const handleSelect = async (chat) => {

        setShowNav(true);
        setShowMain(true);
        setShowAside(false);

        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest
        })

        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            })
            changeChat(chat.chatId, chat.user);
        } catch (error) {
            console.log(error)
        }

    }

    const filteredChats=chats.filter((c)=>{
        return(
            c.user.username.toLowerCase().includes(searchInput.toLowerCase())
        )
    })

    return (
        <div className="asideSearch-chat">
            {/* aside-search */}
            <div className="asideSearch">
                <div className="aside-search-container">
                    <div className="aside-search-holder" style={{backgroundColor:colorStore.secBgCol}}>
                        <i className="fa-solid fa-magnifying-glass text-white"></i>
                        <input className="text-white aside-search-input" type="text" placeholder="Find a user..." onChange={(e)=>{setSearchInput(e.target.value)}}  />
                    </div>
                    <div className="add-icon" onClick={() => { setShowAdd(!showAdd) }} style={{backgroundColor:colorStore.secBgCol}}>
                        {showAdd ? <i className="fa-solid fa-plus text-white"></i> : <i className="fa-solid fa-minus text-white"></i>}
                    </div>
                </div>
                <div className="search-add-holder">
                {showAdd ? null : (<SearchAdd setShowAdd={setShowAdd} showAdd={showAdd} />)}
                </div>
                {/* <div className="asideSearch-chat">
                <div className="chat-holderr">
                    <div className="chat-holder-dp">
                        <img className="chat-dp img" src={profilePicture} />
                    </div>
                    <div className="chat-holder-info">
                        <p className="name-chat text-white">Tyler</p>
                    </div>
                </div>
                </div> */}
            </div>

            <div className="asideResChat-holder">
                {filteredChats.map((chat) => {
                    let lastMsg='';
                    if(chat.lastMessage.length>20){
                        lastMsg=chat.lastMessage.substring(0,20)
                        lastMsg+='...'
                    }else{
                        lastMsg=chat.lastMessage;
                    }
                    return (

                        <div className="chat-holder" onClick={() => handleSelect(chat)} key={chat.chatId} >
                            <div className="chat-holder-dp">
                                <img className="chat-dp img" src={chat.user.blocked.includes(currentUser.id) ? profilePicture : chat.user?.avatar || profilePicture} alt="Profile" />
                            </div>
                            <div className="chat-holder-info">
                                <p className="name-chat name-chat-temp " style={{color:colorStore.textCol}} >{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</p>
                                <p className="name-chat" style={{ color: chat?.isSeen ? colorStore.textCol : "skyblue", fontWeight: chat?.isSeen ? "400" : "800" }} >
                                    
                                    {lastMsg || 'No message'}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
