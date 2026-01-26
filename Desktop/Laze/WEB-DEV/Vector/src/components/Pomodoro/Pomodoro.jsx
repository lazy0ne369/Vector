import { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  BookOpen,
  Settings,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import './Pomodoro.css';

const STORAGE_KEY = 'vector_pomodoro_stats';

const loadStats = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { totalSessions: 0, totalMinutes: 0, todaySessions: 0, lastDate: null };
  } catch {
    return { totalSessions: 0, totalMinutes: 0, todaySessions: 0, lastDate: null };
  }
};

const saveStats = (stats) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export default function Pomodoro({ minimal = false }) {
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [stats, setStats] = useState(loadStats);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [durations, setDurations] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15
  });

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Check if it's a new day and reset daily counter
  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastDate !== today) {
      const newStats = { ...stats, todaySessions: 0, lastDate: today };
      setStats(newStats);
      saveStats(newStats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle timer completion
  const completeTimer = useRef(() => {});
  
  completeTimer.current = () => {
    setIsRunning(false);
    
    // Play sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    if (mode === 'focus') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      // Update stats
      const today = new Date().toDateString();
      const newStats = {
        ...stats,
        totalSessions: stats.totalSessions + 1,
        totalMinutes: stats.totalMinutes + durations.focus,
        todaySessions: stats.lastDate === today ? stats.todaySessions + 1 : 1,
        lastDate: today
      };
      setStats(newStats);
      saveStats(newStats);
      
      // Auto-switch to break
      if (newSessions % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(durations.longBreak * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(durations.shortBreak * 60);
      }
    } else {
      setMode('focus');
      setTimeLeft(durations.focus * 60);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      completeTimer.current();
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(durations[newMode] * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode] * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((durations[mode] * 60 - timeLeft) / (durations[mode] * 60)) * 100;

  const handleDurationChange = (type, value) => {
    const newValue = Math.max(1, Math.min(120, parseInt(value) || 1));
    setDurations(prev => ({ ...prev, [type]: newValue }));
    if (type === mode && !isRunning) {
      setTimeLeft(newValue * 60);
    }
  };

  if (minimal) {
    return (
      <div className="pomodoro-minimal">
        <div className={`mini-timer ${mode}`}>
          <span className="mini-time">{formatTime(timeLeft)}</span>
          <button onClick={toggleTimer} className="mini-btn">
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
        <span className="mini-sessions">{stats.todaySessions} today</span>
      </div>
    );
  }

  return (
    <div className="pomodoro-widget">
      {/* Hidden audio element for notification */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+dmZmZnaCinpuVkIuGg4GBgoWJjpOYnaCio6OjoZ6blo+Ih4WEhIWGiYuOkZSXmZqbm5qZl5WSkY6MioiIh4iIiYqLjI2Oj5CQkI+Ojo2MjIuLi4uLi4yMjIyMjIyMjIyMjIyMjIyMjIyNjY2NjY6Ojo6Pj4+QkJCRkZGSkpKTk5OUlJSVlZWWlpaXl5eYmJiZmZmampqbm5ucnJydnZ2enp6fn5+goKChoaGioqKjo6OkpKSlpaWmpqanp6eoqKipqamqqqqrq6usrKytra2urq6vr6+wsLCxsbGysrKzs7O0tLS1tbW2tra3t7e4uLi5ubm6urq7u7u8vLy9vb2+vr6/v7/AwMDBwcHCwsLDw8PExMTFxcXGxsbHx8fIyMjJycnKysrLy8vMzMzNzc3Ozs7Pz8/Q0NDR0dHS0tLT09PU1NTV1dXW1tbX19fY2NjZ2dna2trb29vc3Nzd3d3e3t7f39/g4ODh4eHi4uLj4+Pk5OTl5eXm5ubn5+fo6Ojp6enq6urr6+vs7Ozt7e3u7u7v7+/w8PDx8fHy8vLz8/P09PT19fX29vb39/f4+Pj5+fn6+vr7+/v8/Pz9/f3+/v7///8=" type="audio/wav" />
      </audio>

      <div className="pomodoro-header">
        <div className="pomodoro-title">
          <BookOpen size={20} />
          <h3>Focus Timer</h3>
        </div>
        <div className="pomodoro-actions">
          <button 
            className={`sound-btn ${soundEnabled ? '' : 'muted'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <button className="settings-btn" onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? <X size={16} /> : <Settings size={16} />}
          </button>
        </div>
      </div>

      {showSettings ? (
        <div className="pomodoro-settings">
          <div className="setting-row">
            <label>Focus (min)</label>
            <input 
              type="number" 
              value={durations.focus}
              onChange={(e) => handleDurationChange('focus', e.target.value)}
              min="1" 
              max="120"
            />
          </div>
          <div className="setting-row">
            <label>Short Break (min)</label>
            <input 
              type="number" 
              value={durations.shortBreak}
              onChange={(e) => handleDurationChange('shortBreak', e.target.value)}
              min="1" 
              max="30"
            />
          </div>
          <div className="setting-row">
            <label>Long Break (min)</label>
            <input 
              type="number" 
              value={durations.longBreak}
              onChange={(e) => handleDurationChange('longBreak', e.target.value)}
              min="1" 
              max="60"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="mode-tabs">
            <button 
              className={`mode-tab ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => switchMode('focus')}
            >
              <BookOpen size={14} />
              Focus
            </button>
            <button 
              className={`mode-tab ${mode === 'shortBreak' ? 'active' : ''}`}
              onClick={() => switchMode('shortBreak')}
            >
              <Coffee size={14} />
              Short
            </button>
            <button 
              className={`mode-tab ${mode === 'longBreak' ? 'active' : ''}`}
              onClick={() => switchMode('longBreak')}
            >
              <Coffee size={14} />
              Long
            </button>
          </div>

          <div className="timer-display">
            <svg className="timer-ring" viewBox="0 0 100 100">
              <circle className="ring-bg" cx="50" cy="50" r="45" />
              <circle 
                className={`ring-progress ${mode}`}
                cx="50" 
                cy="50" 
                r="45"
                strokeDasharray={`${progress * 2.83} 283`}
              />
            </svg>
            <div className="timer-text">
              <span className="time">{formatTime(timeLeft)}</span>
              <span className="mode-label">
                {mode === 'focus' ? 'Focus Time' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </span>
            </div>
          </div>

          <div className="timer-controls">
            <button className="control-btn reset" onClick={resetTimer}>
              <RotateCcw size={18} />
            </button>
            <button className={`control-btn main ${isRunning ? 'pause' : 'play'}`} onClick={toggleTimer}>
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="session-count">
              {sessionsCompleted % 4}/4
            </div>
          </div>

          <div className="pomodoro-stats">
            <div className="stat">
              <span className="stat-value">{stats.todaySessions}</span>
              <span className="stat-label">Today</span>
            </div>
            <div className="stat">
              <span className="stat-value">{stats.totalSessions}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat">
              <span className="stat-value">{Math.round(stats.totalMinutes / 60)}h</span>
              <span className="stat-label">Focused</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
