type OptionalParGroup = {
    pageNumber?: number;
    pageSize?: number;
    sort?: string;
    filterCriteria?: string;
}

type OptionalParGroupByUuid = {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string; 
    filterCriteria?: string;
}

type OptionalParSearchSessions = {
    groupUUID?: string,
    groupName?: string,
    sessionUUID?: string,
    fromTime?: string,
    toTime?: string,
    clientName?: string,
    clientMachineName?: string,
    clientOsName?: string,
    clientVersion?: string,
    pageNumber?: number,
    pageSize?: number,
    sort?: string
}

type OptionalParSearchScreenshots = {
    groupUUID?: string,
    groupName?: string,
    sessionUUID?: string,
    fromTime?: string,
    toTime?: string,
    clientName?: string,
    clientMachineName?: string,
    clientOsName?: string,
    clientVersion?: string,
    screenProctoringMetadataURL?: string,
    screenProctoringMetadataWindowTitle?: string,
    screenProctoringMetadataUserAction?: string,
    pageNumber?: number,
    pageSize?: number,
    sort?: string
}