import React from 'react'
import moment from 'moment'

import styled from 'styled-components'
import Axios from 'axios';
import './App.css';
import { equiposMarcador,estadioHora,tarjetas, goleadores } from './constantes'

class MarcadoresEnVivo extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      pais1: {},
      pais2: {},
      colorCabecera: {},
      estadioPartido: '',

      listaMarcador: [],
      listaEstadioHora:{},
      tarjetasEquipo1: [],
      tarjetasEquipo2: [],
      goleadoresEquipo1: '',
      goleadoresEquipo2: '',
      cronometro: '0:00',
      cronometro2: '45:00',
      time: 1,
    }
  }

  componentDidMount(){
    this.obtenerEquiposMarcador()
  }

  tick(hour) {
    const { cronometro, time } = this.state

    const lunch1 = moment(hour);
    const diff = moment().diff(lunch1, 'minute');

    // console.log('min', diff , hour)
    if (diff < 0) {
      this.setState({
        cronometro: lunch1.format('h:mm')
      })
      return
    }

    const min = parseInt(cronometro.split(':')[0])
    console.log('min', min)

    let date = '00:00'
    const seg = parseInt(cronometro.split(':')[1])
    if (seg >= 59) {
      date = `${min + 1}:00`
    } else {
      let seg2 = seg + 1
      date = `${min < 10 ? `0${min}` : min}:${seg2 < 10 ? `0${seg2}` : seg2}`
    }

    if (min >= 45 && time === 'FIRST_TIME') date = `45:00 +`

    if (min >= 90 && time === 'SECOND_TIME') date = `90:00 +`

    this.setState({
      cronometro: date
    })
  }

  obtenerEquiposMarcador = async () => {
    try{
      const options =  {
        method : 'GET',
        headers: {'token_id' : '0D93FB225g7592Dh3gG1D5G61f35H69Ga728C3DE7F'},
        // url : 'https://cronosservices.glr.pe/api/spotlight?site_id=larepublica&_id=5fb3fb7638b5c01d5e74a9d2&no-api-cache=1&status=1',
        url: 'https://cronosservices.glr.pe/api/spotlight?site_id=larepublica&_id=5fb3fb7638b5c01d5e74a9d2&no-api-cache=1&no-cache=1&status=1'
      }
        const dataEquiposMarcador = await Axios(options)
        console.log('asd', dataEquiposMarcador.data.data.spotlight.data)
        
        this.setState({
          pais1 : dataEquiposMarcador.data.data.spotlight.data[0].data[0].fields,
          pais2 : dataEquiposMarcador.data.data.spotlight.data[0].data[1].fields,
          cabeceraEnVivo: dataEquiposMarcador.data.data.spotlight.data[3].data[0].value,
          colorCabecera: dataEquiposMarcador.data.data.spotlight.data[8].data[0].value,
          estadioPartido: dataEquiposMarcador.data.data.spotlight.data[4].data[0].value,
        })
        this.obtenerTiempoJuego(dataEquiposMarcador.data.data.spotlight.data[5].data[0].value)
        this.convertirDataGoleadores(dataEquiposMarcador.data.data.spotlight.data[1].data)
        this.iniciarCronometro(dataEquiposMarcador.data.data.spotlight.data[6].data[0].value)
        this.convertirDataTarjetas(dataEquiposMarcador.data.data.spotlight.data[2].data)
    }
    catch(e){
      console.error(e)
    }
  }

  iniciarCronometro = (date) => {
    const { time } = this.state
    console.log('date', date , time)
    let hour = date

    if (time === 'SECOND_TIME') {
      hour = moment(date, 'YYYY-MM-DD hh:mm:ss').add(15, 'minute').format('YYYY/MM/DDTHH:mm:ss')
    }

    console.log('hour', hour)
    let actual = moment();
    let lunch1 = moment(hour, 'YYYY-MM-DD hh:mm:ss');
    let min = actual.diff(lunch1, 'minutes');
    console.log('lunch1', lunch1, hour)

    this.setState({
      cronometro: min >= 0 ? `${min}:${moment().second()}` : moment(hour, 'YYYY-MM-DD hh:mm:ss').format('h:mm A')
    })

    if (min >= 0) {
      this.interval = setInterval(() => this.tick(lunch1), 1000);
    }
  }

  convertirDataGoleadores = (array) => {
    let goleadoresEquipo1 = ''
    let goleadoresEquipo2 = ''
    array.forEach((item, i) => {
      if (item.fields[1].value['1']) {
        goleadoresEquipo1 === ''
          ? goleadoresEquipo1 = item.fields[0].value
          : goleadoresEquipo1 += ` - ${item.fields[0].value}`
      }
      if (item.fields[1].value['2']) {
        goleadoresEquipo2 === ''
        ? goleadoresEquipo2 = item.fields[0].value
        : goleadoresEquipo2 += ` - ${item.fields[0].value}`
      }
    })

    this.setState({
      goleadoresEquipo1,
      goleadoresEquipo2
    })
  }

  obtenerTiempoJuego = (time) => {
    console.log('time', time)

    if (time.first_time) {
      this.setState({
        time: 'FIRST_TIME'
      })
    } else if (time.second_time) {
      this.setState({
        time: 'SECOND_TIME'
      })
    } else if (time.first_overtime) {
      this.setState({
        time: 'FIRST_OVERTIME'
      })
    } else if (time.second_overtime) {
      this.setState({
        time: 'SECOND_OVERTIME'
      })
    }
  }

  convertirDataTarjetas = (array) => {
    let tarjetasRojasEquipo1 = ''
    let tarjetasAmarillasEquipo1 = ''
    let tarjetasRojasEquipo2 = ''
    let tarjetasAmarillasEquipo2 = ''

    array.forEach((item) => {
      if (item.fields[2].value['1']) {
        if (item.fields[1].value['yellow']) {
          tarjetasAmarillasEquipo1 === ''
            ? tarjetasAmarillasEquipo1 = item.fields[0].value
            : tarjetasAmarillasEquipo1 += ` - ${item.fields[0].value}`
        }
        if (item.fields[1].value['red']) {
          tarjetasRojasEquipo1 === ''
            ? tarjetasRojasEquipo1 = item.fields[0].value
            : tarjetasRojasEquipo1 += ` - ${item.fields[0].value}`
        }
      }
      if (item.fields[2].value['2']) {
        if (item.fields[1].value['yellow']) {
          tarjetasAmarillasEquipo2 === ''
          ? tarjetasAmarillasEquipo2 = item.fields[0].value
          : tarjetasAmarillasEquipo2 += ` - ${item.fields[0].value}`
        }
        if (item.fields[1].value['red']) {
          tarjetasRojasEquipo2 === ''
          ? tarjetasRojasEquipo2 = item.fields[0].value
          : tarjetasRojasEquipo2 += ` - ${item.fields[0].value}`
        }
      }
    })

    // console.log('goleadoresR1', tarjetasRojasEquipo1)
    // console.log('goleadoresA1', tarjetasAmarillasEquipo1)
    // console.log('goleadoresR2', tarjetasRojasEquipo2)
    // console.log('goleadoresA2', tarjetasAmarillasEquipo2)

    this.setState({
      tarjetasEquipo1: [tarjetasRojasEquipo1, tarjetasAmarillasEquipo1],
      tarjetasEquipo2: [tarjetasRojasEquipo2, tarjetasAmarillasEquipo2]
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    
  }

  render(){
    const {
      pais1,
      pais2,
      cabeceraEnVivo,
      colorCabecera,
      estadioPartido,

      listaMarcador,
      tarjetasEquipo2,
      tarjetasEquipo1,
      listaEstadioHora,
      goleadoresEquipo1,
      goleadoresEquipo2,
      cronometro,
    } = this.state
    
    // console.log('goleadoresEquipo2', moment().add(15, 'minutes').format('YYYY-MM-DD hh:mm:ss'))

  return(
    <>
      <Redirect target="_blank" href={listaEstadioHora.link_nota}>
        <ContainerMaster>
          <div>
            <JugadorTarjeta color="red">
              {tarjetasEquipo1[0] !== '' && <p></p>}
              {
                tarjetasEquipo1[0]?.split('-').map(p => (
                  <div>{p}</div>
                ))
              }
            </JugadorTarjeta>
            <JugadorTarjeta color="yellow">
            {tarjetasEquipo1[1] !== '' && <p></p>}
              {
                tarjetasEquipo1[1]?.split('-').map(p => (
                  <div>{p}</div>
                ))
              }
            </JugadorTarjeta>
          </div>
          <Goleadores left="25px">
            {goleadoresEquipo1.length !== 0 &&<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQL8W6ZoTabIuzsZ_Jmn_hGISkqOrnyZFsA7A&usqp=CAU" />}
            <div>
              {
                goleadoresEquipo1.split('-').map(jugador => (
                  <div>
                    {jugador}
                  </div>
                ))
              }
            </div>
          </Goleadores>
          <ContainerEquiposMarcador>
            <WrapperPais>
              <ImgPais 
                src={pais1[1]?.value.url}
              />
              <Pais> {pais1[0]?.value} </Pais>
            </WrapperPais>
            <Marcador>{pais1[3]?.value}</Marcador>
            <EnVivo>
              <TituloPrincipal estadoColor={colorCabecera}>{cabeceraEnVivo}</TituloPrincipal>
              <TiempoPartido>{cronometro}</TiempoPartido>
              <Estadio>{estadioPartido}</Estadio>
            </EnVivo>
            <Marcador>{pais2[3]?.value}</Marcador>
            <WrapperPais>
              <ImgPais
                src={pais2[1]?.value.url}
              />
              <Pais>{pais2[0]?.value}</Pais>
            </WrapperPais>
          </ContainerEquiposMarcador>
            <Goleadores right="35px">
              {goleadoresEquipo2.length !== 0 &&<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQL8W6ZoTabIuzsZ_Jmn_hGISkqOrnyZFsA7A&usqp=CAU"/>}
              <div>
                {
                  goleadoresEquipo2.split('-').map(jugador => (
                    <div>
                      {jugador}
                    </div>
                  ))
                }
              </div>
            </Goleadores>
            <div>
              <JugadorTarjeta color="yellow">
                {tarjetasEquipo2[1] !== '' && <p></p>}
                {
                  tarjetasEquipo2[1]?.split('-').map(p => (
                    <div>{p}</div>
                  ))
                }
              </JugadorTarjeta>
              <JugadorTarjeta color="red">
              {tarjetasEquipo2[0] !== '' && <p></p>}
                {
                  tarjetasEquipo2[0]?.split('-').map(p => (
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
  color: ${(props) => props.estadoColor};
  font-family: 'Roboto', sans-serif;
  &::after{
    position: absolute;
    content : "";
    display: block;
    width: 150px;
    height: 2px;
    background: ${(props) => props.estadoColor};
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
  font-size: 20px;
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
