export function formatTimestampToFullDate(timestamp: string | any): string{
  if(timestamp == "0"){
    return "";
  }

  const date = new Date(timestamp);

  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds; 
}

export function formatTimestmapToDate(timestamp: number): string{
  if(timestamp == 0){
    return "";
  }

  const date = new Date(timestamp);

  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();

  return day + "." + month + "." + year; 
}

export function formatTimestmapToTime(timestamp: number): string{
  if(timestamp == 0){
    return "";
  }

  const date = new Date(timestamp);

  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  return hours + ":" + minutes + ":" + seconds; 
}

export function toTimeString(milliseconds: number): string {
  let totalSeconds: number = Math.floor(milliseconds / 1000);

  const hours: number = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes: number = Math.floor(totalSeconds / 60);
  const seconds: number = totalSeconds % 60;

  const hoursString: string = hours.toString().padStart(2, '0');
  const minutesString: string = minutes.toString().padStart(2, '0');
  const secondsString: string = seconds.toString().padStart(2, '0');

  return hoursString + ":" + minutesString + ":" + secondsString;
}

export function toSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
}

export function secondsToTimeString(seconds: number): string{
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}