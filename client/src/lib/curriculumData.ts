/**
 * Comprehensive IFS Curriculum Data
 * Structured as: Learn → Activity → Result
 * Each module builds progressively toward mastery
 */

export interface CurriculumSection {
  id: string;
  title: string;
  content: string[];
  bullets?: string[];
  keyTakeaways?: string[];
}

export interface CurriculumActivity {
  id: string;
  title: string;
  description: string;
  type: "reflection" | "journaling" | "parts_work" | "exercise" | "meditation" | "protocol";
  prompt: string;
  questions: string[];
  guidedSteps?: string[];
}

export interface CurriculumResult {
  id: string;
  title: string;
  description: string;
  completionMessage: string;
  nextSteps: string[];
}

export interface CurriculumStep {
  type: "learn" | "activity" | "result";
  data: CurriculumSection | CurriculumActivity | CurriculumResult;
}

export interface CurriculumModule {
  id: string;
  order: number;
  title: string;
  description: string;
  category: "introduction" | "parts_system" | "self_leadership" | "protocols" | "unburdening" | "integration";
  estimatedMinutes: number;
  prerequisites?: string[];
  steps: CurriculumStep[];
}

export const curriculumModules: CurriculumModule[] = [
  {
    id: "module-1-intro-ifs",
    order: 1,
    title: "Module 1: Introduction to Internal Family Systems",
    description: "Discover the foundational concepts of IFS and how your internal system works",
    category: "introduction",
    estimatedMinutes: 25,
    steps: [
      {
        type: "learn",
        data: {
          id: "learn-what-is-ifs",
          title: "What is Internal Family Systems?",
          content: [
            "Internal Family Systems (IFS) is a transformative, evidence-based psychotherapy developed by Dr. Richard Schwartz in the 1980s. It offers a powerful lens for understanding our inner world and healing psychological wounds.",
            "The central insight of IFS is that our psyche is naturally made up of multiple sub-personalities or 'parts,' each with its own perspective, feelings, memories, and role in our internal system. This isn't a disorder—it's how we're all built.",
            "Think of your mind like a family or team where different members have different jobs, concerns, and ways of protecting you. Sometimes these parts work together harmoniously, and sometimes they conflict with each other.",
            "At the center of this internal family is the Self—your core essence that naturally embodies calmness, compassion, clarity, and confidence. The Self is not a part; it's who you truly are beneath all the protective layers.",
          ],
          keyTakeaways: [
            "Your mind has multiple parts, and this is completely normal",
            "Each part has a positive intention, even when its behavior seems problematic",
            "The Self is your compassionate core that can heal your parts",
            "IFS is about internal relationships—helping your parts work together"
          ]
        }
      },
      {
        type: "activity",
        data: {
          id: "activity-notice-parts",
          title: "Noticing Your Parts",
          description: "Begin to recognize the different voices and perspectives within you",
          type: "reflection",
          prompt: "Think about a recent situation where you felt conflicted or noticed different reactions inside yourself. Maybe one part of you wanted to do something, while another part had concerns. This is your first glimpse at your internal family.",
          questions: [
            "Describe the situation: What was happening externally?",
            "What different thoughts, feelings, or impulses did you notice?",
            "Can you identify at least two distinct 'voices' or perspectives? What did each one want?",
            "Did you notice any parts that seemed to be in conflict with each other?",
            "Looking back, can you sense which perspective felt more like your calm, core Self?"
          ]
        }
      },
      {
        type: "result",
        data: {
          id: "result-parts-awareness",
          title: "Parts Awareness Unlocked",
          description: "You've begun the journey of recognizing your internal system",
          completionMessage: "Congratulations! You've taken the crucial first step in IFS: recognizing that you have parts. This awareness is the foundation for all healing work. As you move forward, you'll develop deeper relationships with these parts and learn to lead them from Self.",
          nextSteps: [
            "Pay attention throughout your day when you notice different parts activating",
            "Practice curiosity rather than judgment when parts show up",
            "Remember: every part has a positive intention, even when its strategy seems problematic",
            "Get ready to learn about the three main types of parts: Managers, Firefighters, and Exiles"
          ]
        }
      }
    ]
  },
  {
    id: "module-2-understanding-parts",
    order: 2,
    title: "Module 2: The Three Types of Parts",
    description: "Learn about Managers, Firefighters, and Exiles—and how they work together to protect you",
    category: "parts_system",
    estimatedMinutes: 45,
    prerequisites: ["module-1-intro-ifs"],
    steps: [
      {
        type: "learn",
        data: {
          id: "learn-managers",
          title: "Understanding Manager Parts",
          content: [
            "Manager parts are the proactive protectors in your internal system. They work tirelessly, often from the moment you wake up, to prevent you from experiencing pain, shame, rejection, or vulnerability.",
            "Managers develop their strategies early in life based on what worked to keep you safe, loved, or acceptable. They might show up as perfectionism, people-pleasing, planning, controlling, analyzing, or criticizing.",
            "Common manager parts include: The Perfectionist ('If I'm flawless, no one can criticize me'), The Planner ('If I control everything, nothing bad will happen'), The Caretaker ('If I focus on others, I'm valuable'), The Critic ('If I judge myself first, others can't hurt me'), and The Achiever ('If I'm successful enough, I'll finally be enough').",
            "Managers aren't trying to make your life rigid or joyless—they're protecting vulnerable exiled parts from being hurt again. When you understand their protective mission, you can work with them rather than fighting against them."
          ],
          bullets: [
            "Work proactively to prevent pain before it happens",
            "Develop strategies like perfectionism, control, and people-pleasing",
            "Often start working early in the day and struggle to rest",
            "Protect you from feeling shame, rejection, or vulnerability",
            "Fear that if they stop their job, something terrible will happen"
          ],
          keyTakeaways: [
            "Managers are protective, not punitive—they're trying to keep you safe",
            "Their strategies made sense given what you experienced in the past",
            "They fear that exiled pain will overwhelm you if they relax",
            "Healing involves building trust with managers, not overpowering them"
          ]
        }
      },
      {
        type: "activity",
        data: {
          id: "activity-identify-managers",
          title: "Identifying Your Manager Parts",
          description: "Discover which manager parts are active in your system",
          type: "parts_work",
          prompt: "Take some time to notice the proactive protective strategies you use in daily life. These are your managers at work. Remember to approach them with curiosity and appreciation—they've been working hard to protect you.",
          questions: [
            "What are the main ways you try to stay in control or prevent bad things from happening? (Examples: planning ahead, being perfect, pleasing others, staying busy, analyzing everything)",
            "Can you identify one or two specific manager parts? Give them descriptive names (like 'The Perfectionist' or 'The Planner')",
            "For each manager: What is it trying to protect you from? What's the worst-case scenario it's preventing?",
            "How long has this manager been working for you? Can you remember when it first took on this job?",
            "What does this manager part need to hear from you? Can you express genuine appreciation for its efforts to protect you?"
          ]
        }
      },
      {
        type: "result",
        data: {
          id: "result-managers-identified",
          title: "Manager Parts Mapped",
          description: "You've identified the proactive protectors in your internal system",
          completionMessage: "Excellent work! You've begun to recognize and appreciate your manager parts. These parts have been carrying heavy burdens, working constantly to keep you safe. As you build relationship with them, they'll begin to trust that your Self can lead, and they can finally rest.",
          nextSteps: [
            "Notice when your managers activate during the day—what triggers them?",
            "Practice thanking them for their hard work rather than fighting their strategies",
            "Ask managers what they're afraid would happen if they took a break",
            "Get ready to learn about your firefighter parts—the emergency responders"
          ]
        }
      },
      {
        type: "learn",
        data: {
          id: "learn-firefighters",
          title: "Understanding Firefighter Parts",
          content: [
            "Firefighter parts are the emergency responders of your internal system. Unlike managers who try to prevent pain proactively, firefighters react when you're already overwhelmed with distressing emotions.",
            "Their sole mission is to extinguish the fire of painful feelings as quickly as possible. They don't care about consequences or your long-term wellbeing—they just need the pain to stop NOW. This is why their strategies often feel impulsive or extreme.",
            "Common firefighter strategies include: substance use (alcohol, drugs, food), dissociation or numbing out, compulsive behaviors (shopping, gaming, scrolling social media, pornography), self-harm, rage or explosive anger, risky behaviors, and extreme withdrawal or isolation.",
            "Firefighters get activated when managers can't prevent pain and exiled feelings start to surface. They're like emergency medical technicians rushing in to sedate the system. While their methods may be destructive, their intention is purely protective.",
            "It's crucial to understand that firefighters aren't 'bad parts'—they're desperate parts doing their best with the tools they have. Judging or shaming them only makes them work harder to numb the shame."
          ],
          bullets: [
            "Activate when you're already overwhelmed with painful emotions",
            "Use extreme or impulsive strategies to quickly extinguish emotional pain",
            "Don't consider long-term consequences—focused only on immediate relief",
            "Often develop during times when you had no other way to cope",
            "Work alongside managers, just with different timing and methods"
          ],
          keyTakeaways: [
            "Firefighters are emergency protectors, not self-destructive enemies",
            "Their extreme strategies make sense when you understand the pain they're managing",
            "They activate when managers can't prevent exiled pain from surfacing",
            "Healing involves understanding what pain they're extinguishing, not just stopping their behavior"
          ]
        }
      },
      {
        type: "activity",
        data: {
          id: "activity-identify-firefighters",
          title: "Recognizing Your Firefighter Parts",
          description: "Explore your reactive protective strategies with compassion",
          type: "reflection",
          prompt: "This exercise invites you to look at the ways you cope when emotions become overwhelming. Approach this with curiosity and compassion, not judgment. Firefighters are doing their best to help you survive intense pain.",
          questions: [
            "What behaviors or strategies do you turn to when you're feeling overwhelmed, anxious, or emotionally flooded? (No judgment—just notice)",
            "Can you identify one or two firefighter parts? Name them based on what they do (like 'The Numbing Part' or 'The Rage Part')",
            "What painful emotions or memories might these firefighters be protecting you from feeling?",
            "When did you first develop these coping strategies? What was happening in your life?",
            "If these firefighters could take a break, what would they need to trust that you'd be okay?"
          ]
        }
      },
      {
        type: "result",
        data: {
          id: "result-firefighters-identified",
          title: "Firefighter Parts Recognized",
          description: "You've identified your reactive protectors with compassion",
          completionMessage: "This is brave work. You've looked at your firefighter parts without judgment and begun to understand them as protectors rather than problems. These parts have been bearing an enormous burden, working to keep unbearable pain at bay. Your compassion toward them is the beginning of healing.",
          nextSteps: [
            "When firefighters activate, pause and ask: 'What are you trying to protect me from right now?'",
            "Thank them for their protection, even if their method is problematic",
            "Notice the pain or overwhelm that triggers firefighters—this points to exiled parts",
            "Prepare to learn about exiles—the wounded parts that both managers and firefighters protect"
          ]
        }
      },
      {
        type: "learn",
        data: {
          id: "learn-exiles",
          title: "Understanding Exiled Parts",
          content: [
            "Exiles are the vulnerable, wounded parts of us—often young child parts—that carry burdens of shame, terror, worthlessness, and trauma. They hold the pain that managers and firefighters work so hard to keep locked away.",
            "These parts become 'exiled' when painful experiences (especially in childhood) are too overwhelming to process. We lock them in a metaphorical basement of our psyche because their pain feels unbearable. Our protectors believe that if these exiles' pain surfaces, we'll be destroyed.",
            "Exiles carry beliefs like: 'I'm worthless,' 'I'm unlovable,' 'I'm not safe,' 'I'm too much,' 'I'm invisible,' 'It's all my fault.' These aren't true statements about you—they're burdens the exile took on during painful experiences.",
            "Exiles desperately want to be seen, heard, and healed. They try to get your attention by triggering managers and firefighters. This is why protectors work overtime—they're preventing exiles from flooding you with unbearable pain.",
            "The path to healing runs through your exiles. But you can't force access to them. You must first build trust with your protectors and ensure they feel safe allowing you to connect with exiled pain. This is delicate work best done with guidance."
          ],
          bullets: [
            "Young, vulnerable parts that carry trauma, shame, and painful memories",
            "Locked away in an internal 'basement' to prevent overwhelming pain",
            "Carry burdens like worthlessness, terror, and deep unworthiness",
            "Protected by both managers (prevention) and firefighters (reaction)",
            "Need to be witnessed and unburdened for true healing to occur"
          ],
          keyTakeaways: [
            "Exiles are wounded child parts carrying pain too overwhelming to process alone",
            "Protectors keep exiles locked away because they believe their pain will destroy you",
            "You can't heal by avoiding exiles—they must be witnessed with compassion",
            "Accessing exiles requires permission from protectors and should be done carefully"
          ]
        }
      },
      {
        type: "activity",
        data: {
          id: "activity-sense-exiles",
          title: "Sensing Your Exiled Parts (Gentle Exploration)",
          description: "Begin to understand the wounded parts your protectors guard",
          type: "parts_work",
          prompt: "This is sensitive work. Only proceed if you feel grounded and safe. You're not trying to dive into exile pain—you're simply sensing what your protectors are protecting. If at any point you feel overwhelmed, stop and focus on your breath. Consider working with an IFS therapist for deeper exile healing.",
          questions: [
            "What painful emotions or memories do your manager and firefighter parts work hardest to keep away?",
            "Can you sense an exiled part? How old does this part feel?",
            "What does this exile need you to know? What's its core pain or fear?",
            "Are your protectors (managers and firefighters) comfortable with you even sensing this exile? If not, what do they need from you first?",
            "Can you send compassion to this exiled part from your Self, even if you can't fully connect with it yet?"
          ]
        }
      },
      {
        type: "result",
        data: {
          id: "result-complete-parts-map",
          title: "Complete Parts Map Created",
          description: "You now understand all three types of parts in your internal system",
          completionMessage: "This is profound work! You now have a complete map of your internal system: your proactive managers, your reactive firefighters, and the vulnerable exiles they both protect. This understanding is the foundation for all IFS healing. You're learning to see your parts as a system working together, each with important protective roles.",
          nextSteps: [
            "Review your complete parts map: managers, firefighters, and exiles",
            "Notice how your protectors react when exiles get triggered",
            "Practice accessing Self-energy to lead your internal system with compassion",
            "Prepare to learn about the 8 C's of Self-leadership in the next module"
          ]
        }
      }
    ]
  },
  {
    id: "module-3-self-leadership",
    order: 3,
    title: "Module 3: Cultivating Self-Leadership",
    description: "Learn to access your compassionate core and lead your internal system from Self",
    category: "self_leadership",
    estimatedMinutes: 35,
    prerequisites: ["module-2-understanding-parts"],
    steps: [
      {
        type: "learn",
        data: {
          id: "learn-self-energy",
          title: "The 8 C's of Self-Energy",
          content: [
            "The Self is your core essence—the 'you' beneath all the protective parts. It's not something you need to create or develop; it's already there, waiting to emerge when your parts step back.",
            "When you're in Self, you naturally embody what Dr. Schwartz calls the '8 C's': Calmness, Clarity, Curiosity, Compassion, Confidence, Courage, Creativity, and Connectedness. These aren't skills to learn—they're qualities that spontaneously arise from Self.",
            "Calmness: A settled, peaceful presence even in difficult moments. Your nervous system relaxes, and you feel grounded. Clarity: You see situations accurately without distortion from parts. The fog lifts and you can think clearly.",
            "Curiosity: Genuine interest in understanding yourself and others without agenda. You want to know, not to judge. Compassion: A natural caring for your own and others' suffering. Your heart is open and tender.",
            "Confidence: Trust in your ability to handle whatever comes. Not arrogance, but a quiet certainty in your capacity. Courage: Willingness to face fears and take appropriate risks, even when parts are scared.",
            "Creativity: Capacity for fresh perspectives and new solutions. You're not stuck in rigid patterns. Connectedness: A sense of being part of something larger, feeling your relationship to all beings.",
            "When parts are activated, these qualities disappear. When parts step back and give you space, the 8 C's naturally emerge. This is how you know you're in Self: you feel calm, clear, curious, and compassionate."
          ],
          keyTakeaways: [
            "The Self is your core essence that naturally leads with the 8 C's",
            "You don't create Self—you clear space for it by asking parts to step back",
            "When in Self, you feel calm, clear, curious, compassionate, confident, courageous, creative, and connected",
            "The goal of IFS is Self-leadership: letting your Self guide your parts with wisdom"
          ]
        }
      },
      {
        type: "activity",
        data: {
          id: "activity-access-self",
          title: "Accessing Self-Energy",
          description: "Experience what it feels like to be in Self and practice asking parts to step back",
          type: "meditation",
          prompt: "This guided practice will help you recognize and access Self-energy. Find a comfortable position where you won't be disturbed. Take a few deep breaths and settle into this present moment.",
          questions: [
            "Think of a time when you felt calm, clear, and compassionate—maybe in nature, with a loved one, or helping someone. Describe what that felt like in your body.",
            "Which of the 8 C's were most present in that moment? (Calmness, Clarity, Curiosity, Compassion, Confidence, Courage, Creativity, Connectedness)",
            "Now think of a current challenge or concern. Notice what parts activate when you focus on it. What do you feel in your body?",
            "Gently ask those parts: 'Would you be willing to step back a little and give me some space?' What happens when you ask?",
            "If parts step back, what do you notice? Do any of the 8 C's emerge? This is your Self."
          ],
          guidedSteps: [
            "Take three slow, deep breaths and bring your attention to your body",
            "Notice any parts that are activated right now—worry, planning, judging, protecting",
            "Gently acknowledge each part: 'I see you. Thank you for trying to help.'",
            "Ask each part: 'Would you be willing to give me a little space right now?'",
            "Notice what happens in your body and mind as parts step back",
            "Feel for the qualities of Self emerging: calm, clear, curious, compassionate",
            "Rest in this Self-energy for a few moments, noticing how it feels different from parts"
          ]
        }
      },
      {
        type: "result",
        data: {
          id: "result-self-access",
          title: "Self-Energy Accessed",
          description: "You've experienced what it feels like to lead from your compassionate core",
          completionMessage: "Beautiful! You've tasted what it's like to be in Self—that spacious, compassionate presence beneath your parts. This is who you truly are. The more you practice accessing Self, the easier it becomes to lead your internal system from this wise, loving place. Your parts will learn they can trust your Self to take care of everyone.",
          nextSteps: [
            "Practice noticing throughout your day: 'Am I in Self or blended with a part?'",
            "When you notice you're blended, gently ask the part to step back",
            "Build a daily practice of accessing Self, even for just a few minutes",
            "Get ready to learn the practical protocols for working with your parts from Self"
          ]
        }
      }
    ]
  },
  {
    id: "module-4-six-fs-protocol",
    order: 4,
    title: "Module 4: The 6 F's Protocol",
    description: "Master the step-by-step process for working with protector parts",
    category: "protocols",
    estimatedMinutes: 40,
    prerequisites: ["module-3-self-leadership"],
    steps: [
      {
        type: "learn",
        data: {
          id: "learn-six-fs",
          title: "The Six F's Protocol for Protectors",
          content: [
            "The 6 F's is the core protocol in IFS for working with protector parts (managers and firefighters). It provides a roadmap for building relationship with parts and helping them transform their roles.",
            "The six steps are: Find, Focus, Flesh out, Feel toward, beFriend, and Fears. Each 'F' represents a stage in deepening your relationship with a part.",
            "Find: Locate the part in or around your body. Where do you notice it? What sensations accompany it? Focus: Bring your attention fully to the part. How does it want you to see it—an image, color, shape, age?",
            "Flesh out: Get to know the part's role and history. What does it do for you? When did it take on this job? What does it want you to know? Feel toward: Notice how you feel toward the part. If you feel anything other than curiosity or compassion, there's another part (often a critic) blended with you. Ask that part to step back.",
            "beFriend: Once you're in Self, build a genuine relationship. Express appreciation for the part's hard work. Let it know you see how much it's been carrying. Ask what it needs from you. Fears: Ask what the part is afraid would happen if it stopped its protective job. This reveals what exile it's protecting and what needs to happen for it to relax.",
            "The 6 F's isn't a rigid procedure—it's a conversation guided by curiosity and compassion. You might move back and forth between steps. The key is staying in Self and following the part's lead."
          ],
          bullets: [
            "Find: Locate where you sense the part in/around your body",
            "Focus: Give it your full attention and notice how it appears to you",
            "Flesh out: Learn about its role, history, and what it wants you to know",
            "Feel toward: Check that you're in Self (curious/compassionate) toward the part",
            "beFriend: Build genuine relationship through appreciation and understanding",
            "Fears: Discover what it's afraid would happen if it stopped protecting"
          ],
          keyTakeaways: [
            "The 6 F's guides you through building relationship with protector parts",
            "Each step deepens your connection and understanding of the part",
            "You must be in Self (not blended with another part) to do this work",
            "The protocol reveals what the protector is afraid of and what it's protecting"
          ]
        }
      },
      {
        type: "activity",
        data: {
          id: "activity-practice-six-fs",
          title: "Practice the 6 F's with a Protector Part",
          description: "Work through all six steps with a manager or firefighter part",
          type: "protocol",
          prompt: "Choose a protector part you'd like to get to know better—preferably one that's not too intense or scary. This could be a manager (like a perfectionist or people-pleaser) or a firefighter (like a numbing or distracting part). Work through each step slowly, with curiosity.",
          questions: [
            "FIND: Where do you notice this part in or around your body? What sensations come with it?",
            "FOCUS: How does this part want you to see it? An image, color, shape, texture, age? Describe what you notice.",
            "FLESH OUT: What is this part's job or role? When did it start doing this job? What does it want you to understand about what it does?",
            "FEEL TOWARD: How do you feel toward this part right now? (If anything other than curious/compassionate, ask that judging part to step back first)",
            "beFRIEND: Express genuine appreciation to this part for how hard it's been working. What does it need to hear from you? What does it need from you going forward?",
            "FEARS: What is this part afraid would happen if it stopped its protective job? What pain or exile is it protecting you from?"
          ],
          guidedSteps: [
            "Get grounded in your body with a few deep breaths",
            "Invite a protector part that you want to get to know",
            "Find where you sense it in your body or energy field",
            "Focus your attention on it and notice how it appears",
            "Ask it about its role and history—listen with curiosity",
            "Check your feelings toward it—ensure you're in Self",
            "Thank it for its protection and build genuine relationship",
            "Gently ask what it's afraid would happen if it relaxed"
          ]
        }
      },
      {
        type: "result",
        data: {
          id: "result-six-fs-complete",
          title: "6 F's Protocol Mastered",
          description: "You've worked through the complete protocol with a protector part",
          completionMessage: "Excellent work! You've just practiced the fundamental protocol of IFS. By working through all six F's, you've deepened your relationship with a protector part and learned what it's been protecting you from. This is how transformation happens—through relationship, not force. Keep practicing this protocol with different parts.",
          nextSteps: [
            "Practice the 6 F's with other protector parts as they arise",
            "Notice how parts begin to trust your Self as you show consistent curiosity and care",
            "Remember: the goal isn't to make parts disappear, but to help them transform their roles",
            "Prepare to learn about unburdening—the deep healing work with exiled parts"
          ]
        }
      }
    ]
  },
  {
    id: "module-5-unburdening",
    order: 5,
    title: "Module 5: Unburdening Exiled Parts",
    description: "Learn the sacred process of healing wounded parts and releasing their burdens",
    category: "unburdening",
    estimatedMinutes: 50,
    prerequisites: ["module-4-six-fs-protocol"],
    steps: [
      {
        type: "learn",
        data: {
          id: "learn-unburdening",
          title: "The Unburdening Process",
          content: [
            "Unburdening is the core healing process in IFS. It's how exiled parts release the burdens of shame, worthlessness, terror, and trauma they've been carrying—often for decades.",
            "Burdens are not who the part truly is. They're toxic beliefs and emotions the part took on during overwhelming experiences: 'I'm worthless,' 'I'm unlovable,' 'It's all my fault,' 'I'm too much,' 'I'm invisible.' These are lies the part absorbed, not truth.",
            "When an exile is witnessed with compassion by your Self, and feels truly seen and understood, it becomes ready to release these burdens. This isn't about talking the part out of its beliefs—it's about providing the healing experience it never received.",
            "The unburdening process involves: 1) Accessing the exile with permission from protectors, 2) Witnessing the exile's story with compassion, 3) Retrieving the exile from the past situation, 4) Asking what it wants to release, 5) Choosing how to release the burden (light, water, earth, wind, fire), 6) Inviting in positive qualities to replace the burden.",
            "This is sacred, powerful work that should be done carefully. You need strong Self-leadership, permission from all protectors, and ideally the guidance of an IFS therapist. Forcing access to exiles without preparation can retraumatize.",
            "When done properly, unburdening creates profound transformation. The exile feels loved and safe for the first time. Protectors can finally relax their extreme jobs. Your whole system reorganizes around Self-leadership."
          ],
          keyTakeaways: [
            "Unburdening helps exiles release toxic beliefs and emotions they absorbed",
            "Burdens are not the part's true nature—they're what the part took on during trauma",
            "The process requires permission from protectors and strong Self-leadership",
            "Unburdening creates system-wide transformation, not just individual part healing"
          ]
        }
      },
      {
        type: "activity",
        data: {
          id: "activity-prepare-unburdening",
          title: "Preparing for Unburdening Work",
          description: "Assess readiness and get permission from protectors for exile healing",
          type: "parts_work",
          prompt: "Unburdening is advanced work. Before proceeding, you need to ensure you have sufficient Self-leadership and full permission from your protective system. This activity helps you assess readiness. Please note: actual unburdening should ideally be done with a trained IFS therapist.",
          questions: [
            "Can you reliably access Self-energy? When parts activate, can you ask them to step back and feel the 8 C's emerge?",
            "Think of an exile you sense carrying pain. Ask your manager parts: 'Are you comfortable with me connecting with this exile?' What do they say?",
            "Ask your firefighter parts the same question: 'Are you okay with me approaching this wounded part?' What's their response?",
            "If any protectors have concerns, what do they need from you first? What assurances or commitments would help them feel safe?",
            "On a scale of 1-10, how much do you trust your Self to take care of this exile and not get overwhelmed? (If below 7, build more Self-access first)",
            "Do you have support available (therapist, safe relationship) if this work brings up intense emotions?"
          ]
        }
      },
      {
        type: "result",
        data: {
          id: "result-unburdening-ready",
          title: "Unburdening Readiness Assessed",
          description: "You understand what's needed for safe, effective exile healing",
          completionMessage: "You've assessed your readiness for unburdening work. Whether or not you're ready to proceed right now, you understand that healing exiles requires preparation, permission, and care. This is the most transformative work in IFS—and it's worth doing properly. Continue building Self-access and trust with your protectors, and consider working with an IFS therapist for guided unburdening sessions.",
          nextSteps: [
            "Continue practicing the 6 F's to build relationship with protectors",
            "Strengthen your Self-leadership through daily practice and meditation",
            "Consider finding an IFS-trained therapist for guided unburdening work",
            "Remember: all healing happens in relationship—your Self's relationship with your parts"
          ]
        }
      }
    ]
  }
];

/**
 * Get a specific module by ID
 */
export function getModuleById(id: string): CurriculumModule | undefined {
  return curriculumModules.find(m => m.id === id);
}

/**
 * Get modules by category
 */
export function getModulesByCategory(category: CurriculumModule['category']): CurriculumModule[] {
  return curriculumModules.filter(m => m.category === category);
}

/**
 * Check if prerequisites are met for a module
 */
export function checkPrerequisites(moduleId: string, completedModuleIds: string[]): boolean {
  const module = getModuleById(moduleId);
  if (!module || !module.prerequisites) return true;
  
  return module.prerequisites.every(prereqId => completedModuleIds.includes(prereqId));
}

/**
 * Get the next recommended module based on completion
 */
export function getNextModule(completedModuleIds: string[]): CurriculumModule | undefined {
  return curriculumModules.find(module => 
    !completedModuleIds.includes(module.id) && 
    checkPrerequisites(module.id, completedModuleIds)
  );
}
