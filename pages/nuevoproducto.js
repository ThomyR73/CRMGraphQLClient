import React from 'react';
import Layout from '../components/Layout'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const GUARDAR_PRODUCTO = gql`
mutation nuevoProducto($input:ProductoInput){
	nuevoProducto(input:$input){
    id
    nombre
    existencia
    precio
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


const NuevoProducto = () => {
    const [nuevoProducto] = useMutation(GUARDAR_PRODUCTO, {
        update(cache, { data: { nuevoProducto } }) {
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS })

            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
                }
            })

        }
    })

    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            nombre: "",
            existencia: "",
            precio: "",
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es requerido"),
            existencia: Yup.number()
                .required("La existencia es requerida")
                .positive("El valor introducido es invalido")
                .integer("El valor introducido es invalido"),
            precio: Yup.number()
                .required("El precio es requerido")
                .positive("El valor introducido es invalido"),
        }),
        onSubmit: async (values) => {
            const { nombre, existencia, precio } = values

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio,
                        }
                    }
                })

                Swal.fire(
                    "Cliente Guardado",
                    "Cliente guardado correctamente",
                    "success"
                )

                router.push("productos")
            } catch (error) {
                Swal.fire(
                    "Error",
                    error.message,
                    "error"
                )
            }
        }
    })

    return (
        <Layout>
            <h1 className="text-2xl text-grey-800 font-light">Nuevo Producto</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre
                                </label>
                            <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre del producto"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.nombre}</p>
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
                                value={formik.values.existencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.existencia && formik.errors.existencia ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.existencia}</p>
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
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}
                        <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="guardar producto" />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NuevoProducto;