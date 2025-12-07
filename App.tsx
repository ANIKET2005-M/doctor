
import React, { useState } from 'react';
import { AppTab, Profile, Medication } from './types';
import { INITIAL_PROFILES, Icons } from './constants';
import PrescriptionScanner from './components/PrescriptionScanner';
import ChatAssistant from './components/ChatAssistant';
import PharmacyFinder from './components/PharmacyFinder';
import FamilyManager from './components/FamilyManager';
import MedicineIdentifier from './components/MedicineIdentifier';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [activeProfileId, setActiveProfileId] = useState<string>(INITIAL_PROFILES[0].id);

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

  return (
    <div className="w-full h-screen bg-dark-900 text-slate-100 flex justify-center">
      {/* Mobile Container Limit */}
      <div className="w-full max-w-md h-full bg-dark-950 shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="h-16 bg-dark-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary-500/20">
                    M
                </div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-white">
                    MediSage
                </h1>
            </div>
            <div className="flex items-center gap-2 bg-slate-800 rounded-full px-2 py-1 border border-slate-700">
                <img src={activeProfile.avatarUrl} alt="Profile" className="w-6 h-6 rounded-full" />
                <span className="text-xs font-medium pr-1">{activeProfile.name}</span>
            </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
            {renderContent()}
        </main>

        {/* Bottom Navigation */}
        <nav className="h-20 bg-dark-950 border-t border-slate-800 grid grid-cols-5 items-center px-2 absolute bottom-0 w-full z-20 pb-safe">
            <button 
                onClick={() => setActiveTab(AppTab.HOME)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.HOME ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.HOME ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Home />
                </div>
                <span className="text-[10px] font-medium tracking-wide">Home</span>
            </button>
            
            <button 
                onClick={() => setActiveTab(AppTab.SCAN)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.SCAN ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.SCAN ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Scan />
                </div>
                <span className="text-[10px] font-medium tracking-wide">Rx Scan</span>
            </button>
            
            <button 
                onClick={() => setActiveTab(AppTab.CHAT)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.CHAT ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.CHAT ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Chat />
                </div>
                <span className="text-[10px] font-medium tracking-wide">Chat</span>
            </button>

            <button 
                onClick={() => setActiveTab(AppTab.MED_ID)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.MED_ID ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.MED_ID ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Pill />
                </div>
                <span className="text-[10px] font-medium tracking-wide">Identify</span>
            </button>
            
            <button 
                onClick={() => setActiveTab(AppTab.MAPS)}
                className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === AppTab.MAPS ? 'text-primary-400' : 'text-slate-500 hover:text-slate-400'}`}
            >
                <div className={`${activeTab === AppTab.MAPS ? 'scale-110' : 'scale-100'} transition-transform`}>
                    <Icons.Map />
                </div>
                <span className="text-[10px] font-medium tracking-wide">Find</span>
            </button>
        </nav>
      </div>
    </div>
  );
};

export default App;
