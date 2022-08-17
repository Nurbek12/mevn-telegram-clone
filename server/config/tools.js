module.exports = {
    GenerateUserColor: () => {
        const colors = ['lime', 'tomato', 
        'cornflowerblue', 'crimson', 'darkorange', 
        'darkturquoise','gold', 
        'deeppink', 'darkorchid']

        const randcolor = Math.floor(Math.random()*colors.length);
        return colors[randcolor];
    },
    getTime(){
        const date = new Date();
        const time = `${date.getHours()>=10?date.getHours():'0'+date.getHours()}:${date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes()}`;
        let month;
        switch(date.getMonth()){
            case 0: month = 'января'; break;
            case 1: month = 'февраля'; break;
            case 2: month = 'марта'; break;
            case 3: month = 'апреля'; break;
            case 4: month = 'мая'; break;
            case 5: month = 'июня'; break;
            case 6: month = 'июля'; break;
            case 7: month = 'августа'; break;
            case 8: month = 'сентября'; break;
            case 9: month = 'октября'; break;
            case 10: month = 'ноября'; break;
            case 11: month = 'декабря'; break;
        }
        const day = `${date.getDate()} ${month}`
        return [time, day]
    },
}