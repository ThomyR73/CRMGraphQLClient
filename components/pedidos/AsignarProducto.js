import React, { useContext, useState, useEffect } from 'react';
import {useQuery, gql} from '@apollo/client'
import PedidoContext from '../../context/pedidos/PedidoContext'
import Select from 'react-select'
import Producto from '../Producto';

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

const AsignarProducto = () => {

    const {data, loading, error } = useQuery(OBTENER_PRODUCTOS)

    const pedidoContext = useContext(PedidoContext)
    const { agregarProducto, actualizarTotal } = pedidoContext

    const [ productos, setProductos ] = useState([])

    useEffect(()=> {
        agregarProducto(productos)
        actualizarTotal()
    },[productos])


    const seleccionarProducto = (producto) => {
        if (producto){
            setProductos(producto)
        }
        if (!producto){
            setProductos([])
        }
    }

    if(loading) return null



    return ( 
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Selecciona el producto </p>
            <Select
                className="mt-3"
                isMulti={true}
                options={data.obtenerProductos}
                onChange={opcion => seleccionarProducto(opcion)}
                getOptionValue={(opciones) => opciones.id}
                getOptionLabel={(opciones) => `${opciones.nombre} $ ${opciones.precio} - ${opciones.existencia} en stock`}
                placeholder="Seleccione o busque el producto"
                noOptionsMessage={() => "No hay resultados"}
            />
        </>
     );
}
 
export default AsignarProducto;