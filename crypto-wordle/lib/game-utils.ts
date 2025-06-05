// Word list for daily challenges
const WORD_LIST = [
  "ABOUT",
  "ABOVE",
  "ABUSE",
  "ACTOR",
  "ACUTE",
  "ADMIT",
  "ADOPT",
  "ADULT",
  "AFTER",
  "AGAIN",
  "AGENT",
  "AGREE",
  "AHEAD",
  "ALARM",
  "ALBUM",
  "ALERT",
  "ALIEN",
  "ALIGN",
  "ALIKE",
  "ALIVE",
  "ALLOW",
  "ALONE",
  "ALONG",
  "ALTER",
  "ANGEL",
  "ANGER",
  "ANGLE",
  "ANGRY",
  "APART",
  "APPLE",
  "APPLY",
  "ARENA",
  "ARGUE",
  "ARISE",
  "ARRAY",
  "ASIDE",
  "ASSET",
  "AUDIO",
  "AUDIT",
  "AVOID",
  "AWAKE",
  "AWARD",
  "AWARE",
  "BADLY",
  "BASIC",
  "BEACH",
  "BEGAN",
  "BEGIN",
  "BEING",
  "BELOW",
  "BENCH",
  "BILLY",
  "BIRTH",
  "BLACK",
  "BLAME",
  "BLANK",
  "BLAST",
  "BLIND",
  "BLOCK",
  "BLOOD",
  "BOARD",
  "BOOST",
  "BOOTH",
  "BOUND",
  "BRAIN",
  "BRAND",
  "BRASS",
  "BRAVE",
  "BREAD",
  "BREAK",
  "BREED",
  "BRIEF",
  "BRING",
  "BROAD",
  "BROKE",
  "BROWN",
  "BUILD",
  "BUILT",
  "BUYER",
  "CABLE",
]

// Word list with corresponding hints
const WORD_HINTS: Record<string, string> = {
  ABOUT: "Concerning or regarding something",
  ABOVE: "Higher in position or rank",
  ABUSE: "To use wrongly or treat badly",
  ACTOR: "Someone who performs in plays or movies",
  ACUTE: "Sharp, severe, or having a keen mind",
  ADMIT: "To confess or allow entry",
  ADOPT: "To take in as one's own",
  ADULT: "A fully grown person",
  AFTER: "Following in time or place",
  AGAIN: "Once more or another time",
  AGENT: "Someone who acts on behalf of others",
  AGREE: "To have the same opinion",
  AHEAD: "In front or in advance",
  ALARM: "A warning signal or device",
  ALBUM: "A collection of photos or music",
  ALERT: "Watchful and ready for danger",
  ALIEN: "From another world or foreign",
  ALIGN: "To arrange in a straight line",
  ALIKE: "Similar or the same",
  ALIVE: "Living and breathing",
  ALLOW: "To permit or give permission",
  ALONE: "By oneself, without others",
  ALONG: "Moving in company with",
  ALTER: "To change or modify",
  ANGEL: "A heavenly messenger or kind person",
  ANGER: "Strong feeling of displeasure",
  ANGLE: "The space between two intersecting lines",
  ANGRY: "Feeling or showing annoyance",
  APART: "Separated by distance or time",
  APPLE: "A round fruit that grows on trees",
  APPLY: "To put to use or request formally",
  ARENA: "A place for sports or entertainment",
  ARGUE: "To give reasons for or against",
  ARISE: "To get up or come into being",
  ARRAY: "An impressive display or arrangement",
  ASIDE: "To one side or apart",
  ASSET: "Something valuable or useful",
  AUDIO: "Sound, especially recorded sound",
  AUDIT: "An official inspection of accounts",
  AVOID: "To keep away from or prevent",
  AWAKE: "Not sleeping or alert",
  AWARD: "A prize given for achievement",
  AWARE: "Having knowledge or consciousness",
  BADLY: "In a poor or inadequate way",
  BASIC: "Fundamental or essential",
  BEACH: "Sandy or pebbly shore by the sea",
  BEGAN: "Started (past tense of begin)",
  BEGIN: "To start or commence",
  BEING: "Existence or a living creature",
  BELOW: "At a lower level or position",
  BENCH: "A long seat or work table",
  BILLY: "A common male name or metal pot",
  BIRTH: "The act of being born",
  BLACK: "The darkest color, opposite of white",
  BLAME: "To hold responsible for a fault",
  BLANK: "Empty or without marks",
  BLAST: "A strong gust of wind or explosion",
  BLIND: "Unable to see or lacking awareness",
  BLOCK: "A solid piece or to obstruct",
  BLOOD: "Red liquid that flows in veins",
  BOARD: "A flat piece of wood or committee",
  BOOST: "To help or encourage; increase",
  BOOTH: "A small enclosed compartment",
  BOUND: "Tied up or certain to happen",
  BRAIN: "The organ that controls thinking",
  BRAND: "A trademark or type of product",
  BRASS: "A yellow metal alloy",
  BRAVE: "Showing courage in danger",
  BREAD: "A staple food made from flour",
  BREAK: "To separate into pieces",
  BREED: "To produce offspring or type",
  BRIEF: "Short in duration or concise",
  BRING: "To carry or take along",
  BROAD: "Wide or extensive",
  BROKE: "Having no money or damaged",
  BROWN: "A color like chocolate or wood",
  BUILD: "To construct or create",
  BUILT: "Constructed (past tense of build)",
  BUYER: "Someone who purchases things",
  CABLE: "Thick rope or wire for transmission",
}

export function generateDailyWord(): string {
  // Use current date as seed for consistent daily word
  const today = new Date()
  const dateString = today.toISOString().split("T")[0] // YYYY-MM-DD

  // Simple hash function to convert date to index
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  const index = Math.abs(hash) % WORD_LIST.length
  return WORD_LIST[index]
}

export function getDailyHint(): string {
  const dailyWord = generateDailyWord()
  return WORD_HINTS[dailyWord] || "A common English word"
}

export interface GameStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
}

export function getGameStats(): GameStats {
  if (typeof window === "undefined") {
    return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0 }
  }

  const stored = localStorage.getItem("wordleStats")
  if (stored) {
    return JSON.parse(stored)
  }

  return { gamesPlayed: 0, gamesWon: 0, currentStreak: 0, maxStreak: 0 }
}
