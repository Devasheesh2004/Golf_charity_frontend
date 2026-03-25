"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy, HeartHandshake, CalendarClock, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useCharities } from "@/hooks/useCharities";

export default function LandingPage() {
  const { charities } = useCharities();
  const featured = charities.filter(c => c.featured);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white antialiased">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <section className="container mx-auto px-6 pt-32 pb-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-10 shadow-sm">
            <Trophy className="w-3 h-3" /> The Premium Golf Experience
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85] text-slate-900">
            Elevate Your Game. <br />
            <span className="text-emerald-600 italic">Transform Lives.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-14 max-w-2xl mx-auto font-medium leading-relaxed">
            The elite platform where your golf scores unlock premium monthly rewards and direct support for your chosen charity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center px-10 py-5 font-black uppercase tracking-widest text-white bg-emerald-600 rounded-2xl overflow-hidden hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-200 w-full sm:w-auto active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-3">
                Begin Your Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* INFINITE CHARITY TRAIN */}
      <section className="py-20 relative overflow-hidden bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Impact Partners</h2>
                <p className="text-slate-500 font-medium">Supporting world-class organizations through every stroke.</p>
            </div>
            <Link href="/charities" className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2 hover:translate-x-1 transition-transform group">
                Explore Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        <div className="relative flex overflow-x-hidden">
          <motion.div 
            className="flex gap-6 whitespace-nowrap py-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 40, repeat: Infinity }}
          >
            {[...featured, ...featured, ...featured, ...featured].map((charity, idx) => (
              <Link 
                key={`${charity.id}-${idx}`}
                href={`/signup?charityId=${charity.id}`}
                className="inline-block bg-white border border-slate-200 rounded-[2.5rem] p-8 w-[calc(100vw/3.5)] min-w-[320px] max-w-[400px] group hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/5 relative overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Heart className="w-20 h-20 text-emerald-600" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-black tracking-widest text-amber-500 uppercase">Featured</span>
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors whitespace-normal line-clamp-1">{charity.name}</h4>
                    </div>
                </div>
                <p className="text-slate-400 text-sm font-medium whitespace-normal line-clamp-2 leading-relaxed mb-6">
                    {charity.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 group-hover:translate-x-1 transition-transform">
                    Selection Option <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          {[
            {
              icon: <Trophy className="w-10 h-10 text-amber-600" />,
              title: "Performance Tracking",
              desc: "Log your recent Stableford scores to refine your dynamic player profile and standing.",
            },
            {
              icon: <HeartHandshake className="w-10 h-10 text-rose-600" />,
              title: "Philanthropic Impact",
              desc: "Direct a portion of every subscription renewal to verified charities making a global difference.",
            },
            {
              icon: <CalendarClock className="w-10 h-10 text-cyan-600" />,
              title: "Exclusive Opportunities",
              desc: "Gain entry into premium monthly draws powered by our proprietary selection algorithm.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 p-12 rounded-[2.5rem] hover:border-emerald-500/30 transition-all duration-500 text-left shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 group"
            >
              <div className={`bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner group-hover:bg-white`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
