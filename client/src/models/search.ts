type SearchSessions = {
    numberOfPages: number,
    pageNumber: number,
    pageSize: number,
    sort: string,
    content: [
        {
            groupUUID: string,
            groupName: string,
            groupCreationTime: number,
            sessionUUID: string,
            startTime: number,
            endTime: number,
            clientName: string,
            clientIp: string,
            clientMachineName: string,
            clientOsName: string,
            clientVersion: string,
            imageFormat: string,
            nrOfScreenshots: number
        }
    ]
}

type SearchScreenshots = {
    numberOfPages: number,
    pageNumber: number,
    pageSize: number,
    sort: string,
    content: [
        {
            groupUUID: string,
            groupName: string,
            groupCreationTime: number,
            sessionUUID: string,
            sessionStartTime: number,
            sessionEndTime: number,
            sessionClientName: string,
            sessionClientIP: string,
            sessionClientMachineName: string,
            sessionClientOSName: string,
            sessionClientVersion: string,
            imageId: number,
            imageTimestamp: number,
            imageFormat: string,
            metaData: MetaData
        }
    ]
}

type SearchTimeline = {
    sessionUUID: string,
    timelineGroupDataList: [
        {
            groupOrder: number,
            groupName: string,

            timelineScreenshotDataList: [
                ScreenshotGroupList
            ]
        }
    ]

}

type ScreenshotsGrouped = {
    groupName: string,
    timelineScreenshotDataList: [
        ScreenshotGroupList
    ]
}

type ScreenshotGroupList = {   
    timestamp: number,
    metaData: MetaData
}