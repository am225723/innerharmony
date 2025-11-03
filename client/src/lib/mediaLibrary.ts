// Media Library - Sample URLs for therapeutic content
// Replace these URLs with actual hosted media files

export interface MediaItem {
  id: string;
  type: "audio" | "video";
  title: string;
  description: string;
  category: "meditation" | "concept" | "music" | "protocol";
  src: string;
  duration?: string;
  poster?: string;
}

export const guidedMeditations: MediaItem[] = [
  {
    id: "self-energy-meditation",
    type: "audio",
    title: "Accessing Self-Energy",
    description: "A 10-minute guided meditation to connect with your compassionate core Self and the 8 C's of Self-energy.",
    category: "meditation",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Replace with actual meditation audio
    duration: "10:00",
  },
  {
    id: "grounding-meditation",
    type: "audio",
    title: "Grounding & Safety",
    description: "A gentle 5-minute practice to feel grounded and safe in your body before parts work.",
    category: "meditation",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Replace with actual meditation audio
    duration: "5:00",
  },
  {
    id: "protector-appreciation",
    type: "audio",
    title: "Appreciating Your Protectors",
    description: "A compassionate meditation honoring the parts that work so hard to keep you safe.",
    category: "meditation",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // Replace with actual meditation audio
    duration: "8:00",
  },
  {
    id: "exile-witnessing",
    type: "audio",
    title: "Witnessing Meditation",
    description: "A tender guided practice for bearing witness to your young exiled parts with compassion.",
    category: "meditation",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", // Replace with actual meditation audio
    duration: "12:00",
  },
];

export const backgroundMusic: MediaItem[] = [
  {
    id: "calm-ambient",
    type: "audio",
    title: "Peaceful Ambient",
    description: "Soft, calming background music for protocol work and journaling.",
    category: "music",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", // Replace with actual background music
  },
  {
    id: "healing-sounds",
    type: "audio",
    title: "Healing Soundscape",
    description: "Gentle healing frequencies and nature sounds for deep work.",
    category: "music",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", // Replace with actual background music
  },
];

export const conceptVideos: MediaItem[] = [
  {
    id: "what-is-ifs",
    type: "video",
    title: "What is Internal Family Systems?",
    description: "A gentle introduction to the IFS model and the concept of parts.",
    category: "concept",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Replace with actual IFS video
    poster: "https://via.placeholder.com/640x360/6B73FF/ffffff?text=What+is+IFS",
    duration: "8:00",
  },
  {
    id: "understanding-protectors",
    type: "video",
    title: "Understanding Your Protectors",
    description: "Learn about manager and firefighter parts and how they work to keep you safe.",
    category: "concept",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", // Replace with actual IFS video
    poster: "https://via.placeholder.com/640x360/4ECDC4/ffffff?text=Protectors",
    duration: "10:00",
  },
  {
    id: "the-8-cs",
    type: "video",
    title: "The 8 C's of Self-Energy",
    description: "Explore the qualities of Self: Calm, Curiosity, Compassion, Clarity, Confidence, Courage, Creativity, and Connectedness.",
    category: "concept",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Replace with actual IFS video
    poster: "https://via.placeholder.com/640x360/6B73FF/ffffff?text=8+Cs",
    duration: "12:00",
  },
  {
    id: "befriending-exiles",
    type: "video",
    title: "Befriending Your Exiles",
    description: "Learn how to approach wounded inner child parts with compassion and curiosity.",
    category: "concept",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", // Replace with actual IFS video
    poster: "https://via.placeholder.com/640x360/4ECDC4/ffffff?text=Exiles",
    duration: "15:00",
  },
  {
    id: "six-fs-protocol",
    type: "video",
    title: "The 6 F's Protocol Walkthrough",
    description: "Step-by-step guidance through the complete 6 F's protocol for working with protectors.",
    category: "protocol",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", // Replace with actual IFS video
    poster: "https://via.placeholder.com/640x360/6B73FF/ffffff?text=6+Fs",
    duration: "18:00",
  },
];

export const allMedia = [...guidedMeditations, ...backgroundMusic, ...conceptVideos];

export function getMediaById(id: string): MediaItem | undefined {
  return allMedia.find((item) => item.id === id);
}

export function getMediaByCategory(category: MediaItem["category"]): MediaItem[] {
  return allMedia.filter((item) => item.category === category);
}
