import PerfilCard from "@/features/compte/perfil/pages/PerfilCard";

import defaultAvatar from "@/assets/perfilDefecte.png";
import CameraIcon from "@/assets/camera_icon.svg";

export default function CompteInici() {
  const user = {
    name: "Eloi",
    email: "eloicortiella@iesebre.com",
    avatar: defaultAvatar,
  };

  return (
    <PerfilCard
      user={user}
      cameraIcon={CameraIcon}
      onEditProfile={() => console.log("Editar perfil")}
      onChangePhoto={() => console.log("Canviar foto")}
      onManagePlan={() => console.log("Gestionar pla")}
    />
  );
}
