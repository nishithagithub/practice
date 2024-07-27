import React from 'react';
import { IonPage, IonHeader, IonFooter, IonText, IonButton, IonContent, IonRow, IonCol, IonGrid, IonImg } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { RouteState } from './types'; // Adjust the import path based on where you define your types
import './Add.css';

const Add: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  
  const state = location.state as RouteState | undefined;
  const pharmacyName = state?.pharmacyName || '';
  console.log(pharmacyName);

  const handleBackToHomePage = () => {
    history.push({
      pathname: '/',
      state: { pharmacyName }
    });
  };

  const navigateToMedicines = () => {
    history.push({
      pathname: `/add/medicines/${pharmacyName.replace(/\s+/g, '_')}`,
      state: { pharmacyName }
    });
  };

  const navigateToGeneralItems = () => {
    history.push({
      pathname: `/add/general-items/${pharmacyName.replace(/\s+/g, '_')}`,
      state: { pharmacyName }
    });
  };

  return (
    <IonPage>
      <IonHeader className='headercls'>
        Add Menu
      </IonHeader>
      <IonContent>
        <IonGrid className="custom-grid1">
          <IonRow className='custom-row1'>
            <IonCol className="custom-col1 col-margin">
              <IonImg src="https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="box-image"/>
              <IonButton className='full-link' onClick={navigateToMedicines}>Medicines</IonButton>
            </IonCol>
            <IonCol className="custom-col1 col-margin">
              <IonImg src="https://images.pexels.com/photos/3875083/pexels-photo-3875083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className='box-image'/>
              <IonButton className='full-link' onClick={navigateToGeneralItems}>General Items</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div className="medblock">
          <IonButton shape="round" color="light">Show</IonButton>
        </div>
        <div className="genblock">
          <IonButton shape="round" color="light" onClick={handleBackToHomePage}>Back</IonButton>
        </div>
      </IonContent>
      <IonFooter className='footer'>
        <IonText>Contact Us : 9010203040</IonText>
        <IonText>Email : abc@gmail.com</IonText>
      </IonFooter>
    </IonPage>
  );
};

export default Add;
