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

import { Request, Response, NextFunction, RequestHandler } from 'express';
import OperationalError from '../errors';
import * as db from './db';

const middleware = (async (_req: Request, _res: Response, next: NextFunction) => {
	try {
		try {
			await db.checkConnection();
		} catch (err) {
			throw new OperationalError(503, "cannot establish database connection", err);
		}
		if (!db.isReady()) { // we don't want to check migrations on every call.
			try {
				await db.checkMigrations();
			} catch (err) {
				throw new OperationalError(503, "cannot ensure database migrations", err);
			}
		}
		next();
	} catch (err) {
		next(err);
	}
}) as RequestHandler

export default middleware;
