def get_default_question_templates(name: str = "Friend"):
    safe_name = name.strip() if name and name.strip() else "Friend"
    
    return [
        {
            "id": 1,
            "question_number": 1,
            "question_text": f"What does {safe_name} spend most of their money on?",
            "options": [
                "Food 🍔",
                "Clothes 👕",
                "Gadgets / Technology 💻",
                "Games & Entertainment 🎮"
            ],
            "correct_option_index": 2
        },
        {
            "id": 2,
            "question_number": 2,
            "question_text": f"Which animated show would {safe_name} pick?",
            "options": [
                "Doraemon 🐱",
                "Kung Fu Panda 🐼",
                "Ben 10 ⚡",
                "SpongeBob SquarePants 🧽"
            ],
            "correct_option_index": 0
        },
        {
            "id": 3,
            "question_number": 3,
            "question_text": f"How does {safe_name} usually text?",
            "options": [
                "Lots of emojis 🤩",
                "Short and simple 💬",
                "Long paragraphs 📜",
                "Voice messages 🎙️"
            ],
            "correct_option_index": 1
        },
        {
            "id": 4,
            "question_number": 4,
            "question_text": f"Where did {safe_name} usually sit in class?",
            "options": [
                "First bench 👨‍🏫",
                "Middle bench 🎒",
                "Back bench 🕶️",
                "Near the door / window 🚪"
            ],
            "correct_option_index": 2
        },
        {
            "id": 5,
            "question_number": 5,
            "question_text": f"When did {safe_name} usually study for exams?",
            "options": [
                "Weeks before 📚",
                "A few days before 📖",
                "The night before ☕",
                "On the morning of the exam ☀️"
            ],
            "correct_option_index": 2
        },
        {
            "id": 6,
            "question_number": 6,
            "question_text": f"How does {safe_name} usually wear a backpack?",
            "options": [
                "Both straps properly 🎒",
                "One strap 🚶",
                "Hanging from one shoulder 🎒",
                "Carries it by hand 💼"
            ],
            "correct_option_index": 0
        },
        {
            "id": 7,
            "question_number": 7,
            "question_text": f"How many alarms does {safe_name} need to wake up?",
            "options": [
                "1 alarm ⏰",
                "2–3 alarms ⏰⏰",
                "4–6 alarms ⏰⏰⏰",
                "Lost count 😴"
            ],
            "correct_option_index": 1
        },
        {
            "id": 8,
            "question_number": 8,
            "question_text": f"How fast does {safe_name} usually eat?",
            "options": [
                "Very slowly 🐢",
                "Normal speed 🥪",
                "Pretty fast ⚡",
                "Food disappears instantly 🌪️"
            ],
            "correct_option_index": 1
        },
        {
            "id": 9,
            "question_number": 9,
            "question_text": f"How much ketchup does {safe_name} use?",
            "options": [
                "Just a little 🍅",
                "Normal amount 🍟",
                "A lot 🥫",
                "Basically ketchup with a side of food 🌊"
            ],
            "correct_option_index": 1
        },
        {
            "id": 10,
            "question_number": 10,
            "question_text": f"How much spice can {safe_name} handle?",
            "options": [
                "Almost none 🥛",
                "Mild 🫑",
                "Pretty spicy 🌶️🌶️",
                "Bring the heat 🔥"
            ],
            "correct_option_index": 2
        }
    ]

def get_feedback_message(score: int, total: int = 10, creator_name: str = "your friend") -> str:
    if total == 0:
        return "Quiz complete!"
    percentage = (score / total) * 100
    
    if score == total:
        return f"Okay... you're basically {creator_name}'s twin! 👯🔥"
    elif score >= 8:
        return f"You really know {creator_name}! ❤️✨"
    elif score >= 6:
        return f"Not bad! You know {creator_name} pretty well. 😎👍"
    elif score >= 4:
        return f"Do you guys even talk? 🤨🤷"
    else:
        return f"Who are you again? 💀🚪"

