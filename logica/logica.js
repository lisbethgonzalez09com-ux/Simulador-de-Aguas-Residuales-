document.addEventListener("DOMContentLoaded", () => {
  const conc_dom = document.getElementById("conc_dom");
  const conc_ind = document.getElementById("conc_ind");
  const conc_agr = document.getElementById("conc_agr");
  const q_total = document.getElementById("q_total");
  const c_obj = document.getElementById("c_obj");
  const k_rel = document.getElementById("k_rel");

  const btnCalcular = document.getElementById("calcularBtn");
  const btnLimpiar = document.getElementById("limpiarBtn");

  const res_x = document.getElementById("res_x");
  const res_y = document.getElementById("res_y");
  const res_z = document.getElementById("res_z");
  const res_q = document.getElementById("res_q");
  const res_cf = document.getElementById("res_cf");
  const analysisList = document.getElementById("analysisList");
  const adviceBox = document.getElementById("adviceBox");

  const msgError = document.getElementById("mensajeError");
  const msgExito = document.getElementById("mensajeExito");

  function fmt(v){ return Number(v).toFixed(2); }

  function calcularSistema() {
    msgError.textContent = "";
    msgExito.textContent = "";
    analysisList.innerHTML = "";
    adviceBox.innerHTML = "";

    const Cd = Number(conc_dom.value);
    const Ci = Number(conc_ind.value);
    const Ca = Number(conc_agr.value);
    const Q  = Number(q_total.value);
    const Cobj = Number(c_obj.value);
    const k = Number(k_rel.value);

    if ([Cd,Ci,Ca,Q,Cobj,k].some(v => !isFinite(v) || v<=0)){
      msgError.textContent = "⚠️ Todos los valores deben ser positivos y mayores que cero.";
      return;
    }

    const coef_y = -Cd*(1+k) + Ci + Ca*k;
    const rhs = Cobj*Q - Cd*Q;
    const y = rhs / coef_y;
    const x = Q - (1+k)*y;
    const z = k*y;

    res_x.textContent = "Caudal Doméstico: " + fmt(x) + " m³/d";
    res_y.textContent = "Caudal Industrial: " + fmt(y) + " m³/d";
    res_z.textContent = "Caudal Agrícola: " + fmt(z) + " m³/d";
    res_q.textContent = "Caudal Total: " + fmt(x+y+z) + " m³/d";

    const cfinal = (Cd*x + Ci*y + Ca*z)/Q;
    res_cf.textContent = "Concentración Resultante: " + fmt(cfinal) + " mg/L";

    analysisList.innerHTML = `
      <li>• La mezcla cumple la concentración objetivo (${Cobj} mg/L).</li>
      <li>• Los caudales respetan la restricción operativa z = ${k}·y.</li>
      <li>• Balance de masa y caudal correcto.</li>
    `;

    // alertas y recomendaciones
    const fracInd = y / Q;
    if (fracInd > 0.30) {
      adviceBox.innerHTML += `<div style="padding:10px; margin-top:10px; background:#FFF4F4; border-left:4px solid #E76B6B; color:#7A1C1C; border-radius:8px;">
        ⚠️ La corriente industrial representa ${Math.round(fracInd*100)}% del caudal total. Se recomienda pretratamiento físico-químico antes del tratamiento biológico.</div>`;
    } else {
      adviceBox.innerHTML += `<div style="padding:10px; margin-top:10px; background:#F2FFF6; border-radius:8px;">
        ✅ Los caudales son equilibrados. Mantener monitoreo de DBO y SSV, controlar tiempos de retención.</div>`;
    }

    msgExito.textContent = "✅ Cálculo realizado correctamente.";
  }

  function limpiar() {
    [conc_dom, conc_ind, conc_agr, q_total, c_obj, k_rel].forEach(i=>i.value="");
    [res_x, res_y, res_z, res_q, res_cf].forEach(i=>i.textContent="—");
    analysisList.innerHTML = "";
    adviceBox.innerHTML = "";
    msgError.textContent = "";
    msgExito.textContent = "";
  }

  btnCalcular.addEventListener("click", calcularSistema);
  btnLimpiar.addEventListener("click", limpiar);

  limpiar();
});
