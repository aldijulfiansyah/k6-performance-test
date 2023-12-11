import http from "k6/http";
import { check, group, sleep } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    // Key configurations for avg load test in this section
    stages: [
      { duration: '2s', target: 10 },
      { duration: '20s', target: 10 }, 
      { duration: '2s', target: 0 }, 
    ],
  };

export default function () {
  group("LOAD TEST | Reqres API User", () => {
    let data = JSON.stringify({
      name: "morpheus",
      job: "leader",
    });

    group("@POST api/users | Create User", () => {
      let response = http.post("https://reqres.in/api/users", data);
      check(response, {
        "status 201": (response) => response.status == 201,
      });
      sleep(1);
    });

    group("@GET api/users/2 | Get single User", () => {
      let response = http.get("https://reqres.in/api/users/2");
      check(response, {
        "status 200": (response) => response.status == 200,
      });
      sleep(1);
    });

    group("@GET api/users?page=2 | Get List User", () => {
      let response = http.get("https://reqres.in/api/users?page=2");
      check(response, {
        "status 200": (response) => response.status == 200,
      });
      sleep(1);
    });

  });
  
}


export function handleSummary(data) {
    return {
      "loadTest-result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }