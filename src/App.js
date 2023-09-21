import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const initialState = {
  questions: [],

  // loading , error , ready , active , finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  timer: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      }
    case "start":
      return {
        ...state,
        status: "active",
        timer: state.questions.length * 25,
      }
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1 , answer: null};
    case "finish":
      return {...state, status: "finished" , highscore: state.points > state.highscore ? state.points : state.highscore};
    case "restart":
      return {...initialState, questions: state.questions , status: "ready"};
    case "tick":
      return {...state, timer: state.timer -1, status: state.timer === 0 ? "finished" : state.status, }
    default:
      throw new Error("Action unkonwn");
  }
}
function App() {
  const [{ questions, status, index, answer ,points , highscore , timer}, dispatch] = useReducer(reducer, initialState);
  const numQustions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0)
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((response) => response.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);


  return (
    <div className="app">
      <Header />

      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen dispatch={dispatch} numQustions={numQustions} />}
        {status === 'active' && (
          <>
          <Progress numQustions={numQustions} index={index} points={points} maxPoints={maxPoints} answer={answer}/>
            <Question question={questions[index]}
              dispatch={dispatch} answer={answer}
            />
            <Footer>
              <Timer timer={timer} dispatch={dispatch}/>
              <NextButton dispatch={dispatch} answer={answer} numQustions={numQustions} index={index}/>
            </Footer>
          </>
        )}

        {status === "finished" && (<FinishScreen points={points} maxPoints={maxPoints} highscore={highscore} dispatch={dispatch}/>)}

      </Main>

    </div>
  );
}

export default App;
