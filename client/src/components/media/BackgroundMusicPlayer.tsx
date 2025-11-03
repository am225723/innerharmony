import { useState, useEffect } from "react";
import { Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AudioPlayer } from "./AudioPlayer";
import { backgroundMusic } from "@/lib/mediaLibrary";

interface BackgroundMusicPlayerProps {
  defaultEnabled?: boolean;
}

export function BackgroundMusicPlayer({ defaultEnabled = false }: BackgroundMusicPlayerProps) {
  const [isVisible, setIsVisible] = useState(defaultEnabled);
  const [selectedMusicIndex, setSelectedMusicIndex] = useState(0);

  // Load user preference from localStorage
  useEffect(() => {
    const preference = localStorage.getItem("backgroundMusicEnabled");
    if (preference !== null) {
      setIsVisible(preference === "true");
    }
  }, []);

  // Save user preference to localStorage
  useEffect(() => {
    localStorage.setItem("backgroundMusicEnabled", String(isVisible));
  }, [isVisible]);

  const currentMusic = backgroundMusic[selectedMusicIndex];

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          size="icon"
          variant="default"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => setIsVisible(true)}
          data-testid="button-show-music"
        >
          <Music className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-40 w-80 max-w-[calc(100vw-3rem)]">
      <div className="bg-background border border-border rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Background Music</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setIsVisible(false)}
            data-testid="button-hide-music"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-3">
          <AudioPlayer
            src={currentMusic.src}
            title={currentMusic.title}
            description={currentMusic.description}
            variant="background"
            loop
            autoPlay={false}
          />
          {backgroundMusic.length > 1 && (
            <div className="mt-3 flex gap-2">
              {backgroundMusic.map((music, index) => (
                <Button
                  key={music.id}
                  size="sm"
                  variant={selectedMusicIndex === index ? "default" : "outline"}
                  className="flex-1 text-xs"
                  onClick={() => setSelectedMusicIndex(index)}
                  data-testid={`button-select-music-${index}`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
