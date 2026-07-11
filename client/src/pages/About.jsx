import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, FlaskConical, Users, Globe, ArrowRight } from 'lucide-react'
import FloatingLogos from '../components/FloatingLogos'

const MILESTONES = [
  { year: '2019', title: 'GRID Founded', desc: 'Five ML researchers, one group chat, and a shared frustration — good ML resources were everywhere but the people were scattered. We built the room.' },
  { year: '2020', title: 'First ML Hackathon', desc: '400+ participants, 60+ models shipped, and our first GPU sponsor. Proved the community could build real things together under pressure.' },
  { year: '2021', title: '5,000 ML Researchers', desc: 'Word spread. Researchers, engineers, and students from 40 countries joined — all focused on making ML less lonely and more rigorous.' },
  { year: '2022', title: 'Research Reading Groups', desc: 'Launched structured paper reading groups across NLP, CV, RL, and theory. Hundreds of papers discussed, reproduced, and challenged.' },
  { year: '2023', title: 'GRID Platform Launched', desc: 'Built our own home — forums, project hosting, member profiles, events. A place built for ML people, not retrofitted from somewhere else.' },
  { year: '2024', title: '12,000+ Members', desc: '12,000 ML researchers and engineers from 80+ countries. Every timezone, every ML domain, all in one place.' },
]


const VALUES = [
  { icon: FlaskConical, title: 'Rigour over hype',     desc: 'We slow down and read the paper. We run the experiment. We question the benchmark. Good ML requires that kind of honesty.' },
  { icon: Brain,        title: 'Build to learn',       desc: 'The best way to understand a model is to implement it from scratch. We celebrate trying things — including when they fail.' },
  { icon: Users,        title: 'Teach what you know',  desc: 'Every expert here was a beginner. We share knowledge generously because that is how the whole field moves faster.' },
  { icon: Globe,        title: 'Open by default',      desc: 'Open weights, open datasets, open code. We believe ML progress belongs to everyone, not just the labs with the most GPUs.' },
]

const iv = { initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, viewport:{once:true}, transition:{duration:0.6,ease:'easeOut'} }

export default function About() {
  return (
    <div style={{ background:'#02020e' }}>
      <FloatingLogos />

      {/* ── Hero ── */}
      <section className="page-hero relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div style={{ position:'absolute', top:'-15%', left:'35%', width:500, height:400, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(0,102,255,0.11) 0%,transparent 70%)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
            <span className="tag mb-6 inline-flex items-center gap-2">
              <Brain style={{ width:11, height:11 }} /> Our Story
            </span>
            <h1 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(2rem,5vw,3.5rem)', letterSpacing:'-0.04em', color:'#f0f6ff', marginBottom:20, lineHeight:1.1 }}>
              ABOUT <span className="text-gradient">GRID</span>
            </h1>
            <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:17, color:'rgba(160,180,210,0.8)', maxWidth:580, margin:'0 auto', lineHeight:1.75 }}>
              We started because the best ML conversations were happening in scattered DMs and Discord threads.
              GRID is the community that brings them into one place — structured, searchable, and permanent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission / Vision ── */}
      <section style={{ padding:'80px 16px', background:'#02020e' }}>
        <div style={{ maxWidth:1152, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
          {[
            {
              icon: Brain,
              title: 'Our Mission',
              grad: 'linear-gradient(135deg,rgba(0,82,204,0.12),rgba(0,212,255,0.06))',
              border: 'rgba(0,212,255,0.18)',
              glow: '#00d4ff',
              text: 'Make serious ML research and engineering less isolated. Give every researcher, engineer, and student a real community — where the conversations are deep, the people are honest, and the work speaks for itself.',
            },
            {
              icon: FlaskConical,
              title: 'Our Vision',
              grad: 'linear-gradient(135deg,rgba(123,47,255,0.12),rgba(0,102,255,0.06))',
              border: 'rgba(123,47,255,0.18)',
              glow: '#7b2fff',
              text: 'A world where your geography and institution do not limit your access to great ML mentorship and collaboration. The best research happens when the smartest people can actually talk to each other.',
            },
          ].map(({ icon:Icon, title, grad, border, glow, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity:0, x: i===0 ? -40 : 40 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true }}
              transition={{ duration:0.7, ease:'easeOut' }}
              style={{
                background:`linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96)), ${grad}`,
                border:`1px solid ${border}`,
                borderRadius:20, padding:'36px 32px',
                boxShadow:`0 0 0 1px rgba(255,255,255,0.02) inset, 0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${glow}06`,
              }}
            >
              <div style={{ width:52, height:52, borderRadius:14, background:`linear-gradient(135deg,${glow}18,${glow}08)`, border:`1px solid ${glow}25`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:24 }}>
                <Icon style={{ width:24, height:24, color:glow }} />
              </div>
              <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:22, color:'#f0f6ff', letterSpacing:'-0.02em', marginBottom:14 }}>{title}</h2>
              <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:15, color:'rgba(160,180,210,0.78)', lineHeight:1.75 }}>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Values ── */}
      <section style={{ padding:'80px 16px', position:'relative' }}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div style={{ position:'relative', maxWidth:1152, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span className="tag mb-4 inline-block">What drives us</span>
            <motion.h2 {...iv} style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'#f0f6ff', letterSpacing:'-0.03em' }}>
              WHAT WE <span className="text-gradient">STAND FOR</span>
            </motion.h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:20 }}>
            {VALUES.map(({ icon:Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.6 }}
                style={{
                  background:'linear-gradient(160deg,rgba(6,6,24,0.97),rgba(4,4,18,0.95))',
                  border:'1px solid rgba(0,212,255,0.1)',
                  borderRadius:18, padding:'28px 24px', textAlign:'center',
                  transition:'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(0,212,255,0.28)'; e.currentTarget.style.boxShadow='0 0 40px rgba(0,212,255,0.08)' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(0,212,255,0.1)'; e.currentTarget.style.boxShadow='none' }}
              >
                <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,rgba(0,82,204,0.2),rgba(0,212,255,0.12))', border:'1px solid rgba(0,212,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px' }}>
                  <Icon style={{ width:22, height:22, color:'#00d4ff' }} />
                </div>
                <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#f0f6ff', marginBottom:10, letterSpacing:'-0.01em' }}>{title}</h3>
                <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13.5, color:'rgba(140,160,190,0.7)', lineHeight:1.7 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section style={{ padding:'80px 16px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <span className="tag mb-4 inline-block">How we got here</span>
            <motion.h2 {...iv} style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'#f0f6ff', letterSpacing:'-0.03em' }}>
              THE GRID <span className="text-gradient">TIMELINE</span>
            </motion.h2>
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:32, top:0, bottom:0, width:1, background:'linear-gradient(to bottom,#00d4ff,#0066ff,transparent)', opacity:0.3 }} />
            <div style={{ display:'flex', flexDirection:'column', gap:36 }}>
              {MILESTONES.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.6 }}
                  style={{ display:'flex', gap:28, alignItems:'flex-start' }}
                >
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{
                      width:64, height:64, borderRadius:14,
                      background:'linear-gradient(160deg,rgba(6,6,24,0.98),rgba(4,4,18,0.96))',
                      border:'1px solid rgba(0,212,255,0.2)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <span style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:13, color:'#00d4ff', letterSpacing:'-0.02em' }}>{year}</span>
                    </div>
                    <div style={{ position:'absolute', top:'50%', right:-16, width:16, height:1, background:'#00d4ff', opacity:0.4 }} />
                  </div>
                  <div style={{ paddingTop:8 }}>
                    <h3 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:700, fontSize:15, color:'#f0f6ff', marginBottom:6, letterSpacing:'-0.01em' }}>{title}</h3>
                    <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:13.5, color:'rgba(140,160,190,0.7)', lineHeight:1.7 }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:'80px 16px', textAlign:'center' }}>
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
          <h2 style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontWeight:800, fontSize:'clamp(1.8rem,4vw,2.5rem)', color:'#f0f6ff', letterSpacing:'-0.03em', marginBottom:16 }}>
            BE PART OF <span className="text-gradient">THE RESEARCH</span>
          </h2>
          <p style={{ fontFamily:'"Plus Jakarta Sans",sans-serif', fontSize:16, color:'rgba(160,180,210,0.72)', marginBottom:32, maxWidth:440, margin:'0 auto 32px' }}>
            Your next collaborator, paper co-author, or research breakthrough is already here.
          </p>
          <Link to="/members" className="btn-primary inline-flex items-center gap-2">
            Meet the community <ArrowRight style={{ width:16, height:16 }} />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
