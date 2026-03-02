import type { Request, Response, NextFunction } from "express";
export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message)
        this.name = "AppError";
    }
}

export const errorHandler = (req: Request, res: Response, next: NextFunction, err: Error) => {
    console.error(`[Error] ${err.message}`)



    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message })
        return;
    }
    if (err.name === 'SyntaxError') {
        res.status(400).json({ message: "Invalid JSON in request body" });
        return;
    }

    res.status(500).json({ message: 'Internal Server Error' })
}