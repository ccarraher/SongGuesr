import React from 'react'
import { usePlaybackState, useSpotifyPlayer } from 'react-spotify-web-playback-sdk'

export default function PauseResume() {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState();

    if(player === null) return null;
    if(playbackState === null) return null;

    const checkPauseOrResume = () => {
        if(playbackState.paused) {
            player.resume();
        } else {
            player.pause();
        }
    }
    return (
        <div>
            <button onClick={checkPauseOrResume}>Pause/Resume</button>
        </div>
    )
}