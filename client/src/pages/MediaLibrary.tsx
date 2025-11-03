import { useState } from "react";
import { BookOpen, Music, Video, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioPlayer } from "@/components/media/AudioPlayer";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { WoundVisualizer } from "@/components/media/WoundVisualizer";
import { guidedMeditations, backgroundMusic, conceptVideos } from "@/lib/mediaLibrary";

export default function MediaLibrary() {
  const [selectedWound, setSelectedWound] = useState<"rejection" | "abandonment" | "injustice" | "betrayal" | "neglect">("rejection");

  const wounds = [
    { id: "rejection" as const, name: "Rejection" },
    { id: "abandonment" as const, name: "Abandonment" },
    { id: "injustice" as const, name: "Injustice" },
    { id: "betrayal" as const, name: "Betrayal" },
    { id: "neglect" as const, name: "Neglect" },
  ];

  return (
    <div className="h-full overflow-auto">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Multimedia Library
          </h1>
          <p className="text-muted-foreground">
            Guided meditations, educational videos, and visual tools to support your IFS journey
          </p>
        </div>

        <Tabs defaultValue="meditations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="meditations" data-testid="tab-meditations">
              <Heart className="h-4 w-4 mr-2" />
              Meditations
            </TabsTrigger>
            <TabsTrigger value="videos" data-testid="tab-videos">
              <Video className="h-4 w-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="music" data-testid="tab-music">
              <Music className="h-4 w-4 mr-2" />
              Music
            </TabsTrigger>
            <TabsTrigger value="wounds" data-testid="tab-wounds">
              <BookOpen className="h-4 w-4 mr-2" />
              Wound Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meditations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guided Meditations</CardTitle>
                <CardDescription>
                  These meditations help you connect with Self-energy, ground yourself, and work compassionately with your parts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {guidedMeditations.map((meditation) => (
                  <AudioPlayer
                    key={meditation.id}
                    src={meditation.src}
                    title={meditation.title}
                    description={meditation.description}
                    variant="default"
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>IFS Educational Videos</CardTitle>
                <CardDescription>
                  Watch these videos to deepen your understanding of IFS concepts and protocols
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {conceptVideos.map((video) => (
                  <VideoPlayer
                    key={video.id}
                    src={video.src}
                    title={video.title}
                    description={video.description}
                    poster={video.poster}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Background Music</CardTitle>
                <CardDescription>
                  Calming music to support your protocol work, journaling, and healing practices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {backgroundMusic.map((music) => (
                  <AudioPlayer
                    key={music.id}
                    src={music.src}
                    title={music.title}
                    description={music.description}
                    variant="compact"
                    loop
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wounds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Childhood Wounds</CardTitle>
                <CardDescription>
                  Visual representations of the 5 core wounds, including body sensations, feelings, and protective responses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {wounds.map((wound) => (
                    <button
                      key={wound.id}
                      onClick={() => setSelectedWound(wound.id)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedWound === wound.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover-elevate"
                      }`}
                      data-testid={`button-wound-${wound.id}`}
                    >
                      {wound.name}
                    </button>
                  ))}
                </div>

                <WoundVisualizer wound={selectedWound} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
