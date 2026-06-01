import { motion } from "framer-motion"
import { Award, Target, Heart, Users, Shield, Globe } from "lucide-react"
import SectionTitle from "../components/SectionTitle"

const team = [
  { name: "Alexander Romano", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Isabella Torres", role: "Head of Sales", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Marcus Williams", role: "Chief Mechanic", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Sophie Laurent", role: "Client Relations", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
]

const values = [
  { icon: Award, title: "Excellence", description: "We refuse to compromise. Every vehicle we offer meets the highest standards of quality and condition." },
  { icon: Shield, title: "Trust", description: "Transparent dealings, honest valuations, and integrity are the foundation of every relationship we build." },
  { icon: Heart, title: "Passion", description: "We are car enthusiasts first. Our passion drives us to find the perfect vehicle for each client." },
  { icon: Globe, title: "Global Reach", description: "With partners worldwide, we source the finest automobiles from every corner of the globe." },
  { icon: Target, title: "Precision", description: "From vehicle selection to delivery, every detail is meticulously planned and executed." },
  { icon: Users, title: "Community", description: "We build lasting relationships with our clients, creating a community of automotive enthusiasts." },
]

const milestones = [
  { year: "2010", title: "Founded", description: "Power Drive Motor established in Beverly Hills" },
  { year: "2013", title: "Expansion", description: "Opened second showroom in Miami" },
  { year: "2016", title: "Global Sourcing", description: "Launched international vehicle sourcing network" },
  { year: "2019", title: "1,000th Vehicle", description: "Celebrated 1,000 vehicles sold milestone" },
  { year: "2022", title: "Digital Transformation", description: "Launched online virtual showroom" },
  { year: "2025", title: "Industry Leader", description: "Recognized as top luxury dealership worldwide" },
]

export default function About() {
  return (
    <div className="pt-24 min-h-screen">
      <div className="relative py-20 bg-dark-800/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,0.05),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            subtitle="About Us"
            title="Our Story"
            description="For over 15 years, Power Drive Motor has been the destination of choice for discerning automotive enthusiasts seeking the extraordinary."
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              More Than a Dealership — <span className="gradient-text">A Destination</span>
            </h2>
            <div className="space-y-4 text-dark-200 leading-relaxed">
              <p>
                Founded in 2010 in the heart of Beverly Hills, Power Drive Motor began with a simple vision: 
                to create an automotive experience that rivals the vehicles themselves.
              </p>
              <p>
                What started as a boutique showroom has grown into a globally recognized luxury automotive 
                concierge, serving an elite clientele across six continents.
              </p>
              <p>
                Our team of passionate automotive experts brings decades of combined experience, 
                ensuring that every interaction — from browsing to purchase to ownership — is nothing 
                short of exceptional.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80"
              alt="Showroom"
              className="rounded-2xl w-full aspect-[4/3] object-cover"
            />
            <div className="absolute -bottom-4 -left-4 glass rounded-xl p-6">
              <p className="text-neon-500 text-3xl font-bold">15+</p>
              <p className="text-dark-200 text-sm">Years of Excellence</p>
            </div>
          </motion.div>
        </div>

        <div className="mb-20">
          <SectionTitle
            subtitle="Values"
            title="What We Stand For"
            description="Our principles guide everything we do, from sourcing vehicles to serving our clients."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-8"
              >
                <v.icon size={32} className="text-neon-500 mb-4" />
                <h3 className="text-white font-bold text-xl mb-3">{v.title}</h3>
                <p className="text-dark-200 text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <SectionTitle
            subtitle="Timeline"
            title="Our Journey"
            description="Key milestones that shaped Power Drive Motor into the world-class organization it is today."
          />
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-500/50 via-neon-500/20 to-transparent -translate-x-0 md:-translate-x-px" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-6 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="glass-card rounded-xl p-6 inline-block">
                      <span className="text-neon-500 font-['Orbitron'] text-sm font-bold">{m.year}</span>
                      <h3 className="text-white font-bold text-lg mt-1">{m.title}</h3>
                      <p className="text-dark-200 text-sm mt-1">{m.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-neon-500 rounded-full border-4 border-dark-700 -translate-x-1.5 md:-translate-x-2 mt-6" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionTitle
            subtitle="Team"
            title="Meet Our Leadership"
            description="The passionate individuals behind Power Drive Motor's success."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-lg">{member.name}</h3>
                  <p className="text-neon-500 text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
