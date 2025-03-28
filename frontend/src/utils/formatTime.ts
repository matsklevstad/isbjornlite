export function getTimeSince(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Format exact time as HH:MM
  const formatTimeOnly = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (diffMins === 0) {
    return "NÅ";
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
