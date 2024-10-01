type ExamView = {
    uuid: string,
    name: string,
    startTime: number,
    endTime: number
}

type Exam = {
    creationTime: number,
    description: string,
    id: number,
    lastUpdateTime: number,
    name: string,
    owner: string,
    startTime: number,
    type: string,
    url: string,
    userUUIDs: string[],
    uuid: string
}