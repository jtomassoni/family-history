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
    id: '1',
    title: 'The Family Farm',
    date: '1955-07-15',
    content: `Our family farm was more than just land and buildings - it was the heart of our family's story. John Smith purchased the 100-acre property in 1955, and it became the setting for countless family memories. The old red barn, still standing today, hosted many summer gatherings and holiday celebrations. Children would play in the hayloft while adults shared stories on the ground floor. The farm represented not just our livelihood, but our family's connection to the land and to each other.`,
    media: [
      {
        url: 'https://picsum.photos/seed/farm/800/600',
        type: 'image'
      }
    ],
    peopleMentioned: [
      {
        id: '1',
        name: 'John Smith',
        avatar: 'https://placekitten.com/100/100'
      },
      {
        id: '2',
        name: 'Mary Johnson',
        avatar: 'https://placekitten.com/101/101'
      }
    ],
    location: {
      id: '1',
      name: 'Springfield, IL'
    },
    tags: ['farm', 'family gatherings', 'traditions']
  },
  {
    id: '2',
    title: 'Wedding Day Memories',
    date: '1969-06-21',
    content: `The summer of '69 brought not just the moon landing, but also one of our family's most cherished memories - Mary's wedding to William Johnson. The ceremony was held in the garden of the family farm, with the old oak tree providing shade for the guests. Robert played the violin, a family tradition passed down through generations. The reception lasted well into the night, with dancing and storytelling under the stars.`,
    media: [
      {
        url: 'https://picsum.photos/seed/wedding/800/600',
        type: 'image'
      }
    ],
    peopleMentioned: [
      {
        id: '2',
        name: 'Mary Johnson',
        avatar: 'https://placekitten.com/101/101'
      },
      {
        id: '3',
        name: 'Robert Smith',
        avatar: 'https://placekitten.com/103/103'
      }
    ],
    location: {
      id: '1',
      name: 'Springfield, IL'
    },
    tags: ['wedding', 'celebrations', 'family traditions']
  },
  {
    id: '3',
    title: 'Christmas of 1975',
    date: '1975-12-25',
    content: `The Christmas of 1975 was particularly special as it marked the arrival of James Smith, born right on Christmas Day. The whole family had gathered at the farm for the holidays, and the celebration turned into a double joy. Sarah, just five years old then, was fascinated by her new cousin. The old family recipes came out - Grandma's sugar cookies, Mom's apple pie - and the house was filled with the warmth of family and the excitement of a new generation.`,
    media: [
      {
        url: 'https://picsum.photos/seed/christmas/800/600',
        type: 'image'
      }
    ],
    peopleMentioned: [
      {
        id: '4',
        name: 'Sarah Wilson',
        avatar: 'https://placekitten.com/102/102'
      },
      {
        id: '5',
        name: 'James Smith',
        avatar: 'https://placekitten.com/104/104'
      }
    ],
    location: {
      id: '1',
      name: 'Springfield, IL'
    },
    tags: ['christmas', 'birth', 'family gatherings']
  }
];

// Sample themes
export const themes = [
  { id: '1', name: 'Family Traditions' },
  { id: '2', name: 'Celebrations' },
  { id: '3', name: 'Life Events' },
  { id: '4', name: 'Farm Life' }
];

// Sample locations
export const locations = [
  { id: '1', name: 'Springfield, IL' },
  { id: '2', name: 'Chicago, IL' },
  { id: '3', name: 'St. Louis, MO' }
]; 