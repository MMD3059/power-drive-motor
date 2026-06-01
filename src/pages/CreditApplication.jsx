import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Loader2, Send, Shield, Clock, DollarSign, Phone, Mail, MapPin, ArrowRight, Car, Calendar, Hash, Gauge, Users, Building, CreditCard, Home } from "lucide-react"
import SectionTitle from "../components/SectionTitle"
import { Link } from "react-router-dom"
import { useCars } from "../contexts/CarContext"
import { useLang } from "../i18n/context"

const initialForm = {
  appType: "individual",
  relationship: "",
  vehicleInterest: "",
  purchaseType: "finance",
  purchaseTerm: "",
  leaseMiles: "",
  monthlyPayment: "",
  amountToFinance: "",
  firstName: "",
  lastName: "",
  email: "",
  homePhone: "",
  contactPhone: "",
  address: "",
  city: "",
  state: "SD",
  zip: "",
  yearsAtAddress: "",
  housingStatus: "",
  monthlyHousing: "",
  dob: "",
  ssn: "",
  maritalStatus: "",
  driversLicense: "",
  licenseExp: "",
  employStatus: "",
  employer: "",
  jobTitle: "",
  monthsEmployed: "",
  annualIncome: "",
  downPayment: "",
  loanTerm: "60",
  tradeIn: "no",
  tradeYear: "",
  tradeMake: "",
  tradeModel: "",
  tradeMileage: "",
  tradeVin: "",
  tradePayoff: "",
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
  const { cars } = useCars()
  const { t } = useLang()
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
        phone: form.contactPhone || form.homePhone,
        subject: "Credit Application",
        message: `
--- Application Info ---
Type: ${form.appType === "individual" ? "Individual" : "Joint"}${form.relationship ? ` (${form.relationship})` : ""}
Vehicle Interest: ${form.vehicleInterest || "Not specified"}
Purchase: ${form.purchaseType === "finance" ? "Finance" : "Lease"} | Term: ${form.purchaseTerm}mo | Monthly: $${form.monthlyPayment} | Amount: $${form.amountToFinance}${form.leaseMiles ? ` | Lease Miles: ${form.leaseMiles}` : ""}

--- Personal ---
DOB: ${form.dob} | SSN: ${form.ssn} | Marital: ${form.maritalStatus}
DL#: ${form.driversLicense} | Exp: ${form.licenseExp}
Address: ${form.address}, ${form.city}, ${form.state} ${form.zip} (${form.yearsAtAddress})
Housing: ${form.housingStatus} | $${form.monthlyHousing}/mo
Home Phone: ${form.homePhone} | Contact: ${form.contactPhone}

--- Employment ---
${form.employStatus} - ${form.jobTitle} at ${form.employer} (${form.monthsEmployed})
Annual Income: $${form.annualIncome}

--- Loan ---
Down Payment: $${form.downPayment} | Term: ${form.loanTerm}mo

--- Trade-In ---
Has Trade: ${form.tradeIn === "yes" ? `Yes - ${form.tradeYear} ${form.tradeMake} ${form.tradeModel} | Mileage: ${form.tradeMileage} | VIN: ${form.tradeVin} | Payoff: $${form.tradePayoff}` : "No"}

--- Contact ---
Method: ${form.contactMethod}
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

  const isValid = form.firstName && form.lastName && form.email && form.consent

  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-12 md:py-20 bg-dark-800/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle={t("credit.subtitle")}
            title={t("credit.title")}
            description={t("credit.desc")}
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
                  <h4 className="text-white text-xl font-bold mb-2">{t("credit.submittedTitle")}</h4>
                  <p className="text-dark-200 mb-6">{t("credit.submittedDesc")}</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-neon-500 text-dark-900 font-semibold rounded-xl hover:bg-neon-400 transition-all"
                  >
                    {t("credit.submitAnother")}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Application Type */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Users size={20} className="text-neon-500" /> {t("credit.appType")}
                    </h3>
                    <div className="flex gap-3 flex-wrap">
                      {["individual", "joint"].map((t) => (
                        <label key={t}
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all capitalize ${
                            form.appType === t
                              ? "bg-neon-500/20 border-neon-500 text-neon-500"
                              : "bg-dark-700/80 border-neon-500/10 text-dark-200 hover:border-neon-500/30"
                          }`}
                        >
                          <input type="radio" name="appType" value={t} checked={form.appType === t} onChange={handleChange} className="hidden" />
                          {t === "individual" ? t("credit.individual") : t("credit.joint")}
                        </label>
                      ))}
                    </div>
                    {form.appType === "joint" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.relationship")}</label>
                        <select name="relationship" value={form.relationship} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                        >
                          <option value="">Select...</option>
                          <option value="Resides With">Resides With</option>
                          <option value="Parent">Parent</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Of Interest */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Car size={20} className="text-neon-500" /> {t("credit.vehicleInterest")}
                    </h3>
                    <select name="vehicleInterest" value={form.vehicleInterest} onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                    >
                      <option value="">{t("credit.selectVehicle")}</option>
                      {cars.map((c) => (
                        <option key={c.id} value={`${c.year || ""} ${c.name} - $${c.price?.toLocaleString()}`}>
                          {c.year || ""} {c.name} - ${c.price?.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Purchase Information */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <CreditCard size={20} className="text-neon-500" /> {t("credit.purchaseInfo")}
                    </h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.financeOrLease")}</label>
                      <div className="flex gap-3">
                        {["finance", "lease"].map((p) => (
                          <label key={p}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all capitalize ${
                              form.purchaseType === p
                                ? "bg-neon-500/20 border-neon-500 text-neon-500"
                                : "bg-dark-700/80 border-neon-500/10 text-dark-200 hover:border-neon-500/30"
                            }`}
                          >
                            <input type="radio" name="purchaseType" value={p} checked={form.purchaseType === p} onChange={handleChange} className="hidden" />
                            {p === "finance" ? t("credit.finance") : t("credit.lease")}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.desiredTerm")}</label>
                        <select name="purchaseTerm" value={form.purchaseTerm} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer"
                        >
                          <option value="">Select...</option>
                          {[12,24,36,48,60,72,84].map((m) => (
                            <option key={m} value={m}>{m} months</option>
                          ))}
                        </select>
                      </div>
                      {form.purchaseType === "lease" && (
                        <div>
                          <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.leaseMiles")}</label>
                          <input type="number" name="leaseMiles" value={form.leaseMiles} onChange={handleChange}
                            className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                        </div>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.downPayment")}</label>
                        <input type="number" name="downPayment" value={form.downPayment} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.monthlyPayment")}</label>
                        <input type="number" name="monthlyPayment" value={form.monthlyPayment} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.amountToFinance")}</label>
                      <input type="number" name="amountToFinance" value={form.amountToFinance} onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4">{t("credit.personalInfo")}</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.firstName")}</label>
                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.lastName")}</label>
                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.email")}</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.homePhone")}</label>
                        <input type="tel" name="homePhone" value={form.homePhone} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.contactPhone")}</label>
                        <input type="tel" name="contactPhone" value={form.contactPhone} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.dob")}</label>
                        <input type="date" name="dob" value={form.dob} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.ssn")}</label>
                        <input type="password" name="ssn" value={form.ssn} onChange={handleChange} maxLength={9}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.maritalStatus")}</label>
                        <select name="maritalStatus" value={form.maritalStatus} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer">
                          <option value="">Select...</option>
                          <option value="Married">Married</option>
                          <option value="Single">Single</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Separated">Separated</option>
                          <option value="Widowed">Widowed</option>
                        </select></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.driversLicense")}</label>
                        <input type="text" name="driversLicense" value={form.driversLicense} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.licenseExp")}</label>
                      <input type="date" name="licenseExp" value={form.licenseExp} onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                    </div>
                  </div>

                  {/* Address & Housing */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Home size={20} className="text-neon-500" /> {t("credit.currentAddress")}
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.streetAddress")}</label>
                      <input type="text" name="address" value={form.address} onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.city")}</label>
                        <input type="text" name="city" value={form.city} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.state")}</label>
                        <select name="state" value={form.state} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer">
                          {states.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.zip")}</label>
                        <input type="text" name="zip" value={form.zip} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 mt-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.yearsAtAddress")}</label>
                        <select name="yearsAtAddress" value={form.yearsAtAddress} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer">
                          <option value="">Select...</option>
                          <option value="Less than 1">Less than 1</option>
                          <option value="1-2">1-2</option>
                          <option value="2-5">2-5</option>
                          <option value="5-10">5-10</option>
                          <option value="10+">10+</option>
                        </select></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.housingStatus")}</label>
                        <select name="housingStatus" value={form.housingStatus} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer">
                          <option value="">Select...</option>
                          <option value="Own">Own</option>
                          <option value="Rent">Rent</option>
                          <option value="Live with parents">Live with parents</option>
                          <option value="Other">Other</option>
                        </select></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.monthlyHousing")}</label>
                        <input type="number" name="monthlyHousing" value={form.monthlyHousing} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                    </div>
                  </div>

                  {/* Employment */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Building size={20} className="text-neon-500" /> {t("credit.employment")}
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.status")}</label>
                        <select name="employStatus" value={form.employStatus} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer">
                          <option value="">Select...</option>
                          <option value="Employed">Employed</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Retired">Retired</option>
                          <option value="Military">Military</option>
                          <option value="Unemployed">Unemployed</option>
                        </select></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.employer")}</label>
                        <input type="text" name="employer" value={form.employer} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 mt-4">
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.jobTitle")}</label>
                        <input type="text" name="jobTitle" value={form.jobTitle} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                      <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.timeEmployed")}</label>
                        <select name="monthsEmployed" value={form.monthsEmployed} onChange={handleChange}
                          className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all cursor-pointer">
                          <option value="">Select...</option>
                          <option value="Less than 6 months">Less than 6 months</option>
                          <option value="6 months - 1 year">6 months - 1 year</option>
                          <option value="1 - 2 years">1 - 2 years</option>
                          <option value="2 - 5 years">2 - 5 years</option>
                          <option value="5+ years">5+ years</option>
                        </select></div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.annualIncome")}</label>
                      <input type="number" name="annualIncome" value={form.annualIncome} onChange={handleChange}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                    </div>
                  </div>

                  {/* Trade-In */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Car size={20} className="text-neon-500" /> {t("credit.tradeIn")}
                    </h3>
                    <div className="flex gap-3 mb-4">
                      {["no", "yes"].map((v) => (
                        <label key={v}
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                            form.tradeIn === v
                              ? "bg-neon-500/20 border-neon-500 text-neon-500"
                              : "bg-dark-700/80 border-neon-500/10 text-dark-200 hover:border-neon-500/30"
                          }`}
                        >
                          <input type="radio" name="tradeIn" value={v} checked={form.tradeIn === v} onChange={handleChange} className="hidden" />
                          {v === "yes" ? t("credit.yes") : t("credit.no")}
                        </label>
                      ))}
                    </div>
                    {form.tradeIn === "yes" && (
                      <>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.tradeYear")}</label>
                            <input type="text" name="tradeYear" value={form.tradeYear} onChange={handleChange}
                              className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                          <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.tradeMake")}</label>
                            <input type="text" name="tradeMake" value={form.tradeMake} onChange={handleChange}
                              className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4 mt-4">
                          <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.tradeModel")}</label>
                            <input type="text" name="tradeModel" value={form.tradeModel} onChange={handleChange}
                              className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                          <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.tradeMileage")}</label>
                            <input type="text" name="tradeMileage" value={form.tradeMileage} onChange={handleChange}
                              className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                          <div><label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.tradeVin")}</label>
                            <input type="text" name="tradeVin" value={form.tradeVin} onChange={handleChange}
                              className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" /></div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.tradePayoff")}</label>
                          <input type="number" name="tradePayoff" value={form.tradePayoff} onChange={handleChange}
                            className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Contact Method */}
                  <div className="border-b border-neon-500/10 pb-6">
                    <h3 className="text-xl font-bold text-white mb-4">{t("credit.contactPref")}</h3>
                    <div className="flex gap-3 flex-wrap">
                      {["Call", "SMS", "Email"].map((m) => (
                        <label key={m}
                          className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                            form.contactMethod === m
                              ? "bg-neon-500/20 border-neon-500 text-neon-500"
                              : "bg-dark-700/80 border-neon-500/10 text-dark-200 hover:border-neon-500/30"
                          }`}
                        >
                          <input type="radio" name="contactMethod" value={m} checked={form.contactMethod === m} onChange={handleChange} className="hidden" />
                          {m}
                        </label>
                      ))}
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-dark-200 mb-2">{t("credit.notes")}</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                        className="w-full px-4 py-3 bg-dark-700/80 border border-neon-500/10 rounded-xl text-white focus:outline-none focus:border-neon-500/40 transition-all resize-none" />
                    </div>
                  </div>

                  {/* Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-neon-500/30 bg-dark-700 text-neon-500 focus:ring-neon-500" />
                      <span className="text-dark-200 text-sm">
                        {t("credit.consent")}
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={!isValid || loading}
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-neon-500 text-dark-900 font-bold rounded-xl hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    {loading ? t("credit.submitting") : t("credit.submit")}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-4">{t("credit.sidebarTitle")}</h4>
              <ul className="space-y-4">
                {[
                  { icon: DollarSign, text: t("credit.sidebarRate") },
                  { icon: Clock, text: t("credit.sidebarApproval") },
                  { icon: Shield, text: t("credit.sidebarFees") },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-dark-200 text-sm">
                    <item.icon size={18} className="text-neon-500 shrink-0 mt-0.5" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-4">{t("credit.dealerInfo")}</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-dark-200 text-sm"><Phone size={16} className="text-neon-500 shrink-0" />(605) 501-2400</div>
                <div className="flex items-center gap-3 text-dark-200 text-sm"><MapPin size={16} className="text-neon-500 shrink-0" />4309 E 12th St, Sioux Falls, SD 57103</div>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-dark-700/50">
                <p className="text-neon-500 text-xs font-semibold mb-2">{t("credit.businessHours")}</p>
                <div className="text-xs text-dark-200 space-y-1">
                  <p>{t("credit.monFri")}: 9:00 AM - 6:00 PM</p>
                  <p>{t("credit.sat")}: 10:00 AM - 6:00 PM</p>
                  <p className="text-red-400">{t("credit.sun")}: {t("credit.closed")}</p>
                </div>
              </div>
            </div>
            <div className="glass rounded-xl p-6">
              <h4 className="text-white font-bold text-lg mb-4">{t("credit.calculatorLink")}</h4>
              <p className="text-dark-200 text-sm mb-4">{t("credit.calculatorDesc")}</p>
              <Link to="/financing"
                className="flex items-center justify-center gap-2 px-6 py-3 border border-neon-500/30 text-neon-500 font-semibold rounded-xl hover:bg-neon-500/10 transition-all duration-300">
                {t("credit.paymentCalc")} <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
