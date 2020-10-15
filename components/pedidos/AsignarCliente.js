import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select'
import { useQuery, gql } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext'

const OBTENER_CLIENTES = gql`
query obtenerClientesVendedor {
    obtenerClientesVendedor{
      nombre
      apellido
      id
      empresa
      email
      telefono
    }
  }
`

const AsignarCliente = () => {

    const pedidoContext = useContext(PedidoContext)
    const { agregarCliente } = pedidoContext

    const { data, loading, error } = useQuery(OBTENER_CLIENTES)

    const [cliente, setCliente] = useState([])

    useEffect(() => {
        agregarCliente(cliente)
    }, [cliente])

    const selecionarCliente = (cliente) => {
        setCliente(cliente)
    }

    if (loading) return null

    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un cliente al pedido </p>
            <Select
                className="mt-3"
                options={data.obtenerClientesVendedor}
                onChange={opcion => selecionarCliente  (opcion)}
                getOptionValue={(opciones) => opciones.id}
                getOptionLabel={(opciones) => `${opciones.nombre} ${opciones.apellido}`}
                placeholder="Seleccione o busque el cliente"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
    );
}

export default AsignarCliente;