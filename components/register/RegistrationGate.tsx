'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAuthStore } from '@/store/auth.store'
import { Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export const RegistrationGate = () => {
  const { user } = useAuthStore()
  const [step, setStep] = useState<'method' | 'otp' | 'profile' | 'sports'>('method')
  const [method, setMethod] = useState<'phone' | 'email'>('email')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const handleSendOTP = () => {
    // API Call placeholder
    console.log(`Sending OTP to ${contact} via ${method}`)
    setStep('otp')
  }

  const handleVerifyOTP = () => {
    // API Call placeholder
    console.log(`Verifying OTP ${otp.join('')}`)
    setStep('profile')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            <Card className="p-10 border-green-500/20 text-center">
              <h3 className="font-display text-3xl text-white mb-8 uppercase">Verify to Register</h3>
              <div className="flex gap-4 p-1 bg-white/5 rounded-2xl mb-10">
                <button 
                  onClick={() => setMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${method === 'email' ? 'bg-green-500 text-green-950' : 'text-green-100/50 hover:bg-white/5'}`}
                >
                  <Mail size={18} />
                  EMAIL
                </button>
                <button 
                  onClick={() => setMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl transition-all ${method === 'phone' ? 'bg-green-500 text-green-950' : 'text-green-100/50 hover:bg-white/5'}`}
                >
                  <Phone size={18} />
                  PHONE
                </button>
              </div>

              <div className="space-y-2 text-left mb-10">
                <label className="text-xs font-accent tracking-widest text-green-500/50 uppercase ml-1">
                  {method === 'email' ? 'University Email' : 'Mobile Number'}
                </label>
                <input 
                  type={method === 'email' ? 'email' : 'tel'} 
                  placeholder={method === 'email' ? 'student@gla.ac.in' : '+91 9876543210'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:border-green-500/50 transition-colors text-xl text-white placeholder:text-white/10"
                />
              </div>

              <Button 
                onClick={handleSendOTP} 
                className="w-full h-16 text-lg flex items-center justify-center gap-3"
                disabled={!contact}
              >
                SEND OTP
                <ArrowRight size={20} />
              </Button>
              <p className="mt-8 text-green-200/30 text-sm">
                OTP will be sent to your {method === 'email' ? 'email' : 'phone number'} for verification.
              </p>
            </Card>
          </motion.div>
        )}

        {step === 'otp' && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
          >
            <Card className="p-10 border-green-500/20 text-center">
              <button 
                onClick={() => setStep('method')}
                className="text-green-500/50 hover:text-green-500 text-sm mb-8 block font-accent tracking-widest uppercase"
              >
                ← Change {method}
              </button>
              <h3 className="font-display text-3xl text-white mb-4 uppercase">Enter OTP</h3>
              <p className="text-green-200/50 mb-10">Sent to <span className="text-white">{contact}</span></p>
              
              <div className="flex justify-center gap-3 mb-12">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp]
                      newOtp[i] = e.target.value
                      setOtp(newOtp)
                      if (e.target.value && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus()
                    }}
                    className="w-12 h-16 md:w-16 md:h-20 bg-white/5 border border-white/10 rounded-xl text-center text-3xl font-display text-green-500 focus:outline-none focus:border-green-500 shadow-inner"
                  />
                ))}
              </div>

              <Button 
                onClick={handleVerifyOTP} 
                className="w-full h-16 text-lg flex items-center justify-center gap-3"
                disabled={otp.some(d => !d)}
              >
                VERIFY & CONTINUE
                <CheckCircle2 size={20} />
              </Button>

              <button className="mt-8 text-green-500 text-sm font-accent tracking-widest uppercase hover:underline">
                Resend OTP in 59s
              </button>
            </Card>
          </motion.div>
        )}

        {step === 'profile' && (
           <motion.div
             key="profile"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <Card className="p-10 border-green-500/20">
               <h3 className="font-display text-3xl text-white mb-8 uppercase text-center">Complete Profile</h3>
               <form className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-accent tracking-widest text-green-500/50 uppercase ml-1">Full Name</label>
                   <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-green-500/50 text-white" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-accent tracking-widest text-green-500/50 uppercase ml-1">Roll Number</label>
                     <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-green-500/50 text-white" />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-accent tracking-widest text-green-500/50 uppercase ml-1">Year of Study</label>
                     <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-green-500/50 text-white appearance-none">
                       <option className="bg-green-950">1st Year</option>
                       <option className="bg-green-950">2nd Year</option>
                       <option className="bg-green-950">3rd Year</option>
                       <option className="bg-green-950">4th Year</option>
                     </select>
                   </div>
                 </div>
                 <Button type="button" onClick={() => setStep('sports')} className="w-full h-16 mt-4">SAVE PROFILE</Button>
               </form>
             </Card>
           </motion.div>
        )}

        {step === 'sports' && (
          <motion.div
            key="sports"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
             <div className="md:col-span-2 space-y-4">
                <Card className="p-6 border-green-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">🏏</div>
                    <div>
                      <h4 className="font-accent text-white uppercase">Cricket</h4>
                      <p className="text-xs text-green-200/40 uppercase tracking-widest">₹ 250 • Team (11 players)</p>
                    </div>
                  </div>
                  <Button size="sm">SELECT</Button>
                </Card>
                <Card className="p-6 border-white/10 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/50">⚽</div>
                    <div>
                      <h4 className="font-accent text-white/50 uppercase">Football</h4>
                      <p className="text-xs text-white/20 uppercase tracking-widest">FULL • REGISTRATION CLOSED</p>
                    </div>
                  </div>
                  <Button size="sm" disabled>FULL</Button>
                </Card>
             </div>
             
             <div className="space-y-6">
                <Card className="p-8 border-green-500/20 sticky top-24">
                  <h4 className="font-accent text-green-500 uppercase tracking-[0.2em] mb-6">Summary</h4>
                  <div className="flex justify-between mb-4">
                    <span className="text-green-200/40">Registration Fee</span>
                    <span className="text-white">₹ 0</span>
                  </div>
                  <div className="border-t border-white/5 my-6 pt-6 flex justify-between">
                    <span className="text-white font-accent uppercase">Total</span>
                    <span className="text-green-500 font-display text-2xl">₹ 0</span>
                  </div>
                  <Button className="w-full" disabled>CONFIRM REGISTRATION</Button>
                </Card>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
