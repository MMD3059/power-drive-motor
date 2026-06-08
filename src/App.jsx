import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ScrollToTop from "./components/ScrollToTop"
import BackgroundEffects from "./components/BackgroundEffects"
import { CarProvider } from "./contexts/CarContext"
import { LanguageProvider } from "./i18n/context"
import Home from "./pages/Home"
import Inventory from "./pages/Inventory"
import VehicleDetail from "./pages/VehicleDetail"

import About from "./pages/About"
import CreditApplication from "./pages/CreditApplication"
import Services from "./pages/Services"
import Contact from "./pages/Contact"
import Financing from "./pages/Financing"
import TradeIn from "./pages/TradeIn"
import TestDrive from "./pages/TestDrive"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"
import CookiePolicy from "./pages/CookiePolicy"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AdminIndex from "./pages/AdminIndex"
import AdminCars from "./pages/AdminCars"
import AdminMessages from "./pages/AdminMessages"
import AdminFBAutoposter from "./pages/AdminFBAutoposter"
import AdminServiceDetail from "./pages/AdminServiceDetail"
import AdminCustomers from "./pages/AdminCustomers"
import AdminSales from "./pages/AdminSales"
import AdminReports from "./pages/AdminReports"
import AdminCSVImport from "./pages/AdminCSVImport"
import AdminWhatsApp from "./pages/AdminWhatsApp"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/PDM-admin/login" element={<AdminLogin />} />
        <Route path="/PDM-admin" element={<AdminDashboard />}>
          <Route index element={<AdminIndex />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="services/fb-autoposter" element={<AdminFBAutoposter />} />
          <Route path="services/:service" element={<AdminServiceDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="csv-import" element={<AdminCSVImport />} />
          <Route path="whatsapp" element={<AdminWhatsApp />} />
        </Route>
        <Route path="*" element={<PublicLayout />} />
      </Routes>
    </Router>
  )
}

function PublicLayout() {
  return (
    <LanguageProvider>
      <CarProvider>
      <ScrollToTop />
      <BackgroundEffects />
      <Navbar />
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<VehicleDetail />} />

            <Route path="/about" element={<About />} />
            <Route path="/credit-application" element={<CreditApplication />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/trade-in" element={<TradeIn />} />
            <Route path="/test-drive" element={<TestDrive />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<CookiePolicy />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      </CarProvider>
    </LanguageProvider>
  )
}
