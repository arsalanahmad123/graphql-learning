import {Routes,Route} from "react-router-dom"
import Header from "./components/Header.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Transaction from "./pages/Transaction.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx"
function App() {
    const authUser = true;
    return (
        <div className="flex flex-col">
            {authUser && <Header />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/transaction/:id" element={<Transaction />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}
export default App;
