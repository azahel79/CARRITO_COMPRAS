



const PROYECTO_CARRITO = (()=>{
const  proyecto = {};
let lista_compras = [];



   ////

   proyecto.recargarPagina = ()=>{
      if(localStorage.getItem('carrito') !== null){
            const carrito = JSON.parse(localStorage.getItem('carrito'));
            lista_compras = carrito;
            mostrarCompras(carrito);
            contadorCompras();
            precioFinal();
      }
   }
     ////FUNCIONES OCULTAS

    ///TEMPLATE DEL RESUMEN DEL CARRITO
      templateCompra = (compras)=>{
        const tr_compra = document.createElement('tr');
        tr_compra.innerHTML = `
             <td><img src=${compras.img} alt="" style="width: 100px;"></td>
             <td>${compras.nombre}</td>
             <td>$${compras.precio}</td>
             <td class="d-flex">
                <button class="btn btn-danger px-2 disminuir" data-id=${compras.id}>-</button>
                 <p class="px-2 m-0 border">${compras.cantidad}</p>
                <button class="btn btn-primary px-1 aumentar" data-id=${compras.id}>+</button>
    
    
                  <a href="#" class="ms-5 mt-2 fs-3 text-decoration-none eliminar_boton" data-id=${compras.id}><i class='bx bxs-x-circle eliminar_boton' data-id=${compras.id}></i></a>
             </td>
        `
        return tr_compra;
      }
     

     ////FUNCION PARA VER  CONTADOR DE COMPRAS
     const contadorCompras = ()=>{
       const contador =  lista_compras.reduce((acc,{cantidad})=>  acc + cantidad,0);
       const contador_p = document.querySelector('.contador_compras > span');
        contador_p.textContent = contador;
     }
  
      ///FUNCION PARA MOSTRAR EL PRECIO FINAL 
      const precioFinal = ()=>{
        const precioFinalPagar = lista_compras.reduce((acc,{precio})=> acc + precio,0);
        const precioFinal_p = document.querySelector('.table_resumen_final > p > span');
        precioFinal_p.textContent = precioFinalPagar;
      }


    mostrarCompras = (listado = [])=>{
        ////CONTENEDOR PARA AGREGAR MIS COMPRAS
        const ctr_lista_compras = document.querySelector('tbody');
          while(ctr_lista_compras.firstElementChild){
              ctr_lista_compras.removeChild(ctr_lista_compras.firstElementChild);
          }
        listado.forEach(compras=>{
           const compras_items = templateCompra(compras);
           ctr_lista_compras.appendChild(compras_items);
        })
        
    }
  
  

    ////EVENTOS DEL DOM
    proyecto.eventos_del_dom = ()=>{
const btn_comprar = document.querySelectorAll('.comprar');
const table_lista_compras = document.querySelector('.table');
const realizar_compra = document.querySelector('.btn_compra');   

  ///CONJUNTO DE EVENTOS PARA LA LISTA DE EVENTOS
  table_lista_compras.addEventListener('click',e=>{
 
    /////CONTROLADOR PARA AGREGAR UNA COMPRA MAS
    if(e.target.classList.contains('aumentar')){
      const id_compra = e.target.dataset.id;
      const editarAumentar = lista_compras.filter(compras=> compras.id === id_compra);

      console.log(editarAumentar);
      ////AGREGAR UNA CANTIDAD MAS
      editarAumentar[0].cantidad++ + 1;
        
      ///AGREGAR UN PRECIO NUEVO DE ACUERDO ALA CANTIDAD AUMENTADA
      editarAumentar[0].precio = editarAumentar[0].cantidad * editarAumentar[0].precioInicial;

      mostrarCompras(lista_compras);
      contadorCompras();
      precioFinal();
      localStorage.setItem('carrito',JSON.stringify(lista_compras));
        return;
    }
     ///CONTROLADOR PARA QUITA UNA COMPRA
      if(e.target.classList.contains('disminuir')){
        const id_compra = e.target.dataset.id;
        const editarDisminuir = lista_compras.filter(compras=> compras.id === id_compra);
          ////DISMINUIR UNA CANTIDAD MENOS
      editarDisminuir[0].cantidad-- -1;

      ///CUANDO LA CANTIDAD SEA CERO,CANTIDAD VA HACER 1
        if(editarDisminuir[0].cantidad <= 0){
             editarDisminuir[0].cantidad = 1;
             return;
        }

        ///AGREGAR UN PRECIO NUEVO DE ACUERDO ALA CANTIDAD RESTADA
      editarDisminuir[0].precio = editarDisminuir[0].cantidad * editarDisminuir[0].precioInicial;
        mostrarCompras(lista_compras);


        contadorCompras();
        precioFinal();
        localStorage.setItem('carrito',JSON.stringify(lista_compras));
        return;
      }
     ////CONTROLADOR PARA ELIMINAR LA COMPRA
      
     if(e.target.classList.contains('eliminar_boton')){
        
      const compra_id = e.target.dataset.id;
      ///ELIMINAR POR FILTRO 
        console.log(compra_id);
     const listado_nuevo =  lista_compras.filter(comprar => comprar.id !== compra_id);
       lista_compras = [...listado_nuevo];

      //  console.log(lista_compras);
       mostrarCompras(lista_compras);
       contadorCompras();
       precioFinal();
       localStorage.setItem('carrito',JSON.stringify(lista_compras));

      return;
      }


     
  })
////AGREGAR UN COMPRA AL CARRITO
btn_comprar.forEach(btn=>{
    btn.addEventListener('click',e=>{
        e.preventDefault();
        
       let  objCompra = {
           img: e.target.parentElement.parentElement.querySelector('img').src,
           nombre: e.target.parentElement.parentElement.querySelector('.card-title').innerHTML,
           precioInicial: Number(e.target.parentElement.parentElement.querySelector('p').textContent),
           precio: Number(e.target.parentElement.parentElement.querySelector('p').textContent),
           id: e.target.parentElement.parentElement.querySelector('.comprar').dataset.id,
           cantidad: 1
        }
         ////SI SE ENCUENTRA EL MISMO NOMBRE DEL PRODUCTO AGREGALO
         const compraExistente =lista_compras.filter(compra => compra.nombre === objCompra.nombre);
           
         if(compraExistente.length > 0){
             ///AUMENTAR EL CONTADOR DE COMPRAS SI REPITE LA COMPRA
             const contadorCompra = compraExistente.reduce((acc,{cantidad})=> acc + cantidad,1)
             const contadorPrecio = compraExistente.reduce((acc,{precioInicial,cantidad})=>
             acc + (precioInicial * cantidad) ,compraExistente[0].precioInicial);
             compraExistente[0].precio = contadorPrecio;
             compraExistente[0].cantidad = contadorCompra;
           lista_compras = [...lista_compras];
           mostrarCompras(lista_compras);
           contadorCompras();
           precioFinal();
           localStorage.setItem('carrito',JSON.stringify(lista_compras));
         }else{
                ////AGREGAR UNA COMPRA NUEVA
        lista_compras = [...lista_compras,objCompra];
        mostrarCompras(lista_compras);
        contadorCompras();
        precioFinal();
        localStorage.setItem('carrito',JSON.stringify(lista_compras));
         }
    })
})

      ////REALIZAR COMPRA
    realizar_compra.addEventListener('click',e=>{
      window.location.reload();
      lista_compras = [];
      localStorage.removeItem('carrito');
    })

    }
    return proyecto;
})();



PROYECTO_CARRITO.eventos_del_dom();
PROYECTO_CARRITO.recargarPagina();





















