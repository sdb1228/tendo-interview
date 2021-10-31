import './App.css';
import { Typography } from '@mui/material';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useMutation, } from 'react-query';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from '@mui/material';
import axios from 'axios';
import Question from './Question';
import ProgressBar from './ProgressBar';

function App(props) {
  const [answers, setAnswers] = React.useState(JSON.parse(localStorage.getItem(props.patient.id)) || {});
  const [question, setQuestion] = React.useState(parseInt(JSON.parse(localStorage.getItem(props.patient.id + "selectedQuestion"))) || 0);
  const patient = props.patient.entry[0].resource.name[0].given[0];
  const doctor = props.patient.entry[1].resource.name[0].given[0];
  const diagnosis = props.patient.entry[3].resource.code.coding[0].name;
  const formSubmit = useMutation(questionAnswers => {
    return axios.post('/post', questionAnswers)
  })

  if (question === props.surveyQuestions.questions.length && Object.keys(answers).length === props.surveyQuestions.questions.length) {
    if (formSubmit.isError) {
      return (<div>Error</div>);
    }
    if (formSubmit.isLoading) {
      return (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      );
    }
    return (
      <div className="App">
        <Typography variant="h1" component="div" gutterBottom>Thank You!</Typography>
        <Typography variant="h2" component="div" gutterBottom>Thanks again! Here’s what we heard:</Typography>
        {Object.keys(answers).map((key) => {
          return (
            <span key={key}>
              <Typography variant="h6" component="div" gutterBottom>
                {props.surveyQuestions.questions.find((question) => question.id === key).title.replace("[Patient First Name]", patient).replace("[Doctor Last Name]", doctor).replace("[Diagnosis]", diagnosis)}
              </Typography>
              <Typography variant="h6" component="div" gutterBottom>
                {answers[key]}
              </Typography>
            </span>

          )
        })}
      </div>
    )
  }

  return (
    <>
      <CssBaseline />
      <ProgressBar progress={(question / props.surveyQuestions.questions.length) * 100} />
      <div className="App">
        <Typography variant="h1" component="div" gutterBottom>{props.patient.entry[0].resource.name[0].given[0]}'s {new Date(props.patient.timestamp).toLocaleDateString()} Visit</Typography>
        <div className="mainContent">
          <div className="mainContentContainer">
            <IconButton disabled={question === 0} onClick={() => {
              setQuestion(question - 1)
            }}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Question
              selected={answers[props.surveyQuestions.questions[question].id]}
              question={props.surveyQuestions.questions[question]}
              patient={patient}
              doctor={doctor}
              diagnosis={diagnosis}
              onNumberClicked={(rating) => {
                const newAnswers = { ...answers, [props.surveyQuestions.questions[question].id]: rating };
                localStorage.setItem(props.patient.id, JSON.stringify(newAnswers));
                localStorage.setItem(props.patient.id + "selectedQuestion", question.toString());
                setAnswers(newAnswers);
                if (question !== props.surveyQuestions.questions.length - 1) {
                  setQuestion(question + 1)
                }
              }} />
            <IconButton disabled={question === props.surveyQuestions.questions.length - 1} onClick={() => setQuestion(question + 1)}>
              <ArrowForwardIosIcon />
            </IconButton>
          </div>
          {Object.keys(answers).length === props.surveyQuestions.questions.length && (
            <div className="submitButton">
              <Button onClick={() => {
                localStorage.setItem(props.patient.id + "selectedQuestion", (props.surveyQuestions.questions.length).toString());
                setQuestion(props.surveyQuestions.questions.length)
                formSubmit.mutate(answers);
              }} size="large" variant="contained">
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App;
