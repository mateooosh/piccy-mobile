const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const minute = 1000 * 60;
const hour = 1000 * 60 * 60;
const day = 1000 * 60 * 60 * 24;

const displayTime = date => {
  let now = new Date();
  let diff = now - new Date(date);

  if (diff < minute)
    return 'Now';

  else if (diff >= minute && diff < hour) {
    return (Math.floor(diff / minute) === 1) ? Math.floor(diff / minute) + ' minute ago' : Math.floor(diff / minute) + ' minutes ago';
  } else if (diff >= hour && diff < day) {
    return (Math.floor(diff / hour) === 1) ? Math.floor(diff / hour) + ' hour ago' : Math.floor(diff / hour) + ' hours ago';
  } else if (diff >= day && diff < 7 * day) {
    return (Math.floor(diff / day) === 1) ? Math.floor(diff / day) + ' day ago' : Math.floor(diff / day) + ' days ago';
  } else if (diff >= 7 * day && diff < 365.25 * day) {
    return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()];
  } else if (diff >= day * 365.25) {
    return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()] + ' ' + new Date(date).getFullYear();
  }
}

const displayTimeV2 = date => {
  let now = new Date();
  date = new Date(date);

  if (now.getDay() === date.getDay()) {
    return `${date.getHours()}:${prefixTime(date.getMinutes())}`
  }

  return displayTimeV3(date);
}

const displayTimeV3 = date => {
  date = new Date(date);

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let hours = date.getHours() + 1;
  let minutes = date.getMinutes() + 1;

  day = (day < 10) ? `0${day}` : day;
  month = (month < 10) ? `0${month}` : month;
  hours = (hours < 10) ? `0${hours}` : hours;
  minutes = (minutes < 10) ? `0${minutes}` : minutes;

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const prefixTime = value => {
  if (value < 10) {
    return `0${value}`;
  }
  return value;
}


module.exports.displayTime = displayTime
module.exports.displayTimeV2 = displayTimeV2
module.exports.displayTimeV3 = displayTimeV3