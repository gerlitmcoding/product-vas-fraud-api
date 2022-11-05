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

import express, { Request, Response, NextFunction } from 'express';
import { getStatistics } from './cdqApi';

const router = express.Router();

/**
 * @openapi
 * /fraudcases/statistics:
 *   get:
 *     description: Returns cdq fraud case statistics.
 *     tags:
 *     - Dashboard
 *     security:
 *     - bearerAuth: []
 *     externalDocs:
 *       description: The CDQ Fraud Cases API specification.
 *       url: https://developer.cdq.com/reference-docs/bankaccount-data/V2/tag/Fraud-Cases/#tag/Fraud-Cases/operation/readFraudCasesStatistics
 *     responses:
 *       200:
 *         description: Statistics about the fraud cases via the CDQ API. See [CDQ API GET /fraudcases/statistics](https://developer.cdq.com/reference-docs/bankaccount-data/V2/tag/Fraud-Cases/#tag/Fraud-Cases/operation/readFraudCasesStatistics).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CDQFraudCaseStatistic'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/ServerFault'
 */
router.get('/', (req: Request, res: Response, next: NextFunction) => {
	getStatistics()
		.then(cdqApiResponse => {
			res.setHeader('Content-Type', 'application/json');
			return res.status(200).send(cdqApiResponse.json);
		})
		.catch(next);
});

export default router;
