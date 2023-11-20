//todo: change name
  
type ScreenshotData = {
    startTime: number;
    timestamp: number;
    endTime: number;
    active: boolean;
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

type Session = {
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
    nrOfScreenshots: number,
    exam: ExamView;
}

type MetaData = {
    screenProctoringMetadataURL?: string;
    screenProctoringMetadataWindowTitle?: string,
    screenProctoringMetadataUserAction?: string
}