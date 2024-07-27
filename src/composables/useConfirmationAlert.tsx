import { useState } from "react";
import { IonAlert } from "@ionic/react";

const useConfirmationAlert = () => {
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showConfirmationAlert = (message: string, onConfirm: () => void) => {
    setAlert({
      isOpen: true,
      message,
      onConfirm,
    });
  };

  const handleConfirm = () => {
    if (alert) {
      alert.onConfirm();
      setAlert(null);
    }
  };

  const handleCancel = () => {
    setAlert(null);
  };

  const ConfirmationAlert = alert ? (
    <IonAlert
      isOpen={alert.isOpen}
      message={alert.message}
      buttons={[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: handleCancel,
        },
        {
          text: 'Confirm',
          handler: handleConfirm,
        },
      ]}
      onDidDismiss={() => setAlert(null)}
    />
  ) : null;

  return {
    showConfirmationAlert,
    ConfirmationAlert,
  };
};

export default useConfirmationAlert;
