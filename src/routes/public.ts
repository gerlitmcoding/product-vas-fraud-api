import express, { Request, RequestHandler, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import * as Sentry from '@sentry/node';
import cfg from '../configuration';
import * as db from '../database/db';
import log from '../log';

const router = express.Router();

const swaggerDefinition = {
	info: {
		title: `${cfg.PROJECT}: Catena-X Rest API`,
		version: cfg.VERSION,
		description: 'Serves fraud case information and statistics',
	},
	openapi: "3.0.0",
};

const specs = swaggerJsdoc({
	swaggerDefinition,
	apis: [
		"./dist/src/routes/schemas.js",
		"./dist/src/routes/cdqCasesRouter.js",
		"./dist/src/routes/cdqStatisticsRouter.js",
		"./dist/src/routes/fraudTypesRouter.js",
		"./dist/src/routes/fraudGeoRouter.js",
		"./dist/src/routes/public.js",
		"./dist/src/routes/workerRouter.js",
		"./dist/src/keycloak.js",
		"./dist/src/errors.js",
		"./dist/src/server.js",
	],
});

/**
 * @openapi
 * /public/swagger.json:
 *   get:
 *     description: Serves api specification as an openapi specification (swagger.json).
 *     tags:
 *     - Public
 *     responses:
 *       200:
 *         description: The swagger.json openapi specification file for this project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get('/swagger.json', (_req: Request, res: Response) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(specs);
});

/**
 * @openapi
 * /public/api-docs:
 *   get:
 *     description: Serves swagger-ui hosting autogenerated swagger.json.
 *     tags:
 *     - Public
 *     responses:
 *       200:
 *         description: The api specification displayed by swagger-ui.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */
router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));


/**
 * @openapi
 * /public/alive:
 *   get:
 *     description: Returns code 204 if the api is alive and running. Any response code above 400 is to be considered 'not alive'. This endpoint is primarily to be used for k8's 'liveness' probes.
 *     tags:
 *     - Public
 *     responses:
 *       204:
 *         description: The api is alive and running.
 */
router.get('/alive', (_req: Request, res: Response) => {
	res.set('Cache-Control', 'no-store');
	res.sendStatus(204);
});


/**
 * @openapi
 * /public/ready:
 *   get:
 *     description: Returns code 204 if the api is ready to accept incoming requests, any return code >= 400 is to be considererd 'not ready'. The api is 'ready' if it has successfully established a database connection. More checks may be added in the future. On a 418 response you see the checks and their results as a json object for debugging purposes. This endpoint is primarily to be used for k8 'readiness' probes.
 *     tags:
 *     - Public
 *     responses:
 *       204:
 *         description: The api is ready to accept requests.
 *       418:
 *         description: The api is not yet ready to accept any requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: The executed readiness probes and their results. Should contain at least one which probed `false`.
 *               properties:
 *                 database:
 *                   type: object
 *                   description: The current usability of the database.
 *                   properties:
 *                     connected:
 *                       type: boolean
 *                     ready:
 *                       type: boolean
 */
router.get('/ready', (async(_req: Request, res: Response) => {
	res.set('Cache-Control', 'no-store');
	try {
		await db.checkConnection();
		await db.checkMigrations();
	} catch (err) {
		log.warn("API is currently not ready!");
		Sentry.captureException(err);
	}
	if (db.isConnected() && db.isReady()) {
		res.sendStatus(204);
	} else {
		res.setHeader('Content-Type', 'application/json');
		res.status(418).send(JSON.stringify({
			database: {
				connected: db.isConnected(),
				ready: db.isReady(),
			}
		}));
	}
}) as RequestHandler);

/**
 * @openapi
 * /public/version:
 *   get:
 *     description: Returns the package name and version of the api implementation.
 *     tags:
 *     - Public
 *     responses:
 *       200:
 *         description: Package name and version.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 version:
 *                   type: string
 *               example:
 *                 name: catenax-api
 *                 version: 1.1.8
 */
router.get("/version", (_req, res) => {
       const response = {
               name: cfg.PROJECT,
               version: cfg.VERSION,
       };
       res.setHeader('Content-Type', 'application/json');
       res.status(200).send(JSON.stringify(response));
});

router.get('/', (req: Request, res: Response) => {
	res.redirect(`${req.baseUrl}/api-docs/`);
});

export default router;
