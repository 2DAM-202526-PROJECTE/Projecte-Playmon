import { useEffect, useState } from "react";
import PerfilCard from "@/features/compte/perfil/pages/PerfilCard";
import ModalEditarPerfil from "@/features/compte/perfil/pages/compte/ModelEditarPerfil";

import defaultAvatar from "@/assets/perfilDefecte.png";
import CameraIcon from "@/assets/camera_icon.svg";

export default function CompteInici() {
  const [user, setUser] = useState({
    name: "Eloi",
    email: "eloicortiella@iesebre.com",
    avatar: defaultAvatar,
  });

  const [modalEditarObert, setModalEditarObert] = useState(false);

  useEffect(() => {
    console.log("modalEditarObert (canvi):", modalEditarObert);
  }, [modalEditarObert]);

  const obrirModalEditar = () => {
    console.log("Editar perfil");
    setModalEditarObert(true);
  };

  const guardarPerfil = async (dades) => {
    await new Promise((r) => setTimeout(r, 200));
    setUser((prev) => ({ ...prev, ...dades }));
  };

  return (
    <>
      <PerfilCard
        user={user}
        cameraIcon={CameraIcon}
        onEditProfile={obrirModalEditar}
        onChangePhoto={() => console.log("Canviar foto")}
        onManagePlan={() => console.log("Gestionar pla")}
      />

      <ModalEditarPerfil
        obert={modalEditarObert}
        user={user}
        onTancar={() => setModalEditarObert(false)}
        onGuardar={guardarPerfil}
      />
    </>
  );
}
