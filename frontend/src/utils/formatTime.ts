export function getTimeSince(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} min siden`;
  } else if (diffHours < 24) {
    const mins = diffMins % 60;
    return `${diffHours}t og ${mins} min`;
  } else {
    return `${diffDays} ${diffDays === 1 ? "dag" : "dager"} siden`;
  }
}
