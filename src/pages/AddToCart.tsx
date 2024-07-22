import {
    IonHeader,
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonTitle,
    IonToast,
    IonText,
    IonFooter
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import './AddToCart.css'; // Import a CSS file for styling

const AddToCart: React.FC = () => {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [pharmacyName, setPharmacyName] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [patientName, setPatientName] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [gstRate, setGstRate] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        setCartItems(storedCartItems.map((item: { discount: any; }) => ({
            ...item,
            discount: item.discount || 0 // Ensure discount is always present
        })));
    }, []);

    const applyDiscount = (price: number, discount: number) => {
        return price - (price * discount / 100);
    };

    const calculateTotal = (items: any[]) => 
        items.reduce((total, item) => total + applyDiscount(item.price, item.discount) * item.quantity, 0);

    const cartItemsByType = (type: string) => 
        cartItems.filter(item => item.type === type);

    const medicinesTotal = calculateTotal(cartItemsByType("medicines"));
    const generalItemsTotal = calculateTotal(cartItemsByType("generalItems"));

    const gstAmount = (medicinesTotal + generalItemsTotal) * gstRate / 100;
    const finalTotal = medicinesTotal + generalItemsTotal + gstAmount;

    const handleSave = () => {
        setToastMessage("Saved successfully.");
        setShowToast(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        setToastMessage("Shared successfully.");
        setShowToast(true);
    };

    const handleRemove = (id: string) => {
        const updatedCartItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
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
                                <div key={item.id} className="item-row">
                                    <div className="item-cell">
                                        {index + 1}
                                        <IonButton 
                                            className="remove-button" 
                                            color="danger" 
                                            onClick={() => handleRemove(item.id)}
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
                                                        prevItem.id === item.id
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
                                                        prevItem.id === item.id
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
                        <IonText className="total-amount">{medicinesTotal} ₹</IonText>
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
                        <div className="header-cell">Batch No</div>
                        <div className="header-cell">Price</div>
                        <div className="header-cell">Discount (%) / Price</div>
                    </div>
                    {cartItemsByType("generalItems").length === 0 ? (
                        <div className="no-items">
                            <IonLabel className="labelcls">No items found</IonLabel>
                        </div>
                    ) : (
                        <div className="items-list">
                            {cartItemsByType("generalItems").map((item, index) => (
                                <div key={item.id} className="item-row">
                                    <div className="item-cell">
                                        {index + 1}
                                        <IonButton 
                                            className="remove-button" 
                                            color="danger" 
                                            onClick={() => handleRemove(item.id)}
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
                                                        prevItem.id === item.id
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
                                                        prevItem.id === item.id
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
                        <IonText className="total-amount">{generalItemsTotal} ₹</IonText>
                    </div>
                </div>

                <IonItem className="itemcls">
                    <IonLabel className="labelcls">GST Rate (%):</IonLabel>
                    <IonInput
                        type="number"
                        value={gstRate}
                        onIonChange={(e) => setGstRate(Number(e.detail.value))}
                    />
                </IonItem>
                <IonItem className="itemcls">
                    <IonLabel className="labelcls">Grand Total:</IonLabel>
                    <IonText>{finalTotal} ₹</IonText>
                </IonItem>

                <IonButton color="light" onClick={handleSave}>Save</IonButton>
                <IonButton color="light" onClick={handlePrint}>Print</IonButton>
                <IonButton color="light" onClick={handleShare}>Share</IonButton>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                />
            </IonContent>
            <IonFooter className='footer'>
                <IonText>Contact Us : 9010203040</IonText>
                <IonText>Email : abc@gmail.com</IonText>
            </IonFooter>


                {/* <div className="footer">
                    <IonLabel className="labelcls">GST Amount:</IonLabel>
                    <IonText className="total-amount">{gstAmount} ₹</IonText>
                </div>

                <div className="footer">
                    <IonLabel className="labelcls">Final Total:</IonLabel>
                    <IonText className="total-amount">{finalTotal} ₹</IonText>
                </div>
            </IonContent>
            <IonFooter className='footer'>
                <IonButton onClick={handleSave}>Save</IonButton>
                <IonButton onClick={handlePrint}>Print</IonButton>
                <IonButton onClick={handleShare}>Share</IonButton>
            </IonFooter>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            /> */}
        </IonPage>
    );
};

export default AddToCart;
