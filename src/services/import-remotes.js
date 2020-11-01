'use strict'

import remoteEntries from '../../webpack/remote-entries';

/**
 * 
 */
export async function importRemoteModels() {
  const importStartTime = Date.now();

  let remoteModels = [];
  for (const entry of remoteEntries) {
    if (entry.type === 'model') {
      const models = await entry.importRemote();
      remoteModels.push(models);
    }
  }

  console.log("\n%dms to import remote models\n",
    Date.now() - importStartTime);

  return remoteModels.map(m => ({ ...m }))
    .reduce((p, c) => ({ ...c, ...p }));
}

/**
 * Imports remote service modules.    
 */
export async function importRemoteServices() {
  const importStartTime = Date.now();

  let services = [];
  for (const entry of remoteEntries) {
    if (entry.type === 'service') {
      const service = await entry.importRemote();
      services.push(service);
    }
  }

  console.log("\n%dms to import remote services\n",
    Date.now() - importStartTime);

  return services.reduce((p, c) => ({ ...c, ...p }));
}

export async function importRemoteAdapters() {
  const importStartTime = Date.now();

  let useCases = [];
  for (const entry of remoteEntries) {
    if (entry.type === 'adapter') {
      const useCase = await entry.importRemote();
      useCases.push(useCase);
    }
  }

  console.log("\n%dms to import remote services\n",
    Date.now() - importStartTime);

  return useCases.reduce((p, c) => ({ ...c, ...p }));
}


// function loadComponent(scope, module) {
//   return async () => {
//     // Initializes the share scope. This fills it with known provided modules from this build and all remotes
//     await __webpack_init_sharing__("default");
//     const container = global[scope]; // or get the container somewhere else
//     // Initialize the container, it may provide shared modules
//     await container.init(__webpack_share_scopes__.default);
//     console.log(container);
//     const factory = await container.get(module);
//     console.log(factory);
//     const Module = factory();
//     console.log(Module);
//     return Module;
//   };
// }

// export function findRemoteServices(...services) {
//   const services = await Promise.all(services.map(async s => {
//     await loadComponent('servicesRemote', s);
//   }));
//   return services;
// }