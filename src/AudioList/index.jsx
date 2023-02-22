import React, { useEffect, useState } from "react";

import {deleteAudio, updateAudio, createShare} from '../API/audiosApi';
import {TimesInfoEnd} from '../PlayerInfo';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


import "./styles.css";

function AudioList({
  executeCondition,
  songs,
  setSongs,
  loading,
  setPlayThis,
  playThis,
  setFetchAudios,
  isPlaying,

  // REQUIRE TOKEN
  // MUST STOP PLAYING SONG
}){
  const url = "http://127.0.0.1:8000"
  
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editSelected, setEditSelected] = useState(null);
  const [input, setInput] = useState('');
  const [disable, setDisabled] = useState(false);
  const [notDisabled, setNotDisabled] = useState(false);
  
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState('');
  const [info, setInfo] = useState("");

  const handleToggle = (itemId) => {
    setSongs((prevItems) => {
      return prevItems.map((item) => {
        if (item.index === itemId) {
          return { ...item, toggle: !item.toggle };
        }
        return item;
      });
    });
    setDisabled(prev =>  !prev);
    setNotDisabled(itemId)
  };


  useEffect(() => { // Actualiza el titulo de la cancion cuando se cambie o termine la cancion
    if (playThis.index != selected) {      
      setSelected(playThis.index)
    }
  }, [playThis])

  if (executeCondition == false){
    return null
  }
  
  return (
    <div id="audios">
      
      <div className="audio-info-container">
        { error && <p className="audio-info">{errorInfo}</p>}
        { info.length > 0 && <p className="audio-info">{info}</p>}
      </div>
      <div className="audio-items-container">
        { !loading && songs.map((song) => (
          <div className={ selected == song.index ? "audio-item selected": "audio-item not-selected"} key={song.index}>
            <div className="audio-item-play">
              <button 
                onClick={() => {setPlayThis(song); setSelected(song.index)}}
                className={selected == song.index ? "play-btn": "play-btn"}
                ><PlayCircleIcon fontSize="large"/></button>
            </div>
            
            <div className="audio-item-title">
              { (editSelected == song.index) 
                ? <input type="text" value={input} onChange={e=>setInput(e.target.value)}/>
                : <p>{song.title}</p>
              }
            </div>
            <div className="shared_by">
              <p className="shared_status">{song?.shared_by? "Shared": ""}</p>
            </div>

            <div className="audio-item-duration">
              <p>{`${Math.floor(song.duration / 60)}:${(song.duration % 60) < 10 ? '0' : ''}${Math.floor(song.duration % 60)}`}</p>
            </div>

            <div className="audio-item-dropdown">
              <button 
                disabled={notDisabled != song.index && disable}
                className="dropbtn" 
                onClick={()=> {handleToggle(song.index); setEditSelected(null); setError(false); setErrorInfo(""); setInfo('')} }
                >{song.toggle ? <CancelIcon/> : <MoreHorizIcon/>}</button>

              {song.toggle && (
                <div className="dropdown-content">
                  
                  { (editing == false)
                    ? <button 
                        onClick={() => {
                          setInput(song.title) // Setea el input con el titulo actual
                          setNotDisabled(null) // Deshabilita todos los botones
                          setEditing(true) // Activa el modo edicion
                          setEditSelected(song.index) // Setea el id del item que se esta editando
                        }}
                        className="dropdown-button edit-btn"
                        ><EditIcon/></button> 

                    : <button 
                        onClick={() => {
                          // Cuando el usuario hace click en guardar
                          if (input != '') {
                            // Checkea si el input es diferente al titulo actual
                            updateAudio(song.user_id, song.audio_id, input) // Llamada a la api
                            .catch(err => console.log(err))
                            song.title = input
                          }
                          setEditing(false)
                          setEditSelected(null)
                          setNotDisabled(prev=> prev)
                          handleToggle(song.index)
                        }}
                        className="dropdown-button save-btn"
                        ><CheckIcon/></button>
                  }

                  <button 
                    onClick={() => {
                      // Si el item que quiere eliminares el que se esta reproduciendo
                      if (playThis.audio_id == song.audio_id) {
                        setError(true)
                        setErrorInfo("No puedes eliminar un audio que se esta reproduciendo")
                      }else{ // Sino lo elimina
                        deleteAudio(song.user_id, song.audio_id)
                        setSongs(songs.filter((item) => item.index !== song.index))
                        setDisabled(prev =>  !prev)
                      }
                    }}
                    className="dropdown-button delete-btn"
                    ><DeleteIcon/></button>
                  <button 
                    
                    onClick={() => {
                      console.log("Creating share link");
                      console.log("audio_id", song.audio_id)
                      console.log("user_id", song.user_id)

                      createShare(song.audio_id, song.user_id)
                      .then(res => {
                        navigator.clipboard.writeText(window.location.href + `share/${res.data._id}`)
                      }
                        )
                      .catch(err => console.log(err))
                      setInfo("Link copied to clipboard")
                    }}
                    className="dropdown-button share-btn"
                    ><ShareIcon/></button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}

export { AudioList };