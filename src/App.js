import './App.css'
import Home from './pages/Home/Home.js';
import Login from './pages/Login/Login.js';
import Register from './pages/RegisterComp/Register.js';
import Notification from './pages/Notification/Notification.js';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase.js';
import { useUserStore } from './lib/userStore.js';
import Loading from './pages/Loading/Loading.js';
import { useChatStore } from './lib/chatStore.js';

function App() {
  const { currentUser, isLoading, fetchUserInfo,log } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    })

    return () => {
      unSub();
    };
  }, [fetchUserInfo])

  console.log(currentUser)

  if (isLoading) {
    return (
      <div className='app'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='app'>
      {currentUser ? (<Home/>) : (log?<Login/>:<Register/>)}
      <Notification />
    </div>
  );
}

export default App;
