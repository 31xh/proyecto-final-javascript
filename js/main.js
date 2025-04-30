//variables generales
const gastos = []
const agregarGastos = document.querySelector("#agregarGastoBtn")
const listaGatos = document.querySelector("#gastoLista")
const descInt = document.querySelector("#descInput")
const montoInt = document.querySelector("#montoInt")
const sumarTotal = document.querySelector("#totalGastos")
const error = document.querySelector("#error")

//Agrega y muestra los productos al hacer click
agregarGastos.addEventListener("click", () => {
    let desc = descInt.value.trim()
    let monto = parseFloat(montoInt.value.trim())

    if (desc.length >= 3 && !isNaN(monto) && !Number(desc)) {
        gastos.push({ desc: desc, monto })
        mostrarProd()
        mostrarTotal()

        descInt.value = ""
        montoInt.value = ""
        error.innerHTML = ""
    } else {
        mostrarError()
    }
})

//funcion de mostrar un error
function mostrarError() {
    error.innerHTML = `<h2 class="text-center text-danger display-2">Valor no valido</h2>`
}

//funcion de borrar un producto
function mostrarProd() {
    const mostrar = gastos.map((p, i) =>
        `<div class="pt-2 display-6">
            <ul class="unordered-list">
                <li>
                    <button class="text-danger" onClick="borrar(${i})">X</button> ${i + 1} - ${p.desc} - ${p.monto}
                </li>
            </ul>
        </div>`
    )
    listaGatos.innerHTML = mostrar
}

//funcion de borrar un total
function mostrarTotal() {
    let acumulador = 0
    gastos.forEach(p =>
        acumulador += p.monto
    )

    const html = `
    <h3 class="pt-3 text-center text-success">
      El total sería de: $${acumulador}
    </h3>
    `
    sumarTotal.innerHTML = html
}

//funcion de borrar un objeto
function borrar(index) {
    gastos.splice(index, 1)
    mostrarProd()
    mostrarTotal()
}