import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Shield, Flame, Heart, Plus, Edit2, Trash2, Sun } from "lucide-react";
import { type Part } from "@shared/schema";

interface PartsCanvasProps {
  parts: Part[];
  onAddPart: (part: Omit<Part, "id" | "createdAt" | "userId">) => void;
  onUpdatePart: (id: string, updates: Partial<Part>) => void;
  onDeletePart: (id: string) => void;
}

export function PartsCanvas({ parts, onAddPart, onUpdatePart, onDeletePart }: PartsCanvasProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [newPart, setNewPart] = useState({
    type: "manager" as "manager" | "firefighter" | "exile",
    name: "",
    description: "",
    bodyLocation: "",
  });

  const getPartIcon = (type: string) => {
    switch (type) {
      case "manager": return Shield;
      case "firefighter": return Flame;
      case "exile": return Heart;
      default: return Shield;
    }
  };

  const getPartColor = (type: string) => {
    switch (type) {
      case "manager": return {
        bg: "bg-primary/10",
        text: "text-primary",
        border: "border-primary/30",
        badge: "default" as const,
      };
      case "firefighter": return {
        bg: "bg-accent/10",
        text: "text-accent",
        border: "border-accent/30",
        badge: "destructive" as const,
      };
      case "exile": return {
        bg: "bg-secondary/10",
        text: "text-secondary",
        border: "border-secondary/30",
        badge: "secondary" as const,
      };
      default: return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        border: "border-border",
        badge: "outline" as const,
      };
    }
  };

  const handleAddPart = () => {
    if (newPart.name.trim()) {
      onAddPart({
        ...newPart,
        sessionId: null,
        emotions: [],
        color: null,
        age: null,
        positionX: null,
        positionY: null,
      });
      setNewPart({
        type: "manager",
        name: "",
        description: "",
        bodyLocation: "",
      });
      setShowAddDialog(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-2">Parts Mapping</h1>
          <p className="text-muted-foreground">
            Visualize and understand your internal family system
          </p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="gap-2"
          data-testid="button-add-part"
        >
          <Plus className="w-4 h-4" />
          Add Part
        </Button>
      </div>

      {/* Self in Center */}
      <div className="relative min-h-[600px] bg-muted/30 rounded-lg border-2 border-dashed border-border p-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-primary/40">
              <Sun className="w-12 h-12 text-primary" />
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <Badge variant="outline" className="bg-background">Self</Badge>
            </div>
          </div>
        </div>

        {/* Parts positioned around the Self */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-32">
          {parts.map((part) => {
            const Icon = getPartIcon(part.type);
            const colors = getPartColor(part.type);

            return (
              <Card
                key={part.id}
                className={`p-4 ${colors.border} border-2 hover-elevate cursor-pointer`}
                data-testid={`part-${part.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{part.name}</h3>
                      <Badge variant={colors.badge} className="mt-1">
                        {part.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditingPart(part)}
                      data-testid={`button-edit-${part.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDeletePart(part.id)}
                      data-testid={`button-delete-${part.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {part.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {part.description}
                  </p>
                )}
                {part.bodyLocation && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Location: {part.bodyLocation}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        {parts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md mt-32">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No parts mapped yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by identifying the parts of yourself that manage your daily life,
                protect you from pain, or hold your deepest wounds.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Part Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-testid="dialog-add-part">
          <DialogHeader>
            <DialogTitle className="font-display">Add a New Part</DialogTitle>
            <DialogDescription>
              Give this part a name and describe its role in your system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="part-type">Part Type</Label>
              <Select
                value={newPart.type}
                onValueChange={(value: "manager" | "firefighter" | "exile") =>
                  setNewPart({ ...newPart, type: value })
                }
              >
                <SelectTrigger id="part-type" data-testid="select-part-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager (Proactive Protector)</SelectItem>
                  <SelectItem value="firefighter">Firefighter (Reactive Protector)</SelectItem>
                  <SelectItem value="exile">Exile (Inner Child)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="part-name">Name</Label>
              <Input
                id="part-name"
                placeholder="e.g., The Perfectionist, The Critic"
                value={newPart.name}
                onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                data-testid="input-part-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="part-description">Description</Label>
              <Textarea
                id="part-description"
                placeholder="What does this part do? What is its job?"
                value={newPart.description}
                onChange={(e) => setNewPart({ ...newPart, description: e.target.value })}
                data-testid="textarea-part-description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body-location">Body Location (Optional)</Label>
              <Input
                id="body-location"
                placeholder="e.g., tightness in chest, knot in stomach"
                value={newPart.bodyLocation}
                onChange={(e) => setNewPart({ ...newPart, bodyLocation: e.target.value })}
                data-testid="input-body-location"
              />
            </div>

            <Button
              onClick={handleAddPart}
              className="w-full"
              data-testid="button-save-part"
            >
              Add Part
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
