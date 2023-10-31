import {navigateTo} from "@/router/navigation";

export function calcDefaultItemsPerPage(itemList: any): number {
    if (itemList == null || itemList.length == 0) {
        return 0;
    }

    if (itemList.length < 5) return itemList.length;
    if (itemList.length < 10) return 5;
    if (itemList.length < 15) return 10;

    return 15;
}

export function calcItemsPerPage(itemList: any): { value: number, title: string }[] {
    if (itemList == null || itemList.length == 0) {
        return [
            { value: 0, title: "0" }
        ];
    }

    if (itemList.length < 5) {
        return [
            { value: itemList.length, title: 'All' }
        ];
    }

    if (itemList.length < 10) {
        return [
            { value: 5, title: '5' },
            { value: itemList.length, title: 'All' }
        ];
    }

    if (itemList.length < 15) {
        return [
            { value: 5, title: '5' },
            { value: 10, title: '10' },
            { value: itemList.length, title: 'All' }
        ];
    }

    return [
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 15, title: '15' },
        { value: itemList.length, title: 'All' }
    ];
}

export function handleTabKeyEvent(event: any, action: string, key: number, optional?: {path?: string, headerRefs?: any}){
    if (event.key == 'Enter' || event.key == ' ') {

        if(action == "sort"){
            sortTable(key, optional?.headerRefs)
        }

        if(action == "navigate"){
            navigateTo(optional?.path!);
        }
    }
}


export function sortTable(key: number, headerRefs: any){
    if(headerRefs.value != null){

        console.log("headersRefs.value")

        headerRefs.value[key].click();
        return;
    }

    if(headerRefs != null){

        console.log("headersRefs")

        headerRefs[key].click();
    }
}