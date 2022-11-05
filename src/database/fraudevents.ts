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

 import tables from '@databases/pg-typed';
import Joi, { ErrorReport } from 'joi';
import { get, set, isEmpty } from 'lodash';
import * as db from './db';
import { DatabaseSchema, Efraudtype, Fraudevents, FraudeventsInsert } from './types';
import jsonSchemaDB from './schema.json';

const { fraudevents } = tables<DatabaseSchema>({
	databaseSchema: jsonSchemaDB,
});

async function upsertFraudevents(events: FraudeventsInsert[]): Promise<Fraudevents[]> {
	return await fraudevents(db.pool).bulkInsertOrUpdate({
		columnsToInsert: ['cdl_id','attack_date','country_code','fraudtype'],
		columnsThatConflict: ['cdl_id'],
		columnsToUpdate: ['cdl_id','attack_date','country_code','fraudtype'],
		records: events,
	})
}

// async function upsertFraudevents2(events: {cdl_id:string, attack_date:number, country_code:string, fraudtype:Efraudtype}[]): Promise<Fraudevents[]> {
// 	return await fraudevents(db.pool).bulkInsertOrUpdate({
// 		columnsToInsert: ['cdl_id','attack_date','country_code','fraudtype'],
// 		columnsThatConflict: ['cdl_id'],
// 		columnsToUpdate: ['cdl_id','attack_date','country_code','fraudtype'],
// 		records: events,
// 	})
// }

interface ValidatedFraudEvent {
	cdlId: string,
	dateOfAttack: number,
	type: string,
	countryCode: string,
}

function validateFraudevent(value: object): FraudeventsInsert | ErrorReport {
	const schema = Joi.object().keys({
		cdlId: Joi.string().required().length(10),
		dateOfAttack: Joi.number().required().greater(0),
		type: Joi.string().required().valid(
			"ACTIVE_WARNING",
			"ANNOUNCEMENT",
			"FAKE_DOCUMENT",
			"FAKE_EMAIL",
			"FAKE_PRESIDENT_CALL",
			"FALSIFIED_INVOICE",
		),
		countryCode: Joi.string().required().pattern(/^[A-Z]{2}$/),
	});
	if (isEmpty(get(value, 'countryCode'))) {
		set(value,'countryCode','XX');
	}
	const result: Joi.ValidationResult<ValidatedFraudEvent> = schema.validate(value, {allowUnknown: false});
	if (result.error) {
		throw new Error(`it is not a valid fraud entry: ${result.error.details.map(x => x.message).join(', ')}`);
	}
	return {
		cdl_id: result.value.cdlId,
		attack_date: result.value.dateOfAttack,
		country_code: result.value.countryCode,
		fraudtype: result.value.type as Efraudtype,
	};
}

export {
	validateFraudevent,
	upsertFraudevents,
}
