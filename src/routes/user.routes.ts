import express, { Request, Response } from 'express';
import * as userService from '../services/user.service';

const router = express.Router();

router.get('/load', async (req: Request, res: Response) => {
  try {
    await userService.loadUsers();
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/users', async (req: Request, res: Response) => {
    try {
        await userService.deleteUsers();
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/users/:userId', async (req: Request, res: Response) => {
    try {
        await userService.deleteUser(parseInt(req.params.userId));
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/users/:userId', async (req: Request, res: Response) => {
    try {
        const user = await userService.getUser(parseInt(req.params.userId));
        if(user){
            res.status(200).json(user);
        } else {
            res.status(404).send();
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/users', async (req: Request, res: Response) => {
    try {
        await userService.putUser(req.body);
        res.status(201).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;