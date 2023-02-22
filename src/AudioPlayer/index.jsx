import ReactAudioPlayer from 'react-audio-player';


function AudioPlayer(props){


  return (
    <div className="audio-player-container">
      <ReactAudioPlayer
        ref={props.audioPlayer}
        {...props}
      />
    </div>
  )
}

export { AudioPlayer };