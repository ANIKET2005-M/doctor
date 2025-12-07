
import React, { useState, useEffect } from 'react';
import { findNearbyPharmacies, parsePharmacyText } from '../services/geminiService';
import { Icons } from '../constants';
import { PharmacyStructuredItem } from '../types';

const PharmacyFinder: React.FC = () => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<{ text: string, chunks: any[] } | null>(null);
  const [structuredList, setStructuredList] = useState<PharmacyStructuredItem[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLoc(false);
        },
        (error) => {
          console.error("Loc Error", error);
          setLoadingLoc(false);
        }
      );
    } else {
      setLoadingLoc(false);
    }
  }, []);

  const handleSearch = async () => {
    if (!location) return;
    setSearching(true);
    setStructuredList([]);
    setResults(null);
    try {
      const data = await findNearbyPharmacies(location.lat, location.lng, "pharmacies open now");
      setResults(data);
      
      // Immediately parse the text to get structured cards
      if (data.text) {
        const parsed = await parsePharmacyText(data.text);
        setStructuredList(parsed.pharmacies);
      }
    } catch (e) {
      alert("Failed to find pharmacies");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4 overflow-y-auto no-scrollbar pb-24">
      <div className="bg-primary-500/10 p-6 rounded-2xl border border-primary-500/20">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Icons.Map /> Pharmacy Finder
        </h2>
        <p className="text-slate-300 text-sm mb-4">
            Locate trustworthy pharmacies near you instantly using Google Maps data.
        </p>
        
        {loadingLoc ? (
             <div className="text-slate-400 text-sm animate-pulse">Detecting location...</div>
        ) : location ? (
             <button 
                onClick={handleSearch}
                disabled={searching}
                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center gap-2"
             >
                {searching ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/> : <Icons.Map />}
                Find Nearby Pharmacies
             </button>
        ) : (
            <div className="bg-red-900/20 text-red-300 p-3 rounded-lg text-sm border border-red-900/50">
                Location access is required to find nearby pharmacies. Please enable location permissions.
            </div>
        )}
      </div>

      {results && (
          <div className="animate-fade-in space-y-4">
              
              {/* Structured AI Summary Cards (Parsed from Text) */}
              {structuredList.length > 0 ? (
                  <div className="grid gap-3">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Top Results (AI Summary)</h3>
                      {structuredList.map((item, idx) => (
                          <div key={idx} className="bg-dark-800 p-4 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden flex flex-col gap-2">
                               <div className="flex justify-between items-start">
                                   <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                   {item.rating && (
                                       <span className="flex items-center gap-1 bg-yellow-900/30 text-yellow-300 px-2 py-0.5 rounded text-xs font-bold border border-yellow-700/50">
                                           {item.rating} <Icons.Star /> <span className="text-yellow-500/70 font-normal">({item.reviews_count})</span>
                                       </span>
                                   )}
                               </div>
                               <div className="flex items-center gap-4 text-sm text-slate-300">
                                   {item.distance && (
                                       <span className="flex items-center gap-1"><Icons.Map /> {item.distance}</span>
                                   )}
                                   {item.travel_time && (
                                       <span className="flex items-center gap-1 text-primary-400"><Icons.Walk /> {item.travel_time}</span>
                                   )}
                               </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  // Fallback if parsing fails or returns empty, show raw text
                  <div className="text-slate-300 text-sm bg-dark-800 p-4 rounded-xl border border-slate-700">
                      {results.text}
                  </div>
              )}

              {/* Google Maps Grounding Chunks (Canonical Data) */}
              {results.chunks && results.chunks.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-800">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Google Maps Links</h3>
                      <div className="grid gap-3">
                          {results.chunks.map((chunk: any, i: number) => {
                              if (!chunk.googleMapsMetadata) return null;
                              const place = chunk.googleMapsMetadata.place;
                              if (!place) return null;

                              return (
                                  <div key={i} className="bg-dark-800/50 p-3 rounded-lg border border-slate-700/50 flex flex-col gap-1">
                                      <div className="flex justify-between items-center">
                                          <h4 className="font-semibold text-slate-200 text-sm">{place.name}</h4>
                                          {place.googleMapsUri && (
                                            <a 
                                                href={place.googleMapsUri} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-primary-400 text-xs font-medium flex items-center gap-0.5 hover:text-primary-300 bg-primary-900/20 px-2 py-1 rounded"
                                            >
                                                Open Map <Icons.ArrowRight />
                                            </a>
                                          )}
                                      </div>
                                      <p className="text-slate-500 text-xs truncate">{place.formattedAddress}</p>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

export default PharmacyFinder;
