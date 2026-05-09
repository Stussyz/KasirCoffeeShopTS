import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CashierPage from "./pages/CashierPage";
import TransactionsHistoryPage from "./pages/TransactionHistoryPage";

function App() {
  return (
    <BrowserRouter>
    <MainLayout>
      <Routes>
        <Route path="/" element={<CashierPage />} />
        <Route path="/transactions" element={<TransactionsHistoryPage/>} />
      </Routes>
    </MainLayout>
    </BrowserRouter>
  );
}

export default App;