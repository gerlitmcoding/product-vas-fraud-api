import { request, RequestOptions } from "https";
import { IncomingMessage } from "http";
import querystring from "querystring";
import { get, has } from "lodash";
import OperationalError from "../errors";
import cfg from "../configuration";

interface HttpsResponse {
  statusCode: number;
  headers: object;
  json: string;
}

function httpsRequest(
  options: RequestOptions,
  data?: any
): Promise<HttpsResponse> {
  return new Promise((resolve, reject) => {
    const req = request(options, (response: IncomingMessage) => {
      const chunks: Uint8Array[] = [];
      response.on("data", (chunk: Uint8Array) => {
        chunks.push(chunk);
      });
      response.on("end", () => {
        const text = Buffer.concat(chunks).toString();
        const code: number = response.statusCode || 500;
        let parsed: object;
        try {
          parsed = JSON.parse(text) as object;
        } catch (err) {
          const msg = `CDQ API call failed (code: ${code}): received unparseable content: '${text}'`;
          return reject(new OperationalError(503, msg));
        }
        if (code < 400) {
          return resolve({
            statusCode: code,
            headers: response.headers,
            json: text,
          });
        } else {
          const statusMsgs: string[] = [];
          if (has(parsed, "error")) {
            statusMsgs.push(get(parsed, "error") as string);
          }
          if (has(parsed, "message")) {
            statusMsgs.push(get(parsed, "message") as string);
          }
          if (statusMsgs.length === 0) {
            statusMsgs.push("unknown error");
          }
          const statusMsg = `CDQ API call failed (code: ${code}): `.concat(
            statusMsgs.join(", ")
          );
          return reject(new OperationalError(code, statusMsg));
        }
      });
    });
    if (data) {
			// eslint-disable-next-line no-console
			const json = JSON.stringify(data)
			req.setHeader('Content-Type', 'application/json')
			req.setHeader('Content-Length', json.length)
      req.write(json);
    }
    return req.end();
  });
}

const defaultOptions = {
  protocol: "https:",
  host: "api.cdq.com",
  method: "GET",
  headers: {
    "X-API-KEY": cfg.CDQ_API_KEY,
  },
};

// https://api.cdq.com/bankaccount-data/rest/fraudcases/statistics
function getStatistics(): Promise<HttpsResponse> {
  const opts = {
    ...defaultOptions,
    path: "/bankaccount-data/rest/fraudcases/statistics",
  };
  return httpsRequest(opts);
}

type FraudcasesQueryParams = {
  classification?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
};

// https://api.cdq.com/bankaccount-data/rest/fraudcases
function getFraudcases(
  queryObj: FraudcasesQueryParams = {}
): Promise<HttpsResponse> {
  queryObj.classification = "CATENAX";
  const query = "?" + querystring.stringify(queryObj);
  const opts = {
    ...defaultOptions,
    path: "/bankaccount-data/rest/fraudcases" + query,
  };
  return httpsRequest(opts);
}

function createFraudCase(payload: any): Promise<HttpsResponse> {
  return httpsRequest(
    {
      ...defaultOptions,
      method: "POST",
      path: "/bankaccount-data/rest/fraudcases",
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { fraudCase: { ...payload, classification: "CATENAX" } }
  );
}

export {
  getStatistics,
  getFraudcases,
  createFraudCase,
  HttpsResponse,
  FraudcasesQueryParams,
};
