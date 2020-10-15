import React, { useState } from 'react'
import Layout from '../components/Layout'
import { useMutation, gql } from '@apollo/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'

const NUEVO_CLIENTE = gql`
mutation nuevoCliente($input: ClienteInput){
    nuevoCliente(input:$input){
      nombre
      id
      apellido
      empresa
      email
      telefono
      creado
      vendedor
    }
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

const NuevoCliente = () => {

    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_VENDEDOR })

            cache.writeQuery({
                query: OBTENER_CLIENTES_VENDEDOR,
                data: {
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    })

    const router = useRouter()

    const [mensaje, guardarMensaje] = useState(null)

    const formik = useFormik({
        initialValues: {
            nombre: "",
            apellido: "",
            empresa: "",
            email: "",
            telefono: ""
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required("El nombre es obligatorio"),
            apellido: Yup.string().required("El apellido es obligatorio"),
            empresa: Yup.string().required("La empresa es obligatoria"),
            email: Yup.string().email("El email no es valido").required("El email es obligatorio"),
        }),
        onSubmit: async valores => {
            const { nombre, apellido, empresa, email, telefono } = valores
            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                })

                Swal.fire(
                    'Cliente Registrado',
                    'El cliente fue registrado correctamente',
                    'success'
                )

                router.push("/")
            } catch (error) {
                guardarMensaje(error.message)
                setTimeout(() => {
                    guardarMensaje(null)
                }, 5000);
            }
        }
    })

    const mostrarMensaje = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>

        )
    }

    return (
        <Layout>
            <h1 className="text-2xl text-grey-800 font-light">Nuevo Cliente</h1>
            {mensaje && mostrarMensaje()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form className="bg-white shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                                Nombre
                                </label>
                            <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="Nombre del cliente"
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
                            <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                Apellido
                                </label>
                            <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                id="apellido"
                                type="text"
                                placeholder="Apellido del cliente"
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.apellido && formik.errors.apellido ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.apellido}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="empresa">
                                Empresa
                                </label>
                            <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                id="empresa"
                                type="text"
                                placeholder="Empresa del cliente"
                                value={formik.values.empresa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.empresa && formik.errors.empresa ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.empresa}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                                </label>
                            <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Correo@correo.com"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}

                        <div className="mb-4">
                            <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
                                Telefono
                                </label>
                            <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                id="telefono"
                                type="tel"
                                placeholder="011 1234-5678"
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="registrar cliente" />
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default NuevoCliente