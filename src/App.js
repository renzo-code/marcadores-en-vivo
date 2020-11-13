import React from 'react'

import styled from 'styled-components'
import Axios from 'axios';
import './App.css';
import { equiposMarcador,estadioHora,tarjetas, goleadores } from './constantes'

class MarcadoresEnVivo extends React.Component{
  state={
    listaMarcador: [],
    listaEstadioHora:{},
    tarjetasEquipo1: [],
    tarjetasEquipo2: [],
    goleadoresEquipo1: [],
    goleadoresEquipo2: [],
  }

  componentDidMount(){
    this.obtenerEquiposMarcador()
    this.obtenerEstadioHora()
    this.obtenerTarjetas()
    this.obtenerGoleadores()
  }

  obtenerEquiposMarcador = async () => {
    try{
      const dataEquiposMarcador = await Axios.get(equiposMarcador)
      // console.log('dataEquiposMarcador',dataEquiposMarcador.data.values)
      this.setState({
        listaMarcador : this.formatDatosEquiposMarcador(dataEquiposMarcador.data.values)
      })
    }
    catch(e){
      console.error(e)
    }
  }

  obtenerEstadioHora = async () => {
    try{
      const dataEstadioHora = await Axios.get(estadioHora)
      this.setState({
        listaEstadioHora : this.formatEstadoHora(dataEstadioHora.data.values)
      })
    }
    catch(e){
      console.error(e)
    }
  }

  obtenerTarjetas = async () => {
    try{
      const dataTarjetaAmarilla = await Axios.get(tarjetas)
      this.formatTarjetas(dataTarjetaAmarilla.data.values)
      
    }
    catch(e){
      console.error(e)
    }
  }

  obtenerGoleadores = async () => {
    try{
      const dataTarjetaRoja = await Axios.get(goleadores)
      this.formatGoleadores(dataTarjetaRoja.data.values)
    }
    catch(e){
      console.error(e)
    }
  }

  formatDatosEquiposMarcador = (dates) => {
    const info = []
    let names = null
    dates.forEach((item, i) => {
      if (i === 0) {
        names = item
      } else {
        info.push({
          [names[0]]: item[0],
          [names[1]]: item[1],
          [names[2]]: item[2],
        })
      }
    })
    return info
  }

  formatEstadoHora = (data) => {
    let info = {}
    let names = null
    data.forEach((item, i) => {
      if (i === 0) {
        names = item
      } else {
        info = {
          [names[0]]: item[0],
          [names[1]]: item[1],
          [names[2]]: item[2],
        }
      }
    })
    return info
  }

  formatTarjetas = (data) => {
    let equipo1 = []
    let equipo2 = []
    let names = null
    data.forEach((item, i) => {
      if (i === 0) names = item
      if (i !== 0) {
        if (item[2] === '1') {
          equipo1.push({
            [names[0]]: item[0],
            [names[1]]: item[1],
            [names[2]]: item[2],
          })
        } else {
          equipo2.push({
            [names[0]]: item[0],
            [names[1]]: item[1],
            [names[2]]: item[2],
          })
        }
      }
    })
    this.setState({
      tarjetasEquipo1: equipo1,
      tarjetasEquipo2: equipo2
    })
  }

  formatGoleadores = (data) => {
    let equipo1 = []
    let equipo2 = []
    let names = null
    data.forEach((item, i) => {
      if (i === 0) names = item
      if (i !== 0) {
        if (item[1] === '1') {
          equipo1.push({
            [names[0]]: item[0],
            [names[1]]: item[1],
          })
        } else {
          equipo2.push({
            [names[0]]: item[0],
            [names[1]]: item[1],
          })
        }
      }
    })
    this.setState({
      goleadoresEquipo1 : equipo1,
      goleadoresEquipo2 : equipo2
    })
    return equipo1,equipo2
  }

  render(){
    const {
      listaMarcador,
      tarjetasEquipo2,
      tarjetasEquipo1,
      listaEstadioHora,
      goleadoresEquipo1,
      goleadoresEquipo2
    } = this.state    
    console.log('listaMarcador', tarjetasEquipo2, tarjetasEquipo1)
  return(
    <>
      <Redirect target="_blank" href={listaEstadioHora.link_nota}>
        <ContainerMaster>
          <div>
            <JugadorTarjeta color="red">
              {tarjetasEquipo1[0]?.jugador && <p></p>}
              {
                tarjetasEquipo1[0]?.jugador.split('-').map(p => (
                  <div>{p}</div>
                ))
              }
            </JugadorTarjeta>
            <JugadorTarjeta color="yellow">
            {tarjetasEquipo1[1]?.jugador && <p></p>}
              {
                tarjetasEquipo1[1]?.jugador.split('-').map(p => (
                  <div>{p}</div>
                ))
              }
            </JugadorTarjeta>
          </div>
          <Goleadores left="25px">
            {goleadoresEquipo1.length !== 0 &&<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQL8W6ZoTabIuzsZ_Jmn_hGISkqOrnyZFsA7A&usqp=CAU" />}
            <div>
              {
                goleadoresEquipo1.map(item => (
                  <div>
                    {item.jugador}
                  </div>
                ))
              }
            </div>
          </Goleadores>
          <ContainerEquiposMarcador>
            <WrapperPais>
              <ImgPais 
                src={listaMarcador[0]?.imagen}
              />
              <Pais>{listaMarcador[0]?.equipos}</Pais>
            </WrapperPais>
            <Marcador>{listaMarcador[0]?.marcador}</Marcador>
            <EnVivo>
              <TituloPrincipal>EN VIVO</TituloPrincipal>
              <TiempoPartido>{listaEstadioHora.hora}</TiempoPartido>
              <Estadio>{listaEstadioHora.estadio}</Estadio>
            </EnVivo>
            <Marcador>{listaMarcador[1]?.marcador}</Marcador>
            <WrapperPais>
              <ImgPais 
                src={listaMarcador[1]?.imagen}
              />
              <Pais>{listaMarcador[1]?.equipos}</Pais>
            </WrapperPais>
          </ContainerEquiposMarcador>
            <Goleadores right="35px">
              {goleadoresEquipo2.length !== 0 &&<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQL8W6ZoTabIuzsZ_Jmn_hGISkqOrnyZFsA7A&usqp=CAU" />}
              <div>
                {
                  goleadoresEquipo2.map(item => (
                    <div>
                      {item.jugador}
                    </div>
                  ))
                }
              </div>
            </Goleadores>
            <div>
              <JugadorTarjeta color="yellow">
                {tarjetasEquipo2[1]?.jugador && <p></p>}
                {
                  tarjetasEquipo2[1]?.jugador.split('-').map(p => (
                    <div>{p}</div>
                  ))
                }
              </JugadorTarjeta>
              <JugadorTarjeta color="red">
              {tarjetasEquipo2[0]?.jugador && <p></p>}
                {
                  tarjetasEquipo2[0]?.jugador.split('-').map(p => (
                    <div>{p}</div>
                  ))
                }
              </JugadorTarjeta>
            </div>
        </ContainerMaster>
      </Redirect>
    </>
    )
  }
}

const Redirect = styled.a`
  text-decoration: none;
  color: black;
`
const ContainerMaster = styled.div`
  display : flex ;
  justify-content: center;
  align-items:center;
  max-width : 974px;
  height : 78px;
  margin : 5 auto ;
  padding: 5px 0;
  border-top : 1px solid #C7C9D3 ;
  border-bottom : 1px solid #C7C9D3 ;
`
const ContainerEquiposMarcador = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 55%;
  height: 70px;
  @media(max-width: 850px) {
    width: 100%;
  }
`
const EnVivo = styled.div`
  width: 150px;
  margin-left: 20px;
  margin-right: 20px;
  @media(max-width: 850px) {
    width: 120px;
    margin-left: 15px;
    margin-right: 15px;
  }
`
const Estadio = styled.p`
  font-family: 'Roboto', sans-serif;
  font-size: 15px;
  letter-spacing: -0.5px;
  text-align: center;
  @media(max-width: 850px) {
    display: none;
  }
`
const TituloPrincipal = styled.h2`
  width: 150px;
  position : relative;
  font-size: 11px;
  text-align: center;
  color: #00CA00;
  font-family: 'Roboto', sans-serif;
  &::after{
    position: absolute;
    content : "";
    display: block;
    width: 150px;
    height: 2px;
    background: #00CA00;
    right: 1px;
    @media(max-width: 850px) {
    width: 120px;
  }
  }
  @media(max-width: 850px) {
    width: 120px;
  }
`
const TiempoPartido = styled.h1`
  font-family: 'Roboto', sans-serif;
  font-size: 23px;
  text-align: center;
  
`
const ImgPais = styled.img`
  height: 55px;
  width: 55px;
  @media(max-width: 850px) {
    height: 40px;
    width: 40px;
  }
`

const Marcador = styled.div`
  height: 50px;
  width: 50px;
  background-color: black;
  color: white;
  font-size: 35px;
  text-align: center;
  line-height: 50px;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  @media(max-width: 850px) {
    height: 40px;
    width: 40px;
    line-height: 40px;
    font-size: 30px;
  }
`

const WrapperPais = styled.div`
  margin-left: 20px;
  margin-right: 20px;
  width: 65px;
  text-align: center;
  @media(max-width: 850px) {
    margin-left: 10px;
    margin-right: 10px;
    width: 50px;
  }
`

const Pais = styled.h5`
  text-transform: uppercase;
  color: gray;
  font-family: 'Roboto', sans-serif;
  font-size: 12px;
  @media(max-width: 850px) {
    display: none;
  }
`

const Goleadores = styled.div`
  display: flex;
  font-size: 11px;
  font-family: 'Roboto', sans-serif;
  margin-left: ${(prop) => prop.left || '0px'};
  margin-right: ${(prop) => prop.right || '0px'};
  & > img {
    width: 12px;
    height: 12px;
  }
  @media(max-width: 850px) {
    display: none;
  }
`

// const Tarjetas = styled.div`
//   width: 8px;
//   height: 12px;
//   border: .5px solid #e6e6e6;
//   background-color: ${(prop) => prop.color};
// `

const JugadorTarjeta = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 11px;
  font-family: 'Roboto', sans-serif;
  & > p {
    display: block;
    position: absolute;
    background-color: ${(prop) => prop.color};
    width: 8px;
    height: 12px;
    border: .5px solid #e6e6e6;
    left: -15px;
    top: 0;
  }
  @media(max-width: 850px) {
    display: none;
  }
`

export default MarcadoresEnVivo
