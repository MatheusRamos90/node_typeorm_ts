import { BadRequestException } from "@exceptions/BadRequestException"
import { NotFoundException } from "@exceptions/NotFoundException"
import { UnAuthorizedException } from "@exceptions/UnAuthorizedException"
import { NextFunction, Request, Response } from "express"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Error handling middleware called.')
    console.log('Path: ', req.path)
    console.log('Error occured: ', err)

    if (err instanceof NotFoundException) {
        return res.status(404).json({ message: err.message, status: 404 })
    }

    if (err instanceof BadRequestException) {
        return res.status(400).json({ message: err.message, status: 400 })
    }

    if (err instanceof UnAuthorizedException) {
        return res.status(401).json({ message: err.message, status: 401 })
    }
}