export function setWeek() {
    const startDate = new Date('August 9, 2024')
    const todaysDate = new Date()
    const currentWeek = Math.ceil((todaysDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24 * 7))
    document.getElementById("weekid").innerText = currentWeek;
    return currentWeek;
}