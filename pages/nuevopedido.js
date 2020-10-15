import React, { useContext } from 'react';
import Layout from '../components/Layout'
import AsignarCliente from '../components/pedidos/AsignarCliente'
import AsignarProducto from '../components/pedidos/AsignarProducto'
import ResumenPedido from '../components/pedidos/ResumenPedido'
import Total from '../components/pedidos/Total'
import { useMutation, gql } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'
import PedidoContext from "../context/pedidos/PedidoContext";

const NUEVO_PEDIDO = gql`
mutation NuevoPedido($input:PedidoInput){
    nuevoPedido(input:$input){
        id
        pedido{
          id
          cantidad
          nombre
          precio
        }
        total
        cliente{
            nombre
            apellido
            id
            email
            telefono
        }
        estado
    }
  }
`
const OBTENER_PRODUCTOS = gql`
query{
    obtenerProductos{
      id
      nombre
      existencia
      precio    
    }
  }
`

const OBTENER_PEDIDOS = gql`
query obtenerPedidosVendedor{
    obtenerPedidosVendedor{
      id
      pedido{
        id
        cantidad
        nombre
        precio
      }
      total
      cliente{
          nombre
          apellido
          id
          email
          telefono
      }
      estado
    }
  }
`

const NuevoPedido = () => {

    const pedidoContext = useContext(PedidoContext)
    const { cliente, productos, total } = pedidoContext

    const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
        update(cache, { data: { nuevoPedido } }) {

            const {obtenerProductos} = cache.readQuery({ query:OBTENER_PRODUCTOS })
            
            const newCache = obtenerProductos.map(producto => {
                const newProducto = productos.find(product => product.id == producto.id)
                if (newProducto) {
                    return { ...producto, existencia: (newProducto.existencia - newProducto.cantidad) }
                }
                return producto
            })

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: { 
                    obtenerProductos: [...newCache]
                 }
            })

            const { obtenerPedidosVendedor } = cache.readQuery({ query: OBTENER_PEDIDOS })
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido]
                }
            })
            

        }
    })

    const router = useRouter()

    const validarPedido = () => {
        return !productos.every(producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed " : "  "

    }

    const crearNuevoPedido = async () => {
        const { id } = cliente
        const pedido = productos.map(({ id, cantidad, nombre, precio }) => { return { id, cantidad, nombre, precio } })
        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id.toString(),
                        pedido,
                        total
                    }
                }
            })
            Swal.fire(
                "Pedido Completado",
                "El pedido fue guardado Correctamente",
                "success"
            )
            router.push("/pedidos")
        } catch (error) {
            Swal.fire(
                "Error",
                error.message,
                "error"
            )
            console.log(error)
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-grey-800 font-light">
                Crear Nuevo Pedido
            </h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <AsignarCliente />
                    <AsignarProducto />
                    <ResumenPedido />
                    <Total />
                    <button
                        type="button"
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
                        onClick={() => crearNuevoPedido()}
                    >
                        Registrar Pedido
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoPedido;