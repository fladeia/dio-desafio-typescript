(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function timeCalc(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e ${sec}s`;
    }
    function patio() {
        function read() {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function save(veiculo) {
            localStorage.setItem("patio", JSON.stringify(veiculo));
        }
        function add(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
          <td>${veiculo.name}</td>
          <td>${veiculo.plate}</td>
          <td>${veiculo.checkIn}</td>
          <td>
            <button class="delete" data-plate="${veiculo.plate}">X</button>
          </td>
        `;
            (_a = row.querySelector(".delete")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
                remove(this.dataset.plate);
            });
            (_b = $("#patio")) === null || _b === void 0 ? void 0 : _b.appendChild(row);
            if (salva)
                save([...read(), veiculo]);
        }
        function remove(plate) {
            const { checkIn, name } = read().find(veiculo => veiculo.plate === plate);
            const time = timeCalc(new Date().getTime() - new Date(checkIn).getTime());
            if (!confirm(`O veículo ${name} permaneceu por ${time}. Deseja encerrar?`))
                return;
            save(read().filter((veiculo) => veiculo.plate !== plate));
            render();
        }
        function render() {
            $("#patio").innerHTML = "";
            const patio = read();
            if (patio.length) {
                patio.forEach((veiculo) => add(veiculo));
            }
        }
        return { read, add, remove, save, render };
    }
    patio().render();
    (_a = $("#register")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const name = (_a = $("#name")) === null || _a === void 0 ? void 0 : _a.value;
        const plate = (_b = $("#licencePlate")) === null || _b === void 0 ? void 0 : _b.value;
        if (!name || !plate) {
            alert("Os campos nome e placa são obrigatórios.");
            return;
        }
        patio().add({ name, plate, checkIn: new Date().toISOString() }, true);
    });
}());
