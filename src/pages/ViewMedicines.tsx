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
  IonCol,
  IonRow,
  IonGrid,
  IonFooter,
  IonText,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import useConfirmationAlert from "../composables/useConfirmationAlert";

type MedicineItem = {
  id: number;
  name: string;
  type: string;
  quantity: string;
  expiry_date: string;
  batch_no: string;
  price: number;
};

const ViewMedicines: React.FC = () => {
  const [items, setItems] = useState<Array<MedicineItem>>([]);
  const [editItem, setEditItem] = useState<MedicineItem | undefined>();
  const [inputName, setInputName] = useState("");
  const [inputType, setInputType] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputExpiryDate, setInputExpiryDate] = useState("");
  const [inputBatchNo, setInputBatchNo] = useState("");
  const [inputPrice, setInputPrice] = useState<number | undefined>();

  const { performSQLAction, initialized } = useSQLiteDB();
  const { showConfirmationAlert, ConfirmationAlert } = useConfirmationAlert();

  useEffect(() => {
    if (initialized) {
      loadData();
    }
  }, [initialized]);

  const loadData = async () => {
    try {
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`SELECT * FROM medicines`);
        setItems(respSelect?.values || []);
      });
    } catch (error) {
      alert((error as Error).message);
      setItems([]);
    }
  };

  const updateItem = async () => {
    try {
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(
            `UPDATE medicines SET name=?, type=?, quantity=?, expiry_date=?, batch_no=?, price=? WHERE id=?`,
            [
              inputName,
              inputType,
              inputQuantity,
              inputExpiryDate,
              inputBatchNo,
              inputPrice,
              editItem?.id,
            ]
          );

          const respSelect = await db?.query(`SELECT * FROM medicines;`);
          setItems(respSelect?.values || []);
        },
        async () => {
          resetInputs();
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          await db?.query(`DELETE FROM medicines WHERE id=?;`, [itemId]);

          const respSelect = await db?.query(`SELECT * FROM medicines;`);
          setItems(respSelect?.values || []);
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const confirmDelete = (itemId: number) => {
    showConfirmationAlert("Are You Sure You Want To Delete This Item?", () => {
      deleteItem(itemId);
    });
  };

  const doEditItem = (item: MedicineItem | undefined) => {
    if (item) {
      setEditItem(item);
      setInputName(item.name);
      setInputType(item.type);
      setInputQuantity(item.quantity);
      setInputExpiryDate(item.expiry_date);
      setInputBatchNo(item.batch_no);
      setInputPrice(item.price);
    } else {
      resetInputs();
    }
  };

  const resetInputs = () => {
    setEditItem(undefined);
    setInputName("");
    setInputType("");
    setInputQuantity("");
    setInputExpiryDate("");
    setInputBatchNo("");
    setInputPrice(undefined);
  };

  return (
    <IonPage>
      <IonHeader className='headercls'>
      Data Table
    </IonHeader>
      <IonContent fullscreen className="ion-padding">
      <IonGrid>
            <IonRow className='titles'>
              <IonCol className='tablecol'>S.No</IonCol>
              <IonCol className='tablecol'>Name</IonCol>
              <IonCol className='tablecol'>Type</IonCol>
              <IonCol className='tablecol'>Quantity</IonCol>
              <IonCol className='tablecol'>Expiry Date</IonCol>
              <IonCol className='tablecol'>Batch No</IonCol>
              <IonCol className='tablecol'>Price</IonCol>
              <IonCol className='tablecol'>Edit</IonCol>
              <IonCol className='tablecol'>Delete</IonCol>
            </IonRow>
            {items?.map((item, index) => (
              <IonRow key={item.id}>
                <IonCol className='tablecol'>{index+1}</IonCol>
                <IonCol className='tablecol'>{item.name}</IonCol>
                <IonCol className='tablecol'>{item.type}</IonCol>
                <IonCol className='tablecol'>{item.quantity}</IonCol>
                <IonCol className='tablecol'>{item.expiry_date}</IonCol>
                <IonCol className='tablecol'>{item.batch_no}</IonCol>
                <IonCol className='tablecol'>{item.price}</IonCol>
                <IonCol className='tablecol'>
                  <IonButton color="light" onClick={() => doEditItem(item)}>EDIT</IonButton>
                  </IonCol>
                  <IonCol className='tablecol'>
                <IonButton color="light" onClick={() => confirmDelete(item.id)}>DELETE</IonButton>
                </IonCol>
                
              </IonRow>
            ))}
          </IonGrid>
        

        {editItem && (
          <>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Name</IonLabel>
              <IonInput
                type="text"
                value={inputName}
                onIonInput={(e) => setInputName(e.target.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Type</IonLabel>
              <IonInput
                type="text"
                value={inputType}
                onIonInput={(e) => setInputType(e.target.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Quantity</IonLabel>
              <IonInput
                type="text"
                value={inputQuantity}
                onIonInput={(e) => setInputQuantity(e.target.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Expiry Date</IonLabel>
              <IonInput
                type="date"
                value={inputExpiryDate}
                onIonInput={(e) => setInputExpiryDate(e.target.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Batch No</IonLabel>
              <IonInput
                type="text"
                value={inputBatchNo}
                onIonInput={(e) => setInputBatchNo(e.target.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Price (Rs.)</IonLabel>
              <IonInput
                type="number"
                value={inputPrice}
                onIonInput={(e) => setInputPrice(Number(e.target.value))}
              />
            </IonItem>
            <IonButton color="light" onClick={() => doEditItem(undefined)}>CANCEL</IonButton>
            <IonButton color="light" onClick={updateItem}>UPDATE</IonButton>
          </>
        )}

        {ConfirmationAlert}
      </IonContent>
      <IonFooter className='footer'>
      <IonText>Contact Us : 9010203040</IonText>
      <IonText>Email : abc@gmail.com</IonText>
    </IonFooter>
    </IonPage>
  );
};

export default ViewMedicines;
