import { storage } from "./storage";

/**
 * Comprehensive IFS Course Content
 * Based on "The Self-Led Journey: A Guided Course on Healing Childhood Wounds with Internal Family Systems"
 * and "A Therapist's Guide to Internal Family Systems (IFS)"
 */

export async function seedComprehensiveIFS() {
  console.log("Seeding comprehensive IFS course content...");

  const lessonsData = [
    // ===== FOUNDATIONS TRACK =====
    {
      id: "course-intro",
      title: "Course Introduction: Welcome to Your Inner World",
      description: "Discover the transformative philosophy of Internal Family Systems and learn how all parts of you are welcome in this healing journey.",
      category: "introduction",
      track: "foundations",
      order: "1",
      safetyLevel: "gentle",
      traumaWarning: false,
      estimatedMinutes: "20",
      content: {
        introduction: "Welcome to this self-guided journey into your inner world. This course is built on the transformative and compassionate framework of Internal Family Systems (IFS), a powerful model of psychotherapy and personal growth.",
        sections: [
          {
            title: "All Parts Are Welcome",
            content: "The central goal of this course is to guide you in healing the childhood wounds—the deep-seated pain and beliefs—that so often continue to shape our adult lives, relationships, and sense of self. Our work together will be guided by one foundational philosophy: **All parts are welcome**.",
            keyPoints: [
              "The mind is naturally multiple, composed of many 'parts' or subpersonalities",
              "You already know this intuitively - you have a part that wants to be productive, and a part that just wants to rest",
              "There are no bad parts - every part has a positive intention",
              "Parts have been forced into extreme roles by painful life experiences"
            ]
          },
          {
            title: "A Different Approach",
            content: "This course is a departure from approaches that try to 'fix,' 'silence,' or 'get rid of' the parts of you that you do not like. Instead, we understand that every part, no matter how destructive its actions may seem, is trying to help you.",
            examples: [
              "Your inner critic is not trying to hurt you; it's trying to protect you from the greater pain of external judgment",
              "The part of you that numbs out with addiction is not trying to ruin your life; it's trying to protect you from unbearable emotional pain"
            ]
          },
          {
            title: "The Path to Healing",
            content: "Our goal is not to eliminate these parts. Our goal is to listen to them, understand their stories, and heal the underlying wounds they are working so hard to protect. This process, known as 'unburdening,' allows them to relax their extreme roles and return to a state of balance and harmony.",
            keyTerms: [
              { term: "Unburdening", definition: "The process of releasing old pain and extreme beliefs that parts have been carrying" },
              { term: "Self", definition: "Your wise, compassionate core that can lead the healing process" },
              { term: "Balance and Harmony", definition: "The natural state when parts are healed and trust the Self's leadership" }
            ]
          }
        ],
        safetyProtocols: {
          title: "Creating a Safe Container",
          guidelines: [
            "This is not a race - there is no prize for finishing quickly",
            "Your internal system will only open up at the pace at which it feels truly safe",
            "You may notice Manager parts wanting to do this 'perfectly' or Firefighter parts urging you to stop",
            "When you notice these parts, practice curiosity, not judgment"
          ],
          traumaAwareness: [
            "This course is powerful but not a replacement for psychotherapy",
            "If you have a history of severe trauma, this material can be activating",
            "A trigger activates the same feelings from a past trauma in the present moment",
            "If you feel overwhelmed, stop immediately and ground yourself"
          ],
          groundingSteps: [
            "Stop the exercise immediately",
            "Name 5 things you can see in the room",
            "Notice 4 things you can feel (feet on floor, texture of clothes)",
            "Listen for 3 things you can hear",
            "Place one hand on your heart and one on your stomach, breathe slowly",
            "Remind yourself: 'A part of me is activated. It is a memory. I am safe in this moment.'"
          ]
        },
        learningObjectives: [
          "Modules 1-5: Learn the complete 'map' of your inner world (Self, Managers, Firefighters, Exiles)",
          "Module 6: Master the 6 F's Protocol for connecting with protectors",
          "Modules 7-8: Learn to heal wounded Exiles through Witnessing and Unburdening",
          "Module 9: Integrate Self-leadership into daily life"
        ]
      }
    },

    {
      id: "module-01-foundations",
      title: "Module 1: The Foundations of Your Inner World",
      description: "Discover the revolutionary multiplicity paradigm: you are not broken, you are multiple. Learn the core assumptions of IFS and meet your internal family.",
      category: "introduction",
      track: "foundations",
      order: "2",
      safetyLevel: "gentle",
      traumaWarning: false,
      estimatedMinutes: "30",
      content: {
        introduction: "For most of our lives, we operate under a powerful, unexamined assumption: the 'mono-mind' theory. This is the belief that we each have one single, unified personality.",
        sections: [
          {
            title: "From Shame to Curiosity: The Paradigm Shift",
            content: "The mono-mind belief is the primary source of human shame. If you believe you have one mind, then inner conflict forces you to pathologize yourself. You decide, 'I am broken,' 'I am self-sabotaging,' 'There is something wrong with me.'",
            paradigmShift: {
              old: "I am broken (mono-mind theory)",
              new: "I am a complex system of valuable parts (multiplicity paradigm)",
              result: "Shift from shame to curiosity"
            }
          },
          {
            title: "The Five Core Assumptions of IFS",
            assumptions: [
              {
                number: 1,
                title: "The Mind is Subdivided",
                description: "It is the nature of the mind to be composed of an indeterminate number of subpersonalities, or 'parts.' These are not imaginary. They are internal entities with their own thoughts, feelings, memories, and intentions."
              },
              {
                number: 2,
                title: "Everyone Has a Self",
                description: "In addition to parts, everyone has at their core a 'Self.' This Self is the seat of consciousness, your true essence, which is inherently calm, curious, compassionate, and wise."
              },
              {
                number: 3,
                title: "Parts Have Positive Intentions",
                description: "There are no bad parts. Every part in your system, no matter how extreme or destructive its behavior, is doing its best to help you, based on its (often outdated) understanding of the world."
              },
              {
                number: 4,
                title: "Parts Get Forced into Extreme Roles",
                description: "Parts are not created by trauma; they are innate potentials that get forced from their valuable states into extreme roles by painful or overwhelming life experiences."
              },
              {
                number: 5,
                title: "The Goal is Harmony, Not Elimination",
                description: "The goal of IFS is not to eliminate parts. It is to achieve balance and harmony within the internal system by healing wounded parts and unburdening them of extreme beliefs and emotions."
              }
            ]
          },
          {
            title: "Your Inner Family: The Three Groups of Parts",
            description: "Your internal system is like a family, with different members playing different roles.",
            partsOverview: {
              exiles: {
                role: "The Wounded Inner Children",
                description: "Young, vulnerable parts that experienced trauma, pain, fear, shame, or neglect. They are 'stuck' in the past and carry extreme beliefs like 'I am worthless,' 'I am unsafe,' or 'I am unlovable.'",
                keyFeature: "When triggered, their intense pain floods into consciousness"
              },
              managers: {
                role: "The Proactive Protectors",
                description: "Parts that run your day-to-day life, trying to control your internal and external world to keep Exiles from ever being triggered.",
                strategies: [
                  "Perfectionism: 'If I am perfect, no one can criticize me'",
                  "Inner Criticism: 'I will criticize myself before anyone else can'",
                  "Caretaking/People-Pleasing: 'If I take care of everyone else, they will never leave me'",
                  "Controlling/Worrying: 'If I anticipate every threat, I can prevent pain'",
                  "Intellectualizing: 'If I stay in my head, I won't have to feel my heart'"
                ]
              },
              firefighters: {
                role: "The Reactive Protectors",
                description: "Parts that activate AFTER an Exile has been triggered. Their goal is to 'put out the fire' of overwhelming pain as quickly as possible, consequences be damned.",
                commonForms: [
                  "Addictions (substances, gambling)",
                  "Binge-eating or restrictive eating",
                  "Dissociation (numbing out, endless scrolling)",
                  "Self-harm",
                  "Sudden rages or angry outbursts"
                ]
              }
            }
          }
        ]
      }
    },

    {
      id: "module-02-managers",
      title: "Module 2: Understanding Your Managers",
      description: "Meet your proactive protectors who work tirelessly to keep you safe. Learn to recognize their strategies and appreciate their positive intentions.",
      category: "understanding_parts",
      track: "foundations",
      order: "3",
      safetyLevel: "gentle",
      traumaWarning: false,
      estimatedMinutes: "35",
      content: {
        introduction: "Managers are your proactive protectors. They believe that if they can just plan enough, control enough, or be perfect enough, the old pain won't be re-activated. Anxiety is the energy a Manager uses to do this job.",
        sections: [
          {
            title: "Common Manager Parts",
            managers: [
              {
                name: "The Planner/Controller",
                behavior: "Obsessively plans, makes lists, and worries about the future",
                belief: "If I can control everything, nothing bad will happen",
                protecting: "The pain of chaos and unpredictability"
              },
              {
                name: "The Inner Critic",
                behavior: "Uses shame and harsh judgment to keep you 'in line'",
                belief: "If I tell you you're stupid first, you'll work harder and no one else will get the chance to call you stupid",
                protecting: "The pain of external judgment and rejection"
              },
              {
                name: "The People-Pleaser",
                behavior: "Tries to manage the feelings of others to prevent rejection or conflict",
                belief: "If I make everyone happy, they won't leave me",
                protecting: "The pain of abandonment and rejection"
              },
              {
                name: "The Striver/Perfectionist",
                behavior: "Drives you to achieve and be perfect in all things",
                belief: "If I'm perfect, I can't be hurt or rejected",
                protecting: "The pain of failure and worthlessness"
              },
              {
                name: "The Intellectual",
                behavior: "Analyzes everything, stays in the head, avoids feelings",
                belief: "If I can understand it, I can control it. Feelings are dangerous.",
                protecting: "The pain of overwhelming emotions"
              },
              {
                name: "The Caretaker",
                behavior: "Focuses entirely on others' needs, neglects own needs",
                belief: "If I'm needed, I won't be abandoned",
                protecting: "The pain of being unwanted or invisible"
              }
            ]
          },
          {
            title: "How Managers Create Anxiety",
            content: "Managers believe that if they can just plan enough, control enough, or be perfect enough, the old pain won't be re-activated. Anxiety is the energy a Manager uses to do this job. It's a constant, scanning vigilance.",
            cycle: [
              "1. Exile holds deep wound ('I am unlovable')",
              "2. Manager takes extreme measures to prevent triggering the Exile",
              "3. This creates anxiety, perfectionism, control, criticism",
              "4. These strategies temporarily work but are exhausting",
              "5. Eventually they fail, and Exile gets triggered anyway",
              "6. Firefighters rush in to numb the pain",
              "7. Managers judge Firefighters and redouble their efforts"
            ]
          },
          {
            title: "The Positive Intention Behind Managers",
            content: "It's crucial to understand: Managers are not the enemy. They are valuable parts forced into exhausting roles. Every Manager is working incredibly hard to protect you from the pain of a wounded Exile.",
            reframe: "When you feel anxious, perfectionistic, or critical, instead of judging yourself, get curious: 'Which part of me is working so hard right now? What pain is it trying to protect me from?'"
          }
        ]
      }
    },

    {
      id: "module-03-firefighters",
      title: "Module 3: Understanding Your Firefighters",
      description: "Discover your reactive protectors who spring into action when pain breaks through. Learn why they use extreme methods and how to work with them compassionately.",
      category: "understanding_parts",
      track: "foundations",
      order: "4",
      safetyLevel: "moderate",
      traumaWarning: true,
      estimatedMinutes: "35",
      content: {
        introduction: "Firefighters are your reactive protectors. They share the same goal as Managers (to protect you from the pain of Exiles), but their methods are extreme and impulsive. They activate AFTER an Exile has already been triggered.",
        sections: [
          {
            title: "The Firefighter's Logic",
            content: "The pain is here! We must numb it or distract from it at all costs, right now. Firefighters are not concerned with future consequences. Their only concern is extinguishing the overwhelming pain in this moment.",
            urgency: "Firefighters experience Exile pain as a life-threatening emergency. From their perspective, they are saving your life."
          },
          {
            title: "Common Firefighter Parts",
            firefighters: [
              {
                name: "The Addict",
                methods: ["Substance use", "Gambling", "Shopping", "Work addiction"],
                purpose: "To numb unbearable emotional pain",
                afterEffect: "Shame and judgment from Managers"
              },
              {
                name: "The Binge Eater",
                methods: ["Compulsive eating", "Food as comfort"],
                purpose: "To fill inner emptiness or soothe pain",
                afterEffect: "Physical discomfort and self-criticism"
              },
              {
                name: "The Restrictor",
                methods: ["Food restriction", "Over-exercise"],
                purpose: "To feel control when emotions feel out of control",
                afterEffect: "Physical weakness and increased anxiety"
              },
              {
                name: "The Dissociator",
                methods: ["Numbing out", "Endless scrolling", "Zoning out", "Spacing out"],
                purpose: "To escape overwhelming feelings",
                afterEffect: "Lost time and disconnection from life"
              },
              {
                name: "The Rage",
                methods: ["Angry outbursts", "Picking fights", "Destructive anger"],
                purpose: "To discharge unbearable pain and feel powerful instead of helpless",
                afterEffect: "Damaged relationships and regret"
              },
              {
                name: "The Self-Harmer",
                methods: ["Cutting", "Hitting", "Other self-harm"],
                purpose: "To convert emotional pain into physical pain (which feels more controllable)",
                afterEffect: "Physical injury and increased shame"
              }
            ]
          },
          {
            title: "Why Firefighters Are So Extreme",
            content: "Firefighters use extreme methods because they are responding to what feels like a life-threatening emergency. When an Exile is triggered, its pain is overwhelming—it feels like the pain will destroy you. The Firefighter's job is to stop that pain at all costs.",
            compassionateView: "The Firefighter is not trying to ruin your life. It is trying to save your life, based on its understanding of the situation."
          },
          {
            title: "The Manager-Firefighter Conflict",
            content: "Managers and Firefighters are often polarized—locked in conflict with each other.",
            cycle: [
              "Managers work hard to keep everything under control",
              "Despite their efforts, an Exile gets triggered",
              "Firefighters spring into action with extreme methods",
              "Managers judge and criticize the Firefighters: 'How could you be so weak/reckless?'",
              "This judgment creates more shame, triggering more Exile pain",
              "Which requires more Firefighter activity",
              "And so the cycle continues"
            ],
            solution: "The way to break this cycle is not to side with one group against the other. It's to help both groups understand that they share the same goal: protecting you from Exile pain. The real solution is healing the Exile."
          }
        ]
      }
    },

    {
      id: "module-04-exiles",
      title: "Module 4: Understanding Your Exiles - The Wounded Inner Children",
      description: "Meet your most vulnerable parts - the young, wounded Exiles who hold your deepest pain. Learn about the five core childhood wounds and how they shape your life.",
      category: "understanding_parts",
      track: "deepening",
      order: "5",
      safetyLevel: "intensive",
      traumaWarning: true,
      estimatedMinutes: "45",
      content: {
        introduction: "Exiles are the young, vulnerable, wounded parts of your system. They are the 'inner children' who experienced trauma, pain, fear, shame, or neglect. They were 'exiled'—isolated and locked away—by your protective parts to keep you from being overwhelmed by their pain.",
        sections: [
          {
            title: "The Nature of Exiles",
            characteristics: [
              "They are typically young—often feeling like children or teenagers",
              "They are 'stuck' in time, in the moment of their wounding",
              "They carry 'burdens'—extreme beliefs and overwhelming emotions",
              "When triggered, their pain floods into your present-moment awareness",
              "Your system treats this flooding as a life-threatening emergency"
            ],
            keyInsight: "Exiles are not memories or thoughts. They are parts of you that were frozen in time at the moment of a wounding experience. They still feel the pain as if it is happening now."
          },
          {
            title: "The Five Core Childhood Wounds",
            wounds: [
              {
                type: "Rejection",
                experience: "Being pushed away, criticized, or made to feel unwanted for being authentic. Receiving the message: 'Who you are is not acceptable.'",
                examples: [
                  "Being told 'Stop crying' or 'Don't be so sensitive'",
                  "Being mocked for interests or personality traits",
                  "Having authentic expression shut down or ridiculed"
                ],
                exileBeliefs: ["I am unlovable", "Something is wrong with me", "I am too much", "I must hide who I really am"],
                typicalProtectors: [
                  "Manager: People-Pleaser (to avoid rejection)",
                  "Manager: Perfectionist (to be 'acceptable')",
                  "Firefighter: Rage (to push others away before they can reject)"
                ]
              },
              {
                type: "Abandonment",
                experience: "Physical or emotional abandonment. A caregiver leaving, being emotionally unavailable, depressed, or 'checked out.'",
                examples: [
                  "Parent leaving through death, divorce, or deployment",
                  "Emotionally absent or depressed parent",
                  "Being left alone when too young to cope",
                  "Feeling invisible or forgotten"
                ],
                exileBeliefs: ["I am all alone", "No one will be there for me", "I can't trust anyone", "I am not worth staying for"],
                typicalProtectors: [
                  "Manager: Anxious Attachment (to keep people close)",
                  "Manager: Hyper-independence ('I don't need anyone')",
                  "Firefighter: Dissociation (to numb the terror of aloneness)"
                ]
              },
              {
                type: "Injustice",
                experience: "Witnessing or experiencing unfairness, broken promises, or having boundaries violated without recourse.",
                examples: [
                  "Favoritism toward a sibling",
                  "Promises broken repeatedly",
                  "Being punished unfairly",
                  "Witnessing domestic violence or injustice",
                  "Abuse without protection"
                ],
                exileBeliefs: ["The world is not safe", "I am powerless", "No one will protect me", "Fairness doesn't exist"],
                typicalProtectors: [
                  "Manager: Controlling (to ensure fairness and safety)",
                  "Manager: Hyper-vigilant (constantly scanning for threat)",
                  "Firefighter: Addiction (to escape feeling powerless)"
                ]
              },
              {
                type: "Betrayal",
                experience: "Trust being broken by a key person. A secret being told, a promise broken, infidelity, deception.",
                examples: [
                  "A trusted adult lying or breaking confidence",
                  "Being blindsided by divorce or family secret",
                  "Friend or partner betraying trust",
                  "Authority figure abusing power"
                ],
                exileBeliefs: ["I can't trust anyone", "I will be hurt if I open up", "People will always let me down", "I must protect myself"],
                typicalProtectors: [
                  "Manager: Suspicious/Distrustful (vets everyone)",
                  "Manager: Walls up (never fully vulnerable)",
                  "Firefighter: Isolation (numbs pain by avoiding connection)"
                ]
              },
              {
                type: "Neglect",
                experience: "A chronic lack of emotional or physical attunement. Not being seen, heard, or valued. Needs consistently unmet.",
                examples: [
                  "Emotionally unavailable parents",
                  "Being the 'forgotten' or 'invisible' child",
                  "Needs dismissed or minimized",
                  "Growing up too fast (parentification)"
                ],
                exileBeliefs: ["I am invisible", "My needs don't matter", "I am worthless", "I must earn love through achievement or caretaking"],
                typicalProtectors: [
                  "Manager: Inner Critic (to 'be better' and finally be seen)",
                  "Manager: Caretaker (to be needed and therefore valued)",
                  "Firefighter: Binge-eating (to fill the inner emptiness)"
                ]
              }
            ]
          },
          {
            title: "How Wounds Create Exiles",
            process: [
              "1. A child experiences an overwhelming event",
              "2. The child lacks a caring adult to help process the emotion (co-regulate)",
              "3. The child is left alone with unbearable feelings and forms extreme beliefs",
              "4. To survive, the system 'exiles' this part—locks it away",
              "5. Managers develop strategies to ensure this part is never triggered",
              "6. Firefighters stand ready to extinguish the pain if it breaks through",
              "7. The Exile remains frozen in time, still holding the original pain and belief"
            ],
            criticalInsight: "The Exile doesn't know that you grew up. It still believes you are that small child in that moment of pain. This is why, when triggered, you can feel small, helpless, and overwhelmed—because a young part of you is re-experiencing that original moment."
          }
        ]
      }
    },

    {
      id: "module-05-self",
      title: "Module 5: The Self - Your Inner Healer",
      description: "Discover the 8 C's of Self-energy and learn to access your innate capacity for healing and leadership.",
      category: "self_leadership",
      track: "foundations",
      order: "6",
      safetyLevel: "gentle",
      traumaWarning: false,
      estimatedMinutes: "30",
      content: {
        introduction: "At the core of every person is the Self. The Self is not a part—it is your essential nature. It cannot be damaged, only obscured by your parts. When you are 'in Self,' you naturally embody qualities that promote healing.",
        sections: [
          {
            title: "What is the Self?",
            content: "The Self is the 'seat of consciousness'—the calm, compassionate, curious observer within you. In IFS, we believe everyone has a Self, and it is inherently whole and undamaged.",
            keyPoints: [
              "The Self is not a part that can be wounded or damaged",
              "It is always present, even when obscured by protective parts",
              "When parts relax and step back, the Self naturally emerges",
              "The Self is the agent of healing—it provides what Exiles needed but never received"
            ]
          },
          {
            title: "The 8 C's of Self-Energy",
            description: "When you are 'in Self,' you naturally experience these eight qualities:",
            qualities: [
              {
                name: "Curiosity",
                description: "A genuine interest in your parts without judgment. You wonder, 'Why does this part do what it does?' instead of, 'This part is bad.'",
                inPractice: "Asking parts questions instead of fighting them"
              },
              {
                name: "Compassion",
                description: "A caring, open-heartedness toward your parts' pain and efforts. You feel for them, not against them.",
                inPractice: "Acknowledging how hard parts have been working"
              },
              {
                name: "Calm",
                description: "A sense of peace and centeredness, even in the presence of activated parts. You are the still point in the storm.",
                inPractice: "Remaining grounded when parts are distressed"
              },
              {
                name: "Clarity",
                description: "The ability to see the situation without distortion. Parts create fog; Self sees clearly.",
                inPractice: "Understanding the true dynamics without blame"
              },
              {
                name: "Confidence",
                description: "Trust in your ability to handle what comes up. Not arrogance, but a quiet assurance.",
                inPractice: "Believing 'I can be with this part's pain'"
              },
              {
                name: "Courage",
                description: "The willingness to be with pain in order to heal it. Not the absence of fear, but the willingness to proceed despite it.",
                inPractice: "Staying present with an Exile's painful story"
              },
              {
                name: "Creativity",
                description: "The ability to find new solutions and approaches. Parts are stuck in old patterns; Self brings fresh perspectives.",
                inPractice: "Finding new ways to meet needs instead of old coping strategies"
              },
              {
                name: "Connectedness",
                description: "A feeling of connection to your parts, to yourself, and to something larger. The opposite of isolation.",
                inPractice: "Feeling 'I am here with you' to a wounded part"
              }
            ]
          },
          {
            title: "How to Know If You're in Self",
            content: "The key question in IFS therapy is: 'How do you feel toward this part?' Your answer reveals whether you are in Self or in another part.",
            examples: [
              {
                response: "'I'm curious about it' or 'I feel for it'",
                meaning: "You are in Self. Proceed with the work."
              },
              {
                response: "'I hate it' or 'It's stupid' or 'I need it to go away'",
                meaning: "You are not in Self. You are in another part (likely a Manager). Ask this judging part to step back before proceeding."
              }
            ],
            protocol: "If you're not in Self, don't try to force it. Simply ask the part that's blocking Self (the judging part) if it would be willing to relax and step back, just for a few minutes, so you can get to know the other part with curiosity."
          },
          {
            title: "Self as the Reparenting Agent",
            content: "In IFS, healing happens when your Self provides the Exile with what it needed but never received as a child: presence, validation, and unconditional love.",
            reparenting: {
              whatExilesNeeded: [
                "To be seen and heard",
                "To have their feelings validated",
                "To be told 'It's not your fault'",
                "To be protected and comforted",
                "To be loved unconditionally"
              ],
              whatSelfProvides: [
                "Witnessing: 'I see what happened to you'",
                "Validation: 'Of course you felt that way'",
                "Retrieval: 'You don't have to stay in that memory anymore. Come with me.'",
                "Unburdening: 'You can release that shame/fear now. It was never yours to carry.'",
                "Integration: 'You are safe now. I will always be here for you.'"
              ]
            },
            criticalInsight: "Exiles don't need a therapist to heal. They need YOU—your Self. The therapist's role is to help you access your Self so you can do the reparenting."
          }
        ]
      }
    },

    {
      id: "module-06-six-fs",
      title: "Module 6: The 6 F's Protocol - Befriending Your Protectors",
      description: "Master the step-by-step protocol for safely connecting with your protective parts and gaining their trust to access wounded Exiles.",
      category: "protocols",
      track: "deepening",
      order: "7",
      safetyLevel: "moderate",
      traumaWarning: false,
      estimatedMinutes: "40",
      content: {
        introduction: "The 6 F's Protocol is the cornerstone of IFS work. It is the safe, systematic way to connect with a protective part (Manager or Firefighter), understand its role, gain its trust, and eventually get permission to heal the Exile it protects.",
        sections: [
          {
            title: "Why Befriend Protectors First?",
            content: "In IFS, we never go directly to the wounded Exile. Why? Because your protectors will stop you. They have spent years (often decades) keeping that Exile locked away to protect you from its overwhelming pain. If you try to bypass them, they will sabotage your efforts.",
            safetyPrinciple: "We must first befriend the protectors, understand their concerns, and gain their permission before we can safely access and heal the Exiles they guard."
          },
          {
            title: "The 6 F's: Step-by-Step",
            protocol: {
              step1: {
                name: "Find",
                instruction: "Locate the part in your body or mind.",
                process: [
                  "Start with a feeling, thought, or behavior you want to explore (e.g., anxiety, inner criticism, urge to numb out)",
                  "Ask yourself: 'Where do I feel this in my body?'",
                  "Focus your attention on that sensation"
                ],
                example: "I notice anxiety in my chest—a tight, buzzing feeling."
              },
              step2: {
                name: "Focus",
                instruction: "Give the part your full, curious attention.",
                process: [
                  "Turn all of your awareness toward this sensation or part",
                  "Approach it with gentle curiosity, like you're meeting someone new",
                  "Notice: Does it have a shape, color, image, or age?"
                ],
                example: "As I focus on the tightness in my chest, I see an image of a small, frantic person running in circles."
              },
              step3: {
                name: "Flesh Out",
                instruction: "Get to know the part's characteristics.",
                process: [
                  "Ask: 'If this part had a voice, what would it be saying?'",
                  "Ask: 'How old does this part feel?'",
                  "Ask: 'What emotions does this part carry?'"
                ],
                example: "It's saying, 'We have to stay ahead of everything! We can't let anything slip!' It feels like it's been doing this job for 20+ years. It carries anxiety and exhaustion."
              },
              step4: {
                name: "Feel Toward",
                instruction: "Check: Are you in Self? How do you feel toward this part?",
                process: [
                  "This is the critical checkpoint: Ask yourself, 'How do I feel toward this part right now?'",
                  "If you feel curious, compassionate, or caring → You are in Self. Proceed.",
                  "If you feel annoyed, judgmental, or want it gone → You are in another part. Ask that judging part to step back."
                ],
                example: "'I feel frustrated with it.' → Not in Self. 'I ask the frustrated part to step back.' Now: 'I feel kind of sad for it. It seems so tired.' → In Self. Proceed."
              },
              step5: {
                name: "beFriend",
                instruction: "Build trust with the protector by understanding its role.",
                questions: [
                  "What is your job? What are you trying to accomplish for me?",
                  "What are you afraid would happen if you stopped doing this job?",
                  "How long have you been doing this job?",
                  "Is this a job you like doing, or would you rather be doing something else?"
                ],
                keyInsight: "This step reveals the Exile the protector is guarding. When it says, 'I'm afraid if I stop, you'll feel that terrible feeling of being worthless/alone/unsafe,' it's showing you the Exile's burden.",
                example: "The anxious part says: 'My job is to keep you ahead of everything so you're never blindsided. I'm afraid if I stop, you'll be caught off-guard and criticized, and then you'll feel that unbearable shame from childhood.' → The Exile: a part holding shame from criticism."
              },
              step6: {
                name: "Fear (What Does It Fear?)",
                instruction: "Ask the protector for permission to help the Exile it's protecting.",
                process: [
                  "Acknowledge the protector: 'Thank you for working so hard to protect me from that pain.'",
                  "Ask: 'Would you be willing to let me (your Self) go to that part you're protecting, just to see what it's holding? I only want to help. I won't let anything bad happen.'",
                  "If yes → The protector steps aside, giving you access to the Exile.",
                  "If no → Ask: 'What would you need from me to feel safe enough to let me do this?' Honor its answer."
                ],
                safetyNote: "Never force your way past a protector. If it says no, respect that. Its fear is valid. You may need to build more trust first."
              }
            }
          },
          {
            title: "What Happens After the 6 F's?",
            content: "Once the protector gives permission, you can turn your attention to the Exile it was guarding. This is when the deep healing work begins (Modules 7-8).",
            nextSteps: [
              "The protector 'steps aside'",
              "You (as Self) turn your attention inward to find the Exile",
              "You ask the Exile: 'What happened to you? Show me.'",
              "The healing process (Witnessing, Unburdening) begins"
            ]
          }
        ]
      }
    },

    {
      id: "module-07-witnessing",
      title: "Module 7: Witnessing and Validating Your Exiles",
      description: "Learn the sacred process of bearing witness to your wounded parts' stories and providing the validation they never received.",
      category: "healing",
      track: "deepening",
      order: "8",
      safetyLevel: "intensive",
      traumaWarning: true,
      estimatedMinutes: "45",
      content: {
        introduction: "Once a protector gives you permission to access an Exile, the healing begins. The first and most crucial step is Witnessing—allowing the Exile to show you its story and validating its experience.",
        sections: [
          {
            title: "The Power of Being Witnessed",
            content: "Exiles were created in moments when a child experienced overwhelming emotion without the presence of a caring adult to help process it. The child was left alone with unbearable feelings. Witnessing reverses this.",
            healing: {
              whatWasWrong: "The child was alone with overwhelming pain",
              whatHeals: "The adult Self is now present, bearing witness with compassion"
            },
            quote: "The opposite of trauma is not 'it didn't happen.' The opposite of trauma is 'I am here with you.'"
          },
          {
            title: "Step 1: Finding the Exile",
            content: "After the protector steps aside, turn your attention inward to locate the Exile.",
            process: [
              "Close your eyes and go inside",
              "Ask: 'Where is the part the protector was guarding?'",
              "Notice where you feel drawn—often to a place in your body or to an image of a younger you",
              "You may see a memory, a child, or simply feel a strong emotion"
            ],
            example: "I feel drawn to my stomach, where there's a heavy, aching feeling. I see an image of myself as a 7-year-old, sitting alone on the stairs, crying."
          },
          {
            title: "Step 2: Witnessing - 'What Happened to You?'",
            content: "Once you've found the Exile, the first question is always: 'What happened to you? Show me.'",
            witnessing: {
              yourRole: "You are not there to fix, rescue, or change the past. You are there to see and to be present.",
              exilesResponse: "The Exile will show you (through memory, image, or feeling) the original wounding event. It may be a specific moment or a general atmosphere of neglect/rejection.",
              yourResponse: "Stay present. Breathe. Let yourself see and feel what this young part experienced. You are not re-traumatizing yourself; you are finally giving this part the witness it never had."
            },
            examples: [
              "The 7-year-old shows me: Dad yelling, calling me stupid for spilling milk. Mom said nothing. I felt so small, so ashamed.",
              "The 12-year-old shows me: The constant feeling of being invisible. No one ever asked how I was. I learned my feelings didn't matter."
            ]
          },
          {
            title: "Step 3: Validating - 'Of Course You Felt That Way'",
            content: "After witnessing, the Exile needs to hear that its feelings make sense. This is validation.",
            validation: {
              whatToSay: [
                "'Of course you felt that way. That makes so much sense.'",
                "'That was too much for a little one to handle alone.'",
                "'You are not bad for feeling scared/ashamed/angry. The situation was bad.'",
                "'It wasn't your fault. You didn't deserve that.'"
              ],
              whatNotToSay: [
                "Don't minimize: 'It wasn't that bad' or 'Others had it worse'",
                "Don't rush: 'But you're okay now'",
                "Don't fix: 'Here's what you should have done'"
              ],
              why: "Validation tells the Exile: 'Your feelings are real, valid, and make sense.' This is often the first time the Exile has ever heard this."
            }
          },
          {
            title: "The Healing Effect of Witnessing",
            content: "Simply being witnessed and validated by your Self begins the healing process. The Exile is no longer alone with its pain.",
            transformation: [
              "Before: 'I am alone with unbearable pain that no one sees or cares about.'",
              "After: 'My adult Self sees what happened. My pain is real and valid. I am not alone anymore.'"
            ],
            criticalPoint: "This is not 'just talking about the past.' This is your Self providing the co-regulation and attunement the child needed but never got. It is reparenting in real-time."
          },
          {
            title: "Pacing and Safety",
            safetyGuidelines: [
              "Go at the Exile's pace. If it's not ready to show you the full story, don't push.",
              "If you (or the Exile) become overwhelmed, stop. Ground yourself. Come back when it feels safer.",
              "The protector that stepped aside is still watching. If it feels unsafe, it will shut things down. That's okay—it's doing its job.",
              "You can do this work in small doses. You don't have to heal everything in one session."
            ],
            reminder: "Healing is not a race. Your system will only open up as fast as it feels safe to do so."
          }
        ]
      }
    },

    {
      id: "module-08-unburdening",
      title: "Module 8: Unburdening and Reparenting",
      description: "Learn the complete reparenting protocol: Retrieve, Unburden, and Invite your Exiles into a new way of being.",
      category: "healing",
      track: "deepening",
      order: "9",
      safetyLevel: "intensive",
      traumaWarning: true,
      estimatedMinutes: "50",
      content: {
        introduction: "After Witnessing and Validating an Exile, the final healing steps are to Retrieve it from the past, help it Unburden the extreme beliefs and emotions it has carried, and Invite it into a new, healed state.",
        sections: [
          {
            title: "Understanding Burdens",
            content: "Burdens are the extreme beliefs and overwhelming emotions that Exiles carry. They are not the Exile's true nature—they are what the Exile took on in the moment of wounding.",
            commonBurdens: {
              beliefs: [
                "I am worthless",
                "I am unlovable",
                "I am unsafe",
                "I am alone",
                "I am bad/broken/wrong",
                "My needs don't matter"
              ],
              emotions: [
                "Shame",
                "Terror",
                "Grief",
                "Rage",
                "Loneliness"
              ]
            },
            keyInsight: "These burdens are like weights the Exile has been carrying for years or decades. They were a logical response to an overwhelming situation, but they are no longer needed. The Exile can release them."
          },
          {
            title: "Step 4: Retrieve - Rescuing the Exile from the Past",
            content: "Exiles are often still 'stuck' in the original wounding scene, as if they are still living in that moment. Retrieval is the process of bringing the Exile out of the past into the present with your Self.",
            process: [
              "Ask the Exile: 'Are you still in that scene (the memory I just witnessed)?'",
              "If yes: 'Go into that scene as your adult Self. Tell the young part, \"I am here for you now. You don't have to stay here anymore.\"'",
              "Ask the Exile: 'Would you like to come with me?'",
              "Wait for the Exile's response. If yes, visualize taking it by the hand and bringing it out of that memory into a safe place (your heart, a beautiful field, a cozy room—wherever feels right)."
            ],
            example: "I go back into the memory of 7-year-old me sitting on the stairs. I kneel down and say, 'I'm here now. You're not alone anymore. You don't have to stay on these stairs. Will you come with me?' The little one nods and takes my hand. I visualize bringing her into my heart, where it's warm and safe.",
            effect: "The Exile is no longer frozen in the past. It is now in the present, with you."
          },
          {
            title: "Step 5: Unburden - Releasing the Pain",
            content: "Now that the Exile is retrieved and safe, it can release the burdens it has been carrying.",
            unburdeningProcess: [
              {
                step: "Identify the Burden",
                instruction: "Ask the Exile: 'What feelings or beliefs have you been carrying all this time?' (e.g., shame, fear, 'I am worthless')"
              },
              {
                step: "Ask Permission",
                instruction: "Ask: 'Are you ready to release this [shame/fear/belief]? It was never yours to carry.'"
              },
              {
                step: "Choose a Method",
                instruction: "Ask the Exile: 'How would you like to release it?' The Exile will often have an intuitive sense.",
                methods: [
                  "Giving it to the light or to a higher power",
                  "Washing it away in water (ocean, river, rain)",
                  "Burying it in the earth",
                  "Burning it in a fire",
                  "Breathing it out"
                ]
              },
              {
                step: "Visualize the Release",
                instruction: "Close your eyes and visualize the burden leaving the Exile's body in the way it chose. See it dissolve, wash away, burn up, or be absorbed. Take your time. Let the Exile feel the lightness of release."
              },
              {
                step: "Confirm",
                instruction: "Ask: 'Is it gone? How do you feel now?'"
              }
            ],
            example: "I ask the 7-year-old: 'What have you been carrying?' She says, 'Shame. The belief that I'm stupid and bad.' I ask, 'Are you ready to let that go?' She nods. 'How would you like to release it?' She imagines a golden light coming down and lifting the shame out of her chest, dissolving it. I watch it happen. I ask, 'Is it gone?' She says, 'Yes. I feel lighter.'"
          },
          {
            title: "Step 6: Invite - Bringing in Positive Qualities",
            content: "Nature abhors a vacuum. After the Exile releases its burdens, it's important to invite in positive qualities to fill that space.",
            invitation: [
              "Ask the Exile: 'Now that you've released [the burden], what positive qualities would you like to take in?' or 'What do you need?'",
              "Common responses: lightness, safety, love, playfulness, peace, worthiness, belonging",
              "Ask: 'Where would you like these qualities to come from?' (e.g., from the Self, from nature, from a spiritual source)",
              "Visualize these qualities flowing into the Exile. See them fill the space where the burden used to be."
            ],
            example: "I ask the little one, 'What would you like to feel now?' She says, 'I want to feel safe and loved.' I put my hand on her heart and imagine warm, golden light flowing from my Self into her, filling her with safety and love. She smiles."
          },
          {
            title: "Step 7: Integration - Creating a New Home",
            content: "The final step is to ask the Exile where it would like to live now that it's unburdened.",
            integration: [
              "Ask: 'Where would you like to be now?' (e.g., in my heart, in a safe inner sanctuary, in a beautiful place in nature)",
              "Visualize the Exile in its new home. Make sure it feels safe, comfortable, and cared for.",
              "Ask: 'Is there anything else you need from me?'",
              "Establish a relationship: 'I will check in with you. You are not alone anymore. I am here.'"
            ],
            ongoingCare: "Unburdening is not a one-time event. Continue to check in with this Exile. Let it know it is seen, valued, and protected by your Self."
          },
          {
            title: "What Happens to Protectors After Unburdening?",
            content: "Once an Exile is unburdened, the protectors that were guarding it can finally relax.",
            protectorTransformation: [
              "Check back in with the protector (e.g., the anxious Manager): 'How do you feel now that the part you were protecting has been healed?'",
              "The protector will almost always feel relieved, lighter, even grateful.",
              "Ask: 'What would you like to do now?' The protector may choose a new, healthier role (e.g., the Inner Critic becomes a wise advisor; the Planner becomes helpful intuition)."
            ],
            result: "The entire system begins to relax and harmonize. This is the goal of IFS: not to eliminate parts, but to heal them so they can return to their valuable, natural roles, led by the Self."
          }
        ]
      }
    },

    {
      id: "module-09-integration",
      title: "Module 9: Integration and Daily Self-Leadership",
      description: "Bring IFS into your daily life. Learn to lead your system with Self-energy, maintain healing, and respond to life's challenges from a grounded, compassionate center.",
      category: "integration",
      track: "deepening",
      order: "10",
      safetyLevel: "gentle",
      traumaWarning: false,
      estimatedMinutes: "35",
      content: {
        introduction: "IFS is not just a healing modality—it's a new way of living. This final module is about integrating what you've learned into your daily life, practicing Self-leadership, and maintaining the healing you've achieved.",
        sections: [
          {
            title: "What is Self-Leadership?",
            content: "Self-leadership is the practice of letting your Self lead your internal system in daily life. Instead of being hijacked by reactive parts, you pause, notice which parts are activated, and respond from Self-energy.",
            beforeAfter: {
              before: "Part takes over → You react → You regret it later → Shame spiral",
              after: "Part activates → You notice → You get curious → You respond from Self → Harmony"
            }
          },
          {
            title: "The Daily Practice of Self-Leadership",
            practices: [
              {
                name: "Morning Check-In",
                description: "Start your day by checking in with your parts.",
                practice: [
                  "Close your eyes. Take a few breaths.",
                  "Ask: 'How is my system this morning? Are any parts activated or concerned?'",
                  "Listen. If a part speaks up (e.g., anxiety about the day), acknowledge it: 'I hear you. Thank you for trying to help. I've got this.'",
                  "Ask your Self: 'What do I (Self) want to prioritize today?'"
                ],
                benefit: "This sets the tone for Self-led decision-making instead of reactive, part-driven behavior."
              },
              {
                name: "Noticing in Real-Time",
                description: "Throughout the day, practice noticing when a part takes over.",
                signals: [
                  "Sudden strong emotion (anger, anxiety, shame)",
                  "Familiar behavior patterns (people-pleasing, numbing, controlling)",
                  "Feeling 'hijacked' or 'not like myself'"
                ],
                practice: [
                  "Pause. Take a breath.",
                  "Name it: 'A part of me is activated right now.'",
                  "Get curious: 'Which part? What is it afraid of?'",
                  "Respond from Self: 'I hear you. I've got this. Let me handle it.'"
                ],
                example: "You're about to send an angry email. You pause. 'A part of me is furious right now. It's a Firefighter trying to discharge pain. What pain?' You realize your inner child felt dismissed in the meeting. From Self, you acknowledge the pain ('I see you felt unseen') and choose a more effective response than the angry email."
              },
              {
                name: "Evening Reflection",
                description: "End your day with gratitude and reflection.",
                practice: [
                  "Reflect: 'When did I notice parts today? How did I respond?'",
                  "Celebrate: 'When did I respond from Self instead of reacting from a part?'",
                  "Repair: 'If I reacted from a part, can I go back and check in with it now?'",
                  "Gratitude: 'Thank you to my parts for working so hard to protect me today.'"
                ]
              }
            ]
          },
          {
            title: "Responding to Triggering Events",
            content: "Life will continue to trigger your Exiles. Self-leadership doesn't mean you never get triggered; it means you know what to do when it happens.",
            protocol: [
              {
                step: "1. Notice the Activation",
                instruction: "You feel suddenly overwhelmed, small, or reactive. A part (or multiple parts) has been triggered."
              },
              {
                step: "2. Pause and Ground",
                instruction: "Stop. Breathe. Use your grounding technique (5-4-3-2-1 senses, hand on heart). Remind yourself: 'This is a part. This is a memory. I am safe now.'"
              },
              {
                step: "3. Get Curious",
                instruction: "Ask: 'Which part is activated? Protector or Exile?' If it's a protector (anxiety, anger, numbing urge), ask: 'What are you protecting me from?' If it's an Exile (feeling small, ashamed, terrified), recognize: 'An old wound has been touched.'"
              },
              {
                step: "4. Offer Presence",
                instruction: "From your Self, speak to the activated part: 'I see you. I'm here. You're not alone.' To a protector: 'Thank you for trying to help. I've got this.' To an Exile: 'I know this feeling is from the past. I'm here with you now.'"
              },
              {
                step: "5. Respond (Don't React)",
                instruction: "Once you've acknowledged the part, ask your Self: 'What's the wise, grounded response here?' Then act from Self, not from the triggered part."
              }
            ]
          },
          {
            title: "Maintaining Your Healing",
            content: "Unburdening an Exile is profound, but it's not a one-time fix. Exiles need ongoing relationship with your Self.",
            ongoingCare: [
              "Check in regularly: 'Hey, little one. How are you doing? Do you need anything from me?'",
              "When the Exile gets re-triggered (it will, in small ways), remind it: 'That was then. This is now. I'm here. You're safe.'",
              "Celebrate growth: Notice when old triggers don't land the same way. This is evidence of healing.",
              "Be patient: Some Exiles need multiple sessions of unburdening. Some burdens come off in layers."
            ]
          },
          {
            title: "Living from Self-Energy",
            content: "As you practice Self-leadership, you'll notice shifts in how you move through the world.",
            transformations: [
              "Less reactivity: You pause before responding instead of being hijacked by parts.",
              "More compassion: You feel compassion for yourself and others, understanding that everyone has parts.",
              "Clearer boundaries: Your Self knows what is okay and not okay, without the extremes of your parts (people-pleasing or aggression).",
              "Inner calm: Even when parts are activated, there's a sense of 'I can handle this' from your Self.",
              "Creativity and joy: As protectors relax, you have more access to spontaneity, play, and authentic expression."
            ]
          },
          {
            title: "The Ongoing Journey",
            content: "IFS is not a destination; it's a practice. Your parts will continue to need attention and care. New layers of wounding may emerge. That's not failure—that's the system trusting you enough to show you more.",
            finalWords: [
              "Be patient with yourself and your parts.",
              "Celebrate small moments of Self-leadership.",
              "Remember: All parts are welcome. There are no bad parts.",
              "Your Self is always here, always whole, always capable of leading with compassion.",
              "You are not broken. You are a beautiful, complex system learning to live in harmony."
            ]
          }
        ]
      }
    }
  ];

  // Insert lessons
  for (const lessonData of lessonsData) {
    await storage.createLesson(lessonData);
  }

  console.log(`✓ Seeded ${lessonsData.length} comprehensive IFS lessons`);
  
  // Now add activities for each lesson
  await seedActivitiesForLessons();
  
  console.log("✓ Comprehensive IFS course seeding complete!");
}

async function seedActivitiesForLessons() {
  const activities = [
    // Activities for Course Introduction
    {
      lessonId: "course-intro",
      title: "Notice Your Parts",
      description: "Begin to observe the different parts of yourself in daily life.",
      type: "reflection",
      order: "1",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        prompt: "Take a moment to reflect on your day. Can you identify different 'parts' that showed up?",
        questions: [
          "Did you notice a part of you that wanted to be productive? What did it say?",
          "Did you notice a part that wanted to rest or avoid? What did it say?",
          "Did you notice any conflict between parts? (e.g., 'I should exercise' vs. 'I just want to relax')",
          "Without judging yourself, just notice: How many different 'voices' or impulses did you experience today?"
        ],
        instruction: "Remember: All parts are welcome. The goal is curiosity, not judgment."
      }
    },
    {
      lessonId: "course-intro",
      title: "Grounding Exercise: Return to Safety",
      description: "Learn the essential grounding technique for when you feel overwhelmed.",
      type: "grounding",
      order: "2",
      isProtocol: true,
      requiresSafetyCheck: false,
      content: {
        purpose: "This is your emergency brake. Use this any time you feel overwhelmed, flooded, or dissociated during the course.",
        steps: [
          {
            number: 1,
            instruction: "Stop the exercise immediately. You can always come back to it later.",
            duration: "Immediate"
          },
          {
            number: 2,
            instruction: "Ground yourself in the present moment using your senses:",
            substeps: [
              "Name 5 things you can see in the room",
              "Notice 4 things you can feel (your feet on the floor, the texture of your clothes)",
              "Listen for 3 things you can hear"
            ]
          },
          {
            number: 3,
            instruction: "Use somatic grounding: Place one hand on your heart and one on your stomach. Breathe slowly, feeling the warmth of your hands.",
            duration: "2-3 minutes"
          },
          {
            number: 4,
            instruction: "Remind yourself out loud: 'A part of me is activated. It is a memory. I am safe in this moment.'",
            duration: "Repeat as needed"
          },
          {
            number: 5,
            instruction: "Do not resume the exercise until you feel calm and present. It's okay to take a break for hours or days.",
            duration: "As long as needed"
          }
        ],
        reminder: "Using this technique is not a failure. It's your protectors doing their job. Honor them."
      }
    },

    // Activities for Module 1: Foundations
    {
      lessonId: "module-01-foundations",
      title: "From Mono-Mind to Multiplicity",
      description: "Explore how shifting from the mono-mind belief to multiplicity transforms shame into curiosity.",
      type: "reflection",
      order: "1",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        prompt: "Reflect on a recent moment of inner conflict or self-criticism.",
        questions: [
          "Mono-Mind View: When you experienced this conflict, what did you tell yourself about yourself? (e.g., 'I'm so inconsistent,' 'I'm broken,' 'What's wrong with me?')",
          "Multiplicity View: Can you reframe this as a conflict between different parts? (e.g., 'A part of me wanted X, but another part wanted Y.')",
          "How does it feel different to think of it as 'parts in conflict' rather than 'I am broken'?",
          "What might shift if you approached this conflict with curiosity instead of shame?"
        ]
      }
    },
    {
      lessonId: "module-01-foundations",
      title: "Mapping Your Internal Family",
      description: "Begin to identify and map the three groups of parts in your system.",
      type: "parts_work",
      order: "2",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        instruction: "For each category, identify 1-2 parts that you recognize in yourself. Don't overthink it—go with what comes up intuitively.",
        categories: {
          managers: {
            definition: "Proactive protectors that try to control your world to prevent pain.",
            examples: ["Inner Critic", "Perfectionist", "Planner", "People-Pleaser", "Controller"],
            prompt: "Which Manager parts do you recognize in yourself? What do they do?"
          },
          firefighters: {
            definition: "Reactive protectors that numb or distract from pain when it breaks through.",
            examples: ["Addictions", "Binge-eating", "Dissociation", "Rage", "Scrolling"],
            prompt: "Which Firefighter parts do you recognize? What do they do when you're in pain?"
          },
          exiles: {
            definition: "Young, wounded parts holding pain from the past.",
            examples: ["The Lonely Child", "The Rejected One", "The Scared Little One"],
            prompt: "Can you sense any young, vulnerable parts? What feelings do they carry? (It's okay if you can't access them yet—protectors often keep them hidden.)"
          }
        },
        reminder: "This is just a first sketch. You'll get to know your parts more deeply as we continue."
      }
    },

    // Activities for Module 2: Managers
    {
      lessonId: "module-02-managers",
      title: "Meet Your Manager Parts",
      description: "Identify and appreciate the Manager parts that work so hard to protect you.",
      type: "journaling",
      order: "1",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        prompt: "Choose one Manager part that you recognize in yourself (Inner Critic, Perfectionist, Planner, People-Pleaser, etc.)",
        questions: [
          "What does this part do? How does it behave?",
          "What is it trying to protect you from? (What pain is it trying to prevent?)",
          "How long has it been doing this job?",
          "What do you imagine this part feels like? (Tired? Stressed? Determined?)",
          "If this part could relax its job, what would it rather be doing?"
        ],
        reframe: "Remember: This part is not your enemy. It's been working incredibly hard to keep you safe."
      }
    },

    // Activities for Module 3: Firefighters  
    {
      lessonId: "module-03-firefighters",
      title: "Understanding Your Firefighter Parts",
      description: "Approach your reactive protectors with curiosity and compassion.",
      type: "reflection",
      order: "1",
      isProtocol: false,
      requiresSafetyCheck: true,
      content: {
        safetyNote: "This exercise asks you to look at behaviors you may feel shame about. If at any point you feel overwhelmed, use the grounding exercise.",
        prompt: "Identify a Firefighter behavior you recognize in yourself.",
        questions: [
          "What is the behavior? (Be specific and non-judgmental: 'I scroll on my phone for hours,' not 'I waste time.')",
          "When does this part show up? What typically triggers it?",
          "What pain do you think this part is trying to help you escape or numb?",
          "What would happen if this part couldn't do its job? What feeling would you be left with?",
          "Can you thank this part for trying to help you, even if its methods are problematic?"
        ],
        reminder: "The Firefighter is not the problem. It's the solution to a problem (Exile pain). Compassion, not judgment, is what creates change."
      }
    },

    // Activities for Module 4: Exiles
    {
      lessonId: "module-04-exiles",
      title: "Identifying Your Core Wounds",
      description: "Explore which of the five core childhood wounds may be present in your system.",
      type: "assessment",
      order: "1",
      isProtocol: false,
      requiresSafetyCheck: true,
      content: {
        safetyNote: "This exercise explores painful childhood experiences. Go slowly. You can stop at any time. You do not need to 'prove' or 'justify' your wounds. Your feelings are valid.",
        instruction: "Read through the five wounds. Notice which ones resonate with you. You may have more than one.",
        wounds: [
          {
            name: "Rejection",
            coreMessage: "Who you are is not acceptable.",
            reflectionPrompts: [
              "Did you receive messages that parts of you were 'too much' or 'not enough'?",
              "Were certain emotions or expressions shut down or criticized?",
              "Do you often feel like you need to hide your true self?"
            ]
          },
          {
            name: "Abandonment",
            coreMessage: "You are alone. No one will be there for you.",
            reflectionPrompts: [
              "Was a caregiver physically or emotionally absent?",
              "Did you feel invisible or forgotten?",
              "Do you fear being left or have difficulty trusting others will stay?"
            ]
          },
          {
            name: "Injustice",
            coreMessage: "The world is not fair. You are powerless.",
            reflectionPrompts: [
              "Did you witness or experience unfairness growing up?",
              "Were your boundaries violated without protection?",
              "Do you feel a need to control situations to ensure fairness or safety?"
            ]
          },
          {
            name: "Betrayal",
            coreMessage: "People will hurt you if you trust them.",
            reflectionPrompts: [
              "Was your trust broken by someone important to you?",
              "Were there secrets or deceptions in your family?",
              "Do you have difficulty being vulnerable or trusting others?"
            ]
          },
          {
            name: "Neglect",
            coreMessage: "Your needs don't matter. You are invisible.",
            reflectionPrompts: [
              "Were your emotional needs consistently unmet or dismissed?",
              "Did you have to grow up too fast or take care of others?",
              "Do you struggle to identify or express your own needs?"
            ]
          }
        ],
        closingPrompt: "Which wound(s) feel most alive in you? You don't need to have a clear 'story' yet. Just notice what resonates."
      }
    },

    // Activities for Module 5: The Self
    {
      lessonId: "module-05-self",
      title: "8 C's Self-Energy Assessment",
      description: "Assess your current level of Self-energy using the 8 C's framework.",
      type: "assessment",
      order: "1",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        instruction: "For each of the 8 C's, rate how much you currently experience this quality in your daily life. Be honest—this is just to build awareness.",
        qualities: [
          {
            name: "Curiosity",
            definition: "I approach my parts (and others) with genuine interest and openness, not judgment.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          },
          {
            name: "Compassion",
            definition: "I feel caring and kindness toward my parts' struggles and pain.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          },
          {
            name: "Calm",
            definition: "I can remain centered and peaceful, even when parts are activated.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          },
          {
            name: "Clarity",
            definition: "I see situations clearly, without the distortion of my parts' extreme views.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          },
          {
            name: "Confidence",
            definition: "I trust in my ability to handle challenges and be with difficult emotions.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          },
          {
            name: "Courage",
            definition: "I am willing to face uncomfortable feelings and situations for the sake of growth.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          },
          {
            name: "Creativity",
            definition: "I can find new perspectives and solutions instead of old reactive patterns.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          },
          {
            name: "Connectedness",
            definition: "I feel connected to myself, my parts, and something larger than myself.",
            ratingScale: "1 (Rarely) to 5 (Frequently)"
          }
        ],
        reflection: "Which C's feel strongest in you? Which feel hardest to access? Remember: Your Self is always there. When you don't feel the C's, it just means your parts are blending with you. That's normal."
      }
    },
    {
      lessonId: "module-05-self",
      title: "Accessing Self-Energy Practice",
      description: "Practice the simple technique for accessing your Self.",
      type: "meditation",
      order: "2",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        preparation: "Find a quiet place. Sit comfortably. Close your eyes or soften your gaze.",
        steps: [
          {
            step: 1,
            instruction: "Take 3 deep breaths. With each exhale, let your body relax a little more."
          },
          {
            step: 2,
            instruction: "Ask yourself: 'How do I feel right now?' Notice any emotions, sensations, or thoughts that arise. Just notice them."
          },
          {
            step: 3,
            instruction: "For each feeling/thought, ask: 'Is this coming from a part of me, or is this my Self?' If it feels reactive, intense, or judgmental, it's a part."
          },
          {
            step: 4,
            instruction: "Gently ask any parts you notice: 'Would you be willing to relax and step back, just for a few minutes, so I can experience my Self?' Wait. Notice if they soften or move back."
          },
          {
            step: 5,
            instruction: "As parts step back, notice what's left. This is your Self. It might feel spacious, calm, clear, or just a quiet presence. There's nothing to 'do'—just be."
          },
          {
            step: 6,
            instruction: "Rest in this Self-energy for a few minutes. If parts come back in, that's okay. Just notice and gently ask them to step back again."
          }
        ],
        closingReflection: "How did that feel? Could you sense a difference between 'parts' and 'Self'? Even a moment of Self-energy is valuable."
      }
    },

    // Activities for Module 6: 6 F's Protocol
    {
      lessonId: "module-06-six-fs",
      title: "Practice the 6 F's Protocol",
      description: "Walk through the complete 6 F's protocol with a protective part.",
      type: "protocol",
      order: "1",
      isProtocol: true,
      requiresSafetyCheck: true,
      content: {
        safetyNote: "This is deep work. Go at your own pace. You can stop at any step. If you feel overwhelmed, use the grounding exercise.",
        preparation: "Choose a protective part you'd like to get to know (a Manager or Firefighter). Examples: your inner critic, your anxiety, your urge to numb out, your people-pleaser.",
        protocol: {
          step1: {
            name: "Find",
            question: "Where do you feel this part in your body?",
            prompt: "Close your eyes. Notice the sensation. Describe it (location, quality, intensity)."
          },
          step2: {
            name: "Focus",
            question: "What does this part look like, feel like, or seem like?",
            prompt: "Give it your full attention. Does it have a shape, color, image, age, or voice? Just notice what comes."
          },
          step3: {
            name: "Flesh Out",
            question: "What is this part saying? What does it want you to know?",
            prompt: "Listen to its voice. What message does it have? How old does it feel? What emotions does it carry?"
          },
          step4: {
            name: "Feel Toward",
            question: "How do you feel toward this part right now?",
            checkpoint: "If curious/compassionate → Continue. If judgmental/annoyed → Ask that judging part to step back first."
          },
          step5: {
            name: "beFriend",
            questions: [
              "What is your job? What are you trying to do for me?",
              "What are you afraid would happen if you stopped doing this job?",
              "How long have you been doing this work?",
              "Is this a job you enjoy, or would you rather be doing something else?"
            ],
            prompt: "Ask these questions one at a time. Listen for the part's answers. Write down what you hear."
          },
          step6: {
            name: "Fear (Ask for Permission)",
            question: "Would you be willing to let me (my Self) go to the part you're protecting? I only want to help.",
            note: "If yes, thank the protector and prepare for the next module (working with the Exile). If no, ask what it would need to feel safe. Honor its answer."
          }
        },
        reflection: "What did you learn about this protector? How does it feel to understand its positive intention?"
      }
    },

    // Activities for Module 7: Witnessing
    {
      lessonId: "module-07-witnessing",
      title: "Witnessing an Exile (Guided Process)",
      description: "If a protector has given permission, use this guided process to witness an Exile.",
      type: "protocol",
      order: "1",
      isProtocol: true,
      requiresSafetyCheck: true,
      content: {
        prerequisite: "Only do this activity if you have completed the 6 F's and a protector has given you permission to access an Exile.",
        safetyWarning: "This is deep, potentially activating work. Have your grounding tools ready. Stop if you feel overwhelmed. This is not a race.",
        process: {
          step1: {
            name: "Find the Exile",
            instruction: "Close your eyes. Turn your attention inward. Ask: 'Where is the part the protector was guarding?' Notice where you're drawn (a place in your body, an image, a feeling)."
          },
          step2: {
            name: "Approach with Self",
            instruction: "Check: How do I feel toward this Exile? If you feel anything other than compassion/curiosity, ask that part to step back. Only proceed when you're in Self."
          },
          step3: {
            name: "Witness: 'What Happened to You?'",
            instruction: "Ask the Exile: 'What happened to you? Show me.' Then just listen/watch/feel. The Exile may show you a memory, an image, or a feeling. Your job is to be present and witness. Don't fix, don't rescue, just see."
          },
          step4: {
            name: "Validate",
            instruction: "After witnessing, speak to the Exile from your Self. Say things like: 'Of course you felt that way.' 'That was too much for a little one.' 'It wasn't your fault.' 'I see you.' Let the Exile hear that its pain is valid."
          },
          step5: {
            name: "Check In",
            instruction: "Ask the Exile: 'How do you feel now that I've seen what happened and validated your pain?' Notice any shifts."
          }
        },
        groundingReminder: "After this exercise, ground yourself. Place your hand on your heart. Take deep breaths. Remind yourself: 'I am safe now. That was then. This is now.'"
      }
    },

    // Activities for Module 8: Unburdening
    {
      lessonId: "module-08-unburdening",
      title: "Complete Unburdening Protocol",
      description: "Guide an Exile through the full reparenting and unburdening process.",
      type: "protocol",
      order: "1",
      isProtocol: true,
      requiresSafetyCheck: true,
      content: {
        prerequisite: "Only proceed if you have witnessed and validated an Exile (Module 7).",
        safetyNote: "This is the most intensive healing work. Only proceed when you feel ready and grounded. You can do this in multiple sessions.",
        fullProtocol: [
          {
            step: "Retrieve",
            instruction: "Ask the Exile: 'Are you still stuck in that old scene/memory?' If yes, go into the scene as your adult Self. Tell the young part: 'I'm here now. You don't have to stay here anymore. Will you come with me?' If it says yes, visualize bringing it out of the memory to a safe place (your heart, a peaceful location)."
          },
          {
            step: "Identify Burdens",
            instruction: "Ask the Exile: 'What feelings or beliefs have you been carrying all these years?' (Examples: shame, fear, 'I am worthless', 'I am unsafe'). Let it tell you."
          },
          {
            step: "Ask Permission to Unburden",
            instruction: "Ask: 'Are you ready to release this [burden]? It was never yours to carry.' Wait for a 'yes.' If it's not ready, ask what it needs first."
          },
          {
            step: "Choose Release Method",
            instruction: "Ask the Exile: 'How would you like to release this burden?' Common methods: giving it to light, washing it in water, burning it, burying it, breathing it out. Use what the Exile chooses."
          },
          {
            step: "Visualize Release",
            instruction: "Close your eyes. Visualize the burden leaving the Exile's body in the chosen way. See it dissolve, wash away, burn up. Take as much time as needed. This is a sacred process."
          },
          {
            step: "Confirm Release",
            instruction: "Ask: 'Is it gone? How do you feel now?' Notice the shift. The Exile may feel lighter, freer, more peaceful."
          },
          {
            step: "Invite Positive Qualities",
            instruction: "Ask: 'What positive qualities would you like to take in now?' (Examples: safety, love, playfulness, peace, worthiness). Visualize these flowing into the Exile from your Self or another source."
          },
          {
            step: "Create New Home",
            instruction: "Ask: 'Where would you like to be now?' The Exile may want to stay in your heart, in a beautiful inner sanctuary, in nature. Visualize it in its new, safe home."
          },
          {
            step: "Ongoing Relationship",
            instruction: "Tell the Exile: 'I will check in with you. You are not alone anymore. I am here.' Establish that this is an ongoing relationship."
          },
          {
            step: "Check with Protectors",
            instruction: "Go back to the protector that was guarding this Exile. Ask: 'How do you feel now that the part you were protecting has been healed?' Let it rest or choose a new role."
          }
        ],
        aftercare: "After unburdening, be gentle with yourself. Rest. Drink water. The Exile may need multiple sessions. Parts may re-activate as they adjust. This is normal. Keep checking in."
      }
    },

    // Activities for Module 9: Integration
    {
      lessonId: "module-09-integration",
      title: "Daily Self-Leadership Practice",
      description: "Establish a daily practice of Self-leadership to integrate IFS into your life.",
      type: "exercise",
      order: "1",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        introduction: "Self-leadership is a daily practice, not a destination. These simple exercises will help you integrate IFS into your everyday life.",
        morningPractice: {
          duration: "5 minutes",
          steps: [
            "Close your eyes and take 3 deep breaths",
            "Ask: 'How is my system this morning? Are any parts activated or concerned?'",
            "Listen. If a part speaks up, acknowledge it: 'I hear you. Thank you for trying to help.'",
            "Ask your Self: 'What do I want to prioritize today?'",
            "Set an intention to notice when parts get activated during the day"
          ]
        },
        realTimePractice: {
          title: "Noticing Parts in the Moment",
          triggers: "When you feel a sudden strong emotion, familiar reactive behavior, or a sense of being 'hijacked':",
          steps: [
            "Pause. Take a breath.",
            "Name it: 'A part of me is activated right now.'",
            "Get curious: 'Which part? What is it afraid of?'",
            "Respond from Self: 'I hear you. I've got this. Let me handle it.'"
          ]
        },
        eveningPractice: {
          duration: "10 minutes",
          reflections: [
            "When did I notice parts today? How did I respond?",
            "When did I respond from Self instead of reacting from a part? (Celebrate this!)",
            "If I reacted from a part, can I go back and check in with it now?",
            "What am I grateful for in my parts today? How did they try to help me?"
          ]
        },
        weeklyPractice: {
          title: "Weekly Parts Check-In",
          instruction: "Once a week, set aside 15-30 minutes to check in with your system",
          questions: [
            "Which parts have been most active this week?",
            "Are any Exiles asking for attention?",
            "Do any protectors need reassurance or rest?",
            "How can I support my system in the week ahead?"
          ]
        }
      }
    },
    {
      lessonId: "module-09-integration",
      title: "Self-Leadership in Challenging Moments",
      description: "Practice responding to triggers and challenges from Self instead of parts.",
      type: "reflection",
      order: "2",
      isProtocol: false,
      requiresSafetyCheck: false,
      content: {
        instruction: "Think of a recent triggering event or challenging situation. Walk through how Self-leadership could have changed your response.",
        reflection: {
          situation: "Describe what happened (externally):",
          partResponse: "What part(s) got activated? How did they react?",
          exileIdentification: "What Exile do you think was triggered? What old wound was touched?",
          selfResponse: "If you had been in Self, how might you have responded differently?",
          practice: "The next time a similar situation arises, what's one thing you can do to pause and access Self first?"
        },
        reminder: "Self-leadership isn't about being perfect. It's about noticing when parts take over and gently coming back to Self. Progress, not perfection."
      }
    }
  ];

  for (const activity of activities) {
    await storage.createLessonActivity(activity);
  }

  console.log(`✓ Seeded ${activities.length} lesson activities`);
}

// Run the seed function if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedComprehensiveIFS()
    .then(() => {
      console.log("Seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
