import router from "@/router";

export function navigateTo(navPath: string){
    router.push({
        path: navPath
    });
}