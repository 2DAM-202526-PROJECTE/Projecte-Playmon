import { useEffect, useState } from "react";
import PerfilCard from "@/features/compte/perfil/pages/PerfilCard";
import ModalEditarPerfil from "@/features/compte/perfil/pages/compte/ModelEditarPerfil";
import ModalCanviarAvatar from "@/features/compte/perfil/pages/compte/ModelEditarAvatar";
import { getCurrentUser, updateCurrentUser } from "@/api/authApi";
import { uploadAvatar, deleteAvatar } from "@/api/usersApi";

import defaultAvatar from "@/assets/perfilDefecte.png";
import CameraIcon from "@/assets/camera_icon.svg";

export default function CompteInici() {
  const [user, setUser] = useState(() => {
    const authUser = getCurrentUser();
    return {
      name: authUser?.name ?? authUser?.username ?? "Usuari",
      email: authUser?.email ?? "",
      avatar: authUser?.avatar ?? defaultAvatar,
    };
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

  const guardarAvatar = async (fitxer) => {
    const authUser = getCurrentUser();
    if (!authUser?.id) {
      throw new Error("User not authenticated");
    }

    const { avatar_url } = await uploadAvatar(authUser.id, fitxer);

    setUser((prev) => ({ ...prev, avatar: avatar_url }));
    updateCurrentUser({ avatar: avatar_url });
  };

  const eliminarAvatar = async () => {
    const authUser = getCurrentUser();
    if (!authUser?.id) {
      throw new Error("User not authenticated");
    }

    await deleteAvatar(authUser.id);
    setUser((prev) => ({ ...prev, avatar: null }));
    updateCurrentUser({ avatar: null });
  };

  const guardarPerfil = async (dades) => {
    await new Promise((r) => setTimeout(r, 200));
    setUser((prev) => ({ ...prev, ...dades }));
    updateCurrentUser(dades);
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