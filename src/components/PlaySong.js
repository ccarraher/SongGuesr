import React, {useEffect, useState} from 'react'
import {usePlayerDevice } from 'react-spotify-web-playback-sdk'

export default function PlaySong(props) {
    const device = usePlayerDevice();

    const playSong = () => {
        if(device === null) return;
        fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`, {
                method: "PUT",
                body: JSON.stringify({uris: [props.uri]}),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${props.token}`
                },
            },
        )
        .catch(error => {
            console.log(error);
            playSong();
        })
        props.setShowPlayButton(false);
    }
    
    useEffect(() => {
        if(props.uri != null && props.token != null) {
            playSong();
        }
    }, [props.uri])
    
    
    if(device === null) return null;

    return (
        <div>
            {props.showPlayButton ?
                <button onClick={playSong}>Play</button> : <span></span>
            }
        </div>
    )
}