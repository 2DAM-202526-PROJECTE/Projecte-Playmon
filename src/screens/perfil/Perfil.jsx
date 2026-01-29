import './Perfil.css'
import profileLogo from '../../assets/prova.jpg'

function Perfil() {
  return (
    <>
      <div>
        <h1>Perfil</h1>
        <img src={profileLogo} className="w-md rounded-xl" alt="Foto de perfil" />

        <div>
          <h2>Nom d'usuari</h2> {/* Aquí s'hauria d'inserir el nom d'usuari dinàmicament */}
          <p>Correu electrònic</p> {/* Aquí s'hauria d'inserir el correu electrònic dinàmicament */}
          <button>Editar perfil</button> {/* Botó per editar el perfil */}
          <div>
            <nav> {/* Navegació per diferents seccions del perfil. Separar-lo a la zona  */}
              <span>
                <h3>Informacio Personal</h3>
                <h3>Configuracio del compte</h3>
                <h3>Pagaments i subscripcions</h3>
              </span>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Perfil