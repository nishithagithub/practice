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
import { useLocation } from "react-router-dom";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import useConfirmationAlert from "../composables/useConfirmationAlert";

type GeneralItem = {
  id: number;
  name: string;
  quantity: string;
  expiry_date: string;
  batch_no: string;
  price: number;
};

interface RouteState {
  pharmacyName: string;
}

const ViewGeneralItems: React.FC = () => {
  const location = useLocation();
  const pharmacyName = (location.state as RouteState)?.pharmacyName || '';
  console.log(pharmacyName);
  const [items, setItems] = useState<Array<GeneralItem>>([]);
  const [expiredItems, setExpiredItems] = useState<Array<GeneralItem>>([]);
  const [editItem, setEditItem] = useState<GeneralItem | undefined>();
  const [inputName, setInputName] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [inputExpiryDate, setInputExpiryDate] = useState("");
  const [inputBatchNo, setInputBatchNo] = useState("");
  const [inputPrice, setInputPrice] = useState<number | undefined>();

  const { performSQLAction, initialized } = useSQLiteDB(pharmacyName);
  const { showConfirmationAlert, ConfirmationAlert } = useConfirmationAlert();

  useEffect(() => {
    if (initialized) {
      createExpiredItemsTable();
      loadData();
    }
  }, [initialized, pharmacyName]);

  const createExpiredItemsTable = async () => {
    try {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        if (db) {
          const formattedName = pharmacyName.replace(/\s+/g, '_').toLowerCase();
          await db.query(`
            CREATE TABLE IF NOT EXISTS expired_general_items_${formattedName} (
              id INTEGER PRIMARY KEY,
              name TEXT,
              quantity TEXT,
              expiry_date TEXT,
              batch_no TEXT,
              price REAL
            )
          `);
        }
      });
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const loadData = async () => {
    try {
      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        if (db) {
          const currentDate = new Date().toISOString().split('T')[0];
          const formattedName = pharmacyName.replace(/\s+/g, '_').toLowerCase();
          
          const respSelect = await db.query(`SELECT * FROM general_items_${formattedName}`);
          const allItems = respSelect?.values || [];

          const nonExpiredItems = allItems.filter((item: GeneralItem) => item.expiry_date >= currentDate);
          const expiredItems = allItems.filter((item: GeneralItem) => item.expiry_date < currentDate);

          setItems(nonExpiredItems);
          setExpiredItems(expiredItems);

          await moveExpiredItems(expiredItems, db);
          await db.query(`DELETE FROM general_items_${formattedName} WHERE expiry_date < ?;`, [currentDate]);
        }
      });
    } catch (error) {
      alert((error as Error).message);
      setItems([]);
    }
  };

  const moveExpiredItems = async (expiredItems: Array<GeneralItem>, db: SQLiteDBConnection | undefined) => {
    try {
      for (const item of expiredItems) {
        await db?.query(
          `INSERT INTO expired_general_items_${pharmacyName.replace(/\s+/g, '_').toLowerCase()} (id, name, quantity, expiry_date, batch_no, price) VALUES (?, ?, ?, ?, ?, ?)`,
          [item.id, item.name, item.quantity, item.expiry_date, item.batch_no, item.price]
        );
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const updateItem = async () => {
    try {
      await performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          const formattedName = pharmacyName.replace(/\s+/g, '_').toLowerCase();
          await db?.query(
            `UPDATE general_items_${formattedName} SET name=?, quantity=?, expiry_date=?, batch_no=?, price=? WHERE id=?`,
            [
              inputName,
              inputQuantity,
              inputExpiryDate,
              inputBatchNo,
              inputPrice,
              editItem?.id,
            ]
          );

          loadData(); // Reload data to refresh the list
          resetInputs();
        }
      );
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      await performSQLAction(
        async (db: SQLiteDBConnection | undefined) => {
          const formattedName = pharmacyName.replace(/\s+/g, '_').toLowerCase();
          await db?.query(`DELETE FROM general_items_${formattedName} WHERE id=?;`, [itemId]);
          loadData(); // Reload data to refresh the list
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

  const doEditItem = (item: GeneralItem | undefined) => {
    if (item) {
      setEditItem(item);
      setInputName(item.name);
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
    setInputQuantity("");
    setInputExpiryDate("");
    setInputBatchNo("");
    setInputPrice(undefined);
  };

  return (
    <IonPage>
      <IonHeader className='headercls'>
        <IonToolbar>
          <IonTitle>View General Items</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid>
          <IonRow className='titles'>
            <IonCol className='tablecol'>S.No</IonCol>
            <IonCol className='tablecol'>Name</IonCol>
            <IonCol className='tablecol'>Quantity</IonCol>
            <IonCol className='tablecol'>Expiry Date</IonCol>
            <IonCol className='tablecol'>Batch No</IonCol>
            <IonCol className='tablecol'>Price</IonCol>
            <IonCol className='tablecol'>Edit</IonCol>
            <IonCol className='tablecol'>Delete</IonCol>
          </IonRow>
          {items?.map((item, index) => (
            <IonRow key={item.id}>
              <IonCol className='tablecol'>{index + 1}</IonCol>
              <IonCol className='tablecol'>{item.name}</IonCol>
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
                onIonInput={(e) => setInputName(e.detail.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Quantity</IonLabel>
              <IonInput
                type="text"
                value={inputQuantity}
                onIonInput={(e) => setInputQuantity(e.detail.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Expiry Date</IonLabel>
              <IonInput
                type="date"
                value={inputExpiryDate}
                onIonInput={(e) => setInputExpiryDate(e.detail.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Batch No</IonLabel>
              <IonInput
                type="text"
                value={inputBatchNo}
                onIonInput={(e) => setInputBatchNo(e.detail.value as string)}
              />
            </IonItem>
            <IonItem className="itemcls">
              <IonLabel className="labelcls">Price</IonLabel>
              <IonInput
                type="number"
                value={inputPrice || ""}
                onIonInput={(e) => setInputPrice(parseFloat(e.detail.value as string))}
              />
            </IonItem>
            <IonButton expand="full" color="primary" onClick={updateItem}>
              Update
            </IonButton>
          </>
        )}
      </IonContent>
      <IonFooter>
        <IonButton routerLink={`/add/general-items/${pharmacyName.replace(/\s+/g, '_')}`} expand="full">
          Back to General Items
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};

export default ViewGeneralItems;
