export const conversationTemplates = [
  {
    id: 'mixed-signals',
    title: '🤔 Mixed Signals Dating',
    category: 'dating',
    description: 'Confusing responses that send mixed messages',
    conversation: `Me: Hey! Had such a great time last night. Would love to see you again soon 😊

Them: Yeah it was fun! Thanks for dinner

Me: Are you free this weekend? Maybe we could grab brunch or catch that movie?

Them: This weekend is pretty crazy for me... maybe another time?

Me: No worries! How about next week?

Them: I'll let you know, been super busy with work lately

Me: Of course, just let me know when you're free!

Them: Will do! 👍`
  },
  {
    id: 'red-flag-manipulation',
    title: '🚩 Manipulation Red Flags',
    category: 'warning',
    description: 'Classic manipulation tactics and guilt-tripping',
    conversation: `Them: I can't believe you're going out with your friends again instead of spending time with me

Me: We planned this weeks ago, and I haven't seen them in months

Them: So your friends are more important than me? I guess I know where I stand

Me: That's not what I said at all. You're important to me too

Them: If I was important you wouldn't constantly choose them over me. I'm starting to think you don't really care about this relationship

Me: I do care, I just think it's healthy to have friends too

Them: "Healthy"? What's unhealthy is having a girlfriend who prioritizes everyone else. Maybe I should find someone who actually wants to be with me

Me: I want to be with you, I just also want to maintain my friendships

Them: Fine, go have fun. Don't expect me to be here when you get back`
  },
  {
    id: 'healthy-communication',
    title: '💚 Healthy Communication',
    category: 'positive',
    description: 'Great example of mature, caring conversation',
    conversation: `Me: Hey, I wanted to talk about what happened yesterday. I felt hurt when you cancelled our plans last minute

Them: I'm so sorry about that. You're absolutely right to feel hurt. I should have given you more notice

Me: I understand things come up, but it would help if you could let me know earlier when possible

Them: You're completely right. I was overwhelmed with work stuff and handled it poorly. I'll make sure to communicate better next time

Me: I appreciate you acknowledging that. I know work has been stressful for you

Them: It has been, but that's not an excuse to treat you inconsiderately. How about I make it up to you this weekend? 

Me: That sounds great. And if work gets overwhelming again, just let me know and we can figure something out together

Them: Thank you for being so understanding. I'm lucky to have someone who communicates so well ❤️`
  },
  {
    id: 'friend-drama',
    title: '👥 Friend Group Drama',
    category: 'friendship',
    description: 'Navigating complex friend group dynamics',
    conversation: `Sarah: Did you see what happened at the party last night?

Me: With Emma? Yeah that was awkward

Sarah: I can't believe she brought up Jake in front of everyone. She knows Lisa still has feelings for him

Me: I think she was just drunk and not thinking clearly

Sarah: That's not an excuse. She completely humiliated Lisa

Me: True, but I also think Lisa could have handled it better instead of storming out

Sarah: Are you seriously taking Emma's side right now?

Me: I'm not taking sides, I just think both of them made mistakes

Sarah: Whatever. Just so you know, the rest of us are planning to talk to Emma about her behavior

Me: Maybe we should all sit down together instead of ganging up on her?

Sarah: She created this mess, she needs to deal with the consequences`
  },
  {
    id: 'workplace-conflict',
    title: '💼 Workplace Tension',
    category: 'professional',
    description: 'Handling difficult work relationships',
    conversation: `Manager: I need to discuss your performance on the Peterson project

Me: Of course, what specifically would you like to address?

Manager: The client wasn't happy with the initial presentation. They felt it was rushed

Me: I understand their concern. I was working with the deadline you gave me, but I should have communicated if I needed more time

Manager: That's exactly the issue. You should have spoken up if you felt the timeline was unrealistic

Me: You're absolutely right. In the future, I'll be more proactive about discussing timeline concerns

Manager: I also noticed you've been less collaborative with the team lately

Me: Can you give me some specific examples? I want to understand how I can improve

Manager: Well, you've been working more independently instead of checking in with others

Me: I was trying to be more efficient, but I see how that might come across as not being collaborative. I'll make sure to engage more with the team`
  },
  {
    id: 'love-bombing',
    title: '💣 Love Bombing Warning',
    category: 'warning',
    description: 'Early relationship intensity red flags',
    conversation: `Them: Good morning beautiful! I've been thinking about you all night ❤️❤️❤️

Me: Good morning! That's sweet

Them: I know we just met last week but I feel like I've known you forever. You're absolutely perfect

Me: Thank you, that's really nice to hear

Them: I've never felt this way about anyone before. You're literally my soulmate

Me: We're still getting to know each other, but I'm enjoying spending time with you too

Them: I already know everything I need to know. You're the one for me. I can't imagine my life without you

Me: That's... intense. I like you too but maybe we should take things a bit slower?

Them: Why would we slow down when we have something so special? I've already told my family all about you

Me: You told your family about me? We've only been on two dates

Them: Because you're going to be part of my family! I can already picture our future together. I'm going to delete my dating apps right now because I only want you`
  }
];

export const getTemplatesByCategory = (category) => {
  return conversationTemplates.filter(template => template.category === category);
};

export const getAllCategories = () => {
  return [...new Set(conversationTemplates.map(template => template.category))];
};
