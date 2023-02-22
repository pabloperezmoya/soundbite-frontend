
import React, {useEffect, useState} from "react";
import axios from "axios";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import "./styles.css"

import {uploadAudio} from "../API/audiosApi";

function UploadSongs({
  executeCondition, 
  onUpload, 
  setOnUpload, 
  user_id, 
  setFetchAudios, 
  setPlayThis, 
  setUpdated
}){
  if (executeCondition == false){
    return null
  }

  const [selectedFile, setSelectedFile] = useState(null);
  const [audioName, setAudioName] = useState(null);
  const [error, setError] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [fileChecking, setFileChecking] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [audioDuration, setAudioDuration] = useState(null);


  if (!onUpload) {
    return(
      <div id="upload">
        <button onClick={() => setOnUpload(true)}>Upload</button>
      </div>
    )
  }

  const submitForm = (event) => {
    event.preventDefault();

    const dataArray = new FormData();

    // check name 
    if (!audioName) {
      const lastDotIndex = selectedFile.name.lastIndexOf(".");
      const nameWithoutExtension = selectedFile.name.slice(0, lastDotIndex);
      //console.log(nameWithoutExtension); // muestra "audio.file"
      dataArray.append("name", nameWithoutExtension);
    } else
    {
      dataArray.append("name", audioName);
    }
    
    
    dataArray.append("file", selectedFile);
    dataArray.append("duration", audioDuration);
    
    // check audio integrity
    setUploadLoading(true); // Loading: Show loading animation
    uploadAudio(user_id, dataArray)
      .then((data) => {
        setUploadLoading(false); // Loading: Hide loading animation
        console.log(data)
        setUploadSuccess(true);
        setFetchAudios(true);
        setUpdated(true);
        //setPlayThis(prev => prev.index + 1);
      })
      .catch((error) => {
        setUploadLoading(false); // Loading: Hide loading animation
        setError("Error al subir el archivo de audio.")
        console.error(error)
      })
    
  }

  const checkAudio = (event) => {
    setFileChecking(true); // Loading: Show loading animation
    setError(null);
    setSelectedFile(null);

    console.log("CHECKING AUDIO")
    const audio = new Audio();
    const file = event.target.files[0];
    const objectURL = URL.createObjectURL(file);
    audio.src = objectURL;
    audio.addEventListener('loadedmetadata', () => {
      console.log(audio.duration)
      setAudioDuration(audio.duration);
      setFileChecking(false); // Loading: Hide loading animation
      setSelectedFile(file);
      URL.revokeObjectURL(objectURL);
      console.log("Audio is valid")

    });
    audio.addEventListener('error', () => {
      setFileChecking(false); // Loading: Hide loading animation
      setError("El archivo de audio es inválido o está dañado.");
      URL.revokeObjectURL(objectURL);
      console.error('El archivo de audio es inválido o está dañado.');
    });
  }



  return (
    <>
      <div id="upload-selected">
        <h2 className="upload-title">Upload your audios</h2>

        <button 
          className="cancel-upload-btn"
          onClick={() => {setOnUpload(false); setFileChecking(false); setError(null); setSelectedFile(null); setAudioName(null); setUploadSuccess(false); setUploadLoading(null)}}>Cancel</button>
        
        <div className="upload-info">
          {fileChecking && <p>Checking audio...</p>}
          {error && <p>{error}</p>}
          {uploadLoading ? <p>Uploading...</p> : ""}
          {uploadSuccess && <p>Upload success!</p>}

        </div>
  
        {/* <form className="form-upload"> */}
          {/* <input type="file" accept="audio/*" onChange={event => setSelectedFile(event.target.files[0])}/> */}
        <label className="label-select-file">
          <input type="file" accept="audio/*" onChange={checkAudio} id="selected-file"/>
          <AttachFileIcon/>
          <span className="label-select-file-text">Select file</span>
        </label>
        
        
        <input className="input-file-rename" disabled={!selectedFile} placeholder={ !!selectedFile ? selectedFile.name :  "Audio rename"} type="text" name="Name" onChange={e=>setAudioName(e.target.value)} />
        {/* <button className="upload-btn" disabled={(error || selectedFile == null ? true: false)} type="submit">Upload</button> */}
        <button className="upload-btn" disabled={(error || selectedFile == null ? true: false)} type="button" onClick={(e)=>submitForm(e)}>Upload 🚀</button>
        {/* </form> */}
      </div>
    </>
  )
}


export { UploadSongs };