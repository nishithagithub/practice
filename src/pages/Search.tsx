import {
  IonHeader,
  IonPage,
  IonContent,
  IonItem,
  IonButton,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToast,
  IonTitle,
  IonList,
  IonListHeader,
} from "@ionic/react";
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import useSQLiteDB from "../composables/useSQLiteDB";

const Search: React.FC = () => {
  const [searchType, setSearchType] = useState<"medicines" | "generalItems">("medicines");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inputRef = useRef<HTMLIonInputElement>(null);

  const { performSQLAction } = useSQLiteDB();
  const history = useHistory();

  useEffect(() => {
    setSearchResults([]);
    setSearchText("");
  }, [searchType]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        searchItems();
      }
    };

    const inputElement = inputRef.current?.getInputElement();
    inputElement?.then(element => {
      element?.addEventListener("keydown", handleKeyPress);
    });

    return () => {
      inputElement?.then(element => {
        element?.removeEventListener("keydown", handleKeyPress);
      });
    };
  }, [searchText]);

  const searchItems = async () => {
    if (!searchText.trim()) {
      setToastMessage("Please enter a search term.");
      setShowToast(true);
      return;
    }

    await performSQLAction(async (db) => {
      const query = `SELECT * FROM ${searchType} WHERE name LIKE ?`;
      const results = await db?.query(query, [`%${searchText}%`]);
      const items = results?.values ?? [];

      if (items.length === 0) {
        setToastMessage("No results found.");
        setShowToast(true);
      }

      setSearchResults(items);
      setSuggestions([]);
    });
  };

  const fetchSuggestions = async (text: string) => {
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    await performSQLAction(async (db) => {
      const query = `SELECT name FROM ${searchType} WHERE name LIKE ? LIMIT 5`;
      const results = await db?.query(query, [`${text}%`]);
      const items = results?.values ?? [];
      setSuggestions(items);
    });
  };

  const addToCart = async (item: any, quantity: number = 1) => {
    if (quantity <= 0 || quantity > item.quantity) {
      setToastMessage("Invalid quantity.");
      setShowToast(true);
      return;
    }

    await performSQLAction(async (db) => {
      let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      // Check if the item already exists in the cart under the correct category
      const cartItemIndex = cartItems.findIndex((cartItem: any) =>
        cartItem.id === item.id && cartItem.type === searchType
      );

      if (cartItemIndex > -1) {
        // Item already in cart, increment quantity
        cartItems[cartItemIndex].quantity += quantity;
      } else {
        // New item to add to cart
        const newItem = { ...item, quantity, type: searchType };
        cartItems.push(newItem);
      }

      const newQuantity = item.quantity - quantity;
      if (newQuantity < 0) {
        setToastMessage("Invalid quantity.");
        setShowToast(true);
        return;
      }
      await db?.query(`UPDATE ${searchType} SET quantity = ? WHERE id = ?`, [newQuantity, item.id]);

      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      setToastMessage("Item added to cart.");
      setShowToast(true);

      // Update local state to reflect the new quantity
      setSearchResults(prevResults =>
        prevResults.map(result =>
          result.id === item.id ? { ...result, quantity: newQuantity } : result
        )
      );

      // Clear input field
      const inputElement = document.getElementById(`quantity-${item.id}`) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
    });
  };

  const goToCart = () => {
    history.push('/add-to-cart');
  };

  return (
    <IonPage>
      <IonHeader className='pgcolor'>
        <div className="hd-button">
          <IonTitle>Search</IonTitle>
          <IonButton shape="round" color="light" onClick={goToCart}>Cart</IonButton>
        </div>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonItem className="itemcls">
          <IonLabel className="labelcls">Type</IonLabel>
          <IonSelect
            value={searchType}
            onIonChange={(e) => setSearchType(e.detail.value as "medicines" | "generalItems")}
          >
            <IonSelectOption value="medicines">Medicines</IonSelectOption>
            <IonSelectOption value="generalItems">General Items</IonSelectOption>
          </IonSelect>
        </IonItem>
        <div className="form-container">
          <IonItem className="itemcls">
            <IonInput
              type="text"
              placeholder="Search by name"
              value={searchText}
              onIonInput={(e) => {
                const value = e.detail.value as string;
                setSearchText(value);
                fetchSuggestions(value);
              }}
              ref={inputRef}
            />
            <IonButton color="light" onClick={searchItems}>Search</IonButton>
          </IonItem>
        </div>
        {suggestions.length > 0 && (
          <IonList>
            <IonListHeader>
              <IonLabel>Searching for...</IonLabel>
            </IonListHeader>
            {suggestions.map((suggestion, index) => (
              <IonItem key={index} onClick={() => {
                setSearchText(suggestion.name);
                setSuggestions([]);
                searchItems();
              }}>
                <IonLabel>{suggestion.name}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
        <div className="listcls">
          {searchResults.map((item) => (
            <div key={item.id} className="itemcls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Type:</strong> {searchType}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                {searchType === "medicines" && (
                  <>
                    <p><strong>Expiry Date:</strong> {item.expiry_date}</p>
                    <p><strong>Batch No:</strong> {item.batch_no}</p>
                  </>
                )}
                <p><strong>Price:</strong> Rs. {item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IonInput
                  type="number"
                  placeholder="Quantity"
                  id={`quantity-${item.id}`}
                />
                <IonButton color="light" onClick={() => {
                  const inputElement = document.getElementById(`quantity-${item.id}`) as HTMLInputElement;
                  const quantity = parseInt(inputElement.value) || 1;
                  addToCart(item, quantity);
                }}>Add to Cart</IonButton>
              </div>
            </div>
          ))}
        </div>
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
