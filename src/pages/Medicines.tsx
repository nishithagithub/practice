import {
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonContent,
  IonItem,
  IonButton,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import React, { useState } from "react";
import useSQLiteDB from "../composables/useSQLiteDB";
import { useHistory } from "react-router-dom";

const Medicines: React.FC = () => {
  const [inputName, setInputName] = useState("");
  const [inputType, setInputType] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputExpiryDate, setInputExpiryDate] = useState("");
  const [inputBatchNo, setInputBatchNo] = useState("");
  const [inputPrice, setInputPrice] = useState<number | undefined>();
  const [showToast, setShowToast] = useState(false);

  const { performSQLAction } = useSQLiteDB();
  const history = useHistory();

  const addItem = async () => {
    await performSQLAction(async (db) => {
      await db?.query(
        `INSERT INTO medicines (name, type, quantity, expiry_date, batch_no, price) VALUES (?, ?, ?, ?, ?, ?);`,
        [inputName, inputType, inputQuantity, inputExpiryDate, inputBatchNo, inputPrice]
      );
      resetInputs();
      setShowToast(true);
    });
  };

  const resetInputs = () => {
    setInputName("");
    setInputType("");
    setInputQuantity("");
    setInputExpiryDate("");
    setInputBatchNo("");
    setInputPrice(undefined);
  };

  const viewMedicines = () => {
    history.push('/view-medicines'); // Adjust the route to the actual view medicines page
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Medicine</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Name</IonLabel>
          <IonInput
            type="text"
            value={inputName}
            onIonInput={(e) => setInputName(e.target.value as string)}
          />
        </IonItem>
        <IonItem>
          <IonLabel>Type</IonLabel>
          <IonSelect
            value={inputType}
            placeholder="Select One"
            onIonChange={(e) => setInputType(e.detail.value)}
          >
            <IonSelectOption value="strip">Strip</IonSelectOption>
            <IonSelectOption value="tube">Tube</IonSelectOption>
            <IonSelectOption value="powder">Powder</IonSelectOption>
            <IonSelectOption value="liquid">Liquid</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Quantity</IonLabel>
          <IonInput
            type="text"
            value={inputQuantity}
            onIonInput={(e) => setInputQuantity(e.target.value as string)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Expiry Date</IonLabel>
          <IonInput
            type="date"
            value={inputExpiryDate}
            onIonInput={(e) => setInputExpiryDate(e.target.value as string)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Batch No</IonLabel>
          <IonInput
            type="text"
            value={inputBatchNo}
            onIonInput={(e) => setInputBatchNo(e.target.value as string)}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Price (Rs.)</IonLabel>
          <IonInput
            type="number"
            value={inputPrice}
            onIonInput={(e) => setInputPrice(Number(e.target.value))}
          />
        </IonItem>
        <IonButton expand="block" onClick={addItem}>Add Medicine</IonButton>
        <IonButton expand="block" onClick={viewMedicines} color="medium">View Medicines</IonButton>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Medicine added successfully!"
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Medicines;
