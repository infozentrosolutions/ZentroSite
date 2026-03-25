import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/common/Home';
import Programs from './pages/common/Programs';
import About from './pages/common/About';
import Services from './pages/common/Services';
import Projects from './pages/common/Projects';
import Contact from './pages/common/Contact';
import Quiz from './pages/common/Quiz';
import NotFound from './pages/common/NotFound';

import Login from './pages/auth/Login';

import StudentDashboard from './pages/student/StudentDashboard';
import SuperDashboard from './pages/dashboard/SuperDashboard';

import PageTransition from './components/PageTransition';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
    <Navbar />
    <main className="flex-grow">
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
    <Footer />
  </div>
);

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />

      <main className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Zentro Solutions</h1>
          <div className="w-10"></div>
        </div>

        <div className="p-4 md:p-8">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<Login />} />
          <Route path="/login/teacher" element={<Login />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="student" element={<StudentDashboard />} />
          <Route path="teacher" element={<SuperDashboard />} />
          <Route path="admin" element={<SuperDashboard />} />
        </Route>

        {/* 404 Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
