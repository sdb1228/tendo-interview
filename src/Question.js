import React from "react"
import RatingLine from './RatingLine';
import { Typography } from '@mui/material';

function Question({ question, onNumberClicked, selected, patient, doctor, diagnosis }) {
  return (
    <div>
      <Typography variant="h4" component="div" gutterBottom>{question.title.replace("[Patient First Name]", patient).replace("[Doctor Last Name]", doctor).replace("[Diagnosis]", diagnosis)}</Typography>
      <RatingLine onNumberClicked={onNumberClicked} selected={selected} />
    </div>
  )
}

export default Question
