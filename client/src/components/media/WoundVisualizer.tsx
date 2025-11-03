import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X, UserX, Scale, Swords, EyeOff } from "lucide-react";

interface WoundVisualizerProps {
  wound: "rejection" | "abandonment" | "injustice" | "betrayal" | "neglect";
  className?: string;
}

const woundData = {
  rejection: {
    name: "Rejection",
    color: "hsl(280, 65%, 60%)",
    Icon: X,
    description: "The deep fear of not being accepted or wanted",
    bodyArea: "Heart & Throat",
    sensation: "Tightness, constriction, closing off",
    protectors: "Perfectionism, people-pleasing, achievement",
    coreFeeling: "Not good enough, defective, unwanted",
  },
  abandonment: {
    name: "Abandonment",
    color: "hsl(200, 70%, 45%)",
    Icon: UserX,
    description: "The fear of being left alone or unsupported",
    bodyArea: "Stomach & Solar Plexus",
    sensation: "Emptiness, hollow feeling, panic",
    protectors: "Clinginess, independence, control",
    coreFeeling: "Alone, helpless, terrified of loss",
  },
  injustice: {
    name: "Injustice",
    color: "hsl(0, 75%, 55%)",
    Icon: Scale,
    description: "Experiences of unfairness and invalidation",
    bodyArea: "Jaw & Shoulders",
    sensation: "Tension, rigidity, burning anger",
    protectors: "Rigidity, justification, righteousness",
    coreFeeling: "Powerless, wronged, invalidated",
  },
  betrayal: {
    name: "Betrayal",
    color: "hsl(30, 80%, 50%)",
    Icon: Swords,
    description: "Broken trust and shattered safety",
    bodyArea: "Back & Chest",
    sensation: "Stabbing pain, heaviness, guardedness",
    protectors: "Suspicion, walls, self-reliance",
    coreFeeling: "Unsafe, deceived, vigilant",
  },
  neglect: {
    name: "Neglect",
    color: "hsl(45, 75%, 60%)",
    Icon: EyeOff,
    description: "Unmet needs and chronic invisibility",
    bodyArea: "Full Body - Diffuse",
    sensation: "Numbness, disconnection, fading",
    protectors: "Self-sufficiency, minimizing needs, denial",
    coreFeeling: "Invisible, unimportant, forgotten",
  },
};

export function WoundVisualizer({ wound, className }: WoundVisualizerProps) {
  const data = woundData[wound];
  const Icon = data.Icon;

  return (
    <Card className={cn("overflow-hidden", className)} data-testid={`wound-visualizer-${wound}`}>
      <CardHeader
        className="pb-4"
        style={{
          borderLeft: `4px solid ${data.color}`,
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Icon className="h-6 w-6" style={{ color: data.color }} />
              <span>{data.name} Wound</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual representation */}
        <div
          className="relative h-40 rounded-lg flex items-center justify-center overflow-hidden"
          style={{
            background: `radial-gradient(circle at center, ${data.color}20 0%, ${data.color}05 70%)`,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-32 h-32 rounded-full opacity-30 animate-pulse"
              style={{
                background: `radial-gradient(circle, ${data.color} 0%, transparent 70%)`,
                animation: "pulse 3s ease-in-out infinite",
              }}
            />
          </div>
          <Icon className="h-24 w-24 relative z-10" style={{ color: data.color, opacity: 0.7 }} />
        </div>

        {/* Details */}
        <div className="grid gap-3">
          <div>
            <Badge variant="outline" className="mb-1">
              Body Location
            </Badge>
            <p className="text-sm">{data.bodyArea}</p>
          </div>
          
          <div>
            <Badge variant="outline" className="mb-1">
              Physical Sensation
            </Badge>
            <p className="text-sm text-muted-foreground">{data.sensation}</p>
          </div>

          <div>
            <Badge variant="outline" className="mb-1">
              Core Feeling
            </Badge>
            <p className="text-sm text-muted-foreground italic">"{data.coreFeeling}"</p>
          </div>

          <div>
            <Badge variant="outline" className="mb-1">
              Common Protectors
            </Badge>
            <p className="text-sm text-muted-foreground">{data.protectors}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
