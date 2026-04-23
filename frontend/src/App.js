import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import AllVacationDealsPage from "./pages/AllVacationDealsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <main className="pt-20 lg:pt-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/deals" element={<AllVacationDealsPage/>} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
