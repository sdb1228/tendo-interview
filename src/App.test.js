import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as patientData from './api/patientData.json';
import * as surveyQuestionsdata from './api/surveyQuestions.json';
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

test('renders app Header', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <App patient={patientData.default} surveyQuestions={surveyQuestionsdata.default} />
    </QueryClientProvider>
  );

  const header = screen.getByText("Tendo's 4/2/2021 Visit");

  expect(header).toBeInTheDocument();
});

test('renders clicking a rating renders the next question', () => {
  render(
    <QueryClientProvider client={queryClient}>
      <App patient={patientData.default} surveyQuestions={surveyQuestionsdata.default} />
    </QueryClientProvider>
  );
  const question = screen.getByText("Hi Tendo, on a scale of 1-10, would you recommend Dr Adam to a friend or family member? 1 = Would not recommend, 10 = Would strongly recommend");
  expect(question).toBeInTheDocument();

  fireEvent(
    screen.getByText('10'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  const question2 = screen.getByText("Thank you. You were diagnosed with Diabetes without complications. Did Dr Adam explain how to manage this diagnosis in a way you could understand?");
  expect(question2).toBeInTheDocument();
});

test('Clicking a rating write answer to local storage', () => {
  jest.spyOn(window.localStorage.__proto__, 'setItem');
  window.localStorage.__proto__.setItem = jest.fn();
  render(
    <QueryClientProvider client={queryClient}>
      <App patient={patientData.default} surveyQuestions={surveyQuestionsdata.default} />
    </QueryClientProvider>
  );

  fireEvent(
    screen.getByText('10'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )

  expect(localStorage.setItem).toHaveBeenCalled();
});


test('Submitting form shows final results', async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <App patient={patientData.default} surveyQuestions={surveyQuestionsdata.default} />
    </QueryClientProvider>
  );

  fireEvent(
    screen.getByText('3'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
  fireEvent(
    screen.getByText('8'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
  fireEvent(
    screen.getByText('7'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
  fireEvent(
    screen.getByText('Submit'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  )
  var mock = new MockAdapter(axios);
  const data = { response: true };
  mock.onPost('/post').reply(200, data);

  await waitFor(() => {
    const answer1 = screen.getByText("3");
    const answer2 = screen.getByText("8");
    const answer3 = screen.getByText("7");
    expect(answer1).toBeInTheDocument();
    expect(answer2).toBeInTheDocument();
    expect(answer3).toBeInTheDocument();
  });
});