import {Routes,Route, Navigate} from "react-router-dom"
import Header from "./components/Header.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Transaction from "./pages/Transaction.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx"

import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "./graphql/queries/user.query.js";

import { Toaster } from "react-hot-toast";

function App() {
    const {loading,data} = useQuery(CURRENT_USER);
    if(loading) return <p>Loading...</p>
    return (
        <>
        <Toaster />
        <div className="flex flex-col">
            {data?.authUser && <Header />}
            <Routes>
                <Route path="/" element={data?.authUser ?<HomePage /> : <Navigate to="/login" />} />
                <Route path="/login" element={!data?.authUser ? <Login /> : <Navigate to="/" />} />
                <Route path="/signup" element={!data?.authUser ?  <SignUp /> : <Navigate to="/" />} />
                <Route path="/transaction/:id" element={data?.authUser ? <Transaction /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
        </>
    );
}
export default App;
