// import React, { useEffect, useState } from "react";
// import './asideSearch.css';
// import profilePicture from '../../../Img/pp.png';
// import SearchAdd from "./SearchAdd/SearchAdd";

// export default function AsideSearch() {
//     const [showAdd, setShowAdd] = useState(true);

//     return (
//         <div className="asideSearch">
//             <div className="aside-search-container">
//                 <div className="aside-search-holder">
//                     <i className="fa-solid fa-magnifying-glass text-white"></i>
//                     <input className="text-white aside-search-input" type="text" placeholder="Find a user..." />
//                 </div>
//                 <div className="add-icon" onClick={()=>{setShowAdd(!showAdd)}}>
//                     {showAdd ? <i className="fa-solid fa-plus text-white"></i> : <i className="fa-solid fa-minus text-white"></i>}
//                 </div>
//             </div>
//             {showAdd?null:(<SearchAdd setShowAdd={setShowAdd} showAdd={showAdd} />)}
//             {/* <div className="asideSearch-chat">
//                 <div className="chat-holderr">
//                     <div className="chat-holder-dp">
//                         <img className="chat-dp img" src={profilePicture} />
//                     </div>
//                     <div className="chat-holder-info">
//                         <p className="name-chat text-white">Tyler</p>
//                     </div>
//                 </div>
//             </div> */}
//         </div>
//     )
// }