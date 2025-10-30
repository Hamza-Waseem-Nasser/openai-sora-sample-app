export interface MarketingTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  prompt: string;
  suggestedModel: "sora-2" | "sora-2-pro";
  suggestedSize: string;
  suggestedSeconds: "4" | "8" | "12";
  tags: string[];
}

export const MARKETING_CATEGORIES = [
  "All Templates",
  "Product Launch",
  "Social Media",
  "Brand Story",
  "Event Promotion",
  "Testimonial",
  "Tutorial",
] as const;

export type MarketingCategory = typeof MARKETING_CATEGORIES[number];

export const MARKETING_TEMPLATES: MarketingTemplate[] = [
  // Product Launch
  {
    id: "product-hero-1",
    category: "Product Launch",
    title: "Hero Product Showcase",
    description: "Cinematic product reveal with dramatic lighting",
    prompt: "A stunning cinematic product reveal shot with dramatic lighting, the camera slowly orbits around a sleek modern product on a minimalist pedestal, volumetric lighting rays piercing through subtle fog, premium aesthetic, high-end commercial photography style, 8K resolution",
    suggestedModel: "sora-2-pro",
    suggestedSize: "1280x720",
    suggestedSeconds: "8",
    tags: ["product", "cinematic", "premium"],
  },
  {
    id: "product-lifestyle-1",
    category: "Product Launch",
    title: "Lifestyle Product Integration",
    description: "Product in real-world lifestyle context",
    prompt: "A warm, inviting lifestyle scene showing a product being used in a modern, beautifully designed home, natural morning sunlight streaming through windows, authentic moments of people enjoying the product, soft focus background, aspirational yet relatable aesthetic",
    suggestedModel: "sora-2",
    suggestedSize: "1280x720",
    suggestedSeconds: "8",
    tags: ["lifestyle", "authentic", "home"],
  },
  {
    id: "product-tech-1",
    category: "Product Launch",
    title: "Tech Product Showcase",
    description: "Futuristic tech product presentation",
    prompt: "A high-tech product showcase in a futuristic environment, holographic UI elements floating around the device, sleek camera movements revealing innovative features, blue and purple neon accents, clean minimalist background, cutting-edge technology aesthetic",
    suggestedModel: "sora-2-pro",
    suggestedSize: "1280x720",
    suggestedSeconds: "12",
    tags: ["technology", "futuristic", "innovation"],
  },

  // Social Media
  {
    id: "social-vertical-1",
    category: "Social Media",
    title: "Instagram Reels Hook",
    description: "Eye-catching vertical format opener",
    prompt: "A vibrant, energetic scene that immediately grabs attention, bold text overlay space, dynamic movement and color, perfect for Instagram Reels or TikTok, trending aesthetic, fast-paced visual storytelling, vertical format optimized",
    suggestedModel: "sora-2",
    suggestedSize: "720x1280",
    suggestedSeconds: "4",
    tags: ["social", "vertical", "attention-grabbing"],
  },
  {
    id: "social-story-1",
    category: "Social Media",
    title: "Behind-the-Scenes",
    description: "Authentic BTS content for engagement",
    prompt: "Authentic behind-the-scenes footage showing the creative process, handheld camera style, natural lighting, genuine moments and interactions, casual and relatable atmosphere, building connection with audience, documentary style",
    suggestedModel: "sora-2",
    suggestedSize: "720x1280",
    suggestedSeconds: "8",
    tags: ["authentic", "BTS", "engagement"],
  },
  {
    id: "social-announcement-1",
    category: "Social Media",
    title: "Announcement Teaser",
    description: "Build anticipation for launches",
    prompt: "An exciting teaser video building anticipation, mysterious reveals with dramatic lighting, countdown elements, energy building through the video, modern design elements, clean typography space, suspenseful music-ready visuals",
    suggestedModel: "sora-2-pro",
    suggestedSize: "1280x720",
    suggestedSeconds: "8",
    tags: ["teaser", "announcement", "suspense"],
  },

  // Brand Story
  {
    id: "brand-origin-1",
    category: "Brand Story",
    title: "Brand Origin Story",
    description: "Emotional brand narrative",
    prompt: "A cinematic brand story narrative showing the journey from humble beginnings to success, warm nostalgic tones transitioning to vibrant modern aesthetics, emotional storytelling through visuals, inspiring and authentic, journey motif",
    suggestedModel: "sora-2-pro",
    suggestedSize: "1792x1024",
    suggestedSeconds: "12",
    tags: ["storytelling", "emotional", "journey"],
  },
  {
    id: "brand-values-1",
    category: "Brand Story",
    title: "Company Values Showcase",
    description: "Visualize brand values and mission",
    prompt: "Abstract visual metaphors representing company values like innovation, sustainability, and community, flowing transitions between concepts, inspiring imagery, diverse people collaborating, natural elements, hopeful and forward-thinking atmosphere",
    suggestedModel: "sora-2-pro",
    suggestedSize: "1280x720",
    suggestedSeconds: "8",
    tags: ["values", "abstract", "inspiring"],
  },

  // Event Promotion
  {
    id: "event-conference-1",
    category: "Event Promotion",
    title: "Conference Promotion",
    description: "Professional event highlight reel",
    prompt: "A dynamic conference promo video showing keynote moments, networking scenes, innovative presentations, modern conference center environment, professional attendees engaged and inspired, energetic pacing, premium corporate aesthetic",
    suggestedModel: "sora-2-pro",
    suggestedSize: "1280x720",
    suggestedSeconds: "8",
    tags: ["event", "professional", "conference"],
  },
  {
    id: "event-concert-1",
    category: "Event Promotion",
    title: "Festival/Concert Hype",
    description: "High-energy event excitement",
    prompt: "Electrifying festival atmosphere with vibrant stage lighting, energetic crowd moments, colorful light shows, dynamic camera movements, pulsing energy, epic scale and excitement, concert and festival vibes, celebration mood",
    suggestedModel: "sora-2",
    suggestedSize: "1280x720",
    suggestedSeconds: "8",
    tags: ["festival", "energy", "celebration"],
  },
  {
    id: "event-save-date-1",
    category: "Event Promotion",
    title: "Save the Date Announcement",
    description: "Elegant event invitation",
    prompt: "An elegant save-the-date video with sophisticated design elements, location establishing shots, date and time elegantly integrated into scenery, inviting atmosphere, premium aesthetic, anticipation building, special occasion feel",
    suggestedModel: "sora-2-pro",
    suggestedSize: "1280x720",
    suggestedSeconds: "4",
    tags: ["invitation", "elegant", "announcement"],
  },

  // Testimonial
  {
    id: "testimonial-success-1",
    category: "Testimonial",
    title: "Customer Success Story",
    description: "Authentic customer transformation",
    prompt: "A genuine customer success story showing before and after transformation, authentic documentary style, real people in real environments, emotional journey, relatable scenarios, trustworthy and inspiring tone, natural lighting",
    suggestedModel: "sora-2",
    suggestedSize: "1280x720",
    suggestedSeconds: "12",
    tags: ["testimonial", "authentic", "transformation"],
  },
  {
    id: "testimonial-review-1",
    category: "Testimonial",
    title: "Product Review Highlight",
    description: "Visual testimonial compilation",
    prompt: "A compilation of diverse people genuinely enjoying and reviewing a product, authentic reactions, multiple environments showing versatility, real-world usage scenarios, trustworthy and relatable aesthetic, positive energy",
    suggestedModel: "sora-2",
    suggestedSize: "1280x720",
    suggestedSeconds: "8",
    tags: ["review", "diverse", "authentic"],
  },

  // Tutorial
  {
    id: "tutorial-howto-1",
    category: "Tutorial",
    title: "How-To Tutorial Intro",
    description: "Engaging tutorial opening",
    prompt: "A clean, professional tutorial video intro showing tools and materials laid out beautifully, top-down flat lay composition, hands entering frame to begin demonstration, clear and organized aesthetic, educational and approachable tone",
    suggestedModel: "sora-2",
    suggestedSize: "1280x720",
    suggestedSeconds: "4",
    tags: ["tutorial", "educational", "organized"],
  },
  {
    id: "tutorial-tips-1",
    category: "Tutorial",
    title: "Quick Tips & Tricks",
    description: "Fast-paced tip demonstration",
    prompt: "Quick-cut tutorial showing helpful tips and tricks in action, fast-paced editing style, clear demonstrations, satisfying before-and-after reveals, modern graphics space, engaging and informative, easy to follow",
    suggestedModel: "sora-2",
    suggestedSize: "720x1280",
    suggestedSeconds: "8",
    tags: ["tips", "fast-paced", "helpful"],
  },
];

export function getTemplatesByCategory(category: MarketingCategory): MarketingTemplate[] {
  if (category === "All Templates") {
    return MARKETING_TEMPLATES;
  }
  return MARKETING_TEMPLATES.filter(template => template.category === category);
}

export function getTemplateById(id: string): MarketingTemplate | undefined {
  return MARKETING_TEMPLATES.find(template => template.id === id);
}

export function searchTemplates(query: string): MarketingTemplate[] {
  const searchLower = query.toLowerCase().trim();
  if (!searchLower) return MARKETING_TEMPLATES;
  
  return MARKETING_TEMPLATES.filter(template => 
    template.title.toLowerCase().includes(searchLower) ||
    template.description.toLowerCase().includes(searchLower) ||
    template.prompt.toLowerCase().includes(searchLower) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
}
