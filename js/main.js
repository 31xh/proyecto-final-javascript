const productos = []

const ingresarProducto = () => {
    for (let i = 0; i < 3; i++) {
        let favProd = prompt("Ingrese su producto favorito")
        favProd.length <= 3
        ? (alert("El nombre del producto es muy corto"), i--)
        : productos.push(favProd)
    }
}

const mostrarProductos = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        console.log(`${i + 1} ${arr[i].toUpperCase()}`)
    }
}

ingresarProducto()
mostrarProductos(productos)