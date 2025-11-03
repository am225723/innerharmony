import { storage } from "./storage";

async function seedLessons() {
  console.log("Seeding IFS lessons...");

  // Lesson 1: Introduction to IFS
  const lesson1 = await storage.createLesson({
    title: "Introduction to Internal Family Systems",
    description: "Learn the foundational concepts of IFS therapy and how it can help you heal",
    category: "introduction",
    order: "1",
    estimatedMinutes: "15",
    content: {
      sections: [
        {
          title: "What is Internal Family Systems?",
          paragraphs: [
            "Internal Family Systems (IFS) is a transformative, evidence-based psychotherapy that helps people heal by accessing and understanding their protective and wounded inner parts.",
            "Developed by Dr. Richard Schwartz in the 1980s, IFS recognizes that our psyche is naturally made up of multiple sub-personalities or 'parts,' each with its own perspective, feelings, memories, and role in our internal system.",
            "At the center of this system is the Self - a calm, compassionate, and confident core that can heal our wounded parts when given space to lead."
          ]
        },
        {
          title: "The Three Types of Parts",
          paragraphs: [
            "In IFS, we recognize three main categories of parts that work together to protect us from emotional pain:"
          ],
          bulletPoints: [
            "Managers: Proactive protectors that control our behavior to prevent painful experiences",
            "Firefighters: Reactive protectors that respond when we feel overwhelmed with impulsive or distracting behaviors",
            "Exiles: Wounded parts (often from childhood) that carry trauma, shame, and painful emotions"
          ]
        },
        {
          title: "The Healing Power of Self",
          paragraphs: [
            "The Self is not a part - it's your core essence that naturally embodies the 8 C's: Calmness, Clarity, Curiosity, Compassion, Confidence, Courage, Creativity, and Connectedness.",
            "When you access Self-energy, you can compassionately connect with your parts, understand their concerns, and help them release their burdens. This is how healing happens in IFS."
          ]
        }
      ]
    }
  });

  await storage.createLessonActivity({
    lessonId: lesson1.id,
    title: "Identifying Your Parts",
    description: "Reflect on the different parts of yourself",
    type: "reflection",
    order: "1",
    content: {
      prompt: "Think about a recent situation where you felt conflicted or noticed different voices in your head. Can you identify which parts were present?",
      questions: [
        "What was the situation?",
        "What different perspectives or feelings did you notice?",
        "Can you name the parts that were present? (e.g., 'the worried part', 'the angry part')"
      ]
    }
  });

  // Lesson 2: Understanding Managers
  const lesson2 = await storage.createLesson({
    title: "Understanding Manager Parts",
    description: "Explore the proactive protectors that organize your life",
    category: "understanding_parts",
    order: "1",
    estimatedMinutes: "20",
    content: {
      sections: [
        {
          title: "What Are Manager Parts?",
          paragraphs: [
            "Manager parts are the proactive protectors in your internal system. They work tirelessly to prevent you from experiencing pain, shame, or vulnerability.",
            "These parts develop strategies early in life to keep you safe, acceptable, and in control. They might show up as perfectionism, people-pleasing, planning, controlling, or criticizing."
          ]
        },
        {
          title: "Common Manager Strategies",
          bulletPoints: [
            "Perfectionism: 'If I'm perfect, I won't be criticized or rejected'",
            "Planning and Controlling: 'If I control everything, nothing bad will happen'",
            "People-Pleasing: 'If I make everyone happy, I'll be safe and loved'",
            "Inner Critic: 'If I criticize myself first, others can't hurt me'",
            "Caretaking: 'If I focus on others, I don't have to feel my own pain'"
          ]
        },
        {
          title: "Why Managers Matter",
          paragraphs: [
            "Managers are not your enemies - they're trying to protect vulnerable parts of you from getting hurt again. When you approach them with curiosity and compassion, they can relax and let your Self lead.",
            "Understanding your managers is the first step toward healing because they often hold the key to accessing your exiled parts."
          ]
        }
      ]
    }
  });

  await storage.createLessonActivity({
    lessonId: lesson2.id,
    title: "Meeting Your Managers",
    description: "Identify and connect with your manager parts",
    type: "journaling",
    order: "1",
    content: {
      questions: [
        "What are some ways you try to stay in control or prevent bad things from happening?",
        "Can you identify one manager part? What does it do to protect you?",
        "What is this manager afraid would happen if it stopped its job?",
        "Can you express appreciation to this part for working so hard to protect you?"
      ]
    }
  });

  // Lesson 3: Recognizing Firefighters
  const lesson3 = await storage.createLesson({
    title: "Recognizing Firefighter Parts",
    description: "Understand the reactive protectors that emerge in crisis",
    category: "understanding_parts",
    order: "2",
    estimatedMinutes: "18",
    content: {
      sections: [
        {
          title: "What Are Firefighter Parts?",
          paragraphs: [
            "Firefighter parts are the emergency responders of your internal system. Unlike managers who try to prevent pain, firefighters react when you're already overwhelmed with distressing emotions.",
            "Their job is to extinguish the fire of painful feelings quickly, often through impulsive, extreme, or addictive behaviors. They don't care about long-term consequences - they just want the pain to stop NOW."
          ]
        },
        {
          title: "Common Firefighter Behaviors",
          bulletPoints: [
            "Substance use (alcohol, drugs, food)",
            "Dissociation or numbing out",
            "Compulsive behaviors (shopping, gaming, scrolling)",
            "Self-harm or risky behaviors",
            "Rage or explosive anger",
            "Sexual acting out",
            "Extreme withdrawal or isolation"
          ]
        },
        {
          title: "Understanding Without Judgment",
          paragraphs: [
            "It's easy to judge firefighter parts as 'bad' or destructive, but they're doing their best to protect you from unbearable pain. They learned these strategies when you needed immediate relief.",
            "When you approach firefighters with curiosity instead of shame, you can understand what pain they're trying to extinguish and find healthier ways to soothe your system."
          ]
        }
      ]
    }
  });

  await storage.createLessonActivity({
    lessonId: lesson3.id,
    title: "Understanding Your Firefighters",
    description: "Explore your reactive protective responses",
    type: "reflection",
    order: "1",
    content: {
      prompt: "Firefighters activate when we're overwhelmed. Think about how you cope when emotions feel too intense.",
      questions: [
        "What behaviors do you turn to when you're feeling overwhelmed? (No judgment - just notice)",
        "Can you identify a firefighter part? What does it do?",
        "What painful emotions or memories might this firefighter be protecting you from?",
        "What would this part need to feel safe enough to step back?"
      ]
    }
  });

  // Lesson 4: Self-Leadership
  const lesson4 = await storage.createLesson({
    title: "Cultivating Self-Leadership",
    description: "Learn to access your compassionate core and lead your internal system",
    category: "self_leadership",
    order: "1",
    estimatedMinutes: "25",
    content: {
      sections: [
        {
          title: "What is Self-Leadership?",
          paragraphs: [
            "Self-leadership means allowing your core Self to guide your internal system with compassion and wisdom, rather than being controlled by protective parts.",
            "When you're in Self, you naturally embody the 8 C's: Calmness, Clarity, Curiosity, Compassion, Confidence, Courage, Creativity, and Connectedness. This energy feels spacious, warm, and grounded."
          ]
        },
        {
          title: "The 8 C's of Self-Energy",
          bulletPoints: [
            "Calmness: A settled, peaceful presence even in difficult situations",
            "Clarity: Ability to see situations accurately without distortion",
            "Curiosity: Genuine interest in understanding yourself and others",
            "Compassion: Caring concern for yourself and others' suffering",
            "Confidence: Trust in your ability to handle what comes",
            "Courage: Willingness to face fears and take appropriate risks",
            "Creativity: Capacity for fresh perspectives and new solutions",
            "Connectedness: Sense of belonging and relationship with all beings"
          ]
        },
        {
          title: "How to Access Self",
          paragraphs: [
            "Accessing Self isn't about creating something new - it's about asking your parts to step back so your Self can emerge. This happens through curious, compassionate attention to your internal experience.",
            "When parts feel heard and understood, they naturally relax and make space for Self to lead. The key is noticing when you're blended with a part (feeling its emotions intensely) and gently asking it to give you some space."
          ]
        }
      ]
    }
  });

  await storage.createLessonActivity({
    lessonId: lesson4.id,
    title: "Practicing Self-Energy",
    description: "Experience what Self-leadership feels like",
    type: "exercise",
    order: "1",
    content: {
      prompt: "This exercise helps you recognize and strengthen your connection to Self.",
      questions: [
        "Think of a moment when you felt calm, clear, and compassionate. Describe what that felt like in your body.",
        "Can you identify which of the 8 C's you experienced in that moment?",
        "Now think of a current challenge. What would change if you could approach it from Self-energy?",
        "What gets in the way of accessing your Self? What parts activate and blend with you?"
      ]
    }
  });

  // Lesson 5: Connecting with Exiles
  const lesson5 = await storage.createLesson({
    title: "Connecting with Exiled Parts",
    description: "Safely approach the wounded parts that carry your pain",
    category: "unburdening",
    order: "1",
    estimatedMinutes: "22",
    content: {
      sections: [
        {
          title: "Understanding Exiled Parts",
          paragraphs: [
            "Exiles are the vulnerable, wounded parts of us - often young parts from childhood - that carry burdens of shame, fear, worthlessness, and trauma.",
            "Your protective parts (managers and firefighters) work overtime to keep these exiles locked away because their pain feels unbearable. But exiles need to be witnessed and healed, not hidden."
          ]
        },
        {
          title: "Why Exiles Get Locked Away",
          paragraphs: [
            "When painful things happen to us - especially in childhood - we don't have the capacity to process them. So we exile these vulnerable parts to a 'basement' in our psyche.",
            "Your managers and firefighters believe that if these exiles' pain comes up, you'll be overwhelmed and unable to function. So they work hard to keep the basement door locked. This is why healing requires getting permission from protectors first."
          ]
        },
        {
          title: "The Path to Healing",
          paragraphs: [
            "Healing happens when you, from Self, can witness your exiled parts' stories with compassion and help them release their burdens. This is called unburdening.",
            "But you can't force this process. You must first build trust with your protectors and ensure they feel safe letting you connect with exiles. When done properly, this is the most transformative aspect of IFS."
          ]
        }
      ]
    }
  });

  await storage.createLessonActivity({
    lessonId: lesson5.id,
    title: "Gentle Exploration of Exiles",
    description: "Begin to understand your exiled parts",
    type: "parts_work",
    order: "1",
    content: {
      prompt: "This is advanced work. Only proceed if you feel grounded and safe. Consider working with a therapist for deeper exile work.",
      questions: [
        "What painful emotions or memories do your protectors work hardest to keep away?",
        "Can you sense an exiled part? How old does it feel?",
        "What does this part need you to know about its experience?",
        "Are your protectors comfortable with you connecting to this exile? If not, what do they need first?"
      ]
    }
  });

  console.log("Successfully seeded 5 lessons with activities!");
  console.log(`Lesson IDs: ${lesson1.id}, ${lesson2.id}, ${lesson3.id}, ${lesson4.id}, ${lesson5.id}`);
}

seedLessons()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
