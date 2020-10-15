import React, { useEffect } from 'react';
import Layout from '../components/Layout'
import { useQuery, gql } from '@apollo/client'
import {
    BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const OBTENER_MEJORES_VENDEDORES = gql`
query ObtenerMejoresClientes{
    obtenerMejoresClientes{
      total
      cliente{
        nombre
      }
    }
  }
`

const MejoresClientes = () => {

    const { data, loading, error, startPolling, stopPolling } = useQuery(OBTENER_MEJORES_VENDEDORES)

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    if (loading) return null

    console.log(data)

    const graph = data.obtenerMejoresClientes.map(cliente => ({ ...cliente.cliente[0], total: cliente.total }))

    return (
        <Layout>
            <h1 className="text-2xl text-grey-800 font-light">Mejores Clientes</h1>
            <ResponsiveContainer
                width={'99%'}
                height={550}
            >
                <BarChart
                    className="mt-10"
                    width={900}
                    height={800}
                    data={graph}
                    margin={{
                        top: 5, right: 30, left: 20, bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182ce" />
                </BarChart>
            </ResponsiveContainer>
        </Layout>
    );
}

export default MejoresClientes;