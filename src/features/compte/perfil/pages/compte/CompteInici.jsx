import { useEffect, useState, useRef } from "react";
import PerfilCard from "@/features/compte/perfil/pages/PerfilCard";
import ModalEditarPerfil from "@/features/compte/perfil/pages/compte/ModelEditarPerfil";
import ModalCanviarAvatar from "@/features/compte/perfil/pages/compte/ModelEditarAvatar";

import defaultAvatar from "@/assets/perfilDefecte.png";
import CameraIcon from "@/assets/camera_icon.svg";

export default function CompteInici() {
  const [user, setUser] = useState({
    name: "Eloi",
    email: "eloicortiella@iesebre.com",
    avatar: defaultAvatar,
  });

  const [modalEditarObert, setModalEditarObert] = useState(false);
  const [modalAvatarObert, setModalAvatarObert] = useState(false);

  useEffect(() => {
    console.log("modalEditarObert (canvi):", modalEditarObert);
  }, [modalEditarObert]);

  const obrirModalEditar = () => {
    console.log("Editar perfil");
    setModalEditarObert(true);
  };

  const obrirModalAvatar = () => {
    console.log("OBRIR MODAL AVATAR");
    setModalAvatarObert(true);
  };

  const avatarLocalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (avatarLocalRef.current) URL.revokeObjectURL(avatarLocalRef.current);
    };
  }, []);

  const guardarAvatar = async (fitxer) => {
    await new Promise((r) => setTimeout(r, 250));

    const url = URL.createObjectURL(fitxer);

    if (avatarLocalRef.current) URL.revokeObjectURL(avatarLocalRef.current);
    avatarLocalRef.current = url;

    setUser((prev) => ({ ...prev, avatar: url }));
  };

  const eliminarAvatar = () => {
    setUser((prev) => ({ ...prev, avatar: null }));
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
        onEditProfile={() => setModalEditarObert(true)}
        onChangePhoto={() => setModalAvatarObert(true)}
      />

      <ModalEditarPerfil
        obert={modalEditarObert}
        user={user}
        onTancar={() => setModalEditarObert(false)}
        onGuardar={guardarPerfil}
      />

      <ModalCanviarAvatar
        obert={modalAvatarObert}
        avatarActual={user.avatar}
        onTancar={() => setModalAvatarObert(false)}
        onGuardar={guardarAvatar}
        onEliminar={eliminarAvatar}
      />
    </>
  );
}