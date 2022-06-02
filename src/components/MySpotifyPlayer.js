import {WebPlaybackSDK} from 'react-spotify-web-playback-sdk';
import PlaySong from './PlaySong';
import PauseResume from './PauseResume';
import {useCallback} from 'react'

const MySpotifyPlayer = (props) => {
    const getOAuthToken = useCallback(callback => callback(props.token), []);
    return (
        <WebPlaybackSDK
            deviceName = "SongGuesr"
            getOAuthToken = {getOAuthToken}
            volume = {0}
            connectOnInitialized={true}
            >
            <PlaySong token={props.token} uri={props.uri} showPlayButton={props.showPlayButton} setShowPlayButton={props.setShowPlayButton}/>
            <PauseResume />
        </WebPlaybackSDK>
    )
}

export default MySpotifyPlayer;