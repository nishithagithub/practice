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
  IonList,
  IonToast,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import useSQLiteDB from "../composables/useSQLiteDB";

const Search: React.FC = () => {
  const [searchType, setSearchType] = useState<"medicines" | "general_items">("medicines");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { performSQLAction } = useSQLiteDB();

  useEffect(() => {
    fetchAllItems();
  }, [searchType]);

  const fetchAllItems = async () => {
    await performSQLAction(async (db) => {
      const query = `SELECT * FROM ${searchType}`;
      const results = await db?.query(query);
      setSearchResults(results?.values ?? []);
    });
  };

  const addToCart = async (item: any, quantity: number) => {
    if (quantity <= 0 || quantity > item.quantity) {
      setToastMessage("Invalid quantity.");
      setShowToast(true);
      return;
    }

    const newItem = { ...item, quantity };
    setCart((prevCart) => [...prevCart, newItem]);

    const newQuantity = item.quantity - quantity;
    await performSQLAction(async (db) => {
      await db?.query(`UPDATE ${searchType} SET quantity = ? WHERE id = ?`, [newQuantity, item.id]);
    });

    setToastMessage("Item added to cart.");
    setShowToast(true);
    // Refresh the search results to reflect updated quantities
    await fetchAllItems();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search Items</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonItem>
          <IonLabel>Type</IonLabel>
          <IonSelect
            value={searchType}
            onIonChange={(e) => setSearchType(e.detail.value)}
          >
            <IonSelectOption value="medicines">Medicines</IonSelectOption>
            <IonSelectOption value="general_items">General Items</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonList>
          {searchResults.map((item) => (
            <IonItem key={item.id}>
              <IonLabel>
                <h2>{item.name}</h2>
                <p>Expiry Date: {item.expiry_date}</p>
                <p>Price: Rs. {item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </IonLabel>
              <IonInput
                type="number"
                placeholder="Quantity"
                onIonInput={(e) => {
                  const quantity = parseInt((e.target as HTMLInputElement).value);
                  addToCart(item, quantity);
                }}
              />
              <IonButton onClick={() => addToCart(item, 1)}>+</IonButton>
            </IonItem>
          ))}
        </IonList>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default Search;
