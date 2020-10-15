import React from 'react'
import Layout from './../components/Layout'
import Link from 'next/link'
import { useQuery, gql } from "@apollo/client"
import Pedido from "../components/Pedido"

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

const Pedidos = () => {
    
    const { data, loading, error } = useQuery(OBTENER_PEDIDOS)

    if (loading) return "Cargando..."

    const { obtenerPedidosVendedor }= data

    console.log(data)

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-grey-800 font-light">Pedidos</h1>
                <Link href="/nuevopedido" >
                    <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full sm:w-auto text-center">Nuevo Pedido</a>
                </Link>

                { obtenerPedidosVendedor.length === 0 ? (
                    <p className="mt-5 text-center text-2xl ">No Hay pedidos aun</p>
                ) : (
                    obtenerPedidosVendedor.map( pedido => {
                        return <Pedido pedido={pedido} key={pedido.id}/>
                    })
                )}

            </Layout>
        </div>
    );
}
export default Pedidos
