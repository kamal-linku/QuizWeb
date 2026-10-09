export const getDefaultQuestions = (name = "Kamal") => {
  const safeName = name?.trim() ? name.trim() : "Kamal";

  return [
    {
      id: 1,
      question_number: 1,
      question_text: `What does ${safeName} spend most of their money on?`,
      options: [
        "Food 🍔",
        "Clothes 👕",
        "Gadgets / Technology 💻",
        "Games & Entertainment 🎮"
      ],
      correct_option_index: 2
    },
    {
      id: 2,
      question_number: 2,
      question_text: `Which animated show would ${safeName} pick?`,
      options: [
        "Doraemon 🐱",
        "Kung Fu Panda 🐼",
        "Ben 10 ⚡",
        "SpongeBob SquarePants 🧽"
      ],
      correct_option_index: 0
    },
    {
      id: 3,
      question_number: 3,
      question_text: `How does ${safeName} usually text?`,
      options: [
        "Lots of emojis 🤩",
        "Short and simple 💬",
        "Long paragraphs 📜",
        "Voice messages 🎙️"
      ],
      correct_option_index: 1
    },
    {
      id: 4,
      question_number: 4,
      question_text: `Where did ${safeName} usually sit in class?`,
      options: [
        "First bench 👨‍🏫",
        "Middle bench 🎒",
        "Back bench 🕶️",
        "Near the door / window 🚪"
      ],
      correct_option_index: 2
    },
    {
      id: 5,
      question_number: 5,
      question_text: `When did ${safeName} usually study for exams?`,
      options: [
        "Weeks before 📚",
        "A few days before 📖",
        "The night before ☕",
        "On the morning of the exam ☀️"
      ],
      correct_option_index: 2
    },
    {
      id: 6,
      question_number: 6,
      question_text: `How does ${safeName} usually wear a backpack?`,
      options: [
        "Both straps properly 🎒",
        "One strap 🚶",
        "Hanging from one shoulder 🎒",
        "Carries it by hand 💼"
      ],
      correct_option_index: 0
    },
    {
      id: 7,
      question_number: 7,
      question_text: `How many alarms does ${safeName} need to wake up?`,
      options: [
        "1 alarm ⏰",
        "2–3 alarms ⏰⏰",
        "4–6 alarms ⏰⏰⏰",
        "Lost count 😴"
      ],
      correct_option_index: 1
    },
    {
      id: 8,
      question_number: 8,
      question_text: `How fast does ${safeName} usually eat?`,
      options: [
        "Very slowly 🐢",
        "Normal speed 🥪",
        "Pretty fast ⚡",
        "Food disappears instantly 🌪️"
      ],
      correct_option_index: 1
    },
    {
      id: 9,
      question_number: 9,
      question_text: `How much ketchup does ${safeName} use?`,
      options: [
        "Just a little 🍅",
        "Normal amount 🍟",
        "A lot 🥫",
        "Basically ketchup with a side of food 🌊"
      ],
      correct_option_index: 1
    },
    {
      id: 10,
      question_number: 10,
      question_text: `How much spice can ${safeName} handle?`,
      options: [
        "Almost none 🥛",
        "Mild 🫑",
        "Pretty spicy 🌶️🌶️",
        "Bring the heat 🔥"
      ],
      correct_option_index: 2
    }
  ];
};

export const alternateQuestionsLibrary = [
  {
    question_text: (name) => `Is ${name} a morning person or a night owl?`,
    options: ["Early Morning Bird 🌅", "Night Owl (Up till 3 AM) 🦉", "Always tired regardless 🥱", "Sleeps 12+ hours straight 😴"]
  },
  {
    question_text: (name) => `What is ${name}'s favorite go-to drink?`,
    options: ["Hot Coffee / Espresso ☕", "Masala Chai / Tea 🍵", "Boba / Milkshake 🧋", "Cold Energy Drink / Soda 🥤"]
  },
  {
    question_text: (name) => `What is ${name}'s ideal weekend plan?`,
    options: ["Cozy gaming / movie binge 🍿", "Partying & hanging with squad 🎉", "Exploring outdoors / traveling ✈️", "Sleeping with no alarms 🛌"]
  },
  {
    question_text: (name) => `What would ${name} do if they won $1,000,000?`,
    options: ["Travel the world luxury style 🌍", "Buy dream supercars & tech 🏎️", "Invest / Launch startup 📈", "Put it in savings secretly 🤫"]
  },
  {
    question_text: (name) => `What is ${name}'s secret weapon in arguments?`,
    options: ["Logical facts & stats 📊", "Humor and sharp sarcasm 🤣", "Silent treatment 🤐", "Changing the subject smoothly 🔀"]
  }
];

export const getScoreFeedback = (score, total = 10, creatorName = "your friend") => {
  if (score === total) {
    return {
      title: "Soulmate Level! 👯🔥",
      text: `Okay... you're basically ${creatorName}'s twin!`,
      color: "text-purple-400",
      badge: "100% Match",
      emoji: "🏆"
    };
  } else if (score >= 8) {
    return {
      title: "Best Friend Alert! ❤️✨",
      text: `You really know ${creatorName}!`,
      color: "text-emerald-400",
      badge: "High Score",
      emoji: "💖"
    };
  } else if (score >= 6) {
    return {
      title: "Good Buddy! 😎👍",
      text: `Not bad! You know them pretty well.`,
      color: "text-cyan-400",
      badge: "Pretty Good",
      emoji: "⭐"
    };
  } else if (score >= 4) {
    return {
      title: "Casual Acquaintance? 🤨🤷",
      text: `Do you guys even talk?`,
      color: "text-amber-400",
      badge: "Needs Work",
      emoji: "🤔"
    };
  } else {
    return {
      title: "Stranger Danger! 💀🚪",
      text: `Who are you again?`,
      color: "text-rose-400",
      badge: "Ouch!",
      emoji: "👻"
    };
  }
};

