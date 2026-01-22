import './Perfil.css'
import profileLogo from '../../assets/perfilDefecte.png'

function Perfil() {
  return (
    <>
      <div>
        <h1>Perfil</h1>
        <img src={profileLogo} alt="Foto de perfil" />
      </div>
    </>
  )
}

export default Perfil