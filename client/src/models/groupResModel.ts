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
}


type EntityPrivilege = {
    id: number;
    entityType: string;
    entityId: number;
    userUuid: string;
    privileges: string;
}

type GroupUuidResponse = {
    uuid: string;
    name: string;
    description: string;
    numberOfSessions: number;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortOrder: string;
    screenshots: Screenshot[];
}
  
type Screenshot = {
    timestamp: number;
    uuid: string;
    clientName: string;
    clientIp: string;
    clientMachineName: string;
    clientOsName: string;
    clientVersion: string;
    imageFormat: string;
    latestImageLink: string;
    imageLink: string;
    metaData: MetaData;
}

type MetaData = {
    additionalProp1: string,
    additionalProp2: string,
    additionalProp3: string
}


  
