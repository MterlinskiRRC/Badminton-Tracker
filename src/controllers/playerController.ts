import { Request, Response } from "express";
import { PlayerService } from "../services/playerService";

export class PlayerController {
    public constructor(private readonly playerService: PlayerService) {}

    public getAll = async (_req: Request, res: Response): Promise<void> => {
        const players = await this.playerService.getAll();
        res.status(200).json(players);
    };

    public getById = async (req: Request, res: Response): Promise<void> => {
        const player = await this.playerService.getById(req.params.id);
        if (!player) {
            res.status(404).json({ message: "Player not found" });
            return;
        }

        res.status(200).json(player);
    };

    public create = async (req: Request, res: Response): Promise<void> => {
        const created = await this.playerService.create(req.body);
        res.status(201).json(created);
    };

    public patch = async (req: Request, res: Response): Promise<void> => {
        const updated = await this.playerService.update(req.params.id, req.body);
        if (!updated) {
            res.status(404).json({ message: "Player not found" });
            return;
        }

        res.status(200).json(updated);
    };

    public delete = async (req: Request, res: Response): Promise<void> => {
        const deleted: boolean = await this.playerService.delete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: "Player not found" });
            return;
        }

        res.status(204).send();
    };
}
