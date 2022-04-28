interface Veiculo {
  name: string;
  plate: string;
  checkIn: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

  function timeCalc(mil: number) {
    const min = Math.floor(mil / 60000);
    const sec = Math.floor((mil % 60000) / 1000)

    return `${min}m e ${sec}s`
  }

  function patio() {
    function read(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function save(veiculo: Veiculo[]) {
      localStorage.setItem("patio", JSON.stringify(veiculo));
    }

    function add(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement("tr");

      row.innerHTML = `
          <td>${veiculo.name}</td>
          <td>${veiculo.plate}</td>
          <td>${veiculo.checkIn}</td>
          <td>
            <button class="delete" data-plate="${veiculo.plate}">X</button>
          </td>
        `;

      row.querySelector(".delete")?.addEventListener("click", function () {
        remove(this.dataset.plate);
      })

      $("#patio")?.appendChild(row);

      if (salva) save([...read(), veiculo]);
    }

    function remove(plate: string) {
      const { checkIn, name } = read().find(veiculo => veiculo.plate === plate)
      const time = timeCalc(new Date().getTime() - new Date(checkIn).getTime());

      if (
        !confirm(`O veículo ${name} permaneceu por ${time}. Deseja encerrar?`)
      )
        return;

      save(read().filter((veiculo) => veiculo.plate !== plate))
      render();
    }

    function render() {
      $("#patio")!.innerHTML = "";
      const patio = read();

      if (patio.length) {
        patio.forEach((veiculo) => add(veiculo));
      }
    }

    return { read, add, remove, save, render }
  }

  patio().render()

  $("#register")?.addEventListener("click", () => {
    const name = $("#name")?.value;
    const plate = $("#licencePlate")?.value;

    if (!name || !plate) {
      alert("Os campos nome e placa são obrigatórios.");
      return
    }

    patio().add({ name, plate, checkIn: new Date().toISOString() }, true);
  })

}())