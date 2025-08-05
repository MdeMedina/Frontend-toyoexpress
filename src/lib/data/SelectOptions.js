import { backendUrl, frontUrl } from "../../lib/data/server";

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
const token = localStorage.getItem('token')

const gettingAccounts = async () => {
  await fetch(`${backendUrl()}/cuentas`, {
    headers: new Headers({ 'Content-type': 'application/json', "Authorization": `Bearer ${token}`}),
  })
  .then(res => {
    if(res.status === 401) {
      window.location.href =`${frontUrl()}/logout`
      return false
    }
    return res.json()
  })
    .then((r) => {
      cuentas = r;
    });
};
if (token) {
gettingAccounts();
}
export { cuentas, moveI, gettingAccounts };
