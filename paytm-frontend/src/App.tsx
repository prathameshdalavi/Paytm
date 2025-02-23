import { Dashboard } from "./pages/dashboard";
import { Signin } from "./pages/signin";
import { Signup } from "./pages/signup";
import { BrowserRouter,Routes,Route } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/SignIn" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/"element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  )
}