let carritoDeCompras = [];

const contenedorPozo = document.getElementById("contenedor-pozo");
const contenedorCarrito = document.getElementById('carrito-contenedor');
const sumaTotal = document.getElementById('sumatotal');
const contadorItems = document.getElementById('contador');
const legajoTotal = document.getElementById('totaLegajo');
const perfilesTotal = document.getElementById('totalPerfiles');
const filtroArea = document.getElementById("areaS");
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
})


const fetchData = async () => {
        const res = await fetch("/stockProductos.json")
        const data = await res.json();
        mostrarInfo(data);
}

const mostrarInfo = async (data) => {
    contenedorPozo.innerHTML = "";
    data.forEach(item => {
        let div = document.createElement('div')
        div.classList.add('Pozo')
        div.innerHTML += `
            <div class="card" style="width: 18rem;">
            <img src="${item.img}" class="card-img-top" alt="100anios">
            <div class="card-body">
                <h5 class="card-title">${item.NombreLegal}${item.shortN}${item.Numero}</h5>
                <p class="card-text">Agrega al carrito para solicitar la informacion de este pozo.</p>
                <p>Legajo: ${item.Legajo}</p>
                <p>Perfiles: ${item.Perfiles}</p>
                <p>Disponible: ${item.enStock}</p>
                <a href="#" id="Agregar${item.id}" class="btn btn-primary">Agregar a carrito</a>
            </div>
            </div>`
        contenedorPozo.appendChild(div) //AGREGA LA INFO DEL ARRAY AL ESQUEMA CARD
        let btnAgregar = document.getElementById(`Agregar${item.id}`) //LE DA IDENTIDAD AL BOTON AGREGAR A CARRITO CON EL ID DEL POZO
        btnAgregar.addEventListener("click", (e) => {
            e.preventDefault();
            agregarAlCarrito(item.id);
        })
    })
}

const filtroA = async () => {
    contenedorPozo.innerHTML = "";
    const resp = await fetch("stockProductos.json");
    const data = await resp.json();

    const filtroArea = document.getElementById("areaS");
    filtroArea.addEventListener('change', () => {
        if (filtroArea.value == "all") {
            mostrarInfo(data);
            return;
        }
        if (filtroArea.value) {
            contenedorPozo.innerHTML = "";
            let filtro = data.filter(item => item.AreaID == filtroArea.value)
            filtro.forEach(Pozo => {
                let div = document.createElement('div')
                div.classList.add('Pozo')
                div.innerHTML += `
            <div class="card" style="width: 18rem;">
            <img src="${Pozo.img}" class="card-img-top" alt="100anios">
            <div class="card-body">
                <h5 class="card-title">${Pozo.NombreLegal}${Pozo.shortN}${Pozo.Numero}</h5>
                <p class="card-text">Agrega al carrito para solicitar la informacion de este pozo.</p>
                <p>Legajo: ${Pozo.Legajo}</p>
                <p>Perfiles: ${Pozo.Perfiles}</p>
                <p>Disponible: ${Pozo.enStock}</p>
                <a href="#" id="Agregar${Pozo.id}" class="btn btn-primary">Agregar a carrito</a>
            </div>
            </div>`
                contenedorPozo.appendChild(div) //AGREGA LA INFO DEL ARRAY AL ESQUEMA CARD
                let btnAgregar = document.getElementById(`Agregar${Pozo.id}`) //LE DA IDENTIDAD AL BOTON AGREGAR A CARRITO CON EL ID DEL POZO
                btnAgregar.addEventListener("click", (e) => {
                    e.preventDefault();
                    agregarAlCarrito(Pozo.id);
                })
            })
        }
    });
}

filtroA();

const agregarAlCarrito = async (id) => {
        const res = await fetch("/stockProductos.json")
        const data = await res.json();
        let yaEsta = carritoDeCompras.find(item => item.id == id);
        if (yaEsta) {
            Toastify({
                text: "Ya tienes esta informacion en el carrito",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, 06006e, #000000,#007a93)",
                },
                onClick: function () {}
            }).showToast();
            return;
        } else {
            let productoAgregar = data.find(elemento => elemento.id == id);
            carritoDeCompras.push(productoAgregar);
            actualizarCarrito()
            mostrarCarrito(productoAgregar);
            localStorage.setItem('Pedido', JSON.stringify(carritoDeCompras));
        }
}

function mostrarCarrito(productoAgregar) {
    let tr = document.createElement('tr');
    tr.className = "productoEnCarrito";
    tr.innerHTML = `
                    <th scope="row">${productoAgregar.NombreLegal+productoAgregar.shortN+productoAgregar.Numero}</th>
                    <td>${productoAgregar.Legajo}</td>
                    <td>${productoAgregar.Perfiles}</td>
                    <button id="eliminar${productoAgregar.id}" type="button" class="btn btn-danger">Quitar</button></td>
                    <td><span>${productoAgregar.Perfiles+productoAgregar.Legajo}</span></td>
    `
    contenedorCarrito.appendChild(tr);

    let btnEliminar = document.getElementById(`eliminar${productoAgregar.id}`);

    btnEliminar.addEventListener('click', () => {
        btnEliminar.parentElement.remove()
        carritoDeCompras = carritoDeCompras.filter(item => item.id != productoAgregar.id)
        actualizarCarrito()
        localStorage.setItem('Pedido', JSON.stringify(carritoDeCompras));
    })
    let btnLimpiar = document.getElementById('limpiar');
    btnLimpiar.addEventListener('click', () => {
        btnEliminar.parentElement.remove()
        carritoDeCompras = [];
        actualizarCarrito();
        localStorage.setItem('Pedido', JSON.stringify(carritoDeCompras));
    })

    let pedidoCompleto = document.getElementById("completo");

    pedidoCompleto.addEventListener('click', () => {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Su pedido ah sido enviado',
            showConfirmButton: false,
            timer: 1500
        });
        btnEliminar.parentElement.remove();
        carritoDeCompras = [];
        actualizarCarrito();
        localStorage.setItem('Pedido', JSON.stringify(carritoDeCompras));
        setTimeout(() => {
            location.reload();
        }, 1500);
    });
}


function actualizarCarrito() {
    contadorItems.innerText = carritoDeCompras.length;
    carritoDeCompras.length == 4 && Swal.fire('Realmente necesitas tanto?', 'Por favor, evita la acumulacion de informacion', 'warning'); //OPERADOR LOGICO &&
    legajoTotal.innerText = carritoDeCompras.reduce((acc, el) => acc + el.Legajo, 0);
    perfilesTotal.innerText = carritoDeCompras.reduce((acc, el) => acc + el.Perfiles, 0);
    sumaTotal.innerText = carritoDeCompras.reduce((acc, el) => acc + (el.Legajo + el.Perfiles), 0);
}

function recuperar() {
    let recuperarLS = JSON.parse(localStorage.getItem('Pedido'));
    if (recuperarLS) {
        recuperarLS.forEach(el => {
            mostrarCarrito(el)
            carritoDeCompras.push(el)
            actualizarCarrito()
        })
    }
}
setTimeout(() => {
    Swal.fire({
        imageUrl: 'https://todopago.com.ar/sites/todopago.com.ar/files/animacion-nuevo2.gif',
        width: 580,
        imageWidth: 580,
        imageHeight: 325,
        imageAlt: 'gifpropaganda',
        showConfirmButton: false,
    })
}, 3000);
recuperar()