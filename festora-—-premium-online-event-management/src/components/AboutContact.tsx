import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Shield, Heart, Zap, Sparkles } from 'lucide-react';

interface AboutViewProps {
  onExploreEvents: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onExploreEvents }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Our Story & Purpose
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Crafting the Future of Communal Experiences.
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Festora was founded on a simple conviction: meaningful in-person gatherings define culture, fuel breakthrough innovations, and forge lifelong human connections.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Discover</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uncover curated developer summits, artisanal workshops, intimate chamber music concerts, and culinary retreats that enrich personal and professional journeys.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Connect</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bridge the distance between visionary speakers, passionate attendees, and world-class organizers through frictionless ticketing and verified credentials.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Celebrate</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Reignite collective celebration with zero ticketing friction, guaranteed seat reservations, and seamless venue check-in via cryptographic QR passes.
          </p>
        </div>
      </div>

      {/* Architecture Rationale Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Engineered with Java Jakarta Servlets & MySQL</span>
        </div>
        <h2 className="text-2xl font-bold">
          High-Throughput Concurrency & Rock-Solid Reliability
        </h2>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Behind Festora's clean interface lies an enterprise Java backend using Jakarta Servlets 6, HikariCP connection pooling, BCrypt salted credential hashing, and fair ReentrantLock synchronization to guarantee zero overbooking even when thousands of users attempt to purchase the last available tickets simultaneously.
        </p>
        <div className="pt-2">
          <button
            onClick={onExploreEvents}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Explore Festora Events
          </button>
        </div>
      </div>

    </div>
  );
};

export const ContactView: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          We'd Love to Hear from You
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have an inquiry about hosting an event on Festora or question regarding your ticket booking? Drop us a message below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Festora Headquarters</h3>
            <p className="text-xs text-slate-500">Event Operations & Community Relations</p>
          </div>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Location</span>
                <span>555 Mission St, San Francisco, CA 94105</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Email Inquiries</span>
                <span className="font-mono text-indigo-600">support@festora.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Phone Support</span>
                <span>+1 (800) 555-FEST (3378)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
            Support hours: Mon–Fri, 8:00 AM – 6:00 PM PST. Emergency event check-in support available 24/7.
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Thank You for Reaching Out!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your message has been received by our community operations team. We will respond to <span className="font-semibold text-slate-700">{email}</span> within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Organizer Partnership / Ticketing Question"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our event team assist you today?"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
