<template>
  <div class="generation-view">
    <!-- Generation Tree -->
    <div class="generation-tree">
      <div 
        v-for="(generation, index) in generations"
        :key="index"
        class="generation-level"
        :class="{
          'generation-level--active': selectedGeneration === index
        }"
      >
        <div class="generation-header">
          <h2 class="generation-title">
            Generation {{ index + 1 }}
            <span class="generation-years">
              {{ generation.yearRange }}
            </span>
          </h2>
          <div class="generation-stats">
            <div class="stat-item">
              <UsersIcon class="stat-icon" />
              {{ generation.people.length }} people
            </div>
            <div class="stat-item">
              <BookOpenIcon class="stat-icon" />
              {{ generation.stories.length }} stories
            </div>
          </div>
        </div>

        <div class="generation-content">
          <!-- People in Generation -->
          <div class="generation-people">
            <div 
              v-for="person in generation.people"
              :key="person.id"
              class="person-card"
              :class="{
                'person-card--has-stories': personHasStories(person)
              }"
              @click="togglePerson(person)"
            >
              <img 
                v-if="person.avatar"
                :src="person.avatar"
                :alt="person.name"
                class="person-avatar"
              />
              <div class="person-info">
                <span class="person-name">{{ person.name }}</span>
                <span class="person-dates">
                  {{ formatLifespan(person) }}
                </span>
              </div>
              <div 
                v-if="personHasStories(person)"
                class="story-count"
              >
                {{ getPersonStoryCount(person) }}
              </div>
            </div>
          </div>

          <!-- Stories Grid -->
          <div class="stories-grid">
            <div 
              v-for="story in generation.stories"
              :key="story.id"
              class="story-card"
              :class="{
                'story-card--highlight': isStoryHighlighted(story)
              }"
              @click="$emit('story-select', story)"
            >
              <div class="story-media">
                <img 
                  v-if="story.media?.[0]"
                  :src="story.media[0].url"
                  :alt="story.title"
                  class="story-image"
                />
                <div 
                  v-else
                  class="story-placeholder"
                >
                  <BookOpenIcon class="placeholder-icon" />
                </div>
              </div>
              
              <div class="story-content">
                <h3 class="story-title">{{ story.title }}</h3>
                <time :datetime="story.date" class="story-date">
                  {{ formatDate(story.date) }}
                </time>
                <p class="story-excerpt">
                  {{ truncateText(story.content, 100) }}
                </p>
                
                <div class="story-meta">
                  <div class="story-people">
                    <div class="people-avatars">
                      <img 
                        v-for="person in story.peopleMentioned.slice(0, 3)"
                        :key="person.id"
                        :src="person.avatar"
                        :alt="person.name"
                        class="meta-avatar"
                        :title="person.name"
                      />
                      <div 
                        v-if="story.peopleMentioned.length > 3"
                        class="avatar-more"
                        :title="getMorePeopleNames(story)"
                      >
                        +{{ story.peopleMentioned.length - 3 }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="story-tags">
                    <span 
                      v-for="tag in story.tags"
                      :key="tag"
                      class="story-tag"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generation Navigation -->
    <div class="generation-nav">
      <CustomButton
        v-for="(generation, index) in generations"
        :key="index"
        :variant="selectedGeneration === index ? 'primary' : 'text'"
        size="sm"
        @click="scrollToGeneration(index)"
      >
        Gen {{ index + 1 }}
      </CustomButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { UsersIcon, BookOpenIcon } from '@heroicons/vue/24/outline';
import CustomButton from '../../buttons/CustomButton.vue';

const props = defineProps({
  stories: {
    type: Array,
    required: true
  },
  familyTree: {
    type: Object,
    required: true
  },
  selectedGeneration: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['story-select']);

// State
const selectedPerson = ref(null);

// Computed
const generations = computed(() => {
  const gens = [];
  
  // Helper function to traverse the family tree
  const traverse = (node, level = 0) => {
    if (!gens[level]) {
      gens[level] = {
        people: [],
        stories: [],
        yearRange: ''
      };
    }
    
    // Add person to generation
    gens[level].people.push(node);
    
    // Add stories mentioning this person
    const personStories = props.stories.filter(story =>
      story.peopleMentioned?.some(p => p.id === node.id)
    );
    gens[level].stories.push(...personStories);
    
    // Recursively process children
    node.children?.forEach(child => traverse(child, level + 1));
  };
  
  traverse(props.familyTree);
  
  // Remove duplicates and sort stories
  gens.forEach(gen => {
    gen.stories = Array.from(new Set(gen.stories))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate year range
    if (gen.stories.length) {
      const years = gen.stories.map(s => new Date(s.date).getFullYear());
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      gen.yearRange = minYear === maxYear ? 
        `${minYear}` : 
        `${minYear} - ${maxYear}`;
    }
  });
  
  return gens;
});

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatLifespan = (person) => {
  const birth = person.birthDate ? new Date(person.birthDate).getFullYear() : '?';
  const death = person.deathDate ? new Date(person.deathDate).getFullYear() : 
    person.isDeceased ? '?' : 'Present';
  return `${birth} - ${death}`;
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
};

const getMorePeopleNames = (story) => {
  return story.peopleMentioned
    .slice(3)
    .map(person => person.name)
    .join(', ');
};

const personHasStories = (person) => {
  return props.stories.some(story =>
    story.peopleMentioned?.some(p => p.id === person.id)
  );
};

const getPersonStoryCount = (person) => {
  return props.stories.filter(story =>
    story.peopleMentioned?.some(p => p.id === person.id)
  ).length;
};

const togglePerson = (person) => {
  selectedPerson.value = selectedPerson.value?.id === person.id ? null : person;
};

const isStoryHighlighted = (story) => {
  return selectedPerson.value &&
    story.peopleMentioned?.some(p => p.id === selectedPerson.value.id);
};

const scrollToGeneration = (index) => {
  const element = document.querySelector(`.generation-level:nth-child(${index + 1})`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.generation-view {
  position: relative;
  height: 100%;
  overflow: hidden;
}

/* Generation Tree */
.generation-tree {
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.generation-level {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.generation-level--active {
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-primary-200);
}

.generation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.generation-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0;
}

.generation-years {
  font-size: var(--font-size-base);
  color: var(--color-gray-600);
  margin-left: var(--spacing-sm);
}

.generation-stats {
  display: flex;
  gap: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.stat-icon {
  width: var(--font-size-lg);
  height: var(--font-size-lg);
}

.generation-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-lg);
}

/* People Cards */
.generation-people {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.person-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.person-card--has-stories {
  background-color: var(--color-primary-50);
}

.person-card:hover {
  background-color: var(--color-gray-100);
}

.person-card--has-stories:hover {
  background-color: var(--color-primary-100);
}

.person-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  object-fit: cover;
}

.person-info {
  flex-grow: 1;
  min-width: 0;
}

.person-name {
  display: block;
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-900);
}

.person-dates {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.story-count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

/* Stories Grid */
.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.story-card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.story-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.story-card--highlight {
  border: 2px solid var(--color-primary-500);
}

.story-media {
  position: relative;
  height: 150px;
  background-color: var(--color-gray-100);
}

.story-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.story-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  color: var(--color-gray-400);
}

.story-content {
  padding: var(--spacing-md);
}

.story-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-900);
  margin: 0 0 var(--spacing-xs);
}

.story-date {
  display: block;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.story-excerpt {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin: 0 0 var(--spacing-md);
}

.story-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.people-avatars {
  display: flex;
  align-items: center;
}

.meta-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-full);
  border: 2px solid var(--color-white);
  margin-left: -8px;
}

.meta-avatar:first-child {
  margin-left: 0;
}

.avatar-more {
  width: 24px;
  height: 24px;
  border-radius: var(--border-radius-full);
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
  font-size: var(--font-size-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
}

.story-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.story-tag {
  color: var(--color-primary-700);
  font-size: var(--font-size-sm);
}

/* Generation Navigation */
.generation-nav {
  position: fixed;
  bottom: var(--spacing-lg);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
}

/* Responsive Design */
@media (max-width: var(--breakpoint-lg)) {
  .generation-content {
    grid-template-columns: 1fr;
  }

  .generation-people {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: var(--breakpoint-md)) {
  .generation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .stories-grid {
    grid-template-columns: 1fr;
  }

  .generation-nav {
    bottom: var(--spacing-md);
  }
}
</style> 