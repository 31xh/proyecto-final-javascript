const productos = []

const ingresarProducto = () => {
    for (let i = 0; i < 3; i++) {
        let favProd = prompt("Ingrese su producto favorito").trim()
        let isValid = validaciones(favProd)
        isValid ?
            (productos.push(favProd), alert(`El producto: ${favProd} ha sido agregado con exito`))
            : ("Producto no validado", i--)
    }
}

const validaciones = (arg) => {
    if (!arg) {
        alert("El producto no puede estar vacío");
        return false;
    } else if (!isNaN(arg)) {
        alert("El producto no debe ser un número");
        return false;
    } else if (arg.length < 4) {
        alert("El nombre del producto debe tener al menos 4 caracteres");
        return false;
    }
    return true;
}

const mostrarProductos = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        console.log(`${i + 1} ${arr[i].toUpperCase()}`)
    }
}

ingresarProducto()
mostrarProductos(productos)