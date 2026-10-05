import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import MedicineDetail from "./pages/MedicineDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/medicine/:index" element={<MedicineDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
