import {navigateTo} from "@/router/navigation";

export function calcDefaultItemsPerPage(itemList: any): number {
    if (itemList == null || itemList.length == 0) {
        return 0;
    }

    if (itemList.length < 5) return itemList.length;
    //@nadim coz it is annoying to have like 8 entries but only see 5 of it per default. this only starts to matter after 20ish entries.
    if (itemList.length < 10) return 10;
    if (itemList.length < 15) return 15;

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
        headerRefs.value[key].click();
        return;
    }

    if(headerRefs != null){
        headerRefs[key].click();
    }
}