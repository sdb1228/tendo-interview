import React from "react"

function ProgressBar({ progress }) {
    return (
        <div className="progressBarContainer">
            <div className="progressBar" style={{ width: `${progress}%` }} />
        </div>
    )
}

export default ProgressBar
