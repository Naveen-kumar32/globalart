// All copy taken from the original globalart.in website.

export const COLORS = {
  blue: "#0095DA",
  violet: "#7C5CFF",
  pink: "#FF5CA8",
  yellow: "#FFC93C",
  mint: "#2ED3A4",
  peach: "#FF8A5B",
  ink: "#14123A",
};

export const STATS = [
  { value: 22, label: "Countries", suffix: "" },
  { value: 650, label: "Centres worldwide", suffix: "+" },
  { value: 275000, label: "Children benefited", suffix: "+", indian: true },
  { value: 21, label: "Years in India", suffix: "" },
];

export const BENEFITS = [
  { icon: "💡", title: "Out-of-the-box thinking", text: "An enhanced level of creativity — children learn to create, not copy. Every artwork is uniquely theirs.", color: "#0095DA" },
  { icon: "🎯", title: "Sharper focus", text: "Improved observation and better concentration that shows up in school work, projects and exams.", color: "#FF5CA8" },
  { icon: "🦁", title: "Confidence & smartness", text: "Children proudly share ideas in class, school plays and competitions.", color: "#FFC93C" },
  { icon: "🗣️", title: "Self-expression", text: "Higher levels of self-expression. Colouring helps kids vent feelings in a healthy, happy way.", color: "#2ED3A4" },
  { icon: "🚀", title: "Future careers", text: "A foundation for advertising, animation, architecture, product, interior & fashion design and more.", color: "#7C5CFF" },
  { icon: "🌿", title: "Stress buster", text: "After a busy school day, two hours of colour and creativity is the perfect way to unwind.", color: "#FF8A5B" },
];

export const FEATURES = [
  "Structured and systematic curriculum",
  "International teaching standards",
  "Professionally trained & child-friendly teachers",
  "Small batch size to ensure individual attention",
];

export const COURSES = [
  {
    id: "foundation", name: "Foundation", age: "Ages 5–7", levelsCount: 3, color: "#FFC93C", icon: "🐣",
    lead: "Elementary concepts of drawing and colouring.",
    levels: [
      ["Level 1 & 2", "Basics of drawing & colouring — joining dots, cut & paste, completing drawings."],
      ["Level 3", "Higher complexity. Creativity is encouraged, with some guidelines still given."],
    ],
  },
  {
    id: "prebasic", name: "Pre-Basic", age: "After Foundation", levelsCount: 1, color: "#FF5CA8", icon: "🔍",
    lead: "For children who have completed the Foundation levels.",
    levels: [["Level 1", "Free-hand, observation and grid drawing using the elements of art — exploring objects, animals and human subjects."]],
  },
  {
    id: "basic", name: "Basic", age: "Ages 8+", levelsCount: 3, color: "#2ED3A4", icon: "🖍️",
    lead: "Development of ideas, basic composition, drawing through shapes & references.",
    levels: [
      ["Level 1", "Basic skills of drawing, background creation and colouring."],
      ["Level 2", "Raises the bar — imagine different positions and depict an action sequence."],
      ["Level 3", "Human features from every angle — head, hair, face, hands, feet — characters across 3 generations and emotions."],
    ],
  },
  {
    id: "intermediate", name: "Intermediate", age: "After Basic", levelsCount: 3, color: "#7C5CFF", icon: "🎭",
    lead: "More complex ideas, varied & detailed composition, mixed media in colouring.",
    levels: [
      ["Level 1", "Human-based themes through figures, characters & professions."],
      ["Level 2", "Human-figure illustrations based on different themes and concepts."],
      ["Level 3", "Explore and create complex day-to-day scenes from the child’s own life."],
    ],
  },
  {
    id: "advanced", name: "Advanced", age: "After Intermediate", levelsCount: 3, color: "#0095DA", icon: "🏆",
    lead: "For students who complete Intermediate Level 3.",
    levels: [
      ["Drawing & Sketching", "Drawing through observation & references, with pencil shading techniques."],
      ["Painting", "A composite knowledge of painting."],
      ["Illustration", "Development of ideas, advanced composition — posters & illustrations."],
    ],
  },
];

export const CAREERS = ["Advertising", "Animation", "Architecture", "Computer Graphics", "Product Packaging", "Interior Design", "Fashion Design", "Innovation"];

export const TESTIMONIALS = [
  { name: "Mahima Purohit", meta: "Parent of Jhankaar · Shyam Nagar, Jaipur", text: "Globalart has improved my daughter’s drawing & sketching skills in a great way. My child has already opened up her wings and is flying high — she’s won prizes in school, inter-school & international competitions." },
  { name: "Ms. Gauri Gupta", meta: "Parent of Manasvi · Model Town-III, Delhi", text: "She is an art lover and I always wished for a place that would bring out her skills. She finds the classes so interesting she has never missed one. The teachers are very cordial and loving." },
  { name: "Ms. Vidhya", meta: "Parent of P Renusri (9) · Peelamedu, Coimbatore", text: "My daughter has been with Globalart for more than three years. I found a lot of changes in her creativity & thought process in the first few months of joining." },
  { name: "Mr. Narender Reddy Gaddam", meta: "Parent of Sreejith (8) & Sreenidh (7) · Kadugodi, Bengaluru", text: "I can see a lot of progress in their creativity since they joined 2 years ago. They have won a lot of prizes since. I’ve recommended Globalart to many of my friends." },
  { name: "Dr. Vijaya Kumar", meta: "Parent of Aneesh (9) · Dilsukh Nagar, Hyderabad", text: "His creativity, mixing of colours, patience and concentration have improved a lot. Thank you Global Art for moulding Aneesh and helping him chase his dreams." },
  { name: "Dr. Ramanuj Narayan", meta: "Parent of Shriyaditta (9) · Habsiguda, Hyderabad", text: "Improvement in her drawing & colouring was only a small part of the benefit. She has become very confident and is happy to come up with innovative ideas." },
  { name: "Ms. Shweta Nahar", meta: "Parent of Pragyaa (7) · Alwarpet, Chennai", text: "“Creativity at its best” — never thought I could feel it so early. She has even made a few dress designs which left me spellbound." },
  { name: "Dr. Solanki", meta: "Parent of Ananya (10) · Shyam Nagar, Jaipur", text: "Earlier she asked for help with school projects. Now she does them herself — and comes up with innovative ideas for school plays too." },
];

export const EXPERTS = [
  { name: "Prof. Pradyumna Vyas", meta: "Former Director, National Institute of Design (NID), Ahmedabad", text: "Globalart is an excellent attitude building exercise and I see many of these children going on to become thought leaders for building this nation." },
  { name: "Dr. Anitha Manohar", meta: "Director, National Institute of Fashion Technology, Chennai", text: "Creativity helps children growing to be more confident and successful in diverse fields. Increasingly parents are appreciating the importance of creativity." },
];

export const ENDORSEMENTS = [
  { icon: "🏆", title: "Limca Book of Records", meta: "Mumbai · 23 Dec 2007" },
  { icon: "🎓", title: "Limkokwing University", meta: "Endorsed by Limkokwing University" },
  { icon: "🖌️", title: "Lefranc & Bourgeois", meta: "Accreditation by the French fine-art materials house" },
  { icon: "🌏", title: "WorldWide Achievers", meta: "Asia Education Summit 2015" },
];

export const TIMELINE = [
  { year: "1999", title: "Globalart begins", text: "Founder Mahair Goh launches the first systematic art programme to develop children’s creativity." },
  { year: "2005", title: "Hello, India!", text: "Launched by SIP Academy — the first centre opens in Chennai in May 2005." },
  { year: "2007", title: "Limca Book of Records", text: "A record-setting moment in Mumbai on 23 December 2007." },
  { year: "2015", title: "WorldWide Achievers", text: "Certificate at the Asia Education Summit 2015." },
  { year: "2026", title: "21 years in India", text: "Celebrating 21 years of nurturing creativity in children across India." },
];

export const COUNTRIES = [
  ["India", 21, 78, "🇮🇳"], ["Australia", -25, 134, "🇦🇺"], ["Brunei", 4.5, 114.7, "🇧🇳"], ["Cambodia", 12.5, 105, "🇰🇭"],
  ["Canada", 56, -106, "🇨🇦"], ["China", 35, 104, "🇨🇳"], ["Hong Kong", 22.3, 114.2, "🇭🇰"], ["Indonesia", -2, 118, "🇮🇩"],
  ["Laos", 19.8, 102.5, "🇱🇦"], ["Malaysia", 4, 102, "🇲🇾"], ["Morocco", 31.8, -7, "🇲🇦"], ["Myanmar", 21.9, 96, "🇲🇲"],
  ["Philippines", 12.9, 122, "🇵🇭"], ["Saudi Arabia", 24, 45, "🇸🇦"], ["Singapore", 1.35, 103.8, "🇸🇬"], ["Sri Lanka", 7.9, 80.7, "🇱🇰"],
  ["Thailand", 15.9, 101, "🇹🇭"], ["USA", 38, -97, "🇺🇸"], ["Vietnam", 14, 108, "🇻🇳"],
];

export const FAQS = [
  { q: "How is Globalart going to benefit my child?", a: ["Enhanced level of creativity — “the ability to think out-of-the-box”", "Higher levels of self-expression", "Improved observation and better concentration", "Increased confidence and smartness", "Builds the foundation for varied career options in the future", "Acts as an effective stress buster"] },
  { q: "Will Globalart help in school?", a: "Definitely. Globalart fosters creativity, so over time children come up with creative ideas — in essay writing, simple experiments, group discussions & debates, and of course painting. Since the programme builds better observation and concentration, children fare well in different school activities." },
  { q: "What is the recommended age to start, and why?", a: "The recommended age to start the Foundation course is 5 years. By then children have the fine motor skills to hold a pencil with a firm grip and can sit reasonably patiently for the 2-hour class. Foundation activities like joining dots and cutting / tearing paper further improve fine motor skills." },
  { q: "What is ‘Creativity’?", a: "Creativity is a mental and social process involving the discovery of new ideas or concepts, or new associations between existing ones. Simply put, it is the act of making something new." },
  { q: "How is ‘Creativity’ different from ‘Talent’?", a: "Talent usually means being good in a certain field. Creativity is a point of view — an approach to the mundane that transforms an ordinary object into something truly unique. Creativity may be exhibited in every sphere of life." },
  { q: "Why more colouring than drawing in the Foundation levels?", a: ["Children love colours and respond to them instantly — colour helps them observe, categorise and organise the world.", "Understanding colour is a tool for learning across the curriculum, from maths and science to language and reading.", "Colouring helps children vent feelings and emotions, and is a lovely way to de-stress after schoolwork."] },
  { q: "How is Globalart different from other drawing courses?", a: "A well-defined, structured syllabus that conforms to international teaching standards, with drawing, colouring and creativity as evaluation parameters. Each child’s creation is unique — they learn to create, not copy. We guide children to visualise, comprehend and experiment with subjects, backgrounds, colours and composition." },
  { q: "Do you teach ‘short cuts’ on how to draw?", a: "We don’t teach shortcuts, because we believe all children are naturally creative — what’s simple for one child may not be for another. We do teach easy, systematic ways to draw objects like the sun, trees, flowers, animals and people." },
  { q: "What is the aim of the Globalart programme?", a: "To nurture the creativity and intellectual potential of our students using art as a tool — developing imagination and a more sensitive response to the natural and man-made world." },
  { q: "My child has great ideas but struggles to draw them. Can Globalart help?", a: "Yes! Once a child has their own idea, the instructor helps with simple techniques — finger drawing, point-to-point drawing or drawing through shapes — plus lots of questioning to compose the picture. Because it’s their own idea, children participate far better." },
];

export const OFFICES = [
  { tag: "All India", name: "Ms. Namrata Mukherjee", role: "Business Head – All India", addr: "M-71, 1st Floor (Mezzanine), M Block Market, GK 2, New Delhi-110048", phone: "+91 99714 67770", email: "namrata@sipacademyindia.com" },
  { tag: "Tamil Nadu", name: "Mr. Mangalsamy", role: "State Head – Tamil Nadu", addr: "Apex Chambers, 1st Floor, 35 Sir Thyagaraya Road, Pondy Bazaar, T. Nagar, Chennai – 600 017", phone: "+91 95662 62366", email: "mangal@sipacademyindia.com" },
  { tag: "Chennai", name: "Ms. Sumathi Ravi", role: "Area Head – Chennai North & West", addr: "Apex Chambers, Pondy Bazaar, T. Nagar, Chennai", phone: "+91 99403 79144", email: "sumathi@sipacademyindia.com" },
  { tag: "Western TN", name: "Mr. Sabarish S", role: "Associate Area Head – Western Tamil Nadu", addr: "", phone: "+91 90030 34116", email: "sabarish@sipacademyindia.com" },
  { tag: "Karnataka", name: "Mr. Saliil Arakkal", role: "State Head – Karnataka", addr: "Prestige Tech Platina, Outer Ring Road, Kadubeesanahalli, Bengaluru – 560 103", phone: "+91 96110 60022", email: "saliil@sipacademyindia.com" },
  { tag: "AP & Telangana", name: "Mr. Srinivas Mashetty", role: "State Head – AP & Telangana", addr: "Sterling House, Paigah Colony, Patigadda, Secunderabad – 500003", phone: "+91 99663 47744", email: "srinivas@sipacademyindia.com" },
];

export const INDIA_STATES = ["Andhra Pradesh", "Andaman and Nicobar Islands", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

export const LINKS = {
  login: "https://www.sipacademysoftware.com/fa-ga/login",
  kreativestar: "https://www.globalart.in/kreativestar/",
  comic: "https://globalart.in/cartoon&comic_clash.pdf",
  franchiseForm: "https://www.globalart.in/franchisee/",
  gallery: "https://www.globalart.in/media-gallery/",
  privacy: "https://www.globalart.in/privacy-policy/",
  video: "https://globalart.in/video/testimonial/SIP_Academy_20Y_ShruthiLakshmi.mp4",
  facebook: "https://www.facebook.com/GlobalArt?fref=ts",
  instagram: "https://www.instagram.com/globalartindia/?hl=en",
  youtube: "https://www.youtube.com/channel/UCr-OUqgG0U6vEycU5cJvYYg",
  twitter: "https://twitter.com/globalartindia",
  sip: "http://www.sipacademyindia.com/",
};
