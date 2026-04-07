import { useState} from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Main from "./Main";


export default function Dashboard() {

  const [step, setStep] = useState("idle"); 
  const [formData, setFormData] = useState({ skill: "", domain: "", level: "" });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col font-sans text-[#1C1C1C]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Main
          step={step} setStep={setStep}
          formData={formData} setFormData={setFormData}
          questions={questions} setQuestions={setQuestions}
          answers={answers} setAnswers={setAnswers}
          results={results} setResults={setResults}
          timeLeft={timeLeft} setTimeLeft={setTimeLeft}
        />
      </div>
      <Footer />
    </div>
  );
}
