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

import { describe, it} from 'mocha';
import { expect } from 'chai';
import cfg from '../src/configuration';

describe('Configuration', () => {
	it('has default values for each element', () => {
    	let property: keyof typeof cfg;
    	for (property in cfg) {
			expect(cfg[property], property).to.not.be.null;
			if (typeof cfg[property] == 'number') {
				expect(cfg[property], property).to.be.finite;
				expect(cfg[property], property).to.be.at.least(0);
			}
    	}
	});
	it('is immutable', () => {
		expect(cfg).to.be.frozen;
	});
});
