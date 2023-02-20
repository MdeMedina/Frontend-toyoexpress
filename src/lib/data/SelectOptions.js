import { backendUrl } from "../../lib/data/server";

let cuentas = [];
let moveI = [
  {
    value: "E",
    label: "Egreso",
    color: "#e00202",
  },
  {
    value: "I",
    label: "Ingreso",
    color: "#17e002",
  },
];
const gettingAccounts = async () => {
  await fetch(`${backendUrl()}/cuentas`)
    .then((res) => res.json())
    .then((r) => {
      cuentas = r;
    });
};

gettingAccounts();

export { cuentas, moveI };
