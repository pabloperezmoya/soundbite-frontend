import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

import "./styles.css";

function PlayerButtons(props){
  return (
    <div className="player-buttons-container">
      {props.prevDisabled || props.loading
        ? <button className="player-button prev inactive" disabled><SkipPreviousIcon/></button>
        : <button className="player-button prev" onClick={props.prevOnClick}><SkipPreviousIcon/></button>
      }

      {props.loading
        ? <button className="player-button toggle--loading">Loading...</button>
        : <button 
            className={`player-button toggle ${props.isPlaying? "pause" : "play" }`}
            onClick={props.toggleOnClick}
            >{props.isPlaying?  <PauseIcon/> : <PlayArrowIcon/>}</button>
      }


      {props.nextDisabled || props.loading
        ? <button className="player-button next inactive" disabled><SkipNextIcon/></button>
        : <button className="player-button next" onClick={props.nextOnClick}><SkipNextIcon/></button>
      }
    </div>
  )
}

export { PlayerButtons };