import React from 'react';
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { useQuery, useMutation, gql } from '@apollo/client'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'

const OBTENER_CLIENTE = gql`
query obtenerCliente($id:ID!){
    obtenerCliente(id: $id){
      nombre
      apellido
      email
      empresa
      telefono
      id
    }
  }
`

const EDITAR_CLIENTE = gql`
mutation actulizarCliente($id: ID!, $input:ClienteInput){
    actualizarCliente(id:$id, input:$input){
      nombre
      apellido
      email
      empresa
      telefono
      id
    }
  }
`


const EditarCliente = () => {
    const router = useRouter()

    const { query: { id } } = router

    
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            id
        }
    })
    
    const [ actulizarCliente ] = useMutation(EDITAR_CLIENTE)

    const validationSchema = Yup.object({
        nombre: Yup.string().required("El nombre es obligatorio"),
        apellido: Yup.string().required("El apellido es obligatorio"),
        empresa: Yup.string().required("La empresa es obligatoria"),
        email: Yup.string().email("El email no es valido").required("El email es obligatorio"),
    })

    if (loading) return "Cargando..."

    const editarCliente = async valores => {
        const { nombre, apellido, empresa, email, telefono } = valores

        try {
            const { data } = await actulizarCliente({
                variables: {
                    id,
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
                'Actualizado',
                'El cliente se actualizo correctamente',
                'success'
            )

            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-grey-800 font-light">Editar Cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={validationSchema}
                        enableReinitialize
                        initialValues={data.obtenerCliente}
                        onSubmit={ async (values) => {
                            editarCliente(values)
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
                                            placeholder="Nombre del cliente"
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
                                        <label className="block tekt-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                                            Apellido
                                    </label>
                                        <input className="shadow aparence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline=none focus:shadow-outline"
                                            id="apellido"
                                            type="text"
                                            placeholder="Apellido del cliente"
                                            value={props.values.apellido}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.apellido}</p>
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
                                            value={props.values.empresa}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.empresa}</p>
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
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
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
                                            value={props.values.telefono}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="editar cliente" />
                                </form>

                            )
                        }}


                    </Formik>
                </div>
            </div>
        </Layout>
    );
}

export default EditarCliente;