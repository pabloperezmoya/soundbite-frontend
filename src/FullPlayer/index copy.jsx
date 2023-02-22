import React, {useState, useRef, useEffect} from 'react'
// import { AudioPlayer } from '../AudioPlayer'
import AudioPlayer from 'react-h5-audio-player';
import { PlayerButtons } from '../PlayerButtons'
import { ProgressBar } from '../ProgressBar'
import { TimesInfoStart, TimesInfoEnd, TextInfo } from '../PlayerInfo'

import ReactAudioPlayer from 'react-audio-player';

import "./styles.css"

function FullPlayer({
  executeCondition,
  playThis,
  setPlayThis,
  loading,
  setLoading,
  songs,
  updated,
  setUpdated,
  isPlaying,
  setIsPlaying,
}
) {


  const audioPlayer = useRef(null);

  // Estados
  const [currentRange, setCurrentRange] = useState(Number(0));

  
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    //console.log("On useEffect")
    if (audioPlayer.current) {
      //console.log(props.audioPlayer.current)
      
      isPlaying 
        ? audioPlayer.current.audioEl.current.play() 
        : audioPlayer.current.audioEl.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    // Si algo se esta reproduciendo y se actualiza songs, actualizar el indice de playThis
    if (isPlaying && playThis.index + 1 != songs.length && updated){
      setPlayThis(songs[playThis.index+1])
      setUpdated(false)
    }
  }, [songs])


  //console.log(playThis.index)
  if (executeCondition == false){
    return null
  }
  return (

    <div className="player-container">
      <AudioPlayer
        ref={audioPlayer}
        src={ !loading ? playThis?.url: ""}
      />

      {/* <ReactAudioPlayer 
        ref={audioPlayer}
        onCanPlayThrough={() => setDuration(Math.trunc(audioPlayer.current.audioEl.current.duration))}
        onCanPlay={()=> setLoading(false)}
        setDuration={setDuration}

        audioPlayer={audioPlayer}
        //src={streamUrl+"songs/"+songs}
        src={ !loading ? playThis?.url: ""}
        onPause={() => {setIsPlaying(false)}}
        onPlay={() => {setIsPlaying(true)}}
        //controls
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        
        loading={loading}
        setLoading={setLoading}
        onAbort={() => setCurrentRange(0)}
        onEnded={() => {
          playThis?.index + 1 != songs.length 
          ? setPlayThis(songs[playThis?.index + 1])
          : ''
          
        }}
        listenInterval={10}
        autoPlay
        onListen={(e) => {
          setCurrentRange(e*100/duration); 
          //setCurrentSeconds(Math.trunc(e))
      }}
      /> */}
      <div className="top-items">
        {/* <TimesInfoStart audioPlayer={audioPlayer}/> */}

        { !loading && (
          <ProgressBar
            className="progressbar-bar"
            rangeValue={currentRange}
            onInput={(e) => {  
              const inputValue = Math.trunc(e.target.value)
              audioPlayer.current.audioEl.current.currentTime = inputValue * duration /100
              const value = audioPlayer.current.audioEl.current.currentTime * 100/ duration
              setCurrentRange(Math.trunc(value))
            }}
            
            onMouseDownFunc={()=>{
              audioPlayer.current.audioEl.current.pause()
              audioPlayer.current.audioEl.current.muted = true
            }}
            onMouseUpFunc={()=>{
              audioPlayer.current.audioEl.current.play()
              audioPlayer.current.audioEl.current.muted = false
            }}
          />
        )}
        <TimesInfoEnd duration={duration}/>

      </div>

      <div className="bottom-items">
        { !loading && (
          
          <PlayerButtons
            loading={loading} // Implement loading state
            prevDisabled={playThis?.index - 1 == -1} // condicion para deshabilitar el boton
            
            prevOnClick={() => setPlayThis(songs[playThis.index - 1])}
            nextOnClick={() => setPlayThis(songs[playThis.index + 1])}          
            nextDisabled={playThis?.index + 1 == songs.length} // condicion para deshabilitar el boton
            
            isPlaying={isPlaying}
            toggleOnClick={() => setIsPlaying(prev => !prev)}
          />
          
        )}

        { !loading && (
            <TextInfo
              title={playThis?.title}
            />
        )}

      </div>
    </div>
    
  )

}

export {FullPlayer}