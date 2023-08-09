export const corsOptions: object = {
    origin: `${process.env.DEV_SERVER_URL}:${process.env.DEV_SERVER_PORT}`,
    allowedHeaders: "Content-Type, authorization",
    methods: "GET, POST",
    credentials: true,
}