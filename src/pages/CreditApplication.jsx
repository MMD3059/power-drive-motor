import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Loader2, Send, Shield, Clock, DollarSign, Phone, Mail, MapPin, ArrowRight, Car, Calendar, Hash, Gauge } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { Link } from "react-router-dom"

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "SD",
  zip: "",
  dob: "",
  ssn: "",
  employStatus: "",
  employer: "",
  jobTitle: "",
  monthsEmployed: "",
  annualIncome: "",
  downPayment: "",
  loanTerm: "60",
  tradeYear: "",
  tradeMake: "",
  tradeModel: "",
  tradeMileage: "",
  tradeCondition: "Good",
  contactMethod: "Call",
  message: "",
  consent: false,
}

const states = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
]

export default function CreditApplication() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const API = import.meta.env.DEV ? "http://localhost:3001/api" : "/api"

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.consent) return
    setLoading(true)
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
        subject: "Credit Application",
        message: `
DOB: ${form.dob}
SSN: ${form.ssn}
Address: ${form.address}, ${form.city}, ${form.state} ${form.zip}
Employment: ${form.employStatus} - ${form.jobTitle} at ${form.employer} (${form.monthsEmployed}mo)
Annual Income: $${form.annualIncome}
Down Payment: $${form.downPayment}
Loan Term: ${form.loanTerm}mo
Trade-In: ${form.tradeYear} ${form.tradeMake} ${form.tradeModel} - ${form.tradeMileage}mi (${form.tradeCondition})
Contact Method: ${form.contactMethod}
Notes: ${form.message}
        `.trim(),
        type: "credit",
      }
      await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    } catch {}
    setSubmitted(true)
    setForm(initialForm)
    setLoading(false)
  }

  const isValid = form.firstName && form.lastName && form.email && form.phone && form.consent

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="Credit Application"
            title="Apply For Financing"
            description="Complete the form below and our finance team will get back to you within 24 hours with a personalized offer."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-xl p-6 md:p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-neon-500/20 border border-neon-500/30 flex items-center justify-center mx-auto mb-6">
                    <Check size={32} className="text-neon-500" />
                  </div>
                  <h4 className="text-white text-xl font-bold mb-2">Application Submitted!</h4>
                  <p className="text-dark-200 mb-6">Our finance team will review your application and contact you within 24 hours.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all"
                  >
                    Submit Another Application
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">Personal Information</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-200 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">State</label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                      >
                        {states.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">Social Security Number</label>
                      <input
                        type="password"
                        name="ssn"
                        value={form.ssn}
                        onChange={handleChange}
                        maxLength={9}
                        placeholder="XXX-XX-XXXX"
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="border-t border-neon-500/10 pt-6">
                    <h3 className="text-xl font-bold text-white mb-6">Employment & Financial</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Employment Status</label>
                        <select
                          name="employStatus"
                          value={form.employStatus}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                        >
                          <option value="">Select...</option>
                          <option value="Employed">Employed</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Retired">Retired</option>
                          <option value="Military">Military</option>
                          <option value="Unemployed">Unemployed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Employer Name</label>
                        <input
                          type="text"
                          name="employer"
                          value={form.employer}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Job Title / Position</label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={form.jobTitle}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">How Long Employed</label>
                        <select
                          name="monthsEmployed"
                          value={form.monthsEmployed}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                        >
                          <option value="">Select...</option>
                          <option value="Less than 6 months">Less than 6 months</option>
                          <option value="6 months - 1 year">6 months - 1 year</option>
                          <option value="1 - 2 years">1 - 2 years</option>
                          <option value="2 - 5 years">2 - 5 years</option>
                          <option value="5+ years">5+ years</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-dark-200 mb-2">Annual Gross Income ($)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-200">$</span>
                        <input
                          type="number"
                          name="annualIncome"
                          value={form.annualIncome}
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neon-500/10 pt-6">
                    <h3 className="text-xl font-bold text-white mb-6">Requested Loan</h3>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Down Payment ($)</label>
                        <input
                          type="number"
                          name="downPayment"
                          value={form.downPayment}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Desired Loan Term</label>
                        <select
                          name="loanTerm"
                          value={form.loanTerm}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                        >
                          <option value="24">24 months</option>
                          <option value="36">36 months</option>
                          <option value="48">48 months</option>
                          <option value="60">60 months</option>
                          <option value="72">72 months</option>
                          <option value="84">84 months</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neon-500/10 pt-6">
                    <h3 className="text-xl font-bold text-white mb-6">Trade-In Vehicle</h3>
                    <p className="text-dark-200 text-sm mb-4">If you have a vehicle to trade in, please provide the details below.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Year</label>
                        <input
                          type="text"
                          name="tradeYear"
                          value={form.tradeYear}
                          onChange={handleChange}
                          placeholder="e.g. 2018"
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Make</label>
                        <input
                          type="text"
                          name="tradeMake"
                          value={form.tradeMake}
                          onChange={handleChange}
                          placeholder="e.g. Ford"
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Model</label>
                        <input
                          type="text"
                          name="tradeModel"
                          value={form.tradeModel}
                          onChange={handleChange}
                          placeholder="e.g. F-150"
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Mileage</label>
                        <input
                          type="text"
                          name="tradeMileage"
                          value={form.tradeMileage}
                          onChange={handleChange}
                          placeholder="e.g. 80,000"
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">Condition</label>
                        <select
                          name="tradeCondition"
                          value={form.tradeCondition}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                          <option value="Poor">Poor</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-neon-500/10 pt-6">
                    <h3 className="text-xl font-bold text-white mb-6">Additional Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">Preferred Contact Method</label>
                      <div className="flex gap-3 flex-wrap">
                        {["Call", "SMS", "Email"].map((method) => (
                          <label
                            key={method}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                              form.contactMethod === method
                                ? "bg-neon-500/20 border-neon-500 text-neon-500"
                                : "bg-dark-700/80 border-neon-500/10 text-dark-200 hover:border-neon-500/30"
                            }`}
                          >
                            <input
                              type="radio"
                              name="contactMethod"
                              value={method}
                              checked={form.contactMethod === method}
                              onChange={handleChange}
                              className="hidden"
                            />
                            {method}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-dark-200 mb-2">Notes or Questions</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-neon-500/10 pt-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={form.consent}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-neon-500/30 bg-dark-700 text-neon-500 focus:ring-neon-500"
                      />
                      <span className="text-dark-200 text-sm">
                        I consent to Power Drive Motor collecting my information to process this credit application 
                        and to contact me regarding my request. Message frequency may vary. 
                        Message and data rates may apply. Text STOP to opt out at any time.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || loading}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-4">Why Apply With Us?</h4>
              <ul className="space-y-4">
                {[
                  { icon: DollarSign, text: "Competitive rates starting as low as 3.9% APR" },
                  { icon: Clock, text: "Quick approval — often within 24 hours" },
                  { icon: Shield, text: "No hidden fees or prepayment penalties" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-dark-200 text-sm">
                    <item.icon size={18} className="text-neon-500 shrink-0 mt-0.5" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-4">Dealer Information</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-dark-200 text-sm">
                  <Phone size={16} className="text-neon-500 shrink-0" />
                  (605) 501-2400
                </div>
                <div className="flex items-center gap-3 text-dark-200 text-sm">
                  <MapPin size={16} className="text-neon-500 shrink-0" />
                  4309 E 12th St, Sioux Falls, SD 57103
                </div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-dark-700/50">
                <p className="text-neon-500 text-xs font-semibold mb-2">Business Hours</p>
                <div className="text-xs text-dark-200 space-y-1">
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 6:00 PM</p>
                  <p className="text-red-400">Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-4">Already Have a Calculator?</h4>
              <p className="text-dark-200 text-sm mb-4">Try our financing calculator to estimate your monthly payments before applying.</p>
              <Link
                to="/financing"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300"
              >
                Payment Calculator <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
