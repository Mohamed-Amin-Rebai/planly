"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Zap,
  BarChart3, 
  House, 
  CheckCircle,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const goToSignup = () => router.push("/sign-up");
  const goToApp = () => router.push("/design");

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  const features = [
    {
      title: "AI-Powered Generation",
      desc: "Draw or describe your land and generate an intelligent floorplan powered by AI.",
      icon: Sparkles,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Real-Time Editing",
      desc: "Chat with your AI assistant to modify your Floorplan dynamically without reloads.",
      icon: Zap,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      title: "Interactive Planning",
      desc: "Draw your land manually or directly on a map before generating your Floorplan.",
      icon: BarChart3,
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  const steps = [
    "Describe your land",
    "AI generates your Floorplan",
    "Customize with AI chat",
    "Export and save your project",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white relative overflow-x-hidden">

      {/* 🌟 HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 md:px-6 overflow-hidden">
        
        {/* Background Glows */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-violet-300 rounded-full blur-[160px] opacity-20 z-0"
        />
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] bg-indigo-300 rounded-full blur-[160px] opacity-20 z-0"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-300 rounded-full blur-[180px] opacity-8 z-0" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 px-5 py-2.5 rounded-full text-sm font-medium mb-6 border border-violet-200/50 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Floorplan
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            >
              Crafting your 
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                {" "}dream home
              </span>
              , one plan at a time.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-5 leading-relaxed"
            >
              Describe your land and instantly generate a modern floorplan powered by AI.
            </motion.p>

            {/* Secondary text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-gray-400 mb-9 text-sm md:text-base font-medium tracking-wide"
            >
              ✦ No setup required ✦ Zero coding ✦ Instant results
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={isSignedIn ? goToApp : goToSignup}
                className="group relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">Generate My Floorplan</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-600 hover:text-gray-900 transition font-medium px-8 py-4 rounded-full border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Learn More
              </button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2.5 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100/50 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">AI-generated instantly</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100/50 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">Real-time editing</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100/50 shadow-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-medium">Save and Export</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PREVIEW IMAGE SECTION */}
      <section className="py-12 md:py-20 px-4 md:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.01 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/20 border border-gray-200/50 group"
          >
            <img
              src="/your-background-image.jpg"
              alt="Planly Preview"
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-violet-600/5 via-transparent to-transparent" />
            
            {/* Decorative glows */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-violet-400 rounded-full blur-[140px] opacity-30 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-400 rounded-full blur-[140px] opacity-30 pointer-events-none" />
            
            {/* Floating badge - New */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-gray-200/50">
              <p className="text-xs font-medium text-gray-600 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-violet-500" />
                AI Generated Preview
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 md:py-32 px-4 md:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/30 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-semibold text-violet-600 bg-violet-50 px-5 py-1.5 rounded-full mb-4 border border-violet-100">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Everything You Need to Build a Modern Floorplan
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
              Generate, customize, and refine your floorplans with AI-assisted tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-violet-600/0 via-indigo-600/0 to-purple-600/0 group-hover:from-violet-600/20 group-hover:via-indigo-600/20 group-hover:to-purple-600/20 transition-all duration-500 blur-xl opacity-0 group-hover:opacity-100`} />
                <div className="relative bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:border-gray-200 transition-all duration-300 h-full backdrop-blur-sm">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:text-violet-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 px-4 md:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/20 via-white to-white" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="inline-block text-sm font-semibold text-indigo-600 bg-indigo-50 px-5 py-1.5 rounded-full mb-4 border border-indigo-100">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              From Mere words to Floorplan in Minutes
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative">
            {/* Connecting line - Enhanced */}
            <div className="hidden md:block absolute top-6 left-[12.5%] w-[75%] h-0.5 bg-gradient-to-r from-violet-300 via-indigo-300 to-purple-300" />
            
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center mx-auto mb-4 text-lg shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow duration-300 relative z-10">
                  {i + 1}
                </div>
                <p className="text-gray-700 font-medium text-sm leading-relaxed px-2">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-indigo-600/5 to-purple-600/10" />
        <div className="absolute top-[-250px] right-[-250px] w-[500px] h-[500px] bg-violet-400 rounded-full blur-[180px] opacity-20" />
        <div className="absolute bottom-[-250px] left-[-250px] w-[500px] h-[500px] bg-indigo-400 rounded-full blur-[180px] opacity-20" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
              Ready to Craft Your{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Dream Floorplan
              </span>
              ?
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of others who crafted their floorplan in minutes.
            </p>
            <button
              onClick={isSignedIn ? goToApp : goToSignup}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-4 rounded-full text-lg font-medium shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">Start Crafting Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 md:px-6 border-t border-gray-200/50 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div 
            onClick={() => router.push("/")} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20 group-hover:shadow-violet-500/30 transition-shadow duration-300">
              <House className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-gray-700 group-hover:text-violet-600 transition-colors duration-300">Planly</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gray-900 transition-colors duration-300 hover:font-medium">Privacy</a>
            <a href="#" className="hover:text-gray-900 transition-colors duration-300 hover:font-medium">Terms</a>
            <a href="#" className="hover:text-gray-900 transition-colors duration-300 hover:font-medium">Support</a>
          </div>
          <span className="text-gray-400">© {new Date().getFullYear()} Planly. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}