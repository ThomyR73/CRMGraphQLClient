import { SchemaMetaFieldDef } from 'graphql'
import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router'

const OBTENER_USUARIO = gql`
query obtenerUsuario{
    obtenerUsuario{
      nombre
      apellido
      id
    }
  }
`

const Header = () => {
    const { data, loading, error } = useQuery(OBTENER_USUARIO)
    
    const router = useRouter()
    
    const cerrarSesion = () => {
        localStorage.removeItem("token")
        router.push("/login")
    }
    
    if(loading) return null
    
    if (!data) {
        router.push("/login")
        return null
    } 
    
    if (data) {
        const { nombre, apellido } = data.obtenerUsuario
        
        return (
            <div className="sm:flex justify-between mb-6">
                <p className="mr-2 mb-5 sm:mb-0">Hola {nombre} {apellido}</p>
                <button type="button"
                    className="bg-blue-800 w-full sm:w-auto uppercase text-xs rounded py-1 px-2  text-white shadow-md"
                    onClick={()=> cerrarSesion()} 
                    >
                    Cerrar Sesion
            </button>
            </div>
        )
    }

    return null
}

export default Header