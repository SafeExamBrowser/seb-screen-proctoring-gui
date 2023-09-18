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
    clientName?: string | null,
    clientMachineName?: string | null,
    clientOsName?: string,
    clientVersion?: string,
    screenProctoringMetadataURL?: string | null,
    screenProctoringMetadataWindowTitle?: string | null,
    screenProctoringMetadataUserAction?: string | null,
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
    screenProctoringMetadataURL?: string | null,
    screenProctoringMetadataWindowTitle?: string | null,
    screenProctoringMetadataUserAction?: string | null,
    pageNumber?: number,
    pageSize?: number,
    sort?: string
}