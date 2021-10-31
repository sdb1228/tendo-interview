import React from "react"

function FormSubmitted({ progress }) {
    return (
        <div className="progressBarContainer">
            <div className="progressBar" style={{ width: `${progress}%` }} />
        </div>
    )
}

export default FormSubmitted
