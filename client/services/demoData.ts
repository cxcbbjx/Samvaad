interface DemoMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
  sentiment?: string;
}

interface DemoConversation {
  id: string;
  title: string;
  description: string;
  category: string;
  messages: DemoMessage[];
  outcome: string;
  duration: string;
  satisfaction: number;
}

export const demoConversations: DemoConversation[] = [
  {
    id: "demo-1",
    title: "Exam Anxiety Support",
    description: "Student struggling with overwhelming anxiety before final exams",
    category: "Academic Stress",
    duration: "12 minutes",
    satisfaction: 4.8,
    outcome: "Provided breathing techniques and study planning strategies. Student reported feeling more confident.",
    messages: [
      {
        id: "m1",
        content: "I have my final exams starting tomorrow and I'm completely freaking out. I can't sleep, I can't eat, and every time I think about the exam I feel like I'm going to have a panic attack.",
        isUser: true,
        timestamp: new Date(Date.now() - 720000), // 12 minutes ago
        sentiment: "negative"
      },
      {
        id: "m2",
        content: "I can really hear how overwhelming this feels for you right now. Exam anxiety is incredibly common and what you're experiencing - the inability to sleep, eat, and those panic-like feelings - are all very real responses to stress. You're not alone in this, and there are things we can do together to help you feel more grounded. First, let's try a quick breathing technique. Can you try breathing in for 4 counts, holding for 4, and exhaling for 6? This activates your body's natural calming response.",
        isUser: false,
        timestamp: new Date(Date.now() - 700000),
        sentiment: "supportive"
      },
      {
        id: "m3",
        content: "Okay, I tried that a few times. It does help a little bit. But I'm still so worried about failing. What if I blank out during the exam? What if all my studying was for nothing?",
        isUser: true,
        timestamp: new Date(Date.now() - 680000),
        sentiment: "worried"
      },
      {
        id: "m4",
        content: "I'm so glad the breathing helped even a little - that's your nervous system starting to calm down. Those 'what if' thoughts you're having are called catastrophic thinking, and they're very common with anxiety. Let's challenge them gently. You mentioned 'all your studying' - that tells me you HAVE been preparing. Your brain has been absorbing information. Even if you feel blank for a moment, often the information comes back when we stay calm. Have you experienced this before where you knew something but anxiety made it temporarily hard to access?",
        isUser: false,
        timestamp: new Date(Date.now() - 660000),
        sentiment: "encouraging"
      },
      {
        id: "m5",
        content: "Actually yes, that happened in my midterm. I panicked at first but then I remembered to breathe and the answers came back to me. I guess I did do okay on that one.",
        isUser: true,
        timestamp: new Date(Date.now() - 640000),
        sentiment: "reflective"
      },
      {
        id: "m6",
        content: "That's such an important insight! You've actually already proven to yourself that you can handle this situation. You have evidence that breathing helps, that the information comes back, and that you can do okay. Tomorrow, if you feel that panic starting, you can remind yourself: 'I've handled this before, I can breathe through it, and I know the material.' Would it help to plan a few calming strategies for tomorrow morning?",
        isUser: false,
        timestamp: new Date(Date.now() - 620000),
        sentiment: "supportive"
      },
      {
        id: "m7",
        content: "Yes, that would really help. Thank you for reminding me that I've done this before. I was so focused on what could go wrong that I forgot I actually handled my midterms pretty well.",
        isUser: true,
        timestamp: new Date(Date.now() - 600000),
        sentiment: "hopeful"
      }
    ]
  },
  {
    id: "demo-2",
    title: "Relationship Support (Hindi)",
    description: "Student seeking support after a difficult breakup, demonstrating multilingual capabilities",
    category: "Relationship Issues",
    duration: "15 minutes",
    satisfaction: 4.6,
    outcome: "Provided emotional validation and coping strategies in Hindi. Student felt understood and supported.",
    messages: [
      {
        id: "m1",
        content: "मेरा breakup हो गया है और मैं बहुत upset हूँ। मुझे समझ नहीं आ रहा कि मैं क्या करूँ।",
        isUser: true,
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        language: "hi",
        sentiment: "sad"
      },
      {
        id: "m2",
        content: "मैं समझ सकता हूँ कि आप कितना दुखी महसूस कर रहे होंगे। Breakup एक बहुत ही दुखदायी अनुभव है और आपके emotions बिल्कुल सामान्य हैं। यह ठीक है कि आप upset हैं - इसका मतलब है कि वह relationship आपके लिए meaningful था। आप अकेले नहीं हैं इस दर्द में। क्या आप मुझे बता सकते हैं कि अभी आपको सबसे ज्याद��� क्या परेशान कर रहा है?",
        isUser: false,
        timestamp: new Date(Date.now() - 880000),
        language: "hi",
        sentiment: "empathetic"
      },
      {
        id: "m3",
        content: "मुझे लग रहा है जैसे मैंने कुछ गलत किया है। हो सकता है अगर मैं बेहतर होता तो यह नहीं होता। अब मैं अकेला हूँ और मुझे नहीं पता कि आगे क्या करूँ।",
        isUser: true,
        timestamp: new Date(Date.now() - 860000),
        language: "hi",
        sentiment: "self-blame"
      },
      {
        id: "m4",
        content: "आप अपने आप को दोष दे रहे हैं, लेकिन relationship में दो लोग होते हैं और इसकी जिम्मेदारी केवल आप पर नहीं है। यह सोचना कि 'अगर मैं बेहतर होता' एक natural reaction है जब हम दुखी होते हैं, लेकिन यह हमेशा सच नहीं होता। आप एक valuable person है���, और आपकी worth किसी relationship के status से नहीं तय होती। अभी सबसे important यह है कि आप अपना ख्याल रखें। क्या आप अपने friends या family से बात कर पा रहे हैं?",
        isUser: false,
        timestamp: new Date(Date.now() - 840000),
        language: "hi",
        sentiment: "validating"
      },
      {
        id: "m5",
        content: "हाँ, मेरे कुछ friends हैं जो support कर रहे हैं। लेकिन मुझे लगता है जैसे मैं unlovable हूँ। कैसे पता चलेगा कि मैं फिर से किसी को trust कर सकूंगा?",
        isUser: true,
        timestamp: new Date(Date.now() - 820000),
        language: "hi",
        sentiment: "vulnerable"
      },
      {
        id: "m6",
        content: "यह समझना बहुत अच्छी बात है कि आपके पास supportive friends हैं - यह दिखाता है कि आप lovable हैं! जो friends आपका साथ दे रहे हैं, वे आपमें प्यार ��र care के योग्य qualities देखते हैं। Trust build करना time लेता है, और यह ठीक है। अभी आपको जल्दबाजी की जरूरत नहीं है। Healing एक process है। पहले खुद से trust build करें - खुद का ख्याल रखें, अपनी activities में engage होएं, और वे चीजें करें जो आपको खुशी देती हैं। Trust आएगा जब आप ready होंगे।",
        isUser: false,
        timestamp: new Date(Date.now() - 800000),
        language: "hi",
        sentiment: "hopeful"
      }
    ]
  },
  {
    id: "demo-3",
    title: "Crisis Intervention Success",
    description: "Immediate support for student expressing suicidal thoughts - showcasing crisis detection",
    category: "Crisis Support",
    duration: "8 minutes",
    satisfaction: 5.0,
    outcome: "Successfully identified crisis situation, provided immediate support, and connected with professional help.",
    messages: [
      {
        id: "m1",
        content: "I don't think I can do this anymore. Everything feels pointless and I keep thinking that maybe everyone would be better off without me.",
        isUser: true,
        timestamp: new Date(Date.now() - 480000), // 8 minutes ago
        sentiment: "crisis"
      },
      {
        id: "m2",
        content: "I'm really concerned about what you're sharing with me, and I want you to know that I'm here with you right now. What you're feeling is incredibly painful, and I'm so glad you reached out. You matter deeply, and your life has value. I want to make sure you get the immediate support you deserve. Are you in a safe place right now? And are you having thoughts of hurting yourself?",
        isUser: false,
        timestamp: new Date(Date.now() - 470000),
        sentiment: "urgent_care"
      },
      {
        id: "m3",
        content: "I'm in my dorm room. I have been having those thoughts, yes. I feel like such a burden to everyone.",
        isUser: true,
        timestamp: new Date(Date.now() - 460000),
        sentiment: "crisis"
      },
      {
        id: "m4",
        content: "Thank you for being honest with me - that takes incredible courage. You are NOT a burden. Depression can make us feel that way, but it's not the truth about who you are. Right now, I want to connect you with someone who can provide immediate professional support. Please reach out to the Crisis Text Line by texting HOME to 741741, or call 988 for the Suicide & Crisis Lifeline. They have trained counselors available 24/7. Is there someone - a friend, family member, or campus counselor - who could be with you right now?",
        isUser: false,
        timestamp: new Date(Date.now() - 450000),
        sentiment: "immediate_support"
      },
      {
        id: "m5",
        content: "My roommate is here. I think I could tell her. And yes, I'll call that number. Thank you for listening and not judging me.",
        isUser: true,
        timestamp: new Date(Date.now() - 440000),
        sentiment: "accepting_help"
      },
      {
        id: "m6",
        content: "I'm so proud of you for being willing to reach out to your roommate and call for professional help. That shows real strength and courage. Please stay with your roommate and make that call now. You deserve support, care, and the chance to feel better. This pain you're experiencing right now - it can change. You've taken the most important step by reaching out. I believe in you.",
        isUser: false,
        timestamp: new Date(Date.now() - 430000),
        sentiment: "encouraging"
      }
    ]
  },
  {
    id: "demo-4",
    title: "Academic Pressure & Time Management",
    description: "Helping a student balance multiple deadlines and coursework",
    category: "Academic Support",
    duration: "10 minutes",
    satisfaction: 4.7,
    outcome: "Provided structured approach to time management and stress reduction techniques.",
    messages: [
      {
        id: "m1",
        content: "I have three papers due this week, two exams next week, and I'm supposed to be applying for internships. I'm completely overwhelmed and don't know where to start. I feel like I'm going to fail everything.",
        isUser: true,
        timestamp: new Date(Date.now() - 600000),
        sentiment: "overwhelmed"
      },
      {
        id: "m2",
        content: "That sounds like an incredible amount of pressure you're carrying right now. It's completely understandable to feel overwhelmed when faced with so many important deadlines at once. Let's break this down together so it feels more manageable. Sometimes when everything feels urgent, it helps to step back and prioritize. Can you tell me which of these has the earliest deadline?",
        isUser: false,
        timestamp: new Date(Date.now() - 580000),
        sentiment: "organizing"
      },
      {
        id: "m3",
        content: "Two of the papers are due Thursday and Friday, one exam is Monday, and the internship applications are due next Friday. The third paper isn't due until next Wednesday.",
        isUser: true,
        timestamp: new Date(Date.now() - 560000),
        sentiment: "clarifying"
      },
      {
        id: "m4",
        content: "Great, now we have a clearer picture. Let's focus on what's most immediate: the two papers this week. For the rest of today and tomorrow, could you focus just on the Thursday paper? Then tackle Friday's paper on Thursday evening and Friday morning. The Monday exam can get focused attention this weekend, and the internship applications can be worked on in smaller chunks. Does breaking it down this way make it feel more doable?",
        isUser: false,
        timestamp: new Date(Date.now() - 540000),
        sentiment: "strategic"
      },
      {
        id: "m5",
        content: "Yes, that actually helps a lot. I think I was trying to work on everything at once and making no real progress on anything. But what if I can't finish everything in time?",
        isUser: true,
        timestamp: new Date(Date.now() - 520000),
        sentiment: "relieved_but_worried"
      },
      {
        id: "m6",
        content: "I'm so glad the prioritization feels helpful! You've identified exactly what wasn't working - trying to do everything at once. As for your worry about not finishing, let's think about this: you have concrete deadlines and a plan now. If you find you truly can't complete something to your usual standards, remember that it's better to submit something good than nothing at all. Also, have you considered reaching out to professors? Many are understanding about overwhelming periods and might offer extensions or guidance.",
        isUser: false,
        timestamp: new Date(Date.now() - 500000),
        sentiment: "practical"
      }
    ]
  },
  {
    id: "demo-5",
    title: "Social Anxiety & Friendship",
    description: "Student struggling to make connections and feeling isolated",
    category: "Social Support",
    duration: "18 minutes",
    satisfaction: 4.5,
    outcome: "Explored social anxiety patterns and developed actionable steps for building connections.",
    messages: [
      {
        id: "m1",
        content: "I've been in college for two months now and I still haven't made any real friends. I see everyone else in groups and having fun, and I just feel so lonely. I want to connect with people but I get so anxious in social situations.",
        isUser: true,
        timestamp: new Date(Date.now() - 1080000), // 18 minutes ago
        sentiment: "lonely"
      },
      {
        id: "m2",
        content: "Two months can feel like a long time when you're experiencing loneliness, but you're actually still very much in the adjustment period of college. Many students feel this way, even those who might appear to have found their groups easily. Social anxiety in new environments is incredibly common. Can you tell me what specifically makes you feel most anxious in social situations?",
        isUser: false,
        timestamp: new Date(Date.now() - 1060000),
        sentiment: "normalizing"
      },
      {
        id: "m3",
        content: "I worry that I'll say something stupid or that people will think I'm boring. Sometimes I want to join conversations but I just freeze up. And then I overthink everything afterward - like if someone didn't respond enthusiastically to something I said, I convince myself they hate me.",
        isUser: true,
        timestamp: new Date(Date.now() - 1040000),
        sentiment: "anxious"
      },
      {
        id: "m4",
        content: "Those thoughts sound exhausting to carry around. The fear of saying something wrong, the freezing up, the overthinking afterward - that's a very common pattern with social anxiety. Here's something important: most people are much more focused on themselves and how they're coming across than they are on judging you. When someone doesn't respond enthusiastically, there could be a hundred reasons that have nothing to do with you. Have you noticed any situations where the social anxiety feels less intense?",
        isUser: false,
        timestamp: new Date(Date.now() - 1020000),
        sentiment: "understanding"
      },
      {
        id: "m5",
        content: "Actually, yes. In my smaller classes when we're discussing the material, I feel more comfortable. I guess because there's a clear topic to focus on instead of just trying to make conversation.",
        isUser: true,
        timestamp: new Date(Date.now() - 1000000),
        sentiment: "insightful"
      },
      {
        id: "m6",
        content: "That's such a valuable insight! You've identified that you feel more comfortable when there's structure and a shared focus. This gives us a great starting point. Could you look for opportunities that have this same quality? Study groups, clubs related to your interests, volunteer activities, or even just showing up to the same coffee shop or library space regularly? These create natural conversation starters and remove some of the pressure of 'making conversation.'",
        isUser: false,
        timestamp: new Date(Date.now() - 980000),
        sentiment: "encouraging"
      }
    ]
  }
];

export const demoQuickStats = {
  totalSessions: 1247,
  averageSessionTime: "8.5 minutes",
  satisfactionRating: 4.6,
  crisisInterventions: 23,
  languagesSupported: 12,
  activeStudents: 456,
  responsiveRate: "94%"
};

export const demoTopics = [
  { name: "Exam Stress", count: 287, percentage: 35 },
  { name: "Relationship Issues", count: 194, percentage: 24 },
  { name: "Academic Pressure", count: 162, percentage: 20 },
  { name: "Social Anxiety", count: 98, percentage: 12 },
  { name: "Family Problems", count: 73, percentage: 9 }
];

export const demoSentimentData = {
  positive: 67,
  neutral: 25,
  negative: 8
};

export const demoLanguageData = [
  { language: "English", percentage: 72, count: 897 },
  { language: "Hindi", percentage: 18, count: 224 },
  { language: "Spanish", percentage: 6, count: 75 },
  { language: "French", percentage: 2, count: 25 },
  { language: "Other", percentage: 2, count: 26 }
];

export class DemoDataService {
  static getRandomConversation(): DemoConversation {
    const randomIndex = Math.floor(Math.random() * demoConversations.length);
    return demoConversations[randomIndex];
  }

  static getConversationsByCategory(category: string): DemoConversation[] {
    return demoConversations.filter(conv => conv.category === category);
  }

  static getAllConversations(): DemoConversation[] {
    return demoConversations;
  }

  static getConversationById(id: string): DemoConversation | undefined {
    return demoConversations.find(conv => conv.id === id);
  }

  static getDemoStats() {
    return demoQuickStats;
  }

  static getTopics() {
    return demoTopics;
  }

  static getSentimentData() {
    return demoSentimentData;
  }

  static getLanguageData() {
    return demoLanguageData;
  }

  // Generate realistic messages for demo purposes
  static generateRealisticMessage(category: string, isUser: boolean): string {
    const templates = {
      "Academic Stress": {
        user: [
          "I'm really struggling with my workload this semester",
          "I feel like I'm falling behind in all my classes",
          "The pressure to get good grades is overwhelming me"
        ],
        bot: [
          "Academic pressure can feel intense. Let's talk about what's making it feel most overwhelming right now.",
          "It sounds like you're carrying a heavy load. What would be most helpful to focus on first?",
          "Many students experience this. You're not alone, and there are strategies that can help."
        ]
      },
      "Relationship Issues": {
        user: [
          "I'm having problems with my boyfriend/girlfriend",
          "I don't know how to handle this breakup",
          "I feel like nobody understands me in my relationships"
        ],
        bot: [
          "Relationship challenges can be really painful. I'm here to listen and support you.",
          "Breakups are among life's most difficult experiences. How are you taking care of yourself?",
          "It sounds like you're feeling misunderstood. That can be really isolating."
        ]
      }
    };

    const categoryTemplates = templates[category as keyof typeof templates];
    if (!categoryTemplates) return "I'm here to support you. How are you feeling today?";

    const messageType = isUser ? "user" : "bot";
    const messages = categoryTemplates[messageType];
    return messages[Math.floor(Math.random() * messages.length)];
  }
}

export default DemoDataService;
