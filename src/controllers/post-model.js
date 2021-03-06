import log from "../lib/logger";

/**
 *
 * @param {import("../use-cases/add-model").addModel} addModel
 * @param {*} hash
 */
export default function postModelFactory(addModel, hash) {
  return async function postModel(httpRequest) {
    try {
      const { source = {}, ...modelInfo } = httpRequest.body;
      log({ function: "postModel", ...modelInfo });
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers["User-Agent"];
      if (httpRequest.headers["Referer"]) {
        source.referrer = httpRequest.headers["Referer"];
      }
      log(source);

      const model = await addModel({ ...modelInfo });
      log({ function: addModel.name, modelData: { ...model } });

      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
          ETag: hash(JSON.stringify(model)),
        },
        statusCode: 201,
        body: { modelId: model.getId() },
      };
    } catch (e) {
      log(e);

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
