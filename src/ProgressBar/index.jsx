import "./styles.css"

function ProgressBar(props){
  return (
    <div className="progressbar-container">
      <input
        type="range"
        value={props.rangeValue ? props.rangeValue : 0}
        onInput={props.onInput}
        onMouseDown={props.onMouseDownFunc}
        onMouseUp={props.onMouseUpFunc}
        className="progressbar-bar"
      />
    </div>
    
  )
}

export {ProgressBar};