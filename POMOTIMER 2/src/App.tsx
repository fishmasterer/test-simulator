import { Play, Pause, RotateCcw, SkipForward, Maximize2, ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

export default function App() {
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f1ed] to-[#faf7f4] flex relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff9270]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-[#ffd4c4]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#ff7d52]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 relative z-10 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-gray-900 mb-1">Focus Timer</h1>
            <p className="text-sm text-gray-500">{getGreeting()}, let's stay focused!</p>
          </div>
          <Button variant="ghost" className="gap-2 hover:bg-white/60 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Timer Section - Fixed */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-12 shadow-xl shadow-gray-200/50 border border-white/80">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#ff7d52] to-[#d85a3a] rounded-full"></div>
                <span className="text-gray-800">Work Session</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff7d52]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ffd4c4]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ffd4c4]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#ffd4c4]"></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">Session 1 of 4</span>
              </div>
            </div>

            {/* Timer Display */}
            <div className="flex justify-center mb-14">
              <div className="relative w-80 h-80">
                {/* Outer glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff9270]/20 to-[#ff7d52]/10 blur-2xl"></div>
                
                {/* Circular Progress Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg">
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    fill="none"
                    stroke="#fde4d8"
                    strokeWidth="20"
                  />
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="20"
                    strokeDasharray="880"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ff9270" />
                      <stop offset="100%" stopColor="#d85a3a" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Timer Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff7d52] to-[#d85a3a] text-[5rem] tracking-tight mb-3 drop-shadow-sm">25:00</div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-100/80 backdrop-blur-sm rounded-full">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <div className="text-gray-600 text-sm">No task selected</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-3">
              <Button className="bg-gradient-to-r from-[#d85a3a] to-[#ff7d52] hover:from-[#c54d2f] hover:to-[#e66b46] text-white px-10 py-6 gap-2 shadow-lg shadow-[#ff7d52]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff7d52]/40 hover:scale-105">
                <Play className="w-5 h-5 fill-white" />
                Start
              </Button>
              <Button variant="outline" className="gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-[#ff7d52]/30 transition-all duration-300 py-6">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-[#ff7d52]/30 transition-all duration-300 py-6">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-[#ff7d52]/30 transition-all duration-300 py-6">
                <SkipForward className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:border-[#ff7d52]/30 transition-all duration-300">
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[26rem] bg-white/80 backdrop-blur-xl p-8 overflow-y-auto border-l border-gray-200/50">
        {/* Today's Tasks */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[#d85a3a]">Today's Tasks</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#ff7d52]/30 to-transparent"></div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 text-center mb-4 border border-gray-100 shadow-sm">
            {/* Custom SVG Illustration */}
            <div className="w-24 h-24 mx-auto mb-4">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Clipboard */}
                <rect x="25" y="15" width="50" height="65" rx="4" fill="#fde4d8" stroke="#ff9270" strokeWidth="2"/>
                <rect x="35" y="8" width="30" height="10" rx="3" fill="#ff9270"/>
                <circle cx="50" cy="13" r="2" fill="white"/>
                
                {/* Checkboxes */}
                <rect x="35" y="30" width="8" height="8" rx="2" stroke="#ff7d52" strokeWidth="1.5" fill="none"/>
                <rect x="35" y="45" width="8" height="8" rx="2" stroke="#ff7d52" strokeWidth="1.5" fill="none"/>
                <rect x="35" y="60" width="8" height="8" rx="2" stroke="#ff7d52" strokeWidth="1.5" fill="none"/>
                
                {/* Lines */}
                <line x1="48" y1="34" x2="65" y2="34" stroke="#d85a3a" strokeWidth="2" strokeLinecap="round"/>
                <line x1="48" y1="49" x2="65" y2="49" stroke="#d85a3a" strokeWidth="2" strokeLinecap="round"/>
                <line x1="48" y1="64" x2="62" y2="64" stroke="#d85a3a" strokeWidth="2" strokeLinecap="round"/>
                
                {/* Sparkles */}
                <circle cx="20" cy="25" r="2" fill="#ff9270" opacity="0.6"/>
                <circle cx="78" cy="35" r="1.5" fill="#ff7d52" opacity="0.6"/>
                <circle cx="18" cy="65" r="1.5" fill="#d85a3a" opacity="0.6"/>
                <circle cx="80" cy="70" r="2" fill="#ff9270" opacity="0.6"/>
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-1">No tasks yet</p>
            <p className="text-xs text-gray-400">Add one to get started!</p>
          </div>
          <Button variant="outline" className="w-full border-gray-200 bg-white hover:bg-gradient-to-r hover:from-[#ff7d52] hover:to-[#d85a3a] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm">
            + Add Task
          </Button>
        </div>

        {/* Today's Progress */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[#d85a3a]">Today's Progress</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#ff7d52]/30 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-[#ff9270]/10 to-[#ff7d52]/5 rounded-2xl p-6 text-center border border-[#ff9270]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff7d52] to-[#d85a3a] text-5xl mb-2">0</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">Sessions</div>
            </div>
            <div className="bg-gradient-to-br from-[#ff9270]/10 to-[#ff7d52]/5 rounded-2xl p-6 text-center border border-[#ff9270]/20 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff7d52] to-[#d85a3a] text-5xl mb-2">0m</div>
              <div className="text-xs text-gray-600 uppercase tracking-wider">Focus Time</div>
            </div>
          </div>
          
          {/* Weekly Activity Chart */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-gray-700">This Week</h3>
              <span className="text-xs text-gray-500">5.5 hrs total</span>
            </div>
            <div className="flex items-end justify-between gap-2 h-24">
              {[
                { day: 'M', hours: 2, height: '50%' },
                { day: 'T', hours: 1.5, height: '35%' },
                { day: 'W', hours: 3, height: '75%' },
                { day: 'T', hours: 2.5, height: '60%' },
                { day: 'F', hours: 3.5, height: '90%' },
                { day: 'S', hours: 1, height: '25%' },
                { day: 'S', hours: 0, height: '0%' }
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[#d85a3a] to-[#ff7d52] rounded-t-lg transition-all duration-500"
                      style={{ height: item.height }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button variant="outline" className="w-full border-gray-200 bg-white hover:bg-gradient-to-r hover:from-[#ff7d52] hover:to-[#d85a3a] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm">
            View Analytics
          </Button>
        </div>

        {/* Focus Music Player */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[#d85a3a]">Focus Music</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#ff7d52]/30 to-transparent"></div>
          </div>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff9270]/20 to-[#ff7d52]/10 flex items-center justify-center border border-[#ff9270]/20">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18V5l12-2v13" stroke="#d85a3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="6" cy="18" r="3" stroke="#d85a3a" strokeWidth="2"/>
                  <circle cx="18" cy="16" r="3" stroke="#d85a3a" strokeWidth="2"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-800 mb-1">Lofi Study Beats</div>
                <div className="text-xs text-gray-500">Relaxing Focus</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-[#d85a3a] to-[#ff7d52] rounded-full"></div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-400">1:24</span>
                <span className="text-xs text-gray-400">4:12</span>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button className="w-8 h-8 rounded-full bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center transition-colors">
                <SkipForward className="w-3.5 h-3.5 rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-[#d85a3a] to-[#ff7d52] hover:from-[#c54d2f] hover:to-[#e66b46] flex items-center justify-center shadow-md shadow-[#ff7d52]/30 transition-all hover:scale-105">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white hover:bg-gray-50 border border-gray-200 flex items-center justify-center transition-colors">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[#d85a3a]">Settings</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#ff7d52]/30 to-transparent"></div>
          </div>
          
          {/* Focus Templates */}
          <div className="mb-8">
            <h3 className="text-sm text-gray-600 mb-3">Focus Templates</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gradient-to-br from-white to-gray-50 hover:from-[#ff9270]/10 hover:to-[#ff7d52]/5 rounded-xl p-5 text-center transition-all duration-300 border border-gray-100 hover:border-[#ff7d52]/30 shadow-sm hover:shadow-md group">
                <div className="w-10 h-10 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5L22 15L28 12L24 22H28L18 35L16 25L10 28L14 18H10L20 5Z" fill="url(#lightning)" stroke="#d85a3a" strokeWidth="1.5" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="lightning" x1="10" y1="5" x2="28" y2="35">
                        <stop offset="0%" stopColor="#ff9270"/>
                        <stop offset="100%" stopColor="#ff7d52"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-sm text-gray-800 mb-1">Quick Study</div>
                <div className="text-xs text-gray-500">25/5 min</div>
              </button>
              <button className="bg-gradient-to-br from-white to-gray-50 hover:from-[#ff9270]/10 hover:to-[#ff7d52]/5 rounded-xl p-5 text-center transition-all duration-300 border border-gray-100 hover:border-[#ff7d52]/30 shadow-sm hover:shadow-md group">
                <div className="w-10 h-10 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 5C20 5 18 10 18 15C18 17.7614 18.7375 19 20 19C21.2625 19 22 17.7614 22 15C22 10 20 5 20 5Z" fill="url(#flame1)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <path d="M20 12C20 12 17 15 17 19C17 22 18 25 20 25C22 25 23 22 23 19C23 15 20 12 20 12Z" fill="url(#flame2)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <ellipse cx="20" cy="28" rx="8" ry="7" fill="url(#flame3)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <defs>
                      <linearGradient id="flame1" x1="20" y1="5" x2="20" y2="19">
                        <stop offset="0%" stopColor="#ff9270"/>
                        <stop offset="100%" stopColor="#ff7d52"/>
                      </linearGradient>
                      <linearGradient id="flame2" x1="20" y1="12" x2="20" y2="25">
                        <stop offset="0%" stopColor="#ff9270"/>
                        <stop offset="100%" stopColor="#d85a3a"/>
                      </linearGradient>
                      <linearGradient id="flame3" x1="20" y1="21" x2="20" y2="35">
                        <stop offset="0%" stopColor="#ff7d52"/>
                        <stop offset="100%" stopColor="#d85a3a"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-sm text-gray-800 mb-1">Deep Work</div>
                <div className="text-xs text-gray-500">50/10 min</div>
              </button>
              <button className="bg-gradient-to-br from-white to-gray-50 hover:from-[#ff9270]/10 hover:to-[#ff7d52]/5 rounded-xl p-5 text-center transition-all duration-300 border border-gray-100 hover:border-[#ff7d52]/30 shadow-sm hover:shadow-md group">
                <div className="w-10 h-10 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="10" width="24" height="26" rx="2" fill="url(#book1)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <rect x="10" y="8" width="24" height="26" rx="2" fill="url(#book2)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <rect x="12" y="6" width="24" height="26" rx="2" fill="url(#book3)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <line x1="24" y1="6" x2="24" y2="32" stroke="#d85a3a" strokeWidth="1"/>
                    <line x1="18" y1="12" x2="22" y2="12" stroke="#d85a3a" strokeWidth="1" strokeLinecap="round"/>
                    <line x1="18" y1="16" x2="22" y2="16" stroke="#d85a3a" strokeWidth="1" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="book1" x1="8" y1="10" x2="32" y2="36">
                        <stop offset="0%" stopColor="#ffd4c4"/>
                        <stop offset="100%" stopColor="#ffc4b4"/>
                      </linearGradient>
                      <linearGradient id="book2" x1="10" y1="8" x2="34" y2="34">
                        <stop offset="0%" stopColor="#ff9270"/>
                        <stop offset="100%" stopColor="#ff7d52"/>
                      </linearGradient>
                      <linearGradient id="book3" x1="12" y1="6" x2="36" y2="32">
                        <stop offset="0%" stopColor="#ff9270"/>
                        <stop offset="100%" stopColor="#d85a3a"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-sm text-gray-800 mb-1">Exam Prep</div>
                <div className="text-xs text-gray-500">45/10 min</div>
              </button>
              <button className="bg-gradient-to-br from-white to-gray-50 hover:from-[#ff9270]/10 hover:to-[#ff7d52]/5 rounded-xl p-5 text-center transition-all duration-300 border border-gray-100 hover:border-[#ff7d52]/30 shadow-sm hover:shadow-md group">
                <div className="w-10 h-10 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="20" cy="28" rx="10" ry="3" fill="url(#saucer)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <path d="M12 28V26C12 22 15 18 20 18C25 18 28 22 28 26V28" fill="url(#cup)" stroke="#d85a3a" strokeWidth="1.5"/>
                    <rect x="17" y="15" width="6" height="3" rx="1" fill="#d85a3a"/>
                    <path d="M28 22H30C31.5 22 32 23 32 24C32 25 31.5 26 30 26H28" stroke="#d85a3a" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 10C15 10 16 8 18 8" stroke="#ff9270" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M20 8C20 8 21 6 23 6" stroke="#ff7d52" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M25 10C25 10 26 8 28 8" stroke="#d85a3a" strokeWidth="1.5" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="saucer" x1="10" y1="28" x2="30" y2="28">
                        <stop offset="0%" stopColor="#ffd4c4"/>
                        <stop offset="100%" stopColor="#ff9270"/>
                      </linearGradient>
                      <linearGradient id="cup" x1="20" y1="18" x2="20" y2="28">
                        <stop offset="0%" stopColor="#ff9270"/>
                        <stop offset="100%" stopColor="#d85a3a"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-sm text-gray-800 mb-1">Light Review</div>
                <div className="text-xs text-gray-500">15/5 min</div>
              </button>
            </div>
          </div>

          {/* Duration Settings */}
          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Work Duration (min)</label>
              <Input type="number" defaultValue="25" className="bg-white border-gray-200 shadow-sm focus:border-[#ff7d52] focus:ring-[#ff7d52]/20" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Break Duration (min)</label>
              <Input type="number" defaultValue="5" className="bg-white border-gray-200 shadow-sm focus:border-[#ff7d52] focus:ring-[#ff7d52]/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}