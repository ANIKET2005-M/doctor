
import React, { useState, useRef } from 'react';
import { analyzePrescriptionImage, createReminderSchedule, getPharmacySearchTips } from '../services/geminiService';
import { Medication, Profile, PharmacyTips } from '../types';
import { Icons } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';


interface Props {
  activeProfile: Profile;
  onAddMedication: (profileId: string, med: Medication) => void;
}

// Helper to compress images to avoid large payload errors (RPC 500)
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Reduced dimensions to prevent "Rpc failed due to xhr error"
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, width, height);
             // Reduced quality to 0.6
             resolve(canvas.toDataURL('image/jpeg', 0.6));
          } else {
             reject(new Error("Canvas context failed"));
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
};

const PrescriptionScanner: React.FC<Props> = ({ activeProfile, onAddMedication }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedMeds, setAnalyzedMeds] = useState<Medication[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  
  // Confirmation state
  const [confirmingMed, setConfirmingMed] = useState<Medication | null>(null);
  
  // Schedule state
  const [showScheduleCreator, setShowScheduleCreator] = useState(false);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("22:00");
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  // Buying Tips state
  const [showTips, setShowTips] = useState(false);
  const [tipsLocation, setTipsLocation] = useState("");
  const [pharmacyTips, setPharmacyTips] = useState<PharmacyTips | null>(null);
  const [isGeneratingTips, setIsGeneratingTips] = useState(false);

  const { t, language } = useLanguage();

  // helper: names of medicines for tips
  const medicineNames = analyzedMeds.map((m) => m.name);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const compressed = await compressImage(file);
        setImagePreview(compressed);
        setAnalyzedMeds([]);
        setSummary(null);
        setShowScheduleCreator(false);
        setPharmacyTips(null);
        setShowTips(false);
    } catch (error) {
        console.error("Compression failed", error);
        alert("Could not load image. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    try {
        // Strip data:image/jpeg;base64, prefix
        const base64Data = imagePreview.split(',')[1];
        const result = await analyzePrescriptionImage(base64Data, language);
        setAnalyzedMeds(result.medications);
        setSummary(result.summary);
        setShowScheduleCreator(true);
        setShowTips(true); // Enable tips section availability
        setImagePreview(null); // Clear preview to prevent accidental re-analysis
    } catch (err) {
        alert("Failed to analyze image. Please try again with a clearer photo.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleGenerateSchedule = async () => {
      if (analyzedMeds.length === 0) return;
      setIsGeneratingSchedule(true);
      try {
          const result = await createReminderSchedule(analyzedMeds, wakeTime, sleepTime, language);
          
          // Merge schedule back into analyzedMeds
          const updatedMeds = analyzedMeds.map(med => {
             // Basic fuzzy match on name since model might normalize it
             const scheduleItem = result.schedule.find(s => s.name.toLowerCase().includes(med.name.toLowerCase()) || med.name.toLowerCase().includes(s.name.toLowerCase()));
             return {
                 ...med,
                 schedule: scheduleItem ? scheduleItem.reminders : []
             };
          });
          setAnalyzedMeds(updatedMeds);
          setShowScheduleCreator(false); // Hide inputs, show results in cards
      } catch (e) {
          alert("Could not generate schedule. Please try again.");
      } finally {
          setIsGeneratingSchedule(false);
      }
  };

 const handleGetTips = async () => {
    if (medicineNames.length === 0) return;
    setIsGeneratingTips(true);
    try {
        const result = await getPharmacySearchTips(medicineNames, tipsLocation, language);
        setPharmacyTips(result);
    } catch (e) {
        alert("Could not generate buying tips.");
    } finally {
        setIsGeneratingTips(false);
    }
  };


  const handleSaveMed = (med: Medication) => {
    setConfirmingMed(med);
  };

  const executeAddMed = () => {
    if (!confirmingMed) return;
    onAddMedication(activeProfile.id, confirmingMed);
    // Remove from local list after adding
    setAnalyzedMeds(prev => prev.filter(m => m.name !== confirmingMed.name));
    setConfirmingMed(null);
  };

  const handleReset = () => {
      setImagePreview(null);
      setAnalyzedMeds([]);
      setSummary(null);
      setPharmacyTips(null);
      setShowScheduleCreator(false);
      setShowTips(false);
  };

  const hasResults = analyzedMeds.length > 0 || summary !== null;

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto no-scrollbar pb-24 relative">
      <h2 className="text-2xl font-bold text-white mb-2">{t('scan_title')}</h2>
      {!hasResults && (
        <p className="text-slate-400 text-sm">{t('scan_desc')}</p>
      )}

      {/* Upload Area */}
      {!hasResults && (
        <div 
            className="border-2 border-dashed border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-dark-800 cursor-pointer hover:bg-slate-800 transition-colors"
            onClick={() => fileInputRef.current?.click()}
        >
            {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg object-contain" />
            ) : (
                <>
                    <div className="bg-primary-500/10 p-4 rounded-full mb-4">
                        <Icons.Scan />
                    </div>
                    <span className="text-slate-300 font-medium">{t('tap_upload')}</span>
                </>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
        </div>
      )}

      {/* Action Buttons */}
      {imagePreview && !hasResults && (
          <div className="flex gap-3">
              <button 
                onClick={() => {
                    setImagePreview(null);
                    setAnalyzedMeds([]);
                    setSummary(null);
                    setPharmacyTips(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600"
              >
                  {t('retake')}
              </button>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${isAnalyzing ? 'bg-primary-700' : 'bg-primary-600 hover:bg-primary-500'}`}
              >
                  {isAnalyzing ? (
                      <>
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                        {t('analyzing')}
                      </>
                  ) : (
                      <>
                        <Icons.Scan /> {t('analyze')}
                      </>
                  )}
              </button>
          </div>
      )}

      {/* Results */}
      {hasResults && (
          <div className="space-y-4 animate-fade-in pb-10">
              {summary && (
                  <div className="bg-gradient-to-br from-primary-900/40 to-slate-800 p-4 rounded-xl border border-primary-500/30">
                      <h3 className="text-primary-300 font-bold mb-1 flex items-center gap-2">
                        <Icons.Info /> {t('ai_summary')}
                      </h3>
                      <p className="text-slate-200 text-sm leading-relaxed">{summary}</p>
                  </div>
              )}

              {/* Pharmacy Tips Section */}
              {showTips && !pharmacyTips && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                          <Icons.Map /> Where to Buy?
                      </h3>
                      <p className="text-xs text-slate-400 mb-3">Get tailored advice on finding these medicines nearby.</p>
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="City or Area (optional)"
                            value={tipsLocation}
                            onChange={(e) => setTipsLocation(e.target.value)}
                            className="flex-1 bg-dark-900 border border-slate-600 rounded-lg p-2 text-white text-sm"
                          />
                          <button 
                            onClick={handleGetTips}
                            disabled={isGeneratingTips}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-4 rounded-lg text-sm font-bold disabled:opacity-50"
                          >
                             {isGeneratingTips ? '...' : 'Get Tips'}
                          </button>
                      </div>
                  </div>
              )}

              {pharmacyTips && (
                  <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-900/50 animate-fade-in">
                      <h3 className="text-emerald-400 font-bold mb-2">Pharmacy Guide</h3>
                      <p className="text-slate-200 text-sm mb-3">{pharmacyTips.guide}</p>
                      <ul className="space-y-1">
                          {pharmacyTips.tips.map((tip, idx) => (
                              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                                  <span className="text-emerald-500 mt-0.5">●</span> {tip}
                              </li>
                          ))}
                      </ul>
                  </div>
              )}

              {/* Schedule Generator */}
              {showScheduleCreator && (
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
                      <h3 className="font-bold text-white">{t('customize_schedule')}</h3>
                      <p className="text-xs text-slate-400">Enter your wake and sleep times to get precise reminder slots.</p>
                      <div className="flex gap-4">
                          <div className="flex-1 space-y-1">
                              <label className="text-xs text-slate-400">{t('wake_up')}</label>
                              <input 
                                type="time" 
                                value={wakeTime}
                                onChange={(e) => setWakeTime(e.target.value)}
                                className="w-full bg-dark-900 border border-slate-600 rounded-lg p-2 text-white text-sm"
                              />
                          </div>
                          <div className="flex-1 space-y-1">
                              <label className="text-xs text-slate-400">{t('sleep')}</label>
                              <input 
                                type="time" 
                                value={sleepTime}
                                onChange={(e) => setSleepTime(e.target.value)}
                                className="w-full bg-dark-900 border border-slate-600 rounded-lg p-2 text-white text-sm"
                              />
                          </div>
                      </div>
                      <button 
                        onClick={handleGenerateSchedule}
                        disabled={isGeneratingSchedule}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg text-sm font-bold flex justify-center items-center gap-2"
                      >
                         {isGeneratingSchedule ? 'Generating...' : t('create_plan')}
                      </button>
                  </div>
              )}

              {analyzedMeds.map((med, idx) => (
                  <div key={idx} className="bg-dark-800 rounded-xl p-4 border border-slate-700 shadow-lg">
                      <div className="flex justify-between items-start mb-2">
                          <div>
                              <h4 className="text-xl font-bold text-white">{med.name}</h4>
                              <p className="text-primary-400 text-sm font-medium">{med.dosage} • {med.frequency}</p>
                              {med.expiryDate && (
                                  <div className="inline-block bg-orange-900/30 border border-orange-700/50 rounded px-2 py-0.5 mt-1">
                                      <p className="text-xs text-orange-200">Exp: {med.expiryDate}</p>
                                  </div>
                              )}
                          </div>
                          <button 
                            onClick={() => handleSaveMed(med)}
                            className="bg-primary-600 hover:bg-primary-500 text-white p-2 rounded-full shadow-lg"
                          >
                              <Icons.Add />
                          </button>
                      </div>
                      
                      {/* Detailed Schedule View */}
                      {med.schedule && med.schedule.length > 0 ? (
                          <div className="mb-4 bg-dark-950/50 rounded-lg p-3 border border-slate-800">
                              <p className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-bold">Daily Plan</p>
                              <div className="space-y-2">
                                  {med.schedule.map((rem, rIdx) => (
                                      <div key={rIdx} className="flex items-center justify-between text-sm">
                                          <span className="font-mono text-primary-300 font-bold bg-primary-900/20 px-2 py-0.5 rounded">{rem.time}</span>
                                          <span className="text-slate-300 text-right">{rem.label}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      ) : (
                          // Fallback to simple slots
                          med.reminder_slots && med.reminder_slots.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {med.reminder_slots.map((slot, i) => (
                                    <span key={i} className="text-xs font-semibold bg-slate-700 text-slate-300 px-2 py-1 rounded-md uppercase tracking-wider">
                                        {slot}
                                    </span>
                                ))}
                            </div>
                        )
                      )}

                      <div className="space-y-2 mt-3 text-sm text-slate-300">
                          <p><strong className="text-slate-500">Purpose:</strong> {med.purpose}</p>
                          <p><strong className="text-slate-500">Instructions:</strong> {med.instructions}</p>
                          
                          {med.safety_notes && med.safety_notes.length > 0 && (
                              <div className="flex items-start gap-2 text-yellow-200/80 bg-yellow-900/20 p-2 rounded-lg mt-2">
                                  <span className="mt-0.5"><Icons.Warning /></span>
                                  <ul className="list-disc pl-4 space-y-1">
                                      {med.safety_notes.map((note, nIdx) => (
                                          <li key={nIdx}>{note}</li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
              
              <button 
                onClick={handleReset}
                className="w-full py-4 mt-6 rounded-xl bg-dark-800 border border-slate-700 text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                  <Icons.Scan /> {t('scan_another')}
              </button>
          </div>
      )}

      {/* Confirmation Modal */}
      {confirmingMed && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-dark-800 rounded-2xl border border-slate-700 p-6 w-full max-w-sm shadow-2xl relative">
                <div className="absolute top-4 right-4 text-slate-500 cursor-pointer" onClick={() => setConfirmingMed(null)}>
                    <Icons.Close />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Add Medication?</h3>
                <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                    Are you sure you want to add <strong className="text-primary-400">{confirmingMed.name}</strong> to <strong className="text-white">{activeProfile.name}</strong>'s profile?
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setConfirmingMed(null)}
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                    <button 
                        onClick={executeAddMed}
                        className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-500 transition-colors"
                    >
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionScanner;
