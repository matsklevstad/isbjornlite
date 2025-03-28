import greetings from "./greetings.json";

type TimeOfDay = "morning" | "afternoon" | "evening";
type StoredGreeting = {
  text: string;
  timestamp: number;
  username: string;
};

const GREETING_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export function getGreeting(username: string, hour?: number): string {
  try {
    const storedGreetingJSON = localStorage.getItem("userGreeting");
    if (storedGreetingJSON) {
      const storedGreeting: StoredGreeting = JSON.parse(storedGreetingJSON);

      if (storedGreeting.username === username) {
        const now = Date.now();

        if (now - storedGreeting.timestamp < GREETING_DURATION) {
          return storedGreeting.text;
        }
      }
    }
  } catch (error) {
    console.error("Error retrieving stored greeting:", error);
  }

  // If we reach here generate a new greeting
  const currentHour = hour !== undefined ? hour : new Date().getHours();

  // Determine time of day
  let timeOfDay: TimeOfDay;
  if (currentHour >= 5 && currentHour < 12) {
    timeOfDay = "morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    timeOfDay = "afternoon";
  } else {
    timeOfDay = "evening";
  }

  const timeGreetings = greetings[timeOfDay];

  // Get a random greeting
  const randomIndex = Math.floor(Math.random() * timeGreetings.length);
  const greetingTemplate = timeGreetings[randomIndex];
  const greetingText = greetingTemplate.replace("{username}", username);

  // Store the new greeting with current timestamp
  try {
    const newStoredGreeting: StoredGreeting = {
      text: greetingText,
      timestamp: Date.now(),
      username,
    };
    localStorage.setItem("userGreeting", JSON.stringify(newStoredGreeting));
  } catch (error) {
    console.error("Error storing greeting:", error);
  }

  return greetingText;
}
