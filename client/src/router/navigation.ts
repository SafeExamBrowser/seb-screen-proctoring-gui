import router from "@/router";
import navigation from "@/router";

export function navigateTo(navPath: string){
    router.push({
        path: navPath
    });
}

export function openUrlInNewTab(url: string){
    //@ts-ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}