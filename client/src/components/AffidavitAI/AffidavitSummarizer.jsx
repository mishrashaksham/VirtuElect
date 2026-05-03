import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import useAppStore from '../../store/appStore';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/**
 * Component to display the AI-generated summary of a candidate's affidavit,
 * and provides an option to listen to the summary via TTS.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.candidate - The candidate data object.
 * @param {Function} props.onClose - Callback to close the summarizer modal.
 * @returns {React.ReactNode} The AffidavitSummarizer component.
 */
const AffidavitSummarizer = ({ candidate, onClose }) => {
  const { language } = useAppStore();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const panelRef = useRef(null);

  useGSAP(() => {
    gsap.from(panelRef.current, {
      y: '100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.out'
    });
  }, []);

  /**
   * Closes the panel with a slide-down animation.
   *
   * @returns {void}
   */
  const closePanel = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    gsap.to(panelRef.current, {
      y: '100%',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: onClose
    });
  };

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/ai/summarize`, {
          candidateId: candidate.id,
          language: language
        });
        setSummary(response.data.summary);
      } catch (err) {
        console.error("AI Summarizer Error:", err);
        setError("Failed to generate AI summary. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    if (candidate) fetchSummary();
  }, [candidate, language]);

  /**
   * Fetches TTS audio from the backend and plays it using the HTML5 Audio API.
   *
   * @returns {Promise<void>}
   */
  const handleListenToSummary = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (!summary) return;

    setIsAudioLoading(true);
    try {
      const fullText = summary.join('. ');
      const response = await axios.post(
        `${API_BASE_URL}/api/tts`,
        { text: fullText, languageCode: language === 'hi' ? 'hi-IN' : 'en-IN' },
        { responseType: 'blob' }
      );

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        console.error("Audio playback error");
        setIsPlaying(false);
      };

      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("TTS Error:", err);
      setError("Failed to generate audio summary. Please try again.");
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none p-4 pb-0 sm:p-6 sm:pb-0">
      <div 
        ref={panelRef}
        className="glass-panel w-full max-w-2xl bg-surface-color/90 border-b-0 rounded-b-none p-6 shadow-2xl pointer-events-auto relative overflow-hidden"
      >
        <button 
          onClick={closePanel}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-bg-color border hover:bg-accent-red/10 hover:text-accent-red transition-colors"
        >
          ✕
        </button>

        <div className="flex justify-between items-start mb-6 border-b pb-4">
          <div>
            <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <span className="text-xl">✨</span> AI Affidavit Summary
            </h3>
            <p className="text-sm text-text-secondary">
              Unbiased 3-point summary for <strong className="text-text-primary">{candidate.name}</strong> ({candidate.partyAbbr}).
            </p>
          </div>
          {summary && !loading && (
            <button
              onClick={handleListenToSummary}
              disabled={isAudioLoading}
              aria-label={isPlaying ? "Stop listening to summary" : "Listen to summary"}
              aria-pressed={isPlaying}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-blue ${
                isPlaying
                  ? 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30'
                  : 'bg-primary-blue text-white hover:bg-primary-blue/90'
              } ${isAudioLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isAudioLoading ? (
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : isPlaying ? (
                <span>⏹ Stop</span>
              ) : (
                <span>🔊 Listen</span>
              )}
            </button>
          )}
        </div>

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-16 bg-bg-color rounded-lg w-full"></div>
            <div className="h-16 bg-bg-color rounded-lg w-full"></div>
            <div className="h-16 bg-bg-color rounded-lg w-full"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-accent-red/10 text-accent-red rounded-lg border border-accent-red/20">
            {error}
          </div>
        )}

        {summary && !loading && (
          <ul className="space-y-4">
            {summary.map((point, idx) => (
              <li key={idx} className="flex gap-4 p-4 rounded-lg bg-bg-color/50 border border-glass-border">
                <span className="font-bold text-primary-blue text-xl">{idx + 1}.</span>
                <p className="leading-relaxed">{point}</p>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-xs text-center text-text-secondary/70">
          Disclaimer: AI-generated summary. Refer to the official ECI affidavit for legal accuracy.
        </p>
      </div>
    </div>
  );
};

export default AffidavitSummarizer;
