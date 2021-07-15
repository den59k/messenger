export function numeral(count, one, two, five){
	if(!count) count = 0;
	//десять-девятнадцать
	if(count%100/10>>0 === 1)
		return five;
	//ноль, пять-девять
	if(count%10 >= 5 || count%10===0)
		return five;
	//один
	if(count%10 === 1)
		return one;

	//две-четыре
	return two;
}

export function num(count, one, two, five){
	return count + " " + numeral(count, one, two, five)
}


const months = [
	'января',
	'февраля',
	'марта',
	'апреля',
	'мая',
	'июня',
	'июля',
	'августа',
	'сентября',
	'октября',
	'ноября',
	'декабря',
]

function _ (i){
	if(i < 10) return '0'+i
	return i
}

//Функция для получения времени
export function getTime(time, short = false){

	const delta = Math.floor((Date.now() - time) / 60 / 1000)

	if(delta <= 0)
		return "только что"
	if(delta === 1)
		return "минуту назад"
	if(delta < 30)
		return num(delta, 'минуту', 'минуты', 'минут') + ' назад'
	
	const date = new Date(time)
	const nowDate = new Date()


	if(delta < 24 * 60 && date.getDate() === nowDate.getDate())
		if(short)
			return date.getHours() + ':' + _(date.getMinutes())
		else
			return 'сегодня в ' + date.getHours() + ':' + _(date.getMinutes())

	if(delta < 24 * 2 * 60 && nowDate.getDate() - date.getDate()  === 1)
		if(short)
			return 'вчера'
		else
			return 'вчера в ' + date.getHours() + ':' +  _(date.getMinutes())

	if(short)
		return date.getDate() + ' ' + months[date.getMonth()]
	else
		return date.getDate() + ' ' + months[date.getMonth()] + ' в ' + date.getHours() + ':' +  _(date.getMinutes())
}

export function time(time){
	const date = new Date(time)
	return date.getHours()+":"+_(date.getMinutes())
}