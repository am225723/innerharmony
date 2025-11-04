import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trash2, AlertCircle } from "lucide-react";
import type { BodySensation, Part } from "@shared/schema";

export default function BodySensationsMap() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const { toast } = useToast();

  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [sensation, setSensation] = useState("");
  const [intensity, setIntensity] = useState([5]);
  const [notes, setNotes] = useState("");
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  // Fetch saved sensations
  const { data: sensations = [] } = useQuery<BodySensation[]>({
    queryKey: [`/api/body-sensations?userId=${currentUser.id}`],
    enabled: !!currentUser.id,
  });

  // Fetch user's parts
  const { data: parts = [] } = useQuery<Part[]>({
    queryKey: ["/api/parts", currentUser.id],
    enabled: !!currentUser.id,
  });

  // Save sensation mutation
  const saveSensation = useMutation({
    mutationFn: async () => {
      const sensationData = {
        userId: currentUser.id,
        bodyRegion: selectedRegion,
        sensation: sensation.trim(),
        intensity: intensity[0],
        associatedParts: selectedParts,
        notes: notes.trim() || null,
      };
      const res = await apiRequest("POST", "/api/body-sensations", sensationData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/body-sensations?userId=${currentUser.id}`] });
      toast({
        title: "Sensation Mapped",
        description: "Your body sensation has been saved.",
      });
      // Reset form
      setSelectedRegion("");
      setSensation("");
      setIntensity([5]);
      setNotes("");
      setSelectedParts([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save sensation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete sensation mutation
  const deleteSensation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/body-sensations/${id}?userId=${currentUser.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/body-sensations?userId=${currentUser.id}`] });
      toast({
        title: "Sensation Removed",
        description: "Body sensation has been deleted.",
      });
    },
  });

  // Body regions configuration
  const bodyRegions = [
    { id: "head", label: "Head", cx: "200", cy: "60", r: "35" },
    { id: "neck", label: "Neck", cx: "200", cy: "110", r: "20" },
    { id: "left_shoulder", label: "Left Shoulder", cx: "150", cy: "140", r: "25" },
    { id: "right_shoulder", label: "Right Shoulder", cx: "250", cy: "140", r: "25" },
    { id: "chest", label: "Chest", cx: "200", cy: "180", r: "40" },
    { id: "stomach", label: "Stomach", cx: "200", cy: "250", r: "35" },
    { id: "left_arm", label: "Left Arm", cx: "130", cy: "200", r: "20" },
    { id: "right_arm", label: "Right Arm", cx: "270", cy: "200", r: "20" },
    { id: "left_hand", label: "Left Hand", cx: "110", cy: "280", r: "18" },
    { id: "right_hand", label: "Right Hand", cx: "290", cy: "280", r: "18" },
    { id: "pelvis", label: "Pelvis", cx: "200", cy: "310", r: "30" },
    { id: "left_leg", label: "Left Leg", cx: "180", cy: "400", r: "22" },
    { id: "right_leg", label: "Right Leg", cx: "220", cy: "400", r: "22" },
    { id: "left_foot", label: "Left Foot", cx: "180", cy: "480", r: "18" },
    { id: "right_foot", label: "Right Foot", cx: "220", cy: "480", r: "18" },
  ];

  const togglePart = (partName: string) => {
    if (selectedParts.includes(partName)) {
      setSelectedParts(selectedParts.filter(p => p !== partName));
    } else {
      setSelectedParts([...selectedParts, partName]);
    }
  };

  const getIntensityColor = (level: number) => {
    if (level <= 3) return "#4ECDC4"; // Teal - low intensity
    if (level <= 6) return "#FFB347"; // Orange - medium intensity
    return "#FF6B9D"; // Pink - high intensity
  };

  // Check if a region has sensations
  const getRegionSensations = (regionId: string) => {
    return sensations.filter(s => s.bodyRegion === regionId);
  };

  const hasRegionSensations = (regionId: string) => {
    return getRegionSensations(regionId).length > 0;
  };

  const getRegionMaxIntensity = (regionId: string) => {
    const regionSensations = getRegionSensations(regionId);
    if (regionSensations.length === 0) return 0;
    return Math.max(...regionSensations.map(s => s.intensity));
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl" data-testid="page-body-sensations-map">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: 'Poppins' }} data-testid="heading-body-sensations">
          Body Sensations Anxiety Map
        </h1>
        <p className="text-muted-foreground" data-testid="text-description">
          Click on body regions to map where you physically experience anxiety. Track sensations, intensity levels, and connections to your parts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Body Diagram */}
        <Card className="p-8" data-testid="card-body-diagram">
          <h2 className="text-xl font-medium mb-6" style={{ fontFamily: 'Poppins' }} data-testid="heading-select-region">
            Select Body Region
          </h2>
          <div className="flex justify-center">
            <svg
              width="400"
              height="520"
              viewBox="0 0 400 520"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-full"
              data-testid="svg-body-diagram"
            >
              {/* Body outline (simple silhouette) */}
              <ellipse cx="200" cy="60" rx="38" ry="45" fill="#F8F9FE" stroke="#6B73FF" strokeWidth="2" />
              <rect x="175" y="100" width="50" height="25" rx="5" fill="#F8F9FE" stroke="#6B73FF" strokeWidth="2" />
              <ellipse cx="200" cy="180" rx="55" ry="50" fill="#F8F9FE" stroke="#6B73FF" strokeWidth="2" />
              <ellipse cx="200" cy="250" rx="45" ry="45" fill="#F8F9FE" stroke="#6B73FF" strokeWidth="2" />
              <rect x="165" y="290" width="70" height="40" rx="10" fill="#F8F9FE" stroke="#6B73FF" strokeWidth="2" />
              
              {/* Arms */}
              <line x1="145" y1="140" x2="110" y2="280" stroke="#6B73FF" strokeWidth="18" strokeLinecap="round" opacity="0.3" />
              <line x1="255" y1="140" x2="290" y2="280" stroke="#6B73FF" strokeWidth="18" strokeLinecap="round" opacity="0.3" />
              
              {/* Legs */}
              <line x1="180" y1="330" x2="180" y2="460" stroke="#6B73FF" strokeWidth="20" strokeLinecap="round" opacity="0.3" />
              <line x1="220" y1="330" x2="220" y2="460" stroke="#6B73FF" strokeWidth="20" strokeLinecap="round" opacity="0.3" />

              {/* Clickable regions */}
              {bodyRegions.map((region) => {
                const hasSensation = hasRegionSensations(region.id);
                const maxIntensity = getRegionMaxIntensity(region.id);
                const isSelected = selectedRegion === region.id;

                return (
                  <g key={region.id}>
                    <circle
                      cx={region.cx}
                      cy={region.cy}
                      r={region.r}
                      fill={hasSensation ? getIntensityColor(maxIntensity) : "transparent"}
                      opacity={hasSensation ? "0.6" : isSelected ? "0.3" : "0"}
                      stroke={isSelected ? "#6B73FF" : hasSensation ? getIntensityColor(maxIntensity) : "#CBD5E1"}
                      strokeWidth={isSelected ? "3" : "1.5"}
                      className="cursor-pointer transition-all hover:opacity-70"
                      onClick={() => setSelectedRegion(region.id)}
                      data-testid={`region-${region.id}`}
                    />
                    {hasSensation && (
                      <text
                        x={region.cx}
                        y={parseInt(region.cy) - parseInt(region.r) - 10}
                        textAnchor="middle"
                        fontSize="11"
                        fill="#64748B"
                        fontWeight="500"
                        data-testid={`text-region-count-${region.id}`}
                      >
                        {getRegionSensations(region.id).length}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg" data-testid="container-legend">
            <h3 className="text-sm font-medium mb-3" data-testid="heading-legend">Intensity Legend</h3>
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4ECDC4" }}></div>
                <span className="text-sm" data-testid="text-legend-low">Low (1-3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#FFB347" }}></div>
                <span className="text-sm" data-testid="text-legend-medium">Medium (4-6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#FF6B9D" }}></div>
                <span className="text-sm" data-testid="text-legend-high">High (7-10)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Sensation Form */}
        <Card className="p-8" data-testid="card-sensation-form">
          <h2 className="text-xl font-medium mb-6" style={{ fontFamily: 'Poppins' }} data-testid="heading-map-sensation">
            Map Sensation
          </h2>

          {!selectedRegion ? (
            <div className="flex flex-col items-center justify-center py-12 text-center" data-testid="container-select-region-prompt">
              <AlertCircle className="w-12 h-12 mb-4" style={{ color: "#6B73FF" }} />
              <p className="text-muted-foreground" data-testid="text-select-region-prompt">
                Click on a body region to start mapping your sensation
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label data-testid="label-selected-region">Selected Region</Label>
                <div className="mt-2">
                  <Badge variant="outline" className="text-base" data-testid="badge-selected-region">
                    {bodyRegions.find(r => r.id === selectedRegion)?.label}
                  </Badge>
                </div>
              </div>

              <div>
                <Label htmlFor="sensation" data-testid="label-sensation-description">Sensation Description *</Label>
                <Textarea
                  id="sensation"
                  placeholder="e.g., Tightness, butterflies, heaviness, tingling..."
                  value={sensation}
                  onChange={(e) => setSensation(e.target.value)}
                  rows={3}
                  className="mt-2"
                  data-testid="textarea-sensation"
                />
              </div>

              <div>
                <Label data-testid="label-intensity">Intensity: {intensity[0]}/10</Label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-4"
                  data-testid="slider-intensity"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span data-testid="text-intensity-low">Barely noticeable</span>
                  <span data-testid="text-intensity-high">Overwhelming</span>
                </div>
              </div>

              <div>
                <Label data-testid="label-associated-parts">Associated Parts (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-3" data-testid="text-parts-description">
                  Which parts might be creating this sensation?
                </p>
                <div className="flex flex-wrap gap-2">
                  {parts.length === 0 ? (
                    <p className="text-sm text-muted-foreground" data-testid="text-no-parts">
                      No parts mapped yet. Visit Parts Mapping to create parts.
                    </p>
                  ) : (
                    parts.map((part) => (
                      <Badge
                        key={part.id}
                        variant={selectedParts.includes(part.name) ? "default" : "outline"}
                        className="cursor-pointer hover-elevate active-elevate-2"
                        onClick={() => togglePart(part.name)}
                        data-testid={`badge-part-${part.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {part.name}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" data-testid="label-notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any context, triggers, or patterns you notice..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="mt-2"
                  data-testid="textarea-notes"
                />
              </div>

              <Button
                onClick={() => saveSensation.mutate()}
                disabled={!sensation.trim() || saveSensation.isPending}
                className="w-full"
                data-testid="button-save-sensation"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {saveSensation.isPending ? "Saving..." : "Save Sensation"}
              </Button>
            </div>
          )}
        </Card>

        {/* Saved Sensations List */}
        <Card className="p-8 lg:col-span-2" data-testid="card-saved-sensations">
          <h2 className="text-xl font-medium mb-6" style={{ fontFamily: 'Poppins' }} data-testid="heading-saved-sensations">
            Your Body Sensation Map
          </h2>

          {sensations.length === 0 ? (
            <div className="text-center py-12" data-testid="container-no-sensations">
              <p className="text-muted-foreground" data-testid="text-no-sensations">
                No sensations mapped yet. Click on body regions above to start tracking.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensations.map((sens) => (
                <Card key={sens.id} className="p-4" data-testid={`card-sensation-${sens.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" data-testid={`badge-region-${sens.bodyRegion}`}>
                      {bodyRegions.find(r => r.id === sens.bodyRegion)?.label}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge
                        style={{ backgroundColor: getIntensityColor(sens.intensity), color: "white" }}
                        data-testid={`badge-intensity-${sens.id}`}
                      >
                        {sens.intensity}/10
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSensation.mutate(sens.id)}
                        className="h-6 w-6"
                        data-testid={`button-delete-${sens.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <p className="font-medium mb-2" data-testid={`text-sensation-${sens.id}`}>{sens.sensation}</p>

                  {sens.associatedParts && sens.associatedParts.length > 0 && (
                    <div className="mb-2" data-testid={`container-parts-${sens.id}`}>
                      <p className="text-xs text-muted-foreground mb-1">Parts:</p>
                      <div className="flex flex-wrap gap-1">
                        {sens.associatedParts.map((partName, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs" data-testid={`badge-sensation-part-${idx}`}>
                            {partName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {sens.notes && (
                    <p className="text-sm text-muted-foreground mt-2" data-testid={`text-notes-${sens.id}`}>
                      {sens.notes}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-3" data-testid={`text-date-${sens.id}`}>
                    {new Date(sens.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
