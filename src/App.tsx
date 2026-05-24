import { Routes, Route } from "react-router";
import ShellLayout from "@/components/ShellLayout";
import OverviewPage from "@/pages/OverviewPage";
import MarriagePage from "@/pages/MarriagePage";
import AbusePage from "@/pages/AbusePage";
import PovertyPage from "@/pages/PovertyPage";
import FacilitiesPage from "@/pages/FacilitiesPage";
import SentimentPage from "@/pages/SentimentPage";
import SourcesPage from "@/pages/SourcesPage";
import GlossaryPage from "@/pages/GlossaryPage";
import AdminPage from "@/pages/AdminPage";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

function DashboardWrapper({ children }: { children: React.ReactNode }) {
  return <ShellLayout>{children}</ShellLayout>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <DashboardWrapper>
            <OverviewPage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/marriage"
        element={
          <DashboardWrapper>
            <MarriagePage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/abuse"
        element={
          <DashboardWrapper>
            <AbusePage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/poverty"
        element={
          <DashboardWrapper>
            <PovertyPage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/facilities"
        element={
          <DashboardWrapper>
            <FacilitiesPage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/sentiment"
        element={
          <DashboardWrapper>
            <SentimentPage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/sources"
        element={
          <DashboardWrapper>
            <SourcesPage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/glossary"
        element={
          <DashboardWrapper>
            <GlossaryPage />
          </DashboardWrapper>
        }
      />
      <Route
        path="/admin"
        element={
          <DashboardWrapper>
            <AdminPage />
          </DashboardWrapper>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
