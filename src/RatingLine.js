import React from "react"
import MoodBadIcon from '@mui/icons-material/MoodBad';
import MoodIcon from '@mui/icons-material/Mood';
const wordNumbers = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10 }

//For security sake we should make sure that the data is not manipulated when we pass it up the chain
function RatingLine({ onNumberClicked, selected }) {
  return (
    <div className="ratingLineContainer">
      <MoodBadIcon className="svg_icons" />
      {[...Array(10)].map((_, i) => {
        return <button
          onClick={(e) => onNumberClicked(wordNumbers[e.target.id])}
          key={i}
          id={Object.keys(wordNumbers)[i]}
          className={`numberCircle${selected === i + 1 ? ' selected' : ''}`}>
          {i + 1}
        </button>
      })}
      <MoodIcon className="svg_icons" />
    </div>
  )
}

export default RatingLine
