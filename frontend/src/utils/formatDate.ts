export const formatDate = (dateString: string | Date) => {
    if (!dateString) return "Ukjent dato";
  
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("nb-NO", options);
  };