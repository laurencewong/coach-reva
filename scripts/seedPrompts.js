require('dotenv').config();
const supabase = require('../server/config/supabase');

// Sample prompts for relationship enhancement
const prompts = [
  {
    content: "What's one small thing your partner did recently that made you feel appreciated?",
    category: "appreciation",
    difficulty: 1
  },
  {
    content: "Describe a moment when you felt particularly connected to your partner this week.",
    category: "connection",
    difficulty: 1
  },
  {
    content: "What's one thing you'd like to do together in the next month?",
    category: "quality_time",
    difficulty: 1
  },
  {
    content: "Share something your partner does that always makes you smile.",
    category: "appreciation",
    difficulty: 1
  },
  {
    content: "What's one way you could better support your partner during stressful times?",
    category: "support",
    difficulty: 2
  },
  {
    content: "Describe a miscommunication you've had recently. How could it have been handled differently?",
    category: "communication",
    difficulty: 2
  },
  {
    content: "What boundaries do you think are important to maintain in your relationship?",
    category: "boundaries",
    difficulty: 3
  },
  {
    content: "How do you prefer to receive love and affection? Has this changed over time?",
    category: "love_languages",
    difficulty: 2
  },
  {
    content: "What's one area of your relationship you'd like to strengthen? How might you both work on this?",
    category: "growth",
    difficulty: 3
  },
  {
    content: "Share a challenging situation where you felt your partner really understood your perspective.",
    category: "empathy",
    difficulty: 2
  },
  {
    content: "What's one thing you're looking forward to experiencing together in the future?",
    category: "future",
    difficulty: 1
  },
  {
    content: "Describe a time when you felt particularly proud of your partner.",
    category: "appreciation",
    difficulty: 1
  },
  {
    content: "What's one habit or routine that strengthens your relationship?",
    category: "habits",
    difficulty: 2
  },
  {
    content: "How do you each prefer to resolve conflicts? Are there ways you could better meet in the middle?",
    category: "conflict_resolution",
    difficulty: 3
  },
  {
    content: "Share something new you've learned about your partner recently.",
    category: "discovery",
    difficulty: 2
  }
];

// Function to seed the database with prompts
async function seedPrompts() {
  console.log('Seeding prompts...');
  
  // Insert prompts into the database
  const { data, error } = await supabase
    .from('Prompts')
    .insert(prompts)
    .select();
  
  if (error) {
    console.error('Error seeding prompts:', error);
    return;
  }
  
  console.log(`Successfully seeded ${data.length} prompts.`);
}

// Run the seed function
seedPrompts()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
