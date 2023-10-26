type UserAccountResponse = {
    numberOfPages: number;
    pageNumber: number;
    pageSize: number;
    content: UserAccount[];
}

type UserAccount = {
    id: number;
    uuid: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    language: string;
    timeZone: string;
    roles: string[];
    creationTime: number;
    lastUpdateTime: number;
    terminationTime?: number;
    creationDate: string;
};