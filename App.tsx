
import React, { useState } from 'react';
import { AppTab, Profile, Medication } from './types';
import { INITIAL_PROFILES, Icons, LANGUAGES } from './constants';
import PrescriptionScanner from './components/PrescriptionScanner';
import ChatAssistant from './components/ChatAssistant';
import PharmacyFinder from './components/PharmacyFinder';
import FamilyManager from './components/FamilyManager';
import MedicineIdentifier from './components/MedicineIdentifier';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>(INITIAL_PROFILES[0].id);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const handleAddMedication = (profileId: string, med: Medication) => {
    setProfiles(prev => prev.map(p => {
        if (p.id === profileId) {
            return { ...p, medications: [...p.medications, med] };
        }
        return p;
    }));
  };

  const handleRemoveMedication = (profileId: string, medName: string) => {
    setProfiles(prev => prev.map(p => {
        if (p.id === profileId) {
            return { ...p, medications: p.medications.filter(m => m.name !== medName) };
        }
        return p;
    }));
  };

  const handleAddProfile = (newProfile: Profile) => {
    setProfiles(prev => [...prev, newProfile]);
    setActiveProfileId(newProfile.id);
  };

  const renderContent = () => {
    switch (activeTab) {
        case AppTab.SCAN:
            return <PrescriptionScanner activeProfile={activeProfile} onAddMedication={handleAddMedication} />;
        case AppTab.MED_ID:
            return <MedicineIdentifier />;
        case AppTab.CHAT:
            return <ChatAssistant />;
        case AppTab.MAPS:
            return <PharmacyFinder />;
        case AppTab.HOME:
            return <FamilyManager 
                profiles={profiles} 
                activeProfileId={activeProfileId} 
                onSwitchProfile={setActiveProfileId}
                onRemoveMedication={handleRemoveMedication}
                onAddProfile={handleAddProfile}
            />;
        default:
            return null;
    }
  };

  const activeLang = LANGUAGES.find(l => l.code === language);

  return (
    <div className="w-full h-screen bg-dark-900 text-slate-100 flex justify-center">
      <div className="w-full max-w-md h-full bg-dark-950 shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="h-16 bg-dark-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
                    M
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-white">
                    {t('app_name')}
                </h1>
            </div>
            
            <div className="flex items-center gap-2">
                {/* About/Help Button */}
                <button
                    onClick={() => setShowAbout(true)}
                    className="p-1.5 text-slate-400 hover:text-white transition-colors"
                >
                    <Icons.HelpCircle />
                </button>

                {/* Language Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                        className="flex items-center gap-1 bg-slate-800 rounded-full px-2 py-1 border border-slate-700 text-xs text-slate-300 hover:text-white"
                    >
                        <Icons.Globe />
                        <span className="uppercase font-bold">{activeLang?.code}</span>
                    </button>
                    
                    {isLangMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-32 bg-dark-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setIsLangMenuOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'bg-primary-900/50 text-primary-300' : 'text-slate-300 hover:bg-slate-700'}`}
                                    >
                                        {lang.native}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-1 border border-slate-700">
                    <img src={activeProfile.avatarUrl} alt="Profile" className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-medium pr-1">{activeProfile.name}</span>
                </div>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
            {renderContent()}
        </main>

        {/* About Modal */}
        {showAbout && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm">
                <div className="bg-dark-800 rounded-2xl border border-slate-700 p-6 w-full max-w-sm shadow-2xl relative">
                    <button 
                        className="absolute top-4 right-4 text-slate-500 hover:text-white" 
                        onClick={() => setShowAbout(false)}
                    >
                        <Icons.Close />
                    </button>
                    
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                            M
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{t('about_title')}</h2>
                            <p className="text-xs text-slate-500">{t('version')}</p>
                        </div>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                        {t('about_purpose')}
                    </p>

                    <div className="bg-yellow-900/20 border border-yellow-700/30 p-4 rounded-xl mb-6">
                        <h3 className="text-yellow-500 font-bold text-sm mb-1 flex items-center gap-2">
                             <Icons.Warning /> {t('disclaimer_title')}
                        </h3>
                        <p className="text-xs text-yellow-200/70 leading-relaxed">
                            {t('disclaimer_text')}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 text-sm">
                        <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/50">
                            {t('privacy_policy')} <Icons.ArrowRight />
                        </a>
                        <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/50">
                            {t('terms_service')} <Icons.ArrowRight />
                        </a>
                    </div>
                    
                    <button 
                        onClick={() => setShowAbout(false)}
                        className="w-full mt-6 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        )}

        {/* Bottom Navigation */}
        <nav className="h-20 bg-dark-950 border-t border-slate-800 grid grid-cols-5 items-center px-2 absolute bottom-0 w-full z-20 pb-safe">
            <button 
                onClick={() => setActiveTab(AppTab.HOME)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.HOME ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.HOME ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Home />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{t('tab_home')}</span>
            </button>
            
            <button 
                onClick={() => setActiveTab(AppTab.SCAN)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.SCAN ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.SCAN ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Scan />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{t('tab_scan')}</span>
            </button>
            
            <button 
                onClick={() => setActiveTab(AppTab.CHAT)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.CHAT ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.CHAT ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Chat />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{t('tab_chat')}</span>
            </button>

            <button 
                onClick={() => setActiveTab(AppTab.MED_ID)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.MED_ID ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.MED_ID ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Pill />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{t('tab_id')}</span>
            </button>
            
            <button 
                onClick={() => setActiveTab(AppTab.MAPS)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.MAPS ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.MAPS ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Map />
                </div>
                <span className="text-[10px] font-medium tracking-wide">{t('tab_find')}</span>
            </button>
        </nav>
      </div>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AppContent />
        </LanguageProvider>
    );
}

export default App;
