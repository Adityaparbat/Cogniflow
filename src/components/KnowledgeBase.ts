// Comprehensive Knowledge Base for Educational Chatbot

interface KnowledgeItem {
  keywords: string[];
  response: string;
  category: string;
}

export const knowledgeBase: KnowledgeItem[] = [
  // Indian History
  {
    keywords: ['shivaji', 'chhatrapati', 'maratha', 'maratha empire'],
    response: "Chhatrapati Shivaji Maharaj (1630-1680) was the founder of the Maratha Empire in western India. He was a great warrior, administrator, and leader who fought against the Mughal Empire. He established a strong naval force, built many forts, and created an efficient administrative system. He is remembered for his military tactics, justice, and respect for all religions.",
    category: 'Indian History'
  },
  {
    keywords: ['gandhi', 'mahatma', 'father of nation'],
    response: "Mahatma Gandhi (1869-1948) was the leader of India's independence movement against British rule. He is known for his philosophy of non-violence (ahimsa) and civil disobedience. His methods inspired movements for civil rights and freedom across the world. He is called the 'Father of the Nation' in India.",
    category: 'Indian History'
  },
  {
    keywords: ['nehru', 'jawarharlal', 'first prime minister'],
    response: "Jawaharlal Nehru (1889-1964) was India's first Prime Minister after independence. He was a key leader in the independence movement and is known for his vision of a modern, secular India. He established many educational institutions and scientific research centers. He is often called 'Pandit Nehru' and his birthday is celebrated as Children's Day in India.",
    category: 'Indian History'
  },
  {
    keywords: ['independence', 'freedom struggle', 'british rule'],
    response: "India's independence movement (1857-1947) was a long struggle against British colonial rule. Key events included the First War of Independence (1857), formation of the Indian National Congress (1885), Non-Cooperation Movement (1920), Quit India Movement (1942), and finally independence on August 15, 1947. Leaders like Gandhi, Nehru, Subhas Chandra Bose, and many others played crucial roles.",
    category: 'Indian History'
  },
  {
    keywords: ['partition', '1947', 'pakistan'],
    response: "The Partition of India in 1947 divided British India into two independent countries: India and Pakistan. It was based on religious lines, with Muslim-majority areas becoming Pakistan. The partition led to massive migration, violence, and displacement of millions of people. It remains one of the most significant events in South Asian history.",
    category: 'Indian History'
  },
  {
    keywords: ['bose', 'subhas chandra', 'netaji'],
    response: "Subhas Chandra Bose (1897-1945), popularly known as Netaji, was a prominent leader in India's independence movement. He formed the Indian National Army (INA) to fight against British rule. His famous slogan was 'Give me blood and I will give you freedom.' He is remembered for his revolutionary approach to achieving independence.",
    category: 'Indian History'
  },
  {
    keywords: ['patel', 'sardar', 'iron man'],
    response: "Sardar Vallabhbhai Patel (1875-1950) was India's first Deputy Prime Minister and Home Minister. He is known as the 'Iron Man of India' for his role in integrating over 500 princely states into the Indian Union after independence. He was a key leader in the independence movement and is remembered for his strong leadership.",
    category: 'Indian History'
  },

  // World History
  {
    keywords: ['french revolution', 'bastille', 'napoleon'],
    response: "The French Revolution (1789-1799) was a period of radical social and political change in France. It began with the storming of the Bastille prison and led to the overthrow of the monarchy. Key events included the Declaration of the Rights of Man, the Reign of Terror, and the rise of Napoleon Bonaparte. It had a profound impact on European history and modern democracy.",
    category: 'World History'
  },
  {
    keywords: ['world war', 'ww1', 'ww2', 'world war 1', 'world war 2'],
    response: "World War II (1939-1945) was a global conflict involving most nations. It began with Germany's invasion of Poland and ended with the surrender of Germany and Japan. Key events included the Holocaust, Pearl Harbor attack, D-Day invasion, and the atomic bombings of Japan. It resulted in the creation of the United Nations and the beginning of the Cold War.",
    category: 'World History'
  },
  {
    keywords: ['cold war', 'soviet union', 'usa'],
    response: "The Cold War (1947-1991) was a period of geopolitical tension between the United States and the Soviet Union. It was characterized by political, economic, and military rivalry without direct armed conflict. Key events included the Cuban Missile Crisis, the Berlin Wall, the Space Race, and the arms race. It ended with the collapse of the Soviet Union.",
    category: 'World History'
  },
  {
    keywords: ['industrial revolution', 'industrialization'],
    response: "The Industrial Revolution (1760-1840) was a period of major industrialization and innovation. It began in Britain and spread worldwide. Key developments included the steam engine, mechanized textile production, and the factory system. It transformed agriculture, manufacturing, mining, and transportation, leading to urbanization and social change.",
    category: 'World History'
  },

  // Geography
  {
    keywords: ['cleanest city', 'cleanest cities', 'indore'],
    response: "Indore in Madhya Pradesh is often considered the cleanest city in India, having won the 'Cleanest City' award multiple times in the Swachh Survekshan survey. Other clean cities include Surat, Navi Mumbai, Ambikapur, and Mysuru. These cities have implemented effective waste management systems and public awareness campaigns.",
    category: 'Geography'
  },
  {
    keywords: ['capital', 'india', 'new delhi'],
    response: "New Delhi is the capital of India. It's part of the larger Delhi metropolitan area and serves as the seat of the Indian government. It houses important government buildings like the Parliament House, Rashtrapati Bhavan (President's residence), and various ministries.",
    category: 'Geography'
  },
  {
    keywords: ['largest city', 'biggest city', 'mumbai'],
    response: "Mumbai is the largest city in India by population, followed by Delhi, Bangalore, Hyderabad, and Chennai. Mumbai is the financial capital of India and is known for its film industry (Bollywood), business opportunities, and diverse culture.",
    category: 'Geography'
  },
  {
    keywords: ['himalayas', 'himalayan', 'mount everest'],
    response: "The Himalayas are the highest mountain range in the world, stretching across five countries: India, Nepal, Bhutan, China, and Pakistan. Mount Everest, the world's highest peak at 8,848 meters, is located in the Himalayas. The range is home to many glaciers and is the source of major rivers like the Ganges, Indus, and Brahmaputra.",
    category: 'Geography'
  },
  {
    keywords: ['ganges', 'ganga', 'holy river'],
    response: "The Ganges (Ganga) is India's most sacred river, flowing 2,525 km from the Himalayas to the Bay of Bengal. It's considered holy in Hinduism and is used for religious ceremonies. The river supports millions of people and is home to diverse wildlife, though it faces pollution challenges.",
    category: 'Geography'
  },

  // Science
  {
    keywords: ['photosynthesis', 'plants', 'chlorophyll'],
    response: "Photosynthesis is the process by which plants make their own food using sunlight, water, and carbon dioxide. Plants use chlorophyll (the green pigment) to capture sunlight and convert it into glucose and oxygen. This process is essential for life on Earth as it provides oxygen for animals and food for the entire food chain.",
    category: 'Science'
  },
  {
    keywords: ['solar system', 'planets', 'sun'],
    response: "The Solar System consists of the Sun and the objects that orbit it, including eight planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune), dwarf planets like Pluto, moons, asteroids, comets, and other celestial bodies. Earth is the third planet from the Sun and is the only known planet with life.",
    category: 'Science'
  },
  {
    keywords: ['human body', 'body parts', 'organs'],
    response: "The human body is made up of many systems working together: the skeletal system (bones), muscular system (muscles), circulatory system (heart and blood vessels), respiratory system (lungs), digestive system (stomach and intestines), nervous system (brain and nerves), and more. Each system has specific functions that help us survive and function.",
    category: 'Science'
  },
  {
    keywords: ['water cycle', 'evaporation', 'condensation'],
    response: "The water cycle is the continuous movement of water on, above, and below Earth's surface. It includes evaporation (water turning to vapor), condensation (vapor forming clouds), precipitation (rain, snow, etc.), and collection (water returning to oceans, lakes, etc.). This cycle is essential for life on Earth and helps distribute water globally.",
    category: 'Science'
  },
  {
    keywords: ['climate change', 'global warming', 'greenhouse'],
    response: "Climate change refers to long-term changes in global weather patterns and temperatures. It's primarily caused by human activities like burning fossil fuels, deforestation, and industrial processes that release greenhouse gases. Effects include rising sea levels, extreme weather events, and impacts on ecosystems and human societies.",
    category: 'Science'
  },

  // Sports
  {
    keywords: ['virat', 'kohli', 'cricket'],
    response: "Virat Kohli is one of India's greatest cricketers. He's a right-handed batsman and former captain of the Indian cricket team. Known for his aggressive batting style and consistency, he has broken many records and is considered one of the best batsmen in the world. He's also known for his fitness and leadership qualities.",
    category: 'Sports'
  },
  {
    keywords: ['sachin', 'tendulkar', 'master blaster'],
    response: "Sachin Tendulkar is one of the greatest cricketers of all time. Known as the 'Master Blaster', he played international cricket for 24 years and holds many records including most international runs and centuries. He's considered a national hero in India and is often called the 'God of Cricket'.",
    category: 'Sports'
  },
  {
    keywords: ['dhoni', 'ms dhoni', 'captain cool'],
    response: "MS Dhoni is one of India's most successful cricket captains. Known as 'Captain Cool' for his calm demeanor, he led India to victory in the 2007 T20 World Cup, 2011 ODI World Cup, and 2013 Champions Trophy. He's also one of the best wicket-keeper batsmen in cricket history.",
    category: 'Sports'
  },

  // Current Affairs (2024)
  {
    keywords: ['2024', 'current year', 'this year'],
    response: "2024 is the current year. It's a leap year with 366 days. Some major events include the 2024 Summer Olympics in Paris, various national elections around the world, and ongoing developments in technology, climate change, and global politics.",
    category: 'Current Affairs'
  },
  {
    keywords: ['olympics', 'paris', '2024 olympics'],
    response: "The 2024 Summer Olympics will be held in Paris, France from July 26 to August 11, 2024. This will be the third time Paris hosts the Olympics, after 1900 and 1924. The games will feature 32 sports and over 10,000 athletes from around the world.",
    category: 'Current Affairs'
  },
  {
    keywords: ['ai', 'artificial intelligence', 'chatgpt'],
    response: "Artificial Intelligence (AI) is a rapidly developing field of computer science. In 2024, AI technologies like ChatGPT, machine learning, and automation are transforming various industries including healthcare, education, transportation, and entertainment. AI is being used for everything from virtual assistants to medical diagnosis.",
    category: 'Current Affairs'
  },

  // General Knowledge
  {
    keywords: ['democracy', 'democratic', 'government'],
    response: "Democracy is a system of government where power comes from the people, either directly or through elected representatives. Key features include free and fair elections, rule of law, protection of individual rights, and separation of powers. It allows citizens to participate in decision-making and hold leaders accountable.",
    category: 'General Knowledge'
  },
  {
    keywords: ['panda', 'giant panda', 'china'],
    response: "A panda is a large bear native to China. There are two main types: the Giant Panda (black and white) and the Red Panda (reddish-brown). Giant pandas are known for eating bamboo and are considered a national treasure in China. They are endangered species and are protected by conservation efforts worldwide.",
    category: 'General Knowledge'
  },
  {
    keywords: ['tiger', 'national animal', 'india'],
    response: "The Bengal Tiger is India's national animal. It's found in various parts of India including the Sundarbans, Ranthambore, and Bandhavgarh National Parks. Tigers are endangered species and India has several conservation programs like Project Tiger to protect them. The tiger is also a symbol of strength and power in Indian culture.",
    category: 'General Knowledge'
  },
  {
    keywords: ['peacock', 'national bird', 'india'],
    response: "The Indian Peacock (Peafowl) is India's national bird. Known for its beautiful colorful plumage and distinctive call, the peacock is found throughout India. It's associated with grace, beauty, and pride in Indian culture and mythology. The male peacock displays its magnificent tail feathers during courtship.",
    category: 'General Knowledge'
  },
  {
    keywords: ['lotus', 'national flower', 'india'],
    response: "The Lotus is India's national flower. It's a sacred flower in Indian culture and religion, symbolizing purity, beauty, and spiritual enlightenment. The lotus grows in water and is known for its ability to remain clean despite growing in muddy water. It's often used in religious ceremonies and is a common motif in Indian art.",
    category: 'General Knowledge'
  }
];

// Function to find the best matching response
export function findResponse(userInput: string): string {
  const lowerInput = userInput.toLowerCase();
  
  // Check for greetings first
  const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
  if (greetings.some(greet => lowerInput.includes(greet))) {
    const responses = [
      "Hello! How can I help you with your studies today?",
      "Hi there! I'm ready to help you learn.",
      "Hey! Ask me anything related to your subjects or homework.",
      "I'm doing great! Ready to assist you with any educational or GK questions.",
      "Nice to see you! What topic are you curious about today?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Check for "who are you" type questions
  if (lowerInput.includes('who are you') || lowerInput.includes('what are you')) {
    return "I'm an AI tutor designed to help students with their studies. I can assist with various subjects like math, science, history, geography, English, and general knowledge. I'm here to make learning easier and more engaging for you!";
  }

  // Find the best matching knowledge item
  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (lowerInput.includes(keyword.toLowerCase())) {
        score += keyword.length; // Longer keywords get higher scores
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  // If no specific match found, provide a helpful default response
  return "That's an interesting question! I can help with many topics including Indian history (Gandhi, Nehru, Shivaji), world history (French Revolution, World Wars), geography (cities, rivers, mountains), science (photosynthesis, human body), sports (cricket players), and current affairs. Could you try asking about a specific topic or person? For example: 'Who was Mahatma Gandhi?', 'What is the French Revolution?', or 'Which is the cleanest city in India?'";
} 