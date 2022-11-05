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

import { Request, Response } from 'express';
import Keycloak, { KeycloakConfig } from 'keycloak-connect';
import cfg from './configuration';

const keycloakCfg:KeycloakConfig = {
	realm: cfg.KEYCLOAK_REALM,
	'bearer-only': true,
	'auth-server-url': cfg.KEYCLOAK_AUTH_URL,
	'ssl-required': "external",
	'resource': cfg.KEYCLOAK_CLIENT_RESOURCE,
	'confidential-port': 0,
};

function init() {
	/* keycloak-connect's accessDenied handling erroneously ends the response,
	 * we need to patch that here: */
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
	Keycloak.prototype.accessDenied = (_req: Request, res: Response) => {
		const code = 403;
		const response = {
			statusCode: code,
			message: "access denied",
		};
		res.setHeader('Content-Type', 'application/json');
		res.status(code).send(JSON.stringify(response));
	};
	const result = new Keycloak({}, keycloakCfg);
	return result;
}

const keycloak:Keycloak.Keycloak = init();

export default keycloak;
