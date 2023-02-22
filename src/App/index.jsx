
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { FullPlayer } from "../FullPlayer";
import { AudioList } from "../AudioList";
import { UploadSongs } from "../UploadSongs";
import { LoginForm, RegisterForm } from "../UserForm";

import {getAllAudios} from "../API/audiosApi"

import "./styles.css";
import { ShareComponent } from "../ShareComponent";

function App(){
  const urlApi = "http://127.0.0.1:8000"

  const [songs, setSongs] = useState([]);
  
  const [logged, setLogged] = useState(false); // Working here
  const [userData, setUserData] = useState({}); // Working here
  // const [error, setError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [playThis, setPlayThis] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [onUpload, setOnUpload] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [searchSongs, setSearchSongs] = useState({});

  const [fetchAudios, setFetchAudios] = useState(true);
  const [waitingVerify, setWaitingVerify] = useState(false);


  useEffect(() => {
    try {
      setLoading(true)
      const storedUser = JSON.parse(localStorage.getItem('user_data'));
      if (storedUser) {
        setUserData(storedUser)
        setLogged(true)
        // verifyUser(storedUser.user_id, storedUser.token)
        // .then(res => {
        //   console.log("User verified", res)
        //   setUserData(res.data)
        //   setLogged(true)
        // })
        // .catch(err => {
        //   //console.log("User not verified0", err)
        //   setLogged(false)
        // }) 
      }
    } catch (error) {
      console.error('Error al leer el almacenamiento local', error);
      setLogged(false)
    }

    setLoading(false)
  }, []);

  const filterSongs = (search) => {
    if (search) {
      const filteredSongs = songs.filter((song) => {
        return song.title.toLowerCase().includes(search.toLowerCase());
      });
      setSearchSongs(filteredSongs);
      console.log(filteredSongs)
    }

    if (!search) {
      setSearchSongs({})
    }
  }


  const calculateDate = (date) => {
    const today = new Date()
    const dateArgs = new Date(date)

    if (today.getDate() == dateArgs.getDate() // Si es el mismo día
        && today.getMonth()+1 == dateArgs.getMonth()+1){// Y el mismo mes 
      // colocar solo hora
      return `${new Date(date).getHours()}:${new Date(date).getMinutes()}`
    }else{
      // Colocar dia-mes-año y hora
      return `${new Date(date).getHours()}:${new Date(date).getMinutes()} ${new Date(date).getDate()}-${new Date(date).getMonth()+1}-${new Date(date).getFullYear()} `
    }
  }

  useEffect(() => {
    if (logged && fetchAudios) {
      // Fetch songs
      console.log("Fetching songs")
      getAllAudios(userData.user_id)
        .then((data) => { 
          data.forEach((audio, index) => {
            data[index] = {
              index: index,
              user_id: audio.user_id,
              audio_id: audio._id,
              title: audio.name,
              duration: audio?.duration,
              uploaded_at: calculateDate(audio.uploaded_at),
              url: urlApi + audio.stream_url,
              shared_by: audio?.shared_by ? audio.shared_by : null,
              toggle: false,
              editing: false,
            }
          })

          setSongs(data)
        })
      setFetchAudios(false)
      setLoading(false)
  }}, [logged, fetchAudios])
  
  const [wantToRegister, setWantToRegister] = useState(false);
  const [shareUnmount, setShareUnmount] = useState(false);

  return (
    <BrowserRouter>
      <div className="blur1"></div>
      <div className="blur2"></div>
      <div className="blur3"></div>

      <div id="header">  
        <div className="header-container">
          <div className="title">
            <h2>SoundBite</h2>
          </div>
          {logged == false 
          ? (
              <div className="toggle-form-button-container">
                <button className="form-button" onClick={() => setWantToRegister(!wantToRegister)}>{wantToRegister ? "Login": "Register"}</button>
              </div>
          )
          : ''
          }

          {logged && (
            <>
              <div className="search-container">
                <div className="form-section search-input-container">
                  <input type="text" placeholder="Search" onChange={e=>filterSongs(e.target.value)}/>
                </div>
              </div>

              <div className="perfil">
                
                {/* <div className="user">
                  <span>
                  <PermIdentityIcon/>
                  <p>{userData? userData.name : ""}</p>
                  </span>
                </div> */}

                <div className="button-logout-container">
                  <button onClick={() => {
                    localStorage.removeItem('user_data');
                    setLogged(false);
                    setUserData({});
                    setSongs([]);
                    setFetchAudios(true); // TODO: Check if this is needed
                  }}>Logout</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {searchSongs.length > 0 && (
            <div id="main">
            <AudioList
                songs={searchSongs}
                setSongs={setSongs}
                loading={loading}
                setPlayThis={setPlayThis}
                playThis={playThis}
                setFetchAudios={setFetchAudios}
                isPlaying={isPlaying}
              />
          </div>
      )}

        {(logged == false && Object.keys(userData).length == 0) && (
          <div className="user-form-container">
            <RegisterForm
                // error={error}
                // setError={setError}
                executeCondition={wantToRegister == true}
                userData={userData}
                setUserData={setUserData}
                setLogged={setLogged}
                loading={loading}
                setLoading={setLoading}
                setWantToRegister={setWantToRegister}
              />
            
            <LoginForm
                // error={error}
                // setError={setError}
                executeCondition={wantToRegister == false}
                userData={userData}
                setUserData={setUserData}
                setLogged={setLogged}
                loading={loading}
                setLoading={setLoading}
            />
          </div>
        )}
    
        
        <div id="main">
            {/* Create componente for playlist-name */}
            {onUpload == false &&  (logged == true && Object.keys(userData).length != 0) && (
              <div id="playlist-name">
                <h2>My Playlist</h2>
              </div>
            )}
              
            
            {/* When onUpload is false only show the button for upload */}
            <UploadSongs
              executeCondition={onUpload == false && (logged == true && Object.keys(userData).length != 0) }
              onUpload={onUpload}
              setOnUpload={setOnUpload}
            />
            <AudioList
              executeCondition={onUpload == false && (logged == true && Object.keys(userData).length != 0)}
              songs={songs}
              setSongs={setSongs}
              loading={loading}
              setPlayThis={setPlayThis}
              playThis={playThis}
              setFetchAudios={setFetchAudios}
              isPlaying={isPlaying}
            />
            
            {/* When onUpload is TRUE show all the element */}
            <UploadSongs
            executeCondition={onUpload == true &&  (logged == true && Object.keys(userData).length != 0)}
            onUpload={onUpload}
            setOnUpload={setOnUpload}
            user_id={userData.user_id}
            urlApi={urlApi}
            setFetchAudios={setFetchAudios}
            setPlayThis={setPlayThis}
            setUpdated={setUpdated}
            />

            <div id="player">
              <FullPlayer
                executeCondition={(logged == true && Object.keys(userData).length != 0)}
                playThis={playThis}
                setPlayThis={setPlayThis}
                loading={loading}
                setLoading={setLoading}
                songs={songs}
                updated={updated}
                setUpdated={setUpdated}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>

        </div>
        <Routes>
        { (logged && shareUnmount==false && loading==false && fetchAudios==false) && (
          <Route 
            path="/share/:share_id" 
            element={
            <ShareComponent 
              user_id={userData?.user_id}  
              setFetchAudios={setFetchAudios}
          />}/>
        )}
      </Routes>
    </BrowserRouter>
  )
}



export default App;