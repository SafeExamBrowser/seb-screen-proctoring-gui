type SearchResult = {
    name: string
    sessionId: string,
    date: string,
    group: string,

    results: {
        application: string,
        url: string,
        timestamp: string
    }[]
}