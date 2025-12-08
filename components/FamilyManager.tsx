
import React, { useState } from 'react';
import { Profile, Medication } from '../types';
import { Icons } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  profiles: Profile[];
  activeProfileId: string;
  onSwitchProfile: (id: string) => void;
  onRemoveMedication: (profileId: string, medName: string) => void;
  onAddProfile: (profile: Profile) => void;
}

const FamilyManager: React.FC<Props> = ({ profiles, activeProfileId, onSwitchProfile, onRemoveMedication, onAddProfile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState<Profile['relationship']>('Other');
  const [newAge, setNewAge] = useState('');
  const { t } = useLanguage();

  const handleCreateProfile = () => {
    if (!newName.trim()) return;

    const newProfile: Profile = {
      id: Date.now().toString(),
      name: newName,
      relationship: newRelationship,
      age: newAge ? parseInt(newAge) : undefined,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random&color=fff&rounded=true`,
      medications: []
    };

    onAddProfile(newProfile);
    
    // Reset and close
    setIsModalOpen(false);
    setNewName('');
    setNewRelationship('Other');
    setNewAge('');
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-6 overflow-y-auto no-scrollbar pb-24 relative">
      {/* Profile Selector */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{t('family_profiles')}</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {profiles.map(profile => (
                <div 
                    key={profile.id}
                    onClick={() => onSwitchProfile(profile.id)}
                    className={`flex flex-col items-center space-y-2 min-w-[80px] cursor-pointer transition-transform ${activeProfileId === profile.id ? 'scale-110' : 'opacity-60'}`}
                >
                    <div className={`w-16 h-16 rounded-full p-1 border-2 ${activeProfileId === profile.id ? 'border-primary-500' : 'border-slate-600'}`}>
                        <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-sm font-medium text-white">{profile.name}</span>
                </div>
            ))}
            <div 
                onClick={() => setIsModalOpen(true)}
                className="flex flex-col items-center space-y-2 min-w-[80px] opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
            >
                 <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400 bg-slate-800/50">
                    <Icons.Add />
                 </div>
                 <span className="text-sm text-slate-400">{t('add_profile')}</span>
            </div>
        </div>
      </div>

      {/* Current Profile Meds */}
      {profiles.map(profile => {
        if (profile.id !== activeProfileId) return null;
        
        return (
            <div key={profile.id} className="animate-fade-in">
                <div className="flex items-end gap-2 mb-3">
                    <h3 className="text-lg font-semibold text-primary-400 flex items-center gap-2">
                        <Icons.People /> {profile.name}'s Medications
                    </h3>
                    <span className="text-xs text-slate-500 mb-1 px-2 py-0.5 bg-slate-800 rounded-full border border-slate-700">
                        {profile.relationship} {profile.age ? `• ${profile.age}y` : ''}
                    </span>
                </div>
                
                {profile.medications.length === 0 ? (
                    <div className="text-center p-8 bg-dark-800 rounded-2xl border border-slate-800">
                        <p className="text-slate-500">No medications added yet.</p>
                        <p className="text-slate-600 text-sm mt-1">Use the Scan tab to add new ones.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {profile.medications.map((med, idx) => (
                            <div key={idx} className="bg-dark-800 p-4 rounded-xl border-l-4 border-primary-500 shadow-md">
                                <div className="flex justify-between">
                                    <h4 className="font-bold text-white">{med.name}</h4>
                                    <button 
                                        onClick={() => onRemoveMedication(profile.id, med.name)}
                                        className="text-slate-600 hover:text-red-400 transition-colors"
                                    >
                                        <Icons.Delete />
                                    </button>
                                </div>
                                <p className="text-primary-400 text-sm">{med.dosage} • {med.frequency}</p>
                                {med.expiryDate && (
                                    <p className="text-xs text-orange-300 mt-0.5">Exp: {med.expiryDate}</p>
                                )}
                                
                                {med.schedule && med.schedule.length > 0 ? (
                                     <div className="mt-3 bg-dark-900/50 p-2 rounded-lg border border-slate-800/50">
                                         {med.schedule.map((rem, rIdx) => (
                                             <div key={rIdx} className="flex justify-between text-xs py-1 border-b border-slate-800 last:border-0">
                                                 <span className="font-mono text-primary-300">{rem.time}</span>
                                                 <span className="text-slate-400">{rem.label}</span>
                                             </div>
                                         ))}
                                     </div>
                                ) : (
                                    med.reminder_slots && med.reminder_slots.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {med.reminder_slots.map((slot, i) => (
                                                <span key={i} className="text-[10px] font-semibold bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded uppercase">
                                                    {slot}
                                                </span>
                                            ))}
                                        </div>
                                   )
                                )}

                                <div className="mt-2 text-sm text-slate-400 bg-slate-900/50 p-2 rounded">
                                    {med.instructions || med.purpose}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
      })}

      {/* Create Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-dark-800 rounded-2xl border border-slate-700 p-6 w-full max-w-sm shadow-2xl relative">
                <div className="absolute top-4 right-4 text-slate-500 cursor-pointer" onClick={() => setIsModalOpen(false)}>
                    <Icons.Close />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t('new_profile')}</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">{t('name')}</label>
                        <input 
                            type="text" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Grandma"
                            className="w-full bg-dark-900 border border-slate-600 rounded-lg p-3 text-white focus:border-primary-500 outline-none"
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 block mb-1">{t('relationship')}</label>
                            <select 
                                value={newRelationship}
                                onChange={(e) => setNewRelationship(e.target.value as any)}
                                className="w-full bg-dark-900 border border-slate-600 rounded-lg p-3 text-white outline-none"
                            >
                                <option value="Other">Other</option>
                                <option value="Parent">Parent</option>
                                <option value="Child">Child</option>
                                <option value="Spouse">Spouse</option>
                                <option value="Self">Self</option>
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="text-xs text-slate-400 block mb-1">{t('age')} (opt)</label>
                            <input 
                                type="number" 
                                value={newAge}
                                onChange={(e) => setNewAge(e.target.value)}
                                placeholder="65"
                                className="w-full bg-dark-900 border border-slate-600 rounded-lg p-3 text-white outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button 
                        onClick={handleCreateProfile}
                        disabled={!newName.trim()}
                        className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('create')}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default FamilyManager;
