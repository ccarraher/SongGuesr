import logo from './logo.svg';
import {useCallback, useEffect, useState, useSyncExternalStore} from 'react'
import './App.css';
import MySpotifyPlayer from './components/MySpotifyPlayer';

function App() {
  const [token, setToken] = useState("");
  const [artistName, setArtistName] = useState("");
  const [songName, setSongName] = useState("");
  const [userSongGuess, setUserSongGuess] = useState("");
  const [userArtistGuess, setUserArtistGuess] = useState("");
  const [correctAnswerBool, setCorrectAnswerBool] = useState(false);
  const [error, setError] = useState("");
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [uri, setUri] = useState("");
  const searchQueries = ['%25a%25', 'a%25', '%25e%25', 'e%25', '%25i%25', 'i%25', '%25o%25', 'o%25'];
  const [showPlayButton, setShowPlayButton] = useState(true);


  const CLIENT_ID = "fffd7015b02444a58c329b8776c3610e"; // insert your client id here from spotify
  const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
  const REDIRECT_URL_AFTER_LOGIN = "http://localhost:3000/";
  const SPACE_DELIMITER = "%20";
  const SCOPES = [
    "user-read-currently-playing",
    "user-read-playback-state",
    "user-modify-playback-state",
    "app-remote-control",
    "streaming",
    "user-read-email",
    "user-read-private"
  ] ;
  const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

  const getReturnedParamsFromSpotifyAuth = (hash) => {
    const stringAfterHashtag = hash.substring(1);
    const paramsInUrl = stringAfterHashtag.split("&");
    const paramsSplitUp = paramsInUrl.reduce((accumulater, currentValue) => {
      console.log(currentValue);
      const [key, value] = currentValue.split("=");
      accumulater[key] = value;
      return accumulater;
    }, {});

    return paramsSplitUp;
  }


  useEffect(() => {
    if(window.location.hash) {
      const { access_token, expires_in, token_type} = getReturnedParamsFromSpotifyAuth(window.location.hash);

      localStorage.clear();
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("tokenType", token_type);
      localStorage.setItem("expiresIn", expires_in);
      setToken(access_token);
      window.location.hash = "";
      fetchNewURI(access_token);
    }
  }, [])


  const handleLogin = () => {
    window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL_AFTER_LOGIN}&scope=${SCOPES_URL_PARAM}&response_type=token&show_dialog=true`;
  };

  const checkCorrectAnswer = () => {
    if(artistName.localeCompare(userArtistGuess, 'en', { sensitivity: 'base' }) === 0 && (songName.localeCompare(userSongGuess, 'en', {sensitivity: 'base'}) === 0) || songName === userSongGuess + ' ') {
      fetchNewURI(token);
      setUserArtistGuess("");
      setUserSongGuess("");
      setScore(score + 1);
    } else {
      setLives(lives - 1);
      if(lives - 1 < 1) {
        console.log("Game Over!");
      }
    }
  }

  const fetchNewURI = (access_token) => {
    let searchQueryIndex = getRandomInt(8);
    let offset = getRandomInt(1000);
    let searchQueryOffset = getRandomInt(50);
    

    fetch(
        `https://api.spotify.com/v1/search?q=${searchQueries[searchQueryIndex]}&type=track&limit=50&market=US&offset=${offset}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
            },
        },
    )
    .then(response => response.status === 404 ? fetchNewURI(token) : response.json())
    .then(data => {
      if(data.tracks != null) {
        if(data.tracks.items[searchQueryOffset].uri === null) {
          //setError("Please refresh and try again!");
          fetchNewURI(token);
        } else {
          setUri(data.tracks.items[searchQueryOffset].uri)
        }

        let string = data.tracks.items[searchQueryOffset].name;
        let strippedPDString = string.split('(')[0].split('-');
        if(strippedPDString.length > 1) {
          let strippedString = strippedPDString[0].split(' ');
          setSongName(strippedString[0]);
          console.log(strippedString[0]);
        } else {
          setSongName(strippedPDString[0]);
          console.log(strippedPDString[0]);
        }
        setArtistName(data.tracks.items[searchQueryOffset].artists[0].name);
        console.log(data.tracks.items[searchQueryOffset].artists[0].name);

      }
    })
    .catch((error) => {
      console.log(error);
      setError(error);
      fetchNewURI(token);
    })
  }

  const getRandomInt = (max) => {
      return Math.floor(Math.random() * max);
  }

  return (
    <div className="App">
      <h1>Welcome to SongGuesr :)</h1>
      {token
        ? <>
            <MySpotifyPlayer token={token} uri={uri} showPlayButton={showPlayButton} setShowPlayButton={setShowPlayButton}/>
            {!showPlayButton && <>
              <input type="text" value={userSongGuess} onChange={(e) => setUserSongGuess(e.target.value)}></input>
              <span> by </span> 
              <input type="text" value={userArtistGuess} onChange={(e) => setUserArtistGuess(e.target.value)} ></input>
              <button onClick={checkCorrectAnswer}>
                Submit Answer
              </button>
              <div>Score: {score}</div>
              <div>Lives: {lives}</div>
              </>
            }

            {error && <>
              <div>An error occurred, please refresh and try again.</div>
            </>
            }
          </>
        : <button onClick={handleLogin}>Login With Spotify</button>
      }
    </div>
  );
}

export default App;
