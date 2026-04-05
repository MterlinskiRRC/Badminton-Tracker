import app from "./app";

const portFromEnv: string | undefined = process.env.PORT;
const port: number = portFromEnv ? Number(portFromEnv) : 3000;

app.listen(port, (): void => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/docs`);
});
