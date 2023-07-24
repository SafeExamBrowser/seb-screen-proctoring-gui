export function formatTime(milliseconds: number): string {
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