/********************************************************************************
 * Copyright (c) 2021,2022 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import server from './src/server';
import log from './src/log';
import cfg, { logConfiguration } from './src/configuration';
import * as db from './src/database/db';
import * as Sentry from '@sentry/node';
import { extractErrorMessage } from './src/errors';

async function startup() {
	logConfiguration();
	try {
		await db.checkConnection();
		await db.checkMigrations();
	} catch (err) {
		const errMsg = extractErrorMessage(err);
		log.error(`Could not ensure database connection / migrations: '${errMsg}'`);
		log.warn("Will try again on first request");
		Sentry.captureException(err);
	}
	server.listen(cfg.API_PORT, () => {
		log.info(`Server started, awaiting connections on port ${cfg.API_PORT}`);
	});
}

process.on('SIGINT', () => {
	shutdown('SIGINT');
});

process.on('SIGTERM', () => {
	shutdown('SIGTERM');
});

function shutdown(reason: string) {
	log.info(`Server exiting: ${reason}`);
	db.shutdown().finally(() => {
		log.info('Goodbye!');
		process.exit()
	});
}

startup().catch((err) => {
	log.error(`Error on startup: ${extractErrorMessage(err)}`);
	Sentry.captureException(err);
});
