// import React from 'react';
// import { IonPage, IonHeader, IonFooter , IonText, IonToolbar, IonTitle,IonButton, IonContent,IonRow,IonCol,IonGrid,IonRouterLink,IonImg} from '@ionic/react';
// import './Add.css';
// const Add: React.FC = () => (
//   <IonPage>
//     <IonHeader className='headercls'>
//       Add Menu
//     </IonHeader>
//     <IonContent>
//     <IonGrid className="custom-grid1">
//           <IonRow className='custom-row1'>
//             <IonCol className="custom-col1 col-margin">
//             <IonImg src="https://images.pexels.com/photos/593451/pexels-photo-593451.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className="box-image"/>
            
//               <IonRouterLink className='full-link' routerLink="/med">Medicines</IonRouterLink>
//             </IonCol>
//             <IonCol className="custom-col1 col-margin">
//             <IonImg src="https://images.pexels.com/photos/3875083/pexels-photo-3875083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className='box-image'/>
            
//               <IonRouterLink className='full-link' routerLink="/general">General Items</IonRouterLink>
//             </IonCol>
//           </IonRow>
          
//         </IonGrid>
        
//          <div className="medblock">
//             <IonButton shape="round" color="light">Show</IonButton>
//         </div>
//         <div className="genblock">
//             <IonButton shape="round" color="light">Back</IonButton>
//         </div>
         
        
        
        
//          </IonContent>
         
//          <IonFooter className='footer'>
//         <IonText>Contact Us : 9010203040</IonText>
//         <IonText>Email : abc@gmail.com</IonText>
//       </IonFooter>
//   </IonPage>
// );

// export default Add;

import React from 'react';
import { IonPage, IonHeader, IonFooter, IonText, IonToolbar, IonTitle, IonButton, IonContent, IonRow, IonCol, IonGrid, IonRouterLink, IonImg } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Add.css';

const Add: React.FC = () => {
  const history = useHistory();

  const handleBackToHomePage = () => {
    history.push('/');
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
              <IonRouterLink className='full-link' routerLink="/add/medicines">Medicines</IonRouterLink>
            </IonCol>
            <IonCol className="custom-col1 col-margin">
              <IonImg src="https://images.pexels.com/photos/3875083/pexels-photo-3875083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className='box-image'/>
              <IonRouterLink className='full-link' routerLink="/general">General Items</IonRouterLink>
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
