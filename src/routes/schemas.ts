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

/**
 * @openapi
 * components:
 *   schemas:
 *     FraudCaseStatistic:
 *       type: object
 *       description: fraud case statistics by type.
 *       properties:
 *         active_warning:
 *           type: integer
 *           format: int64
 *         announcement:
 *           type: integer
 *           format: int64
 *         fake_document:
 *           type: integer
 *           format: int64
 *         fake_email:
 *           type: integer
 *           format: int64
 *         fake_president_call:
 *           type: integer
 *           format: int64
 *         falsified_invoice:
 *           type: integer
 *           format: int64
 *       example:
 *         active_warning: 16
 *         announcement: 17
 *         fake_document: 17
 *         fake_email: 19
 *         fake_president_call: 23
 *         falsified_invoice: 40
 *     CDQFraudCaseStatistic:
 *       type: object
 *       description: Statistics about the fraud cases via the CDQ API.
 *       properties:
 *         cachedValue:
 *           type: boolean
 *         date:
 *           type: integer
 *           format: int64
 *         numberOfAllFraudCases:
 *           type: integer
 *           format: int64
 *         numberOfDisclosedFraudCases:
 *           type: integer
 *           format: int64
 *         numberOfDisclosedFraudCasesOfTheUsersOrganization:
 *           type: integer
 *           format: int64
 *         numberOfFraudCasesOfTheUsersOrganization:
 *           type: integer
 *           format: int64
 *         numberOfUndisclosedFraudCases:
 *           type: integer
 *           format: int64
 *         numberOfUndisclosedFraudCasesOfTheUsersOrganization:
 *           type: integer
 *           format: int64
 *       example:
 *         cachedValue: true
 *         date: 1648804091264
 *         numberOfAllFraudCases: 657
 *         numberOfDisclosedFraudCases: 288
 *         numberOfDisclosedFraudCasesOfTheUsersOrganization: 369
 *         numberOfFraudCasesOfTheUsersOrganization: 0
 *         numberOfUndisclosedFraudCases: 0
 *         numberOfUndisclosedFraudCasesOfTheUsersOrganization: 0
 *     FraudCaseGeo:
 *       type: object
 *       properties:
 *         de:
 *           $ref: '#/components/schemas/FraudCaseStatistic'
 *         fr:
 *           $ref: '#/components/schemas/FraudCaseStatistic'
 *       example:
 *         de:
 *           active_warning: 3
 *           announcement: 2
 *           fake_document: 5
 *           fake_email: 10
 *           fake_president_call: 6
 *           falsified_invoice: 12
 *         fr:
 *           active_warning: 2
 *           announcement: 4
 *           fake_document: 8
 *           fake_email: 6
 *           fake_president_call: 7
 *           falsified_invoice: 18
 */
