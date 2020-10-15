import React from 'react';
import Layout from '../../components/Layout'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql, useQuery } from '@apollo/client'
import { Router, useRouter } from 'next/router'
import Swal from 'sweetalert2'
import { route } from 'next/dist/next-server/server/router';

const OBTENER_CLIENTE = gql`
query obtenerProducto($id:ID!){
    obtenerProducto(id: $id){
      id
      nombre
      existencia
      precio
    }
  }
`

const EDITAR_PRODUCTO = gql`
mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      nombre
      id
      existencia
      precio
      creado
    }
  }
`

const EditarProducto = () => {

    const router = useRouter()

    const { query: { id } } = router

    const { data, loading, error } = useQuery(OBTENER_CLIENTE,{
        variables: {
            id
        }
    })

    const [actualizarProducto] = useMutation(EDITAR_PRODUCTO)

    const validationSchema = Yup.object({
        nombre: Yup.string().required("El nombre es requerido"),
        existencia: Yup.number()
            .required("La existencia es requerida")
            .positive("El valor introducido es invalido")
            .integer("El valor introducido es invalido"),
        precio: Yup.number()
            .required("El precio es requerido")
            .positive("El valor introducido es invalido"),
    })

    const editarProducto = async (values) => {
        const { nombre, existencia, precio, id } = values

        try {
            const { data } = await actualizarProducto({
                variables:{
                    id,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            })

            Swal.fire(
                'Actualizado',
                'El producto se actualizo correctamente',
                'success'
            )

            router.push("/productos")

        } catch (error) {
            Swal.fire(
                'Error',
                error.message,
                'error'
            )
        }
    }

    if (loading) return "Cargando..."

    if (!data) return "Accion no permitida"

    return ( 
        <Layout>
            <h1 className="text-2xl text-grey-800 font-light">Editar Producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={data.obtenerProducto}
                        onSubmit={ async (values) => {
                            editarProducto(values)
                        }}
                    >

                        {props => {

                            return (
                                <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                onSubmit={props.handleSubmit}
                            >
                                <div className="mb-4">
                                    <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                        Nombre
                                        </label>
                                    <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                        id="nombre"
                                        type="text"
                                        placeholder="Nombre del producto"
                                        value={props.values.nombre}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                {props.touched.nombre && props.errors.nombre ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.nombre}</p>
                                    </div>
                                ) : null}
        
                                <div className="mb-4">
                                    <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="existecia">
                                        Existencia
                                        </label>
                                    <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                        id="existencia"
                                        type="number"
                                        placeholder="Cantidad en stock"
                                        value={props.values.existencia}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                {props.touched.existencia && props.errors.existencia ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                        <p className="font-bold">Error</p>
                                        <p>{props.errors.existencia}</p>
                                    </div>
                                ) : null}
        
                                <div className="mb-4">
                                    <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                                        Precio
                                        </label>
                                    <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                        id="precio"
                                        type="number"
                                        placeholder="Precio del producto"
                                        value={props.values.precio}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                    />
                                </div>
                                    {props.touched.precio && props.errors.precio ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ) : null}
                                <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="guardar producto" />
                            </form>

                            )
                        }}


                    </Formik>
                </div>
            </div>
        </Layout>
     );
}
 
export default EditarProducto;