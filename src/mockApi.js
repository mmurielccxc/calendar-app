export const getMockedSlots = (date) => {
    const weekday = new Date(date).getDay();
    if (weekday === 0 || weekday === 6) return [];
    return ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];};