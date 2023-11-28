/* constantes */
const templateCard = document.getElementById('template-card').content
const elementos = document.getElementById('items')
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const footer = document.getElementById('footer')
const fragment = document.createDocumentFragment()
let carrito = {}
const tarjetitas = document.getElementById('cards')



const traerinfo = async()=>{
	try{
		const res = await fetch('jsonnaves.json')
		const data = await res.json()
		crearTarjetita(data)

	}catch(error){
		/* console.log(error) */
	}
}

const llenarCarritardo = ()=> {
	
	elementos.innerHTML = ''
	Object.values(carrito).forEach(producto => {
		templateCarrito.querySelector('th').textContent = producto.id
		templateCarrito.querySelectorAll('td')[0].textContent = producto.title
		templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
		templateCarrito.querySelector('.agregar').dataset.id = producto.id
		templateCarrito.querySelector('.quitar').dataset.id = producto.id
		templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
		const clone = templateCarrito.cloneNode(true)
		fragment.appendChild(clone)
	})

	elementos.appendChild(fragment)

	crearfooter()

	localStorage.setItem('carrito', JSON.stringify(carrito))

}

tarjetitas.addEventListener('click', e =>{
    ponerenCarrito(e)
    })
    
    elementos.addEventListener('click', e=>{
        agregarQuitar(e)
    })
    

document.addEventListener('DOMContentLoaded', ()=>{
	traerinfo()
	if(localStorage.getItem('carrito')){
		llenarCarritardo()
	}
}


)

const crearTarjetita = data=>{
	data.forEach(item => {
		templateCard.querySelector('h5').textContent = item.title
		templateCard.querySelector('p').textContent = item.precio
		templateCard.querySelector('img').setAttribute('src', item.thumbnailUrl)
		templateCard.querySelector('.btn-dark').dataset.id = item.id
		const clone = templateCard.cloneNode(true)
		fragment.appendChild(clone)
	})
	tarjetitas.appendChild(fragment)
}
const ponerenCarrito = e =>{

	if(e.target.classList.contains('btn-dark')){
		setCarrito(e.target.parentElement)
	}

e.stopPropagation()
}


const setCarrito = item => {

	const producto = {
		title: item.querySelector('h5').textContent,
		precio: item.querySelector('p').textContent,
		id: item.querySelector('.btn-dark').dataset.id,
		cantidad: 1
	}

	if(carrito.hasOwnProperty(producto.id)){
		producto.cantidad = carrito[producto.id].cantidad + 1
	}

	carrito[producto.id] = { ...producto}
	llenarCarritardo()
}



const crearfooter = () => {
		footer.innerHTML = ''
	

		const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad, 0)
		const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)
		
		templateFooter.querySelectorAll('td')[0].textContent = nCantidad
		templateFooter.querySelector('span').textContent = nPrecio
	
		const clone = templateFooter.cloneNode(true)
		fragment.appendChild(clone)
		footer.appendChild(fragment)
	
	}


const agregarQuitar = e =>{
	
	if(e.target.classList.contains('agregar')){
		
		const producto = carrito[e.target.dataset.id]
		producto.cantidad++

		carrito[e.target.dataset.id] = {...producto}
		llenarCarritardo()
	}

	if(e.target.classList.contains('quitar')){
		const producto = carrito[e.target.dataset.id]
		producto.cantidad--
		if(producto.cantidad ===0){
			delete carrito[e.target.dataset.id]
		}
		llenarCarritardo()

	}

	e.stopPropagation()
}



