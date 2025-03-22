// Sample family tree data
export const familyTree = {
  id: '1',
  name: 'John Smith',
  birthDate: '1920-03-15',
  deathDate: '1990-11-22',
  avatar: 'https://placekitten.com/100/100',
  children: [
    {
      id: '2',
      name: 'Mary Johnson',
      birthDate: '1945-06-20',
      avatar: 'https://placekitten.com/101/101',
      children: [
        {
          id: '4',
          name: 'Sarah Wilson',
          birthDate: '1970-04-12',
          avatar: 'https://placekitten.com/102/102',
          children: []
        }
      ]
    },
    {
      id: '3',
      name: 'Robert Smith',
      birthDate: '1948-09-03',
      avatar: 'https://placekitten.com/103/103',
      children: [
        {
          id: '5',
          name: 'James Smith',
          birthDate: '1975-12-25',
          avatar: 'https://placekitten.com/104/104',
          children: []
        }
      ]
    }
  ]
};

// Sample stories data
export const stories = [
  {
    id: 1,
    title: "The Great Migration West",
    date: "1925-06-15",
    description: "How our family made the journey from New York to California in 1925, seeking new opportunities during the roaring twenties.",
    coverImage: "/images/placeholders/migration.jpg",
    theme: "Migration",
    location: "New York to California",
    people: ["John Smith", "Mary Smith", "Robert Smith"],
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    id: 2,
    title: "Grandma's Secret Recipe",
    date: "1940-12-25",
    description: "The story behind our family's traditional holiday cookies, passed down through four generations.",
    coverImage: "/images/placeholders/recipe.jpg",
    theme: "Traditions",
    location: "Chicago, Illinois",
    people: ["Elizabeth Johnson", "Sarah Johnson"],
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam."
  },
  {
    id: 3,
    title: "The Family Business",
    date: "1952-03-10",
    description: "How grandfather started our family's first hardware store in downtown Seattle.",
    coverImage: "/images/placeholders/business.jpg",
    theme: "Business",
    location: "Seattle, Washington",
    people: ["William Johnson", "Robert Johnson"],
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit."
  }
];

// Sample themes
export const themes = [
  { id: "migration", name: "Migration", count: 1 },
  { id: "traditions", name: "Traditions", count: 1 },
  { id: "business", name: "Business", count: 1 },
  { id: "weddings", name: "Weddings", count: 0 },
  { id: "holidays", name: "Holidays", count: 0 }
];

// Sample locations
export const locations = [
  { id: "ny", name: "New York", count: 1 },
  { id: "ca", name: "California", count: 1 },
  { id: "il", name: "Chicago, Illinois", count: 1 },
  { id: "wa", name: "Seattle, Washington", count: 1 }
]; 