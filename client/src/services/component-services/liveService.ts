import { useAuthStore } from "@/store/app";

export function createImageLinkWithToken(screenshot: ScreenshotData | undefined, timestamp: number): string {
    const authStore = useAuthStore();

    if(screenshot == null){
        return "";
    }

    const screenshotLink: string = screenshot.latestImageLink + "?access_token=" + authStore.getAccessToken();

    if(screenshot.active){
        return screenshotLink + '&t=' + timestamp;
    }

    return screenshotLink;
}
