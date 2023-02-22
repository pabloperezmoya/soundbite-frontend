
import "./styles.css"

function TimesInfoStart({audioPlayer}){
  if (!audioPlayer.current) return null // This is to prevent the error of accessing the audioEl before it is mounted
  let seconds = Math.trunc(audioPlayer.current.audio.current.currentTime)
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return(
    <div className="player-times-container">
      <p>{`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`}</p>
    </div>
  )
}

function TimesInfoEnd({duration}){
  const minutes = Math.floor(duration / 60);
  const remainingSeconds = duration % 60;
  return(
    <div className="player-times-container">
      <p>{`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`}</p>
    </div>
  )
}


function TextInfo({title}){
  return (
    <div
      className={title?.length > 40 ? "player-text-container long" : "player-text-container"}
    >
      <p>{title}</p>
    </div>
  )
}

export {TextInfo, TimesInfoStart, TimesInfoEnd};