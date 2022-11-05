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

import winston, { createLogger, transports, format } from 'winston'
import morgan, { StreamOptions } from 'morgan'
import { trimEnd } from 'lodash';
import { SentryTransport } from './sentryHelper';

const apiLogFormat: (info: winston.Logform.TransformableInfo) => string =
	(info) => `${info.timestamp as string} ${info.level}: ${info.message}`;

const log = createLogger({
	level: 'debug',
	transports: [
		new transports.Console({
			level: 'debug',
			format: winston.format.combine(
				format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
				format.colorize(),
				format.printf(apiLogFormat),
			),
		}),
		new SentryTransport({
			level: 'debug',
			format: winston.format.combine(
				format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
				format.printf(apiLogFormat),
			),
		}),
	],
});

// use winston as morgan express middleware:
const stream: StreamOptions = {
	write: (message) => log.info(trimEnd(message)),
};
const middleware = morgan(
	":method :url | :status | :res[content-length] bytes | :response-time ms",
	{ stream }
);

export default log;
export {
	middleware,
};
