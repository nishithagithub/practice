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
import React, { useState, useEffect } from "react";
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
  const [toastMessage, setToastMessage] = useState("");

  const { performSQLAction } = useSQLiteDB();
  const history = useHistory();

  useEffect(() => {
    deleteExpiredMedicines();
  }, []);

  const validateInputs = () => {
    const currentDate = new Date().toISOString().split('T')[0];

    if (!inputName) {
      setToastMessage("Name is required");
      setShowToast(true);
      return false;
    }
    if (!inputType) {
      setToastMessage("Type is required");
      setShowToast(true);
      return false;
    }
    if (!inputQuantity) {
      setToastMessage("Quantity is required");
      setShowToast(true);
      return false;
    }
    if (!inputExpiryDate) {
      setToastMessage("Expiry Date is required");
      setShowToast(true);
      return false;
    }
    if (inputExpiryDate < currentDate) {
      setToastMessage("Expiry Date cannot be in the past");
      setShowToast(true);
      return false;
    }
    if (!inputBatchNo) {
      setToastMessage("Batch No is required");
      setShowToast(true);
      return false;
    }
    if (inputPrice === undefined || inputPrice <= 0) {
      setToastMessage("Price must be a positive number");
      setShowToast(true);
      return false;
    }
    return true;
  };

  const addItem = async () => {
    if (!validateInputs()) return;

    await performSQLAction(async (db) => {
      await db?.query(
        `INSERT INTO medicines (name, type, quantity, expiry_date, batch_no, price) VALUES (?, ?, ?, ?, ?, ?);`,
        [inputName, inputType, inputQuantity, inputExpiryDate, inputBatchNo, inputPrice]
      );
      resetInputs();
      setToastMessage("Medicine added successfully!");
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

  const deleteExpiredMedicines = async () => {
    await performSQLAction(async (db) => {
      const currentDate = new Date().toISOString().split('T')[0];
      await db?.query(
        `DELETE FROM medicines WHERE expiry_date < ?;`,
        [currentDate]
      );
    });
  };

  return (
    <IonPage>
      <IonHeader className='headercls'>
       
          Add Medicines
        
      </IonHeader>
      <IonContent fullscreen>
        <div className="form-container">
          <IonItem className="itemcls">
            <IonLabel position="floating" className="labelcls">Name <span className="required">*</span></IonLabel>
            <IonInput
              type="text"
              value={inputName}
              onIonInput={(e) => setInputName(e.target.value as string)}
              required
            />
          </IonItem>
          <IonItem className="itemcls">
            <IonLabel className="labelcls">Type <span className="required">*</span></IonLabel>
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
            <IonLabel position="floating" className="labelcls">Quantity <span className="required">*</span></IonLabel>
            <IonInput
              type="text"
              value={inputQuantity}
              onIonInput={(e) => setInputQuantity(e.target.value as string)}
              required
            />
          </IonItem>
          <IonItem className="itemcls">
            <IonLabel position="floating" className="labelcls">Expiry Date <span className="required">*</span></IonLabel>
            <IonInput
              type="date"
              value={inputExpiryDate}
              onIonInput={(e) => setInputExpiryDate(e.target.value as string)}
              required
            />
          </IonItem>
          <IonItem className="itemcls">
            <IonLabel position="floating" className="labelcls">Batch No <span className="required">*</span></IonLabel>
            <IonInput
              type="text"
              value={inputBatchNo}
              onIonInput={(e) => setInputBatchNo(e.target.value as string)}
              required
            />
          </IonItem>
          <IonItem className="itemcls">
            <IonLabel position="floating" className="labelcls">Price (Rs.) <span className="required">*</span></IonLabel>
            <IonInput
              type="number"
              value={inputPrice}
              onIonInput={(e) => setInputPrice(Number(e.target.value))}
              required
            />
          </IonItem>
          <IonButton expand="block" onClick={addItem} color="primary">Add Medicine</IonButton>
          <IonButton expand="block" onClick={viewMedicines} color="light">View Medicines</IonButton>
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
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
