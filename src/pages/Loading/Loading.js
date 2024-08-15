import React from "react";
import './loading.css';

export default function Loading() {
    return (
        <div className='loading-container' >
            <div className="loader"></div>
            <p className='load-text'>Loading...</p>
        </div>
    )
}