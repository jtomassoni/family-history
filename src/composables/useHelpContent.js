import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Organized by categories for better maintenance
const italianAmericanFacts = {
  culture: [
    "The term 'Little Italy' first appeared in print in 1885 to describe the Italian neighborhoods in New York City.",
    "The San Gennaro Festival in New York's Little Italy, started in 1926, is the largest Italian-American street fair in the US.",
    "Italian immigrants introduced the Christmas Eve tradition of the 'Feast of the Seven Fishes' to America.",
    "The Italian-American tradition of 'Sunday Sauce' (or gravy) originated as a way for families to use cheaper cuts of meat during hard times.",
    "The game of bocce, brought by Italian immigrants, became a popular social activity in Italian-American communities.",
    "The tradition of the Italian-American social clubs began in the late 1800s as mutual aid societies.",
    "Many Italian-American families maintain the tradition of making homemade wine, a practice brought over by their ancestors.",
    "The Italian-American custom of the 'cookie table' at weddings originated in Youngstown, Ohio.",
    "The tradition of giving candy-coated almonds (confetti) at Italian-American weddings symbolizes the bitter and sweet moments in life."
  ],
  food: [
    "The first pizzeria in America, Lombardi's, opened in 1905 in New York City's Little Italy.",
    "Italian-American cuisine created unique dishes like chicken parmesan, which isn't found in traditional Italian cooking.",
    "The muffuletta sandwich was created by Sicilian immigrants in New Orleans in 1906.",
    "The first espresso machine in America was installed at Caffè Reggio in New York's Greenwich Village in 1927.",
    "The Italian-American invention of the 'pizza al taglio' (pizza by the slice) revolutionized how Americans eat pizza.",
    "The popularity of gelato in America began with Italian immigrants in the early 1900s.",
    "The Italian beef sandwich was created by Italian immigrants in Chicago during the 1930s.",
    "The invention of the submarine sandwich is credited to Italian immigrant communities in New England.",
    "The rainbow cookie, a staple in Italian-American bakeries, was created to honor the Italian flag."
  ],
  history: [
    "The largest mass lynching in American history targeted 11 Italian-Americans in New Orleans in 1891.",
    "The first Italian-American congressman, Anthony Michalek, was elected in 1904.",
    "During WWII, thousands of Italian-Americans were placed under restrictions as 'enemy aliens.'",
    "The American Mafia emerged from Italian immigrant neighborhoods as a response to discrimination and lack of opportunities.",
    "The first Italian-American governor was John O. Pastore of Rhode Island, elected in 1945.",
    "The first Italian-American to serve on the Supreme Court was Antonin Scalia, appointed in 1986.",
    "The first Italian-American woman elected to Congress was Ella T. Grasso in 1970.",
    "The Italian-American Civil Rights League was founded in 1970 to combat negative stereotypes.",
    "The first Columbus Day celebration in America was held by Italian immigrants in San Francisco in 1869."
  ],
  achievements: [
    "Bank of America was founded as the Bank of Italy by Amadeo Giannini to serve immigrants denied service by other banks.",
    "The first Italian-American millionaire was Antonio Santi, who made his fortune in California during the Gold Rush.",
    "Enrico Fermi, an Italian immigrant, led the team that created the first nuclear reactor in 1942.",
    "Frank Sinatra became the first Italian-American to win an Academy Award for acting in 1953.",
    "Joe DiMaggio's 56-game hitting streak in 1941 remains one of baseball's most celebrated records.",
    "Mother Cabrini became the first American saint in 1946, recognized for her work with Italian immigrants.",
    "Fiorello La Guardia, New York's first Italian-American mayor, served three terms and revolutionized city politics.",
    "Arturo Toscanini became the first conductor of the NBC Symphony Orchestra in 1937.",
    "Frank Capra's 'It's a Wonderful Life' (1946) became an American Christmas classic."
  ],
  contributions: [
    "Italian immigrants were crucial in building America's infrastructure, including the New York subway system.",
    "The Bank of America building in San Francisco was the tallest building on the West Coast when completed in 1969.",
    "Italian-American architects designed many iconic American buildings, including the Supreme Court building.",
    "Italian stonemasons were essential in building Washington, D.C.'s monuments and federal buildings.",
    "Italian-American labor leaders helped establish workers' rights and unions in the early 1900s.",
    "Italian immigrants brought advanced techniques in wine-making to California's nascent wine industry.",
    "Italian-American engineers contributed significantly to the development of the American automobile industry.",
    "Italian-American artists helped establish the American comic book industry in the 1930s and 1940s.",
    "Italian immigrants introduced advanced farming techniques that revolutionized California agriculture."
  ]
};

export function useHelpContent() {
  const route = useRoute();
  
  const getDailyFact = () => {
    // Get current date components
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Use the day of the year to select a category and fact
    const categories = Object.keys(italianAmericanFacts);
    const selectedCategory = categories[dayOfYear % categories.length];
    const facts = italianAmericanFacts[selectedCategory];
    const factIndex = Math.floor(dayOfYear / categories.length) % facts.length;
    
    return facts[factIndex];
  };

  const helpContent = computed(() => {
    switch (route.path) {
      case '/':
        return {
          desktopHint: `🇮🇹 Today's Italian-American Fact:<br><br>${getDailyFact()}`,
          mobileHint: `🇮🇹 Today's Italian-American Fact:<br><br>${getDailyFact()}`
        };
      case '/gallery':
        return {
          desktopHint: "🖼️ Gallery Help:<br><br>Use your ⬅️ arrow keys ➡️ to glide through photos.<br>For a quick jump to the oldest or newest, hold ⬆️ Shift ⬆️ with your arrows!",
          mobileHint: "🖼️ Gallery Help:<br><br>📱 Swipe left/right to cruise through family memories.<br>👆Tap the timeline ↔️ below to pick a special date!"
        };
      case '/stories':
        return {
          desktopHint: "📖 Stories Help:<br><br>Browse through our family's historical stories and memories.<br>Each story includes dates, locations, and family members mentioned.<br>View original photos and documents when available.<br>Stories are organized chronologically by date.<br>Use the icons to quickly identify stories with photos, family members, or locations.",
          mobileHint: "📖 Stories Help:<br><br>Browse through our family's historical stories and memories.<br>Each story includes dates, locations, and family members mentioned.<br>View original photos and documents when available.<br>Stories are organized chronologically by date.<br>Use the icons to quickly identify stories with photos, family members, or locations."
        };
      case '/about':
        return {
          desktopHint: "ℹ️ About Help:<br><br>Welcome to our About page! Here you can learn about our project and get in touch with us through the contact form.",
          mobileHint: "ℹ️ About Help:<br><br>Welcome to our About page! Here you can learn about our project and get in touch with us through the contact form."
        };
      default:
        return {
          desktopHint: "🚧 Coming Soon!<br><br>This feature is currently under development.<br>Check back soon for updates!",
          mobileHint: "🚧 Coming Soon!<br><br>This feature is currently under development.<br>Check back soon for updates!"
        };
    }
  });

  return {
    helpContent
  };
} 