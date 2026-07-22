import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/Layout";
import GetQuote from "./pages/GetQuote";

const Home = lazy(() => import("./pages/Home"));
const ProjectsIndex = lazy(() => import("./components/Projectsindex"));
const ProjectDetail = lazy(() => import("./components/Projectdetail"));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F1ED]">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/k.png"
          alt="Kayvion Labs"
          className="w-14 h-14 animate-pulse"
        />
        <p className="text-gray-700">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<ProjectsIndex />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="/get-a-quote" element={<GetQuote />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}