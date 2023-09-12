function calcWeekAgoRate1 (value) {
    if (value <= -15) {
        return 'rgba(255, 50, 0, 1)'
    } else if (value > -15 && value < 0) {
        return 'rgba(255, 165, 0, 1)'
    } else if (value === 0) {
        return 'rgba(255, 255, 0, 1)'
    } else if (value > 0 && value < 15) {
        return 'rgba(0, 255, 0, 1)'
    } else {
        return 'rgba(0, 128, 0, 1)'
    }
}

export default ({ app }, inject) => {
    inject('calcWeekAgoRate1', calcWeekAgoRate1)
}
