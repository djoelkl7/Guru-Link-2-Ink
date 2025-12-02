/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import RepoAnalyzer from './components/RepoAnalyzer';
import ArticleToInfographic from './components/ArticleToInfographic';
import Home from './components/Home';
import IntroAnimation from './components/IntroAnimation';
import ApiKeyModal from './components/ApiKeyModal';
import { ViewMode, RepoHistoryItem, ArticleHistoryItem } from './types';
import { Github, PenTool, GitBranch, FileText, Home as HomeIcon, CreditCard, Keyboard } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.HOME);
  const [showIntro, setShowIntro] = useState(true);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);
  
  // Lifted History State for Persistence
  // We initialize state by lazily reading from localStorage to avoid unnecessary reads on re-renders
  // and to restore the session immediately.
  const [repoHistory, setRepoHistory] = useState<RepoHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('link2ink_repo_history');
      if (saved) {
        // Parse JSON and ensure date strings are converted back to Date objects
        return JSON.parse(saved).map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
      }
    } catch (e) {
      console.warn("Failed to load repo history from local storage", e);
    }
    return [];
  });

  const [articleHistory, setArticleHistory] = useState<ArticleHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('link2ink_article_history');
      if (saved) {
        return JSON.parse(saved).map((item: any) => ({
          ...item,
          date: new Date(item.date)
        }));
      }
    } catch (e) {
      console.warn("Failed to load article history from local storage", e);
    }
    return [];
  });

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        // In environments without the AI Studio bridge, strictly checking might block dev.
        // However, per instructions to "Require a paid key", we default false if we can't verify.
        // In a real deploy, window.aistudio is guaranteed.
        setHasApiKey(false);
      }
      setCheckingKey(false);
    };
    checkKey();
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable shortcuts if no API key or intro is showing
      if (!hasApiKey || showIntro) return;

      // Navigation Shortcuts: Alt + 1/2/3
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setCurrentView(ViewMode.HOME);
            break;
          case '2':
            e.preventDefault();
            setCurrentView(ViewMode.REPO_ANALYZER);
            break;
          case '3':
            e.preventDefault();
            setCurrentView(ViewMode.ARTICLE_INFOGRAPHIC);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasApiKey, showIntro]);

  // Persist Repo History updates
  useEffect(() => {
    try {
      localStorage.setItem('link2ink_repo_history', JSON.stringify(repoHistory));
    } catch (e) {
      console.warn("Failed to save repo history to local storage (likely quota exceeded)", e);
    }
  }, [repoHistory]);

  // Persist Article History updates
  useEffect(() => {
    try {
      localStorage.setItem('link2ink_article_history', JSON.stringify(articleHistory));
    } catch (e) {
      console.warn("Failed to save article history to local storage (likely quota exceeded)", e);
    }
  }, [articleHistory]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    // sessionStorage.setItem('hasSeenIntro', 'true'); // Disabled for dev/demo purposes
  };

  const handleNavigate = (mode: ViewMode) => {
    setCurrentView(mode);
  };

  const handleAddRepoHistory = (item: RepoHistoryItem) => {
    setRepoHistory(prev => [item, ...prev]);
  };

  const handleAddArticleHistory = (item: ArticleHistoryItem) => {
    setArticleHistory(prev => [item, ...prev]);
  };

  const onReauthRequested = () => {
    setHasApiKey(false); // This will trigger the modal to reappear
  };

  if (checkingKey) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enforce API Key Modal */}
      {!hasApiKey && <ApiKeyModal onKeySelected={() => setHasApiKey(true)} />}

      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      <header className="sticky top-4 z-50 mx-auto w-[calc(100%-1rem)] md:w-[calc(100%-2rem)] max-w-[1400px]">
        <div className="glass-panel rounded-2xl px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <button 
            onClick={() => setCurrentView(ViewMode.HOME)}
            className="flex items-center gap-3 md:gap-4 group transition-opacity hover:opacity-80"
          >
            <div className="relative flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl bg-slate-900/50 border border-white/10 shadow-inner group-hover:border-violet-500/50 transition-colors">
               <PenTool className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-lg md:text-xl font-extrabold text-white tracking-tight font-sans flex items-center gap-2">
                Link2Ink <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-mono text-slate-400 border border-white/5 hidden sm:inline-block">Studio</span>
              </h1>
              <p className="text-xs font-mono text-slate-400 tracking-wider uppercase hidden sm:block">Visual Intelligence Platform</p>
            </div>
          </button>
          <div className="flex items-center gap-4">
            {hasApiKey && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-[10px] font-bold text-emerald-400 font-mono uppercase tracking-widest cursor-help" title="API Key Active">
                    <CreditCard className="w-3 h-3" /> Paid Tier
                </div>
            )}
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-2 md:p-2.5 rounded-xl bg-slate-900/50 border border-white/10 text-slate-400 hover:text-white hover:border-violet-500/50 transition-all hover:shadow-neon-violet"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Navigation Tabs (Hidden on Home, visible on tools) */}
        {currentView !== ViewMode.HOME && (
            <div className="flex justify-center mb-8 md:mb-10 animate-in fade-in slide-in-from-top-4 sticky top-24 z-40">
            <div className="glass-panel p-1 md:p-1.5 rounded-full flex relative shadow-2xl">
                <button
                onClick={() => setCurrentView(ViewMode.HOME)}
                className="relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full font-medium text-sm transition-all duration-300 font-mono text-slate-500 hover:text-slate-300 hover:bg-white/5 group"
                title="Home (Alt+1)"
                >
                <HomeIcon className="w-4 h-4" />
                <span className="text-[9px] opacity-40 ml-0.5 group-hover:opacity-80 transition-opacity hidden lg:inline">Alt+1</span>
                </button>
                <div className="w-px h-6 bg-white/10 my-auto mx-1"></div>
                <button
                onClick={() => setCurrentView(ViewMode.REPO_ANALYZER)}
                className={`relative flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium text-sm transition-all duration-300 font-mono group ${
                    currentView === ViewMode.REPO_ANALYZER
                    ? 'text-white bg-white/10 shadow-glass-inset border border-white/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="GitFlow (Alt+2)"
                >
                <GitBranch className="w-4 h-4" />
                <span className="hidden sm:inline">GitFlow</span>
                <span className={`text-[9px] ml-1.5 hidden lg:inline ${currentView === ViewMode.REPO_ANALYZER ? 'text-white/40' : 'text-slate-600 group-hover:text-slate-400'}`}>Alt+2</span>
                </button>
                <button
                onClick={() => setCurrentView(ViewMode.ARTICLE_INFOGRAPHIC)}
                className={`relative flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium text-sm transition-all duration-300 font-mono group ${
                    currentView === ViewMode.ARTICLE_INFOGRAPHIC
                    ? 'text-emerald-100 bg-emerald-500/10 shadow-glass-inset border border-emerald-500/20'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="SiteSketch (Alt+3)"
                >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">SiteSketch</span>
                <span className={`text-[9px] ml-1.5 hidden lg:inline ${currentView === ViewMode.ARTICLE_INFOGRAPHIC ? 'text-emerald-300/40' : 'text-slate-600 group-hover:text-slate-400'}`}>Alt+3</span>
                </button>
            </div>
            </div>
        )}

        <div className="flex-1">
            {currentView === ViewMode.HOME && (
                <Home onNavigate={handleNavigate} />
            )}
            {currentView === ViewMode.REPO_ANALYZER && (
                <div className="animate-in fade-in-30 slide-in-from-bottom-4 duration-500 ease-out">
                    <RepoAnalyzer 
                        onNavigate={handleNavigate} 
                        history={repoHistory} 
                        onAddToHistory={handleAddRepoHistory}
                    />
                </div>
            )}
            {currentView === ViewMode.ARTICLE_INFOGRAPHIC && (
                <div className="animate-in fade-in-30 slide-in-from-bottom-4 duration-500 ease-out">
                    <ArticleToInfographic 
                        history={articleHistory} 
                        onAddToHistory={handleAddArticleHistory}
                    />
                </div>
            )}
        </div>
      </main>

      <footer className="py-6 mt-auto border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center px-4 flex flex-col items-center gap-2">
          <p className="text-xs font-mono text-slate-600">
            <span className="text-violet-500/70">link</span>:<span className="text-emerald-500/70">ink</span>$ Powered by Nano Banana Pro
          </p>
          <div className="flex items-center gap-4 text-[10px] font-mono text-slate-700">
             <span className="flex items-center gap-1"><Keyboard className="w-3 h-3" /> Shortcuts:</span>
             <span className="bg-white/5 px-1.5 py-0.5 rounded">Alt+1..3 Nav</span>
             <span className="bg-white/5 px-1.5 py-0.5 rounded">⌘/Ctrl+↵ Run</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;