import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Calculator, ArrowRight, Check, Percent, Calendar, DollarSign } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { Link } from "react-router-dom"

const plans = [
  {
    term: 36,
    rate: 3.9,
    label: "36 Months",
    popular: false,
  },
  {
    term: 48,
    rate: 4.5,
    label: "48 Months",
    popular: true,
  },
  {
    term: 60,
    rate: 5.2,
    label: "60 Months",
    popular: false,
  },
  {
    term: 72,
    rate: 6.0,
    label: "72 Months",
    popular: false,
  },
]

export default function Financing() {
  const [vehiclePrice, setVehiclePrice] = useState(25000)
  const [downPayment, setDownPayment] = useState(5000)
  const [selectedTerm, setSelectedTerm] = useState(plans[1])

  const calculatePayment = useMemo(() => {
    const principal = vehiclePrice - downPayment
    const monthlyRate = selectedTerm.rate / 100 / 12
    const numPayments = selectedTerm.term
    const payment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    return {
      monthly: payment || 0,
      totalInterest: payment * numPayments - principal || 0,
      totalCost: payment * numPayments + downPayment || 0,
    }
  }, [vehiclePrice, downPayment, selectedTerm])

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Financing"
            title="Flexible Financing Options"
            description="Drive your dream car with confidence. We offer competitive rates and personalized payment plans tailored to your financial goals."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass rounded-xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Calculator size={28} className="text-neon-500" />
                <h3 className="text-2xl font-bold text-white">Payment Calculator</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center justify-between text-sm text-dark-200 mb-3">
                    <span>Vehicle Price</span>
                    <span className="text-white font-semibold">${vehiclePrice.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={1000}
                    max={150000}
                    step={1000}
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                  />
                  <div className="flex justify-between text-xs text-dark-300 mt-1">
                    <span>$1k</span>
                    <span>$150k</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm text-dark-200 mb-3">
                    <span>Down Payment</span>
                    <span className="text-white font-semibold">${downPayment.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={vehiclePrice * 0.5}
                    step={500}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                  />
                  <div className="flex justify-between text-xs text-dark-300 mt-1">
                    <span>$0</span>
                    <span>${(vehiclePrice * 0.5).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-dark-200 mb-3">Loan Term</label>
                  <div className="grid grid-cols-4 gap-3">
                    {plans.map((plan) => (
                      <button
                        key={plan.term}
                        onClick={() => setSelectedTerm(plan)}
                        className={`relative px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          selectedTerm.term === plan.term
                            ? "bg-neon-500/20 border-neon-500 text-neon-500 border"
                            : "bg-dark-700/80 border-neon-500/10 text-dark-200 border hover:border-neon-500/30"
                        }`}
                      >
                        <span className="block">{plan.term}mo</span>
                        <span className="block text-xs mt-0.5 opacity-70">{plan.rate}%</span>
                        {plan.popular && (
                          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[9px] font-bold bg-neon-500 text-dark-900 rounded-full">
                            POP
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-dark-700/50 rounded-xl border border-neon-500/10">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-dark-200 text-xs uppercase tracking-wider mb-1">Monthly</p>
                    <p className="text-neon-500 text-2xl font-bold">
                      ${isFinite(calculatePayment.monthly) ? Math.round(calculatePayment.monthly).toLocaleString() : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-200 text-xs uppercase tracking-wider mb-1">Interest</p>
                    <p className="text-white text-xl font-bold">
                      ${isFinite(calculatePayment.totalInterest) ? Math.round(calculatePayment.totalInterest).toLocaleString() : 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-200 text-xs uppercase tracking-wider mb-1">Total</p>
                    <p className="text-white text-xl font-bold">
                      ${isFinite(calculatePayment.totalCost) ? Math.round(calculatePayment.totalCost).toLocaleString() : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Why Finance With Us?</h3>
            <div className="space-y-4 mb-10">
              {[
                { icon: Percent, title: "Competitive Rates", desc: "We leverage our network of premier lenders to secure the best possible rates for qualified buyers." },
                { icon: Calendar, title: "Flexible Terms", desc: "Choose from 24 to 84-month terms with options for balloon payments and seasonal payment plans." },
                { icon: DollarSign, title: "Quick Approval", desc: "Our streamlined application process delivers approvals within 24 hours, often same-day." },
              ].map((item, i) => (
                <div key={i} className="glass-card rounded-xl p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0">
                    <item.icon size={22} className="text-neon-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <p className="text-dark-200 text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-xl p-8">
              <h4 className="text-white font-bold text-lg mb-4">Included Benefits</h4>
              <ul className="space-y-3">
                {[
                  "GAP insurance included",
                  "Extended warranty options",
                  "Rate lock protection (60 days)",
                  "No prepayment penalties",
                  "Trade-in equity applied immediately",
                  "Complimentary vehicle delivery",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark-200 text-sm">
                    <Check size={16} className="text-neon-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)]"
              >
                Apply Now
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
