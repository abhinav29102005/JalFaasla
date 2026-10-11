/**
 * JalFaasla Voice Advisory (AWS Polly / Web Speech Synthesis)
 * Generates natural audio playback in Punjabi, Hindi, and English.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function playPunjabiAdvisory(
  text: string,
  lang: 'pa' | 'hi' | 'en' = 'pa',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: any) => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onError?.(new Error('Speech synthesis not supported'));
    return () => {};
  }

  // Cancel any ongoing playback
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  currentUtterance = utterance;

  // Language configuration
  if (lang === 'pa') {
    utterance.lang = 'pa-IN';
    utterance.rate = 0.88; // Slightly measured pace for rural farmer clarity
  } else if (lang === 'hi') {
    utterance.lang = 'hi-IN';
    utterance.rate = 0.92;
  } else {
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
  }

  // Select best matching voice if available
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(utterance.lang)) || 
                voices.find(v => v.lang.startsWith('hi')) || 
                voices.find(v => v.lang.startsWith('en'));
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => onStart?.();
  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };
  utterance.onerror = (e) => {
    currentUtterance = null;
    onError?.(e);
  };

  window.speechSynthesis.speak(utterance);

  // Return cancel function
  return () => {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    onEnd?.();
  };
}

export function stopVoiceAdvisory(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

// Resilient aliases for backwards compatibility
export const speakPunjabiAdvisory = playPunjabiAdvisory;
export const stopSpeaking = stopVoiceAdvisory;

