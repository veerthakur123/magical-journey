import React, { useState, useEffect, useRef } from 'react';
import FluffyHeart from './FluffyHeart';
import GardenBackground from './GardenBackground';
import './App.css';

const App = () => {
  // ---- State ----
  const [currentScene, setCurrentScene] = useState(0);
  const [showWaterDrop, setShowWaterDrop] = useState(true);
  const [waterDroplet, setWaterDroplet] = useState({ x: 50, y: -15, scale: 0.5 });
  const [showExplosion, setShowExplosion] = useState(false);
  const [showSunRing, setShowSunRing] = useState(false);
  const [sunRingScale, setSunRingScale] = useState(0);
  const [showBoy, setShowBoy] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [particles, setParticles] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFound, setShowFound] = useState(false);
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [showMemoryInput, setShowMemoryInput] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [magicSparkles, setMagicSparkles] = useState([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [messages, setMessages] = useState([]);
  const [earthRotation, setEarthRotation] = useState(0);
  const [dropTrail, setDropTrail] = useState([]);
  const [storyTextIndex, setStoryTextIndex] = useState(0);
  const [showStoryText, setShowStoryText] = useState(false);
  const [followState, setFollowState] = useState('idle');
  const [notification1, setNotification1] = useState(false);
  const [notification2, setNotification2] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const feedRef = useRef(null);
  const scrollInterval = useRef(null);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatIntervalRef = useRef(null);

  const storyTexts = [
    { text: "A single drop can change everything...", delay: 500 },
    { text: "A connection waiting to happen...", delay: 1500 },
    { text: "A journey begins...", delay: 2500 },
  ];

  const chatMessages = [
    { from: 'me', text: 'Hey! I saw your profile, you seem really interesting ✨', typing: false },
    { from: 'her', text: 'Oh, thanks... but I get a lot of DMs, sorry 😅', typing: true },
    { from: 'me', text: 'I know, I\'m just another guy, right? But I promise I\'m different.', typing: false },
    { from: 'her', text: 'Haha, that\'s what they all say 😂', typing: true },
    { from: 'me', text: 'Okay, fair enough. But I\'m genuinely curious about your work as a doctor – it\'s inspiring.', typing: false },
    { from: 'her', text: 'Wait... you actually looked at my posts? Most people don\'t even read the captions.', typing: true },
    { from: 'me', text: 'Of course I did! The one about healing hearts? That hit deep.', typing: false },
    { from: 'her', text: '😳 ...okay, you got my attention. Keep going.', typing: true },
    { from: 'me', text: 'I\'d love to know more about your journey. Coffee sometime? Or just a chat?', typing: false },
    { from: 'her', text: 'Hmm... you\'re persistent. I like that. Sure, let\'s talk. But don\'t make me regret it 😉', typing: true },
    { from: 'me', text: 'Deal! You won\'t regret it. 💖', typing: false },
  ];

  const posts = [
    { id: 1, user: 'shataakshi_doctor', image: '🏥', caption: 'Healing hearts ❤️', likes: 234 },
    { id: 2, user: 'shataakshi_doctor', image: '📚', caption: 'Medical school 📖', likes: 189 },
    { id: 3, user: 'shataakshi_doctor', image: '🌺', caption: 'Spread love 🌸', likes: 312 },
    { id: 4, user: 'shataakshi_doctor', image: '✨', caption: 'Chasing dreams ✨', likes: 156 },
    { id: 5, user: 'shataakshi_doctor', image: '🎨', caption: 'Art of healing 🎨', likes: 278 },
  ];

  const phases = [
    { emoji: '🔍', text: 'You discovered Shataakshi on Instagram' },
    { emoji: '👀', text: 'Her profile caught your eye' },
    { emoji: '❤️', text: 'You knew she was special' },
    { emoji: '📩', text: 'You sent the follow request' },
    { emoji: '✨', text: 'She accepted your request! ✨' },
  ];

  // ---- Effects ----
  useEffect(() => {
    const sparkles = [];
    for (let i = 0; i < 30; i++) {
      sparkles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 5,
        speed: 0.5 + Math.random() * 1,
      });
    }
    setMagicSparkles(sparkles);
  }, []);

  // ---- MUSIC SETUP ----
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;
      audioRef.current.src = '/music.mp3';
      audioRef.current.onerror = () => {
        console.warn('Local music not found, using fallback.');
        audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        audioRef.current.load();
      };
      audioRef.current.load();
    }
  }, []);

  // Try to play when user interacts
  useEffect(() => {
    if (hasUserInteracted && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {});
    }
  }, [hasUserInteracted]);

  // Toggle music
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }
    }
  };

  const MusicButton = ({ isPlaying, toggle }) => (
    <button className="music-btn" onClick={toggle}>
      {isPlaying ? '🔊' : '🔇'}
    </button>
  );

  // ---- Earth rotation ----
  useEffect(() => {
    if (currentScene === 0) {
      const interval = setInterval(() => {
        setEarthRotation(prev => (prev + 0.15) % 360);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentScene]);

  // ---- Water drop trail ----
  useEffect(() => {
    if (currentScene === 0 && showWaterDrop) {
      const interval = setInterval(() => {
        setDropTrail(prev => {
          const newTrail = [...prev, { y: waterDroplet.y, x: 50 + (waterDroplet.wobble || 0) }];
          if (newTrail.length > 20) newTrail.shift();
          return newTrail;
        });
      }, 40);
      return () => clearInterval(interval);
    } else {
      setDropTrail([]);
    }
  }, [currentScene, showWaterDrop, waterDroplet]);

  // ---- Water drop animation ----
  useEffect(() => {
    if (currentScene === 0 && showWaterDrop) {
      const interval = setInterval(() => {
        setWaterDroplet(prev => {
          const wobble = Math.sin(Date.now() / 100) * 0.03;
          const scale = 0.5 + (prev.y / 60) * 0.8;
          if (prev.y >= 52) {
            setShowWaterDrop(false);
            setShowExplosion(true);
            setShowSunRing(true);
            createExplosion();
            let ringSize = 0;
            const ringInterval = setInterval(() => {
              ringSize += 0.035;
              setSunRingScale(ringSize);
              if (ringSize >= 5.5) {
                clearInterval(ringInterval);
                setShowSunRing(false);
                setShowStoryText(true);
                setTimeout(() => {
                  setShowStoryText(false);
                  setCurrentScene(1);
                }, 4000);
              }
            }, 25);
            const newRipples = [];
            for (let i = 0; i < 6; i++) {
              newRipples.push({
                size: 10 + i * 30,
                opacity: 0.7 - i * 0.1,
                delay: i * 120,
              });
            }
            setRipples(newRipples);
            clearInterval(interval);
            return prev;
          }
          return {
            ...prev,
            y: prev.y + 0.9 + (prev.y / 30) * 0.5,
            scale,
            wobble,
          };
        });
      }, 16);
      return () => clearInterval(interval);
    }
  }, [currentScene, showWaterDrop]);

  const createExplosion = () => {
    const newParticles = [];
    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 18;
      const colorHue = 10 + Math.random() * 30;
      newParticles.push({
        x: 50,
        y: 52,
        vx: Math.cos(angle) * speed * (0.3 + Math.random() * 0.7),
        vy: Math.sin(angle) * speed * (0.3 + Math.random() * 0.7) - 6,
        size: 3 + Math.random() * 8,
        life: 1,
        color: `hsl(${colorHue}, 100%, ${45 + Math.random() * 35}%)`,
        type: 'lava',
        gravity: 0.1 + Math.random() * 0.08,
      });
    }
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 20;
      newParticles.push({
        x: 50,
        y: 52,
        vx: Math.cos(angle) * speed * (0.4 + Math.random() * 0.6),
        vy: Math.sin(angle) * speed * (0.4 + Math.random() * 0.6) - 8,
        size: 1 + Math.random() * 3,
        life: 1,
        color: `hsl(45, 100%, ${70 + Math.random() * 30}%)`,
        type: 'sparkle',
        gravity: 0.02,
      });
    }
    setParticles(newParticles);
  };

  useEffect(() => {
    if (showExplosion) {
      const interval = setInterval(() => {
        setParticles(prev => {
          const updated = prev.map(p => ({
            ...p,
            x: p.x + p.vx * 0.8,
            y: p.y + p.vy * 0.8,
            vy: p.vy + p.gravity,
            life: p.life - 0.015,
            size: p.size * 0.997,
            vx: p.vx * 0.99,
          }));
          return updated.filter(p => p.life > 0);
        });
      }, 16);
      return () => clearInterval(interval);
    }
  }, [showExplosion]);

  useEffect(() => {
    if (showStoryText) {
      let index = 0;
      const timers = storyTexts.map((item, i) => {
        return setTimeout(() => {
          setStoryTextIndex(i);
        }, item.delay);
      });
      return () => timers.forEach(t => clearTimeout(t));
    } else {
      setStoryTextIndex(0);
    }
  }, [showStoryText, storyTexts]);

  // Reset follow state when entering scene 3
  useEffect(() => {
    if (currentScene === 3) {
      setFollowState('idle');
      setNotification1(false);
      setNotification2(false);
    }
  }, [currentScene]);

  // Scene transitions
  useEffect(() => {
    if (currentScene === 1) {
      setTimeout(() => setShowBoy(true), 200);
      setTimeout(() => setCurrentScene(2), 3000);
    }
  }, [currentScene]);

  useEffect(() => {
    if (currentScene === 2) {
      setShowInstagram(true);
      setTimeout(() => {
        let scrollAmount = 0;
        scrollInterval.current = setInterval(() => {
          if (feedRef.current) {
            scrollAmount += 2.5;
            feedRef.current.scrollTop = scrollAmount;
            const progress = (scrollAmount / (feedRef.current.scrollHeight - feedRef.current.clientHeight)) * 100;
            setScrollProgress(progress);
            if (progress > 40) {
              setShowFound(true);
              clearInterval(scrollInterval.current);
              setTimeout(() => setCurrentScene(3), 800);
            }
          }
        }, 30);
      }, 500);
      return () => clearInterval(scrollInterval.current);
    }
  }, [currentScene]);

  useEffect(() => {
    if (currentScene === 3) {
      setShowProfile(true);
    }
  }, [currentScene]);

  useEffect(() => {
    if (currentScene === 4) {
      setRequestSent(true);
      setRequestPending(true);
      setTimeout(() => {
        setRequestPending(false);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setCurrentScene(6);
        }, 2500);
      }, 2000);
    }
  }, [currentScene]);

  // ---- CHAT EFFECT (SIMPLIFIED & RELIABLE) ----
  useEffect(() => {
    if (currentScene === 7) {
      // Reset messages and typing state when entering chat
      setMessages([]);
      setIsTyping(false);
      setChatStarted(false);

      // Clear any existing interval
      if (chatIntervalRef.current) {
        clearInterval(chatIntervalRef.current);
        chatIntervalRef.current = null;
      }

      let index = 0;
      let timeoutId = null;

      const showNextMessage = () => {
        if (index < chatMessages.length) {
          const msg = chatMessages[index];
          
          if (msg.from === 'her' && msg.typing) {
            // Show typing indicator
            setIsTyping(true);
            timeoutId = setTimeout(() => {
              setIsTyping(false);
              setMessages(prev => [...prev, { from: msg.from, text: msg.text }]);
              index++;
              // Scroll to bottom
              setTimeout(() => {
                if (messagesEndRef.current) {
                  messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
              // Schedule next message after a short delay
              timeoutId = setTimeout(showNextMessage, 800);
            }, 1200);
          } else {
            // Show message immediately (for 'me' messages)
            setMessages(prev => [...prev, { from: msg.from, text: msg.text }]);
            index++;
            setTimeout(() => {
              if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
            // Schedule next message after a delay
            timeoutId = setTimeout(showNextMessage, 800);
          }
        } else {
          // All messages shown - proceed to next scene
          setTimeout(() => {
            setCurrentScene(8);
          }, 2000);
        }
      };

      // Start the chat after a small delay
      const startDelay = setTimeout(showNextMessage, 800);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(startDelay);
        if (chatIntervalRef.current) {
          clearInterval(chatIntervalRef.current);
          chatIntervalRef.current = null;
        }
        setIsTyping(false);
      };
    }
  }, [currentScene]);

  // ---- Functions ----
  const addMemory = () => {
    if (newMemory.trim()) {
      setMemories([...memories, {
        id: Date.now(),
        text: newMemory,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      }]);
      setNewMemory('');
      setShowMemoryInput(false);
    }
  };

  // ==================== RENDER ====================

  // ---- SCENE 0: CINEMATIC 3D INTRO ----
  if (currentScene === 0) {
    return (
      <div className="scene-container scene-earth">
        <audio ref={audioRef} />
        
        {/* Music start overlay - WITH TOUCH SUPPORT */}
        {!hasUserInteracted && (
          <div 
            className="music-start-overlay"
            onClick={() => setHasUserInteracted(true)}
            onTouchStart={() => setHasUserInteracted(true)}
          >
            <div className="music-start-prompt">
              <span>🎵</span>
              <p>Tap anywhere to start the journey</p>
            </div>
          </div>
        )}

        <div className="scene-earth-wrapper">
          <div className="stars-layer">
            {magicSparkles.map((s, i) => (
              <div key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${2 + s.speed}s` }} />
            ))}
          </div>
          <div className="vignette-overlay"></div>
          <div className="earth-container">
            <div className="earth-wrapper" style={{ transform: `rotateY(${earthRotation}deg)` }}>
              <div className="earth-sphere">
                <div className="earth-surface">
                  <div className="earth-continents"></div>
                  <div className="earth-ocean"></div>
                  <div className="earth-clouds"></div>
                </div>
                <div className="earth-atmosphere"></div>
                <div className="earth-core-glow"></div>
              </div>
            </div>
            <div className="earth-shadow"></div>
          </div>

          {showWaterDrop && (
            <div className="water-drop-space" style={{ top: `${waterDroplet.y}%`, left: `${50 + (waterDroplet.wobble || 0)}%`, transform: `translate(-50%, -50%) scale(${waterDroplet.scale})` }}>
              {dropTrail.map((t, i) => (
                <div key={i} className="drop-trail-particle" style={{ top: `${t.y}%`, left: `${t.x + (waterDroplet.wobble || 0)}%`, opacity: 0.6 - (i / dropTrail.length) * 0.5, transform: `scale(${0.3 + (i / dropTrail.length) * 0.5})` }} />
              ))}
              <div className="drop-shape-space">
                <svg viewBox="0 0 100 120">
                  <defs>
                    <radialGradient id="dropGradSpace" cx="35%" cy="30%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.98)"/>
                      <stop offset="40%" stopColor="rgba(200,240,255,0.9)"/>
                      <stop offset="100%" stopColor="rgba(100,200,255,0.6)"/>
                    </radialGradient>
                    <filter id="dropGlowSpace">
                      <feGaussianBlur stdDeviation="5" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path d="M50 8 C50 8, 88 50, 88 75 C88 96, 72 112, 50 112 C28 112, 12 96, 12 75 C12 50, 50 8, 50 8Z" fill="url(#dropGradSpace)" filter="url(#dropGlowSpace)"/>
                  <ellipse cx="32" cy="30" rx="12" ry="8" fill="rgba(255,255,255,0.6)" transform="rotate(-25, 32, 30)"/>
                  <ellipse cx="65" cy="80" rx="6" ry="4" fill="rgba(255,255,255,0.15)" transform="rotate(20, 65, 80)"/>
                </svg>
              </div>
              <div className="drop-glow-space"></div>
            </div>
          )}

          {showExplosion && (
            <div className="explosion-earth">
              {showSunRing && (
                <div className="earth-ring" style={{ transform: `translate(-50%, -50%) scale(${sunRingScale}) rotateX(15deg)`, opacity: sunRingScale < 4 ? 1 : Math.max(0, 1 - (sunRingScale - 4) / 1.5) }} />
              )}
              {ripples.map((ripple, i) => (
                <div key={i} className="earth-ripple" style={{ width: ripple.size, height: ripple.size, opacity: ripple.opacity, animationDelay: `${ripple.delay}ms` }} />
              ))}
              {particles.map((p, i) => (
                <div key={i} className={`particle-earth ${p.type}`} style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, borderRadius: p.type === 'sparkle' ? '50%' : '50% 50% 0 50%', opacity: p.life, transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + p.life * 0.5})`, boxShadow: p.type === 'sparkle' ? `0 0 ${p.size * 4}px ${p.color}` : `0 0 ${p.size * 2}px rgba(255,100,0,0.6)` }} />
              ))}
            </div>
          )}

          {showStoryText && (
            <div className="story-text-overlay">
              <div className="welcome-container">
                <div className="welcome-title">✨ Welcome ✨</div>
                {storyTexts.map((item, i) => (
                  <div key={i} className={`story-text ${i <= storyTextIndex ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.3 + 0.5}s` }}>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cosmic-rays">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="cosmic-ray" style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 1: BOY WITH PHONE ----
  if (currentScene === 1) {
    return (
      <div className="scene-container scene-boy-phone">
        <audio ref={audioRef} />
        <GardenBackground />
        <FluffyHeart />
        <div className="magic-sparkles">
          {magicSparkles.map((s, i) => (
            <div key={i} className="magic-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />
          ))}
        </div>
        
        <div className={`boy-phone-container ${showBoy ? 'visible' : ''}`}>
          <div className="boy-character">
            <div className="boy-head">
              <div className="boy-hair"></div>
              <div className="boy-face">
                <div className="boy-eyes">
                  <div className="eye left-eye"></div>
                  <div className="eye right-eye"></div>
                </div>
                <div className="boy-smile"></div>
              </div>
            </div>
            <div className="boy-body">
              <div className="boy-arm left-arm"></div>
              <div className="boy-arm right-arm">
                <div className="phone-frame">
                  <div className="phone-screen">
                    <div className="mini-feed">
                      <div className="mini-post"><span>🏥</span><span>❤️ 234</span></div>
                      <div className="mini-post"><span>📚</span><span>❤️ 189</span></div>
                      <div className="mini-post"><span>🌺</span><span>❤️ 312</span></div>
                    </div>
                  </div>
                  <div className="phone-button"></div>
                </div>
              </div>
              <div className="boy-legs">
                <div className="leg left-leg"></div>
                <div className="leg right-leg"></div>
              </div>
            </div>
          </div>

          <div className="boy-info">
            <h2 className="boy-name">Manish</h2>
            <p className="boy-description">✨ A curious soul begins his journey ✨</p>
          </div>
        </div>

        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 2: INSTAGRAM FEED ----
  if (currentScene === 2) {
    return (
      <div className="scene-container scene-instagram">
        <audio ref={audioRef} />
        <GardenBackground /><FluffyHeart />
        <div className="scene-content">
          <div className="insta-scroll-container">
            <div className="insta-header-glass">
              <div className="insta-logo">📸 Instagram</div>
              <div className="insta-icons">❤️ 💬 🔍</div>
            </div>
            <div className="stories-bar">
              {['👤', '👩‍⚕️', '🌺', '🎨'].map((emoji, i) => (
                <div key={i} className="story"><div className="story-circle">{emoji}</div><span>{['Your Story', 'Shataakshi', 'Healing', 'Art'][i]}</span></div>
              ))}
            </div>
            <div className="feed-scroll" ref={feedRef}>
              {posts.map((post, idx) => (
                <div key={post.id} className="post-glass" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="post-header"><div className="post-user"><div className="avatar">👩‍⚕️</div><span className="username">{post.user}</span></div><span className="post-time">{idx + 2}h ago</span></div>
                  <div className="post-image">{post.image}</div>
                  <div className="post-actions"><span>❤️ {post.likes}</span><span>💬 {Math.floor(Math.random() * 20 + 5)}</span><span>📤 Share</span></div>
                  <div className="post-caption">{post.caption}</div>
                </div>
              ))}
              {showFound && <div className="found-flash"><span>✨</span><p>💖 Found someone magical... 💖</p></div>}
            </div>
            <div className="scroll-indicator"><div className="scroll-bar"><div className="scroll-fill" style={{ width: `${Math.min(scrollProgress, 100)}%` }}></div></div></div>
          </div>
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 3: PROFILE + FOLLOW ----
  if (currentScene === 3) {
    const handleFollow = () => {
      setFollowState('requested');
      setTimeout(() => {
        setFollowState('following');
        setNotification1(true);
        setTimeout(() => {
          setNotification2(true);
          setTimeout(() => {
            setCurrentScene(4);
          }, 1500);
        }, 1000);
      }, 1500);
    };

    return (
      <div className="scene-container scene-found-char">
        <audio ref={audioRef} />
        <GardenBackground /><FluffyHeart />
        <div className="magic-sparkles">
          {magicSparkles.map((s, i) => (
            <div key={i} className="magic-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size * 1.5, height: s.size * 1.5, animationDelay: `${s.delay}s` }} />
          ))}
        </div>
        
        <div className="notifications-container">
          {notification1 && (
            <div className="notification-item accept-notification">
              <div className="notification-icon">✅</div>
              <div className="notification-content">
                <span className="notification-text"><strong>Shataakshi</strong> accepted your follow request</span>
                <span className="notification-time">Just now</span>
              </div>
            </div>
          )}
          {notification2 && (
            <div className="notification-item follow-notification">
              <div className="notification-icon">👤</div>
              <div className="notification-content">
                <span className="notification-text"><strong>Shataakshi</strong> started following you</span>
                <span className="notification-time">Just now</span>
              </div>
            </div>
          )}
        </div>

        <div className="scene-content">
          <div className="found-character-container">
            <div className="found-profile-card-char">
              <div className="found-glow"></div>
              
              <div className="girl-character">
                <div className="girl-head">
                  <div className="girl-hair"></div>
                  <div className="girl-hair-bun"></div>
                  <div className="girl-face">
                    <div className="girl-eyes">
                      <div className="eye left-eye"></div>
                      <div className="eye right-eye"></div>
                    </div>
                    <div className="girl-smile"></div>
                    <div className="girl-blush"></div>
                  </div>
                </div>
                <div className="girl-body">
                  <div className="girl-arm left-arm"></div>
                  <div className="girl-arm right-arm"></div>
                  <div className="stethoscope">
                    <div className="stethoscope-ear"></div>
                    <div className="stethoscope-tube"></div>
                    <div className="stethoscope-chest"></div>
                  </div>
                  <div className="girl-dress"></div>
                  <div className="girl-legs">
                    <div className="leg left-leg"></div>
                    <div className="leg right-leg"></div>
                  </div>
                </div>
              </div>

              <h2>Dr. Shataakshi</h2>
              <p className="found-handle">@shataakshi_doctor</p>
              <p className="found-bio">💊 Doctor • Healer • Dreamer</p>
              
              <div className="found-stats">
                <div><span>2.4k</span> Followers</div>
                <div><span>456</span> Following</div>
                <div><span>12</span> Posts</div>
              </div>

              <div className="profile-posts-grid">
                <div className="post-thumb">🏥</div>
                <div className="post-thumb">📚</div>
                <div className="post-thumb">🌺</div>
                <div className="post-thumb">✨</div>
                <div className="post-thumb">🎨</div>
                <div className="post-thumb">💊</div>
              </div>

              <button 
                className={`follow-btn-real ${followState}`}
                onClick={handleFollow}
                onTouchStart={handleFollow}
                disabled={followState !== 'idle'}
              >
                {followState === 'idle' && 'Follow'}
                {followState === 'requested' && 'Requested'}
                {followState === 'following' && '✓ Following'}
              </button>
            </div>
          </div>
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 4: CELEBRATION ----
  if (currentScene === 4) {
    return (
      <div className="scene-container scene-celebration">
        <audio ref={audioRef} />
        <GardenBackground /><FluffyHeart />
        <div className="magic-sparkles">{magicSparkles.map((s, i) => <div key={i} className="magic-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />)}</div>
        <div className="scene-content">
          {showCelebration && (
            <div className="celebration-overlay">
              <div className="celebration-content">
                <div className="sparkles">✨🌟💫✨🌟💫</div>
                <h1 className="celebration-title">🎉 Followed! 🎉</h1>
                <p className="celebration-subtitle">💖 Your journey with Shataakshi begins 💖</p>
                <div className="celebration-couple">🧑‍💻 💖 👩‍⚕️</div>
              </div>
            </div>
          )}
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 6: JOURNEY TIMELINE ----
  if (currentScene === 6) {
    return (
      <div className="scene-container scene-journey">
        <audio ref={audioRef} />
        <GardenBackground /><FluffyHeart />
        <div className="magic-sparkles">{magicSparkles.map((s, i) => <div key={i} className="magic-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />)}</div>
        <div className="scene-content">
          <div className="journey-container">
            <div className="journey-header"><h1>💖 Your Journey with Shataakshi</h1></div>
            <div className="timeline">
              {phases.map((phase, index) => (
                <div key={index} className="timeline-item" style={{ animationDelay: `${index * 0.15}s` }}>
                  <div className="timeline-emoji">{phase.emoji}</div>
                  <div className="timeline-content"><p>{phase.text}</p><span className="timeline-date">{new Date().toLocaleDateString()}</span></div>
                </div>
              ))}
              <div className="memory-section">
                <h3>📝 Add a Memory</h3>
                {!showMemoryInput ? (
                  <button className="btn-add-memory" onClick={() => setShowMemoryInput(true)} onTouchStart={() => setShowMemoryInput(true)}>✨ Remember a Moment</button>
                ) : (
                  <div className="memory-input-group">
                    <textarea value={newMemory} onChange={(e) => setNewMemory(e.target.value)} placeholder="What happened? What did you feel? 💭" rows="3" />
                    <div className="memory-actions"><button onClick={addMemory} className="btn-save-memory" onTouchStart={addMemory}>💾 Save</button><button onClick={() => setShowMemoryInput(false)} className="btn-cancel">Cancel</button></div>
                  </div>
                )}
                {memories.length > 0 && (
                  <div className="memories-list">
                    {memories.map((memory) => (
                      <div key={memory.id} className="memory-card"><p>{memory.text}</p><div className="memory-date">{memory.date} at {memory.time}</div></div>
                    ))}
                  </div>
                )}
              </div>
              <button className="btn-continue-chat" onClick={() => setCurrentScene(7)} onTouchStart={() => setCurrentScene(7)}>
                💬 Start Chatting with Shataakshi
              </button>
            </div>
          </div>
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 7: DRAMATIC CHAT ----
  if (currentScene === 7) {
    return (
      <div className="scene-container scene-chat">
        <audio ref={audioRef} />
        <GardenBackground /><FluffyHeart />
        <div className="magic-sparkles">{magicSparkles.map((s, i) => <div key={i} className="magic-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }} />)}</div>
        <div className="scene-content">
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-user">👩‍⚕️ Dr. Shataakshi</div>
              <span className="chat-status">💚 Online</span>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => msg && (
                <div key={idx} className={`chat-bubble ${msg.from === 'me' ? 'bubble-me' : 'bubble-her'} slide-in`}>
                  {msg.from === 'me' ? '🧑‍💻 ' : '👩‍⚕️ '}{msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble bubble-her typing-indicator">
                  <span></span><span></span><span></span>
                  <span className="typing-text">Shataakshi is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
              {messages.length === chatMessages.length && (
                <div className="chat-end">
                  <span>💖 She agreed to talk! 💖</span>
                </div>
              )}
            </div>
            <div className="chat-footer">
              <div className="chat-footer-info">
                <span>💬</span>
                <span className="chat-footer-text">She's listening...</span>
              </div>
            </div>
          </div>
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 8: FINGERS CROSSED ----
  if (currentScene === 8) {
    return (
      <div className="scene-container scene-meet">
        <audio ref={audioRef} />
        <GardenBackground /><FluffyHeart />
        <div className="magic-sparkles">{magicSparkles.map((s, i) => <div key={i} className="magic-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size * 1.5, height: s.size * 1.5, animationDelay: `${s.delay}s` }} />)}</div>
        <div className="scene-content">
          <div className="meet-container">
            <div className="meet-card pending">
              <div className="meet-emoji">🤞</div>
              <div className="meet-badge">💕 Fingers Crossed</div>
              <h2>Still Getting to Know Each Other</h2>
              <p className="meet-sub">We're building a beautiful connection, one conversation at a time...</p>
              
              <div className="pleading-container">
                <div className="pleading-emoji">🥺</div>
                <p className="pleading-text">"I'm waiting for the perfect moment..."</p>
                <div className="pleading-hearts">
                  <span>💖</span><span>💕</span><span>💗</span><span>💖</span>
                </div>
              </div>
              
              <div className="meet-details pending">
                <div className="meet-item pending-item">
                  <span>🤞</span>
                  <span>Fingers crossed for something beautiful</span>
                </div>
                <div className="meet-item pending-item">
                  <span>🥺</span>
                  <span>Please say yes... 🙏</span>
                </div>
                <div className="meet-item pending-item">
                  <span>💭</span>
                  <span>Getting to know each other deeply</span>
                </div>
                <div className="meet-item pending-item">
                  <span>🌟</span>
                  <span>Something magical is growing</span>
                </div>
              </div>

              <div className="meet-hearts">
                <span>💖</span><span>💕</span><span>💗</span><span>💖</span><span>💕</span>
              </div>
              
              <p className="pending-message">✨ "Good things take time, and we're worth the wait" ✨</p>
              <p className="pending-sub-message">🤞 Praying she says yes... 🤞</p>
              
              <button className="btn-meet-final" onClick={() => setCurrentScene(9)} onTouchStart={() => setCurrentScene(9)}>
                🌟 Continue Our Story 🌟
              </button>
            </div>
          </div>
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  // ---- SCENE 9: FINAL ----
  if (currentScene === 9) {
    return (
      <div className="scene-container scene-final">
        <audio ref={audioRef} />
        <GardenBackground /><FluffyHeart />
        <div className="magic-sparkles">{magicSparkles.map((s, i) => <div key={i} className="magic-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size * 2, height: s.size * 2, animationDelay: `${s.delay}s` }} />)}</div>
        <div className="scene-content">
          <div className="final-container">
            <div className="final-emoji">💖</div>
            <h1 className="final-title">A Beautiful Connection</h1>
            <p className="final-sub">From a single drop to a beautiful journey...</p>
            <div className="final-couple">🧑‍💻 💕 👩‍⚕️</div>
            <p className="final-message">Every journey begins with a single step, and yours began with a magical drop 💧✨</p>
            <div className="final-hearts">
              <span>💖</span><span>💕</span><span>💗</span><span>💖</span><span>💕</span><span>💗</span>
            </div>
            <button className="btn-restart" onClick={() => window.location.reload()} onTouchStart={() => window.location.reload()}>
              🔄 Relive the Magic
            </button>
          </div>
        </div>
        <MusicButton isPlaying={isMusicPlaying} toggle={toggleMusic} />
      </div>
    );
  }

  return null;
};

export default App;