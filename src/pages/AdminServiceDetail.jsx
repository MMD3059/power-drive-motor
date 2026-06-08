import { useParams, Link } from "react-router-dom"
import { ArrowLeft, ExternalLink, CheckCircle, Globe, Search, Smartphone, ShoppingCart, TrendingUp, Target } from "lucide-react"

const services = {
  "google-listings": {
    name: "Google Vehicle Listings",
    icon: Search,
    color: "from-green-600 to-emerald-400",
    desc: "Display your inventory as rich ads across Google Search, Images, and YouTube.",
    steps: [
      "Create a Google Merchant Center account",
      "Verify & claim your website URL",
      "Set up a product feed with your inventory",
      "Enable free listings & shopping ads",
      "Optimize with vehicle-specific attributes",
    ],
    links: [
      { label: "Google Merchant Center", url: "https://www.google.com/retail/solutions/merchant-center/" },
      { label: "Vehicle Ads Setup Guide", url: "https://support.google.com/merchants/answer/97715" },
    ],
  },
  craigslist: {
    name: "Craigslist",
    icon: Smartphone,
    color: "from-orange-600 to-yellow-400",
    desc: "Auto-post your cars to Craigslist with pre-filled templates.",
    steps: [
      "Create a Craigslist account",
      "Select your city / region",
      "Create a listing template with your photos",
      "Post under 'Cars & Trucks' category",
      "Renew listings every 48 hours for visibility",
    ],
    links: [
      { label: "Craigslist Post", url: "https://accounts.craigslist.org/" },
      { label: "Craigslist Terms", url: "https://www.craigslist.org/about/terms.of.use" },
    ],
  },
  "google-shop": {
    name: "Google Shop / Network",
    icon: ShoppingCart,
    color: "from-red-600 to-pink-400",
    desc: "Showcase your cars on Google Shopping and the Google Display Network.",
    steps: [
      "Link Merchant Center to Google Ads",
      "Create a Shopping campaign",
      "Set up Display Network retargeting",
      "Optimize bids by vehicle segment",
      "Track conversions with Google Analytics",
    ],
    links: [
      { label: "Google Ads", url: "https://ads.google.com/" },
      { label: "Shopping Campaigns Guide", url: "https://support.google.com/google-ads/answer/2454022" },
    ],
  },
  "fb-business": {
    name: "FB Marketplace as Business",
    icon: TrendingUp,
    color: "from-purple-600 to-violet-400",
    desc: "List your inventory as a Facebook Business on Marketplace.",
    steps: [
      "Create a Facebook Business Page",
      "Set up Commerce Manager",
      "Add your inventory as products",
      "Enable Marketplace selling",
      "Manage orders & inquiries from Page Inbox",
    ],
    links: [
      { label: "Facebook Business Suite", url: "https://business.facebook.com/" },
      { label: "Commerce Manager", url: "https://www.facebook.com/commerce_manager" },
    ],
  },
  "local-dominance": {
    name: "Local Dominance",
    icon: Target,
    color: "from-teal-600 to-emerald-400",
    desc: "Dominate local search results and Google Maps for maximum visibility.",
    steps: [
      "Claim & verify your Google Business Profile",
      "Add accurate NAP (Name, Address, Phone)",
      "Upload high-quality photos regularly",
      "Collect & respond to Google reviews",
      "Post weekly updates & offers",
      "Build local citations on Yelp, Bing, etc.",
    ],
    links: [
      { label: "Google Business Profile", url: "https://www.google.com/business/" },
      { label: "Yelp for Business", url: "https://biz.yelp.com/" },
    ],
  },
}

export default function AdminServiceDetail() {
  const { service } = useParams()
  const svc = services[service]

  if (!svc) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-dark-200 text-sm">Service not found.</p>
        <Link to="/PDM-admin" className="text-neon-500 text-sm hover:underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    )
  }

  const Icon = svc.icon

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/PDM-admin" className="text-dark-200 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${svc.color} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{svc.name}</h1>
          <p className="text-dark-300 text-sm">{svc.desc}</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="text-white font-bold text-lg mb-4">Setup Guide</h2>
        <div className="space-y-3">
          {svc.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-neon-500/10 border border-neon-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-neon-500 text-xs font-bold">{i + 1}</span>
              </div>
              <p className="text-dark-200 text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-white font-bold text-lg mb-4">Quick Links</h2>
        <div className="space-y-3">
          {svc.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-dark-700/50 border border-white/5 hover:border-neon-500/20 transition-all group"
            >
              <span className="text-white text-sm group-hover:text-neon-500 transition-colors">{link.label}</span>
              <ExternalLink size={14} className="text-dark-400 group-hover:text-neon-500 transition-colors" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
