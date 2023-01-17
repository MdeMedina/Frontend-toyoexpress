import { url_api } from "../../lib/data/server";

let cuentas = [];
const gettingAccounts = async () => {
  await fetch(`${url_api}/cuentas`)
    .then((res) => res.json())
    .then((r) => {
      cuentas = r;
    });
};

gettingAccounts();

export { cuentas };
