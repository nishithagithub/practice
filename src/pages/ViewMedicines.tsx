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
        <IonHeader>
          <IonToolbar>
            <IonTitle>View Medicines</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <h3>Medicines Data</h3>
          <table>
            <thead>
              <tr>
                <th>S No</th>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Expiry Date</th>
                <th>Batch No</th>
                <th>Price</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
                  <td>{item.quantity}</td>
                  <td>{item.expiry_date}</td>
                  <td>{item.batch_no}</td>
                  <td>{item.price}</td>
                  <td>
                    <IonButton onClick={() => doEditItem(item)}>EDIT</IonButton>
                  </td>
                  <td>
                    <IonButton onClick={() => confirmDelete(item.id)}>DELETE</IonButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {editItem && (
            <>
              <IonItem>
                <IonLabel>Name</IonLabel>
                <IonInput
                  type="text"
                  value={inputName}
                  onIonInput={(e) => setInputName(e.target.value as string)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Type</IonLabel>
                <IonInput
                  type="text"
                  value={inputType}
                  onIonInput={(e) => setInputType(e.target.value as string)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Quantity</IonLabel>
                <IonInput
                  type="text"
                  value={inputQuantity}
                  onIonInput={(e) => setInputQuantity(e.target.value as string)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Expiry Date</IonLabel>
                <IonInput
                  type="date"
                  value={inputExpiryDate}
                  onIonInput={(e) => setInputExpiryDate(e.target.value as string)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Batch No</IonLabel>
                <IonInput
                  type="text"
                  value={inputBatchNo}
                  onIonInput={(e) => setInputBatchNo(e.target.value as string)}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Price (Rs.)</IonLabel>
                <IonInput
                  type="number"
                  value={inputPrice}
                  onIonInput={(e) => setInputPrice(Number(e.target.value))}
                />
              </IonItem>
              <IonButton onClick={() => doEditItem(undefined)}>CANCEL</IonButton>
              <IonButton onClick={updateItem}>UPDATE</IonButton>
            </>
          )}
  
          {ConfirmationAlert}
        </IonContent>
      </IonPage>
    );
  };
  
  export default ViewMedicines;
  