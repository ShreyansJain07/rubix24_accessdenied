import React, { useEffect, useState, createContext } from "react";
import "./App.css";
import RootLayout from "./layouts/RootLayout";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./components/SignUp";
import BrowseTalent from "./screens/BrowseTalent";
import ResumeBuilder from "./screens/ResumeBuilder";
import Blog from "./components/Blog";
import SpeechtoText from "./components/SpeechtoText";
import AppContext from "./AppContext";
import questionsArray from "./constants/questionsArray";
import VirtualAssistant from "./screens/VirtualAssistant";
import Dashboard from "./screens/Dashboard";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AiCourse from "./screens/AiCourse";
import Navbar from "./components/Navbar";
import AiVideo from "./screens/AiVideo";


export const UserContext = createContext(null);

function App() {
  let [questions, setQuestions] = useState([]);
  let [answers, setAnswers] = useState([]);
  let [questionAnswer, setQuestionAnswer] = useState({});
  let [questionCompleted, setQuestionCompleted] = useState(false);

  const auth = getAuth();
  const [user, setUser] = useState(null);
  console.log(user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", authUser.uid);

        try {
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            setUser(userDocSnapshot.data());
          } else {
            console.error("User data not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    setQuestions(questionsArray);
    setQuestionAnswer(questionsArray[0]);
  }, []);

  let handleChangeInput = (e) => {
    setQuestionAnswer({
      ...questionAnswer,
      answer: e.target.value,
    });
  };

  let nextQuestion = (e) => {
    e.preventDefault();
    questions.map((question) => {
      if (question.resumeFieldId == questionAnswer.resumeFieldId) {
        setAnswers([
          ...answers,
          { ...question, answer: questionAnswer.answer },
        ]);
      }
    });

    questions.map((qa, index) => {
      if (index <= questions.length) {
        if (qa.resumeFieldId === questionAnswer.resumeFieldId) {
          setQuestionAnswer(questions[index + 1]);
        }
      } else {
        setQuestionCompleted(true);
      }
    });
  };
  return (
    <>
      <AppContext.Provider
        value={{
          state: {
            questionAnswer,
            questionCompleted,
            questions,
            answers,
          },
          function: {
            handleChangeInput: handleChangeInput,
            nextQuestion: nextQuestion,
          },
        }}
      >
        <UserContext.Provider value={user}>
          <div className="App">
            <Navbar />
            <div style={{}}>
              <Routes>
                <Route path="/" element={<RootLayout />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/browse" element={<BrowseTalent />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/virtualassistant"
                  element={<VirtualAssistant />}
                />
                <Route path="/resumebuilder" element={<ResumeBuilder />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/speech" element={<SpeechtoText />} />
                <Route path="/aicourse" element={<AiCourse />} />
                <Route path="/aivideo" element={<AiVideo />} />
              </Routes>
            </div>
          </div>
        </UserContext.Provider>
      </AppContext.Provider>
    </>
  );
}

export default App;
