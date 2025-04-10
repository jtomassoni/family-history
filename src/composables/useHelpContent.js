import { computed } from 'vue';
import { useRoute } from 'vue-router';

// Organized by categories for better maintenance
const italianAmericanFacts = {
  culture: [
    "The term 'Little Italy' first appeared in print in 1885 to describe densely populated Italian immigrant neighborhoods, where communities recreated elements of life back in Italy—shared language, customs, and Catholic traditions.",
    "The San Gennaro Festival in New York's Little Italy, begun in 1926 by Neapolitan immigrants, honors the patron saint of Naples and has grown into the largest Italian-American street festival in the U.S.",
    "The 'Feast of the Seven Fishes,' observed on Christmas Eve, was brought to America by southern Italian immigrants, reflecting a Catholic tradition of abstaining from meat and celebrating with multiple seafood dishes.",
    "Italian-American families popularized 'Sunday Sauce' (also called 'gravy'), a slow-cooked tomato sauce with meat, adapted from regional Italian recipes and reflecting a tradition of extended family meals and frugality.",
    "Bocce, an ancient Italian ball sport, became a cornerstone of social life in Italian-American communities, symbolizing leisure and camaraderie, especially in urban immigrant enclaves.",
    "Italian-American social clubs, originally founded as mutual aid societies in the late 19th century, provided support, networking, and cultural continuity for immigrants facing poverty and discrimination.",
    "Many Italian-American families continue the Old World tradition of making homemade wine, often using techniques passed down from ancestors in southern Italy and enjoyed during communal meals.",
    "The 'cookie table,' featuring dozens of homemade Italian cookies at weddings, is a tradition rooted in Abruzzese immigrant communities in the Midwest, especially around Youngstown, Ohio.",
    "Candy-coated almonds, known as 'confetti,' are a staple at Italian weddings, symbolizing the bittersweet nature of marriage—a custom preserved and cherished in Italian-American ceremonies."
  ],
  food: [
    "Lombardi's, the first pizzeria in the U.S., opened in 1905 in Manhattan's Little Italy, bringing Neapolitan pizza to American soil and laying the foundation for a national obsession.",
    "Chicken parmesan, an Italian-American invention, adapted elements of southern Italian cooking (like eggplant parmigiana) and American tastes for meat-centric dishes and rich sauces.",
    "The muffuletta sandwich was created by Sicilian immigrants in New Orleans who combined Italian meats and olive salad with French bread to suit local tastes and ingredients.",
    "Caffè Reggio in New York City installed America's first espresso machine in 1927, introducing Italian coffee culture to an American audience and inspiring generations of cafés.",
    "'Pizza al taglio' (pizza by the slice), popularized by Italian-Americans, reimagined traditional Roman street food into the convenient, fast-food format beloved across the U.S.",
    "Italian immigrants introduced gelato to America in the early 20th century, with their artisan approach influencing modern ice cream shops and dessert trends.",
    "The Italian beef sandwich originated in Chicago's Italian-American community in the 1930s, reflecting a resourceful use of inexpensive cuts of meat stewed with spices and served thin-sliced.",
    "The submarine sandwich (also called hoagie, grinder, or hero) is widely attributed to Italian immigrants in New England, combining cured meats, cheeses, and Italian bread into a portable meal.",
    "The rainbow cookie, with layers dyed in the colors of the Italian flag, was invented in Italian-American bakeries to express pride in Italian heritage while appealing to American sweet tooths."
  ],
  history: [
    "In 1891, 11 Italian immigrants were lynched in New Orleans, marking the largest mass lynching in U.S. history—an event that highlighted anti-Italian sentiment and led to formal diplomatic protests from Italy.",
    "Anthony Michalek, elected in 1904, was one of the first Italian-Americans to serve in the U.S. Congress, symbolizing early political representation for a marginalized immigrant group.",
    "During World War II, thousands of Italian-Americans were labeled 'enemy aliens,' facing curfews and relocation despite many having lived in the U.S. for decades—showing the tension between identity and loyalty.",
    "The American Mafia, which took root in Italian immigrant neighborhoods, was partly a response to discrimination and the need for community protection and economic survival, though it later became a national criminal enterprise.",
    "John O. Pastore, elected governor of Rhode Island in 1945, became the first Italian-American to hold such a post, breaking ethnic barriers and advancing Italian-American political visibility.",
    "Antonin Scalia, appointed to the U.S. Supreme Court in 1986, became the first Italian-American justice, known for his originalist interpretations of the Constitution and strong legal influence.",
    "Ella T. Grasso, elected to Congress in 1970 and later governor of Connecticut, became the first Italian-American woman to hold high elected office, championing labor and women's rights.",
    "The Italian-American Civil Rights League was founded in 1970 to fight defamation and stereotypes, particularly against depictions of Italians solely as mobsters or criminals in the media.",
    "The first Columbus Day celebration in America was held in San Francisco in 1869 by Italian immigrants, honoring an Italian explorer and affirming cultural pride during a time of growing anti-immigrant sentiment."
  ],
  achievements: [
    "Bank of America was originally founded as the Bank of Italy in 1904 by Amadeo Giannini in San Francisco to serve Italian immigrants and others underserved by traditional banks. It eventually became one of the world's largest financial institutions.",
    "Antonio Santi, one of the earliest Italian-American millionaires, amassed wealth during the California Gold Rush and invested it back into community-building efforts for fellow immigrants.",
    "Enrico Fermi, a Nobel Prize-winning Italian physicist who immigrated to the U.S. to escape fascism, led the team that developed the world's first nuclear reactor, profoundly shaping modern science.",
    "Frank Sinatra, the son of Sicilian immigrants, broke entertainment barriers as the first Italian-American to win an Academy Award for acting (1953) and became a cultural icon of American music and style.",
    "Joe DiMaggio, the son of Italian fishermen, achieved one of baseball's greatest feats—a 56-game hitting streak in 1941—becoming a national hero and symbol of immigrant success.",
    "Mother Frances Xavier Cabrini, canonized in 1946, became the first American saint, recognized for her missionary work with poor Italian immigrants in the U.S. and founding schools and hospitals.",
    "Fiorello La Guardia, New York City's first Italian-American mayor, served three transformative terms during the Great Depression and WWII, reshaping city governance and standing against corruption.",
    "Arturo Toscanini, a renowned Italian conductor, became the first leader of the NBC Symphony Orchestra in 1937, bringing classical music into American living rooms via radio.",
    "Frank Capra, born in Sicily and raised in California, directed 'It's a Wonderful Life' (1946), now a holiday staple that reflects themes of community and moral resilience."
  ],
  contributions: [
    "Italian immigrants played a vital role in constructing major American infrastructure—especially the New York subway system—bringing with them skilled labor, engineering knowledge, and a legacy of Roman construction techniques.",
    "The Bank of America building in San Francisco, completed in 1969, was the tallest structure on the West Coast at the time and a symbol of Italian-American founder Amadeo Giannini's lasting economic vision.",
    "Italian-American architects contributed to American skylines, including Cass Gilbert, whose designs shaped the U.S. Supreme Court building, blending classical Roman influences with modern ideals.",
    "Italian stonemasons were central to the creation of Washington D.C.'s monuments and government buildings, drawing on centuries-old techniques rooted in Renaissance and Roman craftsmanship.",
    "Italian-American labor leaders, like Carlo Tresca and Luigi Antonini, fought for workers' rights in dangerous industries, helping form unions and better working conditions in the 20th century.",
    "Sicilian and Tuscan immigrants brought winemaking traditions to California in the 19th century, helping build what is now a global wine powerhouse by introducing Old World viticulture techniques.",
    "Italian-American engineers and mechanics contributed significantly to the rise of Detroit's auto industry, working on production lines and pioneering methods of machine design and maintenance.",
    "Italian-American artists and writers helped shape the early comic book industry, with creators like Joe Orlando and Carmine Infantino defining the look of iconic characters and stories.",
    "Italian farmers introduced advanced techniques for irrigation and crop rotation in California, transforming arid land into fertile agricultural hubs and influencing the modern American food supply."
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