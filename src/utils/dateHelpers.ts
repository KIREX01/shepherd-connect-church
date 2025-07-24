export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function isUpcoming(date: string | Date): boolean {
  return new Date(date) > new Date()
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMs = targetDate.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Tomorrow"
  if (diffInDays === -1) return "Yesterday"
  if (diffInDays > 1) return `In ${diffInDays} days`
  if (diffInDays < -1) return `${Math.abs(diffInDays)} days ago`

  return formatDate(date)
}
