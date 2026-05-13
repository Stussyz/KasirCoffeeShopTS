import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CashierPage from "./pages/CashierPage";
import TransactionsHistoryPage from "./pages/TransactionHistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CashierPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TransactionsHistoryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <MainLayout>
              <NotFoundPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;