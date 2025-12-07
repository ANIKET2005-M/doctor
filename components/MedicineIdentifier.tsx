
import React, { useState, useRef } from 'react';
import { identifyMedicine } from '../services/geminiService';
import { MedicineAnalysis } from '../types';
import { Icons } from '../constants';

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
        // Reduced dimensions to prevent "Rpc failed due to xhr error" (payload too large)
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
            // Reduced quality to 0.6 to ensure small payload size
            resolve(canvas.toDataURL('image/jpeg', 0.6));
        } else {
            reject(new Error("Could not get canvas context"));
        }
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const MedicineIdentifier: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<MedicineAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const compressed = await compressImage(file);
        setImagePreview(compressed);
        setResult(null);
    } catch (error) {
        console.error("Image compression error:", error);
        alert("Failed to process image. Please try again.");
    }
  };

  const handleIdentify = async () => {
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    try {
      const base64Data = imagePreview.split(',')[1];
      const analysis = await identifyMedicine(base64Data);
      setResult(analysis);
    } catch (err) {
      console.error(err);
      alert("Failed to identify medicine. Please try again with a clear photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto no-scrollbar pb-24">
      <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/20">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Icons.Pill /> Identify Medicine
        </h2>
        <p className="text-slate-300 text-sm mb-4">
            Not sure what that pill is? Scan a bottle, blister pack, or tablet to get instant details.
        </p>

        {/* Upload Area */}
        <div 
            className="border-2 border-dashed border-indigo-700/50 rounded-2xl p-6 flex flex-col items-center justify-center bg-dark-800/50 cursor-pointer hover:bg-indigo-900/10 transition-colors mb-4"
            onClick={() => fileInputRef.current?.click()}
        >
            {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain shadow-lg" />
            ) : (
                <>
                    <div className="bg-indigo-500/20 p-4 rounded-full mb-3 text-indigo-300">
                        <Icons.Pill />
                    </div>
                    <span className="text-indigo-200 font-medium text-sm">Tap to take photo</span>
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

        {imagePreview && !result && (
             <button 
                onClick={handleIdentify}
                disabled={isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
             >
                {isAnalyzing ? (
                   <>
                     <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                     Analyzing...
                   </>
                ) : (
                   <>Identify Now <Icons.ArrowRight /></>
                )}
             </button>
        )}
      </div>

      {result && (
        <div className="animate-fade-in space-y-4">
            <div className="bg-dark-800 rounded-xl p-5 border border-slate-700 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-1">{result.name}</h3>
                <p className="text-slate-400 text-sm mb-4 italic">{result.description}</p>
                
                <div className="space-y-4">
                    <div>
                        <h4 className="text-primary-400 font-bold text-sm uppercase tracking-wider mb-2">Common Uses</h4>
                        <div className="flex flex-wrap gap-2">
                            {result.uses.map((use, i) => (
                                <span key={i} className="px-3 py-1 bg-primary-900/30 text-primary-200 rounded-full text-xs font-medium border border-primary-800">
                                    {use}
                                </span>
                            ))}
                        </div>
                    </div>

                    {result.side_effects.length > 0 && (
                        <div>
                            <h4 className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-2">Side Effects</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {result.side_effects.join(", ")}
                            </p>
                        </div>
                    )}

                    {result.warnings.length > 0 && (
                        <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-3">
                            <h4 className="text-red-400 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Icons.Warning /> Important Warnings
                            </h4>
                            <ul className="list-disc pl-4 space-y-1">
                                {result.warnings.map((w, i) => (
                                    <li key={i} className="text-red-200/80 text-xs">{w}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
            <button 
                onClick={() => {
                    setImagePreview(null);
                    setResult(null);
                }}
                className="w-full py-3 bg-slate-800 text-slate-300 rounded-xl font-medium hover:bg-slate-700"
            >
                Scan Another
            </button>
        </div>
      )}
    </div>
  );
};

export default MedicineIdentifier;
