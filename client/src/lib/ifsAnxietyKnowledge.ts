/**
 * Comprehensive IFS + Anxiety Educational Content
 * This library provides in-depth education about understanding and working with anxiety through the IFS lens
 */

export interface AnxietySection {
  title: string;
  description: string;
  content: Array<{
    heading: string;
    text: string;
    examples?: string[];
    practices?: string[];
  }>;
}

export const ifsAnxietyKnowledge: Record<string, AnxietySection> = {
  understanding: {
    title: "Understanding Anxiety Through the IFS Lens",
    description: "Anxiety is not a disorder to be eliminated, but a protective system of parts trying to keep you safe. Understanding anxiety through IFS transforms it from an enemy to be fought into a messenger to be heard.",
    content: [
      {
        heading: "What IFS Teaches Us About Anxiety",
        text: "In Internal Family Systems, anxiety is never 'just anxiety.' It's always the voice of protective parts working overtime to keep you safe from perceived threats. These parts developed their anxious strategies in childhood when you genuinely needed protection. Today, they continue using the same strategies even when the original threat is long gone.",
        examples: [
          "The Manager part that creates constant worry isn't trying to torture you - it's trying to prevent bad things from happening by thinking through every possibility",
          "The Firefighter part that triggers panic attacks isn't broken - it's desperately trying to escape situations that remind your system of past overwhelm",
          "The Exile part holding childhood fear isn't weak - it's frozen in time, still experiencing the terror it felt when you were small and powerless"
        ]
      },
      {
        heading: "The Three-Part Anxiety System",
        text: "Anxiety typically involves all three categories of parts working together in a painful dance. Managers create background worry and hypervigilance. When that fails to prevent triggering situations, Firefighters create panic or avoidance. Both are protecting Exiles who carry the original fear and vulnerability from childhood.",
        examples: [
          "Sarah's social anxiety: Manager parts create anticipatory worry before events ('What if I say something stupid?'). Firefighter parts trigger stomach pain to escape the event. Exile parts carry memories of childhood humiliation and the belief 'I'm not good enough.'",
          "Marcus's work anxiety: Manager parts create perfectionism and overwork ('If I'm perfect, I'll be safe'). Firefighter parts create procrastination when perfection feels impossible. Exile parts hold fear of being seen as incompetent like he was criticized in childhood.",
          "Lisa's health anxiety: Manager parts create constant body scanning and symptom checking. Firefighter parts trigger intense fear spirals at any physical sensation. Exile parts carry terror from watching a parent become seriously ill when she was young."
        ]
      },
      {
        heading: "Why Traditional Anxiety Treatment Sometimes Fails",
        text: "Approaches that try to 'eliminate' or 'overcome' anxiety often fail because they're fighting against parts that are trying to protect you. When you try to force anxious parts to stop, they escalate - because from their perspective, you're trying to fire your security team while danger still exists. IFS takes a different approach: we get curious about what these parts are protecting you from, and we help them see that Self can handle threats now.",
        examples: [
          "Telling yourself 'stop worrying' makes the worrier part try harder, not softer",
          "Forcing yourself into feared situations before parts trust you can backfire, creating more anxiety",
          "Medication without understanding the parts' concerns often leads to parts finding new anxiety symptoms"
        ]
      },
      {
        heading: "The Role of Self-Energy in Anxiety",
        text: "Self-energy - characterized by the 8 C's (Calm, Curiosity, Clarity, Compassion, Confidence, Courage, Creativity, Connectedness) - is the natural antidote to anxiety. When you're in Self, you can hold space for anxious parts without being overwhelmed by them. Self doesn't eliminate the parts or their concerns; it provides a calm, capable presence that can actually address what they're worried about.",
        examples: [
          "Instead of being blended with the panic (feeling 'I AM anxious'), Self can notice 'A part of me is feeling anxious right now'",
          "Self can ask anxious parts: 'What are you afraid will happen if you relax? What are you trying to protect me from?'",
          "Self can reassure parts: 'I appreciate your protection. I can handle this situation. You don't have to carry this burden alone anymore.'"
        ]
      }
    ]
  },

  partsAndAnxiety: {
    title: "How Each Part Type Creates Anxiety",
    description: "Managers, Firefighters, and Exiles each contribute to anxiety in distinct ways. Understanding their unique roles helps you work with your anxiety system compassionately and effectively.",
    content: [
      {
        heading: "Manager Parts: The Chronic Worriers",
        text: "Manager parts create anxiety as a proactive strategy. Their logic: 'If I worry about everything that could go wrong, I can prevent bad things from happening.' They believe constant vigilance equals safety. Common Manager-driven anxiety includes generalized worry, anticipatory anxiety, perfectionism-driven stress, overthinking, hypervigilance, and constant planning for worst-case scenarios.",
        examples: [
          "The Planner: Creates to-do lists at 3 AM to prevent forgetting anything important, believes rest equals irresponsibility",
          "The Perfectionist: Generates anxiety about making mistakes, believes 'If I'm perfect, I'll be safe from criticism'",
          "The Scanner: Constantly monitors environment and other people for signs of threat or disapproval",
          "The Analyzer: Replays conversations endlessly looking for mistakes, creates 'what if' catastrophic scenarios",
          "The Controller: Creates anxiety about anything uncertain or outside your control"
        ],
        practices: [
          "Notice when you're blended with a Manager part: 'A part of me is worrying' vs 'I am worried'",
          "Ask the worrier: 'What are you afraid will happen if you stop worrying?'",
          "Thank the Manager for trying to protect you, then offer: 'I can be alert without you having to be anxious'",
          "Help Managers see that their worry hasn't actually prevented bad things - it's just made life exhausting"
        ]
      },
      {
        heading: "Firefighter Parts: The Panic Responders",
        text: "Firefighter parts create intense, urgent anxiety when they detect imminent danger - or when Exiles are about to be triggered. They're the emergency response team, creating symptoms designed to GET YOU OUT NOW. Common Firefighter-driven anxiety includes panic attacks, phobias, escape urges, avoidance behaviors, physical anxiety symptoms (racing heart, shortness of breath), and intense 'fight or flight' sensations.",
        examples: [
          "The Escape Artist: Triggers panic symptoms in situations that remind the system of past entrapment or overwhelm",
          "The Avoider: Creates such intense anticipatory anxiety that you cancel plans, call in sick, or stay home",
          "The Physical Alarm: Triggers chest pain, dizziness, or GI symptoms to force you to leave threatening situations",
          "The Dissociator: Creates numbness, derealization, or fog when emotions threaten to overwhelm",
          "The Distractor: Triggers obsessive thoughts or compulsive behaviors to keep you from feeling underlying fear"
        ],
        practices: [
          "In the middle of panic, try to notice: 'This is a Firefighter part trying to protect me' (creates small separation)",
          "Ask yourself: 'What might this Firefighter be protecting me from right now?'",
          "Ground in Self-energy through breath, body sensations, or grounding techniques before trying to understand the part",
          "After the crisis, get curious: 'What does this part think will happen if I stay in the situation?'"
        ]
      },
      {
        heading: "Exile Parts: The Source of the Fear",
        text: "Exile parts are the youngest, most vulnerable parts who actually hold the original fear and pain that Managers and Firefighters are protecting you from. They're often frozen in traumatic childhood moments, still experiencing the terror, helplessness, or overwhelm they felt then. Exiles don't create anxiety as a strategy - they ARE the anxiety, the raw fear that protective parts are trying to keep buried.",
        examples: [
          "The Abandoned Child: Holds terror of being left alone, creates separation anxiety in adult relationships",
          "The Humiliated One: Carries shame from childhood criticism or ridicule, fuels social anxiety",
          "The Overwhelmed Child: Holds memories of feeling powerless and out of control, triggers panic in similar situations",
          "The Unwanted One: Believes 'I'm not good enough,' creates anxiety about being judged or rejected",
          "The Unsafe One: Carries experience of actual danger, creates hypervigilance and constant threat detection"
        ],
        practices: [
          "Exiles often need witnessing more than solving - they need Self to see and validate their experience",
          "Ask Exiles: 'How old are you? What happened to you? What do you need me to know?'",
          "Reassure Exiles: 'What happened was real, and it makes sense you felt that way. But you're not alone anymore.'",
          "Help Exiles update: 'You're not still there. You're here with me now. I can keep you safe.'"
        ]
      },
      {
        heading: "The Anxiety Cascade: How Parts Trigger Each Other",
        text: "Anxiety often escalates through a chain reaction of parts. An Exile gets close to the surface (triggered by a current situation similar to past pain). Managers panic and create worry to push the Exile back down. If that fails, Firefighters create intense symptoms to distract or escape. Understanding this cascade helps you interrupt it at any point.",
        examples: [
          "Trigger: Boss criticizes your work → Exile feels 'I'm not good enough' (childhood wound) → Manager creates perfectionist anxiety → Firefighter triggers procrastination to avoid feeling inadequate → More Manager worry about deadline → Firefighter creates panic attack",
          "Trigger: Partner seems distant → Exile fears abandonment → Manager creates anxious overthinking ('What did I do wrong?') → Firefighter creates anger or withdrawal to protect from rejection → Exile feels more abandoned → Spiral continues",
          "Trigger: Uncertainty about future → Exile feels out of control (like in chaotic childhood) → Manager creates compulsive planning and control behaviors → Life brings more uncertainty → Firefighter creates health anxiety to create sense of control → Cycle deepens"
        ]
      }
    ]
  },

  woundsToAnxiety: {
    title: "From Childhood Wounds to Adult Anxiety",
    description: "Each of the five core childhood wounds creates specific anxiety patterns that persist into adulthood. Understanding your wound-to-anxiety pathway is essential for healing the root cause rather than just managing symptoms.",
    content: [
      {
        heading: "Abandonment Wound → Separation & Relationship Anxiety",
        text: "If you experienced abandonment (physical or emotional) in childhood, parts of you remain terrified of being left alone. This creates profound anxiety in relationships and situations where you might be separated from attachment figures.",
        examples: [
          "Panic when partner doesn't text back quickly: Exile believes 'If they leave, I'll die' (true when you were a helpless child)",
          "Can't be alone without intense anxiety: Parts remember when being alone meant genuine danger or terror",
          "Constantly seeking reassurance in relationships: Manager tries to prevent abandonment by controlling others' feelings",
          "Anxiety about friends making other plans: Exile interprets normal independence as rejection",
          "Difficulty with business travel or being away from home: Separation triggers the original abandonment terror"
        ],
        practices: [
          "Help the abandoned Exile know: 'You're not a helpless child anymore. Adult me can be alone and be okay.'",
          "Work with Manager parts: 'Controlling others won't prevent them from leaving. That's not how safety actually works.'",
          "Practice being alone in small doses while staying connected to Self-energy",
          "Unburden the belief: 'Being alone means I'm unlovable' → 'I am whole whether alone or connected'"
        ]
      },
      {
        heading: "Rejection Wound → Social & Performance Anxiety",
        text: "Rejection wounds create parts who are terrified of being seen as defective, inadequate, or 'not good enough.' This manifests as intense anxiety in social situations and any context where you might be evaluated or judged.",
        examples: [
          "Panic before presentations or public speaking: Exile holds memory of being humiliated or criticized publicly",
          "Avoiding social gatherings: Firefighter protects from potential rejection by keeping you isolated",
          "Overthinking every conversation: Manager tries to be 'perfect' to avoid rejection",
          "Anxiety about posting on social media: Fear of being judged, criticized, or ignored",
          "Imposter syndrome at work: Constant fear of being 'found out' as inadequate",
          "Difficulty making phone calls or sending emails: Every interaction feels like a test you might fail"
        ],
        practices: [
          "Identify the rejected Exile: 'Who rejected you? How old were you? What did they make you believe about yourself?'",
          "Challenge the belief: 'One person's rejection doesn't define my worth' vs. childhood belief 'If they reject me, I am defective'",
          "Help Manager parts see that trying to be perfect doesn't actually prevent rejection - it prevents authentic connection",
          "Practice small acts of visibility while grounded in Self (not blended with the terrified Exile)"
        ]
      },
      {
        heading: "Betrayal Wound → Trust & Control Anxiety",
        text: "Betrayal wounds create parts convinced that others will hurt you, lie to you, or let you down. This creates anxiety about trusting others and intense need for control. The underlying belief: 'I can only count on myself. If I don't control everything, I'll be betrayed again.'",
        examples: [
          "Anxiety in any situation outside your control: Exile remembers when trusted adults failed or harmed you",
          "Hypervigilance about others' motives: Manager tries to detect betrayal before it happens",
          "Difficulty delegating or accepting help: 'If I let others help, they'll mess it up or use it against me'",
          "Relationship anxiety about infidelity: Even with faithful partner, parts remain on high alert",
          "Intense anxiety about vulnerability: Opening up feels dangerous because it did lead to betrayal in the past",
          "Control-based anxiety: Creates rigid rules and structure to feel safe"
        ],
        practices: [
          "Witness the betrayed Exile: 'Someone you trusted hurt you. That was real, and it makes sense you're scared.'",
          "Help parts distinguish: 'That person betrayed me' vs. 'All people will betray me'",
          "Work with controlling Managers: 'Control creates an illusion of safety but prevents real connection'",
          "Practice tiny risks of trust while Self remains present (not blended with the terrified Exile)"
        ]
      },
      {
        heading: "Injustice Wound → Anger-Anxiety & Rigidity",
        text: "Injustice wounds create parts who are hypervigilant about fairness, rules, and being taken advantage of. This often manifests as anxiety mixed with anger - a tense, rigid state of waiting for the next injustice. Parts believe: 'If I'm not constantly on guard, I'll be mistreated again.'",
        examples: [
          "Intense anxiety about being treated unfairly at work: Exile holds memories of childhood unfairness",
          "Difficulty relaxing unless everything is 'right': Manager creates rigid rules about how things 'should' be",
          "Anxiety when others break rules or social norms: Triggers the sense of injustice",
          "Fear of being taken advantage of: Hypervigilant about others' motivations",
          "Anxiety about confrontation: Torn between fear of conflict and need for justice",
          "Perfectionism mixed with resentment: 'I have to work harder than everyone else' (like in childhood)"
        ],
        practices: [
          "Help the unjustly treated Exile feel heard: 'What happened to you wasn't fair. You deserved better.'",
          "Work with rigid Manager parts: 'The world won't always be fair, but that doesn't mean you're in danger'",
          "Separate past injustice from present situations: 'This is frustrating, but it's not the same as what happened then'",
          "Unburden the belief: 'Injustice means I'm powerless' → 'I can advocate for myself from Self-energy'"
        ]
      },
      {
        heading: "Neglect Wound → Hyperindependence & Dismissive Anxiety",
        text: "Neglect wounds create parts who learned 'my needs don't matter' and 'I can only count on myself.' This creates a specific pattern: anxiety about needing anything from others, combined with dismissiveness of your own needs. Parts believe: 'If I need help, I'll be disappointed or hurt.'",
        examples: [
          "Anxiety about asking for help: Exile remembers that expressing needs led to disappointment or criticism",
          "Panic when sick or injured: Being vulnerable triggers the terror of being neglected when you needed care",
          "Difficulty receiving support even when offered: Firefighter parts create barriers to connection",
          "Anxiety about 'being a burden': Manager tries to prevent rejection by never needing anything",
          "Overwork and burnout anxiety: Doing everything yourself because trusting others feels dangerous",
          "Dismissive of your own feelings: 'I shouldn't feel this way' creates secondary anxiety about having anxiety"
        ],
        practices: [
          "Witness the neglected Exile: 'You needed care and didn't get it. Your needs were real and valid.'",
          "Challenge the belief: 'Needing others makes me weak' → 'Humans are meant to be interdependent'",
          "Work with hyperindependent Managers: 'Doing everything alone isn't strength - it's protection from old pain'",
          "Practice asking for small things while Self holds the scared Exile: 'It's safe to need others now'"
        ]
      }
    ]
  },

  selfEnergyPractices: {
    title: "Self-Energy Practices for Anxiety Management",
    description: "Self-energy - your core essence characterized by the 8 C's - is the most powerful resource for working with anxiety. These practices help you access and strengthen Self so you can help anxious parts.",
    content: [
      {
        heading: "The Foundation: Separating from Parts",
        text: "You can't help anxious parts while blended with them. The first practice is creating separation - noticing that you HAVE anxiety rather than you ARE anxious. This tiny shift creates space for Self to emerge.",
        practices: [
          "Language shift: 'A part of me is anxious' instead of 'I am anxious'",
          "Physical separation: Notice where anxiety lives in your body, then shift attention to a non-anxious part of your body",
          "Temporal separation: 'This part is activated right now' (vs. 'This is how I always am')",
          "Identity separation: 'This anxious part is not all of me. There's more to me than this feeling.'",
          "Visual separation: Picture the anxious part as separate from you - maybe sitting across from you, or as a younger version of you"
        ]
      },
      {
        heading: "Accessing the 8 C's of Self-Energy",
        text: "When you're in Self-energy, anxiety naturally softens because parts feel the presence of a calm, capable leader. Here's how to access each quality of Self when working with anxiety:",
        practices: [
          "CALM: Take three deep breaths. Notice your feet on the floor. Calm doesn't mean parts aren't anxious; it means Self isn't blended with their anxiety.",
          "CURIOSITY: Instead of fighting anxiety, get curious: 'What is this part afraid of?' 'What is it trying to protect me from?' 'When did it first start feeling this way?'",
          "CLARITY: Ask anxious parts to give you some space so you can see the situation clearly. Clarity emerges when you're not blended.",
          "COMPASSION: Recognize that anxious parts are working so hard to protect you. Thank them. Feel compassion for their struggle.",
          "CONFIDENCE: Self knows how to handle life. Remind parts: 'I can handle this. You don't have to protect me this way anymore.'",
          "COURAGE: Self can be present with difficult feelings. Face the anxiety while holding the part with compassion: 'I'm here with you. We can feel this together.'",
          "CREATIVITY: Self finds new solutions. Ask: 'What's a different way to get safety besides anxiety?' Let creative answers emerge.",
          "CONNECTEDNESS: Self can reach out for help without shame. Connect with the part, with your body, with support, with something larger than yourself."
        ]
      },
      {
        heading: "The Self-to-Parts Conversation for Anxiety",
        text: "Once in Self-energy, you can have a healing conversation with anxious parts. This IFS practice transforms anxiety from enemy to ally.",
        practices: [
          "Step 1 - Notice and Name: 'I notice a part of me is feeling anxious right now.'",
          "Step 2 - Find It: 'Where do I feel this in my body?' (chest, stomach, throat, shoulders, etc.)",
          "Step 3 - Get Curious: 'What is this part afraid will happen?' Wait for answers - words, images, feelings, memories.",
          "Step 4 - Appreciate: 'Thank you for trying to protect me. I know you're working hard.'",
          "Step 5 - Inquire Deeper: 'What are you protecting me from?' Often anxiety protects from deeper pain or vulnerability.",
          "Step 6 - Offer Leadership: 'I (Self) can handle this situation. Would you be willing to relax a little and let me lead?'",
          "Step 7 - Make a Promise: 'I won't ignore the real concerns you have. I'll pay attention and keep us safe, but without so much anxiety.'"
        ]
      },
      {
        heading: "Emergency Self-Energy Access During Panic",
        text: "During intense anxiety or panic, it can be hard to access Self. These emergency practices create just enough separation for Self to emerge:",
        practices: [
          "5-4-3-2-1 Grounding: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste (brings you into present, out of parts' past)",
          "Butterfly Hug: Cross arms over chest, alternate tapping shoulders (regulates nervous system, creates self-compassion)",
          "Name the Part: 'This is my panic part. It thinks I'm in danger. I'm actually safe right now.' (creates separation)",
          "Timeline Reality Check: 'What year is it? How old am I? Where am I?' (helps parts update to present reality)",
          "Self-Energy Anchor: Touch your heart or place hand on chest. Breathe. Say: 'I am here. I am safe. This part is scared, but I (Self) can handle this.'",
          "Phone a Friend: Literally. Connecting with a grounded person can help you access Self-energy you can't find alone."
        ]
      },
      {
        heading: "Daily Self-Energy Strengthening",
        text: "The more time you spend in Self-energy, the easier it is to access during anxiety. These daily practices build your Self muscle:",
        practices: [
          "Morning Check-In: Before getting out of bed, spend 2 minutes asking: 'Who's here this morning? What parts are present? What do they need from me?'",
          "Meditation or Quiet Time: Even 5 minutes daily of unblended awareness strengthens Self. You don't have to 'empty your mind' - just practice noticing parts without being them.",
          "Parts Journal: Write from Self to your parts: 'Dear Anxious Part, I notice you're worried about...' This builds relationship and separation.",
          "Self-Energy Moments: Notice moments when you naturally access Self - with pets, in nature, creating art, helping others. Anchor these feelings.",
          "Gratitude for Parts: End each day thanking your parts for trying to protect you, even when their methods are painful.",
          "Build Internal Trust: When you tell parts you'll handle something, follow through. Parts relax when they trust Self to lead."
        ]
      }
    ]
  },

  anxietyScenarios: {
    title: "Common Anxiety Scenarios: An IFS Approach",
    description: "Real-world examples of how to work with specific anxiety situations using IFS principles. Each scenario shows the parts involved and how Self can help.",
    content: [
      {
        heading: "Panic Attacks",
        text: "A panic attack is a Firefighter part creating intense physical symptoms to protect you from something it perceives as dangerous - often an Exile getting close to the surface. The typical response (fighting the panic, trying to make it stop) makes it worse because you're fighting your own protector.",
        examples: [
          "The Scenario: You're in a meeting and suddenly feel chest tightness, racing heart, difficulty breathing, terror of 'losing control.'",
          "Parts Involved: Firefighter (creating panic to escape), Manager (terrified of being seen as weak), Exile (holding old fear of being trapped/overwhelmed)",
          "The IFS Response: 'A part of me is panicking. It thinks I'm in danger. I (Self) am actually safe. This is a Firefighter trying to protect me. What is it protecting me from?' Often: an Exile feeling trapped (like in childhood) or afraid of judgment.",
          "Self-Energy Practice: Ground in body (feet on floor). Breathe slowly (not to stop the panic, but to send safety signal). Say internally: 'Thank you, panic part, for trying to protect me. I see you. I've got this. We're actually safe.' After the crisis, get curious about what triggered it."
        ],
        practices: [
          "During: Don't fight it. Acknowledge it: 'This is my panic part. It's trying to help.' Ground in Self-energy.",
          "After: Journal conversation with the Firefighter: 'What were you protecting me from?' Look for the Exile underneath.",
          "Long-term: Work with the Exile holding the original fear. When Exiles heal, Firefighters don't need to panic."
        ]
      },
      {
        heading: "Social Anxiety",
        text: "Social anxiety typically involves Managers worrying about judgment, Firefighters creating escape urges or physical symptoms, and Exiles holding childhood experiences of humiliation, rejection, or not belonging.",
        examples: [
          "The Scenario: You're invited to a party. Immediately feel dread. Spend days worrying about what to wear, what to say. Day of, feel nauseous, consider canceling.",
          "Parts Involved: Manager (trying to plan perfect interactions to avoid rejection), Firefighter (creating physical symptoms to escape), Exile (remembers being left out, laughed at, or ignored)",
          "The IFS Response: Talk to each part. To Manager: 'I know you're trying to protect me from embarrassment, but all this planning is exhausting us.' To Firefighter: 'I know social situations feel dangerous, but we're not a vulnerable child anymore.' To Exile: 'I see you remember being hurt. That was real. But this party isn't that situation.'",
          "Self-Energy Practice: Before the event, spend time with the scared Exile. Reassure: 'I will stay with you. If it gets overwhelming, we can leave. But let's try being there - not as a scared child, but as an adult who belongs in the room.'"
        ],
        practices: [
          "Before: Do parts work, not pep talks. Acknowledge the fear, don't try to eliminate it.",
          "During: Stay in Self. Notice when you blend with parts ('I'm so awkward' = blended. 'A part of me feels awkward' = Self).",
          "After: Celebrate small wins. If you went, that matters - regardless of how it felt. Thank your parts for trying."
        ]
      },
      {
        heading: "Health Anxiety",
        text: "Health anxiety often involves Managers scanning for symptoms, Firefighters creating anxiety spirals, and Exiles holding terror about illness, death, or being out of control - usually from childhood experiences with medical trauma or loss.",
        examples: [
          "The Scenario: Notice a headache. Immediately google symptoms. Convinced it's something serious. Can't stop checking WebMD. Anxiety escalates until you're certain you're dying.",
          "Parts Involved: Manager (trying to catch illness early to stay safe), Firefighter (creating panic to force you to seek help), Exile (holds terror from childhood illness, death of loved one, or medical trauma)",
          "The IFS Response: 'The worried part isn't crazy - it's trying to prevent a repeat of something terrible that happened. But constant checking isn't actually keeping me safe; it's keeping me in crisis mode.' Get curious about what the Exile remembers.",
          "Self-Energy Practice: To Manager: 'I'll pay reasonable attention to my health, but I won't live in crisis.' To Exile: 'Someone you loved got sick (or you got sick) and it was terrifying. But you're not stuck in that anymore. I'm here now.'"
        ],
        practices: [
          "Limit checking: Agree with parts on reasonable health monitoring (vs. constant scanning)",
          "Reality-test with Self: 'Is this sensation new or different? Or is this part's familiar anxiety?'",
          "Heal the Exile: Work with the memory that created the health fear. Often healing this ends the anxiety cycle."
        ]
      },
      {
        heading: "Generalized Worry & Rumination",
        text: "Chronic worry is usually a Manager part's full-time job. It believes that worrying equals being prepared, and that if it stops worrying, something bad will happen. The underlying Exile often feels fundamentally unsafe or out of control.",
        examples: [
          "The Scenario: Can't stop thinking about everything that could go wrong. Wake up at 3 AM mentally solving problems. Can't enjoy anything because always waiting for the other shoe to drop.",
          "Parts Involved: Manager worrier (believes worry keeps you safe), Exile (learned early that the world is dangerous, unpredictable, or that you can't count on others)",
          "The IFS Response: 'The worrier is exhausted but doesn't know how to stop because it thinks worry is what keeps bad things from happening. I (Self) need to show this part that I can be alert and handle life without constant anxiety.'",
          "Self-Energy Practice: Have a conversation with the worrier: 'What do you think will happen if you stop worrying?' Listen for the Exile's core belief ('Everything will fall apart' / 'I'll be caught off guard like I was as a kid'). Offer Self as a new way to be safe."
        ],
        practices: [
          "Worry Time: Agree with the worrier part to worry for 15 minutes a day, then practice letting Self handle the rest",
          "Challenge the belief: List times when worrying didn't prevent bad things. List times when not worrying worked out fine.",
          "Heal the Exile: The young part who learned the world isn't safe needs to experience that Self can provide safety now"
        ]
      },
      {
        heading: "Performance & Test Anxiety",
        text: "Performance anxiety involves Manager parts trying to be perfect to avoid failure, Firefighter parts creating blank mind or physical symptoms to escape, and Exile parts holding shame about past failures or criticism.",
        examples: [
          "The Scenario: Have a big presentation. Prepare extensively but still feel terrified. During presentation, mind goes blank, heart races, hands shake. Afterward, ruminate on every mistake.",
          "Parts Involved: Perfectionist Manager (must be perfect to be safe), Firefighter (panic to escape judgment), Exile (remembers being criticized, humiliated, or told they weren't good enough)",
          "The IFS Response: Separate from the perfectionist: 'A part of me believes I have to be perfect, but that's not realistic or necessary. I (Self) know I'm competent enough.' Address the Exile: 'Someone made you feel like mistakes meant you were worthless. That wasn't true then and isn't true now.'",
          "Self-Energy Practice: Before performing, ground in Self. Remind parts: 'We're prepared. If we make mistakes, we're still okay. This performance doesn't define our worth.' After, practice self-compassion instead of rumination."
        ],
        practices: [
          "Separate performance from self-worth: Practice saying 'I did my best' instead of 'I have to be perfect'",
          "Befriend the perfectionist: It's trying to protect you from the pain of criticism, not torture you",
          "Heal the Exile: Work with memories of being harshly judged. Update beliefs about what mistakes mean about you."
        ]
      }
    ]
  },

  dailyPractices: {
    title: "Daily IFS Practices for Anxiety",
    description: "Sustainable, practical exercises you can integrate into daily life to work with anxiety using IFS principles. These build the internal relationship between Self and parts that makes lasting healing possible.",
    content: [
      {
        heading: "Morning Parts Check-In (5 minutes)",
        text: "Start each day by connecting with your internal system. This practice helps you lead from Self rather than being led by anxious parts.",
        practices: [
          "Before getting out of bed, take 3 deep breaths and ask: 'Who's here this morning?'",
          "Notice what parts are present: 'The worrier is already making to-do lists. The tired part wants to stay in bed. The scared part is anxious about today.'",
          "From Self, greet each part: 'I see you, worrier. I know you're trying to help. I've got this.'",
          "Ask parts: 'What do you need from me today?' Listen for answers.",
          "Make promises you can keep: 'I'll take breaks today' / 'I'll address that concern after breakfast' / 'I won't ignore you.'",
          "Set an intention: 'Today I'll practice leading from Self when anxiety comes up.'"
        ]
      },
      {
        heading: "Anxiety Tracking with Parts Awareness",
        text: "Instead of just tracking anxiety levels, track which parts are activated and what they're protecting you from. This builds understanding of your anxiety system.",
        practices: [
          "When anxiety arises, pause and ask: 'Which part is this? Manager, Firefighter, or Exile?'",
          "Notice what triggered it: 'What just happened? What am I thinking about?'",
          "Get curious: 'What is this part afraid of? What is it trying to protect me from?'",
          "Track the pattern: Over days/weeks, notice when each part shows up and what triggers it",
          "Journal template: 'Time: ___ / Part activated: ___ / Trigger: ___ / Fear: ___ / What part needed: ___'",
          "Look for themes: 'My worrier part always shows up before social events' / 'My panic part activates when I feel trapped'"
        ]
      },
      {
        heading: "The 3-Breath Reset (Throughout the Day)",
        text: "A quick practice to separate from anxious parts and access Self-energy in any moment.",
        practices: [
          "Notice when you're blended with anxiety ('I am anxious' / 'I'm freaking out' / 'I can't handle this')",
          "Take 3 intentional breaths. On each breath, say internally:",
          "Breath 1: 'A part of me is anxious' (creates separation)",
          "Breath 2: 'I (Self) am here too' (accesses Self-energy)",
          "Breath 3: 'I can help this part' (establishes Self-leadership)",
          "Then ask the part: 'What do you need?' and proceed from Self, not from the anxious part",
          "Use this practice as often as needed - in meetings, before difficult conversations, during worry spirals, anytime"
        ]
      },
      {
        heading: "Parts Letter Writing",
        text: "Writing from Self to your parts builds relationship and helps parts feel heard. This is especially powerful for anxious parts who feel like they're always being fought or ignored.",
        practices: [
          "Choose a part to write to: 'Dear Worrier,' / 'Dear Panic Part,' / 'Dear Scared Young One'",
          "From Self (not from another part), acknowledge what this part is feeling and doing",
          "Thank the part for trying to protect you: 'I know you're working so hard to keep me safe'",
          "Ask what the part needs you to know: 'What are you most afraid of? What do you want me to understand?'",
          "Make a promise: 'I won't ignore your concerns' / 'I'll take care of what you're worried about' / 'I'm here'",
          "Some parts may write back. Let them. This is their voice being heard, often for the first time.",
          "Do this weekly for different parts, or daily for a part you're actively working with"
        ]
      },
      {
        heading: "Evening Parts Appreciation",
        text: "End each day by thanking your parts. This practice transforms the relationship from adversarial to collaborative.",
        practices: [
          "Before sleep, place hand on heart and take a few deep breaths",
          "Say (internally or aloud): 'Thank you to my parts for trying to protect me today'",
          "Specifically acknowledge parts that were activated: 'Thank you, worrier, for trying to keep me prepared' / 'Thank you, panic part, for trying to keep me safe'",
          "Acknowledge Self: 'Thank you to me (Self) for showing up and leading as best I could today'",
          "Make amends if needed: 'I'm sorry I ignored you today, [part name]. I'll do better tomorrow.'",
          "Set intention: 'Tomorrow I'll continue building trust between Self and parts'",
          "This practice, done consistently, creates profound internal change over time"
        ]
      },
      {
        heading: "Weekly Parts Dialogue Session",
        text: "Set aside 20-30 minutes weekly for deeper conversation with an anxious part. This is where real healing happens.",
        practices: [
          "Choose one anxious part to focus on this week",
          "Get comfortable, ground in Self-energy (calm, curious, compassionate)",
          "Invite the part to come forward: 'I'd like to get to know you better. Are you willing to talk?'",
          "Ask the 6 F's questions: Find (where is it in your body?), Focus (what does it look like, how old?), Flesh out (what does it feel?), Feel toward (how do you feel toward it?), beFriend (what does it need?), Fears (what is it afraid of?)",
          "Listen more than you talk. Let the part share its story.",
          "If you find an Exile underneath the anxious part, witness what happened to it. Validate. Offer to help it leave the past.",
          "End by thanking the part and making a promise about next steps",
          "Journal about what you learned and any insights"
        ]
      }
    ]
  }
};

/**
 * Grounding Techniques specifically designed to help access Self-energy during anxiety
 */
export const groundingTechniques = [
  {
    name: "5-4-3-2-1 Sensory Grounding",
    description: "Brings you into the present moment by engaging all five senses, helping separate from anxious parts stuck in past or future.",
    steps: [
      "Name 5 things you can see (look around: desk, window, hands, etc.)",
      "Name 4 things you can touch (feel: chair, clothing, temperature, texture)",
      "Name 3 things you can hear (notice: traffic, breath, ambient sounds)",
      "Name 2 things you can smell (or recall favorite smells if nothing present)",
      "Name 1 thing you can taste (or recall a favorite taste)"
    ],
    ifsIntegration: "This practice helps anxious parts recognize 'We're here in the present, not back in the scary past.' It creates space for Self to emerge."
  },
  {
    name: "Butterfly Hug (Bilateral Stimulation)",
    description: "Self-soothing technique that calms the nervous system and creates compassionate Self-to-parts connection.",
    steps: [
      "Cross your arms over your chest with hands resting on opposite shoulders",
      "Gently alternate tapping left shoulder, then right shoulder",
      "Continue slow, rhythmic tapping for 1-2 minutes",
      "Breathe slowly while tapping",
      "As you tap, imagine Self hugging the anxious parts with compassion"
    ],
    ifsIntegration: "The bilateral tapping calms the nervous system. The hug posture creates physical experience of Self holding anxious parts."
  },
  {
    name: "Body Scan with Parts Awareness",
    description: "Identifies where anxious parts are located in the body, then sends Self-energy to those areas.",
    steps: [
      "Close eyes and take 3 deep breaths",
      "Slowly scan from head to toe, noticing where you feel tension, anxiety, or discomfort",
      "When you find anxiety in the body, pause there",
      "Ask: 'Which part is this? What are you feeling?'",
      "Place your hand on that area and breathe Self-energy (calm, compassion) toward the part",
      "Say internally: 'I'm here with you. You're not alone. We're safe.'"
    ],
    ifsIntegration: "Anxious parts often live in specific body locations (chest, stomach, throat). This practice builds relationship by meeting them where they are."
  },
  {
    name: "Self-Energy Anchor",
    description: "Creates a physical anchor you can use anytime to access Self-energy quickly during anxiety.",
    steps: [
      "Place one hand on your heart, one on your belly",
      "Take slow, deep breaths into your belly",
      "With each exhale, imagine breathing out anxiety",
      "Say internally: 'I am here' (hand on heart = Self presence)",
      "Say: 'Parts are anxious, but I (Self) am calm' (acknowledging both)",
      "Continue until you feel even a small shift toward calm"
    ],
    ifsIntegration: "The hand on heart symbolizes Self. The hand on belly (where anxiety often lives) symbolizes parts. You're physically creating Self-to-parts connection."
  },
  {
    name: "Timeline Reality Check",
    description: "Helps parts recognize they're not still in the past situation that created the anxiety.",
    steps: [
      "When anxious, ask yourself: 'What year is it?' State the current year.",
      "Ask: 'How old am I?' State your current age.",
      "Ask: 'Where am I?' Describe your actual location.",
      "Look around and name 3 things that prove you're in the present (phone, technology, clothing, etc.)",
      "Say to anxious parts: 'That was then. This is now. We're not stuck there anymore.'"
    ],
    ifsIntegration: "Anxious parts (especially Exiles) are often stuck in past time. This practice helps them update to present reality where Self can actually protect them."
  },
  {
    name: "Parts Appreciation Breathing",
    description: "Combines breathwork with gratitude for parts, creating collaboration instead of conflict with anxiety.",
    steps: [
      "Place hand on area where you feel anxiety (chest, stomach, throat)",
      "Inhale slowly for 4 counts",
      "Hold for 4 counts",
      "Exhale slowly for 6 counts (longer exhale calms nervous system)",
      "On each exhale, say internally: 'Thank you for trying to protect me'",
      "Continue for 2-3 minutes, breathing compassion toward the anxious part"
    ],
    ifsIntegration: "Fighting anxiety makes it stronger. Thanking anxious parts for trying to help creates a relationship where they can relax."
  },
  {
    name: "Feet on the Floor Grounding",
    description: "Simple, powerful practice to bring awareness out of anxious thoughts and into present body.",
    steps: [
      "Sit with feet flat on floor (remove shoes if possible)",
      "Press feet firmly into the ground",
      "Notice the sensation of floor supporting you",
      "Imagine roots growing from your feet into the earth",
      "Say internally: 'I am grounded. I am supported. I am here.'",
      "When thoughts pull you into anxiety, bring attention back to feet"
    ],
    ifsIntegration: "Anxious parts often pull you into your head (worry, rumination). Grounding in body helps Self be present and available to help parts."
  },
  {
    name: "The 'I Am Here' Practice",
    description: "Quick mantra that separates Self from anxious parts and establishes Self-leadership.",
    steps: [
      "When anxiety spikes, pause and take one deep breath",
      "Say (internally or aloud): 'I am here'",
      "Feel into the truth of that statement - Self is present",
      "Notice the anxious part, then say: 'You are anxious, and I am here with you'",
      "This creates both acknowledgment of the part AND presence of Self"
    ],
    ifsIntegration: "This simple phrase creates separation ('I' = Self, 'you' = part) while maintaining connection ('I am here with you')."
  },
  {
    name: "Color Breathing for Anxiety",
    description: "Visualization technique that helps parts feel cared for by Self-energy.",
    steps: [
      "Close eyes and identify where anxiety lives in your body",
      "Imagine that anxiety has a color (common: red, gray, dark)",
      "Now imagine a healing color representing Self-energy (common: blue, green, gold, white)",
      "As you inhale, imagine breathing the healing color into the anxious area",
      "As you exhale, imagine breathing out the anxiety color",
      "Continue, imagining Self-energy filling and soothing the anxious part",
      "End by thanking the part for letting you help"
    ],
    ifsIntegration: "This visualizes the process of Self-energy healing anxious parts. The practice creates felt sense of parts being cared for."
  },
  {
    name: "Emergency 'Phone a Friend' Protocol",
    description: "Sometimes we can't access Self-energy alone. This practice acknowledges when you need external help.",
    steps: [
      "Recognize when you're too blended with anxiety to access Self on your own",
      "Reach out to someone who can hold Self-energy for you (therapist, trusted friend, support person)",
      "Say: 'I'm really anxious and having trouble accessing my Self. Can you help ground me?'",
      "Let them guide you through grounding (or just their calm presence can help)",
      "Notice how their Self-energy helps you access your own",
      "Thank them and the anxious parts for letting you get help"
    ],
    ifsIntegration: "IFS recognizes we sometimes need another person's Self to help us find our own. This isn't failure - it's wisdom about how healing works."
  }
];
