import React, { useContext } from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext'
import ProductoResumen from './ProductoResumen'


const ResumenPedido = () => {
    const pedidoContext = useContext(PedidoContext)
    const { productos } = pedidoContext


    return (
        <>
            <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Ajusta las cantidades </p>
            { productos && productos.length > 0 ? (
                <>
                    {productos.map(producto => <ProductoResumen producto={producto} key={producto.id}/> )}
                </>
            ) : (
                    <>
                        <p>No hay productos Seleccionados</p>
                    </>
                )

            }
        </>
    );
}

export default ResumenPedido;