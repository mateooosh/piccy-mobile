const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const displayTime = date => {
  let now = new Date();
  let diff = now - new Date(date);

  const minute = 1000*60;
  const hour = 1000*60*60;
  const day = 1000*60*60*24;

  if(diff < minute)
    return 'Now';

  else if (diff >= minute && diff < hour){
    return (Math.floor(diff/minute) === 1) ? Math.floor(diff/minute) + ' minute ago' : Math.floor(diff/minute) + ' minutes ago';
  }

  else if (diff >= hour && diff < day){
    return (Math.floor(diff/hour) === 1) ? Math.floor(diff/hour) + ' hour ago' : Math.floor(diff/hour) + ' hours ago';
  }

  else if (diff >= day && diff < 7 * day){
    return (Math.floor(diff/day) === 1) ? Math.floor(diff/day) + ' day ago' : Math.floor(diff/day) + ' days ago';
  }

  else if (diff >= 7 * day && diff < 365.25 * day){
    return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()];
  }

  else if (diff >= day * 365.25){
    return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()] + ' ' + new Date(date).getFullYear();
  }
}






module.exports.displayTime = displayTime