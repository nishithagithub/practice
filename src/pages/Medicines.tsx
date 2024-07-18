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
  IonFooter,
  IonText,
} from "@ionic/react";
import React, { useState } from "react";
import useSQLiteDB from "../composables/useSQLiteDB";
import { useHistory } from "react-router-dom";
import './Medicines.css';

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
      <IonHeader className='headercls'>
        Add Medicines
      </IonHeader>
      <IonContent fullscreen>
        <div className="form-container">
        <IonItem className="itemcls">
          <IonLabel position="floating" className="labelcls">Name</IonLabel>
          <IonInput
            type="text"
            value={inputName}
            onIonInput={(e) => setInputName(e.target.value as string)}
          />
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel className="labelcls">Type</IonLabel>
          <IonSelect
            value={inputType}
            placeholder="Select One"
            onIonChange={(e) => setInputType(e.detail.value)}
          >
            <IonSelectOption value="strip" className="labelcls">Strip</IonSelectOption>
            <IonSelectOption value="tube" className="labelcls">Tube</IonSelectOption>
            <IonSelectOption value="powder" className="labelcls">Powder</IonSelectOption>
            <IonSelectOption value="liquid" className="labelcls">Liquid</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel position="floating" className="labelcls">Quantity</IonLabel>
          <IonInput
            type="text"
            value={inputQuantity}
            onIonInput={(e) => setInputQuantity(e.target.value as string)}
          />
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel position="floating" className="labelcls">Expiry Date</IonLabel>
          <IonInput
            type="date"
            value={inputExpiryDate}
            onIonInput={(e) => setInputExpiryDate(e.target.value as string)}
          />
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel position="floating" className="labelcls">Batch No</IonLabel>
          <IonInput
            type="text"
            value={inputBatchNo}
            onIonInput={(e) => setInputBatchNo(e.target.value as string)}
          />
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel position="floating" className="labelcls">Price (Rs.)</IonLabel>
          <IonInput
            type="number"
            value={inputPrice}
            onIonInput={(e) => setInputPrice(Number(e.target.value))}
          />
        </IonItem>
        <IonButton expand="block" onClick={addItem}>Add Medicine</IonButton>
        <IonButton expand="block" onClick={viewMedicines} color="light">View Medicines</IonButton>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Medicine added successfully!"
          duration={2000}
        />
        </div>
      </IonContent>
      <IonFooter className='footer'>
        <IonText>Contact Us : 9010203040</IonText>
        <IonText>Email : abc@gmail.com</IonText>
      </IonFooter>
    </IonPage>
  );
};

export default Medicines;
