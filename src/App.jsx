import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HRDashboard from "./pages/HRDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobDescription from "./pages/JobDescription";
import ApplicationPage from "./pages/ApplicationPage";
import SubmitionPage from "./pages/SubmitionPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
       <Route path="/login" element={<Login />} />
       <Route path="/signup" element={<Signup />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/job-seeker" element={<JobSeekerDashboard />} />
        <Route path="/job-description" element={<JobDescription />} />
        <Route path="/application" element={<ApplicationPage />} />
        <Route path="/submission" element={<SubmitionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;