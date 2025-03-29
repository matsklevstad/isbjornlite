export function getTimeSince(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Format exact time as HH:MM
  const formatTimeOnly = (date: Date): string => {
    // This will consistently return "00:50" format on both server and client
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (diffMins === 0) {
    return "Nå";
  } else if (diffMins < 60) {
    return `${diffMins} min siden`;
  } else if (diffHours >= 1 && diffHours <= 12) {
    // For posts between 1 and 12 hours old, show the exact time
    return formatTimeOnly(date);
  } else if (diffHours < 24) {
    return `${diffHours}t siden`;
  } else {
    return `${diffDays} ${diffDays === 1 ? "dag" : "dager"} siden`;
  }
}
