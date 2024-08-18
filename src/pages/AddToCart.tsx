import {
  IonHeader,
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonTitle,
  IonText,
  IonFooter,
  IonToast
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './AddToCart.css';

interface RouteState {
  pharmacyName?: string;
}

const AddToCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [pharmacyName, setPharmacyName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [gstRate, setGstRate] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const location = useLocation();
  const state = location.state as RouteState | undefined;
  const initialPharmacyName = state?.pharmacyName || '';

  useEffect(() => {
    setPharmacyName(initialPharmacyName);
  }, [initialPharmacyName]);

  useEffect(() => {
    const fetchCartItems = () => {
      if (pharmacyName) {
        const storedCartItems = localStorage.getItem(`cartItems_${pharmacyName}`);
        if (storedCartItems) {
          try {
            const parsedItems = JSON.parse(storedCartItems);
            if (Array.isArray(parsedItems)) {
              const itemsWithDiscount = parsedItems.map(item => ({
                ...item,
                discount: item.discount || 0
              }));
              setCartItems(itemsWithDiscount);
            } else {
              console.error("Cart items format is incorrect.");
            }
          } catch (e) {
            console.error("Error parsing cart items:", e);
          }
        }
      }
    };

    fetchCartItems();
  }, [pharmacyName]);

  const applyDiscount = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  const calculateTotal = (items: any[], withDiscount: boolean) =>
    items.reduce((total, item) => {
      const price = withDiscount ? applyDiscount(item.price, item.discount) : item.price;
      return total + price * item.quantity;
    }, 0);

  const cartItemsByType = (type: string) =>
    cartItems.filter(item => item.type === type);

  const medicinesTotalWithDiscount = calculateTotal(cartItemsByType("medicines"), true);
  const medicinesTotalWithoutDiscount = calculateTotal(cartItemsByType("medicines"), false);

  const generalItemsTotalWithDiscount = calculateTotal(cartItemsByType("general_items"), true);
  const generalItemsTotalWithoutDiscount = calculateTotal(cartItemsByType("general_items"), false);

  const gstAmountWithDiscount = (medicinesTotalWithDiscount + generalItemsTotalWithDiscount) * gstRate / 100;
  const finalTotalWithDiscount = medicinesTotalWithDiscount + generalItemsTotalWithDiscount + gstAmountWithDiscount;

  const gstAmountWithoutDiscount = (medicinesTotalWithoutDiscount + generalItemsTotalWithoutDiscount) * gstRate / 100;
  const finalTotalWithoutDiscount = medicinesTotalWithoutDiscount + generalItemsTotalWithoutDiscount + gstAmountWithoutDiscount;

  const handleSave = () => {
    if (pharmacyName) {
      localStorage.setItem(`cartItems_${pharmacyName}`, JSON.stringify(cartItems));
      setToastMessage("Saved successfully.");
      setShowToast(true);
    } else {
      setToastMessage("Pharmacy Name is required.");
      setShowToast(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    setToastMessage("Shared successfully.");
    setShowToast(true);
  };

  const handleRemove = (index: number) => {
    // Create a new array excluding the item at the given index
    const updatedCartItems = cartItems.filter((_, i) => i !== index);

    // Update the cartItems state and localStorage with the new array
    setCartItems(updatedCartItems);
    localStorage.setItem(`cartItems_${pharmacyName}`, JSON.stringify(updatedCartItems));
  };

  return (
    <IonPage>
      <IonHeader className='headercls'>
        <IonTitle>Cart</IonTitle>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem className="itemcls">
          <IonLabel className="labelcls">Pharmacy Name:</IonLabel>
          <IonInput value={pharmacyName} onIonChange={(e) => setPharmacyName(e.detail.value as string)} />
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel className="labelcls">Dr. Name:</IonLabel>
          <IonInput value={doctorName} onIonChange={(e) => setDoctorName(e.detail.value as string)} />
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel className="labelcls">Patient Name:</IonLabel>
          <IonInput value={patientName} onIonChange={(e) => setPatientName(e.detail.value as string)} />
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel className="labelcls">Date:</IonLabel>
          <IonText className="date-text">{new Date().toLocaleDateString()}</IonText>
        </IonItem>
        <IonItem className="itemcls">
          <IonLabel className="labelcls">GST No:</IonLabel>
          <IonInput value={gstNo} onIonChange={(e) => setGstNo(e.detail.value as string)} />
        </IonItem>

        <div className="items-section">
          <div className="section-header">
            <IonLabel className="labelcls">Medicines</IonLabel>
          </div>
          <div className="header-row">
            <div className="header-cell">S.No</div>
            <div className="header-cell">Name</div>
            <div className="header-cell">Quantity</div>
            <div className="header-cell">Batch No</div>
            <div className="header-cell">Price</div>
            <div className="header-cell">Discount (%) / Price</div>
          </div>

          {cartItemsByType("medicines").length === 0 ? (
            <div className="no-items">
              <IonLabel className="labelcls">No items found</IonLabel>
            </div>
          ) : (
            <div className="items-list">
              {cartItemsByType("medicines").map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-cell">
                    {index + 1}
                    <IonButton
                      className="remove-button"
                      color="danger"
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </IonButton>
                  </div>
                  <div className="item-cell">{item.name}</div>
                  <div className="item-cell">
                    <IonInput
                      type="number"
                      value={item.quantity}
                      onIonChange={(e) => {
                        const newQuantity = Number(e.detail.value);
                        setCartItems(prevItems =>
                          prevItems.map((prevItem, i) =>
                            i === index
                              ? { ...prevItem, quantity: newQuantity }
                              : prevItem
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="item-cell">{item.batch_no}</div>
                  <div className="item-cell">{item.price} ₹</div>
                  <div className="item-cell">
                    <IonInput
                      type="number"
                      value={item.discount}
                      onIonChange={(e) => {
                        const newDiscount = Number(e.detail.value);
                        setCartItems(prevItems =>
                          prevItems.map((prevItem, i) =>
                            i === index
                              ? { ...prevItem, discount: newDiscount }
                              : prevItem
                          )
                        );
                      }}
                    />
                    <div>{applyDiscount(item.price, item.discount)} ₹</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="total-row">
            <IonLabel className="labelcls">Total:</IonLabel>
            <IonText className="total-text">{finalTotalWithDiscount} ₹</IonText>
          </div>
        </div>

        <div className="items-section">
          <div className="section-header">
            <IonLabel className="labelcls">General Items</IonLabel>
          </div>
          <div className="header-row">
            <div className="header-cell">S.No</div>
            <div className="header-cell">Name</div>
            <div className="header-cell">Quantity</div>
            <div className="header-cell">Price</div>
            <div className="header-cell">Discount (%) / Price</div>
          </div>

          {cartItemsByType("general_items").length === 0 ? (
            <div className="no-items">
              <IonLabel className="labelcls">No items found</IonLabel>
            </div>
          ) : (
            <div className="items-list">
              {cartItemsByType("general_items").map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-cell">
                    {index + 1}
                    <IonButton
                      className="remove-button"
                      color="danger"
                      onClick={() => handleRemove(index)}
                    >
                      Remove
                    </IonButton>
                  </div>
                  <div className="item-cell">{item.name}</div>
                  <div className="item-cell">
                    <IonInput
                      type="number"
                      value={item.quantity}
                      onIonChange={(e) => {
                        const newQuantity = Number(e.detail.value);
                        setCartItems(prevItems =>
                          prevItems.map((prevItem, i) =>
                            i === index
                              ? { ...prevItem, quantity: newQuantity }
                              : prevItem
                          )
                        );
                      }}
                    />
                  </div>
                  <div className="item-cell">{item.price} ₹</div>
                  <div className="item-cell">
                    <IonInput
                      type="number"
                      value={item.discount}
                      onIonChange={(e) => {
                        const newDiscount = Number(e.detail.value);
                        setCartItems(prevItems =>
                          prevItems.map((prevItem, i) =>
                            i === index
                              ? { ...prevItem, discount: newDiscount }
                              : prevItem
                          )
                        );
                      }}
                    />
                    <div>{applyDiscount(item.price, item.discount)} ₹</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="total-row">
            <IonLabel className="labelcls">Total:</IonLabel>
            <IonText className="total-text">{finalTotalWithDiscount} ₹</IonText>
          </div>
        </div>
      </IonContent>
      <IonFooter className="footercls">
        <IonButton expand="full" onClick={handleSave}>Save</IonButton>
        <IonButton expand="full" onClick={handlePrint}>Print</IonButton>
        <IonButton expand="full" onClick={handleShare}>Share</IonButton>
      </IonFooter>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={2000}
      />
    </IonPage>
  );
};

export default AddToCart;
