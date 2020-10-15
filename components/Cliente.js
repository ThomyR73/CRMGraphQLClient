import React from 'react';
import Swal from "sweetalert2";
import { useMutation, gql } from '@apollo/client'
import Router from 'next/router'

const ELIMINAR_CLIENTE = gql`
mutation eliminarCliente($id:ID!){
    eliminarCliente(id:$id)
  }
`

const OBTENER_CLIENTES_VENDEDOR = gql`
query obtenerClientesVendedor{
  obtenerClientesVendedor{
    nombre
    apellido
    email
    id
    empresa
  }
}
`

const Cliente = ({ cliente }) => {

    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_VENDEDOR })

            cache.writeQuery({
                query: OBTENER_CLIENTES_VENDEDOR,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(clienteCache => clienteCache.id != cliente.id)
                }
            })
        }
    })

    const confirmaEliminarCliente = (id) => {
        Swal.fire({
            title: '¿queres eliminar este cliente?',
            text: "Este cambio no puede ser revertido",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const { data } = await eliminarCliente({
                        variables: {
                            id: cliente.id
                        }
                    })

                    Swal.fire(
                        'Eliminado',
                        data.eliminarCliente,
                        'success'
                    )

                } catch (error) {
                    Swal.fire(
                        'Error',
                        error.message,
                        'error'
                    )
                }

            }
        })
    }

    const editarCliente = (id) => {
        Router.push({
            pathname: "/editarclientes/[id]",
            query: { id }

        })
    }

    return (
        <tr>
            <td className="border px-4 py-2">{cliente.nombre} {cliente.apellido}</td>
            <td className="border px-4 py-2">{cliente.empresa}</td>
            <td className="border px-4 py-2">{cliente.email}</td>
            <td className="border px-4 py-2">
                <button type="button"
                    onClick={() => confirmaEliminarCliente(cliente.id)}
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold">
                    Eliminar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button type="button"
                    onClick={() => editarCliente(cliente.id)}
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold">
                    Editar
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
}

export default Cliente;