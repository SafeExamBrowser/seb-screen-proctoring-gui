//todo: change name
  
type Screenshot = {
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
    metaData?: MetaData;
}

type MetaData = {
    data: string;
}