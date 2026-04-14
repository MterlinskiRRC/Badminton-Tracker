import app from "./app";
import { verifyFirebaseConnections } from "./config/firebase";

const portFromEnv: string | undefined = process.env.PORT;
const port: number = portFromEnv ? Number(portFromEnv) : 3000;

async function startServer(): Promise<void> {
    await verifyFirebaseConnections();

    app.listen(port, (): void => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`Swagger docs at http://localhost:${port}/docs`);
    });
}

void startServer().catch((error: unknown): void => {
    const message: string = error instanceof Error ? error.message : String(error);
    console.error(`Failed to start server: ${message}`);
    process.exit(1);
});
