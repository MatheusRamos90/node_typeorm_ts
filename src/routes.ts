import { Router } from 'express';
import { categoryControllerFactory, videosControllerFactory } from './factories/CategoryControllerFactory';

const routes = Router()

// Categories
routes.post('/categories', (req, res, next) => categoryControllerFactory().create(req, res, next));
routes.get('/categories', (req, res) => categoryControllerFactory().getAll(req, res));
routes.get('/categories/:id', (req, res, next) => categoryControllerFactory().getById(req, res, next));
routes.put('/categories/:id', (req, res, next) => categoryControllerFactory().update(req, res, next));
routes.delete('/categories/:id', (req, res, next) => categoryControllerFactory().delete(req, res, next));

// Movies
routes.post('/movies', (req, res, next) => videosControllerFactory().create(req, res, next));

export { routes };

