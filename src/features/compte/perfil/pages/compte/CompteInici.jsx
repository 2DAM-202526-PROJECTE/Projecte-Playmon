import { useState, useMemo } from "react";
import PerfilCard from "@/features/compte/perfil/pages/PerfilCard";
import ModalEditarPerfil from "@/features/compte/perfil/pages/compte/ModelEditarPerfil";
import ModalCanviarAvatar from "@/features/compte/perfil/pages/compte/ModelEditarAvatar";
import { uploadAvatar, deleteAvatar } from "@/api/usersApi";
import { useAuthUser } from "@/features/compte/perfil/hooks/useAuthUser";

import defaultAvatar from "@/assets/perfilDefecte.png";
import CameraIcon from "@/assets/camera_icon.svg";

export default function CompteInici() {
  const [authUser, patchUser] = useAuthUser();

  const user = useMemo(() => ({
    name:        authUser?.name ?? authUser?.username ?? "Usuari",
    email:       authUser?.email ?? "",
    avatar:      authUser?.avatar ?? defaultAvatar,
    username:    authUser?.username ?? "",
    plan:        authUser?.pla_pagament ?? "basic",
    telefon:     authUser?.telefon ?? "",
    idioma:      authUser?.idioma  ?? "",
    memberSince: authUser?.created_at ?? authUser?.data_alta ?? authUser?.createdAt ?? null,
  }), [authUser]);

  const [modalEditarObert, setModalEditarObert] = useState(false);
  const [modalAvatarObert, setModalAvatarObert] = useState(false);

  const guardarAvatar = async (fitxer) => {
    if (!authUser?.id) throw new Error("User not authenticated");
    const { avatar_url } = await uploadAvatar(authUser.id, fitxer);
    patchUser({ avatar: avatar_url });
  };

  const eliminarAvatar = async () => {
    if (!authUser?.id) throw new Error("User not authenticated");
    await deleteAvatar(authUser.id);
    patchUser({ avatar: null });
  };

  const guardarPerfil = async (dades) => {
    patchUser(dades);
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
