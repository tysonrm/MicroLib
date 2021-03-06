import log from "../lib/logger";

/**
 * @param {import("../use-cases/find-model").findModel} findModel
 */
export default function getModelByIdFactory(findModel) {
  return async function getModelById(httpRequest) {
    log({ function: "findModel" });
    try {
      const { source = {} } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      const id = httpRequest.params.id;
      const query = httpRequest.query;
      log({ source, id, query });

      const model = await findModel(id, query);

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: { model },
      };
    } catch (e) {
      log(e.message);

      if (e.message === "no such id") {
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 404,
        };
      }

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
}
