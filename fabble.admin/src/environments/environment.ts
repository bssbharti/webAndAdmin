// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};
 
export const  config = {
    local: {
               //  API_URL:"http://10.20.3.195:8098/api/",
                  API_URL:"http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/",
                //API_URL: "http://ec2-13-57-236-155.us-west-1.compute.amazonaws.com:8098/api/",
         //"http://localhost:8098/api",
                  
               SOCKET_URL: "http://tugofwar.mobilytedev.com:8092",
              },
              dev: {
                API_URL: "http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/",
              },
              test: {
                API_URL: "http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/",
              },
              production: {
                API_URL: "http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/",
              },
              live: {
                API_URL: "http://ec2-13-56-44-143.us-west-1.compute.amazonaws.com:8098/api/",
              }
    }

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
