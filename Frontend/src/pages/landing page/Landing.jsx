import React from "react";
import { Link } from "react-router";
import routeConfig from "../../app/router/routeConfig";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1C1C1C] font-sans selection:bg-[#F97316] selection:text-white pb-10">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E8DDD0] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-black text-[#F97316] tracking-tight hover:opacity-80 transition-opacity">
                SkillTree
              </Link>
            </div>
            
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">Home</a>
              <a href="#how-it-works" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">How It Works</a>
              <a href="#for-recruiters" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">For Recruiters</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to={routeConfig?.login || "/login"} className="text-[#1C1C1C] font-medium px-5 py-2.5 rounded-lg border-2 border-[#E8DDD0] hover:border-[#1C1C1C] transition-all">
                Login
              </Link>
              <Link to={routeConfig?.signup || "/signup"} className="bg-[#F97316] text-white font-medium px-5 py-2.5 rounded-lg hover:bg-[#e86610] shadow-md shadow-orange-500/20 transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section id="home" className="pt-24 pb-20 md:pt-32 md:pb-32 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl md:w-1/2">
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-[#1C1C1C] mb-6">
              Your Skills, Verified.<br />
              <span className="text-[#F97316]">Your Future, Unlocked.</span>
            </h1>
            <p className="text-xl text-[#6B6B6B] mb-10 leading-relaxed md:max-w-xl">
              SkillTree uses AI to verify what you actually know — not just what you claim. Get matched with startups and companies that need your real skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
               <Link to={routeConfig?.signup || "/signup"} className="text-center bg-[#F97316] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#e86610] hover:-translate-y-1 shadow-lg shadow-orange-500/25 transition-all duration-300">
                Start Verification
              </Link>
              <a href="#how-it-works" className="text-center bg-transparent text-[#1C1C1C] font-bold px-8 py-4 rounded-lg border-2 border-[#E8DDD0] hover:border-[#1C1C1C] hover:bg-white transition-all duration-300">
                See How It Works
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center lg:justify-end">
             <div className="relative bg-white p-8 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-[#E8DDD0] max-w-md w-full rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute -top-4 -right-4 bg-[#F97316] text-white font-bold py-2 px-4 rounded-xl shadow-lg transform rotate-12">
                  Top 5%
                </div>
                <div className="flex items-center gap-4 border-b border-[#E8DDD0] pb-6 mb-6">
                   <div className="w-16 h-16 bg-[#F5F0EB] rounded-full flex items-center justify-center text-2xl font-bold text-[#F97316]">
                     ST
                   </div>
                   <div>
                     <h3 className="font-bold text-xl">Sarah Tech</h3>
                     <p className="text-[#6B6B6B]">Verified Full Stack</p>
                   </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">React.js</span>
                      <span className="font-bold text-[#F97316]">Master</span>
                    </div>
                    <div className="w-full bg-[#F5F0EB] rounded-full h-2">
                       <div className="bg-[#F97316] h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">System Design</span>
                      <span className="font-bold text-[#1C1C1C]">Advanced</span>
                    </div>
                    <div className="w-full bg-[#F5F0EB] rounded-full h-2">
                       <div className="bg-[#1C1C1C] h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 border-y border-[#E8DDD0]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#E8DDD0]">
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-4xl font-black text-[#F97316] mb-2">2,000+</span>
              <span className="font-medium text-[#6B6B6B] uppercase tracking-wider text-sm">Students Verified</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-4xl font-black text-[#F97316] mb-2">50+</span>
              <span className="font-medium text-[#6B6B6B] uppercase tracking-wider text-sm">Companies Hiring</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-4xl font-black text-[#F97316] mb-2">30 Days</span>
              <span className="font-medium text-[#6B6B6B] uppercase tracking-wider text-sm">To First Interview</span>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1C1C] mb-4">How SkillTree Works</h2>
            <p className="text-[#6B6B6B] text-lg max-w-2xl mx-auto">Skip the generic coding tests. Prove your unique abilities tailored to real-world engineering.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-[#E8DDD0] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
               <div className="w-14 h-14 bg-[#F5F0EB] rounded-2xl flex items-center justify-center text-2xl font-black text-[#F97316] mb-6">
                 1
               </div>
               <h3 className="text-2xl font-bold mb-4">Declare Your Skills</h3>
               <p className="text-[#6B6B6B] leading-relaxed">
                 You tell us what you know. Select your tech stack, frameworks, and core engineering concepts.
               </p>
            </div>
             {/* Step 2 */}
             <div className="bg-white p-8 rounded-2xl border border-[#E8DDD0] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
               <div className="w-14 h-14 bg-[#F5F0EB] rounded-2xl flex items-center justify-center text-2xl font-black text-[#F97316] mb-6">
                 2
               </div>
               <h3 className="text-2xl font-bold mb-4">AI Verifies You</h3>
               <p className="text-[#6B6B6B] leading-relaxed">
                 Our system tests real understanding through adaptive, conversational questions — not just multiple choice.
               </p>
            </div>
             {/* Step 3 */}
             <div className="bg-white p-8 rounded-2xl border border-[#E8DDD0] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
               <div className="w-14 h-14 bg-[#F5F0EB] rounded-2xl flex items-center justify-center text-2xl font-black text-[#F97316] mb-6">
                 3
               </div>
               <h3 className="text-2xl font-bold mb-4">Get Discovered</h3>
               <p className="text-[#6B6B6B] leading-relaxed">
                 Verified profiles get seen by the right companies looking for your exact, proven capabilities.
               </p>
            </div>
          </div>
        </section>

        {/* For Students Section */}
        <section className="py-24 bg-[#F5F0EB] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">Built for students who are skilled but <span className="text-[#6B6B6B] italic">invisible.</span></h2>
              <p className="text-lg text-[#6B6B6B] mb-8 leading-relaxed">
                Resumes don't capture real ability. GPA doesn't measure code quality. Stand out based on your actual problem-solving skills, architecture decisions, and code execution. 
              </p>
              <Link to={routeConfig?.signup || "/signup"} className="inline-block bg-[#F97316] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#e86610] shadow-md transition-all">
                Build Your Profile
              </Link>
            </div>
            <div className="w-full md:w-1/2">
               <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#E8DDD0]">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-20 h-20 bg-gradient-to-br from-[#E8DDD0] to-[#F5F0EB] rounded-2xl flex items-center justify-center text-3xl font-bold text-[#1C1C1C]">
                     JS
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold">John Smith</h3>
                     <p className="text-[#6B6B6B]">Computer Science @ University</p>
                   </div>
                 </div>
                 
                 <h4 className="font-bold text-sm text-[#6B6B6B] uppercase tracking-wider mb-4">Verified Badges</h4>
                 <div className="flex flex-wrap gap-3 mb-8">
                   <span className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200">System Design</span>
                   <span className="px-4 py-2 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200">Algorithms</span>
                   <span className="px-4 py-2 bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200">React.js</span>
                 </div>

                 <div className="bg-[#F5F0EB] p-4 rounded-xl flex justify-between items-center">
                   <span className="font-bold">Overall SkillScore™</span>
                   <span className="text-2xl font-black text-[#F97316]">94/100</span>
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* For Recruiters Section */}
        <section id="for-recruiters" className="py-24">
          <div className="bg-white rounded-3xl p-10 md:p-16 border-2 border-[#E8DDD0] shadow-sm">
             <div className="flex flex-col md:flex-row gap-16 items-center">
                <div className="md:w-1/2">
                   <h2 className="text-4xl md:text-5xl font-black mb-6">Find candidates by what they actually know.</h2>
                   <p className="text-lg text-[#6B6B6B] mb-8 leading-relaxed">
                     Stop filtering by keywords and university degrees. Hire pre-vetted engineers using our structured skill data.
                   </p>
                   <button className="bg-[#1C1C1C] text-white font-bold px-8 py-4 rounded-lg hover:bg-black shadow-md transition-all">
                      Post a Role
                   </button>
                </div>
                <div className="md:w-1/2 space-y-8">
                   <div className="flex gap-4">
                     <div className="w-12 h-12 shrink-0 bg-[#F5F0EB] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                     </div>
                     <div>
                       <h4 className="text-xl font-bold mb-2">Verified Profiles Only</h4>
                       <p className="text-[#6B6B6B]">Every candidate on SkillTree has undergone rigorous AI testing.</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <div className="w-12 h-12 shrink-0 bg-[#F5F0EB] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                     </div>
                     <div>
                       <h4 className="text-xl font-bold mb-2">Filtered Search</h4>
                       <p className="text-[#6B6B6B]">Search exactly for "React level &gt; 80" or "System Design mastery".</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <div className="w-12 h-12 shrink-0 bg-[#F5F0EB] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                     </div>
                     <div>
                       <h4 className="text-xl font-bold mb-2">Structured Data</h4>
                       <p className="text-[#6B6B6B]">Export skill analytics into your ATS instantly.</p>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-24 text-center px-4 max-w-4xl mx-auto">
          <span className="text-7xl font-serif text-[#F97316] leading-none block mb-6">"</span>
          <h2 className="text-3xl md:text-5xl font-medium italic mb-8 leading-snug">
            I had 900 LeetCode problems solved and zero interviews. <span className="font-bold">SkillTree changed that.</span>
          </h2>
          <p className="text-xl font-bold text-[#6B6B6B]">— John, Full Stack Developer</p>
        </section>

      </main>

      {/* Final CTA Section */}
      <section className="bg-[#1C1C1C] py-32 mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to get verified?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of students proving their real ability.</p>
          <Link to={routeConfig?.signup || "/signup"} className="inline-block bg-[#F97316] text-white font-bold px-10 py-5 rounded-xl text-xl hover:bg-[#e86610] hover:scale-105 shadow-xl shadow-orange-500/30 transition-all duration-300">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F0EB] pt-20 pb-10 border-t border-[#E8DDD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="text-2xl font-black text-[#F97316] hover:opacity-80 transition-opacity block mb-4">
                SkillTree
              </Link>
              <p className="text-[#6B6B6B]">AI-powered skill verification for the modern engineer.</p>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-[#1C1C1C]">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#home" className="text-[#6B6B6B] hover:text-[#F97316] transition-colors">Home</a></li>
                <li><a href="#how-it-works" className="text-[#6B6B6B] hover:text-[#F97316] transition-colors">How It Works</a></li>
                <li><a href="#for-recruiters" className="text-[#6B6B6B] hover:text-[#F97316] transition-colors">For Recruiters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-[#1C1C1C]">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#6B6B6B] hover:text-[#F97316] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[#6B6B6B] hover:text-[#F97316] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-[#1C1C1C]">Contact</h4>
              <ul className="space-y-4">
                <li><a href="mailto:hello@skilltree.com" className="text-[#6B6B6B] hover:text-[#F97316] transition-colors">hello@skilltree.com</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#E8DDD0] text-center text-sm font-medium text-[#6B6B6B]">
            &copy; 2025 SkillTree. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}