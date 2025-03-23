import { IconUserFilled } from "@tabler/icons-react";
import styles from "./styles/ProfileBtn.module.css";

export default function ProfileBtn() {
  return (
    <IconUserFilled
      className={styles.icon}
      size={30}
      color="white"
      onClick={() => {
        alert("Profile button clicked!");
      }}
    />
  );
}
