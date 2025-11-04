// Comprehensive IFS Knowledge Library
// Based on clinical research and therapeutic best practices

export interface IFSConcept {
  id: string;
  title: string;
  category: 'foundations' | 'parts' | 'self' | 'wounds' | 'protocols' | 'healing';
  description: string;
  detailedContent: string;
  keyTakeaways: string[];
  reflectionPrompts?: string[];
  therapeuticApplication?: string;
}

export const eightCsOfSelf = {
  title: "The 8 C's of Self-Energy",
  description: "Qualities that emerge when you are in Self - your core healing presence",
  qualities: [
    {
      name: "Curiosity",
      description: "A genuine interest in your parts without judgment",
      example: "Instead of 'Why do I keep doing this?', asking 'What is this part trying to accomplish?'",
      practice: "When a part activates, pause and ask: 'I wonder what this part wants me to know?'"
    },
    {
      name: "Compassion",
      description: "A caring, open-heartedness toward your parts' pain",
      example: "Recognizing your inner critic is trying to protect you from external judgment",
      practice: "Place a hand on your heart and say: 'This part is doing its best to help me'"
    },
    {
      name: "Calm",
      description: "A sense of peace and centeredness, even in difficulty",
      example: "Feeling steady while parts are activated, like a calm parent with an upset child",
      practice: "Take 3 slow breaths, feeling your feet on the ground, before engaging with parts"
    },
    {
      name: "Clarity",
      description: "The ability to see situations without distortion",
      example: "Recognizing 'I'm worthless' is a burden, not a truth",
      practice: "Ask: 'Is this my Self speaking, or is this a part with a belief?'"
    },
    {
      name: "Confidence",
      description: "Trust in your ability to handle what comes up",
      example: "Knowing you can be with difficult feelings without being overwhelmed",
      practice: "Remind yourself: 'I have a Self that can handle this. I am not my parts.'"
    },
    {
      name: "Courage",
      description: "Willingness to be with pain in order to heal it",
      example: "Choosing to turn toward a wounded exile instead of letting firefighters numb the pain",
      practice: "Ask your protective parts: 'What if healing this is possible? Can we try?'"
    },
    {
      name: "Creativity",
      description: "The ability to find new solutions and approaches",
      example: "Discovering a part that's been a perfectionist might enjoy being playful instead",
      practice: "Ask parts: 'If you didn't have to do this job, what would you rather do?'"
    },
    {
      name: "Connectedness",
      description: "A feeling of connection to your parts and others",
      example: "Sensing that all parts belong to the same internal family",
      practice: "Visualize all your parts in one room, knowing they're all part of you"
    }
  ]
};

export const fiveChildhoodWounds = [
  {
    id: "wound-rejection",
    name: "Wound of Rejection",
    description: "Being pushed away, criticized, or made to feel unwanted for being authentic",
    exileBurdens: [
      "I am unlovable",
      "Something is wrong with me",
      "I must hide my true self",
      "I am too much / not enough"
    ],
    commonProtectors: [
      {
        type: "Manager",
        name: "The People-Pleaser",
        strategy: "Constantly adapts to others' needs to avoid rejection",
        message: "If I make everyone happy, they won't push me away"
      },
      {
        type: "Manager",
        name: "The Perfectionist",
        strategy: "Strives for flawlessness to be acceptable",
        message: "If I'm perfect, no one can reject me"
      },
      {
        type: "Firefighter",
        name: "The Rage",
        strategy: "Pushes others away first before they can reject",
        message: "I'll reject them before they reject me"
      }
    ],
    healingPath: "The exile needs to experience unconditional acceptance from your Self. It needs to know: 'You are lovable exactly as you are. There is nothing wrong with you. You don't have to change to be worthy of love.'",
    reparentingExercise: "Go to the memory where you felt rejected. As your adult Self, tell that young part: 'I see you. I love you exactly as you are. You don't have to be different. You are enough.'"
  },
  {
    id: "wound-abandonment",
    name: "Wound of Abandonment",
    description: "Physical or emotional abandonment - caregiver leaving or being emotionally unavailable",
    exileBurdens: [
      "I am all alone",
      "No one will be there for me",
      "I can't trust anyone to stay",
      "I am not important enough to stay for"
    ],
    commonProtectors: [
      {
        type: "Manager",
        name: "The Anxious Attacher",
        strategy: "Clings to relationships, constantly seeking reassurance",
        message: "If I hold on tight enough, they can't leave"
      },
      {
        type: "Manager",
        name: "The Hyper-Independent",
        strategy: "Refuses to need anyone",
        message: "If I don't need anyone, I can't be abandoned"
      },
      {
        type: "Firefighter",
        name: "The Dissociator",
        strategy: "Numbs out to escape the terror of aloneness",
        message: "If I don't feel it, it's not happening"
      }
    ],
    healingPath: "The exile needs to know it is not alone anymore. It needs constant, reliable presence from your Self.",
    reparentingExercise: "Visualize the young part alone. Go to it as your adult Self and say: 'I am here now. I will not leave you. You are not alone anymore. I've got you.'"
  },
  {
    id: "wound-injustice",
    name: "Wound of Injustice",
    description: "Experiencing unfairness, broken promises, or boundary violations without recourse",
    exileBurdens: [
      "The world is not safe",
      "I am powerless",
      "My voice doesn't matter",
      "Bad things will keep happening"
    ],
    commonProtectors: [
      {
        type: "Manager",
        name: "The Controller",
        strategy: "Obsessively plans and controls to ensure fairness",
        message: "If I control everything, I can prevent injustice"
      },
      {
        type: "Manager",
        name: "The Hypervigilant",
        strategy: "Constantly scans for threats",
        message: "If I see it coming, I can protect myself"
      },
      {
        type: "Firefighter",
        name: "The Escape Artist",
        strategy: "Uses substances or behaviors to escape the powerlessness",
        message: "I can't change reality, but I can escape it"
      }
    ],
    healingPath: "The exile needs to know it has power now. It needs to know its voice matters and that your Self will protect it.",
    reparentingExercise: "Go to the memory of injustice. As your adult Self, step in and say: 'This was wrong. This should not have happened to you. You are powerful now. I will protect you.'"
  },
  {
    id: "wound-betrayal",
    name: "Wound of Betrayal",
    description: "Trust being broken by a key person - secrets told, promises broken, infidelity",
    exileBurdens: [
      "I can't trust anyone",
      "People will always hurt me",
      "Love is dangerous",
      "I was a fool to trust"
    ],
    commonProtectors: [
      {
        type: "Manager",
        name: "The Suspicious One",
        strategy: "Tests and vets everyone constantly",
        message: "If I never fully trust, I can't be betrayed again"
      },
      {
        type: "Manager",
        name: "The Wall Builder",
        strategy: "Keeps emotional distance",
        message: "If I don't let anyone close, they can't hurt me"
      },
      {
        type: "Firefighter",
        name: "The Isolator",
        strategy: "Withdraws completely from relationships",
        message: "Alone is safer than betrayed"
      }
    ],
    healingPath: "The exile needs to experience your Self as trustworthy, consistent, and protective. It needs to rebuild trust slowly.",
    reparentingExercise: "Tell the betrayed part: 'What happened was a betrayal of your trust. You didn't deserve that. I am trustworthy. I will show you consistently that you can trust me.'"
  },
  {
    id: "wound-neglect",
    name: "Wound of Neglect",
    description: "Chronic lack of emotional or physical attunement - not being seen, heard, or valued",
    exileBurdens: [
      "I am invisible",
      "My needs don't matter",
      "I am worthless",
      "No one cares about me"
    ],
    commonProtectors: [
      {
        type: "Manager",
        name: "The Over-Achiever",
        strategy: "Accomplishes to finally be seen",
        message: "If I achieve enough, people will notice me"
      },
      {
        type: "Manager",
        name: "The Inner Critic",
        strategy: "Pushes harder to be 'better' and worthy of attention",
        message: "If I'm impressive enough, I'll matter"
      },
      {
        type: "Firefighter",
        name: "The Filler",
        strategy: "Fills the void with food, shopping, substances",
        message: "I'll fill this emptiness myself"
      }
    ],
    healingPath: "The exile needs to be truly seen, heard, and valued by your Self. It needs focused, attuned attention.",
    reparentingExercise: "Look directly at the neglected part and say: 'I see you. You matter. Your needs are important. I am paying attention. Tell me everything you need to tell me.'"
  }
];

export const ifsFoundations: IFSConcept[] = [
  {
    id: "multiplicity",
    title: "The Multiplicity Paradigm",
    category: "foundations",
    description: "Understanding that the mind is naturally multiple, not singular",
    detailedContent: `The fundamental reframe of IFS is moving from the "mono-mind" theory (one unified personality) to the "multiplicity paradigm" (many parts working together).

**Why This Matters:**
- The mono-mind theory leads to shame: "I'm broken," "I'm inconsistent"
- The multiplicity paradigm leads to curiosity: "Which parts are in conflict, and why?"

**The Liberation:**
Inner conflict is not a sign of being broken. It's a sign of a divided internal system. Your parts are in conflict with each other, often polarized into opposing roles.

**Example:**
- Old thought: "I'm so lazy - I can't get anything done"
- New thought: "I have a part that wants to achieve and a part that needs rest. They're in conflict. Both make sense."

This shift from shame to curiosity is the foundational first step of all healing.`,
    keyTakeaways: [
      "You are not broken, you are multiple",
      "Inner conflict is between parts, not a flaw in you",
      "Shame dissolves when you understand multiplicity",
      "All parts have positive intentions"
    ],
    reflectionPrompts: [
      "What are two parts of me that seem to be in conflict?",
      "How would it feel to see that conflict as two good parts trying to help in different ways?",
      "What shame could I let go of if I understood I'm not broken, just multiple?"
    ]
  },
  {
    id: "no-bad-parts",
    title: "There Are No Bad Parts",
    category: "foundations",
    description: "Every part has a positive intention, even those causing pain",
    detailedContent: `The IFS model's core principle: **There are no bad parts.**

Every part in your system, no matter how destructive or painful its actions seem, is trying to help you based on its understanding of the world.

**Understanding Protectors:**
- Your inner critic isn't trying to hurt you - it's trying to protect you from external judgment
- Your addiction isn't trying to ruin your life - it's trying to numb unbearable pain
- Your rage isn't trying to push people away - it's trying to protect you from being hurt

**How Parts Get Extreme:**
Parts are not created by trauma. They are innate potentials that get "forced from their valuable states into extreme roles" by overwhelming experiences.

Example: A naturally sensitive part → forced into extreme numbness to survive
A naturally joyful part → forced into exile because its joy was unsafe

**The Goal:**
Not to eliminate parts, but to heal the wounds they protect so they can relax their extreme roles and return to their valuable, natural states.`,
    keyTakeaways: [
      "All parts have positive intentions",
      "Parts become extreme due to overwhelming experiences",
      "Your inner critic is a protector, not an enemy",
      "Healing means unburdening, not eliminating"
    ],
    reflectionPrompts: [
      "What part of me do I judge most harshly?",
      "What might that part be trying to protect me from?",
      "How might that part relax if the wound it protects was healed?"
    ],
    therapeuticApplication: "Help clients see their 'worst' parts as misunderstood protectors. This creates immediate self-compassion."
  }
];

export const partsDeepDive: IFSConcept[] = [
  {
    id: "managers-detailed",
    title: "Managers: The Proactive Protectors",
    category: "parts",
    description: "Understanding the parts that run your daily life to prevent pain",
    detailedContent: `**Role:** Managers are your proactive protector parts. Their primary goal is to prevent your Exiles (wounded parts) from ever being triggered.

**Their Logic:**
"If I can control the external world and manage emotions perfectly, the pain will never surface."

**Common Manager Strategies:**

1. **The Inner Critic**
   - Message: "I'll criticize you first so others can't hurt you"
   - Burden: Often protecting an exile who was shamed
   - Extreme behavior: Harsh self-judgment, perfectionism

2. **The Planner/Controller**
   - Message: "If I plan everything, nothing bad will happen"
   - Burden: Protecting an exile who experienced chaos or unpredictability
   - Extreme behavior: Obsessive planning, inability to be spontaneous

3. **The People-Pleaser**
   - Message: "If everyone likes me, I'm safe from rejection"
   - Burden: Protecting an exile who was rejected or abandoned
   - Extreme behavior: Inability to say no, resentment

4. **The Intellectual**
   - Message: "If I stay in my head, I won't feel my heart"
   - Burden: Protecting exiles with overwhelming emotions
   - Extreme behavior: Over-analysis, emotional disconnection

**Working with Managers:**
Managers need to be thanked for their service and asked permission to heal the exile they protect. They won't step aside until they trust your Self can handle the pain.`,
    keyTakeaways: [
      "Managers prevent pain proactively",
      "They control life to keep exiles from being triggered",
      "Your anxiety is usually a Manager at work",
      "They need permission before accessing exiles"
    ],
    reflectionPrompts: [
      "Which Manager parts run my daily life?",
      "What pain are my Managers trying to prevent?",
      "How might my Managers relax if they knew the pain could be healed?"
    ],
    therapeuticApplication: "Anxiety is almost always a Manager. Start here to build trust before accessing deeper wounds."
  },
  {
    id: "firefighters-detailed",
    title: "Firefighters: The Reactive Protectors",
    category: "parts",
    description: "Understanding the parts that react when pain breaks through",
    detailedContent: `**Role:** Firefighters are your reactive protector parts. They activate after an Exile has already been triggered and pain is present.

**Their Logic:**
"The pain is here NOW! We must numb it or distract from it immediately, at any cost!"

**Key Difference from Managers:**
- Managers work to PREVENT pain (proactive)
- Firefighters work to EXTINGUISH pain (reactive)
- Firefighters don't care about consequences - they just want the pain to stop

**Common Firefighter Strategies:**

1. **Substance Use**
   - Alcohol, drugs, excessive caffeine
   - Message: "I can chemically numb this feeling"

2. **Behavioral Addictions**
   - Scrolling, gaming, gambling, shopping
   - Message: "I can distract from this pain"

3. **Binge Eating**
   - Message: "I can fill this emptiness"

4. **Dissociation**
   - Spacing out, feeling unreal
   - Message: "I can leave my body so I don't feel this"

5. **Rage Outbursts**
   - Sudden, explosive anger
   - Message: "Anger is more powerful than vulnerability"

6. **Self-Harm**
   - Cutting, hitting self
   - Message: "Physical pain is more controllable than emotional pain"

**Why Firefighters Activate:**
When Managers can't prevent an Exile from being triggered (through a breakup, criticism, failure), Firefighters rush in to douse the flames.

**Working with Firefighters:**
Firefighters are desperate and exhausted. They need to know there's another way to handle the pain - through healing the Exile.`,
    keyTakeaways: [
      "Firefighters react to pain that's already present",
      "They don't care about consequences - just stopping pain now",
      "Addictive behaviors are usually Firefighters",
      "They're exhausted and need relief through Exile healing"
    ],
    reflectionPrompts: [
      "What do I do when I'm overwhelmed (scroll, drink, rage)?",
      "What pain is my Firefighter trying to extinguish?",
      "What would my Firefighter rather do if the pain was healed?"
    ],
    therapeuticApplication: "Don't try to eliminate Firefighters directly. Heal the Exile they protect, and they'll naturally relax."
  },
  {
    id: "exiles-detailed",
    title: "Exiles: The Wounded Inner Children",
    category: "parts",
    description: "Understanding the young parts that carry your deepest pain",
    detailedContent: `**Role:** Exiles are the young, vulnerable, wounded parts of your system. They experienced trauma, pain, fear, shame, or neglect and carry the "burdens" of those experiences.

**Why They're "Exiled":**
To protect the overall system from being flooded by their overwhelming pain, these parts were isolated and locked away by Managers and Firefighters. They are "stuck" in the past, in the moment of their wounding.

**What Exiles Carry:**

1. **Extreme Emotions:**
   - Terror, grief, rage, shame, loneliness

2. **Extreme Beliefs (Burdens):**
   - "I am worthless"
   - "I am unlovable"
   - "I am unsafe"
   - "It's all my fault"
   - "I am alone"

**The Exile's Experience:**
- They don't know time has passed
- They believe the burden is TRUTH, not just a belief
- They desperately want to be seen and heard
- They hold the key to all healing

**When Exiles Get Triggered:**
When something in the present reminds them of the past wound, they flood the system with their pain. This feels life-threatening to the protectors, who rush to shut it down.

**Working with Exiles:**
Exiles need:
1. **Witnessing:** To tell their story and be heard
2. **Validation:** To know it wasn't their fault
3. **Reparenting:** To receive the love and safety they needed
4. **Unburdening:** To release the extreme beliefs
5. **Integration:** To be welcomed back into the system

**The Sacred Truth:**
Healing happens when your Self (your core wise, compassionate essence) goes to the Exile and provides what the child needed but never received. This is reparenting.`,
    keyTakeaways: [
      "Exiles are wounded inner children stuck in the past",
      "They carry extreme emotions and beliefs (burdens)",
      "They don't know time has passed - they think it's still happening",
      "Healing requires your Self to reparent them"
    ],
    reflectionPrompts: [
      "What young part of me still feels the pain of childhood?",
      "What beliefs does that young part carry?",
      "What did that part need but never receive?"
    ],
    therapeuticApplication: "This is where all healing happens. Take time, go slow, and trust the process."
  }
];

export const sixFsProtocol = {
  title: "The 6 F's Protocol",
  description: "The step-by-step process for safely connecting with and healing your parts",
  purpose: "This protocol ensures you approach parts from Self-energy (curiosity, compassion, calm) rather than from another part (judgment, fear, frustration).",
  steps: [
    {
      number: 1,
      name: "Find",
      instruction: "Locate where you feel the part in your body",
      questions: [
        "Where do you notice this feeling in your body?",
        "Is it in your chest? Your throat? Your stomach?",
        "What sensations do you notice?"
      ],
      example: "I feel anxiety as tightness in my chest and a knot in my stomach.",
      purpose: "Grounding the part in a somatic experience makes it real and accessible."
    },
    {
      number: 2,
      name: "Focus",
      instruction: "Give your full, curious attention to that sensation",
      questions: [
        "Can you focus all of your attention on that sensation?",
        "Just notice it without trying to change it"
      ],
      example: "I'm focusing on the tightness in my chest, just observing it.",
      purpose: "This invitation to the part shows you're ready to listen."
    },
    {
      number: 3,
      name: "Flesh Out",
      instruction: "Get to know the part's characteristics",
      questions: [
        "If this part had a shape, color, or image, what would it look like?",
        "Does it have a voice? What is it saying?",
        "How old does this part feel?",
        "What's its energy - frantic? Tired? Sad?"
      ],
      example: "It looks like a dark grey cloud, heavy and suffocating. It's saying 'Something bad will happen.' It feels ancient, like it's been here forever.",
      purpose: "This helps the part feel seen and distinct, not just a vague feeling."
    },
    {
      number: 4,
      name: "Feel Toward",
      instruction: "Check if you're in Self-energy toward this part",
      keyQuestion: "How do you feel TOWARD this part?",
      selfEnergyResponses: [
        "I'm curious about it",
        "I feel compassion for it",
        "I'm calm toward it",
        "I care about it"
      ],
      partResponses: [
        "I hate it / I want it gone",
        "It's stupid / It's weak",
        "I'm frustrated with it",
        "I'm scared of it"
      ],
      action: {
        ifSelf: "Great! You're in Self. Proceed to step 5.",
        ifPart: "You're in another part. Ask that part: 'Would you be willing to relax and step back just for a few minutes so I can get to know this part with curiosity? I promise we won't let anything bad happen.'"
      },
      purpose: "This is the most critical step. Healing only happens from Self, not from another part."
    },
    {
      number: 5,
      name: "Befriend",
      instruction: "Build relationship and trust with the part",
      questions: [
        "What is your job? What are you trying to accomplish for me?",
        "What are you afraid would happen if you stopped doing this job?",
        "How long have you been doing this job?",
        "Is this a job you want to be doing? What would you rather be doing?"
      ],
      example: "The anxious part says: 'My job is to keep you safe by worrying about everything. If I stopped, something terrible would happen that we didn't prepare for. I've been doing this since you were 7. I hate this job - I'd rather help you be creative and spontaneous.'",
      purpose: "Understanding the part's positive intention builds trust and compassion."
    },
    {
      number: 6,
      name: "Find the Exile (or Fear)",
      instruction: "Discover what the protector is protecting",
      questions: [
        "What are you afraid would happen if you relaxed?",
        "What or who are you protecting?",
        "Can you show me what you're so worried about?"
      ],
      example: "The anxious part says: 'I'm protecting a young part of you who was abandoned. If I stop worrying, that terror will flood you.'",
      next: "Ask the protector: 'Would you be willing to let me (Self) talk to that young part you're protecting? I just want to get to know them and see if I can help. You can watch - you don't have to go away.'",
      purpose: "This reveals the Exile that needs healing. Once healed, the protector can relax."
    }
  ],
  criticalReminder: "If at any point you feel overwhelmed, stop and return to the present. Use grounding techniques. This work is safest with a therapist."
};

export const unburdeningProcess = {
  title: "The Unburdening Process",
  description: "The sacred healing ritual for releasing pain and restoring wholeness to wounded Exiles",
  purpose: "To witness the Exile's story, validate its pain, and help it release the burdens (extreme beliefs and emotions) it has carried.",
  prerequisites: [
    "The protectors have given permission",
    "You are in Self-energy (calm, curious, compassionate)",
    "You feel ready to be with the Exile's pain without being overwhelmed"
  ],
  steps: [
    {
      number: 1,
      name: "Witness",
      description: "Listen to the Exile's story",
      instructions: [
        "Ask the Exile: 'What happened to you?'",
        "Let the Exile show you the memory or feeling",
        "Don't rush - let the story unfold",
        "Stay present as your Self - you are witnessing, not reliving"
      ],
      example: "The Exile shows me a memory of being 6 years old, alone in my room, crying after being yelled at. No one came.",
      keyPhrase: "Tell me everything. I'm here. I'm listening."
    },
    {
      number: 2,
      name: "Validate",
      description: "Affirm the Exile's experience and feelings",
      validatingStatements: [
        "That makes so much sense you felt that way",
        "That was too much for a little one",
        "You are not bad for feeling this",
        "That should not have happened to you",
        "You deserved better",
        "It wasn't your fault"
      ],
      purpose: "The Exile needs to know its feelings were valid and it wasn't to blame.",
      example: "I tell the 6-year-old: 'That was so scary. You were all alone. You deserved to be comforted. This wasn't your fault.'"
    },
    {
      number: 3,
      name: "Retrieve (Rescue)",
      description: "Remove the Exile from the traumatic scene",
      instructions: [
        "Ask: 'Is this Exile still in that old scene (the memory)?'",
        "If yes: 'Go into that scene as your adult Self'",
        "Tell the Exile: 'I am here for you now. You don't have to stay here anymore'",
        "Ask: 'Would you like to come with me?'",
        "Visualize taking the Exile out of the memory - hold their hand, carry them, however feels right"
      ],
      example: "I enter the memory as my adult self. I kneel down, hold out my hand, and say: 'Hey, I'm here now. You're not alone. Let's get you out of here.' The little one takes my hand, and we walk out together.",
      purpose: "The Exile needs to know it's not still in that moment. Time has passed. It's safe now."
    },
    {
      number: 4,
      name: "Unburden",
      description: "Release the extreme beliefs and emotions",
      instructions: [
        "Ask the Exile: 'What feelings or beliefs have you been carrying all these years?'",
        "It might say: 'Shame,' 'Fear,' 'I'm unlovable,' 'I'm worthless'",
        "Ask: 'Are you ready to let these go? They don't belong to you'",
        "Ask: 'How would you like to release them?'",
        "Common methods: Give them to light/water/fire, bury them, let wind carry them away",
        "Visualize the release happening"
      ],
      example: "The Exile says it's been carrying 'loneliness' and 'unworthiness.' It chooses to release them into a river. I watch the dark feelings flow away downstream until they're gone.",
      keyPhrase: "These burdens are not the truth of who you are. They were put on you. You can let them go now."
    },
    {
      number: 5,
      name: "Invite (Integration)",
      description: "Invite in positive qualities and welcome the Exile home",
      instructions: [
        "Ask: 'Now that you've released those burdens, what positive qualities would you like to take in?'",
        "Common qualities: Love, safety, playfulness, joy, peace, lightness, worthiness",
        "Visualize the Exile receiving these qualities (perhaps as light, warmth, colors)",
        "Ask: 'Where would you like to live now? Where would feel safe and happy?'",
        "Common places: In your heart, in a beautiful meadow, in a cozy home inside you",
        "Welcome the Exile back into your system"
      ],
      example: "The Exile wants to take in 'love' and 'safety.' I visualize warm golden light filling the little one. They ask to live in my heart. I place my hand on my heart and invite them in. I feel them settle there, finally home.",
      keyPhrase: "You belong here. You are welcome. You are loved."
    }
  ],
  aftercare: [
    "Check in with the Exile regularly: 'How are you doing?'",
    "Notice when it gets activated and reassure it: 'You're safe. I'm here'",
    "Thank the protectors for their service and notice how they've relaxed"
  ],
  criticalNote: "This is deep, powerful work. If you feel overwhelmed at any point, stop and seek support from a trained IFS therapist."
};

export const dailyIFSPractices = [
  {
    title: "Morning Parts Check-In",
    duration: "5 minutes",
    description: "Start your day in Self-leadership",
    steps: [
      "Close your eyes and take 3 deep breaths",
      "Ask: 'How is my system this morning?'",
      "Notice which parts are activated (anxiety, excitement, resistance)",
      "Say to each part: 'I see you. Thank you for being here'",
      "Ask your Self: 'What does my system need today?'"
    ]
  },
  {
    title: "The 'Feel Toward' Practice",
    duration: "Whenever needed",
    description: "Check if you're in Self or in a part",
    steps: [
      "Notice a strong feeling or reaction",
      "Ask: 'How do I feel TOWARD this feeling?'",
      "If judgmental/frustrated: You're in a part. Ask that part to step back",
      "If curious/compassionate: You're in Self. Listen to the part"
    ]
  },
  {
    title: "Evening Unblending",
    duration: "10 minutes",
    description: "Separate from parts you've been blended with all day",
    steps: [
      "Review your day - notice where you felt 'taken over'",
      "Name the part: 'Ah, I was blended with my perfectionist'",
      "Thank it: 'Thank you for trying to help today'",
      "Ask it: 'Can you relax now? I'm in charge for the evening'",
      "Feel yourself return to Self"
    ]
  }
];
