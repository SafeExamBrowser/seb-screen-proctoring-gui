type GroupResponse  = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    sort: string;
    content: Group[];
}

type Group = {
    id: number;
    uuid: string;
    name: string;
    description: string;
    owner: string;
    creationTime: number;
    lastUpdateTime: number;
    terminationTime: number;
    entityPrivileges: EntityPrivilege[];
    active: boolean;
    exam: ExamView;
}


type EntityPrivilege = {
    id: number;
    entityType: string;
    entityId: number;
    userUuid: string;
    privileges: string;
}

type GroupUuid = {
    uuid: string;
    name: string;
    description: string;
    numberOfSessions: number;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortOrder: string;
    screenshots: Screenshot[];
    exam: ExamView;
}