import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Heart, 
  AlertTriangle, 
  Target, 
  CheckCircle,
  Shield,
  Users,
  Scale,
  UserX,
  Eye
} from "lucide-react";

export default function WoundToAnxietyExplorer() {
  const [selectedWound, setSelectedWound] = useState<string>("rejection");

  const wounds = [
    {
      id: "rejection",
      name: "Rejection Wound",
      icon: UserX,
      color: "bg-pink-500",
      borderColor: "border-pink-500",
      textColor: "text-pink-600",
      lightBg: "bg-pink-50 dark:bg-pink-950/20",
      description: "The wound of rejection forms when a child feels fundamentally unwanted, unaccepted, or not good enough.",
      coreBeliefs: [
        "I am not good enough",
        "I don't belong anywhere",
        "People will always reject me",
        "I am fundamentally flawed"
      ],
      anxietyManifestations: [
        {
          title: "Social Anxiety",
          description: "Intense fear of being judged, criticized, or rejected by others",
          examples: [
            "Avoiding social gatherings for fear of not fitting in",
            "Excessive worry about what others think",
            "Physical symptoms (sweating, trembling) in social situations"
          ]
        },
        {
          title: "Performance Anxiety",
          description: "Fear of not meeting expectations and being rejected for failure",
          examples: [
            "Procrastination due to fear of imperfection",
            "Perfectionism to avoid criticism",
            "Panic before presentations or evaluations"
          ]
        },
        {
          title: "Relationship Anxiety",
          description: "Constant worry that people will discover you're 'not enough' and leave",
          examples: [
            "People-pleasing behaviors",
            "Difficulty setting boundaries",
            "Fear of being authentic"
          ]
        }
      ],
      parts: [
        {
          type: "Manager",
          name: "The Perfectionist",
          role: "Tries to prevent rejection by making you flawless"
        },
        {
          type: "Manager",
          name: "The People-Pleaser",
          role: "Ensures everyone likes you to avoid rejection"
        },
        {
          type: "Firefighter",
          name: "The Withdrawer",
          role: "Protects by keeping you isolated from potential rejection"
        },
        {
          type: "Exile",
          name: "The Unwanted Child",
          role: "Carries the pain of feeling fundamentally unacceptable"
        }
      ],
      healingStrategies: [
        "Practice self-compassion and self-acceptance",
        "Challenge negative self-beliefs with evidence",
        "Build authentic connections where you can be yourself",
        "Expose yourself gradually to social situations",
        "Work with your Parts to understand their protective roles"
      ]
    },
    {
      id: "abandonment",
      name: "Abandonment Wound",
      icon: Heart,
      color: "bg-purple-500",
      borderColor: "border-purple-500",
      textColor: "text-purple-600",
      lightBg: "bg-purple-50 dark:bg-purple-950/20",
      description: "The abandonment wound develops when a child experiences physical or emotional abandonment, creating a deep fear of being left alone.",
      coreBeliefs: [
        "Everyone will eventually leave me",
        "I am not worthy of staying for",
        "Being alone is unbearable",
        "I cannot survive on my own"
      ],
      anxietyManifestations: [
        {
          title: "Separation Anxiety",
          description: "Intense distress when separated from loved ones or anticipating separation",
          examples: [
            "Panic when partner doesn't respond to messages",
            "Fear of being alone at home",
            "Constant need for reassurance"
          ]
        },
        {
          title: "Attachment Anxiety",
          description: "Fear that relationships will end, leading to clingy or controlling behaviors",
          examples: [
            "Checking in excessively with loved ones",
            "Difficulty trusting partner's commitment",
            "Jealousy and possessiveness"
          ]
        },
        {
          title: "Anticipatory Anxiety",
          description: "Constant worry about potential future abandonment",
          examples: [
            "Reading into every small change in behavior",
            "Creating 'tests' to see if people will stay",
            "Self-sabotaging to 'get it over with'"
          ]
        }
      ],
      parts: [
        {
          type: "Manager",
          name: "The Clinger",
          role: "Keeps you attached to prevent abandonment"
        },
        {
          type: "Manager",
          name: "The Monitor",
          role: "Constantly scans for signs someone might leave"
        },
        {
          type: "Firefighter",
          name: "The Self-Saboteur",
          role: "Pushes people away to avoid the pain of being left"
        },
        {
          type: "Exile",
          name: "The Abandoned Child",
          role: "Carries the terror and grief of being left alone"
        }
      ],
      healingStrategies: [
        "Develop a secure sense of self independent of others",
        "Practice being alone in small, manageable doses",
        "Build trust in relationships gradually",
        "Learn to self-soothe when feeling abandoned",
        "Recognize that you can survive and thrive independently"
      ]
    },
    {
      id: "injustice",
      name: "Injustice Wound",
      icon: Scale,
      color: "bg-orange-500",
      borderColor: "border-orange-500",
      textColor: "text-orange-600",
      lightBg: "bg-orange-50 dark:bg-orange-950/20",
      description: "The injustice wound forms when a child experiences unfair treatment, criticism, or a lack of recognition for their efforts.",
      coreBeliefs: [
        "The world is unfair",
        "I must be perfect to be valued",
        "My feelings and needs don't matter",
        "I am always judged and criticized"
      ],
      anxietyManifestations: [
        {
          title: "Perfectionist Anxiety",
          description: "Intense fear of making mistakes or being criticized",
          examples: [
            "Excessive checking and rechecking of work",
            "Inability to complete tasks due to perfectionism",
            "Harsh self-criticism for minor errors"
          ]
        },
        {
          title: "Control Anxiety",
          description: "Need to control everything to prevent perceived injustice",
          examples: [
            "Rigidity in routines and expectations",
            "Difficulty delegating or trusting others",
            "Anger when things don't go 'right'"
          ]
        },
        {
          title: "Comparison Anxiety",
          description: "Constant worry about fairness and being treated differently",
          examples: [
            "Obsessive comparison to others",
            "Resentment when others receive recognition",
            "Feeling victimized by circumstances"
          ]
        }
      ],
      parts: [
        {
          type: "Manager",
          name: "The Perfectionist",
          role: "Ensures everything is done 'right' to avoid criticism"
        },
        {
          type: "Manager",
          name: "The Controller",
          role: "Maintains strict standards to prevent injustice"
        },
        {
          type: "Firefighter",
          name: "The Blamer",
          role: "Deflects criticism by pointing out others' flaws"
        },
        {
          type: "Exile",
          name: "The Unfairly Judged Child",
          role: "Carries the pain of being unfairly criticized and undervalued"
        }
      ],
      healingStrategies: [
        "Practice self-compassion and accept imperfection",
        "Let go of rigid standards and embrace flexibility",
        "Validate your own feelings and needs",
        "Release the need to be 'right' all the time",
        "Find peace with things being 'good enough'"
      ]
    },
    {
      id: "betrayal",
      name: "Betrayal Wound",
      icon: Shield,
      color: "bg-red-500",
      borderColor: "border-red-500",
      textColor: "text-red-600",
      lightBg: "bg-red-50 dark:bg-red-950/20",
      description: "The betrayal wound develops when a child's trust is broken, often through lies, broken promises, or manipulation.",
      coreBeliefs: [
        "I cannot trust anyone",
        "People will use and betray me",
        "I must always be on guard",
        "Vulnerability equals danger"
      ],
      anxietyManifestations: [
        {
          title: "Trust Anxiety",
          description: "Constant fear of being lied to, manipulated, or taken advantage of",
          examples: [
            "Difficulty trusting even close relationships",
            "Need to verify everything people say",
            "Suspicion of others' motives"
          ]
        },
        {
          title: "Hypervigilance Anxiety",
          description: "Always scanning for signs of deception or betrayal",
          examples: [
            "Overthinking conversations for hidden meanings",
            "Difficulty relaxing around others",
            "Physical tension from constant guardedness"
          ]
        },
        {
          title: "Vulnerability Anxiety",
          description: "Fear of opening up or showing your true self",
          examples: [
            "Keeping relationships superficial",
            "Difficulty expressing needs or emotions",
            "Fear of intimacy and emotional closeness"
          ]
        }
      ],
      parts: [
        {
          type: "Manager",
          name: "The Skeptic",
          role: "Questions everything to prevent betrayal"
        },
        {
          type: "Manager",
          name: "The Wall-Builder",
          role: "Keeps emotional distance to protect from betrayal"
        },
        {
          type: "Firefighter",
          name: "The Pre-emptive Betrayer",
          role: "Betrays others first to avoid being hurt"
        },
        {
          type: "Exile",
          name: "The Betrayed Child",
          role: "Carries the pain of broken trust and manipulation"
        }
      ],
      healingStrategies: [
        "Gradually practice trust in safe relationships",
        "Distinguish between past betrayal and present reality",
        "Allow yourself to be vulnerable in small steps",
        "Recognize that not everyone will betray you",
        "Heal the wounded Part that still carries the original betrayal"
      ]
    },
    {
      id: "neglect",
      name: "Neglect Wound",
      icon: Eye,
      color: "bg-blue-500",
      borderColor: "border-blue-500",
      textColor: "text-blue-600",
      lightBg: "bg-blue-50 dark:bg-blue-950/20",
      description: "The neglect wound forms when a child's needs are consistently unmet or ignored, creating a sense of invisibility.",
      coreBeliefs: [
        "My needs don't matter",
        "I am invisible and unimportant",
        "I must be completely self-sufficient",
        "Asking for help is weak"
      ],
      anxietyManifestations: [
        {
          title: "Self-Sufficiency Anxiety",
          description: "Fear of depending on others or asking for help",
          examples: [
            "Taking on too much alone",
            "Inability to delegate or accept support",
            "Burnout from over-functioning"
          ]
        },
        {
          title: "Visibility Anxiety",
          description: "Fear of being noticed or taking up space",
          examples: [
            "Difficulty speaking up in groups",
            "Minimizing your own needs",
            "Apologizing excessively for existing"
          ]
        },
        {
          title: "Worthiness Anxiety",
          description: "Constant worry that you don't deserve attention or care",
          examples: [
            "Guilt when receiving help or gifts",
            "Dismissing compliments or achievements",
            "Feeling like a burden to others"
          ]
        }
      ],
      parts: [
        {
          type: "Manager",
          name: "The Over-Functioner",
          role: "Ensures you never need anyone"
        },
        {
          type: "Manager",
          name: "The Minimizer",
          role: "Makes you and your needs small and invisible"
        },
        {
          type: "Firefighter",
          name: "The Self-Neglector",
          role: "Ignores your own needs to avoid the pain of not being cared for"
        },
        {
          type: "Exile",
          name: "The Invisible Child",
          role: "Carries the pain of being unseen and unimportant"
        }
      ],
      healingStrategies: [
        "Practice asking for help in small ways",
        "Validate your own needs as legitimate and important",
        "Allow yourself to be visible and take up space",
        "Recognize that needing others is human, not weak",
        "Build relationships where your needs are valued"
      ]
    }
  ];

  const currentWound = wounds.find(w => w.id === selectedWound) || wounds[0];
  const WoundIcon = currentWound.icon;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" asChild data-testid="button-back">
              <Link href="/ifs-anxiety">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-poppins text-foreground">
                Wound-to-Anxiety Explorer
              </h1>
              <p className="text-muted-foreground mt-1">
                Understand how childhood wounds create present-day anxiety patterns
              </p>
            </div>
          </div>
        </div>

        {/* Wound Selection Tabs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select a Childhood Wound</CardTitle>
            <CardDescription>
              Explore how each wound manifests as anxiety in your life today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {wounds.map(wound => {
                const Icon = wound.icon;
                return (
                  <Button
                    key={wound.id}
                    variant={selectedWound === wound.id ? "default" : "outline"}
                    className={`h-auto flex-col gap-2 p-4 ${
                      selectedWound === wound.id ? wound.color + " text-white" : ""
                    }`}
                    onClick={() => setSelectedWound(wound.id)}
                    data-testid={`button-wound-${wound.id}`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm text-center">
                      {wound.name.replace(" Wound", "")}
                    </span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Wound Details */}
        <div className="space-y-6">
          {/* Overview */}
          <Card className={`border-2 ${currentWound.borderColor}`}>
            <CardHeader className={currentWound.lightBg}>
              <div className="flex items-center gap-3">
                <div className={`${currentWound.color} text-white p-3 rounded-lg`}>
                  <WoundIcon className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl" data-testid="text-wound-name">
                    {currentWound.name}
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    {currentWound.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Core Beliefs */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${currentWound.textColor}`} />
                <CardTitle>Core Beliefs Formed</CardTitle>
              </div>
              <CardDescription>
                These unconscious beliefs drive anxiety-producing behaviors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentWound.coreBeliefs.map((belief, index) => (
                  <li key={index} className="flex items-start gap-2" data-testid={`text-belief-${index}`}>
                    <span className={`${currentWound.textColor} mt-1`}>•</span>
                    <span className="italic">"{belief}"</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Anxiety Manifestations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className={`w-5 h-5 ${currentWound.textColor}`} />
                <CardTitle>How This Wound Creates Anxiety</CardTitle>
              </div>
              <CardDescription>
                Specific ways this wound shows up as anxiety in daily life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentWound.anxietyManifestations.map((manifestation, index) => (
                  <div key={index}>
                    {index > 0 && <Separator className="mb-6" />}
                    <div>
                      <h4 className={`font-semibold text-lg mb-2 ${currentWound.textColor}`} data-testid={`text-manifestation-${index}`}>
                        {manifestation.title}
                      </h4>
                      <p className="text-muted-foreground mb-3">{manifestation.description}</p>
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Common Examples:</span>
                        <ul className="space-y-1 ml-4">
                          {manifestation.examples.map((example, exIdx) => (
                            <li key={exIdx} className="text-sm text-muted-foreground" data-testid={`text-example-${index}-${exIdx}`}>
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parts System */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className={`w-5 h-5 ${currentWound.textColor}`} />
                <CardTitle>Internal Parts Created by This Wound</CardTitle>
              </div>
              <CardDescription>
                These Parts developed to protect you from the original wound
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {currentWound.parts.map((part, index) => (
                  <Card key={index} className={currentWound.lightBg} data-testid={`card-part-${index}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{part.name}</CardTitle>
                        <Badge 
                          variant="secondary"
                          className={
                            part.type === "Manager" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                            part.type === "Firefighter" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" :
                            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          }
                        >
                          {part.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{part.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Healing Strategies */}
          <Card className={`border-2 ${currentWound.borderColor}`}>
            <CardHeader className={currentWound.lightBg}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${currentWound.textColor}`} />
                <CardTitle>Healing Strategies</CardTitle>
              </div>
              <CardDescription>
                IFS-informed approaches to heal this wound and reduce anxiety
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {currentWound.healingStrategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-3" data-testid={`text-strategy-${index}`}>
                    <CheckCircle className={`w-5 h-5 ${currentWound.textColor} mt-0.5 flex-shrink-0`} />
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className={currentWound.lightBg}>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-lg">
                  <strong>Ready to work with this wound?</strong>
                </p>
                <p className="text-muted-foreground">
                  Track your anxiety patterns on the Timeline and connect them back to this wound,
                  or explore your internal Parts in the Parts Mapping activity.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button asChild data-testid="button-timeline">
                    <Link href="/anxiety-timeline">Anxiety Timeline</Link>
                  </Button>
                  <Button variant="outline" asChild data-testid="button-parts">
                    <Link href="/anxiety-parts-mapping">Parts Mapping</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
